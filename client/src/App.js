import './App.css';

import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { MainComponent } from './CourseComponents';
import API from './API';

function App() {
  const [courses, setCourses] = useState([]);
  const [incompatibilities, setIncompatibilities] = useState([]);

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

  return (
    <Router>
      <Routes>
        <Route path='/' element={<MainComponent courses={courses} incompatibilities={incompatibilities} />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
