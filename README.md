# TaskManagerApp
## Task Manager App (Angular + Spring Boot + MySQL + JWT + Docker)

Repo layout:
- **`/frontend`**: Angular (Material UI) SPA
- **`/backend`**: Spring Boot REST API (MySQL + JWT)
- **`docker-compose.yml`**: run full stack (bonus)

---

## Features

- **Tasks CRUD**: create, list, edit, delete
- **Status filter**: `TO_DO`, `IN_PROGRESS`, `DONE`
- **Validations**:
  - Title required, max length enforced (frontend + backend)
- **JWT auth (bonus)**:
  - Register + login
  - `/api/tasks/**` protected (Bearer token)
- **Docker (bonus)**: one-command stack

---

## Prerequisites (Local Dev)

- **Node.js**: 20+ (you already have Node installed)
- **Angular CLI**: optional (we use `npx`)
- **Java**: JDK 17+
- **Maven**: 3.9+
- **MySQL**: 8+

If Java/Maven are not installed on your PC:
- Install **JDK 17** (Temurin / Oracle)
- Install **Maven** and ensure `java` + `mvn` work in a new terminal

---

## Run with Docker (Recommended)

From the repo root:

```bash
docker compose up --build
```

Then open:
- **Frontend**: `http://localhost:4200`
- **Backend**: `http://localhost:8080`

Notes:
- MySQL data persists in Docker volume **`mysql_data`**
- CORS is preconfigured for `http://localhost:4200`

---

## Run Locally (Without Docker)

### 1) Start MySQL

Create a database (optional, app can create it if permissions allow):

```sql
CREATE DATABASE task_manager;
```

Default backend DB config (see `backend/src/main/resources/application.yml`):
- DB: `task_manager`
- user: `root`
- pass: `1234`

You can override via environment variables:
- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`

### 2) Start Backend (Spring Boot)

In one terminal:

```bash
cd backend
mvn spring-boot:run
```

Backend runs on `http://localhost:8080`.

### 3) Start Frontend (Angular)

In another terminal:

```bash
cd frontend
npm install
npm start
```

Frontend runs on `http://localhost:4200`.

---

## API Endpoints

Base URL: `http://localhost:8080/api`

### Auth

- **POST** `/auth/register`
- **POST** `/auth/login`

Body:

```json
{ "username": "alice", "password": "secret123" }
```

Response:

```json
{ "token": "JWT_HERE", "username": "alice" }
```

### Tasks (JWT required)

All task routes require:
- `Authorization: Bearer <JWT>`

- **GET** `/tasks`
- **GET** `/tasks/{id}`
- **POST** `/tasks`
- **PUT** `/tasks/{id}`
- **DELETE** `/tasks/{id}`

Create/Update body:

```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, coffee",
  "status": "TO_DO"
}
```

---

## Environment Variables (Backend)

Configured in `backend/src/main/resources/application.yml`:

- **`SERVER_PORT`** (default `8080`)
- **`DB_URL`** (default points to `localhost:3306/task_manager`)
- **`DB_USERNAME`** (default `root`)
- **`DB_PASSWORD`** (default `1234`)
- **`CORS_ALLOWED_ORIGINS`** (default `http://localhost:4200`)
- **`JWT_SECRET`** (**change this in real apps**)
- **`JWT_EXP_MINUTES`** (default `120`)

---

## Screens / Pages

- **`/login`**: login or register
- **`/tasks`**: task list + status filter
- **`/tasks/new`**: create task
- **`/tasks/:id/edit`**: edit task

