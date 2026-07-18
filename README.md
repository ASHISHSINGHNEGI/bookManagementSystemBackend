# Book Store Management System (Backend API)

A robust, type-safe, and production-ready RESTful API built using Node.js / Express, TypeScript, and Prisma ORM with PostgreSQL. It provides comprehensive backend services for user authentication, book catalog management, nested category hierarchies, user favorites, and administrator dashboard analytics.

---

## 🚀 Features

### 🔐 Authentication & Security
- **Secure JWT Flow**: Short-lived Access Tokens via HTTP headers + long-lived Refresh Tokens stored in the database for secure session extension.
- **Password Hashing**: Industry-standard encryption using `bcrypt` (12 rounds).
- **Role-Based Access Control (RBAC)**: Route middleware restricts sensitive operations (e.g., Book and Category modification, analytics) to users with the `admin` role.

### 📚 Book Catalog Management
- **Browsing**: Public endpoints to query and fetch all books or specific book details.
- **Search, Filter & Sort**: Flexible query parameters for filtering by category, searching by keywords, and sorting by title, author, or creation date.
- **Admin CRUD**: Full control for admins to add, edit, and soft-delete books (`isDeleted` flag prevents accidental record loss).

### 🏷️ Hierarchical Category System
- **Nested Categories**: A parent-child mapping allowing for unlimited categorization depth (e.g., `Fiction -> Romance -> Historical`).
- **Flexible Management**: Categories are browsable by all users, with creation and modifications restricted to admins.

### 💖 Personal Favorites Library
- **User Library**: Authenticated users can bookmark books and sync their personal favorites directly to the database.

### 📊 Admin Analytics
- **Favorites Report**: Admin dashboard stats highlighting which books are bookmarked/favorited most frequently.

---

## 🛠️ Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/) or [Bun](https://bun.sh/) (configured out of the box)
- **Framework**: [Express.js](https://expressjs.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database ORM**: [Prisma](https://www.prisma.io/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Security**: [JSON Web Tokens (JWT)](https://jwt.io/), [Bcrypt](https://github.com/kelektiv/node.bcrypt.js)
- **CORS & Helpers**: `cors`, `cookie-parser`, `dotenv`

---

## 🔑 Demo Credentials

After seeding the database, you can use these default accounts for authentication:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@bookstore.com` | `Admin@123` |
| **User** | `user@bookstore.com` | `User@123` |

---

## 🏃 Getting Started

### 📋 Prerequisites
Ensure you have the following installed:
- Node.js (v18.x or later) or Bun
- PostgreSQL database instance

### 1️⃣ Environment Setup
Copy the `.env.example` file to `.env` in the root of the backend directory:

```bash
cp .env.example .env
```

Configure your environment variables:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<dbname>?schema=public
JWT_ACCESS_SECRET=your-access-secret-change-in-production
JWT_REFRESH_SECRET=your-refresh-secret-change-in-production
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
BCRYPT_ROUNDS=12
ALLOWED_ORIGINS=http://localhost:4000
```
> [!NOTE]
> Make sure `ALLOWED_ORIGINS` includes the URL of your frontend application (e.g., `http://localhost:4000` or `http://localhost:3000`).

### 2️⃣ Install Dependencies
```bash
npm install
# or if using Bun (recommended)
bun install
```

### 3️⃣ Run Database Migrations & Seeding
Deploy database schemas and seed the initial data:

```bash
# Generate Prisma Client
npm run prisma:generate

# Run DB Migrations
npm run prisma:migrate

# Seed DB (Creates Roles, Users, Categories, and Books)
npm run seed
```

### 4️⃣ Start Development Server
```bash
npm run dev
# or if using Bun
bun dev
```
The server will start on [http://localhost:3000](http://localhost:3000). You can check its health status at `/health`.

---

## 📁 Project Structure

```text
src/
├── config/             # Database and application environment variables configurations
├── errors/             # Custom application-wide error classes (e.g. NotFoundError)
├── middleware/         # Express middlewares (auth, RBAC, Zod-like validators, error handlers)
├── modules/            # Domain-driven feature modules
│   ├── admin/          # Admin reporting endpoints & controllers
│   ├── auth/           # User authentication routes, services, and tokens controllers
│   ├── books/          # Book CRUD routes, controllers, services, & validators
│   ├── categories/     # Parent-child category routes & logic
│   └── favorites/      # User favorites library management
├── types/              # Global TypeScript declarations
├── utils/              # General helper files (validators, token helpers)
├── app.ts              # Core Express app initialization
└── server.ts           # Server port listener & graceful shutdown setup
prisma/
├── schema.prisma       # Prisma database models & relation schema definition
└── seed.ts             # Database seeding logic
```

---

## 🔌 API Endpoints Reference

### 🔐 Authentication (`/api/v1/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/register` | Public | Register a new user account |
| `POST` | `/login` | Public | Authenticate user and receive access & refresh tokens |
| `POST` | `/refresh` | Public | Request a new access token using a refresh token |
| `POST` | `/logout` | User/Admin | Log out and invalidate refresh tokens |

### 📚 Books Catalog (`/api/v1/books`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Public | Get all books (supports category filter, search, & sorting) |
| `GET` | `/:id` | Public | Get book details by ID |
| `POST` | `/` | **Admin Only** | Create a new book |
| `PUT` | `/:id` | **Admin Only** | Update an existing book's details |
| `DELETE` | `/:id` | **Admin Only** | Soft-delete a book |

### 🏷️ Categories (`/api/v1/categories`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Public | Get all categories (including tree structure) |
| `GET` | `/:id` | Public | Get category details by ID |
| `POST` | `/` | **Admin Only** | Create a new category |
| `PUT` | `/:id` | **Admin Only** | Update an existing category |
| `DELETE` | `/:id` | **Admin Only** | Delete a category |

### 💖 Favorites (`/api/v1/favorites`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | User/Admin | Retrieve current user's list of favorite books |
| `POST` | `/:bookId` | User/Admin | Add a book to user's favorites |
| `DELETE` | `/:bookId` | User/Admin | Remove a book from user's favorites |

### 📊 Admin Analytics (`/api/v1/admin`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/reports/favorites` | **Admin Only** | Get analytics on most-favorited books |

---

## 🧪 Testing & Postman Collection
A pre-configured **Postman Collection** is included in the workspace under the `bookManagementSystemAPI` folder to help you test the endpoints instantly. 

- Load `/bookManagementSystemAPI/opencollection.yml` or JSON schema files into your Postman client.
- Select your target environment (e.g. `Localhost`) to auto-populate environment variables like tokens and domain URLs.
