import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Card, Form, Button, Row, Col } from "react-bootstrap";

import api from "../services/api.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import ErrorAlert from "../components/ErrorAlert.jsx";

const schema = Yup.object({
  title: Yup.string().min(3, "Title must be at least 3 characters").max(100, "Title is too long"),
  description: Yup.string().max(1000, "Description is too long"),
  date: Yup.string().required("Date and time are required"),
  location: Yup.string().max(200, "Location is too long"),
  capacity: Yup.number().typeError("Capacity must be a number").min(1, "Minimum is 1"),
  category: Yup.string().required("Please select a category"),
});

function formatLocalDateInput(value) {
  const date = new Date(value);
  const iso = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString();
  return iso.slice(0, 16);
}

function EditEventPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      date: "",
      location: "",
      capacity: "",
      category: "",
    },
    validationSchema: schema,
    onSubmit: async (values, { setSubmitting }) => {
      setError(null);
      try {
        const payload = {
          ...values,
          capacity: Number(values.capacity),
          date: new Date(values.date).toISOString(),
        };
        await api.patch(`/events/${id}`, payload);
        navigate(`/events/${id}`);
      } catch (err) {
        setError(err);
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const [eventRes, categoriesRes] = await Promise.all([
          api.get(`/events/${id}`),
          api.get("/categories"),
        ]);

        const event = eventRes.data;
        setCategories(categoriesRes.data.categories || []);
        formik.setValues({
          title: event.title || "",
          description: event.description || "",
          date: event.date ? formatLocalDateInput(event.date) : "",
          location: event.location || "",
          capacity: event.capacity || "",
          category: event.category?._id || event.category || "",
        });
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  if (loading) {
    return (
      <Container className="py-4">
        <LoadingSpinner text="Loading event..." />
      </Container>
    );
  }

  return (
    <Container className="py-4" style={{ maxWidth: 760 }}>
      <h1 className="page-title">Edit Event</h1>
      <Card className="border-0 shadow-sm rounded-3">
        <Card.Body className="p-4">
          <ErrorAlert error={error} />

          <Form onSubmit={formik.handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.title && !!formik.errors.title}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.title}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
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

            <Row className="g-3 mb-3">
              <Col xs={12} sm={7}>
                <Form.Group>
                  <Form.Label>Date & Time</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="date"
                    value={formik.values.date}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.date && !!formik.errors.date}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.date}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs={12} sm={5}>
                <Form.Group>
                  <Form.Label>Capacity</Form.Label>
                  <Form.Control
                    type="number"
                    min={1}
                    name="capacity"
                    value={formik.values.capacity}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.capacity && !!formik.errors.capacity}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.capacity}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                name="location"
                value={formik.values.location}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.location && !!formik.errors.location}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.location}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Category</Form.Label>
              <Form.Select
                name="category"
                value={formik.values.category}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.category && !!formik.errors.category}
              >
                <option value="">-- Select category --</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {formik.errors.category}
              </Form.Control.Feedback>
            </Form.Group>

            <div className="d-flex gap-2">
              <Button type="submit" disabled={formik.isSubmitting}>
                {formik.isSubmitting ? "Saving..." : "Save Event"}
              </Button>
              <Button variant="outline-secondary" type="button" onClick={() => navigate(`/events/${id}`)}>
                Cancel
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default EditEventPage;
