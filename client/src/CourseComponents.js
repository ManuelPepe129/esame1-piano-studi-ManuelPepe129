import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Container, Col, Row, Button, ListGroup, ListGroupItem } from 'react-bootstrap';
import { CaretDown, CaretUp } from 'react-bootstrap-icons';
import { useState } from 'react';

function MainComponent(props) {
    return (
        <Container>
            <Row>
                <Col>
                    <h1>List of Available Courses</h1>
                </Col>
            </Row>
            <Row>
                <Col>
                    <CoursesTable courses={props.courses} incompatibilities={props.incompatibilities}></CoursesTable>
                </Col>
            </Row>
        </Container>
    );
}

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
        /*
        for (let i = 0; i < props.incompatibilities.length; i++) {
            if (props.incompatibilities[i].coursea === course.code) {
                console.log(`courseb: ${props.incompatibilities[i].courseb}`)
                tmp.push(props.incompatibilities[i].courseb);
            } else if (props.incompatibilities[i].courseb === course.code) {
                console.log(`coursea: ${props.incompatibilities[i].coursea}`)
                tmp.push(props.incompatibilities[i].coursea);
            }
        }
        */
        //console.log(tmp);
        return tmp;
    }
    return (
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
                    props.courses.map((course) => <CourseRow course={course} key={course.code} incompatibilities={
                        calculateIncompatibilities(course)
                    } />)
                }
            </tbody>
        </Table>
    );

}

function CourseRow(props) {
    const [displayDetails, setDisplayDetails] = useState(false);

    const toggleDisplayDetails = () => {
        setDisplayDetails(!displayDetails);
    }

    return (
        <>
            <tr>
                <CourseData course={props.course} />
                <td>
                    <Button onClick={() => { toggleDisplayDetails(); }}>{displayDetails ? <CaretUp /> : <CaretDown />}</Button>
                </td>
            </tr>
            {
                displayDetails ?
                    <CourseDetails course={props.course} incompatibilities={props.incompatibilities} />
                    : false
            }
        </>
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
            if (i != props.incompatibilities.length - 1) {
                str += ", ";
            }
        }
        return str;
    }

    return (
        <>
            <tr>
                <td class="fw-bold">Propedeutic Course</td>
                <td>{props.course.propedeuticcourse ? props.course.propedeuticcourse : 'N/A'}</td>
            </tr>
            <tr>
                <td class="fw-bold">Incompatible Courses: </td>
                <td> {props.incompatibilities.length ? displayIncompatibilities() : 'N/A'}</td>
            </tr>
        </>
    )
}

export { MainComponent };