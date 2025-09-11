import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './styles/NavbarSub.css';

const NavbarSub = ({ navData }) => {
  const {
    pList, pName, pGraph, pSchedule, pmAll,
    pCreate, tList, tName, toUpdate, toDelete,
    prName, prCreate, mCreate, mList, mName
  } = navData || {};

  if (
      pList || pName || pGraph || pSchedule  || pmAll || pCreate ||
      prName || prCreate || tList || tName ||
      mCreate || mList || mName || toUpdate || toDelete
    ) {
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
                <Nav.Link as="span" className="rounded-box" style={{ cursor: 'pointer' }}>Create Project</Nav.Link>
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
                    to={`/dashboard?P=${encodeURIComponent(pName)}`}
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
                    to={`/projectrun/${encodeURIComponent(prName)}?P=${encodeURIComponent(pName)}`}
                    className="active rounded-box"
                  >
                    ProjectRun ({prName})
                  </Nav.Link>
                </Nav.Item>
              </>
            )}

            {prCreate && (
              <>
              <FontAwesomeIcon
                  icon={faChevronRight}
                  style={{ margin: '0 8px', color: '#6c757d' }}
                  size="xs"
                />
              <Nav.Item style={{ display: 'inline-flex', alignItems: 'center' }}>
                <Nav.Link as="span" className="rounded-box" style={{ cursor: 'pointer' }}>Create Project Run</Nav.Link>
              </Nav.Item>
              </>
            )}

            {mCreate && (
              <>
              <FontAwesomeIcon
                  icon={faChevronRight}
                  style={{ margin: '0 8px', color: '#6c757d' }}
                  size="xs"
                />
              <Nav.Item style={{ display: 'inline-flex', alignItems: 'center' }}>
                <Nav.Link as="span" className="rounded-box" style={{ cursor: 'pointer' }}>Create Model</Nav.Link>
              </Nav.Item>
              </>
            )}

            {mList && (
              <>
              <FontAwesomeIcon
                  icon={faChevronRight}
                  style={{ margin: '0 8px', color: '#6c757d' }}
                  size="xs"
                />
              <Nav.Item style={{ display: 'inline-flex', alignItems: 'center' }}>
                <Nav.Link as={Link} to={`/models?P=${encodeURIComponent(pName)}`} className="rounded-box">Models</Nav.Link>
              </Nav.Item>
              </>
            )}

            {/* Show project name if provided */}
            {mName && (
              <>
                <FontAwesomeIcon
                  icon={faChevronRight}
                  style={{ margin: '0 8px', color: '#6c757d' }}
                  size="xs"
                />
                <Nav.Item style={{ display: 'inline-flex', alignItems: 'center' }}>
                  <Nav.Link
                    as={Link}
                    to={`/model/${mName}?P=${encodeURIComponent(pName)}&p=${encodeURIComponent(prName)}`}
                    className="active rounded-box"
                  >
                    Model ({mName})
                  </Nav.Link>
                </Nav.Item>
              </>
            )}

            {tList && (
              <>
              <FontAwesomeIcon
                  icon={faChevronRight}
                  style={{ margin: '0 8px', color: '#6c757d' }}
                  size="xs"
                />
              <Nav.Item style={{ display: 'inline-flex', alignItems: 'center' }}>
                <Nav.Link
                  as={Link}
                  to={`/teams?P=${encodeURIComponent(pName)}`}
                  className="rounded-box"
                >
                  Teams
                </Nav.Link>
              </Nav.Item>
              </>
            )}

            {tName && (
              <>
                <FontAwesomeIcon
                  icon={faChevronRight}
                  style={{ margin: '0 8px', color: '#6c757d' }}
                  size="xs"
                />
                <Nav.Item style={{ display: 'inline-flex', alignItems: 'center' }}>
                  <Nav.Link
                    as={Link}
                    to={`/team/${tName}?P=${pName}`}
                    className="active rounded-box"
                  >
                    Team ({tName})
                  </Nav.Link>
                </Nav.Item>
              </>
            )}

            {toUpdate && (
              <>
              <FontAwesomeIcon
                  icon={faChevronRight}
                  style={{ margin: '0 8px', color: '#6c757d' }}
                  size="xs"
                />
              <Nav.Item style={{ display: 'inline-flex', alignItems: 'center' }}>
                <Nav.Link as="span" className="rounded-box" style={{ cursor: 'pointer' }}>Update</Nav.Link>
              </Nav.Item>
              </>
            )}

            {toDelete && (
              <>
              <FontAwesomeIcon
                  icon={faChevronRight}
                  style={{ margin: '0 8px', color: '#6c757d' }}
                  size="xs"
                />
              <Nav.Item style={{ display: 'inline-flex', alignItems: 'center' }}>
                <Nav.Link as="span" className="rounded-box" style={{ cursor: 'pointer' }}>Delete</Nav.Link>
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
                    to={`/pipeline?P=${encodeURIComponent(pName)}`}
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
                    to={`/schedule?P=${encodeURIComponent(pName)}`}
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
