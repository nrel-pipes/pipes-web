import React, { useEffect, useMemo } from "react";
import ReactFlow, {
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from "reactflow";

import useDataStore from "../../../stores/DataStore";
import useUIStore from "../../../stores/UIStore";
import { createScenarioEdges, createScenarioNodes } from "../../../utilities/RunUtils";
import { ScenarioNode } from "../../Components/graph/DecoratedNode";

export default function ScenarioMappingComponent({ data }) {
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
