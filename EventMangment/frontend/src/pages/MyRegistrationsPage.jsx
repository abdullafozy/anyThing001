import React, { useEffect, useState } from "react";
import { Container, Card, Button, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FiCalendar, FiMapPin, FiTrash2 } from "react-icons/fi";

import api from "../services/api.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import ErrorAlert from "../components/ErrorAlert.jsx";

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function MyRegistrationsPage() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [busyId, setBusyId] = useState(null);

  async function loadRegistrations() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/registrations/my");
      setRegistrations(res.data.registrations || []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRegistrations();
  }, []);

  async function handleCancel(registrationId) {
    setActionError(null);
    setBusyId(registrationId);
    try {
      await api.delete(`/registrations/${registrationId}`);
      setRegistrations((prev) => prev.filter((r) => r._id !== registrationId));
    } catch (err) {
      setActionError(err);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <Container className="py-4" style={{ maxWidth: 860 }}>
      <h1 className="page-title">My Registrations</h1>

      {loading && <LoadingSpinner text="Loading your registrations..." />}
      {!loading && error && <ErrorAlert error={error} />}
      {actionError && <ErrorAlert error={actionError} />}

      {!loading && !error && registrations.length === 0 && (
        <Card className="border-0 shadow-sm">
          <Card.Body className="text-center py-4 text-muted">
            You have no registrations yet.
          </Card.Body>
        </Card>
      )}

      {!loading && !error && registrations.length > 0 && (
        <div className="d-flex flex-column gap-3">
          {registrations.map((registration) => (
            <Card key={registration._id} className="border-0 shadow-sm">
              <Card.Body className="d-flex flex-column gap-2">
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                  <div>
                    <h5 className="mb-1">{registration.event?.title || "Event"}</h5>
                    <Badge bg="success" style={{ fontWeight: 500 }}>
                      {registration.status}
                    </Badge>
                  </div>
                  <div className="d-flex gap-2">
                    <Link
                      to={`/events/${registration.event?._id}`}
                      className="btn btn-outline-primary btn-sm"
                    >
                      View Event
                    </Link>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleCancel(registration._id)}
                      disabled={busyId === registration._id}
                      className="d-flex align-items-center gap-1"
                    >
                      <FiTrash2 size={13} />
                      {busyId === registration._id ? "Cancelling..." : "Cancel"}
                    </Button>
                  </div>
                </div>

                <div className="text-muted" style={{ fontSize: "0.9rem" }}>
                  <span className="me-3">
                    <FiCalendar size={14} style={{ marginRight: 5 }} />
                    {registration.event?.date ? formatDate(registration.event.date) : "No date"}
                  </span>
                  <span>
                    <FiMapPin size={14} style={{ marginRight: 5 }} />
                    {registration.event?.location || "No location"}
                  </span>
                </div>

                {registration.qrCode && (
                  <div className="border rounded-3 p-2 bg-white" style={{ maxWidth: 200 }}>
                    <div className="fw-semibold mb-1" style={{ fontSize: "0.85rem" }}>
                      Your Ticket
                    </div>
                    <img
                      src={registration.qrCode}
                      alt="QR Ticket"
                      style={{ width: "150px" }}
                    />
                  </div>
                )}
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
}

export default MyRegistrationsPage;
