import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useFormStore = create(
  persist(
    (set, get) => ({
      // Create project form data
      createProjectFormData: {},
      createCompletedSteps: [],
      createCurrentStep: 0,

      // Update project form data
      updateProjectFormData: {},
      updateCompletedSteps: [],
      updateCurrentStep: 0,

      // Create project actions
      setCreateProjectFormData: (data) => set({ createProjectFormData: data }),
      setCreateCurrentStep: (step) => set({ createCurrentStep: step }),
      addCreateCompletedStep: (step) => set((state) => ({
        createCompletedSteps: state.createCompletedSteps.includes(step)
          ? state.createCompletedSteps
          : [...state.createCompletedSteps, step]
      })),
      resetCreateCompletedSteps: () => set({ createCompletedSteps: [] }),
      resetCreateForm: () => set({
        createProjectFormData: {},
        createCurrentStep: 0,
        createCompletedSteps: []
      }),

      // Update project actions
      setUpdateProjectFormData: (data) => set({ updateProjectFormData: data }),
      setUpdateCurrentStep: (step) => set({ updateCurrentStep: step }),
      addUpdateCompletedStep: (step) => set((state) => ({
        updateCompletedSteps: state.updateCompletedSteps.includes(step)
          ? state.updateCompletedSteps
          : [...state.updateCompletedSteps, step]
      })),
      resetUpdateCompletedSteps: () => set({ updateCompletedSteps: [] }),
      resetUpdateForm: () => set({
        updateProjectFormData: {},
        updateCurrentStep: 0,
        updateCompletedSteps: []
      }),

      // Legacy support - map to create project for backward compatibility
      get projectFormData() { return get().createProjectFormData; },
      get completedSteps() { return get().createCompletedSteps; },
      get currentStep() { return get().createCurrentStep; },
      setProjectFormData: (data) => get().setCreateProjectFormData(data),
      setCurrentStep: (step) => get().setCreateCurrentStep(step),
      addCompletedStep: (step) => get().addCreateCompletedStep(step),
      resetCompletedSteps: () => get().resetCreateCompletedSteps(),
    }),
    {
      name: 'pipes-form-storage',
      partialize: (state) => ({
        createProjectFormData: state.createProjectFormData,
        createCompletedSteps: state.createCompletedSteps,
        createCurrentStep: state.createCurrentStep,
        updateProjectFormData: state.updateProjectFormData,
        updateCompletedSteps: state.updateCompletedSteps,
        updateCurrentStep: state.updateCurrentStep,
      }),
    }
  )
);

export default useFormStore;
