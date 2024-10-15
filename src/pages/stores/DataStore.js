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

  }),
  {
    name: 'DataStore',
    storage: createJSONStorage(() => localStorage)
  }
));

export default useDataStore;
