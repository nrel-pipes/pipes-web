import React, { useState, useRef, useEffect } from "react";
import { useProjectStore } from "../components/store/ProjectStore";
import { useProjectRunStore } from "../components/store/ProjectRunStore";
import { useModelStore } from "../components/store/ModelStore";
import { useScheduleStore } from "../components/store/ScheduleStore";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Overlay from "react-bootstrap/Overlay";
import Tooltip from "react-bootstrap/Tooltip";
import GenericError from "../components/GenericError";
import Badge from "react-bootstrap/Badge";
import Container from "react-bootstrap/Container";

export default function SetContextPage() {
  const projectStore = useProjectStore();
  const projectRunStore = useProjectRunStore();
  const scheduleStore = useScheduleStore();
  const modelStore = useModelStore();

  const [projectName, setProjectName] = useState("");

  const [projectExists, setProjectExists] = useState(true);
  const [serverError, setServerError] = useState(false);
  const [showInfoPopup, setShowInfoPopup] = useState(true);
  // make function to response = fetch("http://0.0.0.0:8080/api/projects"); and return list of json objects  
  const [projects, setProjects] = useState([]);
  
  useEffect(()=> {
    console.log(setProjects);
    // Paramaterize later
    fetch("http://0.0.0.0:8080/api/projects")
    .then(response => response.json())
    .then(data => {setProjects(data); console.log("Data", data)})
    .catch(error => console.log(error))
  }, []);

  function fetchProject(e) {
    let rawProjectName = document.getElementById("form_projectname").value;
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

      <Form
        onSubmit={(e) => {
          e.preventDefault();
          fetchProject();
        }}
        style={{ padding: 10, maxWidth: "30%" }}
      >

        <Form.Group className="mb-3" controlId="form_projectname">
          <Form.Label>'
            Choose Project by ID:{" "}
            <ShowInfo show={showInfoPopup} setShow={setShowInfoPopup} />
          </Form.Label>
          <Form.Select aria-label="Default select example">
            <option>Project ID</option>
            {projects.map((project) => (
              <option key={project.name} value={project.name}>{project.full_name}</option>
            ))}

          </Form.Select>
  
        </Form.Group>
        <Button variant="primary" type="button" onClick={fetchProject}>
          Submit
        </Button>
      </Form>
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
