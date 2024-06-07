import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import fetchData from '../utilities/FetchData';


const useModelRunStore = create(
  persist((set) => ({
    isGettingModelRuns: false,
    modelRuns: [],
    modelRunsGetError: null,

    // All project runs under current project
    getModelRuns: async (projectName, projectRunName, modelName, accessToken) => {
      set({ isGettingModelRuns: true, modelRunsGetError: null});
      try {
        const params = new URLSearchParams({project: projectName, projectrun: projectRunName, model: modelName});
        const data = await fetchData('/api/modelruns', params, accessToken);
        console.log("modelruns ==== ", data)
        set({modelRuns: data, isGettingModelRuns: false});
      } catch (error) {
        set({modelRuns: [], modelRunsGetError: error, isGettingModelRuns: false});
      }
    },

  }),
  {
    name: 'ModelRunStore',
    storage: createJSONStorage(() => localStorage)
  }
));

export default useModelRunStore;
