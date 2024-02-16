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
    console.log("http://0.0.0.0:8080/api/overview_dropdowns?project=${projectName}");
      fetch("http://0.0.0.0:8080/api/overview_dropdowns?project=${projectName}")
      .then(response => {
        if (response.status === 200) {
          response.json().then(data => {
            set({project: data});
            document.getElementById("c2c-tab-overview").click();
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
