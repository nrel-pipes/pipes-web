import React, { useEffect, useMemo } from "react";
import ReactFlow, {
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from "reactflow";

import { useGetProjectQuery } from "../../../hooks/useProjectQuery";
import useDataStore from "../../../stores/DataStore";
import useUIStore from "../../../stores/UIStore";
import { ScenarioNode } from "../../Components/graph/DecoratedNode";
import { createScenarioEdges, createScenarioNodes } from "./RunUtils";

export default function ScenarioMappingComponent({ data }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const { effectivePname } = useDataStore();
  const { data: project } = useGetProjectQuery(effectivePname);
  const scenarios = project?.scenarios || [];

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
