# Event Management API

A RESTful API for managing events built with Node.js, Express, and MongoDB.

## Features

- User registration and login with JWT
- Create and browse events with pagination, filtering, and search
- Events belong to categories (admin-managed)
- Users can register for events with capacity enforcement
- Role-based access control (user / admin)
- Centralized error handling and input validation

---

## Project Structure

```
event-management/
├── app.js
├── server.js
├── .env.example
├── controllers/
│   ├── user.controller.js
│   ├── category.controller.js
│   ├── event.controller.js
│   └── registration.controller.js
├── middleware/
│   ├── authMW.js
│   ├── authorizeMW.js
│   ├── errorHandlingMW.js
│   ├── notFoundMW.js
│   └── validateResults.js
├── models/
│   ├── user.js
│   ├── category.js
│   ├── event.js
│   └── registration.js
├── routes/
│   ├── auth.router.js
│   ├── user.router.js
│   ├── category.router.js
│   ├── event.router.js
│   └── registration.router.js
├── utils/
│   └── httpError.js
└── validations/
    ├── authValidators.js
    ├── userValidators.js
    ├── categoryValidators.js
    ├── eventValidators.js
    └── commonValidators.js
```

---

## Setup Instructions

### 1. Clone the repo or copy the project folder

```bash
cd event-management
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create your `.env` file

```bash
cp .env.example .env
```

Then open `.env` and fill in your values:

```
PORT=4000
MONGO_URI=mongodb://localhost:27017/EventManagement
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=1d
```

### 4. Make sure MongoDB is running

If you are using a local MongoDB server:
```bash
mongod
```

Or use a remote connection string (e.g. MongoDB Atlas) in `MONGO_URI`.

### 5. Run the server

Development mode (auto-restart on changes):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server will run at: `http://localhost:4000`

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register a new user |
| POST | /api/auth/login | Login and get a JWT token |

### Users
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | /api/users | Admin only |
| GET | /api/users/:id | Authenticated |
| PATCH | /api/users/:id | Authenticated |
| DELETE | /api/users/:id | Admin only |

### Categories
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | /api/categories | Public |
| GET | /api/categories/:id | Public |
| POST | /api/categories | Admin only |
| PATCH | /api/categories/:id | Admin only |
| DELETE | /api/categories/:id | Admin only |

### Events
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | /api/events | Public (supports ?page, ?limit, ?category, ?search) |
| GET | /api/events/:id | Public |
| POST | /api/events | Authenticated |
| PATCH | /api/events/:id | Owner or Admin |
| DELETE | /api/events/:id | Owner or Admin |
| GET | /api/events/:id/registrations | Admin only |

### Registrations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/registrations/my | Get my registrations |
| POST | /api/registrations/:id | Register for an event |
| DELETE | /api/registrations/:id | Cancel registration |

---

## Example Requests & Responses

### Register
**POST** `/api/auth/register`
```json
{
  "name": "Ahmed Ali",
  "email": "ahmed@gmail.com",
  "password": "password123"
}
```
**Response 201:**
```json
{
  "message": "Account created successfully, please login"
}
```

---

### Login
**POST** `/api/auth/login`
```json
{
  "email": "ahmed@gmail.com",
  "password": "password123"
}
```
**Response 200:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "664abc123...",
    "name": "Ahmed Ali",
    "email": "ahmed@gmail.com",
    "role": "user"
  }
}
```

---

### Create Category (Admin)
**POST** `/api/categories`
Header: `Authorization: Bearer <token>`
```json
{
  "name": "Technology",
  "description": "Tech conferences and workshops"
}
```
**Response 201:**
```json
{
  "message": "Category created",
  "category": {
    "_id": "664abc456...",
    "name": "Technology",
    "description": "Tech conferences and workshops"
  }
}
```

---

### Create Event
**POST** `/api/events`
Header: `Authorization: Bearer <token>`
```json
{
  "title": "Node.js Workshop",
  "description": "A hands-on workshop for backend development with Node.js",
  "date": "2025-09-15T10:00:00Z",
  "location": "Cairo Tech Hub, Maadi",
  "capacity": 50,
  "category": "664abc456..."
}
```
**Response 201:**
```json
{
  "message": "Event created",
  "event": {
    "_id": "664abc789...",
    "title": "Node.js Workshop",
    "description": "A hands-on workshop...",
    "date": "2025-09-15T10:00:00.000Z",
    "location": "Cairo Tech Hub, Maadi",
    "capacity": 50,
    "registeredCount": 0,
    "category": "664abc456...",
    "createdBy": "664abc123..."
  }
}
```

---

### Get All Events (with pagination + search)
**GET** `/api/events?page=1&limit=6&search=node`

**Response 200:**
```json
{
  "total": 1,
  "page": 1,
  "pages": 1,
  "events": [
    {
      "_id": "664abc789...",
      "title": "Node.js Workshop",
      "location": "Cairo Tech Hub, Maadi",
      "date": "2025-09-15T10:00:00.000Z",
      "capacity": 50,
      "registeredCount": 3,
      "category": { "_id": "664abc456...", "name": "Technology" },
      "createdBy": { "_id": "664abc123...", "name": "Ahmed Ali", "email": "ahmed@gmail.com" }
    }
  ]
}
```

---

### Register for Event
**POST** `/api/registrations/664abc789...`
Header: `Authorization: Bearer <token>`

**Response 201:**
```json
{
  "message": "Successfully registered for the event",
  "registration": {
    "_id": "664abcdef...",
    "user": "664abc123...",
    "event": "664abc789...",
    "status": "confirmed"
  }
}
```

---

### Error Response Example
```json
{
  "status": "error",
  "message": "Validation Error",
  "errors": [
    {
      "type": "field",
      "msg": "Event title is required",
      "path": "title",
      "location": "body"
    }
  ]
}
```

---

## Notes

- All protected routes require: `Authorization: Bearer <your_token>`
- Admin role must be set manually in the database for now
- The `registeredCount` field is automatically updated on register/cancel
- A user can only register once per event (enforced at DB level with a unique index)
