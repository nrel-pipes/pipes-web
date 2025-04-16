import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

import "../PageStyles.css";

import NavbarSub from "../../layouts/NavbarSub";
import useAuthStore from '../../stores/AuthStore';


const NewPasswordChallengePage = () => {
  const navigate = useNavigate();
  const [newPassword1, setNewPassword1] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [challengeSuccess, setChallengeSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const challengeUsername = useAuthStore((state) => state.challengeUsername);
  const completeNewPasswordChallenge = useAuthStore((state) => state.completeNewPasswordChallenge);
  const tempPassword = useAuthStore((state) => state.tempPassword);

  useEffect(() => {
    if (challengeUsername === null || tempPassword === null) {
      navigate('/login');
    }
  });

  const handleNewPasswordChallenge = async (event) => {
    event.preventDefault()

    if (newPassword1 !== newPassword2) {
      setErrorMessage("New passwords do not match, please try again.");
      return;
    }

    try {
      await completeNewPasswordChallenge(challengeUsername, tempPassword, newPassword2)
      setChallengeSuccess(true);
      setErrorMessage("");
    } catch (error) {
      setChallengeSuccess(false);
      setErrorMessage(error.message);
    }
  };

  if (challengeSuccess) {
    return (
      <div className="text-center" style={{marginTop: "50px"}}>
        <div>
          {errorMessage && <Alert variant="danger" className="text-center">{errorMessage}</Alert>}
        </div>
        <h2>New Password Applied</h2>
        <p>
          Your new password got setup successfully. Please login here <Link href to='/login'>Login</Link>
        </p>
      </div>
    )
  }

  return (
    <>
    <NavbarSub />
    <Container class="mainContent">
      <Row>
        {errorMessage && <Alert variant="danger" className="text-center">{errorMessage}</Alert>}
      </Row>
      <Row>
        <Col sm={4} className="mx-auto mt-5">
          <h3 className="text-center">Setup New Password</h3>
          <Form onSubmit={handleNewPasswordChallenge}>
          <Form.Group controlId="username">
            <Form.Label>Username/Email</Form.Label>
              <Form.Control
                type="username"
                value={challengeUsername != null ? challengeUsername : ''}
                placeholder={challengeUsername}
                title="username"
                readOnly
                disabled
              />
            </Form.Group>
            <Form.Group controlId="newpassword1">
            <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                value={newPassword1}
                onChange={(e) => setNewPassword1(e.target.value)}
                required
                title="Please enter new password"
              />
            </Form.Group>
            <Form.Group controlId="newpassword2">
            <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                value={newPassword2}
                onChange={(e) => setNewPassword2(e.target.value)}
                required
                title="Please confirm new password"
              />
            </Form.Group>
            <div className="d-flex justify-content-center">
              <Button className="mt-3 " variant="outline-secondary" size="lg" style={{ width: '150px' }} type="submit">
                Submit
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
    </>
  );
}


export default NewPasswordChallengePage;
