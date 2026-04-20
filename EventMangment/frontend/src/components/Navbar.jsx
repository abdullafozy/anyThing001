import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar as BsNavbar, Nav, Container, Button } from "react-bootstrap";
import { FiCalendar, FiLogOut, FiPlusCircle, FiUser, FiUsers, FiTag } from "react-icons/fi";
import styled from "styled-components";
import { useAuth } from "../context/AuthContext.jsx";

const Brand = styled(Link)`
  font-weight: 700;
  font-size: 1.2rem;
  color: #2563eb !important;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    color: #1d4ed8 !important;
  }
`;

const NavLink = styled(Link)`
  color: #475569 !important;
  font-size: 0.9rem;
  padding: 0.4rem 0.75rem !important;
  border-radius: 6px;
  transition: background 0.15s;

  &:hover {
    background: #f1f5f9;
    color: #1e293b !important;
  }
`;

function Navbar() {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <BsNavbar bg="white" expand="md" className="border-bottom shadow-sm py-2">
      <Container>
        <Brand to="/">
          <FiCalendar size={20} />
          EventHub
        </Brand>

        <BsNavbar.Toggle aria-controls="main-nav" />

        <BsNavbar.Collapse id="main-nav">
          <Nav className="ms-auto align-items-center gap-1">
            <NavLink to="/">Events</NavLink>

            {isLoggedIn ? (
              <>
                <NavLink to="/events/create">
                  <FiPlusCircle style={{ marginRight: 4 }} />
                  Create Event
                </NavLink>
                <NavLink to="/my-registrations">My Registrations</NavLink>
                <NavLink to="/profile">Profile</NavLink>
                {user?.role === "admin" && (
                  <>
                    <NavLink to="/admin/users">
                      <FiUsers style={{ marginRight: 4 }} />
                      Users
                    </NavLink>
                    <NavLink to="/admin/categories">
                      <FiTag style={{ marginRight: 4 }} />
                      Categories
                    </NavLink>
                  </>
                )}

                <span
                  className="text-muted"
                  style={{ fontSize: "0.85rem", padding: "0 4px" }}
                >
                  <FiUser style={{ marginRight: 3 }} />
                  {user?.name}
                </span>

                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={handleLogout}
                  className="d-flex align-items-center gap-1"
                >
                  <FiLogOut size={14} />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <NavLink to="/login">Login</NavLink>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </Nav>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
}

export default Navbar;
