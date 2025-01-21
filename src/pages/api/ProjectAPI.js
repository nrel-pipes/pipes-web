import pipes from './AxiosInstance';


export const getProjectBasics = async() => {
  const response = await pipes.get("/api/projects/basics");
  return response.data;
}
