import React from "react";
import { Position, Handle, useUpdateNodeInternals } from "reactflow";
import * as d3 from "d3";

export const nodeColors = d3
  .scaleOrdinal()
  .domain([
    "Capacity Expansion",
    "Building Loads",
    "Mobility Loads",
    "Production Cost",
    "Demand Response",
    "dsgrid",
    "Distributed Generation",
    "Renewable Resource Potential",
    "Production Cost Model",
    "Resource Adequacy",
    "Electricity Generation",
    "Loads",
  ])
  .range([
    "#263f23",
    "#0866b3",
    "#1876c3",
    "#084343",
    "#1a2f52",
    "#1a2f52",
    "#76843C",
    "#A128BF",
    "#084343",
    "#C25534",
    "#BD9F4B",
    "#BD9F4B",
  ]);

const inputHandleWrapper = {
  display: "flex",
  position: "absolute",
  height: "100%",
  left: 0,
  flexDirection: "column",
  top: 0,
  justifyContent: "space-evenly",
};

const outputHandleWrapper = {
  display: "flex",
  position: "absolute",
  height: "100%",
  right: 0,
  flexDirection: "column",
  top: 0,
  justifyContent: "space-evenly",
};

const handleStyle = {
  width: "2px",
  height: "2px",
  backgroundColor: "gray",
  position: "relative",
  transform: "none",
  top: "auto",
};

export function DecoratedNode({ data, isConnectable }) {
  const updateNodeInternals = useUpdateNodeInternals();

  updateNodeInternals(data.label);

  return (
    <div>
      <div
        style={{
          width: 135,
          textAlign: "center",
          maxHeight: 50,
          bottom: 20,
          fontSize: 10,
        }}
      >
        <b>{data.type}</b>
      </div>
      <div
        style={{
          height: "100%",
          width: "100%",
          marginTop: 0,
          marginBottom: "5px",
          flex: "3",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          backgroundColor: data.color,
          gap: "0px",
          alignItems: "center",
          borderRadius: 2,
          borderColor: "#000000",
          borderWidth: 1,
          borderStyle: "solid",
          boxShadow: "3px 3px 6px 0px rgba(0, 0, 0, 0.5)",
        }}
      >
        <div style={inputHandleWrapper}>
          {data.inputs.map((handleId) => (
            <div key={handleId}>
              <Handle
                type="target"
                position="left"
                id={handleId}
                isConnectable={isConnectable}
                style={handleStyle}
              />
            </div>
          ))}
        </div>
        <div style={{ fontSize: 9, color: 'white' }}>{data.label}</div>
        <ProgressIndicators data={data} />

        <div style={outputHandleWrapper}>
          {data.outputs.map((handleId) => (
            <div key={handleId}>
              <Handle
                type="source"
                position={Position.Right}
                id={handleId}
                isConnectable={isConnectable}
                style={handleStyle}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
function ProgressIndicators({ data }) {
  return (
    <>
      <div style={{ display: "flex", textAlign: "center" }}>
        <Progress
          percentage={data.percentages.datasets}
          color="#e4f3f4"
          label="Datasets"
        />
        <Progress
          percentage={data.percentages.tasks}
          color="#e4f3f4"
          label="Tasks"
        />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <div style={{ fontSize: "8px", paddingLeft: 5 }} title="Target">
          {data.last_checkin}
        </div>
        <div
          style={{ fontSize: "8px", paddingRight: 5, color: "white" }}
          title="Percent complete"
        >
          <i
            className="fa fa-check-circle"
            style={{ color: "#CCCCCC", paddingRight: 3 }}
          ></i>
          {data.checkins}
        </div>
      </div>
    </>
  );
}
function Progress({ percentage, color, label }) {
  const value = isNaN(percentage) ? 0 : percentage * 100;

  return (
    <div style={{ fontSize: 10, color: "white" }}>
      {label}
      <svg width={60} height={60} viewBox="0 0 40 40">
        <circle
          cx="20"
          cy="20"
          r="15"
          fill="transparent"
          stroke="#888888"
          strokeWidth={1}
        />
        <circle
          cx="20"
          cy="20"
          r="15"
          fill="transparent"
          stroke="#fff"
          strokeWidth={4.75}
          strokeDasharray={[100 + 0.5, 100 - 100 - 1]}
          strokeDashoffset={124.5}
        />
        <circle
          cx="20"
          cy="20"
          r="15"
          fill="transparent"
          strokeWidth={4}
          stroke={color}
          strokeDasharray={[value, 100 - value]}
          strokeDashoffset={30}
        />
        <text x="20" y="23" textAnchor="middle" className="complete" fill="white">
          {Math.round(value)}%
        </text>
      </svg>
    </div>
  );
}
export function ScenarioNode({ data, isConnectable }) {
  const updateNodeInternals = useUpdateNodeInternals();
  updateNodeInternals(data.label);
  return (
    <div
      style={{
        height: "100%",
        width: "320px",
        marginTop: 0,
        marginBottom: "0px",
        flex: "3",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        border: "1px solid #FFF",
        padding: "0px",
        gap: "0px",
        alignItems: "center",
      }}
    >
      <div style={inputHandleWrapper}>
        <Handle
          type="target"
          position={Position.Right}
          id={data.scope + data.label + "_in"}
          isConnectable={isConnectable}
          style={handleStyle}
        />{" "}
      </div>
      <div style={{ color: "black" }}>
        <b>{data.label}</b>
      </div>
      <div style={outputHandleWrapper}>
        <Handle
          type="source"
          position={Position.Left}
          id={data.scope + data.label + "_out"}
          isConnectable={isConnectable}
          style={handleStyle}
        />
      </div>
    </div>
  );
}
