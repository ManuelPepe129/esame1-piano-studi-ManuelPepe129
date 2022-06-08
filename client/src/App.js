import './App.css';

import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import API from './API';
import { LoginForm, LogoutButton } from './LoginComponents';
import { MainComponent } from './CourseComponents';
import { StudyPlanOptionForm, StudyPlanTable } from './StudyPlanComponent';


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
        const studyPlan = await API.getStudyPlan();
        setStudyPlan(getStudyPlanDetails(studyPlan));
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
        API.getStudyPlan()
          .then(studyPlan => {
            setStudyPlan(getStudyPlanDetails(studyPlan));
          })
          .catch(err => {
            handleError(err);
          })
      })
      .catch(err => {
        handleError(err);
      }
      )
  }

  const doLogout = async () => {
    await API.logout();
    setLoggedIn(false);
    setUser({});
    setStudyPlan([]);
  }

  const getStudyPlanDetails = (studyPlan_) => {
    const courses_tmp = courses.filter(course => studyPlan_.find(c => c.course === course.code))
      .map((course) => ({ code: course.code, name: course.name, credits: course.credits }));
    console.log(`studyplandetails: ${courses_tmp}`);
    return courses_tmp;
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
          loggedIn ? (<>
            <MainComponent courses={courses} incompatibilities={incompatibilities} /><StudyPlanTable courses={studyPlan} />
          </>)
            : <Navigate to='/login' />}
        />
        <Route path='/login' element={
          loggedIn ? <Navigate to='/' /> : <>
            <MainComponent courses={courses} incompatibilities={incompatibilities} />
            <LoginForm login={doLogin}></LoginForm>
          </>
        } />
        <Route path='/edit' element={
          <StudyPlanOptionForm />
        } />
        <Route path='/studyplan' element={
          loggedIn ? (
            <>
              <MainComponent courses={courses} incompatibilities={incompatibilities} />
              <StudyPlanTable courses={courses} />
            </>) : <Navigate to='/login' />
        } />
      </Routes>
    </>
  );
}

export default App;
