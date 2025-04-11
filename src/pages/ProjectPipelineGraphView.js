import React, { useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  useEdgesState,
  useNodesState
} from "reactflow";

import AnnotationNode from "./graph/AnnotationNode";
import ButtonEdge from "./graph/ButtonEdge";
import CircleNode from "./graph/CircleNode";
import ResizerNode from "./graph/ResizerNode";
import TextNode from "./graph/TextNode";
import ToolbarNode from "./graph/ToolbarNode";


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


const ProjectPipelineGraphView = ({graphNodes, graphEdges, setClickedElementData}) => {

  // const renderCount = useRef(0);
  // renderCount.current += 1;

  const [nodes, setNodes, onNodesChange] = useNodesState(graphNodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(graphEdges || []);

  useEffect(() => {
    if (graphNodes) setNodes(graphNodes);
    if (graphEdges) setEdges(graphEdges);
  }, [graphNodes, graphEdges, setNodes, setEdges]);

  const onNodeClick = (event, node) => {
    setClickedElementData(node.data);
  }

  const onEdgeClick = (event, edge) => {
    setClickedElementData(edge.data);
  }

  const nodeClassName = (node) => node.type;
  return (
    <div style={{ width: "100%", height: 900 }}>
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

export default ProjectPipelineGraphView;
