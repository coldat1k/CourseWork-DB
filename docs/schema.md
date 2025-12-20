# Database Schema Documentation

This document describes the structure of the database tables, their purposes, columns, constraints, and relationships within the Cinema Booking System.

---

### Table: `CUSTOMER`

**Purpose:** Stores user profile information for individuals making bookings.

**Columns:**

| Column | Type | Constraints | Description |
|---|---|---|---|
| customer_id | SERIAL | PRIMARY KEY | Unique identifier for the customer |
| full_name | VARCHAR(100) | NOT NULL | Customer's full legal name |
| email_address | VARCHAR(100) | UNIQUE, NOT NULL | Customer's email (login identifier) |
| phone_number | VARCHAR(15) | NOT NULL | Contact phone number |
| is_active | BOOLEAN | DEFAULT TRUE | Status flag for account validity |
| deleted_at | TIMESTAMPTZ | NULL | Timestamp for soft deletion logic |

**Indexes:**
* `email_address` (Unique Index)

**Relationships:**
* **One-to-Many** with `BOOKING` (One customer can make multiple bookings)

---

### Table: `HALL`

**Purpose:** Represents physical cinema auditoriums/rooms.

**Columns:**

| Column | Type | Constraints | Description |
|---|---|---|---|
| hall_id | SERIAL | PRIMARY KEY | Unique identifier for the hall |
| name_hall | VARCHAR(30) | UNIQUE, NOT NULL | Human-readable name (e.g., "Red Hall") |
| type_hall | VARCHAR(30) | NOT NULL | Technology type (e.g., "IMAX", "Standard") |

**Indexes:**
* `name_hall` (Unique Index)

**Relationships:**
* **One-to-Many** with `SHOWING` (One hall hosts many movie sessions)
* **One-to-Many** with `SEAT` (One hall contains many seats)

---

### Table: `SEAT`

**Purpose:** Defines the physical layout and capacity of a hall.

**Columns:**

| Column | Type | Constraints | Description |
|---|---|---|---|
| seat_id | SERIAL | PRIMARY KEY | Unique identifier for a specific seat |
| hall_id | INTEGER | FOREIGN KEY, NOT NULL | Reference to the Hall |
| row_num | INTEGER | NOT NULL | Row number of the seat |
| seat_number | INTEGER | NOT NULL | Number of the seat within the row |

**Indexes:**
* `UQ_SeatLocation`: Unique constraint on (`hall_id`, `row_num`, `seat_number`) — prevents duplicate seat coordinates in the same hall.

**Relationships:**
* **Many-to-One** with `HALL`
* **One-to-Many** with `TICKET` (A seat is referenced by tickets in different sessions)

---

### Table: `MOVIE`

**Purpose:** Stores metadata about films.

**Columns:**

| Column | Type | Constraints | Description |
|---|---|---|---|
| movie_id | SERIAL | PRIMARY KEY | Unique identifier for the movie |
| title | VARCHAR(40) | NOT NULL | Title of the movie |
| release_date | DATE | NOT NULL | Official release date |
| duration | INTEGER | NOT NULL | Runtime in minutes |
| rating | DECIMAL(2, 1) | NULL | Movie rating (e.g., 8.5) |

**Relationships:**
* **One-to-Many** with `SHOWING`
* **Many-to-Many** with `GENRE` (via `MOVIE_GENRE`)

---

### Table: `GENRE`

**Purpose:** Lookup table for standardizing movie categories.

**Columns:**

| Column | Type | Constraints | Description |
|---|---|---|---|
| genre_id | SERIAL | PRIMARY KEY | Unique identifier for the genre |
| genre_name | VARCHAR(40) | UNIQUE, NOT NULL | Name of the genre (e.g., "Sci-Fi") |

**Relationships:**
* **Many-to-Many** with `MOVIE` (via `MOVIE_GENRE`)

---

### Table: `MOVIE_GENRE`

**Purpose:** Pivot (Junction) table implementing the Many-to-Many relationship between Movies and Genres.

**Columns:**

| Column | Type | Constraints | Description |
|---|---|---|---|
| movie_id | INTEGER | FK, PK (Composite) | Reference to the Movie |
| genre_id | INTEGER | FK, PK (Composite) | Reference to the Genre |

**Relationships:**
* **Many-to-One** with `MOVIE` (On Delete: Cascade)
* **Many-to-One** with `GENRE` (On Delete: Cascade)

---

### Table: `SHOWING`

**Purpose:** Represents a scheduled screening session of a movie in a specific hall.

**Columns:**

| Column | Type | Constraints | Description |
|---|---|---|---|
| session_id | SERIAL | PRIMARY KEY | Unique identifier for the session |
| movie_id | INTEGER | FOREIGN KEY, NOT NULL | Reference to the Movie |
| hall_id | INTEGER | FOREIGN KEY, NOT NULL | Reference to the Hall |
| start_time | TIMESTAMPTZ | NOT NULL | Date and time when the movie starts |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Record creation timestamp |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | Last update timestamp |

**Indexes:**
* `UQ_HallTime`: Unique constraint on (`hall_id`, `start_time`) — prevents scheduling two movies in the same hall at the same time.

**Relationships:**
* **Many-to-One** with `MOVIE`
* **Many-to-One** with `HALL`
* **One-to-Many** with `TICKET`

---

### Table: `BOOKING`

**Purpose:** Represents a financial transaction or order placed by a customer.

**Columns:**

| Column | Type | Constraints | Description |
|---|---|---|---|
| booking_id | SERIAL | PRIMARY KEY | Unique identifier for the order |
| customer_id | INTEGER | FOREIGN KEY, NOT NULL | Reference to the Customer |
| booking_date | TIMESTAMPTZ | DEFAULT NOW() | When the booking was placed |
| total_amount | DECIMAL(8, 2) | NOT NULL | Total cost of the booking |
| status | VARCHAR(20) | DEFAULT 'Pending' | Status (e.g., 'Pending', 'Confirmed') |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Record creation timestamp |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | Last update timestamp |

**Relationships:**
* **Many-to-One** with `CUSTOMER`
* **One-to-Many** with `TICKET`

---

### Table: `TICKET`

**Purpose:** Represents a specific reserved seat for a specific session.

**Columns:**

| Column | Type | Constraints | Description |
|---|---|---|---|
| ticket_id | SERIAL | PRIMARY KEY | Unique identifier for the ticket |
| booking_id | INTEGER | FOREIGN KEY, NOT NULL | Reference to the parent Booking |
| session_id | INTEGER | FOREIGN KEY, NOT NULL | Reference to the Showing |
| seat_id | INTEGER | FOREIGN KEY, NOT NULL | Reference to the specific Seat |
| price | DECIMAL(6, 2) | NOT NULL | Price of this specific ticket |
| status | VARCHAR(20) | DEFAULT 'Paid' | Ticket status (e.g., 'Paid', 'Cancelled') |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Record creation timestamp |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | Last update timestamp |

**Indexes:**
* `UQ_Ticket`: Unique constraint on (`session_id`, `seat_id`) — prevents double-booking the same seat for the same movie session.

**Relationships:**
* **Many-to-One** with `BOOKING`
* **Many-to-One** with `SHOWING`
* **Many-to-One** with `SEAT`

## 2. Normalization Level

The database schema achieves **Third Normal Form (3NF)**.

---

## 3. Trade-offs and Denormalization

While strict 3NF is the goal, certain practical trade-offs were made for performance and business logic auditing.

### A. `total_amount` in `BOOKING` Table
* **Deviation:** Theoretically, the total price can be calculated by summing the `price` of all related `TICKET` records. Storing it is a form of denormalization.
* **Justification:**
    1.  **Performance:** Dashboards showing revenue don't need to join and sum millions of ticket rows.