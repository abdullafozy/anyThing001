import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Container, Card, Form, Button } from "react-bootstrap";

import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import ErrorAlert from "../components/ErrorAlert.jsx";

const schema = Yup.object({
  name: Yup.string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name is too long"),
  email: Yup.string().email("Invalid email").required("Email is required"),
});

function ProfilePage() {
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");

  const formik = useFormik({
    initialValues: { name: "", email: "" },
    validationSchema: schema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      setError(null);
      setSuccess("");
      try {
        const res = await api.patch(`/users/${user._id}`, values);
        const updatedUser = { ...user, ...res.data.user };
        const token = localStorage.getItem("token") || "";
        login(token, updatedUser);
        setSuccess("Profile updated successfully.");
      } catch (err) {
        setError(err);
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    async function loadProfile() {
      if (!user?._id) return;
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/users/${user._id}`);
        formik.setValues({
          name: res.data.name || "",
          email: res.data.email || "",
        });
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [user?._id]);

  return (
    <Container className="py-4" style={{ maxWidth: 640 }}>
      <h1 className="page-title">My Profile</h1>

      {loading ? (
        <LoadingSpinner text="Loading profile..." />
      ) : (
        <Card className="border-0 shadow-sm rounded-3">
          <Card.Body className="p-4">
            <ErrorAlert error={error} />
            {success && (
              <div className="alert alert-success py-2 px-3">{success}</div>
            )}

            <Form onSubmit={formik.handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
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

              <Form.Group className="mb-4">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.email && !!formik.errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.email}
                </Form.Control.Feedback>
              </Form.Group>

              <Button type="submit" disabled={formik.isSubmitting}>
                {formik.isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}

export default ProfilePage;
