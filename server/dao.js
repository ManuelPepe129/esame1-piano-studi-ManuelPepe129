'use strict'

const sqlite = require('sqlite3');
const { Course } = require('./course');

const db = new sqlite.Database('courses.db', (err) => {
    if (err) throw err;
});

//get all courses
exports.listCourses = () => {
    return new Promise((resolve, reject) => {
        // const sql = "SELECT * FROM courses ORDER BY code";
        const sql = `SELECT code, name, credits, propedeuticcourse, maxstudentsenrolled, count(course) AS studentsenrolled 
            FROM courses C  LEFT JOIN studyplans S ON C.code = S.course 
            GROUP BY code`;

        db.all(sql, [], (err, rows) => {
            if (err)
                reject(err);
            else {
                const courses = rows.map(row => new Course(row.code, row.name, row.credits, row.propedeuticcourse, row.maxstudentsenrolled, row.studentsenrolled));
                resolve(courses);
            }
        });
    })
}

exports.listIncompatibilities = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM incompatibilities ORDER BY coursea';

        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                const incompatibilities = rows.map(row => ({coursea:row.coursea, courseb:row.courseb}));
                resolve(incompatibilities);
            }
        })
    })
}
