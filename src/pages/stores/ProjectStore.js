import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import fetchData from '../utilities/FetchData';


const useProjectStore = create(
  persist((set) => ({
    isLoading: false,
    projects: [],
    gpbError: null,
    currentProject: null,
    gpError: null,

    // All projects
    getProjectBasics: async (accessToken) => {
      set({ isLoading: true, gpbError: null});
      try {
        const data = await fetchData('/api/projects/basics', null, accessToken);
        set({projects: data, isLoading: false});
      } catch (error) {
        set({gpbError: error, isLoading: false});
      }
    },

    // Single project
    getProject: async (projectName, accessToken) => {
      set({ isLoading: true, gpError: null});
      try {
        const params = new URLSearchParams({project: projectName});
        const data = await fetchData('/api/projects', params, accessToken);
        set({currentProject: data, isLoading: false});
      } catch (error) {
        set({gpError: error, isLoading: false});
      }
    }
  }),
  {
    name: 'ProjectStore',
    storage: createJSONStorage(() => localStorage)
  }
));

export default useProjectStore;
