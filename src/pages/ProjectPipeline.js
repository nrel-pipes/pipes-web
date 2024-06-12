import { useEffect, useState } from "react";
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
import useProjectStore from "./stores/ProjectStore";
import useModelStore from "./stores/ModelStore";
// import useModelRunStore from "./stores/ModelRunStore";

import ProjectPipelineGraphView from "./ProjectPipelineGraphView";
import ProjectPipelineDataView from "./ProjectPipelineDataView";
import useProjectRunStore from "./stores/ProjectRunStore";

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
  const { isLoggedIn, accessToken } = useAuthStore();
  const { selectedProjectName, currentProject} = useProjectStore();
  const { projectRuns } = useProjectRunStore();
  const { models, getModels, isGettingModels} = useModelStore();
  // const { modelRuns } = useModelRunStore();

  const [clickedElementData, setClickedElementedData] = useState({});

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    if (currentProject === null || currentProject.name !== selectedProjectName) {
      navigate('/projects')
      return;
    }

    if (!models || models === null || models.length === 0) {
      getModels(currentProject.name, null, accessToken);
    }


  }, [
    isLoggedIn,
    navigate,
    accessToken,
    selectedProjectName,
    currentProject,
    models,
    getModels
  ]);

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

  let initialNodes = []
  let initialEdges = []

  // Add project node
  const pNodeId = 'n-p-' + currentProject.name;
  const pNode = {
    id: pNodeId,
    label: 'Project',
    type: 'circle',
    position: {x: Math.random(), y: Math.random()},
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
      label: 'ProjectRun',
      type: 'circle',
      position: {x: Math.random(), y: Math.random()},
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
      if (model.context.projectrun !== projectRun.name) {
        const mNodeId = 'n-m-' + model.name;
        const mNode = {
          id: mNodeId,
          label: 'Model',
          type: 'circle',
          position: {x: Math.random(), y: Math.random()},
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
    });
  });

  // Generate dagre graph layout
  const {nodes, edges} = getDagreLayoutedElements(initialNodes, initialEdges);

  return (
    <Container className="mainContent" fluid>
      <Row id="pipeline-flowview">
        <Col md={8}>
          <ProjectPipelineGraphView
            graphNodes={nodes}
            graphEdges={edges}
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
      label: node.data.label,
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
    if (node.label === 'ProjectRun') {
      node.position = {
        x: (nodeWithPosition.x + nodeWidth / (1 + Math.random())) * (3 + Math.random()),
        y: (nodeWithPosition.y + nodeHeight / (3 + Math.random())) * (2 + Math.random()),
      };
    } else {
      node.position = {
        x: (nodeWithPosition.x - nodeWidth / (2 + Math.random())) * (4 + Math.random()),
        y: (nodeWithPosition.y - nodeHeight / (2 + Math.random())) * (3 + Math.random()),
      };
    }
    return node;
  });

  return {nodes, edges};
}

export default ProjectPipeline;
