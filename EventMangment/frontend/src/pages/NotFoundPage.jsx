import React from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FiHome } from "react-icons/fi";

function NotFoundPage() {
  return (
    <Container className="py-5 text-center">
      <div
        style={{
          fontSize: "5rem",
          fontWeight: 700,
          color: "#e2e8f0",
          lineHeight: 1,
          marginBottom: "1rem",
        }}
      >
        404
      </div>
      <h5 className="text-muted fw-normal mb-3">
        Oops — this page doesn't exist.
      </h5>
      <Link to="/" className="btn btn-primary btn-sm d-inline-flex align-items-center gap-2">
        <FiHome size={14} />
        Go back home
      </Link>
    </Container>
  );
}

export default NotFoundPage;
