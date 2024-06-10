import { useEffect } from "react";
import Table from "react-bootstrap/Table";

import useColorStore from './stores/ColorStore';

const ScenarioRow = ({ name, description, other }) => {
  const getColor = useColorStore(state => state.getColor);
  const setColor = useColorStore(state => state.setColor);

  useEffect(() => {
    if (other.color) {
      setColor(name, other.color);
    }
  }, [name, other, setColor]);

  const fillColor = getColor(name);

  return (
    <tr>
      <td>
        <h5>
          <svg width="80" height="35">
            <rect width="80" height="35" fill={fillColor} />
          </svg>
          <br />
          {name}
        </h5>
      </td>
      <td>{description}</td>
    </tr>
  );
};

const ProjectOverviewScenarios = ({scenarios}) => {
  return (
    <Table striped bordered hover>
        <thead>
          <tr>
            <th>Scenario</th>
            <th>Descriptipon</th>
          </tr>
        </thead>
        <tbody>
          {scenarios.map((scenario, index) => (
            <ScenarioRow key={index} {...scenario} />
          ))}
        </tbody>
      </Table>
  );
}

export default ProjectOverviewScenarios;
