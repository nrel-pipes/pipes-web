import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { MarkerType } from "reactflow";
import dagre from "dagre";

import 'reactflow/dist/style.css';
import "./PageStyles.css";
import "./ReactflowStyles.css";

import useAuthStore from "./stores/AuthStore";
import useDataStore from "./stores/DataStore";

import ProjectPipelineGraphView from "./ProjectPipelineGraphView";
import ProjectPipelineDataView from "./ProjectPipelineDataView";

const nodeColors = {
  project: "#2D8AED",
  projectRun: "#8CCFF2",
  model: "#00A69F",
  modelRun: "#BCCB32",
  task: "#FDC70F",
  dataset: "#ED2F8C",
};

const nodeWidth = 45;
const nodeHeight = 45;

const ProjectPipeline = () => {
  const navigate = useNavigate();
  const { isLoggedIn, accessToken, validateToken } = useAuthStore();
  const {
    selectedProjectName,
    currentProject,
    projectRuns,
    models,
    isGettingModels,
    modelRuns,
    isGettingModelRuns,
    handoffs,
    isGettingHandoffs,
    batchFetchProjectData,
  } = useDataStore();

  const [clickedElementData, setClickedElementData] = useState({});

  useEffect(() => {
    validateToken(accessToken);
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    if (!currentProject || currentProject.name !== selectedProjectName) {
      batchFetchProjectData(selectedProjectName, accessToken);
    }
  }, [
    isLoggedIn,
    currentProject,
    selectedProjectName,
    accessToken,
    navigate,
    validateToken,
    batchFetchProjectData,
  ]);

  const pipesGraph = useMemo(() => {
    if (!currentProject) {
      return { nodes: [], edges: [] };
    }

    if (isGettingModels || isGettingModelRuns || isGettingHandoffs) {
      return { nodes: [], edges: [] };
    }

    let initialNodes = [];
    let initialEdges = [];

    // Add project node
    const pNodeId = `n-p-${currentProject.name}`;
    const pNode = {
      id: pNodeId,
      type: 'circle',
      label: 'Project',
      position: { x: 0, y: 0 },
      data: currentProject,
      style: {
        backgroundColor: nodeColors.project,
      },
    };
    initialNodes.push(pNode);

    // Add project run nodes & edges
    projectRuns.forEach((projectRun) => {
      const prNodeId = `n-pr-${projectRun.name}`;
      const prNode = {
        id: prNodeId,
        type: 'circle',
        label: 'ProjectRun',
        position: { x: 0, y: 0 },
        data: projectRun,
        style: {
          backgroundColor: nodeColors.projectRun,
        },
      };
      initialNodes.push(prNode);

      const prEdgeId = `e-${pNodeId}-${prNodeId}`;
      const prEdge = {
        id: prEdgeId,
        source: pNodeId,
        target: prNodeId,
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
        type: 'default',
      };
      initialEdges.push(prEdge);

      // Add model nodes & edges
      models.forEach((model) => {
        if (model.context.projectrun === projectRun.name) {
          const mNodeId = `n-m-${projectRun.name}-${model.name}`;
          const mNode = {
            id: mNodeId,
            type: 'circle',
            label: 'Model',
            position: { x: 0, y: 0 },
            data: model,
            style: {
              backgroundColor: nodeColors.model,
            },
          };
          initialNodes.push(mNode);

          const mEdgeId = `e-${prNodeId}-${mNodeId}`;
          const mEdge = {
            id: mEdgeId,
            source: prNodeId,
            target: mNodeId,
            markerEnd: {
              type: MarkerType.ArrowClosed,
            },
            type: 'default',
          };
          initialEdges.push(mEdge);

          // Add model run nodes & edges
          modelRuns.forEach((modelRun) => {
            if (
              modelRun.context.projectrun === projectRun.name &&
              modelRun.context.model === model.name
            ) {
              const mrNodeId = `n-mr-${projectRun.name}-${model.name}-${modelRun.name}`;
              const mrNode = {
                id: mrNodeId,
                type: 'circle',
                label: 'ModelRun',
                position: { x: 0, y: 0 },
                data: modelRun,
                style: {
                  backgroundColor: nodeColors.modelRun,
                },
              };
              initialNodes.push(mrNode);

              const mrEdgeId = `e-${mNodeId}-${mrNodeId}`;
              const mrEdge = {
                id: mrEdgeId,
                source: mNodeId,
                target: mrNodeId,
                markerEnd: {
                  type: MarkerType.ArrowClosed,
                },
                type: 'default',
              };
              initialEdges.push(mrEdge);
            }
          });
        }
      });
    });

    // Create a set to keep track of existing edges
    const existingEdges = new Set();

    // Process handoffs to add edges between model runs and models
    Object.entries(handoffs).forEach(([modelRunKey, handoffData]) => {
      if (Array.isArray(handoffData) && handoffData.length > 0) {
        handoffData.forEach((handoff) => {
          const { from_model, to_model, from_modelrun, context } = handoff;
          const { projectrun } = context || {};

          if (from_model && to_model && from_modelrun && projectrun) {
            const sourceNodeId = `n-mr-${projectrun}-${from_model}-${from_modelrun}`;
            const targetNodeId = `n-m-${projectrun}-${to_model}`;

            const sourceNodeExists = initialNodes.some((node) => node.id === sourceNodeId);
            const targetNodeExists = initialNodes.some((node) => node.id === targetNodeId);

            if (sourceNodeExists && targetNodeExists) {
              const edgeKey = `${sourceNodeId}-${targetNodeId}`;

              if (!existingEdges.has(edgeKey)) {
                const newEdge = {
                  id: `e-${edgeKey}`,
                  source: sourceNodeId,
                  target: targetNodeId,
                  markerEnd: {
                    type: MarkerType.ArrowClosed,
                  },
                  type: 'default',
                  isHandoff: true, // Mark this edge as a handoff edge
                };
                initialEdges.push(newEdge);
                existingEdges.add(edgeKey);
              }
            } else {
              console.warn(
                `Cannot create edge: ${!sourceNodeExists ? 'Source' : 'Target'} node not found. Source: ${sourceNodeId}, Target: ${targetNodeId}`
              );
            }
          } else {
            console.warn('Incomplete handoff data:', handoff);
          }
        });
      } else {
        console.warn(`Invalid handoff data structure for model run: ${modelRunKey}`);
      }
    });

    // Generate dagre graph layout
    const { layoutedNodes, layoutedEdges } = getDagreLayoutedElements(initialNodes, initialEdges);

    return { nodes: layoutedNodes, edges: layoutedEdges };
  }, [currentProject, projectRuns, models, modelRuns, handoffs]);

  return (
    <Container className="mainContent" fluid>
      <Row id="pipeline-flowview">
        <Col md={8}>
          <ProjectPipelineGraphView
            graphNodes={pipesGraph.nodes}
            graphEdges={pipesGraph.edges}
            setClickedElementData={setClickedElementData}
          />
        </Col>
        <Col sm={4} className="border-start text-start ml-4">
          <h6 className="mt-4">Click the node to retrieve its attributes</h6>
          <br />
          <ProjectPipelineDataView data={clickedElementData} />
        </Col>
      </Row>
    </Container>
  );
};

function getDagreLayoutedElements(nodes, edges) {
  let dagreGraph = new dagre.graphlib.Graph();

  const direction = 'TB';
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({
    rankdir: direction,
    ranker: 'tight-tree',
    minlen: 0,
  });
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  // Add nodes to the graph
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, {
      label: node.label,
      width: nodeWidth,
      height: nodeHeight,
    });
  });

  // Add edges to the graph, excluding handoff edges
  edges.forEach((edge) => {
    if (!edge.isHandoff) {
      dagreGraph.setEdge(edge.source, edge.target);
    }
  });

  // Compute the layout
  dagre.layout(dagreGraph);

  // Apply the layout to the nodes
  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? 'left' : 'top';
    node.sourcePosition = isHorizontal ? 'right' : 'bottom';

    // Adjust node positions (restoring previous logic)
    let size = 0.5;
    if (node.label === 'ProjectRun') {
      node.position = {
        x: (nodeWithPosition.x + nodeWidth / (1 + size)) * (3 + size),
        y: (nodeWithPosition.y + nodeHeight / (3 + size)) * (2 + size),
      };
    } else {
      node.position = {
        x: (nodeWithPosition.x - nodeWidth / (2 + size)) * (4 + size),
        y: (nodeWithPosition.y - nodeHeight / (2 + size)) * (3 + size),
      };
    }

    return node;
  });

  return { layoutedNodes, layoutedEdges: edges };
}

export default ProjectPipeline;
