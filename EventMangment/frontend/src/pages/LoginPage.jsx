import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Form, Button, Card, Container, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FiLogIn } from "react-icons/fi";

import { loginUser } from "../services/authService.js";
import { useAuth } from "../context/AuthContext.jsx";
import ErrorAlert from "../components/ErrorAlert.jsx";

const loginSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

function LoginPage() {
  const [serverError, setServerError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setServerError(null);
      try {
        const data = await loginUser(values);
        login(data.token, data.user);
        navigate("/");
      } catch (err) {
        setServerError(err);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} sm={10} md={6} lg={5}>
          <Card className="border-0 shadow-sm rounded-3">
            <Card.Body className="p-4">
              <h4 className="fw-bold mb-1">Welcome back</h4>
              <p className="text-muted mb-4" style={{ fontSize: "0.9rem" }}>
                Login to your account
              </p>

              <ErrorAlert error={serverError} />

              <Form onSubmit={formik.handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="ahmed@gmail.com"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.email && !!formik.errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.password && !!formik.errors.password}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.password}
                  </Form.Control.Feedback>
                </Form.Group>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-100 d-flex align-items-center justify-content-center gap-2"
                  disabled={formik.isSubmitting}
                >
                  <FiLogIn size={16} />
                  {formik.isSubmitting ? "Logging in..." : "Login"}
                </Button>
              </Form>

              <p className="text-center text-muted mt-3 mb-0" style={{ fontSize: "0.88rem" }}>
                Don't have an account?{" "}
                <Link to="/register" className="text-primary">
                  Register
                </Link>
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginPage;
