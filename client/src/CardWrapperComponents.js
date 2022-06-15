import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Row, Col } from 'react-bootstrap';
import { StudyPlanOptionForm, StudyPlanTableWrapper } from './StudyPlanComponent';
import { CoursesTable } from './CourseComponents';
import { LoginForm } from './LoginComponents';

// FIXME: quando si preme su cancel si deve ricericare il pds vecchio

function StudyPlanTableCard(props) {
    return (
        <Card>
            <Card.Body>
                <Card.Title>Study Plan</Card.Title>
                <StudyPlanTableWrapper
                    courses={props.courses}
                    deleteStudyPlan={props.deleteStudyPlan}
                    fullTime={props.fullTime}
                    studyPlan={props.studyPlan}
                    editing={props.editing}
                    updateMessage={props.updateMessage}
                    incompatibilities={props.incompatibilities}
                    addStudyPlan={props.addStudyPlan}
                    reset={props.reset}
                />
            </Card.Body>
        </Card>
    );
}

function StudyPlanOptionFormCard(props) {
    return (
        <Card>
            <Card.Body>
                <Card.Title>Create A New Study Plan</Card.Title>
                <StudyPlanOptionForm updateFullTime={props.updateFullTime} />
            </Card.Body>
        </Card>
    )
}

function MainComponentCard(props) {
    return (
        <Row>
            <Col>
                <Card>
                    <Card.Body>
                        <Card.Title>{props.title}</Card.Title>
                        <CoursesTable courses={props.courses}
                            studyPlan={props.studyPlan}
                            incompatibilities={props.incompatibilities}
                            editing={props.editing}
                            updateMessage={props.updateMessage}
                            addCourseToPlan={props.addCourseToPlan}
                            removeCourseToPlan={props.removeCourseToPlan} />
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
}

function LoginFormCard(props) {
    return (
        <Card>
            <Card.Body>
                <Card.Title>Login Form</Card.Title>
                <LoginForm login={props.login}></LoginForm>
            </Card.Body>
        </Card>
    );
}

export { StudyPlanTableCard, StudyPlanOptionFormCard, MainComponentCard, LoginFormCard };