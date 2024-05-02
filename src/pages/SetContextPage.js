import React, { useState, useRef, useEffect } from "react";
import { useProjectStore } from "../components/store/ProjectStore";
import { useProjectRunStore } from "../components/store/ProjectRunStore";
import { useModelStore } from "../components/store/ModelStore";
import { useScheduleStore } from "../components/store/ScheduleStore";
import { Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Overlay from "react-bootstrap/Overlay";
import Tooltip from "react-bootstrap/Tooltip";
import GenericError from "../components/GenericError";
import Badge from "react-bootstrap/Badge";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

import getUrl from "../components/store/OriginUrl"


export default function SetContextPage() {
  const projectStore = useProjectStore();
  const projectRunStore = useProjectRunStore();
  const scheduleStore = useScheduleStore();
  const modelStore = useModelStore();
  const [projectName, setProjectName] = useState("");
  const [projectExists, setProjectExists] = useState(true);
  const [serverError, setServerError] = useState(false);
  const [showInfoPopup, setShowInfoPopup] = useState(true);
  const [projectMessage, setProjectMessage] = useState("Choose a Project");
  const [projects, setProjects] = useState([]);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // make function to response = fetch("http://0.0.0.0:8080/api/projects/basics"); and return list of json objects
  useEffect(() => {

    const fetchProjects = async function() {
      const bUrl = getUrl("api/projects/basics");
      const response = await fetch(bUrl, {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization:
            `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      if (response.ok) {
        const pBasics = await response.json();
        setProjects(pBasics);
      } else {
        setProjects([]);
      }
    }

    fetchProjects()

  }, []);

  async function fetchProject(rawProjectName) {
    projectStore.reset();
    projectRunStore.reset();
    modelStore.reset();
    scheduleStore.reset();
    setProjectName(rawProjectName);
    setProjectName(rawProjectName);
    await projectStore.fetch(rawProjectName, setProjectExists, setServerError);
    await projectRunStore.fetch(rawProjectName);
    await scheduleStore.fetch(rawProjectName);
    setShowInfoPopup(false);
  }

  return (
    <Container className="main-content">
      <GenericError
        header={"Project " + projectName + " does not exist."}
        id="projectError"
        show={!projectExists}
        setShow={setProjectExists}
      />
      <GenericError
        header={"There was an error with the PIPES server"}
        id="serverError"
        show={serverError}
        setShow={setServerError}
      />
      <h1>{projectMessage}</h1>

      <Row>
      {projects.length > 0 ? (
        projects.map((project, index) => (
          <Card key={project.name} style={{ width: "25%", margin: "10px" }}>
            <Card.Body className="bg-dark text-light">
              <Card.Title>{project.name}</Card.Title>
              <Card.Text>{project.description}</Card.Text>
              <Button
                className="bg-dark text-light"
                variant="outline-light"
                onClick={(e) => {
                  e.preventDefault();
                  fetchProject(project.name);
                  document.getElementById("c2c-tab-overview").click();
                }}
              >
                To Overview
              </Button>
            </Card.Body>
          </Card>
        ))
      ) : (
        <p></p>
      )}
    </Row>
      <div style={{ padding: 10 }}>
        For more information about PIPES, visit{" "}
        <a
          href="https://nrel-pipes.github.io/pipes-core/"
          target="_blank"
          rel="noreferrer"
        >
          the docs
        </a>
      </div>

      <Modal className="text-dark" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>New Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Project Name</Form.Label>
              <Form.Control
                autoComplete="off"
                placeholder="Enter Project Name"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Title</Form.Label>
              <Form.Control
                autoComplete="new-password"
                placeholder="Enter Title"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Project Description</Form.Label>
              <Form.Control
                autoComplete="off"
                placeholder="Enter Project Description"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Project Description</Form.Label>
              <Form.Control
                autoComplete="off"
                placeholder="Enter Project Description"
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

function ShowInfo({ show, setShow }) {
  const target = useRef(null);

  return (
    <>
      <Badge
        ref={target}
        onMouseOut={() => setShow(false)}
        onMouseOver={() => setShow(true)}
        onClick={() => setShow(true)}
        style={{
          borderRadius: 30,
          width: 20,
          height: 20,
          textAlign: "center",
          padding: 0,
          paddingTop: 4,
          margin: 0,
          color: "azure",
          fontSize: 14,
        }}
        bg="dark"
      >
        &#9432;
      </Badge>
      <Overlay target={target.current} show={show} placement="right">
        {(props) => (
          <Tooltip id="overlay-example" {...props}>
            If you would like to test out the UI without creating a project in
            PIPES, enter <b>test1</b> below.
          </Tooltip>
        )}
      </Overlay>
    </>
  );
}
