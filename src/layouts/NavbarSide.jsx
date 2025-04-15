import React, { useEffect, useState } from 'react';
import {
  FaAngleDoubleLeft,
  FaBars,
  FaCalendarAlt,
  FaFlag,
  FaKey,
  FaLayerGroup,
  FaLock,
  FaProjectDiagram,
  FaSignOutAlt,
  FaTachometerAlt,
  FaUser
} from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import useDataStore from '../stores/DataStore';
import './styles/NavbarSide.css';

const Sidebar = () => {
  const [expanded, setExpanded] = useState(true);
  const location = useLocation();
  const { effectivePname } = useDataStore();

  // Check if a project is selected
  const projectSelected = !!effectivePname;

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  // Force consistent sidebar width when route changes
  useEffect(() => {
    // This ensures the sidebar maintains its width when navigating
    if (expanded) {
      document.querySelector('.sidebar').style.width = '200px';
    } else {
      document.querySelector('.sidebar').style.width = '60px';
    }
  }, [location.pathname, expanded]);

  // Updated isActive function to handle path matching more precisely
  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  // Function to determine if a link should be disabled
  const getNavItemClass = (path) => {
    // Check if this is a project-specific page that should be disabled
    const shouldDisable = ['/project', '/pipeline', '/schedule'].includes(path) && !projectSelected;
    return `${isActive(path)} ${shouldDisable ? 'disabled' : ''}`;
  };

  // Function to handle click on disabled links
  const handleNavClick = (e, path) => {
    if (['/project', '/pipeline', '/schedule'].includes(path) && !projectSelected) {
      e.preventDefault();
    }
  };

  return (
    // Add a unique class for each route to help debug
    <div className={`sidebar ${expanded ? 'expanded' : 'collapsed'} route-${location.pathname.replace(/\//g, '-')}`}>
      <div className="sidebar-toggle" onClick={toggleSidebar}>
        {expanded ? <FaAngleDoubleLeft /> : <FaBars />}
      </div>

      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link to="/projects" className={isActive("/projects")} title="Projects">
              <span className="icon"><FaLayerGroup /></span>
              {expanded && <span className="nav-text">Projects</span>}
            </Link>
          </li>

          <li>
            <Link to="/milestones" className={isActive("/milestones")} title="Milestones">
              <span className="icon"><FaFlag /></span>
              {expanded && <span className="nav-text">Milestones</span>}
            </Link>
          </li>

          <li className="separator"></li>

          <li>
            <Link
              to="/project"
              className={getNavItemClass("/project")}
              title={projectSelected ? "Dashboard" : "Select a project first"}
              onClick={(e) => handleNavClick(e, "/project")}
            >
              <span className="icon"><FaTachometerAlt /></span>
              {expanded && <span className="nav-text">Dashboard</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/pipeline"
              className={getNavItemClass("/pipeline")}
              title={projectSelected ? "Pipeline" : "Select a project first"}
              onClick={(e) => handleNavClick(e, "/pipeline")}
            >
              <span className="icon"><FaProjectDiagram /></span>
              {expanded && <span className="nav-text">Pipeline</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/schedule"
              className={getNavItemClass("/schedule")}
              title={projectSelected ? "Schedule" : "Select a project first"}
              onClick={(e) => handleNavClick(e, "/schedule")}
            >
              <span className="icon"><FaCalendarAlt /></span>
              {expanded && <span className="nav-text">Schedule</span>}
            </Link>
          </li>

          <li className="separator"></li>

          <li>
            <Link to="/profile" className={isActive("/profile")} title="Profile">
              <span className="icon"><FaUser /></span>
              {expanded && <span className="nav-text">Profile</span>}
            </Link>
          </li>
          <li>
            <Link to="/tokens" className={isActive("/tokens")} title="Tokens">
              <span className="icon"><FaKey /></span>
              {expanded && <span className="nav-text">Tokens</span>}
            </Link>
          </li>
          <li>
            <Link to="/change-password" className={isActive("/change-password")} title="Password">
              <span className="icon"><FaLock /></span>
              {expanded && <span className="nav-text">Password</span>}
            </Link>
          </li>

          <li className="separator"></li>

          <li>
            <Link to="/logout" className={isActive("/logout")} title="Logout">
              <span className="icon"><FaSignOutAlt /></span>
              {expanded && <span className="nav-text">Logout</span>}
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
