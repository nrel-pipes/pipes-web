import React from "react";
import { Info } from "lucide-react";

const SideColumn = ({ isExpanded, onToggle }) => {
  // Adjust spacing to match form exactly
  const NAV_HEIGHT = "60px";
  const MARGIN_TOP = "5px"; // Reduced from 20px to match form spacing

  return (
    <div
      style={{
        position: "fixed",
        top: `calc(${NAV_HEIGHT} + ${MARGIN_TOP})`,
        left: 0,
        height: `calc(100vh - ${NAV_HEIGHT} - ${MARGIN_TOP})`,
        width: isExpanded ? "calc(30vw + 40px)" : "40px",
        display: "flex",
        flexDirection: "row",
        backgroundColor: "white",
        transition: "width 0.3s ease",
        zIndex: 100,
      }}
    >
      {/* Info bar */}
      <div
        onClick={onToggle}
        style={{
          width: "40px",
          height: "100%",
          borderRight: "1px solid #dee2e6",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          backgroundColor: "white",
          cursor: "pointer",
          flexShrink: 0,
          paddingTop: "1rem",
          transition: "background-color 0.2s ease",
        }}
        className="info-bar"
      >
        <Info size={24} className="text-gray-600" />
      </div>

      {/* Expanded content */}
      <div
        style={{
          height: "100%",
          backgroundColor: "white",
          boxShadow: isExpanded ? "4px 0 6px rgba(0,0,0,0.1)" : "none",
          transition: "all 0.3s ease",
          overflowY: "auto",
          width: isExpanded ? "calc(100% - 40px)" : 0,
          opacity: isExpanded ? 1 : 0,
          visibility: isExpanded ? "visible" : "hidden",
        }}
      >
        <div style={{ padding: "1.5rem" }}>
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: 600,
              marginBottom: "1rem",
            }}
          >
            Project Creation Documentation
          </h2>
          <p style={{ color: "#666" }}>
            This content appears when the side column is expanded.
          </p>
        </div>
      </div>

      <style jsx>{`
        .info-bar:hover {
          background-color: #f8f9fa !important;
        }
      `}</style>
    </div>
  );
};

export default SideColumn;
