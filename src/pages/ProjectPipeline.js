import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { MarkerType } from "reactflow";
import dagre from "dagre";

import 'reactflow/dist/style.css';
import "./PageStyles.css"
import "./ReactflowStyles.css"

import useAuthStore from "./stores/AuthStore";
import useDataStore from "./stores/DataStore";

import ProjectPipelineGraphView from "./ProjectPipelineGraphView";
import ProjectPipelineDataView from "./ProjectPipelineDataView";

const nodeColors = {
  project: "#0079C2",
  projectRun: "#5DD2FF",
  model: "#5D9732",
  modelRun: "#C1EE86",
  dataset: "#FE6523",
  task: "#FFC423"
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
    getModels,
    isGettingModels,
    modelRuns,
    getModelRuns,
    isGettingModelRuns
  } = useDataStore();

  const [clickedElementData, setClickedElementedData] = useState({});

  useEffect(() => {
    validateToken(accessToken);
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    if (currentProject === null || currentProject.name !== selectedProjectName) {
      navigate('/projects')
      return;
    }

    getModels(currentProject.name, null, accessToken);

    getModelRuns(currentProject.name, null, null, accessToken);

  }, [
    isLoggedIn,
    navigate,
    accessToken,
    validateToken,
    selectedProjectName,
    currentProject,
    getModels,
    getModelRuns
  ]);

  const pipesGraph = useMemo(() => {

    if ( !currentProject || currentProject === null) {
      return (
        <Container className="mainContent">
          <Row className="mt-5">
            <Col>
              <p>Please go to <a href="/projects">projects</a> and select one of your project.</p>
            </Col>
          </Row>
        </Container>
      )
    }

    if (isGettingModels) {
      return (
        <Container className="mainContent">
          <Row className="mt-5">
            <Col>
              <FontAwesomeIcon icon={faSpinner} spin size="xl" />
            </Col>
          </Row>
        </Container>
      )
    }

    if (isGettingModelRuns) {
      return (
        <Container className="mainContent">
          <Row className="mt-5">
            <Col>
              <FontAwesomeIcon icon={faSpinner} spin size="xl" />
            </Col>
          </Row>
        </Container>
      )
    }

    let initialNodes = []
    let initialEdges = []

    // Add project node
    const pNodeId = 'n-p-' + currentProject.name;
    const pNode = {
      id: pNodeId,
      type: 'circle',
      label: 'Project',
      position: {x: 0, y: 0},
      data: currentProject,
      style: {
        backgroundColor: nodeColors.project
      }
    }
    initialNodes.push(pNode);

    // Add project run nodes & edges
    projectRuns.forEach((projectRun) => {
      const prNodeId = 'n-pr-' + projectRun.name;
      const prNode = {
        id: prNodeId,
        type: 'circle',
        label: 'ProjectRun',
        position: {x: 0, y: 0},
        data: projectRun,
        style: {
          backgroundColor: nodeColors.projectRun
        }
      }
      initialNodes.push(prNode);

      const prEdgeId = 'e-' + pNodeId + '-' + prNodeId;
      const prEdgeHandle = 'h-' + prEdgeId;
      const prEdge = {
        id: prEdgeId,
        source: pNodeId,
        target: prNodeId,
        sourceHandle: prEdgeHandle,
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
        type: 'default'
      }
      initialEdges.push(prEdge);

      // Push model nodes & edges
      models.forEach((model) => {
        const mNodeId = 'n-m-' + model.name;
        if (model.context.projectrun === projectRun.name) {
          const mNode = {
            id: mNodeId,
            type: 'circle',
            label: 'Model',
            position: {x: 0, y: 0},
            data: model,
            style: {
              backgroundColor: nodeColors.model
            }
          }
          initialNodes.push(mNode);

          const mEdgeId = 'e-' + prNodeId + '-' + mNodeId;
          const mEdgeHandle = 'h-' + mEdgeId;
          const mEdge = {
            id: mEdgeId,
            source: prNodeId,
            target: mNodeId,
            sourceHandle: mEdgeHandle,
            markerEnd: {
              type: MarkerType.ArrowClosed,
            },
            type: 'default'
          }
          initialEdges.push(mEdge);
        }

        function generateRandomString(length) {
          const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
          let result = '';
          const charactersLength = characters.length;
          for (let i = 0; i < length; i++) {
              result += characters.charAt(Math.floor(Math.random() * charactersLength));
          }
          return result;
      }

        // Push model run nodes & edges
        modelRuns.forEach((modelRun, index) => {
          const mrNodeId = 'n-mr-' + projectRun.name + '-' + model.name + '-' + modelRun.name + '-' + index;
          if (modelRun.context.projectrun === projectRun.name && modelRun.context.model === model.name) {
            const mrNode = {
              id: mrNodeId,
              type: 'circle',
              label: 'ModelRun',
              position: {x: 0, y: 0},
              data: modelRun,
              style: {
                backgroundColor: nodeColors.modelRun
              }
            }
            initialNodes.push(mrNode);

            const mrEdgeId = 'e-' + prNodeId + '-' + mNodeId + '-' + mrNodeId + '-i' + index + generateRandomString(5);
            const mrEdgeHandle = 'h-' + mrEdgeId;
            const mrEdge = {
              id: mrEdgeId,
              source: mNodeId,
              target: mrNodeId,
              sourceHandle: mrEdgeHandle,
              markerEnd: {
                type: MarkerType.ArrowClosed,
              },
              type: 'default'
            }
            initialEdges.push(mrEdge);
          }
        });
      });
    });

    // Generate dagre graph layout
    const {layoutedNodes, layoutedEdges} = getDagreLayoutedElements(initialNodes, initialEdges);

    return {nodes: layoutedNodes, edges: layoutedEdges}

  }, [currentProject, projectRuns, isGettingModels, models, modelRuns, isGettingModelRuns]);

  return (
    <Container className="mainContent" fluid>
      <Row id="pipeline-flowview">
        <Col md={8}>
          <ProjectPipelineGraphView
            graphNodes={pipesGraph.nodes}
            graphEdges={pipesGraph.edges}
            setClickedElementData={setClickedElementedData}
          />
        </Col>
        <Col sm={4} className="border-start text-start ml-4">
          <h6 className="mt-4">Click the node to retrieve its attributes</h6>
          <br/>
          <ProjectPipelineDataView data={clickedElementData} />
        </Col>
      </Row>
    </Container>
  );
}


function getDagreLayoutedElements(nodes, edges) {
  let dagreGraph = new dagre.graphlib.Graph();

  const direction = 'TB';
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction, ranker: "tight-tree", minlen: 0 });
  dagreGraph.setDefaultEdgeLabel(function () {
    return {};
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, {
      label: node.label,
      width: nodeWidth,
      height: nodeHeight,
    });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });
  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? 'left' : 'top';
    node.sourcePosition = isHorizontal ? 'right' : 'bottom';

    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches the React Flow node anchor point (top left).
    let size = 0.5
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

  return {layoutedNodes: nodes, layoutedEdges: edges};
}

export default ProjectPipeline;
