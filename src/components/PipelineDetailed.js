import React, { useEffect, useRef, useState } from "react";
import ReactFlow, {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
} from "react-flow-renderer";
import { Switch } from "@mui/material";
import * as d3 from "d3";
import Tooltip from "./Tooltip";
export function PipelineDetailed({
  initialNodes,
  initialEdges,
  updateHoveredData,
}) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [clickedNode, setClickedNode] = useState("");
  const tooltipDiv = useRef(null);
  const tooltip = useRef(null);
  useEffect(() => {
    const div = d3.select(tooltipDiv.current);
    tooltip.current = new Tooltip(div);
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  //   function switchAnimateEdges(val) {
  //     setAnimateEdges(val);
  //     const newEdges = edges.map((e) => {
  //       console.log(
  //         Object.fromEntries([...Object.entries(e), ["animated", val]])
  //       );
  //       return Object.fromEntries([...Object.entries(e), ["animated", val]]);
  //     });

  //     setEdges(newEdges);
  //   }

  function onNodeClick(node) {
    let shouldReset = false;
    if (node.id === clickedNode) {
      shouldReset = true;
      setClickedNode("");
    } else {
      setClickedNode(node.id);
    }
    const newEdges = edges.map((e) => {
      if (e.source === node.id || e.target === node.id) {
        return Object.fromEntries([
          ...Object.entries(e),
          ["animated", shouldReset ? false : true],
          ["zIndex", shouldReset ? 0 : 100],
        ]);
      } else {
        return Object.fromEntries([
          ...Object.entries(e),
          ["animated", false],
          ["zIndex", 0],
        ]);
      }
    });
    setEdges(newEdges);
  }
  function onNodeMouseEnter(event, node) {
    updateHoveredData(node.data.metadata);
  }

  //   function onNodeMouseLeave(event) {
  //     updateHoveredData({});
  //   }
  //   function nodeTooltipContents(node) {
  //     return JSON.stringify(node.data.metadata, null, " ");
  //   }
  function onMouseMove(event, node) {
    tooltip.current.move(event);
  }

  function onMouseLeave(event, node) {
    // updateHoveredData({});
    tooltip.current.hide();
  }
  return (
    <div style={{ width: 900, height: 900 }}>
      {/* <Switch
        checked={animateEdges}
        onChange={() => switchAnimateEdges(!animateEdges)}
        inputProps={{ "aria-label": "controlled" }}
      />
      Animate Edges */}
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={(e, n) => onNodeClick(n)}
          onNodeMouseEnter={onNodeMouseEnter}
          onNodeMouseLeave={onMouseLeave}
          onNodeMouseMove={onMouseMove}
          nodesConnectable={false}
        >
          {/* <MiniMap /> */}
          <Controls />
          <Background />
        </ReactFlow>
      </ReactFlowProvider>
      <div
        id="pipelinetooltip"
        ref={tooltipDiv}
        style={{
          zIndex: "20",
        }}
      ></div>
    </div>
  );
}
