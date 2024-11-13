import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import "./Sidebar.css";

const Sidebar = () => {
  const [overlayVisible, setOverlayVisible] = useState(false);

  // Toggle overlay visibility on click
  const handleSidebarClick = () => {
    setOverlayVisible(!overlayVisible);
  };

  return (
    <>
      {/* Sidebar component */}
      <div className="sidebar" onClick={handleSidebarClick}>
        <FontAwesomeIcon icon={faInfoCircle} color="black" size="lg" />
      </div>

      {/* Overlay box that appears on sidebar click */}
      {overlayVisible && (
        <div className="overlay">
          <div className="overlay-content">
            {/* Content of the overlay goes here */}
            <h2>Additional Information</h2>
            <p>This is the content displayed in the overlay.</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
