import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Form, Button, Container, Row, Col } from 'react-bootstrap';
import { CaretDown, CaretUp } from 'react-bootstrap-icons';
import { useState } from 'react';
import { MainComponent } from './CourseComponents';

function StudyPlanOptionForm() {
    const [fulltime, setFulltime] = useState(true);

    const handleSubmit = event => {
        event.preventDefault();
    };

    const handleOptionChange = (event) => {
        const val = event.target.value;
        if (val === 'fulltime') {
            setFulltime(true);
        } else {
            setFulltime(false);
        }
    }

    return (
        <Container>
            <Row>
                <Col>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group>
                            <Form.Label>Part time o Full time</Form.Label>

                            <Form.Check
                                inline
                                type="radio"
                                label="Full-time"
                                name="studyplanoption"
                                value='fulltime'
                                checked={fulltime === true}
                                onChange={handleOptionChange}
                                id={"fulltime"}
                            />
                            <Form.Check
                                inline
                                type="radio"
                                label="Part-time"
                                name="studyplanoption"
                                value='parttime'
                                checked={fulltime === false}
                                onChange={handleOptionChange}
                                id={"parttime"}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Create Studyplan
                        </Button>
                    </Form>
                </Col>
            </Row>

        </Container>

    )
}

function StudyPlanTable(props)
{
    return(
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

function CourseRow(props)
{
    return (
        <tr>
            <td>{props.course.code}</td>
            <td>{props.course.name}</td>
            <td>{props.course.credits}</td>
        </tr>
    )
}

export { StudyPlanOptionForm, StudyPlanTable };