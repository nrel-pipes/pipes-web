import { create } from "zustand";

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
      const pUrl = localStorage.getItem("REACT_APP_BASE_URL") + `api/projects/?${projectContext}`;
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
      }
    } catch (error) {
      console.log("Failed to fetch projects from the server.")
    }
  },
}));
