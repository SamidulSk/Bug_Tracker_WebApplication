# 🐞 Bug Tracker App – Full Stack (MERN + JWT + AI + Docker)

A comprehensive, developer-friendly **Bug Tracking System**, built with **MERN stack** and enhanced by **AI-powered tag generation**. Designed for teams and developers to report, manage, and track bugs effectively with intuitive UI and seamless backend operations.

---

## 🚀 Features

### 🔐 Authentication

* JWT-based secure login/register
* Auth-protected routes with user-based bug access
* Admin/user role support

### 🐛 Bug Management

* Full **CRUD** operations for bugs
* Fields: `title`, `description`, `status`, `severity`, `tags`
* Smart form handling with unified create/edit mode

### 🏷️ AI-Based Tagging

* Auto-tag bugs using [Groq](https://groq.com) or OpenAI
* Smart context extraction from description
* Manual + AI-assisted tagging system

### 📂 Grouping & Filtering

* Group bugs by `status` or `severity` using tabs/accordion
* Filter by tags, sort bugs, paginate data

### 🔄 Real-time UI Features

* React-based UI with responsive components
* Form reset, editing state, empty message support
* Auto-refresh list after bug updates

---

## 🛠️ Tech Stack

* **Frontend**: React.js, Tailwind CSS, Axios, React Router DOM
* **Backend**: Node.js, Express.js, MongoDB, Mongoose
* **Auth**: JWT, Bcrypt
* **AI**: Groq/OpenAI API (tag generation)
* **Validation**: Zod
* **Containerization**: Docker, Docker Compose

---

## 🐳 Docker Setup

### 📁 Project Structure

```
/frontend → React frontend
/backend → Node.js backend
/docker-compose.yml
```

### ⚙️ Environment Variables

Create `.env` file in `/backend`.

**Backend `.env`:**

```
PORT=4005
MONGODB_URI=my_mongo_uri
JWT_SECRET=my_jwt_secret
GROQ_API_KEY=my_groq_api_key
```

---

## 📄 Docker Commands

**Build and Run:**

```bash
docker-compose up --build
```

---

## 🔗 API Endpoints

### 👤 Auth

```
| Method | Endpoint       | Description         |
|--------|----------------|---------------------|
| POST   | /user/register | Register new user   |
| POST   | /user/login    | Login user          |
| GET    | /user/me       | Get logged-in user  |
```

### 🐞 Bug

```
| Method | Endpoint              | Description      |
|--------|-----------------------|------------------|
| POST   | /bug/createBug        | Create a bug     |
| GET    | /bug/getAllBug        | Get all bugs     |
| PUT    | /bug/updateBug/:id    | Update a bug     |
| DELETE | /bug/deleteBug/:id    | Delete a bug     |
```

### 🧠 Tags

```
| Method | Endpoint          | Description      |
|--------|-------------------|------------------|
| POST   | /tag/generateTag  | Generate AI tags |
```

---

## 📪 Postman Flow

1. Register or login using `/user/register` or `/user/login`.
2. Copy the token from the login response.
3. Add the token to headers:

```
Authorization: Bearer <token>
```

4. Use any protected route (bug or tag-related).

---

## 👨‍💻 Author

**SK Samidul Hossain**
*MERN Stack Developer | Java | DSA | AI Integration*

* 📧 Email: [mrsamidul2002@gmail.com](mailto:mrsamidul2002@gmail.com)
* 🌐 GitHub: [@samidul-hossain](https://github.com/samidul-hossain)
* 📘 LeetCode: [leetcode.com/samidul\_hossain](https://leetcode.com/samidul_hossain)
