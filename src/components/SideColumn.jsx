import React, { useState } from "react";
import { Info } from "lucide-react";

const SideColumn = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const NAV_HEIGHT = "60px";

  return (
    <div
      style={{
        height: `calc(100vh - ${NAV_HEIGHT})`,
        transition: "width 0.3s ease",
        width: "100%",
        display: "flex",
        flexDirection: "row",
        cursor: "pointer",
      }}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Info bar */}
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
          paddingTop: "1rem",
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
          transition: "flex 0.3s ease, opacity 0.3s ease",
          overflowY: "auto",
          flex: isExpanded ? 1 : 0,
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
            Additional Information
          </h2>
          <p style={{ color: "#666" }}>
            This content appears when the side column is expanded.
          </p>
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
