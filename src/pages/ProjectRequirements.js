import React from "react";
import Table from "react-bootstrap/Table";

const ProjectRequirements = ({requirements}) => {
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
              <td>{Array.isArray(value) ? value.join(', ') : value}</td>
            </tr>
          ))}
        </tbody>
      </Table>
  );
}

export default ProjectRequirements;
