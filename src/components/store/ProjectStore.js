import { create } from "zustand";
import getUrl from "./OriginUrl";

export const useProjectStore = create((set) => ({
  project: {
    title: "",
    name: "",
    requirements: {},
    assumptions: [],
    scenarios: [],
    milestones: [],
  },
  reset: () => {
    set({
      project: {
        title: "",
        name: "",
        requirements: {},
        assumptions: [],
        scenarios: [],
        milestones: [],
      },
    });
  },
  fetch: async (projectName, setProjectExists, setServerError) => {
    try {
      const projectContext = new URLSearchParams({
        project: projectName,
      })
      const pUrl = getUrl(`api/projects?${projectContext}`);
      const response = await fetch(pUrl,{
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization:
            `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        set({project: data});
        setProjectExists(true);
        setServerError(false);
      } else {
        setProjectExists(false);
      }
    } catch (error) {
      setServerError(true);
      console.log("Failed to fetch projects from the server.")
    }
  },
}));
