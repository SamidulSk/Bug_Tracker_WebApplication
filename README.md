# ✅ Todo Web App – Backend (MERN + JWT + AI + Docker)

A fully-featured, secure backend for a task management system, built with **Node.js**, **Express**, **MongoDB**, and **JWT Authentication**, along with **AI-generated summaries using Groq**, pagination, and sorting.

---

## 🚀 Features

### 🔐 Authentication
- Register & login with **Zod validation**
- JWT-based token auth
- Protected user routes (`/me`, `/logout`)

### 📝 Task Management
- Full CRUD operations
- Fields: `title`, `description`, `dueDate`, `priority`, `isComplete`

### 📄 Pagination & Sorting
- `/todo/getTodoList?page=1&limit=10`
- Sorting: `/todo/getTodoList?sortBy=priority&order=desc`

### 🤖 AI Summary
- Uses [Groq](https://groq.com) to generate daily summaries
- `/summary/generate` → create summary
- `/summary/history` → view history

---

## 📦 Tech Stack

- **Node.js + Express** – backend API
- **MongoDB + Mongoose** – database
- **JWT + Bcrypt** – auth
- **Zod** – validation
- **Groq** – AI integration
- **Docker + Docker Compose** – containerization

---

## 🐳 Dockerization Guide

### 🔧 1. `.env` File
Create `.env` in root:

PORT=4001
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

pgsql
Copy
Edit

### 📁 2. Dockerfile

```dockerfile
# Dockerfile

FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4001

CMD ["npm", "run", "dev"]
# docker-compose.yml

version: '3.8'

services:
  backend:
    build: .
    container_name: todo-backend
    ports:
      - "4001:4001"
    env_file:
      - .env
    restart: always
docker build -t todo-backend .
docker run -p 4001:4001 --env-file .env todo-backend
🔐 API Endpoints
👤 User
Method	Endpoint	Description
POST	/user/register	Register new user
POST	/user/login	Login and get token
GET	/user/me	Get current user
GET	/user/logout	Mock logout

📝 Todo
Method	Endpoint	Description
POST	/todo/createTodo	Add new task
GET	/todo/getTodoList	Fetch tasks
PUT	/todo/updateTodo/:id	Update a task
DELETE	/todo/:id	Delete a task

🤖 AI Summary
Method	Endpoint	Description
POST	/summary/generate	Generate daily summary
GET	/summary/history	Fetch summary history

🧪 Postman Test Flow
Register/Login

Copy token from login

Add header:
Authorization: Bearer <token>

Use any protected route

🧠 Author
SK Samidul Hossain
MERN Stack Developer | Java | DSA | AI Integration
📧 Email: mrsamidul2002@gmail.com
🌐 GitHub: samidul-hossain
📘 LeetCode: leetcode.com/samidul_hossain

---
