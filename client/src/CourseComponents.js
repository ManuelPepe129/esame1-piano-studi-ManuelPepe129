import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Col, Row, Button } from 'react-bootstrap';
import { CaretDown, CaretUp, Plus, Dash } from 'react-bootstrap-icons';
import { useState } from 'react';

function MainComponent(props) {
    return (
        <>
            <Row>
                <Col>
                    <h1>List of Available Courses</h1>
                </Col>
            </Row>
            <Row>
                <Col>
                    <CoursesTable courses={props.courses} incompatibilities={props.incompatibilities} editing={props.editing} fullTime={props.fullTime}
                        studyPlan={props.studyPlan} updateStudyPlan={props.updateStudyPlan}></CoursesTable>
                </Col>
            </Row>
        </>
    );
}

function CoursesTable(props) {
    const [planTmp, setPlanTmp] = useState(props.studyPlan ? props.studyPlan : []);

    const currentCredits = planTmp.reduce((count, c) => count + c.credits, 0)
    const maxCredits = props.fullTime ? 80 : 40;
    const minCredits = props.fullTime ? 40 : 20;

    const addCourseToPlan = (course) => {
        // setPlanTmp((oldCourses) => [...oldCourses, { code: course.code, name: course.name, credits: course.credits }]);
        setPlanTmp((oldCourses) => [...oldCourses, course]);
        // console.log(planTmp);
    }

    const removeCourseToPlan = (course) => {
        setPlanTmp(planTmp.filter((c) => c.code !== course.code))
        // console.log(planTmp);
    }

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

    function handleStudyPlanUpdate() {
        if (checkCredits()) {
            props.updateStudyPlan(planTmp);
        } else {
            console.log(`Insert between ${minCredits} and ${maxCredits} credits`);
        }
    }

    function checkCredits() {
        if (currentCredits >= minCredits && currentCredits <= maxCredits) {
            return true;
        } else {
            return false;
        }
    }


    return (
        <>
            {props.editing ?
                <>
                    <p>Insert between {minCredits} and {maxCredits} credits</p>
                    <br />
                    <p> Credits: {currentCredits}</p>
                    <Button onClick={() => handleStudyPlanUpdate()}>Confirm Study Plan</Button>
                </>
                : false}
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
                        props.courses.map((course) => <CourseRow course={course} key={course.code} incompatibilities={calculateIncompatibilities(course)} editing={props.editing} planTmp={planTmp} addCourseToPlan={addCourseToPlan} removeCourseToPlan={removeCourseToPlan} />)
                    }
                </tbody>
            </Table>
        </>
    );

}

function CourseRow(props) {
    const [displayDetails, setDisplayDetails] = useState(false);

    let statusClass = null;

    if (props.planTmp.find(c => c.code === props.course.code)) {
        statusClass = 'table-warning';
    }


    const toggleDisplayDetails = () => {
        setDisplayDetails(!displayDetails);
    }

    return (
        <>
            <tr className={statusClass}>
                <CourseData course={props.course} />
                <CourseActions course={props.course} toggleDisplayDetails={toggleDisplayDetails} incompatibilities={props.incompatibilities} displayDetails={displayDetails} editing={props.editing} planTmp={props.planTmp} addCourseToPlan={props.addCourseToPlan} removeCourseToPlan={props.removeCourseToPlan} />
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

    function checkIncompatibilities() {
        for (const inc of props.incompatibilities) {
            if (props.planTmp.find(c => c.code === inc)) {
                return true;
            }
        }
        return false;
    }

    function checkPropedeuticCourses() {
        if (props.course.propedeuticcourse) {
            if (props.planTmp.find(c => c.code === props.course.propedeuticcourse)) {
                return false;
            } else {
                return true;
            }
        } else {
            return false;
        }

    }

    const disabled = (checkIncompatibilities() || checkPropedeuticCourses());

    return (
        <td>
            <Button onClick={() => { props.toggleDisplayDetails(); }} variant="outline-secondary">{props.displayDetails ? <CaretUp /> : <CaretDown />}</Button>
            {props.editing ?
                props.planTmp.find(c => c.code === props.course.code) ?
                    <Button onClick={() => props.removeCourseToPlan(props.course)}><Dash /></Button> :
                    <Button disabled={disabled} onClick={() => props.addCourseToPlan(props.course)}> <Plus /></Button> :
                false}
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

export { MainComponent };