// External imports
import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";

// Internal imports
import PipelineTimeline from "../components/Timeline";
import ProjectOverview from "../components/ProjectOverview";
import DataOverview from "../components/DataOverview";
import PipelineOverview from "../components/PipelineOverview";
import { useProjectRunStore } from "../components/store/ProjectRunStore";
import { useProjectStore } from "../components/store/ProjectStore";
import { useModelStore } from "../components/store/ModelStore";
import { distinguishableColors, useUIStore } from "../components/store/store";

//
// Project Data Overview Functional component
//
export default function OverviewPage() {
  //
  //  Get data stores
  //
  const projectRunName = useProjectRunStore((state) => state.currentProjectRun);
  const [selectedModel, setSelectedModel] = useState(null);
  const projectRuns = useProjectRunStore((state) => state.runs);

  const projectName = useProjectStore((state) => state.project.name);
  const projectFullName = useProjectStore((state) => state.project.full_name);
  const scenarios = useProjectStore((state) => state.project.scenarios);
  const scenarioColors = useUIStore((state) => state.scenarios);
  const models = useModelStore((state) => state.models);
  

  const setScenarioProperty = useUIStore((state) => state.setScenarioProperty);
  const [projectRun, setProjectRun] = useState(0);

  // Determine scenario colors
  useEffect(() => {
    let scenariosNeedColor = [];
    if (models.length > 0 && scenarios.length > 0) {
      models.forEach((model) => {
        if (model.scenario_mappings) {
          model.scenario_mappings.forEach((scenario) => {
            if (!(scenario.model_scenario in scenarioColors)) {
              if ("other" in scenario) {
                if ("color" in scenario.other) {
                  setScenarioProperty(
                    "color",
                    scenario.model_scenario,
                    scenario.other.color
                  );
                } else {
                  scenariosNeedColor.push(scenario.model_scenario);
                }
              } else {
                scenariosNeedColor.push(scenario.model_scenario);
              }
            }
          });
        }
      });

      scenarios.forEach((scenario) => {
        if (!(scenario.name in scenarioColors)) {
          if (scenario.hasOwnProperty("other")) {
            if (scenario.other) {
              if (scenario.other.hasOwnProperty("color")) {
                setScenarioProperty(
                  "color",
                  scenario.name,
                  scenario.other.color
                );
              } else {
                scenariosNeedColor.push(scenario.name);
              }
            } else {
              scenariosNeedColor.push(scenario.name);
            }
          } else {
            scenariosNeedColor.push(scenario.name);
          }
        }
      });
      if (scenariosNeedColor.length > 0) {
        let colors = distinguishableColors(scenariosNeedColor.length);
        scenariosNeedColor.forEach((scenario, i) => {
          setScenarioProperty("color", scenario, colors[i]);
        });
      }
    }
  }, [setScenarioProperty, scenarios, models, scenarioColors]);

  const fetchModels = useModelStore((state) => state.fetch);

  const fetchModelRuns = useModelStore((state) => state.fetchModelRuns);
  useEffect(() => {
    if (models.length === 0 && projectName !== "" && projectRunName !== "") {
      fetchModels(projectName, projectRunName);
    }
  }, [models, projectName, projectRunName, fetchModels]);
  useEffect(() => {
    if (models.length > 0) {
      models.forEach((model) => {
        fetchModelRuns(projectName, projectRunName, model.name);
      });
    }
  }, [fetchModelRuns, models, projectName, projectRunName]);

  const [flexRowHeight, setFlexRowHeight] = useState(500);

  //
  // Effects
  //
  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize, false);

    return () => window.removeEventListener("resize", handleResize);
  }, []); // on mount

  //
  // Handlers
  //

  // Resize the bottom row -- total kludge, there has to be better way
  const handleResize = () => {
    let padding = 60;
    let tab = document.getElementsByClassName("nav-tabs")[0];

    let tabHeight = parseInt(
      getComputedStyle(tab).getPropertyValue("height"),
      10
    );
    tabHeight = isNaN(tabHeight) ? 10 : tabHeight;
    let row = parseInt(
      getComputedStyle(document.getElementById("top_row")).getPropertyValue(
        "height"
      ),
      10
    );
    row = isNaN(row) ? 10 : row;
    setFlexRowHeight(window.innerHeight - padding - tabHeight - row);
  };

  return (
    <Container className="vh-100 main-content" fluid style={{ padding: 10 }}>
      <Row id="top_row">
        <div style={{ padding: 10, display: "flex" }}>
          <h2>{projectFullName}</h2>
          <ProjectRunDropDown
            setProjectRun={setProjectRun}
            setSelectedModel={setSelectedModel}
          />
        </div>
        <Col>
          <ProjectOverview
            projectRunName={projectRunName}
            modelName={selectedModel ? selectedModel.id : ""}
          />
        </Col>
        <Col sm={7}>
          <div className="timeline">
            <PipelineTimeline
              divId={"timeline"}
              viewMode={"Week"}
              showSidebar={false}
            />
          </div>
        </Col>
      </Row>
      <Row style={{ height: flexRowHeight, maxHeight: 500 }}>
        <Col>
          {projectRuns.length === 0 ? (
            <></>
          ) : (
            <PipelineOverview
              data={projectRuns[projectRun]}
              selected={selectedModel}
              setSelected={setSelectedModel}
            />
          )}
        </Col>
        <Col>
          <DataOverview selected={selectedModel} flexHeight={flexRowHeight} />
        </Col>
      </Row>
    </Container>
  );
}

export function ProjectRunDropDown({ setSelectedModel, setProjectRun }) {
  const projectName = useProjectStore((state) => state.project.name);

  const modelStore = useModelStore();
  const projectRuns = useProjectRunStore((state) => state.runs);
  const setProjectRunName = useProjectRunStore(
    (state) => state.setCurrentProjectRun
  );
  const currentProjectRun = useProjectRunStore(
    (state) => state.currentProjectRun
  );
  function handleChangeProjectRun({ target }) {
    let index = projectRuns.findIndex((run) => run.name === target.value);
    setProjectRun(index);
    setProjectRunName(target.value);
    setSelectedModel(null);
    modelStore.resetRuns();
    modelStore.fetch(projectName, target.value);
  }
  return (
    <Form.Select
      variant="dark"
      id="project-run-dropdown"
      onChange={handleChangeProjectRun}
      style={{ marginLeft: 10, width: 300 }}
      defaultValue={currentProjectRun}
    >
      {projectRuns.map((run) => (
        <option value={run.name} key={"run_" + run.name}>
          Project Run {run.name}
        </option>
      ))}
    </Form.Select>
  );
}
