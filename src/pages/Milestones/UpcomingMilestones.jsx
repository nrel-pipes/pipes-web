import React, { useCallback, useMemo } from "react";
import Table from "react-bootstrap/Table";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/AuthStore";
import useDataStore from "../../stores/DataStore";
import "../PageStyles.css";
import "./UpcomingMilestones.css"; // Add this import

const UpcomingMilestones = ({ projectBasics }) => {
  const navigate = useNavigate();
  const { getProject } = useDataStore();
  const { accessToken } = useAuthStore();

  const handleProjectClick = useCallback(
    (event, projectName) => {
      event.preventDefault();
      getProject(projectName, accessToken);
      navigate("/project");
    },
    [getProject, accessToken, navigate],
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
            <tr>
              <th>Date</th>
              <th>Project</th>
              <th>Milestone</th>
              <th>Description</th>
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

export default UpcomingMilestones;
