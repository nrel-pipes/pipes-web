import React from "react";
import {Alert, Container, Row} from "react-bootstrap";

export default function GenericError({
  header,
  description,
  id,
  show,
  setShow,
}) {
  return (
    <Alert
      variant="danger"
      className="text-center"
      onClose={() => setShow(true)}
      dismissible
      id={id}
      show={show}
    >
      <Alert.Heading>{header}</Alert.Heading>
      <p>{description}</p>
      <p>Please contact PIPES support if you continue to experience issues.</p>
    </Alert>
  );
}
