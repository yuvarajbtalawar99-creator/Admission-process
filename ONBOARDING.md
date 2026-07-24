# 🚀 JCER ERP System - Onboarding & Setup Guide

Welcome to the **JCER College ERP System**! This guide will walk you through setting up the project locally on your development machine.

---

## 📋 Prerequisites

Ensure you have the following installed before starting:
- **Node.js**: `v18.0.0` or higher
- **npm**: `v8.0.0` or higher
- **Docker** and **Docker Compose**
- **Git**
- **VS Code** (recommended)

---

## 🛠️ Step-by-Step Local Setup

### 1. Clone the Repository
Clone the project repository to your local machine and navigate to the project root directory:
```bash
git clone https://github.com/vyonlabsofficial-lang/College.git
cd College
```

---

### 2. Install Dependencies
This project is configured as an **npm Workspaces Monorepo**. Installing dependencies at the root will automatically install them for the root, backend, frontend, and all package directories:
```bash
npm install
```

---

### 3. Set Up Environment Variables (`.env`)

You need to create configuration files for both the backend and frontend.

#### **Backend Configuration**
1. Copy the example file to `.env`:
   ```bash
   cp backend/.env.example backend/.env
   ```
2. Open `backend/.env` and verify the database configuration:
   - `DB_HOST=localhost`
   - `DB_PORT=5432`
   - `DB_NAME=college_erp_db`
   - `DB_USER=erp_user`
   - `DB_PASSWORD=erp_password_123`
   - `REDIS_HOST=localhost`
   - `REDIS_PORT=6379`
   - `JWT_SECRET=` (Keep the default or change for development)

#### **Frontend Configuration**
1. Copy the example file to `.env`:
   ```bash
   cp frontend/.env.example frontend/.env
   ```
2. Open `frontend/.env` and verify:
   - `VITE_API_URL=http://localhost:5000/api`
   - `VITE_SOCKET_URL=http://localhost:5000`

---

### 4. Start Infrastructure (PostgreSQL & Redis)
Use Docker Compose from the root directory to spin up the local PostgreSQL database and Redis server:
```bash
docker-compose up -d postgres redis
```

Wait around 10–20 seconds for the containers to fully initialize.

---

### 5. Run Database Migrations & Seeds
With the database running, you need to create the tables and seed initial sample data (admins, faculty, students, etc.).

Run these commands from the project root:
```bash
# Run migrations (creates tables)
npm run migrate --workspace=backend

# Load seed data (creates test accounts, marks, and attendance)
npm run seed --workspace=backend
```

---

### 6. Run the Applications

You can start both the backend API and frontend React app simultaneously using the root monorepo scripts:

#### **Start everything in development mode:**
```bash
npm run dev
```

#### **Start applications individually:**
* **Backend only:** `npm run dev:backend`
* **Frontend only:** `npm run dev:frontend`
* **Admission Portal only:** `npm run dev:admission`

---

## 🌐 Port & Access Points

Once running, you can access the applications and tools at:

| Component | URL / Connection |
| :--- | :--- |
| **Frontend App** | [http://localhost:5173](http://localhost:5173) |
| **Backend API** | [http://localhost:5000](http://localhost:5000) |
| **API Health Check** | [http://localhost:5000/api/health](http://localhost:5000/api/health) |
| **PostgreSQL Database** | Host: `localhost`, Port: `5432`, DB: `college_erp_db` |
| **Redis Cache** | Host: `localhost`, Port: `6379` |

---

## 🔑 Demo Login Accounts

After seeding the database, you can log in with the following default accounts:

* **Admin Account:**
  * **Email:** `admin@college.com`
  * **Password:** `admin123`

* **Principal Account:**
  * **Email:** `principal@college.com`
  * **Password:** `principal123`

---

## 🔍 Troubleshooting

* **Docker container issues / port conflict**:
  If you have a local installation of PostgreSQL or Redis running on ports `5432` or `6379`, stop them before running `docker-compose up`, or update the host port bindings in `docker-compose.yml`.
* **Database connectivity errors**:
  Verify that your backend `.env` file uses `localhost` for `DB_HOST` and not a container hostname, as the Node server is running on the host OS.
