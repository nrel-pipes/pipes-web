import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Use the persist middleware to save store data in localStorage
const useDataStore = create(
  persist(
    (set) => ({
      effectivePname: null,
      // Add functions to manage the effective project
      setEffectivePname: (pName) => set({ effectivePname: pName }),
    }),
    {
      name: 'Pipes.Data.Store',
      partialize: (state) => ({
        effectivePname: state.effectivePname
      }),
    }
  )
);

export default useDataStore;
