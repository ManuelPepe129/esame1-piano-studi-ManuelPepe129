import './App.css';

import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { MainComponent } from './CourseComponents';
import { LoginForm } from './LoginComponents';
import API from './API';

function App() {
  const [courses, setCourses] = useState([]);
  const [incompatibilities, setIncompatibilities] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);  // no user is logged in when app loads
  const [user, setUser] = useState({});
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
    <Router>
      <Routes>
        <Route path='/' element={
          <>
            <MainComponent courses={courses} incompatibilities={incompatibilities} />
            {(!loggedIn) ? <LoginForm login={doLogin}></LoginForm> : false}
          </>
        }>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
