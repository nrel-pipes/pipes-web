import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useFormStore = create(
  persist(
    (set) => ({
      // Project form data
      projectFormData: null,
      setProjectFormData: (data) => set({ projectFormData: data }),

      // Step navigation
      currentStep: 0,
      setCurrentStep: (step) => set({ currentStep: step }),

      // Completed steps
      completedSteps: [],
      addCompletedStep: (step) =>
        set((state) => ({
          completedSteps: state.completedSteps.includes(step)
            ? state.completedSteps
            : [...state.completedSteps, step]
        })),

      // Add this new function to reset completed steps
      resetCompletedSteps: () => set({ completedSteps: [] }),
    }),
    {
      name: 'pipes-form-storage',
    }
  )
);

export default useFormStore;
