import { useNavigate } from "react-router-dom";

import Button from 'react-bootstrap/Button';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Card from 'react-bootstrap/Card';

import "./PageStyles.css"


const Home = () => {
  const navigate = useNavigate()

  function handleClick() {
    navigate('/projects')
  }

  return (
    <Container>
      <Row>
        <Col className="imageCol">
          <Image
            className="rounded"
            src="/images/pipes-transparent-ui-splash.png"
            alt="PIPES"
            style={{ width: "60%" }}
            fluid
          />
        </Col>
      </Row>
      <Row className="mt-4 text-start">
        <Col md={7} sm={7}>
          <h1>What is PIPES?</h1>
          <p>
            PIPES (Pipeline for Integrated Projects in Energy Systems) is a project management, data management, and a workflow management layer for integrated modeling teams.
          </p>
          <p>
            Inspired by the complex data management challenges of the LA100 Study, PIPES was designed to help scale large integrated modeling projects at the laboratory (and beyond).
          </p>

          <Row className="text-center mt-5 mb-5">
            <Button variant="success" onClick={handleClick} size="lg">
              <b>View your Projects &gt;&gt;</b>
            </Button>
          </Row>

          <h3>Metadata Management</h3>
          <p>
            In its simplest form, PIPES manages metadata associated with an integrated modeling project. This metadata management includes metadata about scenarios, requirements, and assumptions across different levels of the pipeline (e.g., Project, Model, Dataset, Task, etc.); metadata about the underlying pipeline topology (e.g., how things are connected and what data handoffs are happening); and metadata around managing the project (e.g., who is the responsible party, gantt scheduling information, milestones, pass/fail statuses, modeling progress, etc.).
          </p>
          <p>
            In coordination with the larger project team, PIs/data managers will plan out the project structure, expected outputs, and the modeling pipeline at the beginning of the project. As the project kicks off, modeling teams will register model runs, datasets, and tasks such as transformations, QAQC, and visualizations. This provides a rich set of metadata about how the project is progressing, the modeling assumptions made at each step and metadata for individual datasets and tasks. Importantly, PIPES tracks requirements and acceptance criteria throughout the pipeline. All registered activities—especially handoffs between models—require validation checkpoints and may trigger event notifications to users.
          </p>
        </Col>
        <Col md={5} sm={5}>
          <h4>Key Features</h4>
          <ul>
            <li>Robust, multi-level, and multi-dimensional metadata management</li>
            <li>Model, Analysis, Storage agnostic</li>
            <li>Graph pipeline representation</li>
            <li>Task management (QAQC, transformations, visualization, and knowledge exchanges)</li>
            <li>Human-in-the-loop QAQC checkpoints (pass/fail)</li>
            <li>Automated data and metadata validation</li>
            <li>Required transforms for dataset handoffs</li>
            <li>Event triggers and notifications</li>
            <li>Command-line interface (CLI)</li>
            <li>Web-based User Interface (UI) for pipeline visibility and project coordination / management</li>
            <li>API for model integration</li>
            <li>SDK for HERO integration</li>
          </ul>
          <hr />
          <h4>Key Improvements</h4>
          <ul>
            <li>Better manage integrated modeling projects and business logic</li>
            <li>Help teams find and share data</li>
            <li>Provide visibility into the pipeline and track progress</li>
            <li>Help teams validate models and find errors early</li>
            <li>Improve integration speed (reduced coordination time)</li>
            <li>Improve ability to serve many communities simultaneously</li>
          </ul>
        </Col>
      </Row>
      <Row className="mt-4 text-start">
        <Col sm={4}>
          <Card
            bg="primary"
            text="white"
            style={{ width: '25rem', minHeight: '200px' }}
            className="mb-2"
          >
            <Card.Header style={{fontWeight: "bold"}}>Documentation</Card.Header>
            <Card.Body>
              <Card.Title>Github Pages!</Card.Title>
              <Card.Text>
                Checkout our documentation on Github built out for PIPES system (MVP version).
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={4}>
          <Card
            bg="success"
            text="white"
            style={{ width: '25rem', minHeight: '200px'}}
            className="mb-2"
          >
            <Card.Header style={{fontWeight: "bold"}}>Project Integration</Card.Header>
            <Card.Body>
              <Card.Title>Platform Agnostic!</Card.Title>
              <Card.Text>
                Some quick example text to build on the card title and make up the
                bulk of the card's content.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={4}>
          <Card
            bg="info"
            text="white"
            style={{ width: '25rem', minHeight: '200px' }}
            className="mb-2"
          >
            <Card.Header style={{fontWeight: "bold"}}>Contact Us</Card.Header>
            <Card.Body>
              <Card.Title>Hello Here!</Card.Title>
              <Card.Text>
                Feel free to reach out to us if any question, or you would
                like to try with PIPES.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};


export default Home;
