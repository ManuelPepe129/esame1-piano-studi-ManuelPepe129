import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Col, Row, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { CaretDown, CaretUp, Plus, Dash } from 'react-bootstrap-icons';
import { useState } from 'react';

function CoursesTable(props) {


    function calculateIncompatibilities(course) {
        let tmp = [];
        props.incompatibilities.forEach((element) => {
            if (element.coursea === course.code) {
                tmp.push(element.courseb);
            } else if (element.courseb === course.code) {
                tmp.push(element.coursea);
            }
        });

        return tmp;
    }

    return (
        <Row>
            <Col>
                <Table>
                    <thead>
                        <tr>
                            <th>Code</th>
                            <th>Course</th>
                            <th>Credits</th>
                            <th>StudentsEnrolled</th>
                            <th>MaxStudentsEnrolled</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            props.courses.map((course) =>
                                <CourseRow course={course} key={course.code}
                                    incompatibilities={calculateIncompatibilities(course)}
                                    editing={props.editing}
                                    studyPlan={props.studyPlan}
                                    addCourseToPlan={props.addCourseToPlan}
                                    removeCourseToPlan={props.removeCourseToPlan}
                                />)
                        }
                    </tbody>
                </Table>
            </Col>
        </Row>
    );

}

function CourseRow(props) {
    const [displayDetails, setDisplayDetails] = useState(false);

    let statusClass = null;

    if (props.studyPlan.find(c => c.code === props.course.code)) {
        statusClass = 'table-primary';
    }


    const toggleDisplayDetails = () => {
        setDisplayDetails(!displayDetails);
    }

    return (
        <>
            <tr className={statusClass}>
                <CourseData course={props.course} />
                <CourseActions course={props.course} toggleDisplayDetails={toggleDisplayDetails} incompatibilities={props.incompatibilities} displayDetails={displayDetails} editing={props.editing} studyPlan={props.studyPlan} action={props.studyPlan.find(c => c.code === props.course.code) ? props.removeCourseToPlan : props.addCourseToPlan} />
            </tr>
            {
                displayDetails ?
                    <CourseDetails course={props.course} incompatibilities={props.incompatibilities} editing={props.editing} />
                    : false
            }
        </>
    );
}

function CourseActions(props) {
    let message = '';

    function checkIncompatibilities() {
        for (const inc of props.incompatibilities) {
            if (props.studyPlan.find(c => c.code === inc)) {
                message = `This course is incompatible with ${inc}`;
                return true;
            }
        }
        return false;
    }

    function checkPropedeuticCourses() {
        if (props.course.propedeuticcourse) {
            if (props.studyPlan.find(c => c.code === props.course.propedeuticcourse)) {
                return false;
            } else {
                message = `Please add propedeutic course ${props.course.propedeuticcourse}`;
                return true;
            }
        } else {
            return false;
        }
    }

    function checkMaxStudentsEnrolled() {
        if (props.course.maxstudentsenrolled && (props.course.studentsenrolled >= props.course.maxstudentsenrolled) && !props.studyPlan.find(c => c.code === props.course.code)) {
            message = `Course reached max students enrolled`;
            return true;
        }
        return false;
    }

    function checkIsPropedeutic() {
        for (const course of props.studyPlan) {
            if (course.propedeuticcourse === props.course.code) {
                message = `This course is propedeutic for ${course.code}`;
                return true;
            }
        }
        return false;
    }

    const disabled = (checkIncompatibilities() || checkPropedeuticCourses() || checkMaxStudentsEnrolled() || checkIsPropedeutic());

    return (
        <td>
            <Button onClick={() => { props.toggleDisplayDetails(); }} variant="outline-secondary">{props.displayDetails ? <CaretUp /> : <CaretDown />}</Button>{' '}
            {props.editing ?
                disabled ?
                    <OverlayTrigger overlay={<Tooltip id="tooltip-disabled" >{message}</Tooltip>}>
                        <span className="d-inline-block">
                            <Button disabled={disabled} onClick={() => props.action(props.course)}> {props.studyPlan.find(c => c.code === props.course.code) ? <Dash /> : <Plus />} </Button>
                        </span>
                    </OverlayTrigger>
                    : <Button disabled={disabled} onClick={() => props.action(props.course)}> {props.studyPlan.find(c => c.code === props.course.code) ? <Dash /> : <Plus />} </Button>

                : false}
        </td>
    );
}

function CourseData(props) {
    return (
        <>
            <td>{props.course.code}</td>
            <td>{props.course.name}</td>
            <td>{props.course.credits}</td>
            <td>{props.course.studentsenrolled}</td>
            <td>{props.course.maxstudentsenrolled}</td>
        </>
    )
}

function CourseDetails(props) {
    function displayIncompatibilities() {
        let str = '';
        for (let i = 0; i < props.incompatibilities.length; i++) {
            str += props.incompatibilities[i];
            if (i !== props.incompatibilities.length - 1) {
                str += ", ";
            }
        }
        return str;
    }

    return (
        <>
            <tr>
                <td className="fw-bold">Propedeutic Course</td>
                <td>{props.course.propedeuticcourse ? props.course.propedeuticcourse : 'N/A'}</td>
            </tr>
            <tr>
                <td className="fw-bold">Incompatible Courses: </td>
                <td> {props.incompatibilities.length ? displayIncompatibilities() : 'N/A'}</td>
            </tr>
        </>
    )
}

export { CoursesTable };