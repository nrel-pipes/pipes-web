import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import fetchData from '../utilities/FetchData';


const useModelStore = create(
  persist((set) => ({
    isGettingModels: false,
    models: [],
    modelsGetError: null,
    lastCheckIns: {},

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
      } catch (error) {
        set({models: [], modelsGetError: error, isGettingModels: false});
      }
    },

  }),
  {
    name: 'ModelStore',
    storage: createJSONStorage(() => localStorage)
  }
));

export default useModelStore;
