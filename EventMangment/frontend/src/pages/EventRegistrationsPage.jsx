import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Card, Table, Badge } from "react-bootstrap";

import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import ErrorAlert from "../components/ErrorAlert.jsx";

function EventRegistrationsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [eventTitle, setEventTitle] = useState("");
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/events/${id}/registrations`);
        setEventTitle(res.data.event || "Event");
        setRegistrations(res.data.registrations || []);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (user?.role !== "admin") {
    return (
      <Container className="py-4" style={{ maxWidth: 900 }}>
        <ErrorAlert error="Admin access only." />
      </Container>
    );
  }

  return (
    <Container className="py-4" style={{ maxWidth: 980 }}>
      <h1 className="page-title">Event Registrations</h1>
      <p className="text-muted mb-3">
        <strong>{eventTitle}</strong>
      </p>

      {loading && <LoadingSpinner text="Loading registrations..." />}
      {!loading && error && <ErrorAlert error={error} />}

      {!loading && !error && (
        <Card className="border-0 shadow-sm">
          <Card.Body>
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((reg) => (
                  <tr key={reg._id}>
                    <td>{reg.user?.name || "-"}</td>
                    <td>{reg.user?.email || "-"}</td>
                    <td>
                      <Badge bg="success">{reg.status}</Badge>
                    </td>
                  </tr>
                ))}
                {registrations.length === 0 && (
                  <tr>
                    <td colSpan={3} className="text-center text-muted py-4">
                      No registrations yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}

export default EventRegistrationsPage;
