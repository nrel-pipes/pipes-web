import pipes from "./AxiosInstance";

export const getProjectBasics = async () => {
  const response = await pipes.get("/api/projects/basics");
  return response.data;
};

export const getProject = async ({ projectName, accessToken }) => {
  console.log(projectName, accessToken);
  try {
    const response = await pipes.get(`/api/projects`, {
      params: { project: projectName },
    });

    if (!response.data) {
      // Handle the case where response.data is undefined or null.  Important!
      throw new Error("No data received from the server.");
    }
    console.log("got project");
    return response.data; // Return ONLY the data from the response
  } catch (error) {
    console.error("Error getting project:", error);
    throw error; // Important!
  }
};



export const postProject = async ({ data, token }) => {
  try {
    const response = await pipes.post("api/projects", data, {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error posting project:", error);
    throw error;
  }
};

export const getProjectRuns = async ({ projectTitle, accessToken }) => {
  console.log(projectTitle);
  try {
    const response = await fetch(
      `http://localhost:8080/api/projectruns?project=${projectTitle}`,
      {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(
      `Error getting project runs for ${projectTitle}:`,
      error,
    );
    throw error;
  }
};
