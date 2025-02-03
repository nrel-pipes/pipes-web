import pipes from "./AxiosInstance";

export const getProjectBasics = async () => {
  const response = await pipes.get("/api/projects/basics");
  return response.data;
};

export const getProject = async ({ name, token }) => {
  try {
    const response = await pipes.get(`api/projects`, {
      params: {
        project: name,
      },
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error getting project:", error);
    if (error.response) {
      console.error("Error status:", error.response.status);
      console.error("Error data:", error.response.data);
    }
    throw error;
  }
};

export const postProject = async ({ data, token }) => {
  try {
    const response = await pipes.post("api/projects", data, {
      // Remove JSON.stringify
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error posting project:", error);
    if (error.response) {
      console.error("Error status:", error.response.status);
      console.error("Error data:", error.response.data);
    }
    throw error;
  }
};
