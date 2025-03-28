import pipes from "./AxiosInstance";

export const getProjectBasics = async () => {
  const response = await pipes.get("/api/projects/basics");
  return response.data;
};

export const getProject = async ({ projectName, accessToken }) => {
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

// export const getProject = () => {
//   return Promise.resolve({ name: "Test Project", description: "Test" });
// };

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

export const getProjectRuns = async (projectIdentifier) => {
  try {
    const response = await pipes.get(`/api/projects/${projectIdentifier}/runs`);
    return response.data;
  } catch (error) {
    console.error(
      `Error getting project runs for ${projectIdentifier}:`,
      error,
    );
    throw error;
  }
};
