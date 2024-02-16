//External imports
import { create } from "zustand";

// Internal imports
import { pipesClient, requestMetadata } from "./ClientSetup";
import { ProjectContext } from "../../_proto/types_pb.js";
import { GetProjectScheduleRequest } from "../../_proto/api_pb.js";

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
        start: state.project.start,
        end: state.project.end,
        milestones: data,
      },
    }));
  },

  fetch: (projectName) => {
    let context = new ProjectContext();
    context.setProjectName(projectName);
    let request = new GetProjectScheduleRequest();
    request.setProjectContext(context);

    pipesClient.getProjectSchedule(request, requestMetadata, (_, response) => {
      if (
        response.getCode() !== "NOT_FOUND" &&
        response.getCode() !== "INVALID_ARGUMENT" &&
        response.getCode() !== "VALUE_ERROR" &&
        response.getCode() !== "UNKNOWN"
      ) {
        let data = JSON.parse(response.getProjectSchedule());

        for (let i = 0; i < data.project_runs.length; i++) {
          let pr = data.project_runs[i];
          let models = pr.models;
          models.sort((a, b) => {
            let adate = new Date(a.start + "T00:00:00");
            let bdate = new Date(b.start + "T00:00:00");
            return adate === bdate ? 0 : adate > bdate ? 1 : -1;
          });
        }
        data.project_runs.sort((a, b) => {
          let adate = new Date(a.start + "T00:00:00");
          let bdate = new Date(b.start + "T00:00:00");
          return adate === bdate ? 0 : adate > bdate ? 1 : -1;
        });

        set({
          project: {
            start: data.project.start,
            end: data.project.end,
            milestones: [],
          },
          project_runs: data.project_runs,
        });
      }
    });
  },
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
