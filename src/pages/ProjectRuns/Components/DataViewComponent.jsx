// External imports
import { useEffect, useMemo, useState } from "react";

// Import CSS file
import "./DataViewComponent.css";

// Internal imports
import useUIStore from "../../../stores/UIStore";
import HandoffsComponent from "./HandoffsComponent";
import ScenarioMappingComponent from "./ScenarioMappingComponent";

import { useGetModelsQuery } from "../../../hooks/useModelQuery";
import { useGetModelRunsQuery } from "../../../hooks/useModelRunQuery";


// Helper function to render table data (since we can't import it from Pipeline component)
function renderTableData(obj) {
  if (!obj) return <></>;

  const keys = Object.keys(obj).filter(key => key !== 'is_superuser');
  if (keys.length === 0) return <div className="empty-data">No data</div>;

  // Check if this is a simple array of primitives
  if (Array.isArray(obj) && typeof obj[0] !== 'object') {
    return (
      <table className="data-table simple-array-table">
        <tbody>
          {obj.map((item, i) => (
            <tr key={`row_${i}`}>
              <td>{item}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  // Handle objects and arrays of objects
  return (
    <table className="data-table">
      <tbody>
        {keys.map((key) => {
          let value = obj[key];
          const keyIsInt = !isNaN(parseInt(key, 10));
          let keyDisplay = key.includes("_") ? key.replace(/_/g, " ") : key;

          if (keyIsInt) keyDisplay = `Item ${parseInt(key) + 1}`;

          return (
            <tr key={`row_${key}`} className="data-row">
              {!keyIsInt && (
                <td className="key-cell">{keyDisplay}</td>
              )}
              <td className={keyIsInt ? "value-cell full-width" : "value-cell"} colSpan={keyIsInt ? 2 : 1}>
                {renderValue(value, key)}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function renderValue(value, key) {
  // Handle different types of values
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return <span className="empty-value">Empty array</span>;
    }

    // For arrays of objects, render nested tables
    if (typeof value[0] === 'object') {
      return (
        <div className="nested-table-wrapper">
          {renderTableData(value)}
        </div>
      );
    }
    // For arrays of primitives
    else {
      return (
        <div className="array-value-list">
          {value.map((item, i) => (
            <div key={`${key}_${i}`} className="array-item">
              {item}
            </div>
          ))}
        </div>
      );
    }
  }
  // For objects, render nested tables
  else if (typeof value === 'object' && value !== null) {
    return (
      <div className="nested-table-wrapper">
        {renderTableData(value)}
      </div>
    );
  }
  // For primitive values
  else {
    return <span className="primitive-value">{String(value)}</span>;
  }
}


export default function DataViewComponent({ selected, projectRun, showProjectRunData }) {
  const projectName = projectRun.context.project;
  const [showInstructions, setShowInstructions] = useState(true);

  const {
    data: models = [],
    isLoading: isLoadingModels,
  } = useGetModelsQuery(projectName, projectRun.name, {});

  const {
    data: modelRuns = [],
    isLoading: isLoadingModelRuns,
  } = useGetModelRunsQuery(projectName, projectRun.name, null, {});

  const getColor = useUIStore((state) => state.getColor);
  const scenarioColors = useUIStore((state) => state.scenarios);

  const model = useMemo(() => {
    if (selected && models && models.length > 0) {
      return models.find((model) => model.name === selected.id);
    }
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
    // Add null check to prevent the forEach on undefined
    if (models && models.length > 0) {
      models.forEach((model) => {
        // Add null check for scenario_mappings
        if (model.scenario_mappings) {
          model.scenario_mappings.forEach((mapping) => {
            getColor(mapping.model_scenario);
          });
        }
      });
    }
  }, [models, getColor]);

  // Hide instructions when data is received
  useEffect(() => {
    if (selected && model) {
      setShowInstructions(false);
    } else {
      setShowInstructions(true);
    }
  }, [selected, model]);

  // If we should show project run data (no model selected)
  if (showProjectRunData && projectRun) {
    return (
      <div className="data-view p-3 project-run-view">
        <div className="project-run-header">
          <h3 className="model-name">Project Run: {projectRun.name}</h3>
        </div>

        {projectRun.description && (
          <div className="section-container">
            <h5 className="section-title">Description</h5>
            <p className="mb-0">{projectRun.description}</p>
          </div>
        )}

        {projectRun.assumptions && projectRun.assumptions.length > 0 && (
          <div className="section-container">
            <h5 className="section-title">Assumptions</h5>
            <div className="badge-list">
              {projectRun.assumptions.map((assumption, idx) => (
                <div key={idx} className="data-badge">{assumption}</div>
              ))}
            </div>
          </div>
        )}

        {projectRun.scenarios && projectRun.scenarios.length > 0 && (
          <div className="section-container">
            <h5 className="section-title">Scenarios</h5>
            <div className="badge-list">
              {projectRun.scenarios.map((scenario, idx) => (
                <div key={idx} className="data-badge">{scenario}</div>
              ))}
            </div>
          </div>
        )}

        {projectRun.requirements && Object.keys(projectRun.requirements).length > 0 && (
          <div className="section-container">
            <h5 className="section-title">Requirements</h5>
            <div className="requirements-list">
              {Object.entries(projectRun.requirements).map(([key, value], idx) => (
                <div key={idx} className="requirement-item">
                  <strong>{key}:</strong>
                  {typeof value === 'object' ? (
                    <div className="nested-requirements">
                      {Object.entries(value).map(([nestedKey, nestedValue], nestedIdx) => (
                        <div key={nestedIdx} className="nested-requirement-item">
                          <span>{nestedKey}:</span> &nbsp;
                          <span>{nestedValue.toString()}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span>{value.toString()}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {projectRun.scheduled_start && (
          <div className="section-container">
            <h5 className="section-title">Scheduled Duration</h5>
            <div className="duration-container">
              <div className="duration-column">
                <span className="duration-label">Start:</span>
                <span>{new Date(projectRun.scheduled_start).toLocaleDateString()}</span>
              </div>
              <div className="duration-column">
                <span className="duration-label">End:</span>
                <span>{new Date(projectRun.scheduled_end).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* Handoffs Section */}
        <HandoffsComponent projectRun={projectRun} />
      </div>
    );
  }

  // ORIGINAL CODE FOR MODEL DISPLAY
  if (!model) {
    return (
      <div className="data-view-wrapper">
        {showInstructions && (
          <div className="data-instructions">
            <p>Click a model to see more details</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="data-view-wrapper">
      <div className="data-sections">
        {/* Model Info Section */}
        <div className="data-section">
          <div className="section-header model-id-header">Model ({selected.id})</div>
          <div className="section-content">
            <table className="data-table">
              <tbody>
                <tr className="data-row">
                  <td className="key-cell">Type</td>
                  <td className="value-cell">{model.type}</td>
                </tr>
                {model.requirements && Object.keys(model.requirements).length > 0 && (
                  <tr className="data-row">
                    <td className="key-cell">Requirements</td>
                    <td className="value-cell nested-content">
                      <div className="nested-table-wrapper">
                        {renderTableData(model.requirements)}
                      </div>
                    </td>
                  </tr>
                )}
                {model.scenario_mappings && model.scenario_mappings.length > 0 && (
                  <>
                    <tr className="data-row scenario-mapping-header">
                      <td colSpan="2" className="key-cell full-width">Scenario Mappings</td>
                    </tr>
                    <tr className="data-row scenario-mapping-content">
                      <td colSpan="2" className="full-width-cell">
                        <ScenarioMappingComponent data={model.scenario_mappings} />
                      </td>
                    </tr>
                  </>
                )}
                {model.other && Object.keys(model.other).filter(key => key !== 'color').length > 0 && (
                  <tr className="data-row">
                    <td className="key-cell">Other Info</td>
                    <td className="value-cell nested-content">
                      <div className="nested-table-wrapper">
                        {renderTableData(
                          Object.fromEntries(
                            Object.entries(model.other).filter(([key]) => key !== 'color')
                          )
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Datasets Section */}
        <div className="data-section">
          <div className="section-header">Datasets</div>
          <div className="section-content">
            {data && data.length > 0 ? (
              <DatasetsList datasets={data} scenarioColors={scenarioColors} />
            ) : (
              <div className="no-data">
                <p>No datasets available for this model under this project run</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DatasetsList({ datasets, scenarioColors }) {
  return (
    <div className="datasets-container">
      {datasets.map((dataset, index) => (
        <div key={`dataset_${index}`} className="dataset-item">
          <details className="dataset-details">
            <summary className="dataset-summary">
              <span className="dataset-id">{dataset.dataset_id}</span>
              <div className="dataset-badges">
                {dataset.other.is_handoff && (
                  <span className="dataset-badge handoff-badge">Handoff</span>
                )}
                <span className={`dataset-badge ${dataset.metadata_validated ? 'validated-badge' : 'unvalidated-badge'}`}>
                  {dataset.metadata_validated ? 'Validated' : 'Not Validated'}
                </span>
              </div>
            </summary>
            <div className="dataset-content">
              <div className="dataset-metadata">
                <div className="dataset-created">
                  Created: {new Date(dataset.created).toLocaleString()} by {dataset.registration_author.username}
                </div>

                <table className="data-table dataset-info-table">
                  <tbody>
                    <BasicInfoRow title="Description" value={dataset.description} />
                    <BasicInfoRow title="Comments" value={dataset.comments} />
                    <BasicInfoRow title="Filename" value={dataset.name} />
                    <BasicInfoRow title="Format" value={dataset.data_format} />
                    <BasicInfoRow title="Version" value={dataset.version} />
                    <BasicInfoRow title="Schema Info" value={dataset.schema_info} />

                    {/* Source Code */}
                    <tr className="data-row">
                      <td className="key-cell">Source Code</td>
                      <td className="value-cell">
                        <a href={dataset.source_code.location}>{dataset.source_code.location}</a>
                        {dataset.source_code.branch && (
                          <div className="source-detail">Branch: {dataset.source_code.branch}</div>
                        )}
                        {dataset.source_code.tag && (
                          <div className="source-detail">Tag: {dataset.source_code.tag}</div>
                        )}
                        {dataset.source_code.image && (
                          <div className="source-detail">Image: {dataset.source_code.image}</div>
                        )}
                      </td>
                    </tr>

                    {/* Relevant Links */}
                    <tr className="data-row">
                      <td className="key-cell">Relevant Links</td>
                      <td className="value-cell">
                        {Array.isArray(dataset.relevant_links) ? (
                          <ul className="links-list">
                            {dataset.relevant_links.map((link, i) => (
                              <li key={`link_${i}`} className="link-item">
                                <a href={link}>{link}</a>
                              </li>
                            ))}
                          </ul>
                        ) : dataset.relevant_links ? (
                          <a href={dataset.relevant_links}>{dataset.relevant_links}</a>
                        ) : (
                          <span className="empty-value">None</span>
                        )}
                      </td>
                    </tr>

                    {/* Scenarios */}
                    <tr className="data-row">
                      <td className="key-cell">Scenarios</td>
                      <td className="value-cell">
                        <ScenariosList scenarios={dataset.scenarios} scenarioColors={scenarioColors} />
                      </td>
                    </tr>

                    {/* Other metadata sections */}
                    <MetadataRow title="Model Years" data={dataset.model_years} />
                    <MetadataRow title="Units" data={dataset.units} />
                    <MetadataRow title="Weather Years" data={dataset.weather_years} />
                    <MetadataRow title="Spatial Info" data={dataset.spatial_info} />
                    <MetadataRow title="Temporal Info" data={dataset.temporal_info} />
                    <MetadataRow title="Other Info" data={dataset.other}
                                 filter={key => key !== 'is_handoff' && key !== 'is_superuser'} />
                  </tbody>
                </table>
              </div>
            </div>
          </details>
          <div className="dataset-location">
            <LocationInfo location={dataset.location} />
          </div>
        </div>
      ))}
    </div>
  );
}

function BasicInfoRow({ title, value }) {
  if (!value) return null;
  return (
    <tr className="data-row">
      <td className="key-cell">{title}</td>
      <td className="value-cell">{value}</td>
    </tr>
  );
}

function MetadataRow({ title, data, filter }) {
  if (!data) return null;

  // For arrays
  if (Array.isArray(data)) {
    if (data.length === 0) return null;

    return (
      <tr className="data-row">
        <td className="key-cell">{title}</td>
        <td className="value-cell">
          <ul className="data-list">
            {data.map((item, i) => (
              <li key={`${title}_${i}`} className="data-list-item">{item}</li>
            ))}
          </ul>
        </td>
      </tr>
    );
  }

  // For objects
  if (typeof data === 'object' && data !== null) {
    const keys = filter ?
      Object.keys(data).filter(filter) :
      Object.keys(data);

    if (keys.length === 0) return null;

    return (
      <tr className="data-row">
        <td className="key-cell">{title}</td>
        <td className="value-cell nested-content">
          <div className="nested-table-wrapper">
            <table className="data-table">
              <tbody>
                {keys.map((key, i) => {
                  const value = data[key];
                  return (
                    <tr key={`${title}_${key}_${i}`} className="data-row">
                      <td className="key-cell">{key}</td>
                      <td className="value-cell">
                        {typeof value === 'object' ? (
                          <MetadataNestedContent data={value} />
                        ) : (
                          value
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </td>
      </tr>
    );
  }

  // For primitive values
  return (
    <tr className="data-row">
      <td className="key-cell">{title}</td>
      <td className="value-cell">{data}</td>
    </tr>
  );
}

function MetadataNestedContent({ data }) {
  if (Array.isArray(data)) {
    return (
      <ul className="data-list">
        {data.map((item, i) => (
          <li key={`item_${i}`} className="data-list-item">
            {typeof item === 'object' ? (
              <MetadataNestedContent data={item} />
            ) : (
              item
            )}
          </li>
        ))}
      </ul>
    );
  }

  if (typeof data === 'object' && data !== null) {
    return (
      <table className="data-table nested-table">
        <tbody>
          {Object.entries(data).map(([key, value], i) => (
            <tr key={`row_${i}`} className="data-row">
              <td className="key-cell">{key}</td>
              <td className="value-cell">
                {typeof value === 'object' ? (
                  <MetadataNestedContent data={value} />
                ) : (
                  value
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return data;
}

function ScenariosList({ scenarios, scenarioColors }) {
  if (!scenarios) return <span className="empty-value">None</span>;

  const renderScenario = (scenario) => {
    const color = scenario in scenarioColors ? scenarioColors[scenario].color : "grey";
    const displayName = scenario in scenarioColors && "display_name" in scenarioColors[scenario] ?
      scenarioColors[scenario].display_name : scenario;

    return (
      <div
        className="scenario-badge"
        style={{ backgroundColor: color }}
      >
        {displayName}
      </div>
    );
  };

  if (Array.isArray(scenarios)) {
    return (
      <div className="scenarios-list">
        {scenarios.map((scenario, i) => (
          <div key={`scenario_${i}`} className="scenario-item">
            {renderScenario(scenario)}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="scenarios-list">
      <div className="scenario-item">
        {renderScenario(scenarios)}
      </div>
    </div>
  );
}

function LocationInfo({ location }) {
  if (!location) return null;

  let content;

  if (location.system === "ESIFRepoAPI") {
    content = (
      <>
        ESIF Repo API: <a href={location.url}>{location.url}</a>
        <details className="location-details">
          <summary>Location Details</summary>
          <table className="data-table location-table">
            <tbody>
              <tr><td>Project:</td><td>{location.project}</td></tr>
              <tr><td>Dataset:</td><td>{location.dataset}</td></tr>
              <tr><td>IDs:</td><td>{location.ids}</td></tr>
              <tr><td>Keywords:</td><td>{location.keyword}</td></tr>
              <tr><td>Tags:</td><td>{location.tag}</td></tr>
              <tr><td>Classification:</td><td>{location.classification}</td></tr>
            </tbody>
          </table>
        </details>
      </>
    );
  } else if (location.system === "AmazonS3") {
    content = (
      <>
        Amazon S3 {location.description && <span>: {location.description}</span>}
        <details className="location-details">
          <summary>Location Details</summary>
          <table className="data-table location-table">
            <tbody>
              <tr><td>Bucket:</td><td>{location.bucket}</td></tr>
              <tr><td>Keys:</td><td>{location.keys}</td></tr>
            </tbody>
          </table>
        </details>
      </>
    );
  } else if (location.system === "HPCStorage") {
    content = (
      <>
        HPC Storage {location.description && <span>: {location.description}</span>}
        <details className="location-details">
          <summary>Location Details</summary>
          <table className="data-table location-table">
            <tbody>
              <tr><td>Path:</td><td>{location.path}</td></tr>
            </tbody>
          </table>
        </details>
      </>
    );
  } else if (location.system === "Data Foundry" || location.system === "DataFoundry") {
    content = <a href={location.url}>{location.url}</a>;
  } else {
    content = <a href={location.url}>{location.url}</a>;
  }

  return (
    <div className="dataset-location-info">
      {content}
    </div>
  );
}
