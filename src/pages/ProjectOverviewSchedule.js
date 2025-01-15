import React from "react";
import Table from "react-bootstrap/Table";

const ProjectOverviewSchedule = ({ scheduled_start, scheduled_end }) => {
  return (
    <Table striped bordered hover>
      <tbody>
        <tr>
          <td>Start</td>
          <td>{scheduled_start}</td>
        </tr>
        <tr>
          <td>End</td>
          <td>{scheduled_end}</td>
        </tr>
      </tbody>
    </Table>
  );
};

export default ProjectOverviewSchedule;
