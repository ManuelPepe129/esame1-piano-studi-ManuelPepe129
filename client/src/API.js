/*
   All the API calls
*/

const APIURL = new URL('http://localhost:3001/api/');

async function getAllCourses() {
    // call: GET /api/courses
    const response = await fetch(new URL('courses', APIURL));
    const coursesJson = await response.json();
    if (response.ok) {
        return coursesJson.map((co) => ({ code: co.code, name: co.name, credits: co.credits, propedeuticcourse: co.propedeuticcourse, studentsenrolled: co.studentsenrolled, maxstudentsenrolled: co.maxstudentsenrolled }));
    } else {
        throw coursesJson;  // an object with the error coming from the server
    }
}

async function getAllIncompatibilities() {
    // call: GET /api/incompatibilities
    const response = await fetch(new URL('incompatibilities', APIURL));
    const incompatibilitiesJson = await response.json();
    if (response.ok) {
        return incompatibilitiesJson.map((i) => ({ coursea: i.coursea, courseb: i.courseb }));
    } else {
        throw incompatibilitiesJson;  // an object with the error coming from the server
    }
}

/* USER login API */

async function login(credentials) {
    let response = await fetch(new URL('sessions', APIURL), {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });
    if (response.ok) {
        const user = await response.json();
        return user;
    } else {
        const errDetail = await response.json();
        throw errDetail.message;
    }
}

async function logout() {
    await fetch(new URL('sessions/current', APIURL), { method: 'DELETE', credentials: 'include' });
}

async function getUserInfo() {
    const response = await fetch(new URL('sessions/current', APIURL), { credentials: 'include' });
    const userInfo = await response.json();
    if (response.ok) {
        return userInfo;
    } else {
        throw userInfo;  // an object with the error coming from the server
    }
}


const API = { getAllCourses, getAllIncompatibilities, login, logout, getUserInfo };
export default API;