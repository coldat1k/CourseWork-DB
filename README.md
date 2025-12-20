# Cinema Booking System

A web-based application for online movie ticket booking, built with **Node.js**, **Express**, **Prisma ORM**, **PostgreSQL**, and **Docker**. This project ensures a complete ticket purchasing cycle with data integrity guarantees.

> **Coursework by Student Yurii Savytskyi, Group IM-44**

---

## 🚀 Key Features

* **Movie & Genre Management**
  Many-to-Many (`M-N`) relationship support between Movies and Genres via the `MOVIE_GENRE` pivot table.
* **Interactive Hall Layout**
  Modeling of Halls (`HALL`) and specific Seats (`SEAT`) mapped to rows and numbers.
* **Smart Booking System**
  Transactional creation of `BOOKING` and `TICKET` records. Prevents double-booking using unique database constraints (`UQ_Ticket`).
* **Customer Management**
  User registration with **Soft Delete** support (using `is_active` boolean and `deleted_at` timestamp).
* **Showing Scheduling**
  Session scheduling with automatic conflict detection within the same hall (`UQ_HallTime`).

---

## 🛠 Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** PostgreSQL 16
* **ORM:** Prisma (Schema-first design)
* **Containerization:** Docker, Docker Compose
* **Testing:** Jest (Integration tests)

---

## 🗄 Database Schema

The project uses a relational database designed with the following entities:

| Model | Description |
| :--- | :--- |
| **CUSTOMER** | Clients. Supports logical deletion (`is_active`). |
| **MOVIE** | Movies (Title, Duration, Rating). |
| **GENRE** | Genre dictionary. |
| **MOVIE_GENRE** | Pivot table for Many-to-Many relationship between Movies and Genres. |
| **HALL** | Cinema halls. |
| **SEAT** | Physical seats (Row, Number). Unique index per hall. |
| **SHOWING** | Movie sessions (Links Movie, Hall, and Time). |
| **BOOKING** | Customer orders (Total amount, Date). |
| **TICKET** | Individual tickets (Links Booking, Session, and Seat). |

---

## ⚙️ Installation & Setup

### 1. Prerequisites
* Docker & Docker Compose
* Node.js (v18+)

### 2. Environment Configuration
Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://user:password@db:5432/cinema_db?schema=public"
