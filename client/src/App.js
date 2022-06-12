import './App.css';

import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Container, Row, Col, Alert, Card, CardGroup } from 'react-bootstrap';
import API from './API';
import { LoginForm, LogoutButton } from './LoginComponents';
import { MainComponent } from './CourseComponents';
import { StudyPlanOptionForm, StudyPlanTableWrapper } from './StudyPlanComponent';
import { MyNavbar } from './MyNavbar';


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
  const [dirty, setDirty] = useState(false);

  function handleError(err) {
    setMessage({ msg: err.error, type: 'danger' });
    console.log(err);
  }

  useEffect(() => {
    Promise.all([API.getAllCourses(), API.getAllIncompatibilities()])
      .then(responses => {
        setCourses(responses[0]);
        setIncompatibilities(responses[1]);
        setInitialLoading(false);
      })
      .catch(err => handleError(err));
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
        const user = await API.getUserInfo();
        setLoggedIn(true);
        setUser(user);
      } catch (err) {
        //handleError(err);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (dirty) {
      API.getAllCourses()
        .then(courses => {
          setCourses(courses);
          setDirty(false);
        })
        .catch(err => handleError(err));
    }
  }, [dirty]);

  const addStudyPlan = async (sp) => {

    if (studyPlan.length) {
      // i need to delete the old study plan before adding the new one
      API.deleteStudyPlan()
        .then(() => {
          setStudyPlan([]);
          setDirty(true);
          // insert the new study plan
          API.addStudyPlan(sp)
            .then(() => {
              setStudyPlan(sp);
              setDirty(true);
              updateEnrollment();
            }).catch(err => handleError(err));
        }).catch(err => handleError(err));
    } else {
      API.addStudyPlan(sp)
        .then(() => {
          setStudyPlan(sp);
          setDirty(true);
          updateEnrollment();
          setMessage({ msg: 'Study plan added successfully', type: 'success' });
        }).catch(err => handleError(err));
    }
  }

  const deleteStudyPlan = () => {
    API.deleteStudyPlan()
      .then(() => {
        setStudyPlan([]);
        setDirty(true);
        setMessage({ msg: 'Study plan deleted successfully', type: 'success' });
      }).catch(err => handleError(err));
  }

  const updateEnrollment = () => {
    API.updateUserEnrollment(user.isFullTime)
      .then(() => {
        //setMessage({ msg: 'Enrollment updated successfully', type: 'success' });
      }).catch(err => handleError(err));
  }

  const doLogin = (credentials) => {
    API.login(credentials)
      .then(user => {
        setLoggedIn(true);
        setUser(user);
        setMessage({ msg: `Welcome, ${user.name}`, type: 'success' });
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
    setMessage({ msg: 'Log out successfully', type: 'success' });
  }

  function updateStudentsEnrolled(course) {
    setCourses(courses => courses.map(
      c => (c.code === course.code) ? course : c));
  }

  const setFullTime = async (fullTime) => {
    const newUser = { id: user.id, username: user.email, name: user.name, isFullTime: fullTime };
    setUser(newUser);
  }

  return (
    <>
      <MyNavbar loggedIn={loggedIn} user={user} doLogout={doLogout}></MyNavbar>
      <Container>
        <Row><Col>
          {message ? <Alert variant={message.type} onClose={() => setMessage('')} dismissible>{message.msg}</Alert> : false}
        </Col></Row>
        <br />
        <Routes>
          <Route path='/' element={
            initialLoading ? <Loading /> :
              (<>
                {loggedIn ?
                  <>
                    {studyPlan.length ?
                      <Card>
                        <Card.Body>
                          <Card.Title>Study Plan</Card.Title>
                          <StudyPlanTableWrapper courses={studyPlan} deleteStudyPlan={deleteStudyPlan} />
                        </Card.Body>
                      </Card>
                      :
                      <Card>
                        <Card.Body>
                          <Card.Title>Create A New Study Plan</Card.Title>
                          <StudyPlanOptionForm updateFullTime={setFullTime} />
                        </Card.Body>
                      </Card>
                    }

                    <br />
                  </>
                  : false
                }
                <Card>
                  <Card.Body>
                    <Card.Title>List of Available Courses</Card.Title>
                    <MainComponent courses={courses} incompatibilities={incompatibilities} editing={false} />
                  </Card.Body>
                </Card>
              </>)}
          />
          <Route path='/login' element={
            loggedIn ? <Navigate to='/' /> :
              <Card>
                <Card.Body>
                  <Card.Title>Login Form</Card.Title>
                  <LoginForm login={doLogin}></LoginForm>
                </Card.Body>
              </Card>
          } />
          <Route path='/edit' element={
            loggedIn ?
              <Card>
                <Card.Body>
                  <Card.Title>Edit Current Study Plan</Card.Title>
                  <MainComponent courses={courses} updateStudentsEnrolled={updateStudentsEnrolled} incompatibilities={incompatibilities} editing={true} fullTime={user.isFullTime} addStudyPlan={addStudyPlan} studyPlan={studyPlan} updateMessage={setMessage} />
                </Card.Body>
              </Card>
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
