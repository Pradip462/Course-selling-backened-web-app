# Course Selling Backend (Node.js)

**Simple, production-ready backend for a course-selling web application.**  
This repository contains the Node.js / Express backend for a course marketplace — user auth, course management, and order/checkout flows (APIs only).

---

## Table of Contents

- [About](#about)  
- [Features](#features)  
- [Tech stack](#tech-stack)  
- [Repository structure](#repository-structure)  
- [Getting started (local)](#getting-started-local)  
- [Environment variables](#environment-variables)  
- [Available scripts](#available-scripts)  
- [API overview (example endpoints)](#api-overview-example-endpoints)  
- [Testing](#testing)  
- [Improvements / TODO](#improvements--todo)  
- [License & Contact](#license--contact)

---

## About

This backend provides REST APIs for managing courses, users and purchases for a course marketplace. It is built with Node.js and Express, follows a modular routes + middleware structure, and is ready to be extended (connected to a front-end, payment gateway, or deployed to a cloud provider).

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
- (Database) — configure your DB in `db.js` (MongoDB / MySQL / Postgres supported by changing driver)
- JWT for authentication
- dotenv for environment variables
- Other middlewares in `Middlewares/` (CORS, logger, validation, etc.)

> _Note:_ pick & document the actual DB you used (e.g., MongoDB / PostgreSQL). Update this README accordingly.

---

## Repository structure

