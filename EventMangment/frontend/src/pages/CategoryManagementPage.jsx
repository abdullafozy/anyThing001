import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Container, Card, Form, Button, Table } from "react-bootstrap";

import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import ErrorAlert from "../components/ErrorAlert.jsx";

const schema = Yup.object({
  name: Yup.string().min(2, "Name must be at least 2 characters").max(50, "Name is too long"),
  description: Yup.string().max(200, "Description is too long"),
});

function CategoryManagementPage() {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [editingId, setEditingId] = useState(null);

  async function loadCategories() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/categories");
      setCategories(res.data.categories || []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  const formik = useFormik({
    initialValues: { name: "", description: "" },
    validationSchema: schema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      setActionError(null);
      try {
        if (editingId) {
          await api.patch(`/categories/${editingId}`, values);
        } else {
          await api.post("/categories", values);
        }
        resetForm();
        setEditingId(null);
        await loadCategories();
      } catch (err) {
        setActionError(err);
      } finally {
        setSubmitting(false);
      }
    },
  });

  async function handleEdit(id) {
    setActionError(null);
    try {
      const res = await api.get(`/categories/${id}`);
      setEditingId(id);
      formik.setValues({
        name: res.data.name || "",
        description: res.data.description || "",
      });
    } catch (err) {
      setActionError(err);
    }
  }

  async function handleDelete(id) {
    setActionError(null);
    try {
      await api.delete(`/categories/${id}`);
      setCategories((prev) => prev.filter((c) => c._id !== id));
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
      <h1 className="page-title">Categories Management</h1>

      {loading && <LoadingSpinner text="Loading categories..." />}
      {!loading && error && <ErrorAlert error={error} />}
      {actionError && <ErrorAlert error={actionError} />}

      {!loading && !error && (
        <>
          <Card className="border-0 shadow-sm mb-3">
            <Card.Body>
              <h6 className="mb-3">{editingId ? "Edit Category" : "Create Category"}</h6>
              <Form onSubmit={formik.handleSubmit}>
                <Form.Group className="mb-2">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.name && !!formik.errors.name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.name}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.description && !!formik.errors.description}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.description}
                  </Form.Control.Feedback>
                </Form.Group>
                <div className="d-flex gap-2">
                  <Button type="submit" disabled={formik.isSubmitting}>
                    {formik.isSubmitting
                      ? "Saving..."
                      : editingId
                      ? "Update Category"
                      : "Create Category"}
                  </Button>
                  {editingId && (
                    <Button
                      variant="outline-secondary"
                      type="button"
                      onClick={() => {
                        setEditingId(null);
                        formik.resetForm();
                      }}
                    >
                      Cancel Edit
                    </Button>
                  )}
                </div>
              </Form>
            </Card.Body>
          </Card>

          <Card className="border-0 shadow-sm">
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th style={{ width: 180 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr key={cat._id}>
                      <td>{cat.name}</td>
                      <td>{cat.description || "-"}</td>
                      <td className="d-flex gap-2">
                        <Button size="sm" variant="outline-primary" onClick={() => handleEdit(cat._id)}>
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => handleDelete(cat._id)}
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
        </>
      )}
    </Container>
  );
}

export default CategoryManagementPage;
