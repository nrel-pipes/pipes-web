import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import fetchData from '../utilities/FetchData';


const useProjectRunStore = create(
  persist((set) => ({
    isGettingProjectRuns: false,
    projectRuns: [],
    projectRunsGetError: null,

    currentProjectRunName: null,
    currentProjectRun: null,

    // All project runs under current project
    getProjectRuns: async (projectName, accessToken) => {
      set({ isGettingProjectRuns: true, projectRunsGetError: null});
      try {
        const params = new URLSearchParams({project: projectName});
        const data = await fetchData('/api/projectruns', params, accessToken);
        set({projectRuns: data, isGettingProjectRuns: false});
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
    }

  }),
  {
    name: 'ProjectRunStore',
    storage: createJSONStorage(() => localStorage)
  }
));

export default useProjectRunStore;
