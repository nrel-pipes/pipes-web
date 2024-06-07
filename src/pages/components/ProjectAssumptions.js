
const webRegex = // eslint-disable-next-line
/([\w+]+\:\/\/)?([\w\d-]+\.)*[\w-]+[\.\:]\w+([\/\?\=\&\#\.]?[\w-]+){1,}\/?/gm;


export default function ProjectAssumptions({ assumptions }) {
  if (Array.isArray(assumptions)) {
    return (
      <>
        {assumptions.map((assumption, i) => {
          return assumption.match(webRegex) ? (
            <a
              key={"link_assumption_" + i.toString()}
              href={assumption}
              target="_blank"
              rel="noopener noreferrer"
            >
              {assumption}
            </a>
          ) : (
            <p key={assumption + "_" + i.toString()}>{assumption}</p>
          );
        })}
      </>
    );
  } else {
    return (
      <>
        <p>{assumptions}</p>
      </>
    );
  }
}
