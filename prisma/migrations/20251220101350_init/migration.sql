-- CreateTable
CREATE TABLE "HALL" (
    "hall_id" SERIAL NOT NULL,
    "name_hall" VARCHAR(10) NOT NULL,
    "type_hall" VARCHAR(15) NOT NULL,

    CONSTRAINT "HALL_pkey" PRIMARY KEY ("hall_id")
);

-- CreateTable
CREATE TABLE "CUSTOMER" (
    "customer_id" SERIAL NOT NULL,
    "full_name" VARCHAR(100) NOT NULL,
    "email_address" VARCHAR(100) NOT NULL,
    "phone_number" VARCHAR(15) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "CUSTOMER_pkey" PRIMARY KEY ("customer_id")
);

-- CreateTable
CREATE TABLE "MOVIE" (
    "movie_id" SERIAL NOT NULL,
    "title" VARCHAR(40) NOT NULL,
    "release_date" DATE NOT NULL,
    "duration" INTEGER NOT NULL,
    "rating" DECIMAL(2,1),

    CONSTRAINT "MOVIE_pkey" PRIMARY KEY ("movie_id")
);

-- CreateTable
CREATE TABLE "GENRE" (
    "genre_id" SERIAL NOT NULL,
    "genre_name" VARCHAR(40) NOT NULL,

    CONSTRAINT "GENRE_pkey" PRIMARY KEY ("genre_id")
);

-- CreateTable
CREATE TABLE "MOVIE_GENRE" (
    "movie_id" INTEGER NOT NULL,
    "genre_id" INTEGER NOT NULL,

    CONSTRAINT "MOVIE_GENRE_pkey" PRIMARY KEY ("movie_id","genre_id")
);

-- CreateTable
CREATE TABLE "SHOWING" (
    "session_id" SERIAL NOT NULL,
    "movie_id" INTEGER NOT NULL,
    "hall_id" INTEGER NOT NULL,
    "start_time" TIMESTAMPTZ NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SHOWING_pkey" PRIMARY KEY ("session_id")
);

-- CreateTable
CREATE TABLE "SEAT" (
    "seat_id" SERIAL NOT NULL,
    "hall_id" INTEGER NOT NULL,
    "row_num" INTEGER NOT NULL,
    "seat_number" INTEGER NOT NULL,

    CONSTRAINT "SEAT_pkey" PRIMARY KEY ("seat_id")
);

-- CreateTable
CREATE TABLE "BOOKING" (
    "booking_id" SERIAL NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "booking_date" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total_amount" DECIMAL(8,2) NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'Pending',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BOOKING_pkey" PRIMARY KEY ("booking_id")
);

-- CreateTable
CREATE TABLE "TICKET" (
    "ticket_id" SERIAL NOT NULL,
    "booking_id" INTEGER NOT NULL,
    "session_id" INTEGER NOT NULL,
    "seat_id" INTEGER NOT NULL,
    "price" DECIMAL(6,2) NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'Paid',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TICKET_pkey" PRIMARY KEY ("ticket_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HALL_name_hall_key" ON "HALL"("name_hall");

-- CreateIndex
CREATE UNIQUE INDEX "CUSTOMER_email_address_key" ON "CUSTOMER"("email_address");

-- CreateIndex
CREATE UNIQUE INDEX "GENRE_genre_name_key" ON "GENRE"("genre_name");

-- CreateIndex
CREATE INDEX "SHOWING_hall_id_start_time_idx" ON "SHOWING"("hall_id", "start_time");

-- CreateIndex
CREATE UNIQUE INDEX "SHOWING_hall_id_start_time_key" ON "SHOWING"("hall_id", "start_time");

-- CreateIndex
CREATE INDEX "SEAT_hall_id_idx" ON "SEAT"("hall_id");

-- CreateIndex
CREATE UNIQUE INDEX "SEAT_hall_id_row_num_seat_number_key" ON "SEAT"("hall_id", "row_num", "seat_number");

-- CreateIndex
CREATE INDEX "TICKET_session_id_seat_id_idx" ON "TICKET"("session_id", "seat_id");

-- CreateIndex
CREATE UNIQUE INDEX "TICKET_session_id_seat_id_key" ON "TICKET"("session_id", "seat_id");

-- AddForeignKey
ALTER TABLE "MOVIE_GENRE" ADD CONSTRAINT "MOVIE_GENRE_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "MOVIE"("movie_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MOVIE_GENRE" ADD CONSTRAINT "MOVIE_GENRE_genre_id_fkey" FOREIGN KEY ("genre_id") REFERENCES "GENRE"("genre_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SHOWING" ADD CONSTRAINT "SHOWING_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "MOVIE"("movie_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SHOWING" ADD CONSTRAINT "SHOWING_hall_id_fkey" FOREIGN KEY ("hall_id") REFERENCES "HALL"("hall_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SEAT" ADD CONSTRAINT "SEAT_hall_id_fkey" FOREIGN KEY ("hall_id") REFERENCES "HALL"("hall_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BOOKING" ADD CONSTRAINT "BOOKING_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "CUSTOMER"("customer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TICKET" ADD CONSTRAINT "TICKET_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "BOOKING"("booking_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TICKET" ADD CONSTRAINT "TICKET_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "SHOWING"("session_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TICKET" ADD CONSTRAINT "TICKET_seat_id_fkey" FOREIGN KEY ("seat_id") REFERENCES "SEAT"("seat_id") ON DELETE RESTRICT ON UPDATE CASCADE;
