import { MarkerType } from "reactflow";
import { graphlib, layout } from "dagre";

import * as d3 from "d3";

export const modelTypeMap = d3
  .scaleOrdinal()
  .domain([
    "dsgrid",
    "rpm",
    "dgen",
    "ComStock",
    "ResStock",
    "jobs",
    "engage",
    "load",
    "sienna",
    "pras",
    "rev",
  ])
  .range([
    "Loads",
    "Capacity Expansion",
    "Distributed Generation",
    "Building Loads",
    "Building Loads",
    "Jobs Analysis",
    "Capacity Expansion",
    "Electricity Generation",
    "Production Cost Model",
    "Resource Adequacy",
    "Renewable Resource Potential",
  ])
  .unknown("");

const nodeWidth = 130;
const nodeHeight = 130;
const scenarioNodeWidth = 320;

export function createEdgesOverview(edges) {
  return edges.map((edge, index) => {
    return {
      id: edge.from_model + "_" + edge.to_model,
      source: edge.from_model,
      target: edge.to_model,
      targetHandle: edge.to_model + "_input_" + edge.from_model,
      sourceHandle: edge.from_model + "_output_" + edge.to_model,
      style: {},
      data: edge.description,
      animated: false,
      type: "smoothstep",
      interactionWidth: 0,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
      },
    };
  });
}

export function createNodesOverview(models, modelRuns, lastCheckIns, edges) {
  let names = edges.length
    ? [
        ...new Set([
          ...edges.map((edge) => edge.from_model),
          ...edges.map((edge) => edge.to_model),
        ]),
      ]
    : models.map((model) => model.name);

  let nodePos = getLayout(names, edges);

  // Subset the models based on ones that currently in the edge network

  models = models.filter((m) => ~names.indexOf(m.name));

  // Create parent labels from the model types
  var parents = [];
  const defaultColor = "#084343";
  // Build the model nodes
  let nodes = models.map((model, index) => {
    const runs = modelRuns[model.name];

    const parent = parents.find((p) => p.name === model.type);
    const x = nodePos[model.name].x - nodeWidth / 2;
    const y = nodePos[model.name].y - (nodeHeight + 50) / 2;
    const lastCheckIn = lastCheckIns[model.name]
      ? lastCheckIns[model.name].toLocaleDateString()
      : null;

    const type = modelTypeMap(model.name);
    const numCheckIns = runs
      ? Object.values(runs)
          .map((run) => run.datasets.length)
          .reduce((a, b) => a + b, 0)
      : 0;
    const totalHandoffs = runs
      ? Object.values(runs)
          .map((run) => run.model_run_props.handoffs.length)
          .reduce((a, b) => a + b, 0)
      : 0;
    let handoffProgress = runs
      ? Object.values(runs)
          .map((run) => {
            const datasets = run.datasets;
            const doneDatasetIds = datasets.map((d) => d.dataset_id);
            const doneTasks = run.tasks.map((task) => task.subtask_ids).flat();
            // const plannedTasks = run.model_run_props.handoffs
            //   .map((handoff) => {

            //     const transformIds = handoff.transformation.map((t) => t.id);
            //     const visIds = handoff.visualization.map((v) => v.id);
            //     const qaqcIds = handoff.qaqc.map((q) => q.id);
            //     return [...transformIds, ...visIds, ...qaqcIds];
            //   })
            //   .flat();
            // const taskProgress =
            //   doneTasks && plannedTasks.length > 0
            //     ? plannedTasks
            //         .map((t) => (doneTasks.includes(t) ? 1 : 0))
            //         .reduce((a, b) => a + b, 0) / plannedTasks.length
            //     : plannedTasks.length > 0
            //     ? 0
            //     : 1;

            const plannedDatasetIds = run.model_run_props.datasets.map(
              (d) => d.dataset_id
            );
            const datasetProgress =
              plannedDatasetIds && doneDatasetIds
                ? plannedDatasetIds
                    .map((d) => (doneDatasetIds.includes(d) ? 1 : 0))
                    .reduce((a, b) => a + b, 0) / plannedDatasetIds.length
                : plannedDatasetIds
                ? 0
                : 1;

            return { datasets: datasetProgress, tasks: 0 }; //taskProgress };
          })
          .reduce(
            (a, b) => {
              return {
                datasets: a.datasets + b.datasets,
                tasks: a.tasks + b.tasks,
              };
            },
            { datasets: 0, tasks: 0 }
          )
      : { datasets: 0, tasks: 0 };
    const numRuns = runs ? Object.keys(runs).length : 1;

    handoffProgress.datasets = runs
      ? handoffProgress.datasets / numRuns
      : handoffProgress.datasets;

    handoffProgress.tasks = runs
      ? handoffProgress.tasks / numRuns
      : handoffProgress.tasks;
    const color = "color" in model.other ? model.other.color : defaultColor;

    return {
      id: model.name,
      data: {
        label: model.name,
        type: type,
        last_checkin: lastCheckIn,
        checkins: numCheckIns,
        total_handoffs: totalHandoffs,
        percentages: handoffProgress,
        handoffs: [{ value: 0, color: "", label: "" }],
        inputs: edges
          .filter((edge) => edge.to_model === model.name)
          .map((e) => model.name + "_input_" + e.from_model),
        outputs: edges
          .filter((edge) => edge.from_model === model.name)
          .map((e) => model.name + "_output_" + e.to_model),
        color: color,
      },

      type: "custom",
      position: {
        x: parent ? x - parent.position.x : x,
        y: parent ? y - parent.position.y : y,
      },
      style: {
        width: nodeWidth,
        border: "transparent",
      },
    };
  });

  return parents.concat(nodes);
}

export function createScenarioNodes(model_scenarios, scenarios, colorMap) {
  // Build the model nodes

  let nodes = model_scenarios.map((scenario, index) => {
    let x = -scenarioNodeWidth / 2;
    let y = (index * nodeHeight) / (model_scenarios.length / 3);

    // const color = colorMap[scenario.model_scenario].color; //scenarios.find((s) => s.name === scenario.model_scenario).color;
    const color = 'gray';

    return {
      id: "model_" + scenario.model_scenario,
      data: {
        label: scenario.model_scenario,
        scope: "model",
      },
      type: "scenario",
      sourcePosition: "right",
      position: {
        x: x,
        y: y,
      },
      style: {
        backgroundColor: color,
      },
    };
  });

  let pnodes = scenarios.map((scenario, index) => {
    let x = 2 * nodeWidth;
    let y = (index * nodeHeight) / 3;

    // const color = colorMap[scenario.name].color;
    const color = 'gray';

    return {
      id: "project_" + scenario.name,
      data: {
        label: scenario.name,
        scope: "project",
      },
      type: "scenario",
      targetPosition: "left",
      position: {
        x: x,
        y: y,
      },
      style: {
        backgroundColor: color,
      },
    };
  });

  return nodes.concat(pnodes);
}

export function createScenarioEdges(mapping) {
  return mapping
    .map((edge, index) => {
      return edge.project_scenarios.map((ps) => {
        return {
          id: edge.model_scenario + "_" + ps,
          source: "model_" + edge.model_scenario,
          target: "project_" + ps,
          animated: false,
          interactionWidth: 0,
          connectionMode: "loose",
          type: "simplebezier",
        };
      });
    })
    .flat();
}

function getLayout(models, edges) {
  let g = new graphlib.Graph();
  g.setGraph({ rankdir: "LR" });
  g.setDefaultEdgeLabel(function () {
    return {};
  });

  models.forEach((model) => {
    g.setNode(model, {
      label: model,
      width: nodeWidth,
      height: nodeHeight + 50,
    });
  });
  if (edges.length > 0) {
    edges.forEach((edge) => {
      g.setEdge(edge.from_model, edge.to_model);
    });
  } else {
    models.forEach((model, i) => {
      if (i > 0) {
        g.setEdge(models[i - 1], model);
      }
    });
  }
  layout(g);

  return g._nodes;
}
