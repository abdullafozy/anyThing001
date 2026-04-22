import React, { useEffect, useState } from "react";
import { Container, Card, Table, Button, Form, Modal } from "react-bootstrap";

import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import ErrorAlert from "../components/ErrorAlert.jsx";

function AdminUsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedId, setSelectedId] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionError, setActionError] = useState(null);

  async function loadUsers() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/users");
      setUsers(res.data.users || []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleViewUser() {
    if (!selectedId) return;
    setActionError(null);
    try {
      const res = await api.get(`/users/${selectedId}`);
      setSelectedUser(res.data);
      setShowModal(true);
    } catch (err) {
      setActionError(err);
    }
  }

  async function handleDelete(id) {
    setActionError(null);
    try {
      await api.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      if (selectedId === id) setSelectedId("");
    } catch (err) {
      setActionError(err);
    }
  }

  if (user?.role !== "admin") {
    return (
      <Container className="py-4" style={{ maxWidth: 900 }}>
        <ErrorAlert error="Admin access only." />
      </Container>
    );
  }

  return (
    <Container className="py-4" style={{ maxWidth: 980 }}>
      <h1 className="page-title">Users Management</h1>

      {loading && <LoadingSpinner text="Loading users..." />}
      {!loading && error && <ErrorAlert error={error} />}
      {actionError && <ErrorAlert error={actionError} />}

      {!loading && !error && (
        <Card className="border-0 shadow-sm">
          <Card.Body>
            <div className="d-flex gap-2 mb-3 flex-wrap">
              <Form.Select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                style={{ maxWidth: 320 }}
              >
                <option value="">Select user to view details</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </Form.Select>
              <Button
                variant="outline-primary"
                onClick={handleViewUser}
                disabled={!selectedId}
              >
                View User
              </Button>
            </div>

            <Table responsive hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th style={{ width: 120 }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    <td>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(u._id)}
                        disabled={u._id === user._id}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <div>
              <p className="mb-1">
                <strong>Name:</strong> {selectedUser.name}
              </p>
              <p className="mb-1">
                <strong>Email:</strong> {selectedUser.email}
              </p>
              <p className="mb-0">
                <strong>Role:</strong> {selectedUser.role}
              </p>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default AdminUsersPage;
