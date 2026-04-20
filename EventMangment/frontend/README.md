# EventHub — Frontend

React + Vite frontend for the Event Management API.

## Tech Stack

- React 19
- Vite
- react-router-dom v6
- axios (with JWT interceptor)
- Bootstrap 5 + react-bootstrap
- Formik + Yup (forms & validation)
- react-icons
- styled-components (minimal use)

## Project Structure

```
src/
├── context/
│   └── AuthContext.jsx       # login, logout, token in localStorage
├── services/
│   ├── api.js                # axios instance + auth interceptor
│   ├── authService.js        # register, login
│   ├── eventService.js       # events, registrations
│   └── categoryService.js    # categories
├── components/
│   ├── Navbar.jsx
│   ├── PrivateRoute.jsx      # redirects to /login if not authenticated
│   ├── EventCard.jsx
│   ├── LoadingSpinner.jsx
│   └── ErrorAlert.jsx
├── pages/
│   ├── HomePage.jsx          # events list, search, pagination
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── EventDetailPage.jsx   # event info + register/cancel
│   ├── CreateEventPage.jsx   # protected form
│   └── NotFoundPage.jsx
├── App.jsx                   # routes
├── main.jsx                  # entry point
└── index.css
```

## Setup

1. Make sure the backend is running at `http://localhost:4000`

2. Install dependencies:
```bash
npm install
```

3. Start the dev server:
```bash
npm run dev
```

App runs at: `http://localhost:3000`

If your backend is on a different port, update the `BASE_URL` in `src/services/api.js`.

## Pages

| Route | Page | Access |
|-------|------|--------|
| `/` | Events list | Public |
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/events/:id` | Event detail + register | Public (login to register) |
| `/events/create` | Create event form | Protected |

## Notes

- JWT token is stored in `localStorage` and automatically attached to every request via an axios interceptor
- The `PrivateRoute` component redirects unauthenticated users to `/login`
- The event detail page checks your existing registrations and shows a cancel button if already registered
- Categories must be created by an admin via the backend API before events can be created
