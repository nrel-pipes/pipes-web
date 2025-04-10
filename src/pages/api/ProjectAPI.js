import pipes from "./AxiosInstance";

export const getProjectBasics = async () => {
  const response = await pipes.get("/api/projects/basics");
  return response.data;
};

export const getProject = async ({ projectName, accessToken }) => {
  try {
    const encodedProjectName = encodeURIComponent(projectName);
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
  console.log(data);
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

export const postProjectRun = async ({ projectName, projectRunData, accessToken }) => {
  if (!projectName) {
    throw new Error("Project name is required");
  }

  if (!projectRunData) {
    throw new Error("Project run data is required");
  }

  if (!accessToken) {
    throw new Error("Access token is required");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/projectruns?project=${encodeURIComponent(projectName)}`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: projectRunData.name,
        description: projectRunData.description || "",
        assumptions: projectRunData.assumptions || [],
        requirements: projectRunData.requirements || {},
        scenarios: projectRunData.scenarios || [],
        scheduled_start: projectRunData.scheduledStart || projectRunData.scheduled_start,
        scheduled_end: projectRunData.scheduledEnd || projectRunData.scheduled_end
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.detail || `Failed to create project run: ${response.status} ${response.statusText}`;
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating project run:", error);
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
