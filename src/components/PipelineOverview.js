import React, { useEffect, useRef, useMemo } from "react";
import ReactFlow, {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
} from "react-flow-renderer";

import { DecoratedNode } from "./GraphProps";
import { createNodesOverview, createEdgesOverview } from "./PipelineUtils";
import { useModelStore } from "../components/store/ModelStore";

import * as d3 from "d3";
import Tooltip from "./Tooltip";
import { useUIStore } from "./store/store";
import { width } from "@fortawesome/free-regular-svg-icons/faAddressBook";

import getUrl from "./store/OriginUrl";


export default function PipelineOverview({ projectName, data, selected, setSelected }) {
  //
  // References
  //
  const tooltipDiv = useRef(null);
  const tooltip = useRef(null);

  //
  // State
  //
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const models = useModelStore((state) => state.models);
  const modelRuns = useModelStore((state) => state.runs);
  const lastCheckIns = useModelStore((state) => state.lastCheckIn);

  const scenarioColors = useUIStore((state) => state.scenarios);

  const nodeTypes = useMemo(() => {
    return {
      custom: DecoratedNode,
    };
  }, []);
  //
  // Effects
  //
  useEffect(() => {
    const div = d3.select(tooltipDiv.current);
    tooltip.current = new Tooltip(div);

    const fetchHandoffs = async () => {
      const projectRunContext = new URLSearchParams({
        project: projectName,
        projectrun: data.name,
      })
      const hUrl = getUrl(`api/handoffs?${projectRunContext}`);
      const response = await fetch(hUrl,{
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization:
            `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      const edges = await response.json();

      const nds = createNodesOverview(
        models,
        modelRuns,
        lastCheckIns,
        edges
      );
      setNodes(nds);
      setEdges(createEdgesOverview(edges));
    }

    fetchHandoffs().catch(console.error);
  }, [
    projectName,
    data,
    models,
    lastCheckIns,
    modelRuns,
    scenarioColors,
    setNodes,
    setEdges,
  ]);

  //
  // Handler functions
  //
  function nodeTooltipContents(node) {
    return node.id;
  }

  function edgeTooltipContents(edge) {
    let description = ``;
    for (let i = 0; i < edge.data.length; i++) {
      if (i !== 0) {
        description += `<br><div class="edge-descriptor"><b>${
          edge.data[i].id + "</b> - " + edge.data[i].description
        }</div>`;
      } else {
        description += `<div class="edge-descriptor"><b>${
          edge.data[i].id + "</b> - " + edge.data[i].description
        }</div>`;
      }
    }
    return `<h2>${edge.source + " \u2B95 " + edge.target}</h2>
    <p>${description}</p>`;
  }

  function onNodeMouseEnter(event, node) {
    tooltip.current.display(node, nodeTooltipContents);
  }

  function onEdgeMouseEnter(event, edge) {
    tooltip.current.display(edge, edgeTooltipContents);
  }

  function onMouseMove(event, node) {
    tooltip.current.move(event);
  }

  function onMouseLeave(event, node) {
    tooltip.current.hide();
  }

  const onSelect = (s) => {
    if (selected) {
      selected.style.boxShadow = null;
    }
    if (s.nodes[0] && s.nodes[0].type === "custom") {
      s.nodes[0].style.boxShadow = "0px 0px 2px 3px rgba(255, 255, 255, 0.5)";

      setSelected(s.nodes[0]);
    } else {
      setSelected(null);
    }
  };

  //
  // Render
  //
  return (
    <div
      className="pipeline-overview"
      style={{ overflow: "auto", resize: "both"}}
    >
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodesConnectable={false}
          fitView={{ padding: 10.0 }}
          onInit={null}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          elementsSelectable={true}
          onSelectionChange={onSelect}
          attributionPosition="bottom-right"
          elevateEdgesOnSelect={true}
          nodeTypes={nodeTypes}
          onNodeMouseEnter={onNodeMouseEnter}
          onNodeMouseMove={onMouseMove}
          onNodeMouseLeave={onMouseLeave}
          onEdgeMouseMove={onMouseMove}
          onEdgeMouseLeave={onMouseLeave}
          onEdgeMouseEnter={onEdgeMouseEnter}
        />
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
