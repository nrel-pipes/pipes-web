import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './styles/NavbarSub.css';

const NavbarSub = ({ navData }) => {
  const { pList, pCreate, pUpdate, pmAll, pName, prName, pGraph, pSchedule } = navData || {};

  if (pList || pmAll || pName || pCreate || pUpdate || prName || pGraph || pSchedule) {
    return (
      <div className="navbar-sub">
        <Navbar expand="lg" className="navbar-sub-instance w-100">
          <Nav style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>

            {pList && (
              <>
              <Nav.Item style={{ display: 'inline-flex', alignItems: 'center' }}>
                <Nav.Link as={Link} to="/projects" className="rounded-box">Projects</Nav.Link>
              </Nav.Item>
              </>
            )}

            {pCreate && (
              <>
              <FontAwesomeIcon
                  icon={faChevronRight}
                  style={{ margin: '0 8px', color: '#6c757d' }}
                  size="xs"
                />
              <Nav.Item style={{ display: 'inline-flex', alignItems: 'center' }}>
                <Nav.Link as={Link} to="#" className="rounded-box">Create</Nav.Link>
              </Nav.Item>
              </>
            )}

            {pUpdate && (
              <>
              <FontAwesomeIcon
                  icon={faChevronRight}
                  style={{ margin: '0 8px', color: '#6c757d' }}
                  size="xs"
                />
              <Nav.Item style={{ display: 'inline-flex', alignItems: 'center' }}>
                <Nav.Link as={Link} to="#" className="rounded-box">Update</Nav.Link>
              </Nav.Item>
              </>
            )}

            {pmAll && (
              <>
              <FontAwesomeIcon
                  icon={faChevronRight}
                  style={{ margin: '0 8px', color: '#6c757d' }}
                  size="xs"
                />
              <Nav.Item style={{ display: 'inline-flex', alignItems: 'center' }}>
                <Nav.Link as={Link} to="/milestones" className="rounded-box">Milestones</Nav.Link>
              </Nav.Item>
              </>
            )}

            {/* Show project name if provided */}
            {pName && (
              <>
                <FontAwesomeIcon
                  icon={faChevronRight}
                  style={{ margin: '0 8px', color: '#6c757d' }}
                  size="xs"
                />
                <Nav.Item style={{ display: 'inline-flex', alignItems: 'center' }}>
                  <Nav.Link
                    as={Link}
                    to={`/project/dashboard`}
                    className="active rounded-box"
                  >
                    Project ({pName})
                  </Nav.Link>
                </Nav.Item>
              </>
            )}

            {/* Show project run name if provided */}
            {prName && (
              <>
                <FontAwesomeIcon
                  icon={faChevronRight}
                  style={{ margin: '0 8px', color: '#6c757d' }}
                  size="xs"
                />
                <Nav.Item style={{ display: 'inline-flex', alignItems: 'center' }}>
                  <Nav.Link
                    as={Link}
                    to={`/projectrun`}
                    className="active rounded-box"
                  >
                    ProjectRun ({prName})
                  </Nav.Link>
                </Nav.Item>
              </>
            )}

            {/* Show project pipeline if provided */}
            {pGraph && (
              <>
                <FontAwesomeIcon
                  icon={faChevronRight}
                  style={{ margin: '0 8px', color: '#6c757d' }}
                  size="xs"
                />
                <Nav.Item style={{ display: 'inline-flex', alignItems: 'center' }}>
                  <Nav.Link
                    as={Link}
                    to={`/project/pipeline`}
                    className="active rounded-box"
                  >
                    Pipeline
                  </Nav.Link>
                </Nav.Item>
              </>
            )}


            {/* Show project schedule if provided */}
            {pSchedule && (
              <>
                <FontAwesomeIcon
                  icon={faChevronRight}
                  style={{ margin: '0 8px', color: '#6c757d' }}
                  size="xs"
                />
                <Nav.Item style={{ display: 'inline-flex', alignItems: 'center' }}>
                  <Nav.Link
                    as={Link}
                    to={`/project/schedule`}
                    className="active rounded-box"
                  >
                    Schedule
                  </Nav.Link>
                </Nav.Item>
              </>
            )}

          </Nav>
        </Navbar>
      </div>
    );
  }

  // Default case - no navigation data provided
  return (
    <div className="navbar-sub">
      <Navbar expand="lg" className="navbar-sub-instance w-100">
        <Nav></Nav>
      </Navbar>
    </div>
  );
};

export default NavbarSub;
