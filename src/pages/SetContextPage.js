import React, { useState, useRef, useEffect } from "react";
import { useProjectStore } from "../components/store/ProjectStore";
import { useProjectRunStore } from "../components/store/ProjectRunStore";
import { useModelStore } from "../components/store/ModelStore";
import { useScheduleStore } from "../components/store/ScheduleStore";
import Button from "react-bootstrap/Button";
import Overlay from "react-bootstrap/Overlay";
import Tooltip from "react-bootstrap/Tooltip";
import GenericError from "../components/GenericError";
import Badge from "react-bootstrap/Badge";
import Container from "react-bootstrap/Container";
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';


export default function SetContextPage() {
  const projectStore = useProjectStore();
  const projectRunStore = useProjectRunStore();
  const scheduleStore = useScheduleStore();
  const modelStore = useModelStore();
  const [projectName, setProjectName] = useState("");
  const [projectExists, setProjectExists] = useState(true);
  const [serverError, setServerError] = useState(false);
  const [showInfoPopup, setShowInfoPopup] = useState(true);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // make function to response = fetch("http://0.0.0.0:8080/api/projects"); and return list of json objects  
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    fetch("http://0.0.0.0:8080/api/projects/basic", {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        "Authorization": "Bearer eyJraWQiOiJ1YjJhazR0am8zWjROM25UUjk3XC93aVBJUlwvdmxqYmtQZ2pcL0tVZ2o5bnpJPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJhOTY5YjZjNS02NzI4LTQ2NGUtYmRkNS0xNjYyMWRjMDMwMDUiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtd2VzdC0yLmFtYXpvbmF3cy5jb21cL3VzLXdlc3QtMl9UdkVKMWJpejAiLCJjbGllbnRfaWQiOiI2bjVjbzllaDdiYWI0YTIxZWdyOTVkczNyOCIsIm9yaWdpbl9qdGkiOiI4OGRiZGU2My1iYTBiLTQxZTQtOGRkNS03Y2VhYjE3NjA2MmUiLCJldmVudF9pZCI6IjRkMTBhYTQzLWRhOGYtNDljNC05YzhmLTM5NmVjNjk5MmE5NCIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE3MDk5MzA4NzcsImV4cCI6MTcwOTk3NDA3NywiaWF0IjoxNzA5OTMwODc3LCJqdGkiOiJkYjg1MGU4ZC1mMGVmLTQ2NjEtYmY0ZC04ODA1Yzg4NDQyYTUiLCJ1c2VybmFtZSI6ImE5NjliNmM1LTY3MjgtNDY0ZS1iZGQ1LTE2NjIxZGMwMzAwNSJ9.piur_IUoaq6hB9cea61yC81gm58ysMJPcn4tvYeerrFcwD8SUH_PQrem6r9-p7qgLR-yHWSye174NaCwvLBr0q4DypE9Xmi443b7SJ0dCJh4rgZpCVyJp54srIx5y-zfG2F2B1HrmQ1T4FNleKP8emLJuintHf8mSRdMXT0WSDXEm57XHQvW_UneTplYhV6Z1s55M0Ieuk6P6tzU4YeyKED1JAI9LY9GsKKxXtmEzAT9yqsyBCJ6UqwNuvDqAv6PuqBeRpEkA7g9_vwDM75bNxhYmsjCHzL67jHSxWgR36B6IwJf9pPfLC5kGFk9epp8dQjCQR8_9EjQD117CoO5yA"
      },
    })
    .then(response => response.json())
    .then(data => {
      console.log(process.env.TOKEN)
      if (data.length == 0) {
        setProjects([]); 
      }
      setProjects(data)
      console.log("Data", data);
    })
    .catch(error => console.log(error));
  }, []);


  function fetchProject(e) {
    let rawProjectName = document.getElementById("form_projectname").value;
    console.log(rawProjectName);
    projectStore.reset();
    projectRunStore.reset();
    modelStore.reset();
    scheduleStore.reset();
    setProjectName(rawProjectName);
    setProjectName(rawProjectName);
    projectStore.fetch(rawProjectName, setProjectExists, setServerError);
    projectRunStore.fetch(rawProjectName);
    scheduleStore.fetch(rawProjectName);
    setShowInfoPopup(false);
    console.log(setProjectName);
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
      <h1>Choose Your Project</h1>
      
      <ul >
          {projects.map((project, index) => (
              <Card style={{ width: '18rem', margin: '10px' }}>
              <Card.Body className="bg-dark text-light">
                <Card.Title>{project.name}</Card.Title>
                <Card.Text>
                  {project.description}
                </Card.Text>
                <Button className="bg-dark text-light " bsStyle="danger" bsSize="small" variant="outline-light" onClick={fetchProject}>
                  To Overview
                </Button> 

              </Card.Body>
            </Card>
          ))}
        </ul>
        <Button variant="outline-light" onClick={handleShow}>
          Create Project
        </Button>
        <Modal className="text-dark" show={show} onHide={handleClose}>
  <Modal.Header closeButton>
    <Modal.Title>New Project</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
      <Form.Group className="mb-3">
        <Form.Label>Project Name</Form.Label>
        {/* Set autoComplete="off" to disable autofilling for this input */}
        <Form.Control autoComplete="off" placeholder="Enter Project Name" />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Title</Form.Label>
        {/* Apply autoComplete="off" to the password field as well */}
        <Form.Control autoComplete="new-password" placeholder="Enter Title" />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Project Description</Form.Label>
        {/* Set autoComplete="off" to disable autofilling for this input */}
        <Form.Control autoComplete="off" placeholder="Enter Project Description" />
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
      {/* Display the welcome message if it exists */}
      {/* {welcomeMessage && <h1>{welcomeMessage}</h1>} */}
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
