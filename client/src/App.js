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
  const [initialLoading, setInitialLoading] = useState(true);
  const [fullTime, setFullTime] = useState(true);


  function handleError(err) {
    setMessage(err.error);
   //console.log(err.error);
  }

  useEffect(() => {
    Promise.all([API.getAllCourses(), API.getAllIncompatibilities()])
      .then(responses => {
        setCourses(responses[0]);
        setIncompatibilities(responses[1]);
        setInitialLoading(false);
      })
      .catch(err => handleError(err));
    /*
    API.getAllCourses()
      .then((courses) => { setCourses(courses); })
      .catch(err => handleError(err));
    API.getAllIncompatibilities()
      .then((incompatibilities) => { setIncompatibilities(incompatibilities); })
      .catch(err => handleError(err));
      */
    //setInitialLoading(false);
  }, []);

  useEffect(() => {
    if (loggedIn && !initialLoading) {
      API.getStudyPlan()
        .then((sp) => {
          if (sp.length === 0) {
            setStudyPlan(sp);
          } else {
            const courses_tmp = courses.filter(course => sp.find(c => c.course === course.code))
              .map((course) => ({ code: course.code, name: course.name, credits: course.credits }));

            setStudyPlan(courses_tmp);
          }
        })
        .catch(err => handleError(err));
    }
  }, [loggedIn, initialLoading]);

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

  const updateStudyPlan = (sp) => {
    API.updateStudyPlan(sp)
      .then(setStudyPlan(sp))
      .catch(err => handleError(err));
  }

  const doLogin = (credentials) => {
    API.login(credentials)
      .then(user => {
        setLoggedIn(true);
        setUser(user);
        setMessage('');
        // navigate('/');
      })
      .catch(err => {
        handleError(err);
      });
  }

  const doLogout = async () => {
    await API.logout();
    setLoggedIn(false);
    setUser({});
    setStudyPlan([]);
  }
  /*
    const getStudyPlanDetails = (studyPlan_) => {
      const courses_tmp = courses.filter(course => studyPlan_.find(c => c.course === course.code))
        .map((course) => ({ code: course.code, name: course.name, credits: course.credits }));
      console.log(`studyplandetails: ${courses_tmp}`);
      return courses_tmp;
    }
    */




  return (
    <>
      <Container>
        <Row><Col>
          {loggedIn ? <LogoutButton logout={doLogout} user={user} /> : false}
        </Col></Row>
        <Row><Col>
          {message ? <Alert variant='danger' onClose={() => setMessage('')} dismissible>{message}</Alert> : false}
        </Col></Row>
      

      <Routes>
        <Route path='/' element={
          initialLoading ? <Loading /> :
            loggedIn ? (<>
              {studyPlan.length ?
                <StudyPlanTable courses={studyPlan} />
                : <StudyPlanOptionForm updateFullTime={setFullTime} />
              }
              <MainComponent courses={courses} incompatibilities={incompatibilities} editing={false} />
            </>)
              : <Navigate to='/login' />}
        />
        <Route path='/login' element={
          loggedIn ? <Navigate to='/' /> :
            <>
              <LoginForm login={doLogin}></LoginForm>
              <MainComponent courses={courses} incompatibilities={incompatibilities} />
            </>
        } />
        <Route path='/edit' element={
          loggedIn ? <>
            <MainComponent courses={courses} incompatibilities={incompatibilities} editing={true} fullTime={fullTime} updateStudyPlan={updateStudyPlan} />
          </>
            : <Navigate to='/login' />
        } />
        < Route path='*' element={<h1>Page not found</h1>} />
      </Routes>
      </Container>
    </>
  );
}

function Loading(props) {
  return (
    <h2>Loading data ...</h2>
  )
}

export default App;
