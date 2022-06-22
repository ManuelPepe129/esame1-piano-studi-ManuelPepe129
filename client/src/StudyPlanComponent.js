import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function StudyPlanOptionForm(props) {
    const [fulltime, setFulltime] = useState(1);

    const navigate = useNavigate();

    const handleSubmit = event => {
        event.preventDefault();
        props.updateFullTime(fulltime);
        navigate('/edit');
    };

    const handleOptionChange = (event) => {
        const val = event.target.value;
        if (val === 'fulltime') {
            setFulltime(1);
        } else {
            setFulltime(0);
        }
    }

    return (<Container>
        <p>You have no study plan yet. Create a new one:</p>
        <Form onSubmit={handleSubmit}>
            <Form.Group>
                <Form.Label>Choose the type of enrollment: </Form.Label>

                <Form.Check
                    type="radio"
                    label="Full-time"
                    name="studyplanoption"
                    value='fulltime'
                    checked={fulltime === 1}
                    onChange={handleOptionChange}
                    id={"fulltime"}
                />
                <Form.Check
                    type="radio"
                    label="Part-time"
                    name="studyplanoption"
                    value='parttime'
                    checked={fulltime === 0}
                    onChange={handleOptionChange}
                    id={"parttime"}
                />

            </Form.Group>
            <Button variant="primary" type="submit">
                Create Studyplan
            </Button>
        </Form>
    </Container>);
}

function StudyPlanTableWrapper(props) {
    const currentCredits = props.studyPlan.reduce((count, c) => count + c.credits, 0)
    const maxCredits = props.fullTime ? 80 : 40;
    const minCredits = props.fullTime ? 40 : 20;

    return (
        <>
            <StudyPlanTable courses={props.courses} />
            {props.editing ?
                <>
                    <Row><p>Insert between {minCredits} and {maxCredits} credits</p></Row>

                    <Row>
                        <p> Credits in current study plan: {currentCredits}</p>
                    </Row>
                </> : false}
            <Row>
                <Col>
                    <StudyPlanTableActions
                        deleteStudyPlan={props.deleteStudyPlan}
                        editing={props.editing}
                        updateMessage={props.updateMessage}
                        studyPlan={props.studyPlan}
                        incompatibilities={props.incompatibilities}
                        addStudyPlan={props.addStudyPlan}
                        reset={props.reset}
                        currentCredits={currentCredits} maxCredits={maxCredits} minCredits={minCredits} />
                </Col>
            </Row>


        </>
    )
}

function StudyPlanTableActions(props) {
    const navigate = useNavigate();

    function handleStudyPlanUpdate() {
        if (checkCredits()) {
            if (checkPropedeuticCourses()) {
                if (checkIncompatibleCourses()) {
                    props.addStudyPlan();
                    navigate('/');
                }
            }
        }
    }

    /* Checks on submission */


    function checkCredits() {
        if (props.currentCredits >= props.minCredits && props.currentCredits <= props.maxCredits) {
            return true;
        } else {
            props.updateMessage({ msg: `Insert between ${props.minCredits} and ${props.maxCredits} credits`, type: 'warning' });
            return false;
        }
    }

    function checkPropedeuticCourses() {
        for (const course of props.studyPlan) {
            if (course.propedeuticcourse) {
                if (!props.studyPlan.find(c => c.code === course.propedeuticcourse)) {
                    props.updateMessage({ msg: `Please add propedeutic course ${course.propedeuticcourse}`, type: 'warning' });
                    return false;
                }
            }
        }
        return true;
    }

    function checkIncompatibleCourses() {
        for (const inc of props.incompatibilities) {
            if (props.studyPlan.find(c => c.code === inc.coursea) && props.studyPlan.find(c => c.code === inc.courseb)) {
                props.updateMessage({ msg: `Courses ${inc.coursea} and ${inc.courseb} are incompatible`, type: "warning" });
                return false;
            }
        }
        return true;
    }

    return (
        props.editing ?
            <>
                <Button variant='primary' onClick={() => handleStudyPlanUpdate()}>Confirm Study Plan</Button>{' '}
                <Button variant='warning' onClick={() => { navigate('/'); props.reset() }}>Cancel</Button>
            </> :
            <>
                <Button variant='primary' onClick={() => navigate('/edit')}>Edit current study plan</Button>{' '}
                <Button variant='danger' onClick={() => props.deleteStudyPlan()}>Delete current study plan</Button>
            </>
    );
}

function StudyPlanTable(props) {
    return (
        <Table>
            <thead>
                <tr>
                    <th>Code</th>
                    <th>Course</th>
                    <th>Credits</th>
                </tr>
            </thead>
            <tbody>
                {
                    props.courses.map((course) => <CourseRow course={course} key={course.code} />)
                }
            </tbody>
        </Table>
    );
}

function CourseRow(props) {
    return (
        <tr>
            <td>{props.course.code}</td>
            <td>{props.course.name}</td>
            <td>{props.course.credits}</td>
        </tr>
    )
}

export { StudyPlanOptionForm, StudyPlanTableWrapper };