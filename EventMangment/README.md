# Event Management System

A RESTful API for managing events, categories, and registrations with JWT authentication.

## Tech Stack

- Node.js + Express 
- MongoDB + Mongoose
- JWT Authentication
- Docker + Docker Compose

## Getting Started

### Prerequisites
- Docker Desktop installed and running

### Run the project

1. Clone the repository
2. Navigate to the project root folder
3. Run:

```bash
docker-compose up --build
```

4. Seed the database (open a new terminal):

```bash
docker exec -it eventmanagement_backend node seed.js
```

5. Access the app:
   - Backend API: http://localhost:4000/api
   - Frontend: http://localhost:3000

## Environment Variables

See `backend/.env.example` for required variables.

## API Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/auth/register | Register new user | No |
| POST | /api/auth/login | Login and get token | No |

### Categories
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/categories | Get all categories | No |
| POST | /api/categories | Create category | Admin |
| PATCH | /api/categories/:id | Update category | Admin |
| DELETE | /api/categories/:id | Delete category | Admin |

### Events
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/events | Get all events (pagination + search) | No |
| GET | /api/events/:id | Get single event | No |
| POST | /api/events | Create event | Yes |
| PATCH | /api/events/:id | Update event | Yes |
| DELETE | /api/events/:id | Delete event | Yes |

### Registrations
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/registrations | Register for event | Yes |
| GET | /api/registrations/my | Get my registrations | Yes |
| DELETE | /api/registrations/:id | Cancel registration | Yes |

## Seed Data

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@test.com | admin1234 |
| User | user@test.com | user1234 |

## Project Structure

```
backend/
├── controllers/
├── middleware/
├── models/
├── routes/
├── validations/
├── seed.js
└── server.js
frontend/
├── src/
│   ├── components/
│   ├── context/
│   ├── pages/
│   └── services/
docker-compose.yml
```
