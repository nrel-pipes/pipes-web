import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import fetchData from '../utilities/FetchData';



const useDataStore = create(
  persist((set) => ({

    // Project variables
    isGettingProjectBasics: false,
    projectBasics: [],
    projectBasicsGetError: null,
    selectedProjectName: null,
    isGettingProject: false,
    currentProject: null,
    projectGetError: null,

    // ProjectRun variables
    isGettingProjectRuns: false,
    projectRuns: [],
    projectRunsGetError: null,
    currentProjectRunName: null,
    currentProjectRun: null,

    // Model variables
    isGettingModels: false,
    models: [],
    modelsGetError: null,
    lastCheckIns: {},

    // ModelRun variables
    isGettingModelRuns: false,
    modelRuns: [],
    modelRunsGetError: null,

    // Handoff Variables
    isGettingHandoffs: false,
    handoffs: [],
    handoffsGetError: null,

    // All project basics
    getProjectBasics: async (accessToken) => {
      set({ isGettingProjectBasics: true, projectBasicsGetError: null});
      try {
        const data = await fetchData('/api/projects/basics', null, accessToken);
        set({projectBasics: data, isGettingProjectBasics: false});
      } catch (error) {
        set({projectBasicsGetError: error, isGettingProjectBasics: false});
      }
    },

    // Single project
    getProject: async (projectName, accessToken) => {
      set({ isGettingProject: true, projectGetError: null, selectedProjectName: projectName});
      try {
        const params = new URLSearchParams({project: projectName});
        const data = await fetchData('/api/projects', params, accessToken);
        set({currentProject: data, isGettingProject: false});

        // Clear other cached data
        set({projectRuns: [], projectRunsGetError: null, isGettingProjectRuns: false});
        set({currentProjectRun: null});
        set({models: [], modelsGetError: null, isGettingModels: false});
        set({modelRuns: [], modelRunsGetError: null, isGettingModelRuns: false});

      } catch (error) {
        set({projectGetError: error, isGettingProject: false});
      }
    },

    // All project runs under current project
    getProjectRuns: async (projectName, accessToken) => {
      set({ isGettingProjectRuns: true, projectRunsGetError: null});
      try {
        const params = new URLSearchParams({project: projectName});
        const data = await fetchData('/api/projectruns', params, accessToken);
        console.log("================================runsruns....");
        console.log(data);
        console.log("================================");
        set({projectRuns: data, isGettingProjectRuns: false});

        // Prune other cached data
        set({models: [], modelsGetError: null, isGettingModels: false});
        set({modelRuns: [], modelRunsGetError: null, isGettingModelRuns: false});

      } catch (error) {
        set({projectRuns: [], projectRunsGetError: error, isGettingProjectRuns: false});
      }
    },

    // Set current project run
    setCurrentProjectRunName: (projectRunName) => {
      set({ currentProjectRunName: projectRunName});
    },

    setCurrentProjectRun: (projectRun) => {
      set({ currentProjectRun: projectRun});
    },

    // All project runs under current project
    getModels: async (projectName, projectRunName, accessToken) => {
      set({ isGettingModels: true, modelsGetError: null});
      try {
        let params = new URLSearchParams({project: projectName, projectrun: projectRunName});
        if (!projectRunName || projectRunName === null) {
          params = new URLSearchParams({project: projectName});
        }
        const data = await fetchData('/api/models', params, accessToken);
        set({models: data, isGettingModels: false});

        // Prune other cached data
        set({modelRuns: [], modelRunsGetError: null, isGettingModelRuns: false});

      } catch (error) {
        set({models: [], modelsGetError: error, isGettingModels: false});
      }
    },

    // All model runs under current project
    getModelRuns: async (projectName, projectRunName, modelName, accessToken) => {
      set({ isGettingModelRuns: true, modelRunsGetError: null});
      try {
        let params = null;
        if (projectName !== null) {
          params = new URLSearchParams({project: projectName});
        } else if (projectRunName !== null) {
          params = new URLSearchParams({project: projectName, projectrun: projectRunName});
        } else if (modelName !== null) {
          params = new URLSearchParams({project: projectName, projectrun: projectRunName, model: modelName});
        }
        const data = await fetchData('/api/modelruns', params, accessToken);
        set({modelRuns: data, isGettingModelRuns: false});
      } catch (error) {
        set({modelRuns: [], modelRunsGetError: error, isGettingModelRuns: false});
      }
    },

    // All handoffs under current project
    getHandoffs: async (modelRuns, accessToken) => {
      set({ isGettingHandoffs: true, handoffsGetError: null });
      console.log("mruns, ", modelRuns)
      let handoffResults = {}; // To store the results
      
      try {
        // Iterate over each modelRun in the list
        for (const modelRun of modelRuns) {
          const { project, projectrun, model } = modelRun.context;
          const modelRunName = modelRun.name;
    
          // Create the query parameters
          const params = new URLSearchParams({
            project: project,
            projectrun: projectrun,
            model: model
          });
          
          // Fetch handoffs for the current modelRun
          const handoffData = await fetchData('/api/handoffs', params, accessToken);
          
          // If there are handoffs, add them to the handoffResults object
          if (handoffData && handoffData.length > 0) {
            handoffResults[modelRunName] = {
              project,
              projectrun,
              model,
              handoffs: handoffData
            };
          }
        }
    
        // Store the accumulated results in the state
        set({ handoffs: handoffResults, isGettingHandoffs: false });
      } catch (error) {
        set({ handoffs: {}, handoffsGetError: error, isGettingHandoffs: false });
      }
    },
        // New function to batch fetch all data
        batchFetchProjectData: async (projectName, accessToken) => {
          set({ 
            isGettingProject: true, 
            isGettingProjectRuns: true, 
            isGettingModels: true, 
            isGettingModelRuns: true, 
            isGettingHandoffs: true 
          });
    
          try {
            const projectParams = new URLSearchParams({project: projectName});
            const [project, projectRuns, models, modelRuns] = await Promise.all([
              fetchData('/api/projects', projectParams, accessToken),
              fetchData('/api/projectruns', projectParams, accessToken),
              fetchData('/api/models', projectParams, accessToken),
              fetchData('/api/modelruns', projectParams, accessToken)
            ]);
    
            // Fetch handoffs after modelRuns are available
            const handoffResults = {};
            for (const modelRun of modelRuns) {
              const { project, projectrun, model } = modelRun.context;
              const params = new URLSearchParams({ project, projectrun, model });
              const handoffData = await fetchData('/api/handoffs', params, accessToken);
              if (handoffData && handoffData.length > 0) {
                handoffResults[modelRun.name] = { project, projectrun, model, handoffs: handoffData };
              }
            }
    
            // Batch update all state
            set({
              currentProject: project,
              projectRuns,
              models,
              modelRuns,
              handoffs: handoffResults,
              isGettingProject: false,
              isGettingProjectRuns: false,
              isGettingModels: false,
              isGettingModelRuns: false,
              isGettingHandoffs: false,
              selectedProjectName: projectName,
              projectGetError: null,
              projectRunsGetError: null,
              modelsGetError: null,
              modelRunsGetError: null,
              handoffsGetError: null
            });
          } catch (error) {
            set({
              isGettingProject: false,
              isGettingProjectRuns: false,
              isGettingModels: false,
              isGettingModelRuns: false,
              isGettingHandoffs: false,
              projectGetError: error,
              projectRunsGetError: error,
              modelsGetError: error,
              modelRunsGetError: error,
              handoffsGetError: error
            });
          }
        },
    

        
  }),

  {
    name: 'DataStore',
    storage: createJSONStorage(() => localStorage)
  }
));

export default useDataStore;
