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
  FaUser,
  FaUsers
} from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import useAuthStore from '../stores/AuthStore';
import useDataStore from '../stores/DataStore';
import './styles/NavbarSide.css';

const Sidebar = () => {
  const [expanded, setExpanded] = useState(true);
  const location = useLocation();
  const { effectivePname } = useDataStore();
  const { currentUser } = useAuthStore();

  // Check if the user is an admin
  const isAdmin = currentUser?.is_superuser === true;

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
    const shouldDisable = ['/project/dashboard', '/project/pipeline', '/project/schedule'].includes(path) && !projectSelected;
    return `${isActive(path)} ${shouldDisable ? 'disabled' : ''}`;
  };

  // Function to handle click on disabled links
  const handleNavClick = (e, path) => {
    if (['/project/dashboard', '/project/pipeline', '/project/schedule'].includes(path) && !projectSelected) {
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
              to="/project/dashboard"
              className={getNavItemClass("/project/dashboard")}
              title={projectSelected ? "Dashboard" : "Select a project first"}
              onClick={(e) => handleNavClick(e, "/project/dashboard")}
            >
              <span className="icon"><FaTachometerAlt /></span>
              {expanded && <span className="nav-text">Dashboard</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/project/pipeline"
              className={getNavItemClass("/project/pipeline")}
              title={projectSelected ? "Pipeline" : "Select a project first"}
              onClick={(e) => handleNavClick(e, "/project/pipeline")}
            >
              <span className="icon"><FaProjectDiagram /></span>
              {expanded && <span className="nav-text">Pipeline</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/project/schedule"
              className={getNavItemClass("/project/schedule")}
              title={projectSelected ? "Schedule" : "Select a project first"}
              onClick={(e) => handleNavClick(e, "/project/schedule")}
            >
              <span className="icon"><FaCalendarAlt /></span>
              {expanded && <span className="nav-text">Schedule</span>}
            </Link>
          </li>

          <li className="separator"></li>

          {/* Only show Users link if user is an admin */}
          {isAdmin && (
            <li>
              <Link to="/users" className={`${isActive("/users")} admin-menu-item`} title="Users">
                <span className="icon"><FaUsers /></span>
                {expanded && <span className="nav-text">Users</span>}
              </Link>
            </li>
          )}

          {/* Show separator only if admin section was shown */}
          {isAdmin && <li className="separator"></li>}

          <li>
            <Link to="/account/profile" className={isActive("/account/profile")} title="Profile">
              <span className="icon"><FaUser /></span>
              {expanded && <span className="nav-text">Profile</span>}
            </Link>
          </li>
          <li>
            <Link to="/account/tokens" className={isActive("/account/tokens")} title="Tokens">
              <span className="icon"><FaKey /></span>
              {expanded && <span className="nav-text">Tokens</span>}
            </Link>
          </li>
          <li>
            <Link to="/account/change-password" className={isActive("/account/change-password")} title="Password">
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
