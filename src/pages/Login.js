import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";

import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

import useAuthStore from './stores/authStore';
import useConfigStore from './stores/configStore';


const Login = () => {
  const { login, loginError, isLoggedIn } = useAuthStore(state => ({
    login: state.login,
    loginError: state.loginError,
    isLoggedIn: state.isLoggedIn
  }));

  // Cognito configuration
  const poolData = useConfigStore((state) => state.poolData);

  // State for username and password
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError('Username and password are required.');
      return;
    }

    console.log("===1", loginError);

    // Handle login logic here
    await login(username, password, poolData);

    console.log("===2", loginError);

    if (loginError != null) {
      setError(loginError);
    }
    // .then((result) => {
    //   if (
    //     result.hasOwnProperty('new_password_challenge') &&
    //     result.new_password_challenge === true
    //   ) {
    //     navigate(`/setup-new-password/${username}`);
    //   } else {
    //     navigate('/');
    //   }
    // })
    // .catch((error) => {
    //   setError(error);
    // });
  };

  if (isLoggedIn) {
    return (
      <Container fluid>
        <Row>
          <Col className='mx-auto mt-5'>
            <p>You are already logged in.</p>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container fluid>
      <Row>
        {error && (
          <Alert variant='danger' className='text-center'>
            {error}
          </Alert>
        )}
      </Row>

      <Row>
        <Col sm={4} className='mx-auto mt-5'>
          <h1 className='text-center'>Welcome!</h1>
          <Form onSubmit={handleLogin}>
            <Form.Group controlId='username'>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter user email'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                title='Please enter your email'
              />
            </Form.Group>

            <Form.Group controlId='password'>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type='password'
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                title='Please enter your password'
              />
            </Form.Group>

            <div className='d-flex justify-content-center'>
              <Button
                className='mt-3 '
                variant='outline-secondary'
                size='lg'
                style={{ width: '150px' }}
                type='submit'
              >
                Login
              </Button>
            </div>
            <div className='mt-3 text-center'>
              <Link to='https://nrel-pipes.github.io/pipes-core/troubleshooting__faq.html#pipes-team-contacts' target="_blank">
                Don't have an account?
              </Link>{' '}
              <Link to='/forgot-password'>Forgot the password?</Link>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};


export default Login;
