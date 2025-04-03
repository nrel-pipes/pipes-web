import pipes from "./AxiosInstance";

export const getProjectBasics = async () => {
  const response = await pipes.get("/api/projects/basics");
  return response.data;
};

export const getProject = async ({ projectName, accessToken }) => {
  console.log(projectName, accessToken);
  try {
    const encodedProjectName = encodeURIComponent(projectName);
    console.log(encodedProjectName);
    const response = await pipes.get(`/api/projects?project=${encodedProjectName}`);
    if (!response.data) {
      throw new Error("No data received from the server.");
    }
    console.log("got project");
    return response.data;
  } catch (error) {
    console.error("Error getting project:", error);
    throw error;
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

export const getProjectRuns = async ({ projectName, accessToken }) => {
  const encodedProjectName = encodeURIComponent(projectName);
  try {
    const response = await fetch(
      `http://localhost:8080/api/projectruns?project=${encodedProjectName}`,
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
      `Error getting project runs for ${projectName}:`,
      error,
    );
    throw error;
  }
};
