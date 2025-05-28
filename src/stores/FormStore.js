import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Default form values
const defaultFormValues = {
  name: "",
  description: "",
  scheduled_start: "",
  scheduled_end: "",
  assumptions: [""],
  milestones: [],
  owner: {
    email: "",
    first_name: "",
    last_name: "",
    organization: ""
  },
  scenarios: [],
  requirements: {
    keys: [],
    values: []
  },
  sensitivities: []
};

const useFormStore = create(
  persist(
    (set) => ({
      // Form data for CreateProjectPage
      projectFormData: { ...defaultFormValues },
      completedSteps: [],
      currentStep: 0,

      // Set the entire form data
      setProjectFormData: (data) => set({ projectFormData: data }),

      // Update specific fields in the form data
      updateFormField: (fieldPath, value) =>
        set((state) => {
          // Deep clone the current data
          const newData = JSON.parse(JSON.stringify(state.projectFormData));

          // Handle nested paths like "owner.first_name"
          const parts = fieldPath.split('.');
          let current = newData;

          // Navigate to the parent object of the field to update
          for (let i = 0; i < parts.length - 1; i++) {
            if (!current[parts[i]]) {
              current[parts[i]] = {};
            }
            current = current[parts[i]];
          }

          // Update the field
          current[parts[parts.length - 1]] = value;

          return { projectFormData: newData };
        }),

      // Set current step
      setCurrentStep: (step) => set({ currentStep: step }),

      // Update completed steps
      setCompletedSteps: (steps) => set({ completedSteps: steps }),

      // Add a step to completed steps
      addCompletedStep: (step) =>
        set((state) => ({
          completedSteps: state.completedSteps.includes(step)
            ? state.completedSteps
            : [...state.completedSteps, step]
        })),

      // Reset the form data and state (to be used after successful submission)
      resetForm: () => set({
        projectFormData: { ...defaultFormValues },
        currentStep: 0,
        completedSteps: []
      }),
    }),
    {
      name: "project-form-storage", // Name for localStorage key
      partialize: (state) => ({
        projectFormData: state.projectFormData,
        currentStep: state.currentStep,
        completedSteps: state.completedSteps,
      }),
    }
  )
);

export default useFormStore;
