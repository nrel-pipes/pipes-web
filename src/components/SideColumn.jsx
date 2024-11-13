import React, { useState } from "react";
import { Info } from "lucide-react";
import { Col } from "react-bootstrap";

const SideColumn = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const NAV_HEIGHT = "60px";

  return (
    <Col
      xs={isExpanded ? 4 : "auto"}
      style={{
        position: "fixed",
        left: 0,
        top: NAV_HEIGHT,
        height: `calc(100vh - ${NAV_HEIGHT})`,
        transition: "all 0.3s ease",
        padding: 0,
        zIndex: 1000,
        width: isExpanded ? "calc(30vw + 40px)" : "40px",
        backgroundColor: "white",
        display: "flex",
        flexDirection: "row",
      }}
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
          cursor: "pointer",
          transition: "background-color 0.2s ease",
          backgroundColor: "white",
          flexShrink: 0,
          paddingTop: "1rem",
        }}
        className="info-bar"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Info size={24} className="text-gray-600" />
      </div>

      {/* Expanded content */}
      <div
        style={{
          height: "100%",
          backgroundColor: "white",
          boxShadow: "4px 0 6px rgba(0,0,0,0.1)",
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
    </Col>
  );
};

export default SideColumn;
