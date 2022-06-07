import './App.css';

import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { MainComponent } from './CourseComponents';
import { LoginForm, LogoutButton } from './LoginComponents';
import API from './API';
import { Container, Row, Col, Alert } from 'react-bootstrap';

function App() {
  return (
    <Router>
      <App2 />
    </Router>
  );
}

function App2() {
  const [courses, setCourses] = useState([]);
  const [incompatibilities, setIncompatibilities] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);  // no user is logged in when app loads
  const [user, setUser] = useState({});
  const [studyPlan, setStudyPlan] = useState([]);
  const [message, setMessage] = useState('');

  function handleError(err) {
    console.log(err);
  }

  useEffect(() => {
    API.getAllCourses()
      .then((courses) => { setCourses(courses); })
      .catch(err => handleError(err));
    API.getAllIncompatibilities()
      .then((incompatibilities) => { setIncompatibilities(incompatibilities); })
      .catch(err => handleError(err));
  }, [])

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // here you have the user info, if already logged in
        // TODO: store them somewhere and use them, if needed
        const user = await API.getUserInfo();
        setLoggedIn(true);
        setUser(user);
      } catch (err) {
        handleError(err);
      }
    };
    checkAuth();
  }, []);

  const doLogin = (credentials) => {
    API.login(credentials)
      .then(user => {
        setLoggedIn(true);
        setUser(user);
        setMessage('');
        // navigate('/');
      })
      .catch(err => {
        setMessage(err);
      }
      )
  }

  const doLogout = async () => {
    await API.logout();
    setLoggedIn(false);
    setUser({});
  }


  return (
    <>
      <Container>
        <Row><Col>
          {loggedIn ? <LogoutButton logout={doLogout} user={user} /> : false}
        </Col></Row>
        <Row><Col>
          {message ? <Alert variant='danger' onClose={() => setMessage('')} dismissible>{message}</Alert> : false}
        </Col></Row>
      </Container>

      <Routes>
        <Route path='/' element={
          loggedIn ? (
            <MainComponent courses={courses} incompatibilities={incompatibilities} />) : <Navigate to='/login' />}
        />
        <Route path='/login' element={
          loggedIn ? <Navigate to='/' /> : <>
            <MainComponent courses={courses} incompatibilities={incompatibilities} />
            <LoginForm login={doLogin}></LoginForm>
          </>
        } />
      </Routes>
    </>
  );
}

export default App;
