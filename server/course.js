'use strict'

function Course(code, name, credits, propedeuticcourse, maxstudentsenrolled, studentsenrolled) {
    this.code = code;
    this.name = name;
    this.credits = credits;
    this.propedeuticcourse = propedeuticcourse;
    this.maxstudentsenrolled = maxstudentsenrolled;
    this.studentsenrolled = studentsenrolled;
}

exports.Course = Course;