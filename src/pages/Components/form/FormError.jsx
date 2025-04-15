import { useState } from "react";
import Alert from "react-bootstrap/Alert";

const FormError = ({ errorMessage }) => {
  const [show, setShow] = useState(true);

  if (show) {
    return (
      <Alert variant="danger" onClose={() => setShow(false)} dismissible>
        <Alert.Heading>Oh snap! {errorMessage}</Alert.Heading>
      </Alert>
    );
  }
};

export default FormError;
