// External imports
import React, { useEffect, useMemo } from "react";

// Import CSS file
import "./DataViewComponent.css";

// Internal imports
import useDataStore from "../../../stores/DataStore";
import useUIStore from "../../../stores/UIStore";
import { makeBullets } from "../../Pipeline/Components/DataViewComponent";
import ScenarioMappingComponent from "./ScenarioMappingComponent";

export default function DataViewComponent({ selected }) {
  const models = useDataStore((state) => state.models);
  const modelRuns = useDataStore((state) => state.modelRuns);

  const getColor = useUIStore((state) => state.getColor);
  const scenarioColors = useUIStore((state) => state.scenarios);

  const model = useMemo(() => {
    if (selected) return models.find((model) => model.name === selected.id);

    return null;
  }, [selected, models]);

  const data = useMemo(() => {
    if (selected) {
      if (selected.id in modelRuns) {
        let datasets = [];
        Object.values(modelRuns[selected.id]).forEach((run) => {
          run.datasets.forEach((dataset) => {
            if (!(dataset.spatial_info.other instanceof Object)) {
              dataset.spatial_info.other = JSON.parse(
                dataset.spatial_info.other,
              );
            }
            if (!(dataset.temporal_info.other instanceof Object)) {
              dataset.temporal_info.other = JSON.parse(
                dataset.temporal_info.other,
              );
            }

            datasets.push(dataset);
          });
        });
        return datasets;
      }
    }
    return null;
  }, [selected, modelRuns]);

  useEffect(() => {
    models.forEach((model) => {
      model.scenario_mappings.forEach((mapping) => {
        getColor(mapping.model_scenario);
      });
    });
  });

  //
  // Render
  //
  if (model) {
    return (
      <div className="data-overview" style={{ overflow: "auto" }}>
        <div className="data">
          <h5 className="model-title">{selected.id}</h5>

          {/* Model Info Section */}
          <div className="info-section">
            <div className="section-header">
              <h6>Model Information</h6>
            </div>
            <div className="section-content">
              <ModelInfo
                type={model.type}
                users={[]}
                requirements={model.requirements}
                scenarioMappings={model.scenario_mappings}
                other={model.other}
              />
            </div>
          </div>

          {/* Datasets Section */}
          <div className="info-section">
            <div className="section-header">
              <h6>Datasets</h6>
            </div>
            <div className="section-content">
              <DataDetails checkins={data} scenarioColors={scenarioColors} />
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="data-overview">
      <div className="data" style={{ fontSize: 16 }}>
        Click a model to see more details
      </div>
    </div>
  );
}

function DataDetails({ checkins, scenarioColors }) {
  if (checkins) {
    return checkins.map((data, index) => {
      const checkinDate = new Date(data.created).toLocaleString();
      const isHandoff =
        "is_handoff" in data.other ? data.other.is_handoff : false;

      return (
        <div key={"ci_" + index} className="checkin">
          <details>
            <DataHeader
              id={data.dataset_id}
              checkinDate={checkinDate}
              author={data.registration_author.username}
              handoff={isHandoff}
              validated={data.metadata_validated}
            />
            <DataBasicInfo
              name={data.dataset_id}
              format={data.data_format}
              filename={data.name}
              schema={data.schema_info}
              relevantLinks={data.relevant_links}
              sourceCode={data.source_code}
              description={data.description}
              comments={data.comments}
              version={data.version}
            />

            <DataMetadata data={data} scenarioColors={scenarioColors} />
          </details>

          <DataLocation location={data.location} />
        </div>
      );
    });
  } else {
    return (
      <>
        Currently there are no datasets from this model under this project run.
      </>
    );
  }
}

function scenarioStyle(scenario, colors) {
  const color = scenario in colors ? colors[scenario].color : "grey";

  return {
    backgroundColor: color,
    padding: "5px",
    marginTop: "10px",
    color: "black",
    fontWeight: "bold",
    fontSize: "1em",
    maxHeight: 30,
    textAlign: "center",
  };
}
function ModelInfo({ users, type, requirements, scenarioMappings, other }) {
  return (
    <div className="metadata">
      <div style={{ flex: "1", marginRight: 15 }}>
        <b>{type}</b>
        <UserList users={users} />

        <br></br>
        {makeBullets(requirements)}
        {other ? makeBullets(other) : <></>}
      </div>
      <ScenarioMappingComponent data={scenarioMappings} />
    </div>
  );
}

function HandoffBadge({ handoff }) {
  if (handoff) {
    return <span className="checkin_handoff">Handoff</span>;
  }
  return <></>;
}
function ValidatedBadge({ isValidated }) {
  if (isValidated) {
    return <span className="data_validated">Validated</span>;
  } else {
    return <span className="data_unvalidated">Not Validated</span>;
  }
}

function DataHeader({ id, checkinDate, author, handoff, validated }) {
  return (
    <>
      <summary className="checkin_description">
        {id}
        <span style={{ padding: "15px", fontWeight: "normal" }}>
          <HandoffBadge handoff={handoff} />
          <ValidatedBadge isValidated={validated} />
        </span>
      </summary>
      {checkinDate} {author}
      <br />
      <br />
    </>
  );
}
function DataMetadata({ data, scenarioColors }) {
  return (
    <>
      <u>
        <h6>Metadata</h6>
      </u>
      <div className="checkin_details">
        <ScenarioInfo
          scenarios={data.scenarios}
          scenarioColors={scenarioColors}
        />
        <div style={{ padding: 5 }}>
          <MetadataList data={data.model_years} title={"Model Years"} />
        </div>
        <div style={{ padding: 5 }}>
          <MetadataList title={"Units"} data={data.units} />
        </div>
        <div style={{ padding: 5 }}>
          <MetadataList title={"Weather Years"} data={data.weather_years} />
        </div>

        <div style={{ padding: 5 }}>
          <MetadataList data={data.spatial_info} title={"Spatial Info"} />
        </div>
        <div style={{ padding: 5 }}>
          <MetadataList title={"Temporal Info"} data={data.temporal_info} />
        </div>
        <div style={{ padding: 5 }}>
          <MetadataList title={"Other Info"} data={data.other} />
        </div>
      </div>
    </>
  );
}

function MetadataList({ data, title }) {
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
                    <MetadataList title={d[0]} data={d[1]} />
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

function ScenarioInfo({ scenarios, scenarioColors }) {
  if (Array.isArray(scenarios)) {
    return (
      <div style={{ padding: 5 }}>
        Scenarios
        <ul>
          {scenarios.map((scenario, i) => {
            return (
              <li key={"scenario_" + i}>
                <div style={scenarioStyle(scenario, scenarioColors)}>
                  {scenario}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  } else {
    return (
      <div style={{ padding: 5 }}>
        Scenarios
        <ul>
          <li>
            <div style={scenarioStyle(scenarios, scenarioColors)}>
              {scenarios in scenarioColors
                ? "display_name" in scenarioColors[scenarios]
                  ? scenarioColors[scenarios].display_name
                  : scenarios
                : scenarios}
            </div>
          </li>
        </ul>
      </div>
    );
  }
}

function DataBasicInfo({
  description,
  comments,
  filename,
  format,
  version,
  schema,
  relevantLinks,
  sourceCode,
}) {
  return (
    <>
      <BasicInfo title={"Description"} info={description} />
      <BasicInfo title={"Comments"} info={comments} />

      <div>
        <BasicInfo title={"Filename"} info={filename} />
        <BasicInfo title={"Format"} info={format} />
        <BasicInfo title={"Version"} info={version} />
        <BasicInfo title={"Schema Info"} info={schema} />
      </div>
      <RelevantLinks links={relevantLinks} />
      <br />
      <div>
        <DataSourceCode
          location={sourceCode.location}
          branch={sourceCode.branch}
          tag={sourceCode.tag}
          image={sourceCode.image}
        />
      </div>
    </>
  );
}
function BasicInfo({ title, info }) {
  return (
    <>
      <u>
        <h6>{title}</h6>
      </u>
      <div className="checkin_comments">{info}</div>
    </>
  );
}
function RelevantLinks({ links }) {
  return (
    <>
      <u>
        <h6>Relevant Links</h6>
      </u>
      <div className="checkin_comments">
        {Array.isArray(links) ? (
          <ul>
            {links.map((link, i) => {
              return (
                <li key={"data_link_" + i}>
                  <a href={link}>{link}</a>
                </li>
              );
            })}{" "}
          </ul>
        ) : (
          <a href={links}>{links}</a>
        )}
      </div>
    </>
  );
}
function DataSourceCode({ location, branch, tag, image }) {
  return (
    <div className="checkin_source_code">
      <u>
        <h6>Source Code</h6>
      </u>
      <div className="checkin_comments">
        <a href={location}>{location}</a>

        {branch === "" ? null : (
          <>
            <p style={{ textIndent: 20 }}>Branch: {branch}</p>
            <br />
          </>
        )}

        {tag === "" ? null : (
          <>
            <p style={{ textIndent: 20 }}>Tag: {tag}</p>
          </>
        )}

        {image === "" ? null : (
          <>
            <p style={{ textIndent: 20 }}>Image: {image}</p>
          </>
        )}
      </div>
    </div>
  );
}
function DataLocation({ location }) {
  // need to do something a bit smarter here at some point, but this will do for now...

  if (location.system === "ESIFRepoAPI") {
    return (
      <div className="checkin_footer">
        <div className="checkin_location">
          <i
            className="fa fa-clone"
            style={{ color: "#CCCCCC", padding: 3, paddingTop: 6 }}
          ></i>
          <span className="checkin_url">
            <ESIFLocation info={location} />
          </span>
        </div>
      </div>
    );
  } else if (location.system === "AmazonS3") {
    return (
      <div className="checkin_footer">
        <div className="checkin_location">
          <i
            className="fa fa-clone"
            style={{ color: "#CCCCCC", padding: 3, paddingTop: 6 }}
          ></i>
          <span className="checkin_url">
            <AWSLocation info={location} />
          </span>
        </div>
      </div>
    );
  } else if (location.system === "HPCStorage") {
    return (
      <div className="checkin_footer">
        <div className="checkin_location">
          <i
            className="fa fa-clone"
            style={{ color: "#CCCCCC", padding: 3, paddingTop: 6 }}
          ></i>
          <span className="checkin_url">
            <HPCLocation info={location} />
          </span>
        </div>
      </div>
    );
  } else if (
    location.system === "Data Foundry" ||
    location.system === "DataFoundry"
  ) {
    return (
      <div className="checkin_footer">
        <div className="checkin_location">
          <i
            className="fa fa-clone"
            style={{ color: "#CCCCCC", padding: 3, paddingTop: 6 }}
          ></i>
          <span className="checkin_url">
            <DataFoundry info={location} />
          </span>
        </div>
      </div>
    );
  }

  return <a href={location.url}>{location.url}</a>;
}
function AWSLocation({ info }) {
  return (
    <div>
      Amazon S3
      <br></br>
      {info.description}
      <details>
        <summary>Location Details</summary>
        <ul>
          <li>Bucket: {info.bucket}</li>
          <li>Keys: {info.keys}</li>
        </ul>
      </details>
    </div>
  );
}
function HPCLocation({ info }) {
  return (
    <div>
      HPCLocation
      <br></br>
      {info.description}
      <details>
        <summary>Location Details</summary>
        <ul>
          <li>Path: info.path</li>
        </ul>
      </details>
    </div>
  );
}
function DataFoundry({ info }) {
  return (
    <>
      <a href={info.url}>{info.url}</a>
    </>
  );
}
function ESIFLocation({ info }) {
  return (
    <div>
      ESIF Repo API : <a href={info.url}>{info.url}</a>
      <br></br>
      {info.description}
      <details>
        <summary>Location Details</summary>
        <ul>
          <li>Project: {info.project}</li>
          <li>Dataset: {info.dataset}</li>
          <li>IDs: {info.ids}</li>
          <li>Keywords: {info.keyword}</li>
          <li>Tags: {info.tag}</li>
          <li>Classification: {info.classification}</li>
        </ul>
      </details>
    </div>
  );
}
function UserList({ users }) {
  return (
    <div>
      POCs:
      {users.map((obj, index) => {
        if (Array.isArray(obj.value)) {
          return <div key={"user" + index}>{obj.email} </div>;
        } else {
          return <div key={"user" + index}>{obj.email} </div>;
        }
      })}
    </div>
  );
}
