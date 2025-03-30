import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

dotenv.config();
const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET as string;

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

// Extend Request type to include `user`
interface AuthRequest extends Request {
  user?: { userId: number };
}

// Generate JWT Token
const generateToken = (userId: number): string =>
  jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1h" });

// Middleware to verify JWT
const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      res.status(403).json({ error: "Forbidden: Invalid Token" });
      return;
    }
    req.user = decoded as { userId: number };
    next();
  });
};

// Sign-up
app.post("/signup", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: { username, password: hashedPassword },
    });
    res.json({ message: "User created", userId: user.id });
  } catch (error) {
    res.status(400).json({ error: "Username already exists" });
  }
});

// Sign-in
app.post("/signin", async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;
  const user = await prisma.user.findUnique({ where: { username } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const token = generateToken(user.id);
  res.json({ token });
});

// Create a todo
app.post(
  "/todo",
  authenticateToken,
  async (req: AuthRequest, res: Response): Promise<void> => {
    if (!req.user) {
      res.sendStatus(401);
      return;
    }

    const { heading, body, status } = req.body;

    const todo = await prisma.todo.create({
      data: {
        heading,
        body,
        status: status || "pending",
        userId: req.user.userId,
      },
    });

    res.json(todo);
  },
);

// Get all todos for the user
app.get(
  "/todos",
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      res.sendStatus(401);
      return;
    }
    const todos = await prisma.todo.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: "desc" },
    });

    res.json(todos);
  },
);

// Update a todo status
app.put(
  "/todo/:id",
  authenticateToken,
  async (req: AuthRequest, res: Response): Promise<void> => {
    if (!req.user) {
      res.sendStatus(401);
      return;
    }
    const { status } = req.body;

    if (!status) {
      res.status(400).json({ error: "Status is required" });
      return;
    }

    const todo = await prisma.todo.update({
      where: { id: parseInt(req.params.id), userId: req.user.userId }, // Directly use the unique identifiers
      data: { status },
    });

    res.json(todo);
  },
);

// Delete a todo
app.delete(
  "/todo/:id",
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      res.sendStatus(401);
      return;
    }
    await prisma.todo.delete({
      where: {
        id: parseInt(req.params.id),
        userId: req.user.userId,
      }, // Use direct unique keys
    });

    res.json({ message: "Todo deleted" });
  },
);

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
