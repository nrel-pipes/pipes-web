import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Card from "react-bootstrap/Card";

import "./PageStyles.css";

const Home = () => {
  return (
    <Container>
      <Row>
        <Col className="text-start">
          <h4 className="my-5">
            Pipeline for Integrated Projects in Energy Systems (PIPES) is a
            project management, data management, and a workflow management layer
            developed by NREL for integrated modeling teams.
          </h4>
        </Col>
      </Row>
      <Row className="mt-4 text-start">
        <Col lg={7} className="text-center">
          <Image
            className="rounded"
            src="/images/NREL-PIPES-v2.png"
            alt="PIPES"
            style={{ width: "75%" }}
            fluid
          />
        </Col>
        <Col lg={5}>
          <h3 className="my-5">Key Features</h3>
          <ul style={{ fontSize: "18px", fontWeight: 400 }}>
            <li className="my-3">
              User interface for pipeline visibility and project coordination /
              management
            </li>
            <li className="my-3">
              Robust, multi-level, and multi-dimensional metadata management
            </li>
            <li className="my-3">Model, tool, and storage agnostic</li>
            <li className="my-3">
              Task management, automated validation, and quality control
              checkpoints
            </li>
            <li className="my-3">Required transforms for dataset handoffs</li>
            <li className="my-3">Event triggers and notifications</li>
            <li className="my-3">
              API for model integration, Command-Line Interface for modelers,
              and Software Development Kit for developers
            </li>
          </ul>
        </Col>
      </Row>
      <Row className="mt-5">
        <Col className="text-start">
          <p style={{ fontSize: "18px", fontWeight: 400 }}>
            PIPES facilitates the management of data requirements, tasks, and
            progress tracking, serving as a higher-level integration layer that
            works across various data and modeling software. This tool
            integrates models, data, and tools to perform large-scale,
            integrated analysis work at scale. PIPES is designed to streamline
            integrated modeling projects, enhance collaboration, and ensure the
            quality and efficiency of data management and workflow processes.
          </p>
        </Col>
      </Row>
      <Row className="my-5 text-start">
        <Col md={4} className="my-3">
          <Card className="nrelCard mt-1">
            <Card.Header className="nrelCardHeader">
              <h3>
                <a
                  href="https://nrel-pipes.github.io/pipes-core/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Documentation &gt;
                </a>
              </h3>
            </Card.Header>
            <Card.Body>
              <Card.Text className="mt-3" style={{ fontSize: "16px" }}>
                Checkout our{" "}
                <a
                  href="https://nrel-pipes.github.io/pipes-core/"
                  target="_blank"
                  rel="noreferrer"
                >
                  documentation
                </a>{" "}
                on Github built out for PIPES system (MVP version).
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="my-3">
          <Card className="nrelCard mt-1">
            <Card.Header className="nrelCardHeader">
              <h3>
                <a
                  href="https://nrel-pipes.github.io/pipes-core/troubleshooting__faq.html"
                  target="_blank"
                  rel="noreferrer"
                >
                  Support &gt;
                </a>
              </h3>
            </Card.Header>
            <Card.Body>
              <Card.Text className="mt-3" style={{ fontSize: "16px" }}>
                Feel free to reach out to the PIPES{" "}
                <a
                  href="https://nrel-pipes.github.io/pipes-core/troubleshooting__faq.html"
                  target="_blank"
                  rel="noreferrer"
                >
                  development team
                </a>{" "}
                with any questions or if you would like to try PIPES and setup
                your own account.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="my-3">
          <Card className="nrelCard mt-1">
            <Card.Header className="nrelCardHeader">
              <h3>
                <a
                  href="https://nrel-pipes.github.io/pipes-core/troubleshooting__faq.html"
                  target="_blank"
                  rel="noreferrer"
                >
                  Contact &gt;
                </a>
              </h3>
            </Card.Header>
            <Card.Body>
              <Card.Text className="mt-2" style={{ fontSize: "16px" }}>
                <span style={{ fontSize: "1.1em" }}>Meghan Mooney</span>
                <br />
                <a
                  href="mailto:Meghan.Mooney@nrel.gov"
                  style={{ textDecoration: "none" }}
                >
                  <FontAwesomeIcon icon={faEnvelope} /> meghan.mooney@nrel.gov
                </a>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
