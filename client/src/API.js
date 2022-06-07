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

const API = { getAllCourses, getAllIncompatibilities };
export default API;