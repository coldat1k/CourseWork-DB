# Cinema Booking System

Веб-застосунок для онлайн-бронювання квитків у кінотеатр, створений за допомогою **Node.js**, **Express**, **Prisma ORM**, **PostgreSQL** та **Docker**.

> **Курсова робота студента Савицького Юрія групи ІМ-44**

---

## Функції

* **Аутентифікація**
  Реєстрація та вхід користувачів за Email.

* **Інтерактивна зала**
  Візуальний вибір місць на схемі зали.

* **Бронювання**
  Створення замовлень з транзакційною цілісністю (захист від подвійного бронювання).

* **Історія квитків**
  Перегляд історії власних квитків та їх статусів (*Підтверджено / Скасовано*).

* **Динамічність**
  Відображення зайнятих місць у реальному часі.

* **Адміністрування**
  Вбудований **pgAdmin** для керування базою даних.

---

## Передумови

* Docker
* Docker Compose
* Node.js *(опціонально, для локальної розробки)*

---

## Встановлення та налаштування

### 1. Клонування репозиторію

```bash
cd coursework
```

---

### 2. Створення `.env` файлу

Створіть файл **`.env`** у кореневій папці проєкту:

```env
PORT=3000
DATABASE_URL="postgresql://user:password@db:5432/cinema_db?schema=public"
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=cinema_db
PGADMIN_DEFAULT_EMAIL=admin@admin.com
PGADMIN_DEFAULT_PASSWORD=root
```

---

### 3. Запуск контейнерів

```bash
docker-compose up --build
```

Ця команда автоматично:

* Підніме **PostgreSQL** (порт `5433`)
* Підніме **pgAdmin** (порт `5050`)
* Запустить **Node.js сервер** та виконає міграції Prisma

---

### 4. Наповнення тестовими даними (Seeding)

Щоб у базі з'явилися фільми, зали та сеанси, відкрийте нове вікно терміналу:

```bash
npm run seed
```

> Команда створює залу, фільм, сеанс та **40 місць**.

---

### 5. Доступ до додатку

 **[http://localhost:3000](http://localhost:3000)**

---

##  Управління базою даних

Додаток використовує **PostgreSQL**. Керувати даними можна через pgAdmin або зовнішні інструменти.

---

### Вбудований pgAdmin (рекомендовано)

Перейдіть за адресою:

```
http://localhost:5050
```

**Дані для входу:**

* Email: `admin@admin.com`
* Password: `root`

####  Додавання сервера

1. Натисніть **Add New Server**
2. Вкладка **General** → Name: `Cinema Docker`
3. Вкладка **Connection**:

```
Host name: db
Port: 5432
Maintenance database: cinema_db
Username: user
Password: password
```

4. Натисніть **Save**

---

##  Команди Prisma (ORM)

```bash
# Створити міграцію (після змін у schema.prisma)
npx prisma migrate dev --name init

# Відкрити Prisma Studio
npx prisma studio

# Перезаписати БД тестовими даними
npm run seed
```

---

##  Розробка

###  Структура проєкту

```
src/
 ├─ controllers/   # Обробка HTTP-запитів
 ├─ services/      # Бізнес-логіка (бронювання, транзакції)
 ├─ repositories/  # Робота з БД через Prisma
 ├─ routes/        # API маршрути
 ├─ public/        # Frontend (HTML, CSS, JS)
 │   ├─ index.html     # Вхід / Реєстрація
 │   ├─ booking.html   # Вибір місць
 │   └─ tickets.html   # Історія квитків

prisma/
 ├─ schema.prisma
 └─ seed.js

docker-compose.yml
```

---

## Запуск тестів

Проєкт використовує **Jest** для тестування API:

```bash
npm test
```

---

## Усунення несправностей

### Помилка `P1000: Authentication failed`

* Перевірте правильність `DATABASE_URL` у `.env`
* Переконайтесь, що локальний PostgreSQL не використовує порт `5432`

---

### Помилка `EADDRINUSE: address already in use :::3000`

Порт `3000` вже зайнятий.

```bash
docker-compose stop app
npm run dev
```

> Не запускайте `npm run dev` паралельно з `docker-compose up`.

---

##  Розгортання (Production)

1. Оновіть `.env` (змініть паролі)
2. Запускайте сервер без `nodemon`

```bash
npm start
```

---

 **Cinema Booking System готовий до використання та демонстрації**
