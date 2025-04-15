import React, { useEffect, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  useEdgesState,
  useNodesState
} from "reactflow";

import AnnotationNode from "../../Components/graph/AnnotationNode";
import ButtonEdge from "../../Components/graph/ButtonEdge";
import CircleNode from "../../Components/graph/CircleNode";
import ResizerNode from "../../Components/graph/ResizerNode";
import TextNode from "../../Components/graph/TextNode";
import ToolbarNode from "../../Components/graph/ToolbarNode";

const nodeTypes = {
  annotation: AnnotationNode,
  tools: ToolbarNode,
  resizer: ResizerNode,
  circle: CircleNode,
  textinput: TextNode,
};

const edgeTypes = {
  button: ButtonEdge,
};

const GraphViewComponent = ({graphNodes, graphEdges, setClickedElementData}) => {
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

  const [nodes, setNodes, onNodesChange] = useNodesState(graphNodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(graphEdges || []);

  useEffect(() => {
    if (graphNodes) setNodes(graphNodes);
    if (graphEdges) setEdges(graphEdges);
  }, [graphNodes, graphEdges, setNodes, setEdges]);

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

  const onNodeClick = (event, node) => {
    setClickedElementData(node.data);
  };

  const onEdgeClick = (event, edge) => {
    setClickedElementData(edge.data);
  };

  const nodeClassName = (node) => node.type;
  return (
    <div
      style={{
        width: "100%",
        height: `${viewportHeight - 205}px`,
      }}
    >
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          attributionPosition="top-right"
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          className="pipeline-flowview"
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          fitView
        >
          <MiniMap zoomable pannable nodeClassName={nodeClassName} />
          <Controls />
          <Background />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );

}

export default GraphViewComponent;
