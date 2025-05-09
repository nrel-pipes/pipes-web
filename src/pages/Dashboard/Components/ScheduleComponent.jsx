import React from "react";
import Table from "react-bootstrap/Table";

const ScheduleComponent = ({ scheduled_start: scheduledStart, scheduled_end: scheduledEnd }) => {
  return (
    <Table striped bordered hover>
      <tbody>
        <tr>
          <td>Start</td>
          <td>{scheduledStart}</td>
        </tr>
        <tr>
          <td>End</td>
          <td>{scheduledEnd}</td>
        </tr>
      </tbody>
    </Table>
  );
};

export default ScheduleComponent;
