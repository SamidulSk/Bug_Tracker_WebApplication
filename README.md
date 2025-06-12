# ✅ Todo Web App – Backend (MERN + JWT + AI)

A fully-featured, secure backend for a task management system, built with **Node.js**, **Express**, **MongoDB**, and **JWT Authentication**, with advanced features like **AI-powered daily summaries using Groq**, pagination, and sorting.

---

## 🚀 Features

### 🔐 Authentication
- User registration and login with **Zod validation**
- JWT-based token generation and middleware protection
- Secured user routes (`/me`, `/logout`)

### 📝 ToDo Management
- Full CRUD operations (Create, Read, Update, Delete)
- Each task includes: `title`, `description`, `dueDate`, `priority`, `isComplete`

### 📄 Pagination
- `/todo/getTodoList?page=1&limit=10`
- Efficient task loading for large lists

### ↕️ Sorting
- Sort by `dueDate`, `priority`, or `isComplete`
- Example: `/todo/getTodoList?sortBy=priority&order=desc`

### 🤖 AI Summary (via [Groq](https://groq.com))
- Generates daily task summaries from completed tasks
- Stores AI-generated text with `user`, `content`, `date`
- `/summary/generate` → creates summary
- `/summary/history` → fetches all previous summaries

### 📦 Environment-Based Configuration
- All sensitive values (DB URI, JWT, API key) loaded via `.env`

---

## 📁 Tech Stack

- **Node.js + Express.js** – server and API routing
- **MongoDB + Mongoose** – data modeling
- **JWT + Bcrypt** – user security
- **Zod** – input validation
- **Groq (LLaMA 3)** – fast & free AI text generation
- **Postman** – API testing
- **CORS + dotenv** – environment and client-server handling

---

## 🔐 API Endpoints Overview

### 👤 User

| Method | Endpoint        | Description        |
|--------|------------------|--------------------|
| POST   | `/user/register` | Register new user  |
| POST   | `/user/login`    | Login and get token|
| GET    | `/user/me`       | Get current user   |
| GET    | `/user/logout`   | Mock logout        |

### 📝 Todo

| Method | Endpoint               | Description           |
|--------|------------------------|-----------------------|
| POST   | `/todo/createTodo`     | Add new task          |
| GET    | `/todo/getTodoList`    | Fetch tasks with pagination and sorting |
| PUT    | `/todo/updateTodo/:id` | Update a task         |
| DELETE | `/todo/:id`            | Delete a task         |

### 🤖 AI Summary

| Method | Endpoint            | Description               |
|--------|---------------------|---------------------------|
| POST   | `/summary/generate` | Create AI daily summary   |
| GET    | `/summary/history`  | Fetch all summaries       |

---

## 🧪 Sample Postman Flow

1. Register/Login user
2. Copy JWT from login response
3. Send it in headers:  
   `Authorization: Bearer <token>`
4. Use all routes as protected endpoints

---

## 🛠️ .env Example

```env
PORT=4002
MONGODB_URI=mongodb+srv://my_uri
JWT_SECRET=my_jwt_secret
OPENAI_API_KEY=my_groq_api_key
```

---

## 🧠 Author

**SK Samidul Hossain**  
MERN Stack Developer | Java | DSA | AI Integration  
📧 Email: mrsamidul2002@gmail.com  
🌐 GitHub: [samidul-hossain](https://github.com/SamidulSk)  
📘 LeetCode: [leetcode.com/samidul_hossain](https://leetcode.com/u/Sk_786/)
