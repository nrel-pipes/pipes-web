import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import fetchData from '../utilities/FetchData';


const useProjectStore = create(
  persist((set) => ({
    isLoading: false,
    error: null,
    projects: [],
    currentProject: null,

    // All projects
    getAllProjects: async (accessToken) => {
      set({ isLoading: true, error: null});
      try {
        const data = await fetchData('/api/projects/basics', null, accessToken);
        set({projects: data, isLoading: false});
      } catch (error) {
        set({error: error, isLoading: false});
      }
    },

    // Single project
    getProject: (projectName, accessToken) => {
      const params = new URLSearchParams({project: projectName}).toString();
      const project = fetchData('/api/projects', params, accessToken);
      set({currentProject: project});
    }
  }),
  {
    name: 'ProjectStore',
    storage: createJSONStorage(() => localStorage)
  }
));

export default useProjectStore;
