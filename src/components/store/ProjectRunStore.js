import { create } from "zustand";
// import { pipesClient, requestMetadata } from "./ClientSetup";
// import { ProjectContext } from "../../_proto/types_pb.js";
// import { ListProjectRunsRequest } from "../../_proto/api_pb.js";
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
    // let context = new ProjectContext();
    // context.setProjectName(projectName);
    // let request = new ListProjectRunsRequest();
    // console.log("Request: " + request);
    // request.setProjectContext(context);

    const projectContext = new URLSearchParams({project: projectName});
    const prUrl = localStorage.getItem("REACT_APP_BASE_URL") + `api/projectruns/?${projectContext}`;
    fetch(prUrl, {
      headers: {
        accept: "application/json",
        Authorization:
          `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }).then((response) => response.json())
    .then((data) => {
      data.sort((a, b) => {
        let adate = new Date(a.scheduled_start);
        let bdate = new Date(b.scheduled_end);
        return adate === bdate ? 0 : adate > bdate ? 1 : -1;
      });

      // DELTE later
      return;

      const modelNames = new Set(
        data
          .map((run) => {
            const projectRunContext = new URLSearchParams({
              project: projectName,
              projectrun: run.name
            })
            const mUrl= localStorage.getItem("REACT_APP_BASE_URL") + `api/models/?${projectRunContext}`;
            fetch(mUrl, {
              headers: {
                accept: "application/json",
                Authorization:
                  `Bearer ${localStorage.getItem("accessToken")}`,
              },
            }).then((response) => response.json()).then((models) => {
              //console.log(data);
              // console.log(models);
              return models.map((model) => model.model_name)
            });
            // return [...run.models.map((model) => model.model_name)];
          })
          .flat()
      );
      modelNodeColors.domain(modelNames);
      set({ runs: data });
      set({ currentProjectRun: data[0].name });
    }).catch((error) => console.log(error));
  },
}));
