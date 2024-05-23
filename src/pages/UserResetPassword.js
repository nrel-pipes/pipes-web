import { useState } from "react"
import { Link } from "react-router-dom"

import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

import useConfigStore from './stores/configStore';
import useAuthStore from './stores/authStore';


const ResetPassword = () => {
  const poolData = useConfigStore((state) => state.poolData);
  const resetPassword = useAuthStore((state) => state.resetPassword);
  const passwordResetUsername = useAuthStore((state) => state.passwordResetUsername);

  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword1, setNewPassword1] = useState('');
  const [newPassword2, setNewPassword2] = useState('');
  const [errorMessage, setErrorMessage] = useState('')
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (newPassword1 !== newPassword2) {
      setErrorMessage("New passwords do not match, please confirm.");
      return;
    }

    try {
      await resetPassword(passwordResetUsername, verificationCode, newPassword2, poolData);
      setResetSuccess(true);
    } catch (error) {
      setResetSuccess(false);
      setErrorMessage(error.message);
    }
  }

  if (resetSuccess) {
    return (
      <div className="text-center" style={{marginTop: "50px"}}>
        <div>
          {errorMessage && <Alert variant="danger" className="text-center">{errorMessage}</Alert>}
        </div>
        <h2>Password Reset Complete</h2>
        <p>
          Your new password got reset successfully. Please login here <Link href to='/login'>Login</Link>
        </p>
      </div>
    )
  }

  return (
    <Container className="vh-100">
      <Row>
        {errorMessage && <Alert variant="danger" className="text-center">{errorMessage}</Alert>}
      </Row>
      <Row>
        <Col sm={4} className="mx-auto mt-5">
          <h2 className="text-center">Reset Password</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="verificationcode">
              <Form.Label>Verification Code</Form.Label>
              <Form.Control
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
                title="Please enter your verification code"
              />
            </Form.Group>
            <Form.Group controlId="newpassword">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                value={newPassword1}
                onChange={(e) => setNewPassword1(e.target.value)}
                required
                title="Please enter your new password"
              />
            </Form.Group>
            <Form.Group controlId="newpassword2">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                value={newPassword2}
                onChange={(e) => setNewPassword2(e.target.value)}
                required
                title="Please confirm your new password"
              />
            </Form.Group>
            <div className="d-flex justify-content-center">
              <Button className="mt-3 " variant="outline-secondary" size="lg" style={{ width: '150px' }} type="submit">
                Submit
              </Button>
            </div>
            <div className="mt-3 text-center">
              <Link to="/forgot-password">Request a code again? Click here</Link>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}


export default ResetPassword;
