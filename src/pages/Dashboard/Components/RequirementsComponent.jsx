import Table from "react-bootstrap/Table";


const RequirementsComponent = ({requirements}) => {
  // Check if requirements is an object and has keys and values arrays
  const isValidRequirements = requirements &&
                              typeof requirements === 'object' &&
                              Array.isArray(requirements.keys) &&
                              Array.isArray(requirements.values) &&
                              requirements.keys.length === requirements.values.length;

  if (!isValidRequirements) {
    // Handle invalid or empty requirements structure, or return null/empty message
    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th className="text-start">Requirement Name</th>
            <th className="text-start">Values</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan="2" className="text-start">No requirements data available or data is in an unexpected format.</td>
          </tr>
        </tbody>
      </Table>
    );
  }

  return (
    <Table striped bordered hover>
        <thead>
          <tr>
            <th className="text-start">Requirement Name</th>
            <th className="text-start">Values</th>
          </tr>
        </thead>
        <tbody>
          {requirements.keys.map((key, index) => {
            const valueArray = requirements.values[index];
            const displayValue = Array.isArray(valueArray)
              ? valueArray.join(', ')
              : String(valueArray); // Fallback for unexpected value format

            return (
              <tr key={key || index}>
                <td className="text-start">{key.replace('_', ' ').replace(/\b\w/g, char => char.toUpperCase())}</td>
                <td className="text-start">{displayValue}</td>
              </tr>
            );
          })}
          {requirements.keys.length === 0 && (
            <tr>
              <td colSpan="2" className="text-start">No requirements defined.</td>
            </tr>
          )}
        </tbody>
      </Table>
  );
}

export default RequirementsComponent;
