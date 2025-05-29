import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";

import { useGetModelCatalog } from "../../hooks/useModelQuery";
import { useGetUserQuery } from "../../hooks/useUserQuery";
import useAuthStore from "../../stores/AuthStore";

import NavbarSub from "../../layouts/NavbarSub";
import "../Components/Cards.css";
import "../PageStyles.css";
import "./ModelCatalog.css";

const webRegex = /([\w+]+:\/\/)?([\w\d-]+\.)*[\w-]+[.:]\w+([/?=&#.]?[\w-]+){1,}\/?/gm;

// Helper component for displaying array of items with potential web links
const ListItemsDisplay = ({ items }) => {
  if (!items || items.length === 0) {
    return <p className="text-muted">None specified</p>;
  }

  return (
    <>
      {items.map((item, i) => {
        return typeof item === 'string' && item.match(webRegex) ? (
          <a
            key={`link_${i}`}
            href={item}
            target="_blank"
            rel="noopener noreferrer"
          >
            {item}
          </a>
        ) : (
          <p key={`item_${i}`}>{typeof item === 'object' ? JSON.stringify(item) : String(item)}</p>
        );
      })}
    </>
  );
};

// Component for displaying object properties in a table format
const TableObjectDisplay = ({ object }) => {
  if (!object || Object.keys(object).length === 0) {
    return <p className="text-muted">None specified</p>;
  }

  return (
    <Table striped bordered hover size="sm" className="model-table">
      <thead>
        <tr>
          <th>Item</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(object).map(([key, value]) => (
          <tr key={key}>
            <td>{key.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}</td>
            <td>
              {Array.isArray(value)
                ? value.map((item, i) => (
                    <div key={i}>
                      {typeof item === 'string' && item.match(webRegex) ? (
                        <a href={item} target="_blank" rel="noopener noreferrer">{item}</a>
                      ) : (
                        typeof item === 'object' && item !== null
                          ? JSON.stringify(item)
                          : String(item)
                      )}
                    </div>
                  ))
                : typeof value === 'object' && value !== null
                  ? <TableObjectDisplay object={value} />
                  : String(value)
              }
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

const ModelCatalog = () => {
    const { currentUser, setCurrentUser, getIdToken, checkAuthStatus } = useAuthStore();
    // Pagination state
    const [setCurrentPage] = useState(1);
    const [userEmail, setUserEmail] = useState(null);
    // Add state for search term
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page when searching
      };

    const handleModelClick = (e, model) => {
      e.preventDefault();

      // Store model data in localStorage to be retrieved by the PullModel component
      localStorage.setItem('pullModelDefaults', JSON.stringify({
        name: model.name || '',
        display_name: model.display_name || '',
        type: model.type || '',
        description: Array.isArray(model.description) ? model.description : [model.description || ''],
        modeling_team: model.modeling_team || '',
        assumptions: Array.isArray(model.assumptions) ? model.assumptions : [],
        requirements: model.requirements || {},
        scheduled_start: model.scheduled_start || '',
        scheduled_end: model.scheduled_end || '',
        expected_scenarios: Array.isArray(model.expected_scenarios) ? model.expected_scenarios : [],
        scenario_mappings: Array.isArray(model.scenario_mappings) ? model.scenario_mappings : [],
        other: model.other || {},
        project: model.project || '',
        projectrun: model.projectrun || '',
      }));

      // Navigate to the pull model page
      navigate('/pullModel');
    }

    useEffect(() => {
        const checkAuth = async () => {
          try {
            // Validate authentication and check if user is logged in
            const isAuthenticated = await checkAuthStatus();

            if (!isAuthenticated) {
              navigate("/login");
              return;
            }

            // Get the ID token and extract email
            const idToken = await getIdToken();
            if (idToken) {
              const decodedIdToken = jwtDecode(idToken);
              const email = decodedIdToken.email.toLowerCase();
              setUserEmail(email);
            } else {
              // Handle missing token case
              console.error("ID token not available");
              navigate("/login");
            }
          } catch (error) {
            console.error("Authentication error:", error);
            navigate("/login");
          }
        };

        checkAuth();
      }, [navigate, getIdToken, checkAuthStatus]);

    const { data: userData } = useGetUserQuery(userEmail);

    useEffect(() => {
      if (userData && !currentUser) {
        setCurrentUser(userData);
      }
    }, [userData, currentUser, setCurrentUser]);

    const {
      data: modelCatalog = [],
      isLoading: isLoadingModelCatalog,
      isError: isErrorModelCatalog,
      error: errorModelCatalog,
    } = useGetModelCatalog();

  // Filter projects based on search term before pagination
  const filteredModelCatalog = [...modelCatalog].reverse().filter(modelCatalog =>
    modelCatalog.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
    if (isLoadingModelCatalog) {
        return (
          <>
          <NavbarSub/>
          <Container className="mainContent">
            <Row className="mt-5">
              <Col>
                <FontAwesomeIcon icon={faSpinner} spin size="xl" />
              </Col>
            </Row>
          </Container>
          </>
        );
    };

    if (isErrorModelCatalog) {
      return (
        <>
          <NavbarSub/>
          <Container className="mainContent">
            <Row className="mt-5">
              <Col>
                <div className="alert alert-danger">
                  <h4>Error Loading Model Catalog</h4>
                  <p>{errorModelCatalog?.message || "An unknown error occurred while fetching the model catalog."}</p>
                  <p>Please try refreshing the page or contact support if the problem persists.</p>
                </div>
              </Col>
            </Row>
          </Container>
        </>
      );
    }

    if (!modelCatalog || modelCatalog.length === 0) {
        return (
          <>
          <NavbarSub/>
          <Container className="mainContent" fluid style={{ padding: '0 20px' }}>
            <div className="empty-state-container">
              <div className="empty-state-card">
                <div className="empty-state-icon">
                  <i className="bi bi-folder-plus"></i>
                </div>
                <h3 className="empty-state-title">No Projects Found</h3>
                <p className="empty-state-description">
                  There are no models in the model catalog. Be the first to contribute!
                </p>
                <div className="empty-state-actions">
                </div>
              </div>
            </div>
          </Container>
          </>
        );
      };

    return (
        <>
        <NavbarSub navData={{pAll: true}} />
        <Container className="mainContent" fluid style={{ padding: '0 20px' }}>

      <Row className="mb-4 mt-2">
        <Col md={6} lg={4} className="ms-0">
          <div className="search-container">
            <input
              type="text"
              className="form-control shadow-sm"
              placeholder="Search models by name or title..."
              value={searchTerm}
              onChange={handleSearchChange}
              aria-label="Search models"
            />
            <div className="search-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
              </svg>
            </div>
          </div>
        </Col>
      </Row>
      {filteredModelCatalog.length === 0 && searchTerm && (
        <div className="text-center my-5">
          <p className="text-muted">No models found matching "{searchTerm}"</p>
        </div>
      )}
      <div className="model-list-container">
        {modelCatalog.map((model) => (
          <div key={model.name} className="model-column">
            <div className="model-content">
              <div className="model-field title-field">
                <span className="field-value model-title">{model.display_name || model.title}</span>
              </div>
              <div className="model-field name-field">
                <span className="field-label">Name:</span>
                <span className="field-value model-name">{model.name}</span>
              </div>

              {model.type && (
                <div className="model-field">
                  <span className="field-label">Type:</span>
                  <span className="model-type">{model.type}</span>
                </div>
              )}

              <div className="model-field">
                <span className="field-label">Description:</span>
                <div className="model-description">
                  {Array.isArray(model.description) ? (
                    <ListItemsDisplay items={model.description} />
                  ) : (
                    <p>{model.description}</p>
                  )}
                </div>
              </div>

              {model.assumptions && model.assumptions.length > 0 && (
                <div className="model-field">
                  <span className="field-label">Assumptions:</span>
                  <div className="model-assumptions">
                    <ListItemsDisplay items={model.assumptions} />
                  </div>
                </div>
              )}

              {model.expected_scenarios && model.expected_scenarios.length > 0 && (
                <div className="model-field">
                  <span className="field-label">Expected Scenarios:</span>
                  <div className="model-scenarios">
                    <ListItemsDisplay items={model.expected_scenarios} />
                  </div>
                </div>
              )}

              {model.requirements && Object.keys(model.requirements).length > 0 && (
                <div className="model-field">
                  <span className="field-label">Requirements:</span>
                  <div className="model-requirements">
                    <TableObjectDisplay object={model.requirements} />
                  </div>
                </div>
              )}

              {model.other && Object.keys(model.other).length > 0 && (
                <div className="model-field">
                  <span className="field-label">Additional Information:</span>
                  <div className="model-other">
                    <TableObjectDisplay object={model.other} />
                  </div>
                </div>
              )}

              <div className="model-footer">
                <button
                  className="dashboard-button"
                  onClick={(e) => handleModelClick(e, model)}
                >
                  Pull Model a Project
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>


      </Container>
        </>
    );
};
export default ModelCatalog;

