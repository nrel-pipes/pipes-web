import Table from "react-bootstrap/Table";


const RequirementsComponent = ({requirements}) => {

  // Check if requirements is a non-empty object
  const isValidRequirements = requirements &&
                              typeof requirements === 'object' &&
                              Object.keys(requirements).length > 0;

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

  const formatRequirementName = (key) => {
    return key;
  };

  const formatRequirementValue = (value) => {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (typeof value === 'object' && value !== null) {
      return (
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
          {JSON.stringify(value, null, 2)}
        </pre>
      );
    }
    return String(value);
  };

  return (
    <Table striped bordered hover>
        <thead>
          <tr>
            <th className="text-start">Requirement Name</th>
            <th className="text-start">Values</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(requirements).map(([key, value]) => {
            const displayValue = formatRequirementValue(value);

            return (
              <tr key={key}>
                <td className="text-start">{formatRequirementName(key)}</td>
                <td className="text-start">
                  {displayValue}
                </td>
              </tr>
            );
          })}
          {Object.keys(requirements).length === 0 && (
            <tr>
              <td colSpan="2" className="text-start">No requirements defined.</td>
            </tr>
          )}
        </tbody>
      </Table>
  );
}

export default RequirementsComponent;
