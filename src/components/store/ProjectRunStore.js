import { create } from "zustand";
// import { pipesClient, requestMetadata } from "./ClientSetup";
// import { ProjectContext } from "../../_proto/types_pb.js";
// import { ListProjectRunsRequest } from "../../_proto/api_pb.js";
import { modelNodeColors } from "./store";
import getUrl from "./OriginUrl";


export const useProjectRunStore = create((set) => ({
  runs: [],
  currentProjectRun: "",
  reset: () => {
    set({ currentProjectRun: "", runs: [] });
  },
  setCurrentProjectRun: (runName) => {
    set({ currentProjectRun: runName });
  },
  fetch: async (projectName) => {

    // Fetch project run
    const projectContext = new URLSearchParams({project: projectName});
    const prUrl = getUrl(`api/projectruns/?${projectContext}`);
    const response = await fetch(prUrl, {
      headers: {
        accept: "application/json",
        Authorization:
          `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    const data = await response.json();
    data.sort((a, b) => {
      let adate = new Date(a.scheduled_start);
      let bdate = new Date(b.scheduled_end);
      return adate === bdate ? 0 : adate > bdate ? 1 : -1;
    });

    // Fetch models under project run
    const mUrl= getUrl(`api/models/?${projectContext}`);
    const mResponse = await fetch(mUrl, {
      headers: {
        accept: "application/json",
        Authorization:
          `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    const mData = await mResponse.json();

    const modelNames = new Set(
      mData.map((model) => {
        return model.name;
      })
    )

    // const modelNames = new Set(
    //   data.map((run) => {
    //     const projectRunContext = new URLSearchParams({
    //       project: projectName,
    //       projectrun: run.name
    //     })
    //     const mUrl= getUrl(`api/models/?${projectRunContext}`);
    //     fetch(mUrl, {
    //       headers: {
    //         accept: "application/json",
    //         Authorization:
    //           `Bearer ${localStorage.getItem("accessToken")}`,
    //       },
    //     }).then((response) => response.json()).then((models) => {
    //       return models.map((model) => model.model_name)
    //     });
    //   })
    //   .flat()
    // );

    modelNodeColors.domain(modelNames);
    set({ runs: data });
    set({ currentProjectRun: data[0].name });

  },
}));
