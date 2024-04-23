import { create } from "zustand";

export const useProjectStore = create((set) => ({
  project: {
    full_name: "",
    name: "",
    requirements: {},
    assumptions: [],
    scenarios: [],
    milestones: [],
  },
  reset: () => {
    set({
      project: {
        full_name: "",
        name: "",
        requirements: {},
        assumptions: [],
        scenarios: [],
        milestones: [],
      },
    });
  },
  fetch: (projectName, setProjectExists, setServerError) => {
      fetch(`${localStorage.getItem("REACT_APP_BASE_URL")}api/projects/?project=${projectName}`,{
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization:
            `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then(response => {
        if (response.status === 200) {
          response.json().then(data => {
            console.log("--------------------------------");
            console.log(data);
            set({project: data});
            // document.getElementById("c2c-tab-overview").click();
          })
        } else if (response.getDetails().includes("closed")) {
            setServerError(true);
        } else {
          setProjectExists(false);
        }
      })
      .catch(error => console.log(error))
  },
}));
