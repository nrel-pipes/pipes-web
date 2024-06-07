import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import fetchData from '../utilities/FetchData';


const useProjectStore = create(
  persist((set) => ({
    isGettingProjectBasics: false,
    projectBasics: [],
    projectBasicsGetError: null,

    isGettingProject: false,
    currentProject: null,
    projectGetError: null,

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
      set({ isGettingProject: true, projectGetError: null});
      try {
        const params = new URLSearchParams({project: projectName});
        const data = await fetchData('/api/projects', params, accessToken);
        set({currentProject: data, isGettingProject: false});
      } catch (error) {
        set({projectGetError: error, isGettingProject: false});
      }
    }
  }),
  {
    name: 'ProjectStore',
    storage: createJSONStorage(() => localStorage)
  }
));

export default useProjectStore;
