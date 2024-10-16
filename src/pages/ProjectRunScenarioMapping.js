import React, { useEffect, useMemo } from "react";
import ReactFlow, {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
} from "reactflow";

import { ScenarioNode } from "./graph/DecoratedNode";
import { createScenarioNodes, createScenarioEdges } from "./utilities/RunUtils";
import useUIStore  from "./stores/UIStore";
import useDataStore from "./stores/DataStore";

export default function ScenarioMapping({ data }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const scenarios = useDataStore((state) => state.currentProject.scenarios);
  const scenarioColors = useUIStore((state) => state.colors);

  const nodeTypes = useMemo(
    () => ({
      scenario: ScenarioNode,
    }),
    [],
  );

  useEffect(() => {
    setNodes(createScenarioNodes(data, scenarios, scenarioColors));
    setEdges(createScenarioEdges(data));
  }, [data, scenarios, setNodes, setEdges, scenarioColors]);

  return (
    <div className="scenario-mapping" style={{ height: 500 }}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          elementsSelectable={false}
          nodesConnectable={true}
          attributionPosition="bottom-right"
          elevateEdgesOnSelect={true}
          nodeTypes={nodeTypes}
          fitView
        >
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}
