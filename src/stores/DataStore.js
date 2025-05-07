import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Use the persist middleware to save store data in localStorage
const useDataStore = create(
  persist(
    (set) => ({
      effectivePname: null,
      effectivePRname: null,
      // Add functions to manage the effective project
      setEffectivePname: (pName) => set({ effectivePname: pName }),
      clearEffectivePname: () => set({ effectivePname: null }),
      // Add functions to manage the effective project run
      setEffectivePRname: (prName) => set({ effectivePRname: prName }),
      clearEffectivePRname: () => set({ effectivePRname: null }),
    }),
    {
      name: 'Pipes.Data.State',
      partialize: (state) => ({
        effectivePname: state.effectivePname,
        effectivePRname: state.effectivePRname,
      }),
    }
  )
);

export default useDataStore;
