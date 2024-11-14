import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import "./Sidebar.css";

const Sidebar = () => {
  const [overlayVisible, setOverlayVisible] = useState(false);

  const handleSidebarClick = () => {
    setOverlayVisible(!overlayVisible);
  };

  return (
    <>
      <div className="sidebar" onClick={handleSidebarClick}>
        <FontAwesomeIcon icon={faInfoCircle} color="black" size="lg" />
      </div>

      {overlayVisible && (
        <div className="overlay">
          <div className="overlay-content">
            <h2>Additional Information</h2>
            <p>This is the content displayed in the overlay.</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
