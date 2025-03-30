# Todo Application API

This is a simple Todo application API using Express, Prisma, and JWT authentication.

## Setup

### 1️⃣ Database Migration

After setting up your database URL in the `.env` file, run the following commands to set up your database:

```sh
npx prisma migrate reset
npx prisma migrate dev --name init
npx prisma generate
```

### 2️⃣ Start the Server

```sh
npx ts-node src/index.ts
# or
npm run dev
```

## API Endpoints

### 3️⃣ User Sign-up
**Method:** `POST`
**URL:** `http://localhost:3000/signup`

#### Request Body:
```json
{
  "username": "testuser",
  "password": "password123"
}
```

#### Expected Response:
```json
{
  "message": "User created",
  "userId": 1
}
```

---

### 4️⃣ User Sign-in
**Method:** `POST`
**URL:** `http://localhost:3000/signin`

#### Request Body:
```json
{
  "username": "testuser",
  "password": "password123"
}
```

#### Expected Response:
```json
{
  "token": "your-jwt-token-here"
}
```
**Note:** Copy the token as it is required for authentication in future requests.

---

### 5️⃣ Add a Todo
**Method:** `POST`
**URL:** `http://localhost:3000/todo`

#### Headers:
```sh
Authorization: Bearer your-jwt-token-here
```

#### Request Body:
```json
{
  "heading": "Complete Project",
  "body": "Finish the Express & Prisma API",
  "status": "pending"
}
```

#### Expected Response:
```json
{
  "id": 1,
  "heading": "Complete Project",
  "body": "Finish the Express & Prisma API",
  "status": "pending",
  "userId": 1,
  "createdAt": "2025-03-30T12:00:00.000Z"
}
```

---

### 6️⃣ Get All Todos
**Method:** `GET`
**URL:** `http://localhost:3000/todos`

#### Headers:
```sh
Authorization: Bearer your-jwt-token-here
```

#### Expected Response:
```json
[
  {
    "id": 1,
    "heading": "Complete Project",
    "body": "Finish the Express & Prisma API",
    "status": "pending",
    "userId": 1,
    "createdAt": "2025-03-30T12:00:00.000Z"
  }
]
```

---

### 7️⃣ Update a Todo
**Method:** `PUT`
**URL:** `http://localhost:3000/todo/1`

#### Headers:
```sh
Authorization: Bearer your-jwt-token-here
```

#### Request Body:
```json
{
  "status": "completed"
}
```

#### Expected Response:
```json
{
  "id": 1,
  "heading": "Complete Project",
  "body": "Finish the Express & Prisma API",
  "status": "completed",
  "userId": 1,
  "createdAt": "2025-03-30T12:00:00.000Z"
}
```

---

### 8️⃣ Delete a Todo
**Method:** `DELETE`
**URL:** `http://localhost:3000/todo/1`

#### Headers:
```sh
Authorization: Bearer your-jwt-token-here
```

#### Expected Response:
```json
{
  "message": "Todo deleted"
}
```

---

## Notes
- Ensure your `.env` file contains the correct `DATABASE_URL` and `JWT_SECRET` values.
- Use Prisma Studio (`npx prisma studio`) to visualize your database records.
- Replace `your-jwt-token-here` with the actual token received after signing in.


