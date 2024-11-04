import Table from 'react-bootstrap/Table';
import React, { useMemo } from 'react';
import "./PageTitle.css";
import "../pages/PageStyles.css";
// import useDataStore from "./stores/DataStore";

const UpcomingMilestones = ({ projectBasics }) => {
    
    const milestones = useMemo(() => {
        let milestonesExist = false;
        for (let i = 0; i < projectBasics.length; i++) {
            if (projectBasics[i].milestones.length > 0) {
                milestonesExist = true;
                break;
            }
        }
        
        if (!milestonesExist) {
            console.warn('No milestones found in project data');
            return [];
        }
    
        const today = new Date();
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(today.getDate() + 30);
    
        return projectBasics.flatMap((project) => 
            project.milestones.map((milestone) => {
                const milestoneDate = new Date(milestone.milestone_date);
                
                // Only return the row if milestone date is between today and 30 days from now
                if (milestoneDate >= today && milestoneDate <= thirtyDaysFromNow) {
                    return (
                        <tr key={`${project.name}-${milestone.name}`} className="even:bg-gray-50">
                            <td className="p-3 border">{project.name}</td>
                            <td className="p-3 border">{milestoneDate.toLocaleDateString()}</td>
                            <td className="p-3 border">{milestone.name}</td>
                            <td className="p-3 border">
                                {Array.isArray(milestone.description) ? 
                                    milestone.description.join(" ") : 
                                    milestone.description}
                            </td>
                        </tr>
                    );
                }
                return null; // Skip milestones outside the 30-day window
            }).filter(Boolean) // Remove null values from the results
        );
    }, [projectBasics]);
  if (!milestones.length) {
      return (
        <div className="h-full w-full">
        <Table striped bordered hover>
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
                            No upcoming milestones
                        </td>
                    </tr>
                </tbody>

        </Table>
    </div>
      );
  }

  return (
    <div className="h-full w-full">
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Project</th>
                    <th>Date</th>
                    <th>Milestone</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                {milestones.length > 0 ? milestones : (
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