import React from "react";
import { useProjectStore } from "../components/store/ProjectStore";
import { useModelStore } from "./store/ModelStore";
import { useProjectRunStore } from "./store/ProjectRunStore";
import Table from "react-bootstrap/Table";

export default function RequirementsTable({ projectRunName, modelName }) {
  const projectRequirements = useProjectStore(
    (state) => state.project.requirements
  );
  const projectRunRequirements = useProjectRunStore((state) =>
    state.runs.find((run) => run.name === projectRunName)
      ? state.runs.find((run) => run.name === projectRunName).requirements
      : null
  );
  const modelRequirements = useModelStore((state) =>
    state.models.find((model) => model.name === modelName)
      ? state.models.find((model) => model.name === modelName).requirements
      : null
  );
  let addedProjectRunRequirements = [];
  let addedModelRequirements = [];

  return (
    <Table
      striped
      bordered
      style={{ color: "azure" }}
      className={"requirements-table"}
    >
      <thead>
        <tr>
          <th
            style={{ backgroundColor: "#1f2327", color: "azure", fontSize: 20 }}
          >
            Requirement
          </th>
          <th
            style={{ backgroundColor: "#1f2327", color: "azure", fontSize: 20 }}
          >
            Project
          </th>
          {projectRunRequirements ? (
            <th
              style={{
                backgroundColor: "#1f2327",
                color: "azure",
                fontSize: 20,
              }}
            >
              Project Run {projectRunName}
            </th>
          ) : (
            <></>
          )}
          {modelRequirements ? (
            <th
              style={{
                backgroundColor: "#1f2327",
                color: "azure",
                fontSize: 20,
              }}
            >
              Model {modelName}
            </th>
          ) : (
            <></>
          )}
        </tr>
      </thead>
      <tbody style={{ color: "azure", backgroundColor: "#1f2327" }}>
        {Object.entries(projectRequirements).map((req, i) => {
          // add requirements from project
          const reqName = req[0];
          const reqVal = req[1];
          const projectRunHasReq = projectRunRequirements
            ? reqName in projectRunRequirements
            : false;
          const modelHasReq = modelRequirements
            ? reqName in modelRequirements
            : false;
          if (projectRunHasReq) {
            addedProjectRunRequirements.push(reqName);
          }
          if (modelHasReq) {
            addedModelRequirements.push(reqName);
          }

          return (
            <tr key={"req_" + i}>
              <td
                style={{
                  color: "azure",
                  backgroundColor: "#1f2327",
                  fontSize: 18,
                }}
              >
                {reqName}
              </td>
              <td
                style={{
                  color: "azure",
                  backgroundColor: "#1f2327",
                  fontSize: 18,
                }}
              >
                <RequirementsList data={reqVal} title={""} />
              </td>
              {projectRunRequirements ? (
                projectRunHasReq ? (
                  <td
                    style={{
                      color: "azure",
                      backgroundColor: "#1f2327",
                      fontSize: 18,
                    }}
                  >
                    <RequirementsList
                      data={projectRunRequirements[reqName]}
                      title={""}
                    />
                  </td>
                ) : (
                  <td
                    style={{
                      color: "azure",
                      textAlign: "center",
                      backgroundColor: "#1f2327",
                      fontSize: 18,
                    }}
                  >
                    -
                  </td>
                )
              ) : null}
              {modelRequirements ? (
                modelHasReq ? (
                  <td
                    style={{
                      color: "azure",
                      backgroundColor: "#1f2327",
                      fontSize: 18,
                    }}
                  >
                    <RequirementsList
                      data={modelRequirements[reqName]}
                      title={""}
                    />
                  </td>
                ) : (
                  <td
                    style={{
                      color: "azure",
                      textAlign: "center",
                      backgroundColor: "#1f2327",
                      fontSize: 18,
                    }}
                  >
                    -
                  </td>
                )
              ) : null}
            </tr>
          );
        })}
        {projectRunRequirements
          ? Object.entries(projectRunRequirements)
              .filter((req) => !addedProjectRunRequirements.includes(req[0]))
              .map((req, i) => {
                const reqName = req[0];
                const reqVal = req[1];
                if (addedProjectRunRequirements.includes(reqName)) {
                  return null;
                } else {
                  const modelHasReq = modelRequirements
                    ? reqName in modelRequirements
                    : false;
                  if (modelHasReq) {
                    addedModelRequirements.push(reqName);
                  }
                  return (
                    <tr key={"pr_req_" + i}>
                      <td
                        style={{ color: "azure", backgroundColor: "#1f2327" }}
                      >
                        {reqName}
                      </td>
                      <td
                        style={{
                          color: "azure",
                          textAlign: "center",
                          backgroundColor: "#1f2327",
                        }}
                      >
                        -
                      </td>
                      <td>
                        <RequirementsList data={reqVal} title={""} />
                      </td>
                      {modelRequirements ? (
                        modelHasReq ? (
                          <td
                            style={{
                              color: "azure",
                              backgroundColor: "#1f2327",
                            }}
                          >
                            <RequirementsList
                              data={modelRequirements[reqName]}
                              title={""}
                            />
                          </td>
                        ) : (
                          <td
                            style={{
                              color: "azure",
                              textAlign: "center",
                              backgroundColor: "#1f2327",
                            }}
                          >
                            -
                          </td>
                        )
                      ) : null}
                    </tr>
                  );
                }
              })
          : null}
        {modelRequirements
          ? Object.entries(modelRequirements)
              .filter((req) => !addedModelRequirements.includes(req[0]))
              .map((req, i) => {
                const reqName = req[0];
                const reqVal = req[1];
                return (
                  <tr key={"model_req_" + i}>
                    <td style={{ color: "azure", backgroundColor: "#1f2327" }}>
                      {reqName}
                    </td>
                    <td
                      style={{
                        color: "azure",
                        textAlign: "center",
                        backgroundColor: "#1f2327",
                      }}
                    >
                      -
                    </td>
                    <td
                      style={{
                        color: "azure",
                        textAlign: "center",
                        backgroundColor: "#1f2327",
                      }}
                    >
                      -
                    </td>
                    <td style={{ color: "azure", backgroundColor: "#1f2327" }}>
                      <RequirementsList data={reqVal} title={""} />
                    </td>
                  </tr>
                );
              })
          : null}
      </tbody>
    </Table>
  );
}
function RequirementsList({ data, title }) {
  if (data instanceof Object) {
    if (Array.isArray(data)) {
      return (
        <>
          {title}
          <ul>
            {data.map((d, i) => {
              return <li key={title + "_list_" + i}>{d}</li>;
            })}
          </ul>
        </>
      );
    } else {
      if (Object.keys(data).length > 0) {
        return (
          <>
            {title}
            <ul>
              {Object.entries(data).map((d, i) => {
                if (d[1] instanceof Object) {
                  if (Array.isArray(d[1])) {
                    if (d[1].length === 0) {
                      return null;
                    }
                  } else {
                    if (Object.keys(d[1]).length === 0) {
                      return null;
                    }
                  }
                }
                return (
                  <li key={title + "_list_" + i}>
                    <RequirementsList title={d[0]} data={d[1]} />
                  </li>
                );
              })}
            </ul>
          </>
        );
      } else {
        return;
      }
    }
  } else {
    return (
      <>
        {title}
        <ul>
          <li key={title + "_0"} style={{ fontWeight: "normal" }}>
            {data}
          </li>
        </ul>
      </>
    );
  }
}
