import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import fetchData from '../utilities/FetchData';


const useDataStore = create(
  persist(
    (set, get) => ({
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
      projectRunRetries: 0,

      // Project handoffs between models
      isGettingHandoffs: false,
      handoffs: [],
      handoffsGetError: null,

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
        set({ isGettingProjectBasics: true, projectBasicsGetError: null });
        try {
          const data = await fetchData(
            "/api/projects/basics",
            null,
            accessToken,
          );
          set({ projectBasics: data, isGettingProjectBasics: false });
        } catch (error) {
          set({ projectBasicsGetError: error, isGettingProjectBasics: false });
        }
      },

      // Single project
      getProject: async (projectName, accessToken) => {
        set({
          isGettingProject: true,
          projectGetError: null,
          selectedProjectName: projectName,
          projectRunRetries: 0,
        });
        try {
          const params = new URLSearchParams({ project: projectName });
          const data = await fetchData("/api/projects", params, accessToken);
          set({ currentProject: data, isGettingProject: false });

          // Clear other cached data
          set({
            projectRuns: [],
            projectRunsGetError: null,
            isGettingProjectRuns: false,
          });
          set({ currentProjectRun: null });
          set({ models: [], modelsGetError: null, isGettingModels: false });
          set({
            modelRuns: [],
            modelRunsGetError: null,
            isGettingModelRuns: false,
          });
        } catch (error) {
          set({ projectGetError: error, isGettingProject: false });
        }
      },

      // All project runs under current project
      getProjectRuns: async (projectName, accessToken) => {
        const currentRetries = get().projectRunRetries;
        set({
          isGettingProjectRuns: true,
          projectRunsGetError: null,
          projectRunRetries: currentRetries + 1,
        });
        try {
          const params = new URLSearchParams({ project: projectName });
          const data = await fetchData("/api/projectruns", params, accessToken);
          set({ projectRuns: data, isGettingProjectRuns: false });

          // Prune other cached data
          set({ models: [], modelsGetError: null, isGettingModels: false });
          set({
            modelRuns: [],
            modelRunsGetError: null,
            isGettingModelRuns: false,
          });
        } catch (error) {
          set({
            projectRuns: [],
            projectRunsGetError: error,
            isGettingProjectRuns: false,
          });
        }
      },
      // Set current project run
      setCurrentProjectRunName: (projectRunName) => {
        set({ currentProjectRunName: projectRunName });
      },

      setCurrentProjectRun: (projectRun) => {
        set({ currentProjectRun: projectRun });
      },

      // Get Handoffs
      getHandoffs: async (projectName, projectRunName, accessToken) => {
        set({ isGettingHandoffs: true, handoffsGetError: null });
        try {
          let params = new URLSearchParams({
            project: projectName,
            projectrun: projectRunName,
          });
          if (!projectRunName || projectRunName === null) {
            params = new URLSearchParams({ project: projectName });
          }
          const data = await fetchData("/api/handoffs", params, accessToken);
          set({ handoffs: data, isGettingHandoffs: false });
        } catch (error) {
          set({
            handoffs: [],
            handoffsGetError: error,
            isGettingHandoffs: false,
          });
        }
      },

      // All project runs under current project
      getModels: async (projectName, projectRunName, accessToken) => {
        set({ isGettingModels: true, modelsGetError: null });
        try {
          let params = new URLSearchParams({
            project: projectName,
            projectrun: projectRunName,
          });
          if (!projectRunName || projectRunName === null) {
            params = new URLSearchParams({ project: projectName });
          }
          const data = await fetchData("/api/models", params, accessToken);
          set({ models: data, isGettingModels: false });

          // Prune other cached data
          set({
            modelRuns: [],
            modelRunsGetError: null,
            isGettingModelRuns: false,
          });
        } catch (error) {
          set({ models: [], modelsGetError: error, isGettingModels: false });
        }
      },

      // All model runs under current project
      getModelRuns: async (
        projectName,
        projectRunName,
        modelName,
        accessToken,
      ) => {
        set({ isGettingModelRuns: true, modelRunsGetError: null });
        try {
          let params = null;
          if (projectName !== null) {
            params = new URLSearchParams({ project: projectName });
          } else if (projectRunName !== null) {
            params = new URLSearchParams({
              project: projectName,
              projectrun: projectRunName,
            });
          } else if (modelName !== null) {
            params = new URLSearchParams({
              project: projectName,
              projectrun: projectRunName,
              model: modelName,
            });
          }
          const data = await fetchData("/api/modelruns", params, accessToken);
          set({ modelRuns: data, isGettingModelRuns: false });
        } catch (error) {
          set({
            modelRuns: [],
            modelRunsGetError: error,
            isGettingModelRuns: false,
          });
        }
      },
      createProject: async (projectData, accessToken) => {
        set({ isCreatingProject: true, createProjectError: null });
        try {
          // Change to be actual API...
          const response = await fetch("http://localhost:8080/api/projects", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(projectData),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();

          set((state) => ({
            projectBasics: [...state.projectBasics, data],
            isCreatingProject: false,
          }));
        } catch (error) {
          set({
            createProjectError: error,
            isCreatingProject: false,
          });
          console.error(error.message.toString());
          throw error;
        }
      },

      createProjectRun: async (projectName, projectRunData, accessToken) => {
        set({ isCreatingProjectRun: true, projectRunCreateError: null });

        try {
          // Encode project name properly
          const encodedProjectName = encodeURIComponent(projectName);

          // Make POST request to create the project run
          const response = await fetch(
            `http://localhost:8080/api/projectruns?project=${encodedProjectName}`,
            {
              method: "POST",
              headers: {
                accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify({
                name: projectRunData.name,
                description: projectRunData.description || "",
                assumptions: projectRunData.assumptions || [],
                requirements: projectRunData.requirements || {},
                scenarios: projectRunData.scenarios || [],
                scheduled_start: projectRunData.scheduledStart,
                scheduled_end: projectRunData.scheduledEnd,
              }),
            },
          );

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(
              `Failed to create project run: ${errorText} (Status ${response.status})`,
            );
          }

          const data = await response.json();

          set((state) => ({
            currentProjectRun: data,
            currentProjectRunName: data.name,
            projectRuns: [...state.projectRuns, data],
            isCreatingProjectRun: false,
          }));

          return data;
        } catch (error) {
          set({
            projectRunCreateError: error.message,
            isCreatingProjectRun: false,
          });
          throw error;
        }
      },
    }),
    {
      name: "DataStore",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useDataStore;
