import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ReactFlow, {
  ReactFlowProvider,
  useNodesState,
  useEdgesState
} from "reactflow";

import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Col from "react-bootstrap/Col";
import Container from 'react-bootstrap/Container';
import Row from "react-bootstrap/Row";

import { DecoratedNode } from "./graph/DecoratedNode";
import { createNodesOverview, createEdgesOverview } from "./utilities/RunUtils";
import useAuthStore from "./stores/AuthStore";
import useDataStore from "./stores/DataStore";
import useUIStore  from "./stores/UIStore";


const ProjectRunGraphView = ({selectedModel, setSelectedModel}) => {
  const navigate = useNavigate();
  const { isLoggedIn, accessToken, validateToken } = useAuthStore();
  const getColor = useUIStore(state => state.getColor);

  // const renderCount = useRef(0);
  // renderCount.current += 1;

  const [nodes, setNodes, onNodesChange] = useNodesState();
  const [edges, setEdges, onEdgesChange] = useEdgesState();

  const {
    currentProject,
    currentProjectRunName,
    models,
    getModels,
    isGettingModels,
    lastCheckIns,
    modelRuns,
    getModelRuns,
    isGettingModelRuns,
    handoffs,
    getHandoffs,
  } = useDataStore();

  function onSelect(s) {
    if (selectedModel) {
      selectedModel.style.boxShadow = null;
    }

    if (s.nodes[0] && s.nodes[0].type === "custom") {
      s.nodes[0].style.boxShadow = "0px 0px 2px 3px rgba(255, 255, 255, 0.5)";

      setSelectedModel(s.nodes[0]);
    } else {
      setSelectedModel(null);
    }
  }

  const nodeTypes = useMemo(() => {
    return {
      custom: DecoratedNode,
    };
  }, []);

  useEffect(() => {
    validateToken(accessToken);
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    if (!handoffs || handoffs === null || handoffs.length === 0) {
      getHandoffs(currentProject.name, null, accessToken);
    }

    if (!models || models === null || models.length === 0) {
      getModels(currentProject.name, null, accessToken);
    }

    if (!modelRuns || modelRuns === null || modelRuns.length === 0) {
      getModelRuns(currentProject.name, null, null, accessToken);
    }

    let prModels = [];
    models.forEach((model) => {
      const color = getColor(model.name);
      model.other.color = color;
      if (model.context.projectrun === currentProjectRunName ) {
        prModels.push(model);
      }
    });

    // Set nodes
    const dcNodes = createNodesOverview(
      prModels,
      modelRuns,
      lastCheckIns,
      handoffs
    );
    setNodes(dcNodes);

    // Set edges
    const dcEdges = createEdgesOverview(handoffs);
    setEdges(dcEdges);

  }, [
    isLoggedIn,
    accessToken,
    navigate,
    validateToken,
    // currentProject,
    // models,
    // getModels,
    // modelRuns,
    // getModelRuns,
    // lastCheckIns,
    // handoffs,
    // setNodes,
    // setEdges,
  ]);

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

  return (
    <div style={{ width: "100%", height: 900 }}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          elementsSelectable={true}
          attributionPosition="bottom-right"
          nodeTypes={nodeTypes}
          className="projectrun-flowview"
          onSelectionChange={onSelect}
          elevateEdgesOnSelect={true}
          fitView={{ padding: 10.0}}
          nodesConnectable={false}
          onInit={null}
        >
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );

}

export default ProjectRunGraphView;
