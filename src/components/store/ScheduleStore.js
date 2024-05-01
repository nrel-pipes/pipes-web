//External imports
import { create } from "zustand";
import getUrl from "./OriginUrl";


export const useScheduleStore = create((set, get) => ({
  project: { start: "", end: "", milestones: [] },
  project_runs: [{ name: "", start: "", end: "", models: [], handoffs: [] }],
  tasks: [],
  numWarnings: 0,
  reset: () => {
    set({
      project: { start: "", end: "", milestones: [] },
      project_runs: [
        { name: "", start: "", end: "", models: [], handoffs: [] },
      ],
      tasks: [],
      numWarnings: 0,
    });
  },
  setNumWarnings: (num) => {
    const numWarnings = get().numWarnings;
    if (num !== numWarnings) {
      set({ numWarnings: num });
    }
  },
  setMilestones: (data) => {
    set((state) => ({
      project: {
        start: state.project.scheduled_start,
        end: state.project.scheduled_end,
        milestones: data,
      },
    }));
  },

  fetch: async (projectName) => {

    // Fetch Project
    const projectContext = new URLSearchParams({
      project: projectName,
    })
    const pUrl = getUrl(`api/projects/?${projectContext}`);
    const pResponse = await fetch(pUrl,{
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    const pData = await pResponse.json();

    // Fetch project runs
    const prUrl = getUrl(`api/projectruns/?${projectContext}`);
    const prResponse = await fetch(prUrl, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    const prData = await prResponse.json();

    // TODO: old gRPC API data sort models within project runs
    // for (let i = 0; i < prData.length; i++) {
    //   let pr = prData[i];
    //   let models = pr.models;
    //   models.sort((a, b) => {
    //     let adate = new Date(a.start + "T00:00:00");
    //     let bdate = new Date(b.start + "T00:00:00");
    //     return adate === bdate ? 0 : adate > bdate ? 1 : -1;
    //   });
    // }
    prData.sort((a, b) => {
      let adate = new Date(a.scheduled_start + "T00:00:00");
      let bdate = new Date(b.scheduled_start + "T00:00:00");
      return adate === bdate ? 0 : adate > bdate ? 1 : -1;
    });

    set({
      project: {
        start: pData.scheduled_start,
        end: pData.scheduled_end,
        milestones: [],
      },
      project_runs: prData,
    });
  }
}));


export const useScheduleStoreV1 = create((set) => ({
  project: {
    start: new Date(2022, 10, 1),
    end: new Date(2023, 6, 1),
    progress: 50,
  },
  project_runs: [
    {
      name: "1",
      start: new Date(2022, 9, 27),
      end: new Date(2022, 10, 15),
      models: [
        {
          id: "dsgrid",
          start: "2022-09-28",
          end: "2022-10-05",
          tasks: [{ id: "", start: "", end: "" }],
        },
        {
          id: "rpm",
          start: "2022-10-05",
          end: "2022-10-15",
          tasks: [{ id: "", start: "", end: "" }],
        },
      ],
      handoffs: [
        { id: "handoff_id1", start: "", end: "2023-06-30" },
        { id: "handoff_id2", start: "", end: "2023-07-10" },
      ],
    },
    {
      name: "2",
      start: "2022-10-20",
      end: "2023-01-01",
      models: [
        {
          id: "dsgrid",
          start: "2022-10-20",
          end: "2022-11-15",
          tasks: [{ id: "", start: "", end: "" }],
        },
        {
          id: "dgen",
          start: "2022-11-15",
          end: "2022-11-30",
          tasks: [{ id: "", start: "", end: "" }],
        },
        {
          id: "rpm",
          start: "2022-11-30",
          end: "2023-01-01",
          tasks: [{ id: "", start: "", end: "" }],
        },
      ],
      handoffs: [
        { id: "handoff_id3", start: "", end: "2023-05-20" },
        { id: "handoff_id4", start: "", end: "2023-05-21" },
        { id: "handoff_id5", start: "", end: "2023-09-30" },
      ],
    },
  ],
  milestones: [
    {
      name: "Milestone 1",
      description: "First test project milestone",
      end: new Date(2022, 11, 1),
    },
  ],
  tasks: [
    {
      start: new Date(2022, 10, 1),
      end: new Date(2023, 1, 15),
      name: "Residential",
      type: "Building Loads",
      id: "Residential",
      progress: 100,
    },
    {
      start: new Date(2022, 10, 1),
      end: new Date(2023, 1, 15),
      name: "Commercial",
      type: "Building Loads",
      id: "Commerical",
      progress: 100,
    },
    {
      start: new Date(2022, 12, 15),
      end: new Date(2023, 2, 15),
      name: "dsgrid",
      type: "dsgrid",
      id: "dsgrid",
      progress: 100,
      dependencies: ["Residential", "Commerical"],
    },
    {
      start: new Date(2023, 1, 15),
      end: new Date(2023, 3, 15),
      name: "dgen",
      type: "Distributed Generation",
      id: "dgen",
      progress: 57,
      dependencies: ["dsgrid"],
    },
    {
      start: new Date(2023, 3, 15),
      end: new Date(2023, 5, 15),
      name: "rpm",
      type: "Capacity Expansion",
      id: "rpm",
      progress: 48,
      dependencies: ["dgen"],
    },
  ],
}));
