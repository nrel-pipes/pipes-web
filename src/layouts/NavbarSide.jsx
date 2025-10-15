import { useEffect, useState } from 'react';
import {
  FaAngleDoubleLeft,
  FaBars,
  FaCalendarAlt,
  FaCube,
  FaFlag,
  FaKey,
  FaLayerGroup,
  FaLock,
  FaProjectDiagram,
  FaSignOutAlt,
  FaTachometerAlt,
  FaUser,
  FaUserFriends,
  FaUsers
} from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import { useNavigation } from '../contexts/NavigationContext';
import useAuthStore from '../stores/AuthStore';
import useDataStore from '../stores/DataStore';
import './styles/NavbarSide.css';

const Sidebar = () => {
  const [expanded, setExpanded] = useState(true);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const { effectivePname } = useDataStore();
  const { currentUser } = useAuthStore();
  const { activeSection } = useNavigation();
  const projectName = searchParams.get('P') || effectivePname;

  // Check if the user is an admin
  const isAdmin = currentUser?.is_superuser === true;

  // Use effectivePname for project context
  const hasProject = !!effectivePname;

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  // Force consistent sidebar width when route changes
  useEffect(() => {
    // This ensures the sidebar maintains its width when navigating
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      if (expanded) {
        sidebar.style.width = '200px';
      } else {
        sidebar.style.width = '60px';
      }
    }
  }, [location.pathname, expanded]);

  // Updated isActive function to handle path matching more precisely
  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  // Function to determine if a link should be disabled
  const getNavItemClass = (path) => {
    // Only disable if project context is missing
    const shouldDisable = [
      '/dashboard',
      '/models',
      '/pipeline',
      '/schedule',
      '/teams'
    ].includes(path) && !hasProject;
    return `${isActive(path)} ${shouldDisable ? 'disabled' : ''}`;
  };

  // Function to handle click on disabled links
  const handleNavClick = (e, path) => {
    if (
      [
        '/dashboard',
        '/models',
        '/pipeline',
        '/schedule',
        '/teams'
      ].includes(path) && !hasProject
    ) {
      e.preventDefault();
    }
  };

  // Render catalog sidebar
  const renderCatalogSidebar = () => (
    <nav className="sidebar-nav">
      <ul>
        <li>
          <Link to="/catalogmodels" className={isActive("/catalogmodels")} title="Catalog Models">
            <span className="icon"><FaCube /></span>
            {expanded && <span className="nav-text">Models</span>}
          </Link>
        </li>
        {/* <li>
          <Link to="/catalogdatasets" className={isActive("/catalogdatasets")} title="Catalog Datasets">
            <span className="icon"><FaDatabase /></span>
            {expanded && <span className="nav-text">Datasets</span>}
          </Link>
        </li> */}
      </ul>
    </nav>
  );

  // Render account sidebar
  const renderAccountSidebar = () => (
    <nav className="sidebar-nav">
      <ul>
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
      </ul>
    </nav>
  );

  // Render logout sidebar
  const renderLogoutSidebar = () => (
    <nav className="sidebar-nav">
      <ul>
        <li>
          <Link to="/logout" className={isActive("/logout")} title="Logout">
            <span className="icon"><FaSignOutAlt /></span>
            {expanded && <span className="nav-text">Logout</span>}
          </Link>
        </li>
      </ul>
    </nav>
  );

  // Render workspace sidebar (existing sidebar)
  const renderWorkspaceSidebar = () => (
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
            to={`/dashboard?P=${encodeURIComponent(projectName)}`}
            className={getNavItemClass("/dashboard")}
            title={projectName ? "Dashboard" : "Select a project first"}
            onClick={(e) => handleNavClick(e, "/dashboard")}
          >
            <span className="icon"><FaTachometerAlt /></span>
            {expanded && <span className="nav-text">Dashboard</span>}
          </Link>
        </li>
        <li>
          <Link
            to={`/models?P=${encodeURIComponent(projectName)}`}
            className={getNavItemClass("/models")}
            title={projectName ? "Models" : "Select a project first"}
            onClick={(e) => handleNavClick(e, "/models")}
          >
            <span className="icon"><FaCube /></span>
            {expanded && <span className="nav-text">Models</span>}
          </Link>
        </li>
        <li>
          <Link
            to={`/pipeline?P=${encodeURIComponent(projectName)}`}
            className={getNavItemClass("/pipeline")}
            title={projectName ? "Pipeline" : "Select a project first"}
            onClick={(e) => handleNavClick(e, "/pipeline")}
          >
            <span className="icon"><FaProjectDiagram /></span>
            {expanded && <span className="nav-text">Pipeline</span>}
          </Link>
        </li>
        <li>
          <Link
            to={`/schedule?P=${encodeURIComponent(projectName)}`}
            className={getNavItemClass("/schedule")}
            title={projectName ? "Schedule" : "Select a project first"}
            onClick={(e) => handleNavClick(e, "/schedule")}
          >
            <span className="icon"><FaCalendarAlt /></span>
            {expanded && <span className="nav-text">Schedule</span>}
          </Link>
        </li>
        <li>
          <Link
            to={`/teams?P=${encodeURIComponent(projectName)}`}
            className={getNavItemClass("/teams")}
            title={projectName ? "Models" : "Select a project first"}
            onClick={(e) => handleNavClick(e, "/teams")}
          >
            <span className="icon"><FaUserFriends /></span>
            {expanded && <span className="nav-text">Teams</span>}
          </Link>
        </li>

        {/* Only show Users link if user is an admin */}
        {isAdmin && (
          <>
            <li className="separator"></li>
            <li>
              <Link to="/users" className={`${isActive("/users")} admin-menu-item`} title="Users">
                <span className="icon"><FaUsers /></span>
                {expanded && <span className="nav-text">Users</span>}
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );

  return (
    <>
      {activeSection !== 'home' && (
        <div className={`sidebar ${expanded ? 'expanded' : 'collapsed'} route-${location.pathname.replace(/\//g, '-')}`}>
          <div className="sidebar-toggle" onClick={toggleSidebar}>
            {expanded ? <FaAngleDoubleLeft /> : <FaBars />}
          </div>

          {activeSection === 'catalog'
            ? renderCatalogSidebar()
            : activeSection === 'account'
            ? renderAccountSidebar()
            : activeSection === 'logout'
            ? renderLogoutSidebar()
            : renderWorkspaceSidebar()}
        </div>
      )}
    </>
  );
};

export default Sidebar;
