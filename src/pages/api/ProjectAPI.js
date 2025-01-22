import pipes from "./AxiosInstance";

export const getProjectBasics = async () => {
  const response = await pipes.get("/api/projects/basics");
  return response.data;
};

export const postProject = async (data) => {
  const response = await pipes.post("api/projects", data);
  return response.data;
};
