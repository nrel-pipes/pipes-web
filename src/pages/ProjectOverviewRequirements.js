import React from "react";
import Table from "react-bootstrap/Table";


const ProjectOverviewRequirements = ({requirements}) => {
  return (
    <Table striped bordered hover>
        <thead>
          <tr>
            <th>Item</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(requirements).map(([key, value]) => (
            <tr key={key}>
              <td>{key.replace('_', ' ').replace(/\b\w/g, char => char.toUpperCase())}</td>
              <td>
              {Array.isArray(value)
                ? value.join(', ') // If it's an array, join the elements
                : typeof value === 'object' && value !== null
                ? JSON.stringify(value) // If it's an object, convert it to a string
                : value} {/* For everything else, render as-is */}
            </td>
            </tr>
          ))}
        </tbody>
      </Table>
  );
}

export default ProjectOverviewRequirements;
