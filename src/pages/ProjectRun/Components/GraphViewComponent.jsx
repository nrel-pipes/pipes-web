import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactFlow, {
  ReactFlowProvider,
  useEdgesState,
  useNodesState
} from "reactflow";

import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Col from "react-bootstrap/Col";
import Container from 'react-bootstrap/Container';
import Row from "react-bootstrap/Row";

import { useGetHandoffsQuery } from "../../../hooks/useHandoffQuery";
import { useGetModelsQuery } from "../../../hooks/useModelQuery";
import { useGetModelRunsQuery } from "../../../hooks/useModelRunQuery";
import useAuthStore from "../../../stores/AuthStore";
import useDataStore from "../../../stores/DataStore";
import useUIStore from "../../../stores/UIStore";
import { DecoratedNode } from "../../Components/graph/DecoratedNode";
import { createEdgesOverview, createNodesOverview } from "./RunUtils";


const GraphViewComponent = ({selectedModel, setSelectedModel}) => {
  const navigate = useNavigate();
  const { isLoggedIn, accessToken, validateToken } = useAuthStore();
  const getModelColor = useUIStore(state => state.getModelColor);
  const { effectivePname, effectivePRname } = useDataStore();

  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const [nodes, setNodes, onNodesChange] = useNodesState();
  const [edges, setEdges, onEdgesChange] = useEdgesState();

  const {
    data: models = [],
    isLoading: isLoadingModels
  } = useGetModelsQuery(effectivePname, effectivePRname);

  const {
    data: modelRuns = [],
    isLoading: isLoadingModelRuns
  } = useGetModelRunsQuery(effectivePname, effectivePRname, null);

  const {
    data: handoffs = [],
    isLoading: isLoadingHandoffs
  } = useGetHandoffsQuery(effectivePname, effectivePRname);

  const [lastCheckIns, setLastCheckIns] = useState({});

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

    if (!isLoadingModels && !isLoadingModelRuns && !isLoadingHandoffs) {
      let prModels = [];
      models.forEach((model) => {
        const color = getModelColor(model.name);
        model.other = model.other || {};
        model.other.color = color;
        if (model.context && model.context.projectrun === effectivePRname) {
          prModels.push(model);
        }
      });

      const dcNodes = createNodesOverview(
        prModels,
        modelRuns,
        lastCheckIns,
        handoffs
      );
      setNodes(dcNodes);

      const dcEdges = createEdgesOverview(handoffs);
      setEdges(dcEdges);
    }
  }, [
    isLoggedIn,
    accessToken,
    navigate,
    validateToken,
    effectivePRname,
    models,
    modelRuns,
    handoffs,
    isLoadingModels,
    isLoadingModelRuns,
    isLoadingHandoffs,
    getModelColor,
    setNodes,
    setEdges,
    lastCheckIns
  ]);

  if (isLoadingModels || isLoadingModelRuns || isLoadingHandoffs) {
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
    <div style={{ width: "100%", height: `${viewportHeight - 210}px` }}>
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

export default GraphViewComponent;
