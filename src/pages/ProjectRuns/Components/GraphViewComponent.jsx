import { useCallback, useEffect, useMemo, useState } from "react";
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
import useUIStore from "../../../stores/UIStore";
import { DecoratedNode } from "../../Components/graph/DecoratedNode";
import { createEdgesOverview, createNodesOverview } from "./RunUtils";


const GraphViewComponent = ({projectName, projectRunName, selectedModel, setSelectedModel}) => {
  const getModelColor = useUIStore(state => state.getModelColor);

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

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const {
    data: models = [],
    isLoading: isLoadingModels
  } = useGetModelsQuery(projectName, projectRunName);

  const {
    data: modelRuns = [],
    isLoading: isLoadingModelRuns
  } = useGetModelRunsQuery(projectName, projectRunName, null);

  const {
    data: handoffs = [],
    isLoading: isLoadingHandoffs
  } = useGetHandoffsQuery(projectName, projectRunName);

  const [lastCheckIns, setLastCheckIns] = useState({});

  // Fixed onSelect handler to properly handle selection state
  const onSelect = useCallback((selection) => {
    // Clear previous selection if it exists
    if (selectedModel && selectedModel.style) {
      // Create a copy of the current nodes and remove highlighting
      const updatedNodes = nodes.map(node => {
        if (node.id === selectedModel.id) {
          return {
            ...node,
            style: { ...node.style, boxShadow: null }
          };
        }
        return node;
      });
      setNodes(updatedNodes);
    }

    // Apply new selection if a node is selected
    if (selection.nodes.length > 0 && selection.nodes[0].type === "custom") {
      const selectedNode = selection.nodes[0];

      // Update the nodes array with the new selection
      const updatedNodes = nodes.map(node => {
        if (node.id === selectedNode.id) {
          return {
            ...node,
            style: {
              ...(node.style || {}),
              boxShadow: "0px 0px 2px 3px rgba(255, 255, 255, 0.5)"
            }
          };
        }
        return node;
      });

      setNodes(updatedNodes);
      setSelectedModel(selectedNode);
    } else {
      setSelectedModel(null);
    }
  }, [selectedModel, nodes, setNodes, setSelectedModel]);

  const nodeTypes = useMemo(() => {
    return {
      custom: DecoratedNode,
    };
  }, []);

  useEffect(() => {
    if (!isLoadingModels && !isLoadingModelRuns && !isLoadingHandoffs) {
      let prModels = [];
      models.forEach((model) => {
        const color = getModelColor(model.name);
        model.other = model.other || {};
        model.other.color = color;
        if (model.context && model.context.projectrun === projectRunName) {
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
    projectRunName,
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
        >
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}

export default GraphViewComponent;
