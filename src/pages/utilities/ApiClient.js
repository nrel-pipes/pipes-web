
import pipesConfig from '../configs/PipesConfig'


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

async function postData(path, params, data, token) {
  var url = getUrl(path);

  // Add query params to URL if present
  if (params != null) {
    url = `${url}?${params}`;
  }

  // Stringify the body data
  var postData = JSON.stringify(data);
  try {
    // Perform the POST request
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: postData,
    });
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized: Please check your credentials.");
      } else if (response.status === 422) {
        throw new Error("Unprocessable: Please provide correctly formatted JSON data.");
      }
      throw new Error(`Error: ${response.statusText}`);
    }
    return response;
  } catch (error) {
    console.error("Error:", error);  
    throw error;
  }
}


export { fetchData, postData };
