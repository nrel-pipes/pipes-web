import React, { useState } from "react";
import { Info } from "lucide-react";

const SideColumn = ({ isExpanded, onToggle, definitions }) => {
  const NAV_HEIGHT = "60px";
  const [isHighlighted, setIsHighlighted] = useState(false);

  const handlePanelClick = () => {
    setIsHighlighted(true);
  };

  return (
    <div
      style={{
        height: `calc(100vh - ${NAV_HEIGHT})`,
        transition: "width 0.3s ease",
        width: "100%",
        display: "flex",
        flexDirection: "row",
      }}
    >
      {/* Info bar - only this will toggle the expanded state */}
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
          cursor: "pointer",
        }}
        className="info-bar"
        onClick={onToggle}
      >
        <Info size={24} className="text-gray-600" />
      </div>

      {/* Expanded content */}
      <div
        onClick={handlePanelClick} // Highlight panel on click
        style={{
          height: "100%",
          backgroundColor: "white", // Always white background
          boxShadow: isExpanded ? "4px 0 6px rgba(0,0,0,0.1)" : "none",
          transition: "flex 0.3s ease, opacity 0.3s ease",
          overflowY: "auto",
          flex: isExpanded ? 1 : 0,
          opacity: isExpanded ? 1 : 0,
          visibility: isExpanded ? "visible" : "hidden",
          padding: "1.5rem",
          cursor: "default",
        }}
      >
        {/* Center-aligned title */}
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

        {/* Render definitions */}
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
