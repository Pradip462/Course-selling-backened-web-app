# Course Selling Backend (Node.js)

**Simple, production-ready backend for a course-selling web application.**  
This repository contains the Node.js / Express backend for a course marketplace — user auth, course management, and order/checkout flows (APIs only).

---

## Table of Contents

- [About](#about)  
- [Features](#features)  
- [Tech stack](#tech-stack)  
- [Repository structure](#repository-structure)  
- [API overview (example endpoints)](#api-overview-example-endpoints)  

---

## About

This backend provides REST APIs for managing courses, users and purchases for a course marketplace. It is built with Node.js and Express, follows a modular routes + middleware structure, and is ready to be extended (connected to a front-end).

---

## Features

- User registration & authentication (JWT-based)
- CRUD operations for courses (create, read, update, delete)
- Course search/listing and categories
- Basic order or checkout endpoints (purchase a course)
- Centralized configuration and DB connection module
- Middlewares for auth, error handling, and request validation
- `.env.example` provided for environment variables

---

## Tech stack

- Node.js
- Express
- (Database) — configure your DB in `db.js` (MongoDB)
- JWT for authentication
- dotenv for environment variables
- Other middlewares in `Middlewares/` (CORS, logger, validation, etc.)


---

## Repository structure
/ (root)
├─ index.js             # App entrypoint
├─ db.js                # Database connection
├─ config.js            # App configuration
├─ .env.example         # Example environment variables
├─ routes/              # API routes (users, courses, orders, auth etc.)
├─ Middlewares/         # Reusable middleware (auth, logger, error handler)
├─ package.json
└─ README.md



## API overview (example endpoints)

POST /api/auth/register — Register a new user

POST /api/auth/login — Login (returns JWT)

GET /api/courses — List courses

GET /api/courses/:id — Get course details

POST /api/courses — Create new course (protected)

PUT /api/courses/:id — Update course (protected)

DELETE /api/courses/:id — Delete course (protected)

POST /api/orders — Create purchase / order (protected)

GET /api/users/me — Get current user profile (protected)
