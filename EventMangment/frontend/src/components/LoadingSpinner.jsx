import React from "react";
import { Spinner } from "react-bootstrap";

function LoadingSpinner({ text = "Loading..." }) {
  return (
    <div className="text-center py-5">
      <Spinner animation="border" variant="primary" role="status" />
      <p className="mt-2 text-muted" style={{ fontSize: "0.9rem" }}>
        {text}
      </p>
    </div>
  );
}

export default LoadingSpinner;
