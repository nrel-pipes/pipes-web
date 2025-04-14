import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Use the persist middleware to save store data in localStorage
const useProjectStore = create(
  persist(
    (set) => ({
      effectiveProject: null,
      setEffectiveProject: (project) => set({ effectiveProject: project }),
      clearEffectiveProject: () => set({ effectiveProject: null }),
    }),
    {
      name: 'pipes-effective-project', // Unique name for the storage key
      partialize: (state) => ({ effectiveProject: state.effectiveProject }), // Only persist the effectiveProject
    }
  )
);

export default useProjectStore;
