import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import dagre from "dagre";
import { MarkerType } from "reactflow";

import 'reactflow/dist/style.css';
import "../PageStyles.css";
import "./ProjectPipelinePage.css";

import useAuthStore from "../../stores/AuthStore";
import useDataStore from "../../stores/DataStore";

import ContentHeader from "../Components/ContentHeader";
import DataViewComponent from "./Components/DataViewComponent";
import GraphViewComponent from "./Components/GraphViewComponent";

import { useGetHandoffsQuery } from "../../hooks/useHandoffQuery";
import { useGetModelsQuery } from "../../hooks/useModelQuery";
import { useGetModelRunsQuery } from "../../hooks/useModelRunQuery";
import { useGetProjectQuery } from "../../hooks/useProjectQuery";
import { useGetProjectRunsQuery } from "../../hooks/useProjectRunQuery";
import NavbarSub from "../../layouts/NavbarSub";

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

const ProjectPipelinePage = () => {
  const navigate = useNavigate();
  const { isLoggedIn, accessToken, validateToken } = useAuthStore();
  const { effectivePname } = useDataStore();

  const shouldFetchData = !!effectivePname && isLoggedIn;

  const {
    data: project,
    isLoading: isLoadingProject,
  } = useGetProjectQuery(effectivePname, {
    enabled: shouldFetchData
  });

  const {
    data: projectRuns = [],
    isLoading: isLoadingProjectRuns
  } = useGetProjectRunsQuery(effectivePname, {
    enabled: shouldFetchData
  });

  const projectDataAvailable = shouldFetchData && !!project;

  const {
    data: models = [],
    isLoading: isLoadingModels
  } = useGetModelsQuery(
    effectivePname,
    null,
    {
      enabled: projectDataAvailable
    }
  );

  const {
    data: modelRuns = [],
    isLoading: isLoadingModelRuns
  } = useGetModelRunsQuery(
    effectivePname,
    null,
    null,
    {
      enabled: projectDataAvailable
    }
  );

  const {
    data: handoffs = [],
    isLoading: isLoadingHandoffs
  } = useGetHandoffsQuery(
    effectivePname,
    null,
    {
      enabled: projectDataAvailable
    }
  );

  const isLoading = isLoadingProject || isLoadingProjectRuns ||
                   isLoadingModels || isLoadingModelRuns ||
                   isLoadingHandoffs;

  const [clickedElementData, setClickedElementedData] = useState({});

  useEffect(() => {
    validateToken(accessToken);
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    if (!effectivePname) {
      navigate('/projects');
      return;
    }
  }, [
    isLoggedIn,
    navigate,
    accessToken,
    validateToken,
    effectivePname
  ]);

  const pipesGraph = useMemo(() => {
    if (isLoading) {
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

    if (!project) {
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

    let initialNodes = []
    let initialEdges = []

    const pNodeId = 'n-p-' + project.name;
    const pNode = {
      id: pNodeId,
      type: 'circle',
      label: 'Project',
      position: {x: 0, y: 0},
      data: project,
      style: {
        backgroundColor: nodeColors.project
      }
    }
    initialNodes.push(pNode);

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
        type: 'default',
        style: {
          stroke: "#0d3d6b",
          strokeWidth: 2,
        },
        label: "runs",
        data: {}
      }
      initialEdges.push(prEdge);

      let modelNodeIdMapping = new Map();
      models.forEach((model, index) => {
        const mNodeId = 'n-m-' + model.name + '-' + index;
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
          modelNodeIdMapping.set(model.name, mNodeId);
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
              width: 12,
              height: 12,
              style: { stroke: "#ff0000", fill: "#ff0000" }
            },
            type: 'default',
            style: {
              stroke: "#31b2cc",
              strokeWidth: 2,
            },
            label: "requires",
            data: {}
          }
          initialEdges.push(mEdge);
        }
      });

      models.forEach((model, index1) => {
        handoffs.forEach((handoff, index2) => {
          const hEdgeId = 'e-handoff-' + projectRun.name + '-from-' + model.name + '-to-' + handoff.to_model + '-' + handoff.name + '-' + index1 + index2;
          if (handoff.context.projectrun === projectRun.name && handoff.from_model === model.name) {
            const hEdgeHandle = 'h-' + hEdgeId;
            const hEdge = {
              id: hEdgeId,
              source: modelNodeIdMapping.get(handoff.from_model),
              target: modelNodeIdMapping.get(handoff.to_model),
              sourceHandle: hEdgeHandle,
              markerEnd: {
                type: MarkerType.ArrowClosed,
                width: 10,
                height: 10,
                style: { stroke: "#4c9b2f", fill: "#4c9b2f" },
              },
              type: 'default',
              style: {
                stroke: "#4c9b2f",
                strokeWidth: 2,
                strokeDasharray: "5,5",
              },
              label: "informs",
              data: handoff
            }
            initialEdges.push(hEdge);
          }
        });
      });

      function generateRandomString(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
      }

      models.forEach((model, index1) => {
        const mNodeId = modelNodeIdMapping.get(model.name);
        modelRuns.forEach((modelRun, index2) => {
          const mrNodeId = 'n-mr-' + projectRun.name + '-' + model.name + '-' + index1 + '-' + modelRun.name + '-' + index2;
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
            };
            initialNodes.push(mrNode);

            const mrEdgeId = 'e-' + prNodeId + '-' + mNodeId + '-' + mrNodeId + '-i' + index1 + index2 + generateRandomString(5);
            const mrEdgeHandle = 'h-' + mrEdgeId;
            const mrEdge = {
              id: mrEdgeId,
              source: mNodeId,
              target: mrNodeId,
              sourceHandle: mrEdgeHandle,
              markerEnd: {
                type: MarkerType.ArrowClosed,
              },
              type: 'default',
              label: 'performs',
              style: {
                stroke: "#c1d7af",
                strokeWidth: 2,
                strokeDasharray: "5,5",
              },
              data: {}
            }
            initialEdges.push(mrEdge);
          }
        });
      });

    });

    const {layoutedNodes, layoutedEdges} = getDagreLayoutedElements(initialNodes, initialEdges);

    return {nodes: layoutedNodes, edges: layoutedEdges}

  }, [project, projectRuns, models, modelRuns, handoffs, isLoading]);

  return (
    <>
    <NavbarSub navData={{pAll: true, pName: effectivePname, pGraph: true}} />
    <Container className="mainContent" fluid style={{ padding: '0 20px' }}>
      <Row className="w-100 mx-0">
        <ContentHeader title="Project Pipeline" />
      </Row>
      <Row id="pipeline-flowview" className="pt-3" style={{ borderTop: '1px solid #dee2e6' }}>
        <Col md={8}>
          <GraphViewComponent
            graphNodes={pipesGraph.nodes}
            graphEdges={pipesGraph.edges}
            setClickedElementData={setClickedElementedData}
          />
        </Col>
        <Col sm={4} className="border-start text-start ml-4">
          <DataViewComponent data={clickedElementData} />
        </Col>
      </Row>
    </Container>
    </>
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

export default ProjectPipelinePage;
