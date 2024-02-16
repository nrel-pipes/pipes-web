import React from "react";
import Accordion from "react-bootstrap/Accordion";
import "../App.css";
import { useUIStore } from "../components/store/store";
import { useProjectStore } from "../components/store/ProjectStore";
import RequirementsTable from "./RequirementsTable";

const webRegex = // eslint-disable-next-line
  /([\w+]+\:\/\/)?([\w\d-]+\.)*[\w-]+[\.\:]\w+([\/\?\=\&\#\.]?[\w-]+){1,}\/?/gm;
const underscore_regex = /_/;
export default function ProjectOverview({ projectRunName, modelName }) {
    // const requirements = useProjectStore((state) => state.project.requirements);
  const assumptions = useProjectStore((state) => state.project.assumptions);
  const scenarios = useProjectStore((state) => state.project.scenarios);
  const scenarioColors = useUIStore((state) => state.scenarios);

  return (
    <div style={{ marginBottom: 10, overflow: "auto", resize: "both" }}>
      <Accordion alwaysOpen="true" className="project-lists">
        <Accordion.Item eventKey="assumptions">
          <Accordion.Header>Assumptions</Accordion.Header>
          <Accordion.Body>
            <Assumptions assumptions={assumptions} />
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="requirements">
          <Accordion.Header>Requirements</Accordion.Header>
          <Accordion.Body>
            <RequirementsTable
              projectRunName={projectRunName}
              modelName={modelName}
            />
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="scenarios">
          <Accordion.Header>Scenarios</Accordion.Header>
          <Accordion.Body>
            {_parseScenarios(scenarios, scenarioColors)}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
}
export function Assumptions({ assumptions }) {
  if (Array.isArray(assumptions)) {
    return (
      <>
        {assumptions.map((assumption, i) => {
          return assumption.match(webRegex) ? (
            <a
              key={"link_assumption_" + i.toString()}
              href={assumption}
              target="_blank"
              rel="noopener noreferrer"
            >
              {assumption}
            </a>
          ) : (
            <p key={assumption + "_" + i.toString()}>{assumption}</p>
          );
        })}
      </>
    );
  } else {
    return (
      <>
        <p>{assumptions}</p>
      </>
    );
  }
}

export function makeBullets(obj) {
  if (!obj) {
    return <></>;
  }
  return Object.keys(obj).map((key) => {
    let value = obj[key];
    const keyIsInt = !isNaN(parseInt(key, 10));

    let keyDisplay = key.includes("_")
      ? key.replace(underscore_regex, " ")
      : key;

    if (Array.isArray(value)) {
      if (typeof value[0] === "object") {
        return (
          <div key={key}>
            {keyIsInt ? <></> : <h5>{keyDisplay}</h5>}
            <ul>{makeBullets(value)}</ul>
          </div>
        );
      } else {
        return (
          <div key={key}>
            {keyIsInt ? <></> : <h5>{keyDisplay}</h5>}
            <ul>{_listing(value, key)}</ul>
          </div>
        );
      }
    } else if (typeof value === "object") {
      return (
        <div key={key}>
          {keyIsInt ? <></> : <h5>{keyDisplay}</h5>}
          <ul>{makeBullets(value)}</ul>
        </div>
      );
    } else {
      return (
        <div key={key}>
          {keyIsInt ? <></> : <h5>{keyDisplay}</h5>}
          <ul>
            <li key={key + "_0"}>{value.toString()}</li>
          </ul>
        </div>
      );
    }
  });
}
function _listing(list, name) {
  return list.map((v, i) => {
    return <li key={name + i.toString()}>{v}</li>;
  });
}

function _parseScenarios(object, colors) {
  let d = object.map((obj, index) => {
    const color = obj.name in colors ? colors[obj.name].color : "grey";
    return (
      <div key={"scenario" + index}>
        <h5>
          {" "}
          <svg width="40" height="20">
            <rect width="30" height="20" fill={color} />
          </svg>{" "}
          {obj.name}
        </h5>
        <div>{obj.description}</div>
      </div>
    );
  });
  return d;
}
