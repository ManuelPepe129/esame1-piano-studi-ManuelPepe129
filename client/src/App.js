import './App.css';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import API from './API';
import { MyNavbar } from './MyNavbar';
import { MyAlert } from './AlertComponent';
import { StudyPlanTableCard, StudyPlanOptionFormCard, MainComponentCard, LoginFormCard } from './CardWrapperComponents';


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
    if (err.errors) {
      setMessage({ msg: err.errors[0].msg + ': ' + err.errors[0].param, type: 'danger' });
    } else {
      setMessage({ msg: err.error, type: 'danger' });
    }
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
    // se c'è già un piano di studi
    if (studyPlan.length) {
      // devo cancellare il piano vecchio prima di aggiungerne uno nuovo
      await API.deleteStudyPlan()
        .then(() => {
          setStudyPlan([]);
        }).catch(err => handleError(err));
    }

    // aggiorno l'iscrizione
    await API.updateUserEnrollment(user.isFullTime)
      .then(() => {
        //setMessage({ msg: 'Enrollment updated successfully', type: 'success' });
      }).catch(err => handleError(err));

    // aggiungo il nuovo piano di studi
    API.addStudyPlan({ courses: sp })
      .then(() => {
        setStudyPlan(sp);
        setDirty(true);
        setMessage({ msg: 'Study plan added successfully', type: 'success' });
      }).catch(err => handleError(err));
  }

  const deleteStudyPlan = () => {
    API.deleteStudyPlan()
      .then(() => {
        setStudyPlan([]);
        setDirty(true);
        setMessage({ msg: 'Study plan deleted successfully', type: 'success' });
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

  function setFullTime(fullTime) {
    const newUser = { id: user.id, username: user.email, name: user.name, isFullTime: fullTime };
    setUser(newUser);
  }

  return (
    <>
      <MyNavbar loggedIn={loggedIn} user={user} doLogout={doLogout}></MyNavbar>
      <Container>
        <Row><Col>
          <MyAlert message={message} setMessage={setMessage} />
        </Col></Row>
        <br />
        <Routes>
          <Route path='/' element={
            initialLoading ? <Loading /> :
              (<>
                {loggedIn ?
                  <>
                    {studyPlan.length ?
                      <StudyPlanTableCard courses={studyPlan} deleteStudyPlan={deleteStudyPlan} />
                      :
                      <StudyPlanOptionFormCard updateFullTime={setFullTime} />
                    }
                    <br />
                  </>
                  : false
                }
                <MainComponentCard courses={courses} incompatibilities={incompatibilities} editing={false} title={"List of Available Courses"} />
              </>)}
          />
          <Route path='/login' element={
            loggedIn ? <Navigate to='/' /> :
              <LoginFormCard login={doLogin}></LoginFormCard>
          } />
          <Route path='/edit' element={
            loggedIn ?
              <MainComponentCard title={"Edit Current Study Plan"} courses={courses} updateStudentsEnrolled={updateStudentsEnrolled} incompatibilities={incompatibilities} editing={true} fullTime={user.isFullTime} addStudyPlan={addStudyPlan} studyPlan={studyPlan} updateMessage={setMessage} />
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
