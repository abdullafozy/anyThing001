import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";

import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import EventDetailPage from "./pages/EventDetailPage.jsx";
import CreateEventPage from "./pages/CreateEventPage.jsx";
import EditEventPage from "./pages/EditEventPage.jsx";
import MyRegistrationsPage from "./pages/MyRegistrationsPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import AdminUsersPage from "./pages/AdminUsersPage.jsx";
import CategoryManagementPage from "./pages/CategoryManagementPage.jsx";
import EventRegistrationsPage from "./pages/EventRegistrationsPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/events/:id" element={<EventDetailPage />} />

        {/* protected routes */}
        <Route
          path="/events/create"
          element={
            <PrivateRoute>
              <CreateEventPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/events/:id/edit"
          element={
            <PrivateRoute>
              <EditEventPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/events/:id/registrations"
          element={
            <PrivateRoute>
              <EventRegistrationsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-registrations"
          element={
            <PrivateRoute>
              <MyRegistrationsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <PrivateRoute>
              <AdminUsersPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <PrivateRoute>
              <CategoryManagementPage />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
