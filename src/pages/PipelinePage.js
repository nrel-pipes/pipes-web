import React, { useMemo, useState } from "react";
import { graphlib, layout } from "dagre";
import { MarkerType } from "reactflow";

import { useProjectStore } from "../components/store/ProjectStore";
import { useProjectRunStore } from "../components/store/ProjectRunStore";
import { useModelStore } from "../components/store/ModelStore";
import { PipelineDetailed } from "../components/PipelineDetailed";
import { makeBullets } from "../components/ProjectOverview";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
const nodeColors = {
  project: "#2D8AED",
  projectRun: "#8CCFF2",
  model: "#00A69F",
  modelRun: "#BCCB32",
  task: "#FDC70F",
  dataset: "#ED2F8C",
};
const nodeWidth = 80;
const nodeHeight = 80;

export default function PipelinePage() {
  const project = useProjectStore((state) => state.project);
  const projectRuns = useProjectRunStore((state) => state.runs);
  const modelRuns = useModelStore((state) => state.runs);
  const [hoveredData, setHoveredData] = useState({});
  const updateHoveredData = (d) => {
    setHoveredData(d);
  };
  const currentProjectRun = useProjectRunStore(
    (state) => state.currentProjectRun
  );
  const projectRun = useMemo(() => {
    return projectRuns.find((pr) => pr.name === currentProjectRun);
  }, [projectRuns, currentProjectRun]);

  const models = projectRun ? projectRun.models : null;

  const graph = useMemo(() => {
    var nodes = [];
    var edges = [];
    function addNode(node, nodeType, altData) {
      if (!nodes.map((n) => n.id).includes(node.id)) {
        const nodeLabel =
          nodeType === "project"
            ? "Project " + node.id
            : nodeType === "projectRun"
            ? "Project Run " + node.id
            : node.id;
        nodes = [
          ...nodes,
          {
            id: node.id,
            type: "default",
            style: {
              width: nodeWidth,
              height: nodeHeight,
              margin: 0,
              fontSize: 10,
              borderRadius: nodeWidth,
              textAlign: "center",
              backgroundColor: nodeColors[nodeType],
            },
            data: { label: nodeLabel, metadata: altData },
            targetPosition: "top",
            sourcePosition: "bottom",
            draggable: true,
            position: { x: Math.random(), y: Math.random() },
          },
        ];
      }
    }
    function addEdge(edge) {
      var hasEdge = false;
      edges.forEach((e) => {
        if (e.source === edge.source && e.target === edge.target) {
          hasEdge = true;
        }
      });
      if (!hasEdge) {
        edges = [
          ...edges,
          {
            source: edge.source,
            target: edge.target,
            id: "edge-" + edge.source + "-" + edge.target,
            animated: false,
            type: "step",

            interactionWidth: 0,
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 30,
              height: 30,
            },
          },
        ];
      }
    }
    addNode({ id: project.name }, "project", project);
    addNode({ id: currentProjectRun }, "projectRun", projectRun);
    addEdge({ source: project.name, target: currentProjectRun });
    if (models) {
      models.forEach((model) => {
        addNode({ id: model.model_name }, "model", model);
        addEdge({ source: currentProjectRun, target: model.model_name });
      });
    }
    // TODO: no project run edges
    if (projectRun) {
      // projectRun.edges.forEach((edge) => {
      //   addEdge({ source: edge.from_model, target: edge.to_model });
      // });
    }
    if (modelRuns) {
      Object.entries(modelRuns).forEach((o) => {
        const model = o[0];
        const runs = o[1];
        Object.values(runs).forEach((run) => {
          addNode(
            { id: run.model_run_props.name },
            "modelRun",
            Object.fromEntries(
              Object.entries(run.model_run_props).filter(
                (entry) => entry[0] !== "datasets" && entry[0] !== "handoffs"
              )
            )
          );

          addEdge({ source: model, target: run.model_run_props.name });
          run.datasets.forEach((dataset) => {
            addNode({ id: dataset.dataset_id }, "dataset", dataset);
            addEdge({
              source: run.model_run_props.name,
              target: dataset.dataset_id,
            });
          });
          run.tasks.forEach((task) => {
            addNode({ id: task.task_name }, "task", task);
            addEdge({ target: task.task_name, source: task.dataset_ids });
          });
        });
      });
    }
    if (nodes.length > 1) {
      const layout = getLayout(nodes, edges);
      nodes.forEach((node) => {
        const pos = layout[node.id];
        node.position.x = pos.x;
        node.position.y = pos.y;
      });
    }

    return { nodes: nodes, edges: edges };
  }, [project, projectRun, currentProjectRun, models, modelRuns]);

  return (
    <Container className="vh-100 main-content" fluid style={{ padding: 1 }}>
      <Row id="pipeline-view-top-row">
        <Col>
          <PipelineDetailed
            initialNodes={graph.nodes}
            initialEdges={graph.edges}
            updateHoveredData={updateHoveredData}
          />
        </Col>
        <Col sm={5}>
          {/* <pre>{JSON.stringify(hoveredData, null, 2)}</pre> */}
          <NodeDataView data={hoveredData} />
        </Col>
      </Row>
    </Container>
  );
}

function getLayout(nodes, edges) {
  let g = new graphlib.Graph();
  g.setGraph({ rankdir: "TB", ranker: "tight-tree", minlen: 0 });
  g.setDefaultEdgeLabel(function () {
    return {};
  });

  nodes.forEach((node) => {
    g.setNode(node.id, {
      label: node.id,
      width: nodeWidth,
      height: nodeHeight,
    });
  });

  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target);
  });
  layout(g);

  return g._nodes;
}
function _determine_output(d) {
  if (typeof d === "object") {
    return makeBullets(d);
  }
  return d;
}
function NodeDataView({ data }) {
  const d = Object.entries(data).filter((entry) => {
    if (entry[0] !== "_history") {
      if (Array.isArray(entry[1])) {
        if (entry[1].length === 0) {
          return false;
        }
      } else {
        return true;
      }
    }
    return false;
  });

  return (
    <div>
      {d.map((entry, i) => {
        return (
          <details key={"node_data_" + i}>
            <summary className="checkin_description">{entry[0]}</summary>
            {_determine_output(entry[1])}
          </details>
        );
      })}
    </div>
  );
}
