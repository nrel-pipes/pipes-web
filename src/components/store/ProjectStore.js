import { create } from "zustand";
import origin from "./OriginSetup";

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
      const pUrl = new URL(`api/projects/?${projectContext}`, origin).href;
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
