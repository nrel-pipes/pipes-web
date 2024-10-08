import React, { useEffect } from "react";
import ReactFlow, {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
} from "reactflow";

import { ScenarioNode } from "./graph/DecoratedNode";
import { createScenarioNodes, createScenarioEdges } from "./utilities/RunUtils";
import useUIStore  from "./stores/UIStore";
import useDataStore from "./stores/DataStore";

const nodeTypes = {
  scenario: ScenarioNode,
};

export default function ScenarioMapping({ data }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const scenarios = useDataStore((state) => state.currentProject.scenarios);
  const scenarioColors = useUIStore((state) => state.scenarios);

  useEffect(() => {
    setNodes(createScenarioNodes(data, scenarios, scenarioColors));
    setEdges(createScenarioEdges(data));
  }, [data, scenarios, setNodes, setEdges, scenarioColors]);

  return (
    <div className="scenario-mapping" style={{ minHeight: 500 }}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodesConnectable={true}
          fitView
          onInit={null}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          elementsSelectable={false}
          attributionPosition="bottom-right"
          elevateEdgesOnSelect={true}
          nodeTypes={nodeTypes}
        />
      </ReactFlowProvider>
    </div>
  );
}
