import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import Table from "react-bootstrap/Table";
import { useNavigate } from "react-router-dom";
import useDataStore from "../../stores/DataStore";
import "../PageStyles.css";
import "./UpcomingMilestonesComponent.css";


const UpcomingMilestonesComponent = ({ projectBasics }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setEffectivePname } = useDataStore();

  const handleProjectClick = useCallback(
    (event, projectName) => {
      event.preventDefault();
      // Set the effective project before navigation
      setEffectivePname(projectName);
      // Prefetch the project data
      queryClient.prefetchQuery(["project", projectName]);
      navigate("/project/dashboard");
    },
    [setEffectivePname, queryClient, navigate],
  );

  const milestones = useMemo(() => {
    let milestonesExist = false;
    for (let i = 0; i < projectBasics.length; i++) {
      if (projectBasics[i].milestones && projectBasics[i].milestones.length > 0) {
        milestonesExist = true;
        break;
      }
    }

    if (!milestonesExist) {
      console.warn("No milestones found in project data");
      return [];
    }

    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    return projectBasics.flatMap((project) =>
      project.milestones
        .map((milestone) => {
          const milestoneDate = new Date(milestone.milestone_date);

          if (milestoneDate >= today && milestoneDate <= thirtyDaysFromNow) {
            return (
              <tr
                key={`${project.name}-${milestone.name}`}
                className="even:bg-gray-50"
              >
                <td className="p-3 border">
                  <button
                    onClick={(e) => handleProjectClick(e, project.name)}
                    className="text-primary hover:text-primary-dark text-decoration-none border-0 bg-transparent p-0"
                    style={{ cursor: "pointer" }}
                  >
                    {project.name}
                  </button>
                </td>
                <td className="p-3 border">
                  {milestoneDate.toLocaleDateString()}
                </td>
                <td className="p-3 border">{milestone.name}</td>
                <td className="p-3 border">
                  {Array.isArray(milestone.description)
                    ? milestone.description.join(" ")
                    : milestone.description}
                </td>
              </tr>
            );
          }
          return null;
        })
        .filter(Boolean),
    );
  }, [projectBasics, handleProjectClick]);

  if (!milestones.length) {
    return (
      <div className="milestone-container">
        <Table striped bordered hover className="milestone-table" responsive>
          <thead>
            <tr style={{ borderTop: '3px solid #0071b8' }}>
              <th scope="col" style={{
                  padding: '1.5rem 1.5rem',
                  fontWeight: '700',
                  color: 'var(--bs-gray-700)',
                  border: 'none',
                  borderBottom: '1px solid var(--bs-border-color)',
                  textAlign: 'left',
                  width: '15%'
              }}>Date</th>
              <th scope="col" style={{
                  padding: '1.5rem 1.5rem',
                  fontWeight: '700',
                  color: 'var(--bs-gray-700)',
                  border: 'none',
                  borderBottom: '1px solid var(--bs-border-color)',
                  textAlign: 'left',
                  width: '15%'
              }}>Project</th>
              <th scope="col" style={{
                  padding: '1.5rem 1.5rem',
                  fontWeight: '700',
                  color: 'var(--bs-gray-700)',
                  border: 'none',
                  borderBottom: '1px solid var(--bs-border-color)',
                  textAlign: 'left',
                  width: '15%'
              }}>Milestone</th>
              <th scope="col" style={{
                  padding: '1.5rem 1.5rem',
                  fontWeight: '700',
                  color: 'var(--bs-gray-700)',
                  border: 'none',
                  borderBottom: '1px solid var(--bs-border-color)',
                  textAlign: 'left',
                  width: '15%'
              }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={4} className="text-center p-4">
                No upcoming milestones found
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
    );
  }

  return (
    <div className="milestone-container">
      <Table striped bordered hover className="milestone-table" responsive>
        <thead>
          <tr>
            <th>Project</th>
            <th>Date</th>
            <th>Milestone</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {milestones.length > 0 ? (
            milestones
          ) : (
            <tr>
              <td colSpan={4} className="text-center">
                No upcoming milestones found
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default UpcomingMilestonesComponent;
