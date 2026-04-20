import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Container,
  Card,
  Badge,
  Button,
  Alert,
  Row,
  Col,
  ProgressBar,
} from "react-bootstrap";
import {
  FiCalendar,
  FiMapPin,
  FiUsers,
  FiArrowLeft,
  FiUserCheck,
  FiUser,
  FiXCircle,
} from "react-icons/fi";

import {
  getEventById,
  cancelRegistration,
  getMyRegistrations,
} from "../services/eventService.js";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import ErrorAlert from "../components/ErrorAlert.jsx";

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(dateStr) {
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // registration state
  const [isRegistered, setIsRegistered] = useState(false);
  const [registration, setRegistration] = useState(null);
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState(null);
  const [regSuccess, setRegSuccess] = useState(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const eventData = await getEventById(id);
        setEvent(eventData);

        // check if current user is already registered
        if (isLoggedIn) {
          const myRegs = await getMyRegistrations();
          const foundReg = (myRegs.registrations || []).find(
            (r) => r.event?._id === id || r.event === id
          );
          setRegistration(foundReg || null);
          setIsRegistered(!!foundReg);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id, isLoggedIn]);

  async function handleRegister() {
    setRegLoading(true);
    setRegError(null);
    setRegSuccess(null);
    try {
      const data = await api.post("/registrations", { eventId: event._id }).then((r) => r.data);
      setRegistration(data.registration || null);
      setRegSuccess("You are now registered for this event!");
      setIsRegistered(true);
      setEvent((prev) => ({
        ...prev,
        registeredCount: prev.registeredCount + 1,
      }));
    } catch (err) {
      setRegError(err);
    } finally {
      setRegLoading(false);
    }
  }

  async function handleCancel() {
    setRegLoading(true);
    setRegError(null);
    setRegSuccess(null);
    try {
      await cancelRegistration(registration._id);
      setRegSuccess("Registration cancelled.");
      setIsRegistered(false);
      setRegistration(null);
      setEvent((prev) => ({
        ...prev,
        registeredCount: Math.max(0, prev.registeredCount - 1),
      }));
    } catch (err) {
      setRegError(err);
    } finally {
      setRegLoading(false);
    }
  }

  async function handleDeleteEvent() {
    setRegLoading(true);
    setRegError(null);
    try {
      await api.delete(`/events/${id}`);
      navigate("/");
    } catch (err) {
      setRegError(err);
    } finally {
      setRegLoading(false);
    }
  }

  if (loading) {
    return (
      <Container className="py-5">
        <LoadingSpinner text="Loading event details..." />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <ErrorAlert error={error} />
        <Button variant="link" className="p-0" onClick={() => navigate(-1)}>
          ← Go back
        </Button>
      </Container>
    );
  }

  if (!event) return null;

  const spotsLeft = event.capacity - event.registeredCount;
  const isFull = spotsLeft <= 0;
  const fillPercent = Math.round((event.registeredCount / event.capacity) * 100);
  const canManageEvent =
    isLoggedIn &&
    (user?.role === "admin" || user?.id === (event.createdBy?._id || event.createdBy));

  return (
    <Container className="py-4" style={{ maxWidth: 740 }}>
      {/* back button */}
      <Button
        variant="link"
        className="text-muted p-0 mb-3 d-flex align-items-center gap-1"
        style={{ fontSize: "0.87rem" }}
        onClick={() => navigate(-1)}
      >
        <FiArrowLeft size={14} />
        Back to events
      </Button>

      <Card className="border-0 shadow-sm rounded-3">
        <Card.Body className="p-4">

          {/* badges */}
          <div className="mb-3">
            <Badge bg="primary" style={{ fontSize: "0.72rem" }}>
              {event.category?.name || "Uncategorized"}
            </Badge>
            {isFull && (
              <Badge bg="danger" className="ms-1" style={{ fontSize: "0.72rem" }}>
                Fully Booked
              </Badge>
            )}
          </div>

          {/* title */}
          <h2 className="fw-bold mb-4" style={{ fontSize: "1.55rem" }}>
            {event.title}
          </h2>

          {/* meta grid */}
          <Row className="g-3 mb-4">
            <Col xs={12} sm={6}>
              <div
                className="d-flex align-items-start gap-2"
                style={{ fontSize: "0.88rem", color: "#475569" }}
              >
                <FiCalendar size={15} style={{ marginTop: 2, flexShrink: 0 }} />
                <div>
                  <div>{formatDate(event.date)}</div>
                  <div className="text-muted" style={{ fontSize: "0.82rem" }}>
                    {formatTime(event.date)}
                  </div>
                </div>
              </div>
            </Col>

            <Col xs={12} sm={6}>
              <div
                className="d-flex align-items-start gap-2"
                style={{ fontSize: "0.88rem", color: "#475569" }}
              >
                <FiMapPin size={15} style={{ marginTop: 2, flexShrink: 0 }} />
                <div>{event.location}</div>
              </div>
            </Col>

            <Col xs={12} sm={6}>
              <div
                className="d-flex align-items-start gap-2"
                style={{ fontSize: "0.88rem", color: "#475569" }}
              >
                <FiUser size={15} style={{ marginTop: 2, flexShrink: 0 }} />
                <div>
                  Organized by{" "}
                  <strong>{event.createdBy?.name || "Unknown"}</strong>
                </div>
              </div>
            </Col>

            <Col xs={12} sm={6}>
              <div
                className="d-flex align-items-start gap-2"
                style={{ fontSize: "0.88rem", color: "#475569" }}
              >
                <FiUsers size={15} style={{ marginTop: 2, flexShrink: 0 }} />
                <div>
                  {event.registeredCount} / {event.capacity} registered
                  {!isFull && (
                    <span className="text-success ms-1">
                      ({spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} left)
                    </span>
                  )}
                </div>
              </div>
            </Col>
          </Row>

          {/* capacity bar */}
          <div className="mb-4">
            <ProgressBar
              now={fillPercent}
              variant={isFull ? "danger" : fillPercent >= 80 ? "warning" : "success"}
              style={{ height: 6, borderRadius: 4 }}
            />
            <div
              className="text-muted mt-1"
              style={{ fontSize: "0.78rem" }}
            >
              {fillPercent}% capacity filled
            </div>
          </div>

          <hr />

          {/* description */}
          <h6 className="fw-semibold mb-2" style={{ fontSize: "0.9rem" }}>
            About this event
          </h6>
          <p style={{ lineHeight: 1.75, color: "#334155", fontSize: "0.92rem" }}>
            {event.description}
          </p>

          {/* registration actions */}
          <div className="mt-4 pt-2 border-top">
            {canManageEvent && (
              <div className="mb-3 d-flex gap-2 flex-wrap">
                <Link to={`/events/${id}/edit`} className="btn btn-outline-primary btn-sm">
                  Edit Event
                </Link>
                {user?.role === "admin" && (
                  <Link to={`/events/${id}/registrations`} className="btn btn-outline-dark btn-sm">
                    View Registrations
                  </Link>
                )}
                <Button
                  variant="outline-danger"
                  size="sm"
                  disabled={regLoading}
                  onClick={handleDeleteEvent}
                >
                  {regLoading ? "Deleting..." : "Delete Event"}
                </Button>
              </div>
            )}

            {regSuccess && (
              <Alert
                variant="success"
                className="py-2 px-3 mb-3"
                style={{ fontSize: "0.87rem" }}
              >
                {regSuccess}
              </Alert>
            )}
            {regError && <ErrorAlert error={regError} />}

            {!isLoggedIn ? (
              <div className="d-flex align-items-center gap-3 flex-wrap">
                <Button
                  variant="primary"
                  onClick={() => navigate("/login")}
                  className="d-flex align-items-center gap-2"
                >
                  <FiUserCheck size={15} />
                  Login to Register
                </Button>
                <span className="text-muted" style={{ fontSize: "0.83rem" }}>
                  You need an account to register for events.
                </span>
              </div>
            ) : isRegistered ? (
              <div className="d-flex flex-column gap-3">
                <div className="d-flex align-items-center gap-3 flex-wrap">
                  <Alert
                    variant="success"
                    className="py-2 px-3 mb-0 d-flex align-items-center gap-2"
                    style={{ fontSize: "0.87rem" }}
                  >
                    <FiUserCheck size={14} />
                    You are registered for this event
                  </Alert>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    disabled={regLoading}
                    onClick={handleCancel}
                    className="d-flex align-items-center gap-1"
                  >
                    <FiXCircle size={13} />
                    {regLoading ? "Cancelling..." : "Cancel Registration"}
                  </Button>
                </div>

                {registration?.qrCode && (
                  <div
                    className="border rounded-3 p-3 bg-white"
                    style={{ maxWidth: 260 }}
                  >
                    <div className="fw-semibold mb-2" style={{ fontSize: "0.9rem" }}>
                      Your Ticket QR Code
                    </div>
                    <img
                      src={registration.qrCode}
                      alt="QR Ticket"
                      style={{ width: "200px" }}
                    />
                  </div>
                )}
              </div>
            ) : (
              <Button
                variant={isFull ? "secondary" : "success"}
                disabled={isFull || regLoading}
                onClick={handleRegister}
                className="d-flex align-items-center gap-2"
              >
                <FiUserCheck size={15} />
                {regLoading
                  ? "Registering..."
                  : isFull
                  ? "Event is Fully Booked"
                  : "Register for this Event"}
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default EventDetailPage;
