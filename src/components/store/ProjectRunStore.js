import { create } from "zustand";
// import { pipesClient, requestMetadata } from "./ClientSetup";
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
    console.log("Request: " + request);
    request.setProjectContext(context);

    fetch(localStorage.getItem("REACT_APP_BASE_URL") + "api/projectruns/?project=" + projectName, {
      headers: {
        accept: "application/json",
        Authorization:
          `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }).then((response) => response.json())
    .then((data) => {
      console.log(data);
      data.sort((a, b) => {
        let adate = new Date(a.scheduled_start);
        let bdate = new Date(b.scheduled_end);
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
      console.log(data);
      set({ runs: data });
      set({ currentProjectRun: data[0].name });
      console.log(modelNames);
    }).catch((error) => console.log(error));
  },
}));
