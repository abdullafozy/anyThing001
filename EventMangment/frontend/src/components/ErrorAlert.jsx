import React from "react";
import { Alert } from "react-bootstrap";

// shows a simple error box
// message can be a string or an axios error object
function ErrorAlert({ error }) {
  if (!error) return null;

  let message = "Something went wrong. Please try again.";

  if (typeof error === "string") {
    message = error;
  } else if (error?.response?.data?.message) {
    message = error.response.data.message;
  } else if (error?.message) {
    message = error.message;
  }

  return (
    <Alert variant="danger" className="py-2 px-3" style={{ fontSize: "0.88rem" }}>
      {message}
    </Alert>
  );
}

export default ErrorAlert;
