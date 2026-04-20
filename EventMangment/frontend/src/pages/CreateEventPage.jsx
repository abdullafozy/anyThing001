import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Form,
  Button,
  Card,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FiPlusCircle, FiArrowLeft } from "react-icons/fi";

import { createEvent } from "../services/eventService.js";
import { getCategories } from "../services/categoryService.js";
import ErrorAlert from "../components/ErrorAlert.jsx";

const createEventSchema = Yup.object({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title is too long")
    .required("Title is required"),
  description: Yup.string()
    .max(1000, "Description can't exceed 1000 characters")
    .required("Description is required"),
  date: Yup.string().required("Date and time are required"),
  location: Yup.string()
    .max(200, "Location is too long")
    .required("Location is required"),
  capacity: Yup.number()
    .typeError("Capacity must be a number")
    .min(1, "Capacity must be at least 1")
    .required("Capacity is required"),
  category: Yup.string().required("Please select a category"),
});

function CreateEventPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [catLoading, setCatLoading] = useState(true);

  // load categories once on mount
  useEffect(() => {
    getCategories()
      .then((data) => setCategories(data.categories || []))
      .catch(() => setCategories([]))
      .finally(() => setCatLoading(false));
  }, []);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      date: "",
      location: "",
      capacity: "",
      category: "",
    },
    validationSchema: createEventSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setServerError(null);
      try {
        const payload = {
          ...values,
          capacity: Number(values.capacity),
          // convert local datetime string to ISO format
          date: new Date(values.date).toISOString(),
        };
        const data = await createEvent(payload);
        navigate(`/events/${data.event._id}`);
      } catch (err) {
        setServerError(err);
        setSubmitting(false);
      }
    },
  });

  // shorthand to spread common input props
  function field(name) {
    return {
      name,
      value: formik.values[name],
      onChange: formik.handleChange,
      onBlur: formik.handleBlur,
      isInvalid: formik.touched[name] && !!formik.errors[name],
    };
  }

  return (
    <Container className="py-4" style={{ maxWidth: 700 }}>
      <Button
        variant="link"
        className="text-muted p-0 mb-3 d-flex align-items-center gap-1"
        style={{ fontSize: "0.87rem" }}
        onClick={() => navigate(-1)}
      >
        <FiArrowLeft size={14} />
        Back
      </Button>

      <h1 className="page-title">Create New Event</h1>

      <Card className="border-0 shadow-sm rounded-3">
        <Card.Body className="p-4">
          <ErrorAlert error={serverError} />

          <Form onSubmit={formik.handleSubmit} noValidate>

            {/* title */}
            <Form.Group className="mb-3">
              <Form.Label>Event Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. Node.js Workshop"
                {...field("title")}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.title}
              </Form.Control.Feedback>
            </Form.Group>

            {/* description */}
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Tell attendees what this event is about..."
                {...field("description")}
              />
              <Form.Text className="text-muted" style={{ fontSize: "0.78rem" }}>
                {formik.values.description.length} / 1000 characters
              </Form.Text>
              <Form.Control.Feedback type="invalid">
                {formik.errors.description}
              </Form.Control.Feedback>
            </Form.Group>

            {/* date + capacity in a row */}
            <Row className="g-3 mb-3">
              <Col xs={12} sm={7}>
                <Form.Group>
                  <Form.Label>Date & Time</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    {...field("date")}
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
                    placeholder="e.g. 50"
                    min={1}
                    {...field("capacity")}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.capacity}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            {/* location */}
            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. Cairo Tech Hub, Maadi"
                {...field("location")}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.location}
              </Form.Control.Feedback>
            </Form.Group>

            {/* category */}
            <Form.Group className="mb-4">
              <Form.Label>Category</Form.Label>
              <Form.Select {...field("category")} disabled={catLoading}>
                <option value="">
                  {catLoading ? "Loading categories..." : "-- Select a category --"}
                </option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </Form.Select>
              {categories.length === 0 && !catLoading && (
                <Form.Text className="text-warning" style={{ fontSize: "0.8rem" }}>
                  No categories found. Ask an admin to create one first.
                </Form.Text>
              )}
              <Form.Control.Feedback type="invalid">
                {formik.errors.category}
              </Form.Control.Feedback>
            </Form.Group>

            {/* submit */}
            <div className="d-flex gap-2 align-items-center">
              <Button
                type="submit"
                variant="primary"
                disabled={formik.isSubmitting}
                className="d-flex align-items-center gap-2"
              >
                <FiPlusCircle size={15} />
                {formik.isSubmitting ? "Creating event..." : "Create Event"}
              </Button>
              <Button
                type="button"
                variant="outline-secondary"
                onClick={() => navigate(-1)}
                disabled={formik.isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default CreateEventPage;
