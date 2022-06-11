import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Navbar, Button, Container, Nav } from 'react-bootstrap';
import { PersonCircle } from 'react-bootstrap-icons';
import { Link, useNavigate } from 'react-router-dom';
import { LogoutButton } from './LoginComponents';


function MyNavbar(props) {
    const navigate = useNavigate();
    return (
        <Navbar variant="primary" bg="light">
            <Container fluid>
                <Navbar.Brand className='title'>Study Plan</Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text>
                        {props.loggedIn ? <LogoutButton user={props.user} doLogout={props.doLogout} /> : <Button onClick={() => navigate('/login')}>Log In</Button>}{' '}
                        <PersonCircle width="25" height="25" fill="currentColor" />
                    </Navbar.Text>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export { MyNavbar };