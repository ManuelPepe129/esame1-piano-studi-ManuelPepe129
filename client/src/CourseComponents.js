import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Col, Row, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { CaretDown, CaretUp, Plus, Dash } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

// TODO: aggiungere "non puoi aggiungere questo corso perché ecc..."
// TODO: check sul numero massimo di studenti iscritti
// FIXME: check quando si rimuove un corso propedeutico (fare i check anche nel submit del form)

function MainComponent(props) {
    return (
        <Row>
            <Col>
                <CoursesTable courses={props.courses} updateStudentsEnrolled={props.updateStudentsEnrolled} incompatibilities={props.incompatibilities} editing={props.editing} fullTime={props.fullTime}
                    studyPlan={props.studyPlan} addStudyPlan={props.addStudyPlan} updateMessage={props.updateMessage}></CoursesTable>
            </Col>
        </Row>
    );
}

function CoursesTable(props) {
    const [planTmp, setPlanTmp] = useState(props.studyPlan ? props.studyPlan : []);

    const navigate = useNavigate();

    const currentCredits = planTmp.reduce((count, c) => count + c.credits, 0)
    const maxCredits = props.fullTime ? 80 : 40;
    const minCredits = props.fullTime ? 40 : 20;

    const addCourseToPlan = (course) => {
        // setPlanTmp((oldCourses) => [...oldCourses, { code: course.code, name: course.name, credits: course.credits }]);
        setPlanTmp((oldCourses) => [...oldCourses, course]);
        const newCourse = {
            code: course.code,
            name: course.name,
            credits: course.credits,
            propedeuticcourse: course.propedeuticcourse,
            studentsenrolled: course.studentsenrolled + 1,
            maxstudentsenrolled: course.maxstudentsenrolled
        };
        props.updateStudentsEnrolled(newCourse);

    }

    const removeCourseToPlan = (course) => {
        setPlanTmp(planTmp.filter((c) => c.code !== course.code));
        const newCourse = {
            code: course.code,
            name: course.name,
            credits: course.credits,
            propedeuticcourse: course.propedeuticcourse,
            studentsenrolled: course.studentsenrolled - 1,
            maxstudentsenrolled: course.maxstudentsenrolled
        };
        props.updateStudentsEnrolled(newCourse);
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
            if (checkPropedeuticCourses()) {
                if (checkIncompatibleCourses()) {
                    props.addStudyPlan(planTmp);
                    navigate('/');
                } else {
                    props.updateMessage({ msg: "Some courses are not compatible", type: 'warning' });
                }
            } else {
                props.updateMessage({ msg: "Missing propedeutic course", type: 'warning' });
            }
        } else {
            props.updateMessage({ msg: `Insert between ${minCredits} and ${maxCredits} credits`, type: 'warning' });
        }
    }

    /* Checks on submission */


    function checkCredits() {
        if (currentCredits >= minCredits && currentCredits <= maxCredits) {
            return true;
        } else {
            return false;
        }
    }

    function checkPropedeuticCourses() {
        for (const course of planTmp) {
            if (course.propedeuticcourse) {
                if (!planTmp.find(c => c.code === course.propedeuticcourse)) {
                    return false;
                }
            }
        }
        return true;
    }

    function checkIncompatibleCourses() {
        for (const course of planTmp) {
            const incompatibilities = calculateIncompatibilities(course);
            for (const incompatible of incompatibilities) {
                if (planTmp.find(c => c.code === incompatible)) {
                    return false;
                }
            }
        }
        return true;
    }


    return (
        <>
            {props.editing ?
                <>
                    <Row><p>Insert between {minCredits} and {maxCredits} credits</p></Row>

                    <Row>
                        <p> Credits in current study plan: {currentCredits}</p>
                    </Row>
                    <Row>
                        <Col>
                            <Button variant='primary' onClick={() => handleStudyPlanUpdate()}>Confirm Study Plan</Button>{' '}
                            <Button variant='warning' onClick={() => navigate('/')}>Cancel</Button>
                        </Col>
                    </Row>
                </>
                : false}
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
                                        planTmp={planTmp}
                                        addCourseToPlan={addCourseToPlan}
                                        removeCourseToPlan={removeCourseToPlan}
                                    />)
                            }
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </>
    );

}

function CourseRow(props) {
    const [displayDetails, setDisplayDetails] = useState(false);
    // const inStudyPlan = props.planTmp.find(c => c.code === props.course.code) ? true : false;

    let statusClass = null;

    if (props.planTmp.find(c => c.code === props.course.code)) {
        statusClass = 'table-primary';
    }


    const toggleDisplayDetails = () => {
        setDisplayDetails(!displayDetails);
    }

    return (
        <>
            <tr className={statusClass}>
                <CourseData course={props.course} />
                <CourseActions course={props.course} toggleDisplayDetails={toggleDisplayDetails} incompatibilities={props.incompatibilities} displayDetails={displayDetails} editing={props.editing} planTmp={props.planTmp} action={props.planTmp.find(c => c.code === props.course.code) ? props.removeCourseToPlan : props.addCourseToPlan} />
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
            if (props.planTmp.find(c => c.code === inc)) {
                message = `This course is incompatible with ${inc}`;
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
                message = `Please add propedeutic course ${props.course.propedeuticcourse}`;
                return true;
            }
        } else {
            return false;
        }
    }

    function checkMaxStudentsEnrolled() {
        if (props.course.maxstudentsenrolled && (props.course.studentsenrolled >= props.course.maxstudentsenrolled)) {
            message = `Course reached max students enrolled`;
            return true;
        }
        return false;
    }

    const disabled = (checkIncompatibilities() || checkPropedeuticCourses() || checkMaxStudentsEnrolled());

    return (
        <td>
            <Button onClick={() => { props.toggleDisplayDetails(); }} variant="outline-secondary">{props.displayDetails ? <CaretUp /> : <CaretDown />}</Button>
            {props.editing ?
                disabled ?
                    <OverlayTrigger overlay={<Tooltip id="tooltip-disabled" >{message}</Tooltip>}>
                        <span className="d-inline-block">
                            <Button disabled={disabled} onClick={() => props.action(props.course)}> {props.planTmp.find(c => c.code === props.course.code) ? <Dash /> : <Plus />} </Button>
                        </span>
                    </OverlayTrigger>
                    : <Button disabled={disabled} onClick={() => props.action(props.course)}> {props.planTmp.find(c => c.code === props.course.code) ? <Dash /> : <Plus />} </Button>

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

export { MainComponent };