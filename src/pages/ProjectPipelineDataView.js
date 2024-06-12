
const underscore_regex = /_/;


function ProjectPipelineDataView({ data }) {
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
    <div>
      {d.map((entry, i) => {
        return (
          <details key={"node_data_" + i} className="mb-3" open>
            <summary className="checkin_description h5">{entry[0]}</summary>
            {_determine_output(entry[1])}
          </details>
        );
      })}
    </div>
  );
}

function _determine_output(d) {
  if (typeof d === "object") {
    return makeBullets(d);
  }
  return d;
}


export function makeBullets(obj) {
  if (!obj) {
    return <></>;
  }
  return Object.keys(obj).map((key) => {
    let value = obj[key];
    const keyIsInt = !isNaN(parseInt(key, 10));

    let keyDisplay = key.includes("_")
      ? key.replace(underscore_regex, " ")
      : key;

    if (Array.isArray(value)) {
      if (typeof value[0] === "object") {
        return (
          <div key={key}>
            {keyIsInt ? <></> : <h6>{keyDisplay}</h6>}
            <ul>{makeBullets(value)}</ul>
          </div>
        );
      } else {
        return (
          <div key={key}>
            {keyIsInt ? <></> : <h6>{keyDisplay}</h6>}
            <ul>{_listing(value, key)}</ul>
          </div>
        );
      }
    } else if (typeof value === "object") {
      return (
        <div key={key}>
          {keyIsInt ? <></> : <h6>{keyDisplay}</h6>}
          <ul>{makeBullets(value)}</ul>
        </div>
      );
    } else {
      return (
        <div key={key}>
          {keyIsInt ? <></> : <h6>{keyDisplay}</h6>}
          <ul>
            <li key={key + "_0"}>{value.toString()}</li>
          </ul>
        </div>
      );
    }
  });
}

function _listing(list, name) {
  return list.map((v, i) => {
    return <li key={name + i.toString()}>{v}</li>;
  });
}

export default ProjectPipelineDataView;
