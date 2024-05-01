
function getUrl(pathname) {
  let origin;

  switch (process.env.REACT_APP_ENV) {
    case "prod":
      origin = "https://pipes-api.nrel.gov";
      break;
    case "stage":
      origin = "https://pipes-api-stage.stratus.nrel.gov";
      break;
    case "dev":
      origin = "https://pipes-api-dev.stratus.nrel.gov";
      break;
    default:
      origin = "http://0.0.0.0:8080";
  }

  if (!pathname.startsWith("/")) {
    pathname = "/" + pathname;
  }

  let url = origin + pathname;
  return url;
}

export default getUrl;
