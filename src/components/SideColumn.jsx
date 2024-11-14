import React from "react";
import { Info } from "lucide-react";

const SideColumn = ({ isExpanded, onToggle, definitions }) => {
  const NAV_HEIGHT = "56px";

  return (
    <div
      style={{
        position: "fixed",
        top: NAV_HEIGHT,
        left: 0,
        bottom: 0,
        width: isExpanded ? "calc(30vw + 40px)" : "40px",
        display: "flex",
        flexDirection: "row",
        backgroundColor: "white",
        zIndex: 1020,
        borderRight: "1px solid #dee2e6",
        transition: "width 0.3s ease",
      }}
    >
      <div
        style={{
          width: "40px",
          height: "100%",
          borderRight: "1px solid #dee2e6",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          backgroundColor: "white",
          flexShrink: 0,
          paddingTop: "calc(1rem + 5px)",
          cursor: "pointer",
        }}
        className="info-bar"
        onClick={onToggle}
      >
        <Info size={24} className="text-gray-600" />
      </div>

      <div
        style={{
          height: "100%",
          backgroundColor: "white",
          boxShadow: isExpanded ? "4px 0 6px rgba(0,0,0,0.1)" : "none",
          transition: "all 0.3s ease",
          overflowY: "auto",
          width: isExpanded ? "calc(30vw)" : "0",
          opacity: isExpanded ? 1 : 0,
          visibility: isExpanded ? "visible" : "hidden",
          padding: isExpanded ? "1.5rem" : "0",
          cursor: "default",
        }}
      >
        <h2
          style={{
            fontSize: "1.25rem",
            fontWeight: 600,
            marginBottom: "1rem",
            textAlign: "center",
            color: "black",
          }}
        >
          Project Create Documentation
        </h2>

        <div style={{ textAlign: "left" }}>
          {definitions.map((item, index) => (
            <div key={index} style={{ marginBottom: "1rem" }}>
              <p
                style={{
                  fontWeight: "bold",
                  color: "black",
                  marginBottom: "0.2rem",
                }}
              >
                {item.name}
              </p>
              <p style={{ color: "gray", margin: 0 }}>{item.definition}</p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .info-bar:hover {
          background-color: #f8f9fa;
        }
      `}</style>
    </div>
  );
};

export default SideColumn;
