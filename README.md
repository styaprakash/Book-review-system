# 📚 Book Review API

A RESTful API for a Book Review system, built with **Node.js**, **Express.js**, **Prisma ORM**, **PostgreSQL**, and **JWT authentication**.

---

## 🚀 Features

- **User Authentication:** JWT-based signup and login
- **Book Management:** Add, list, and view books with pagination and filtering
- **Review System:** Authenticated users can review books (one review per user per book), update, and delete their reviews
- **Book Search:** Search by title or author (partial/case-insensitive)
- **Secure & Modular:** Clean code structure, environment configs, and best practices

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- JWT (jsonwebtoken)
- bcryptjs (for password hashing)
- dotenv

---

## 📦 Project Structure

book-review-api/
├── prisma/
│ └── schema.prisma
├── src/
│ ├── controllers/
│ ├── middleware/
│ ├── routes/
│ ├── utils/
│ ├── app.js
│ └── server.js
├── .env
├── package.json
└── README.md


---

## ⚡ Setup Instructions

### 1. **Clone the Repository**
git clone https://github.com/yourusername/book-review-api.git
- cd book-review-api


### 2. **Install Dependencies**
- npm install


### 3. **Configure Environment Variables**
Create a `.env` file in the root directory:
- DATABASE_URL="postgresql://<user>:<password>@localhost:5432/book_review?schema=public"
- JWT_SECRET=your_jwt_secret
- PORT=3000


### 4. **Set Up the Database**
- Ensure PostgreSQL is running.
- Create the database:
    - createdb -U <user> book_review


### 5. **Run Prisma Migrations**
npx prisma migrate dev --name init


### 6. **Start the Server**
npm run dev

The API will be available at `http://localhost:3000/`.

---

## 🔥 Example API Requests

### **Signup**
curl -X POST http://localhost:3000/auth/signup
- -H "Content-Type: application/json"
- -d '{"username":"alice","email":"alice@example.com","password":"123456"}'


### **Login**
curl -X POST http://localhost:3000/auth/login
- -H "Content-Type: application/json"
- -d '{"email":"alice@example.com","password":"123456"}'
- _Response:_  { "token": "..." }


### **Add a Book (Authenticated)**
curl -X POST http://localhost:3000/books
- -H "Authorization: Bearer <your_token>"
- -H "Content-Type: application/json"
- -d '{"title":"1984","author":"George Orwell","genre":"Dystopian"}'


### **Get All Books (with filters & pagination)**
curl "http://localhost:3000/books?page=1&limit=5&author=George%20Orwell"


### **Get Book Details**
curl "http://localhost:3000/books/1"


### **Add a Review (Authenticated)**
curl -X POST http://localhost:3000/books/1/reviews
- -H "Authorization: Bearer <your_token>"
- -H "Content-Type: application/json"
- -d '{"rating":5,"comment":"A masterpiece!"}'


### **Update a Review**

curl -X PUT http://localhost:3000/reviews/1
- -H "Authorization: Bearer <your_token>"
- -H "Content-Type: application/json"
- -d '{"rating":4,"comment":"Changed my mind!"}'


### **Delete a Review**
curl -X DELETE http://localhost:3000/reviews/1
- -H "Authorization: Bearer <your_token>"


### **Search Books**
curl "http://localhost:3000/books/search?query=orwell"


---

## 🗂️ Database Schema Design

### **Entities and Relationships**

- **User**
  - `id` (PK)
  - `username` (unique)
  - `email` (unique)
  - `password`
  - (1) User → (M) Review

- **Book**
  - `id` (PK)
  - `title`
  - `author`
  - `genre`
  - `publishedYear`
  - (1) Book → (M) Review

- **Review**
  - `id` (PK)
  - `rating` (1-5)
  - `comment`
  - `userId` (FK → User.id)
  - `bookId` (FK → Book.id)
  - Unique constraint: (`userId`, `bookId`) – a user can only review a book once

---

### **Simple ER Diagram**

+-------+ +---------+ +--------+
| User | 1 M | Review | M 1 | Book |
+-------+---------+---------+---------+--------+
| id | | id | | id |
| email | | rating | | title |
| ... | | comment | | author |
+-------+ | userId | | ... |
| bookId | +--------+
+---------+


- **User** has many **Reviews**
- **Book** has many **Reviews**
- **Review** belongs to one **User** and one **Book**
- Unique (`userId`, `bookId`): one review per user per book

---

### **Prisma Schema Reference**

See [`prisma/schema.prisma`](prisma/schema.prisma):

model User {
id Int @id @default(autoincrement())
username String @unique
email String @unique
password String
reviews Review[]
}

model Book {
id Int @id @default(autoincrement())
title String
author String
genre String?
publishedYear Int?
reviews Review[]
}

model Review {
id Int @id @default(autoincrement())
rating Int
comment String?
user User @relation(fields: [userId], references: [id])
userId Int
book Book @relation(fields: [bookId], references: [id])
bookId Int

@@unique([userId, bookId])
}


---

## 📝 Design Decisions & Assumptions

- **Password Security:** Passwords are hashed using bcryptjs before storage.
- **JWT Authentication:** All protected endpoints require a valid JWT in the `Authorization` header.
- **Pagination:** Implemented for both books and reviews.
- **One Review per User per Book:** Enforced at the DB level.
- **Search:** Case-insensitive, partial matching for both title and author.
- **Error Handling:** Returns appropriate HTTP status codes and error messages.
- **Environment Variables:** All sensitive data is managed via `.env`.

---

## 🧑‍💻 How to Run Locally

1. Clone the repo and install dependencies.
2. Configure your `.env` file.
3. Run `npx prisma migrate dev --name init` to set up the database.
4. Start the server with `npm run dev`.
5. Use Postman or curl to test the endpoints.

---

## 🗂️ Submission Instructions

1. Push your code to a public GitHub repository.
2. Share the repo link as instructed (e.g., via Airtable Form).

---

## 📈 Example Commit Messages

- `chore: initialize Node.js project with Express and Prisma`
- `feat: add Prisma schema for User, Book, and Review`
- `feat: implement user signup and login with JWT`
- `feat: add book CRUD endpoints with pagination and filtering`
- `feat: add review submission, update, and delete endpoints`
- `feat: implement search endpoint for books`
- `chore: add middleware for JWT authentication`
- `docs: add README with setup and API usage instructions`
- `fix: handle errors and edge cases in controllers`
- `refactor: modularize code into controllers and routes`
- `chore: add .env.example and update .gitignore`
- `test: add example curl requests for API testing`

---
