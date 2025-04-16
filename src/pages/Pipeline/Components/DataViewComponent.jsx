import { useEffect, useState } from 'react';
import './DataViewComponent.css';

const underscore_regex = /_/;

function DataViewComponent({ data }) {
  const [showInstructions, setShowInstructions] = useState(true);

  // Hide instructions when data is received
  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      setShowInstructions(false);
    }
  }, [data]);

  const d = Object.entries(data).filter((entry) => {
    if (entry[0] !== "_history") {
      if (Array.isArray(entry[1])) {
        if (entry[1].length === 0) {
          return false;
        }
      } else {
        return true;
      }
    }
    return false;
  });

  return (
    <div className="data-view-wrapper">
      {showInstructions && (
        <div className="data-instructions">
          <p>Click a node to retrieve its attributes</p>
        </div>
      )}

      {d.length > 0 ? (
        <div className="data-sections">
          {d.map((entry, i) => (
            <div key={"section_" + i} className="data-section">
              <div className="section-header">{entry[0]}</div>
              <div className="section-content">
                {_determine_output(entry[1])}
              </div>
            </div>
          ))}
        </div>
      ) : !showInstructions && (
        <div className="no-data">
          <p>No attributes available for this node</p>
        </div>
      )}
    </div>
  );
}

function _determine_output(d) {
  if (typeof d === "object") {
    return renderTableData(d);
  }
  return <div className="simple-value">{d}</div>;
}

export function makeBullets(obj) {
  // Keep for compatibility with other components
  return renderTableData(obj);
}

function renderTableData(obj) {
  if (!obj) return <></>;

  const keys = Object.keys(obj).filter(key => key !== 'is_superuser');
  if (keys.length === 0) return <div className="empty-data">No data</div>;

  // Check if this is a simple array of primitives
  if (Array.isArray(obj) && typeof obj[0] !== 'object') {
    return (
      <table className="data-table simple-array-table">
        <tbody>
          {obj.map((item, i) => (
            <tr key={`row_${i}`}>
              <td>{item}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  // Handle objects and arrays of objects
  return (
    <table className="data-table">
      <tbody>
        {keys.map((key) => {
          let value = obj[key];
          const keyIsInt = !isNaN(parseInt(key, 10));
          let keyDisplay = key.includes("_") ? key.replace(underscore_regex, " ") : key;

          if (keyIsInt) keyDisplay = `Item ${parseInt(key) + 1}`;

          return (
            <tr key={`row_${key}`} className="data-row">
              {!keyIsInt && (
                <td className="key-cell">{keyDisplay}</td>
              )}
              <td className={keyIsInt ? "value-cell full-width" : "value-cell"} colSpan={keyIsInt ? 2 : 1}>
                {renderValue(value, key)}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function renderValue(value, key) {
  // Handle different types of values
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return <span className="empty-value">Empty array</span>;
    }

    // For arrays of objects, render nested tables
    if (typeof value[0] === 'object') {
      return (
        <div className="nested-table-wrapper">
          {renderTableData(value)}
        </div>
      );
    }
    // For arrays of primitives
    else {
      return (
        <div className="array-value-list">
          {value.map((item, i) => (
            <div key={`${key}_${i}`} className="array-item">
              {item}
            </div>
          ))}
        </div>
      );
    }
  }
  // For objects, render nested tables
  else if (typeof value === 'object' && value !== null) {
    return (
      <div className="nested-table-wrapper">
        {renderTableData(value)}
      </div>
    );
  }
  // For primitive values
  else {
    return <span className="primitive-value">{String(value)}</span>;
  }
}

function _listing(list, name) {
  // Keep for backward compatibility
  return list.map((v, i) => {
    return <div key={name + i.toString()} className="array-item">{v}</div>
  });
}

export default DataViewComponent;
