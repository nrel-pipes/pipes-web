import { create } from "zustand";
import { pipesClient, requestMetadata } from "./ClientSetup";
import { ProjectContext } from "../../_proto/types_pb.js";
import { ListProjectRunsRequest } from "../../_proto/api_pb.js";
import { modelNodeColors } from "./store";

export const useProjectRunStore = create((set) => ({
  runs: [],
  currentProjectRun: "",
  reset: () => {
    set({ currentProjectRun: "", runs: [] });
  },
  setCurrentProjectRun: (runName) => {
    set({ currentProjectRun: runName });
  },
  fetch: (projectName) => {
    let context = new ProjectContext();
    context.setProjectName(projectName);
    let request = new ListProjectRunsRequest();

    request.setProjectContext(context);
    pipesClient.listProjectRuns(request, requestMetadata, (_, response) => {
      if (
        response.getCode() !== "NOT_FOUND" &&
        response.getCode() !== "INVALID_ARGUMENT" &&
        response.getCode() !== "VALUE_ERROR" &&
        response.getCode() !== "UNKNOWN"
      ) {
        let data = JSON.parse(response.getProjectRuns());
        console.log(data);
        data.sort((a, b) => {
          let adate = new Date(a.schedule.start + "T00:00:00");
          let bdate = new Date(b.schedule.start + "T00:00:00");
          return adate === bdate ? 0 : adate > bdate ? 1 : -1;
        });
        const modelNames = new Set(
          data
            .map((run) => {
              return [...run.models.map((model) => model.model_name)];
            })
            .flat()
        );
        modelNodeColors.domain(modelNames);

        set({ runs: data });
        set({ currentProjectRun: data[0].name });
      } else {
        console.log(response);
      }
    });
  },
}));
