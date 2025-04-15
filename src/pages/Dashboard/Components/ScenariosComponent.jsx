import { useEffect } from "react";
import Table from "react-bootstrap/Table";

import useUIStore from '../../../stores/UIStore';

const ScenarioRow = ({ name, description, other }) => {
  const getColor = useUIStore(state => state.getColor);
  const setColor = useUIStore(state => state.setColor);

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
          <svg width="40" height="20">
            <rect width="40" height="20" fill={fillColor} />
          </svg>
          <br />
          <small style={{fontSize: '12px'}}>{name}</small>
        </h5>
      </td>
      <td className="text-start">{description}</td>
    </tr>
  );
};

const ScenariosCompoent = ({scenarios}) => {
  return (
    <Table striped bordered hover>
        <thead>
          <tr>
            <th>Scenario</th>
            <th>Description</th>
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

export default ScenariosCompoent;
