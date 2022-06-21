import { Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


function LoginForm(props) {
  const [username, setUsername] = useState('test@polito.it');
  const [password, setPassword] = useState('password');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrorMessage('');
    const credentials = { username, password };

    let valid = true;
    let message = '';
    if (username === '') {
      valid = false;
      message = 'Error: empty username';
    } else if (password === '') {
      valid = false;
      message = 'Error: empty password';
    }

    if (valid) {
      props.login(credentials);
    }
    else {
      setErrorMessage(message);
    }
  };

  return (
    <Container>
      <Row>
        <Col>
          <Form onSubmit={handleSubmit}>
            {errorMessage ? <Alert variant='danger'>{errorMessage}</Alert> : ''}
            <Form.Group controlId='username'>
              <Form.Label>email</Form.Label>
              <Form.Control type='email' value={username} onChange={ev => setUsername(ev.target.value)} />
            </Form.Group>
            <Form.Group controlId='password'>
              <Form.Label>Password</Form.Label>
              <Form.Control type='password' value={password} onChange={ev => setPassword(ev.target.value)} />
            </Form.Group>
            <Form.Group>
              <Button type="submit">Login</Button>{' '}
              <Button variant="secondary" onClick={() => navigate('/')}>
                Cancel
              </Button>
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}

function LogoutButton(props) {
  return (<>
    Welcome, {props.user?.name}{'! '}<Button variant="primary" onClick={props.doLogout}>Logout</Button>
  </>);
}

export { LoginForm, LogoutButton };