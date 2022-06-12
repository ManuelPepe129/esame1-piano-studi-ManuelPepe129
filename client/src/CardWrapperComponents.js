import 'bootstrap/dist/css/bootstrap.min.css';
import {Card } from 'react-bootstrap';
import { StudyPlanOptionForm, StudyPlanTableWrapper } from './StudyPlanComponent';
import { MainComponent } from './CourseComponents';
import { LoginForm } from './LoginComponents';


function StudyPlanTableCard(props) {
    return (
        <Card>
            <Card.Body>
                <Card.Title>Study Plan</Card.Title>
                <StudyPlanTableWrapper courses={props.courses} deleteStudyPlan={props.deleteStudyPlan} />
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
    return (<Card>
        <Card.Body>
            <Card.Title>{props.title}</Card.Title>
            <MainComponent courses={props.courses} updateStudentsEnrolled={props.updateStudentsEnrolled} incompatibilities={props.incompatibilities} editing={props.editing} fullTime={props.fullTime} addStudyPlan={props.addStudyPlan} studyPlan={props.studyPlan} updateMessage={props.updateMessage} />
        </Card.Body>
    </Card>
    );
}

function LoginFormCard(props) {
    return (<Card>
        <Card.Body>
            <Card.Title>Login Form</Card.Title>
            <LoginForm login={props.login}></LoginForm>
        </Card.Body>
    </Card>);
}

export { StudyPlanTableCard, StudyPlanOptionFormCard, MainComponentCard, LoginFormCard };