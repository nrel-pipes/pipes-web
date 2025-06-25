import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Create Project Form Store
export const useCreateProjectFormStore = create(
  persist(
    (set) => ({
      // Form data
      projectFormData: {},
      completedSteps: [],
      currentStep: 0,

      // Actions
      setProjectFormData: (data) => set({ projectFormData: data }),
      setCurrentStep: (step) => set({ currentStep: step }),
      addCompletedStep: (step) => set((state) => ({
        completedSteps: state.completedSteps.includes(step)
          ? state.completedSteps
          : [...state.completedSteps, step]
      })),
      resetCompletedSteps: () => set({ completedSteps: [] }),
      resetForm: () => set({
        projectFormData: {},
        currentStep: 0,
        completedSteps: []
      }),
    }),
    {
      name: 'pipes-create-project-form',
      partialize: (state) => ({
        projectFormData: state.projectFormData,
        completedSteps: state.completedSteps,
        currentStep: state.currentStep,
      }),
    }
  )
);

// Update Project Form Store
export const useUpdateProjectFormStore = create(
  persist(
    (set) => ({
      // Form data
      projectFormData: {},
      completedSteps: [],
      currentStep: 0,

      // Actions
      setProjectFormData: (data) => set({ projectFormData: data }),
      setCurrentStep: (step) => set({ currentStep: step }),
      addCompletedStep: (step) => set((state) => ({
        completedSteps: state.completedSteps.includes(step)
          ? state.completedSteps
          : [...state.completedSteps, step]
      })),
      resetCompletedSteps: () => set({ completedSteps: [] }),
      resetForm: () => set({
        projectFormData: {},
        currentStep: 0,
        completedSteps: []
      }),
    }),
    {
      name: 'pipes-update-project-form',
      partialize: (state) => ({
        projectFormData: state.projectFormData,
        completedSteps: state.completedSteps,
        currentStep: state.currentStep,
      }),
    }
  )
);
