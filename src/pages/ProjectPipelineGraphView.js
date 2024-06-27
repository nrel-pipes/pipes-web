import React from "react";
import ReactFlow, {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap
} from "reactflow";

import AnnotationNode from "./graph/AnnotationNode";
import CircleNode from "./graph/CircleNode";
import ToolbarNode from "./graph/ToolbarNode";
import ResizerNode from "./graph/ResizerNode";
import TextNode from "./graph/TextNode";
import ButtonEdge from "./graph/ButtonEdge";


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


const ProjectPipelineGraphView = ({layoutedNodes, layoutedEdges, setClickedElementData}) => {
  const [nodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, onEdgesChange] = useEdgesState(layoutedEdges);

  if (nodes.length === 6) {
    return
  }

  function onNodeClick(event, node) {
    setClickedElementData(node.data);
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
          fitView
          attributionPosition="top-right"
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          className="pipeline-flowview"
          onNodeClick={onNodeClick}
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
