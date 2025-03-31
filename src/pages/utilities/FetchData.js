
import pipesConfig from '../configs/PipesConfig';


function getUrl(path) {
  if (!path.startsWith("/")) {
    path = "/" + path;
  }
  if (path.endsWith("/")) {
    path = path.slice(0, -1);
  }
  var url = pipesConfig.apiOrigin + path;
  return url
}


async function fetchData(path, params, token) {
  var url = getUrl(path);
  if (params != null) {
    url = `${url}?${params}`;
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized: Please check your credentials.");
      }
      throw Error('Could not fetch data from ' + pipesConfig.apiOrigin);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export default fetchData;
