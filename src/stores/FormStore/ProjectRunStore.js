import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialFormData = {
  name: "",
  description: "",
  assumptions: [""],
  requirements: {},
  scenarios: [""],
  scheduledStart: "",
  scheduledEnd: "",
};

const initialState = {
  formData: initialFormData,
  projectName: null, // Track which project this form data belongs to
  isDirty: false,
};

export const useCreateProjectRunFormStore = create(
  persist(
    (set, get) => ({
      ...initialState,

      // Update form data
      updateFormData: (newData) => set((state) => ({
        formData: { ...state.formData, ...newData },
        isDirty: true,
      })),

      // Update specific field
      updateField: (fieldName, value) => set((state) => ({
        formData: { ...state.formData, [fieldName]: value },
        isDirty: true,
      })),

      // Set project name (used to track if we need to clear data on project change)
      setProjectName: (projectName) => {
        const currentProjectName = get().projectName;

        // If project changed and we have existing data, clear it
        if (currentProjectName && currentProjectName !== projectName) {
          set({
            ...initialState,
            projectName,
          });
        } else {
          set({ projectName });
        }
      },

      // Clear all form data
      clearFormData: () => set({
        ...initialState,
      }),

      // Reset to initial state but keep project name
      resetForm: () => set((state) => ({
        formData: initialFormData,
        projectName: state.projectName,
        isDirty: false,
      })),

      // Check if form has data
      hasFormData: () => {
        const { formData } = get();
        return (
          formData.name.trim() !== "" ||
          formData.description.trim() !== "" ||
          formData.assumptions.some(assumption => assumption.trim() !== "") ||
          Object.keys(formData.requirements).length > 0 ||
          formData.scenarios.some(scenario => scenario.trim() !== "") ||
          formData.scheduledStart !== "" ||
          formData.scheduledEnd !== ""
        );
      },

      // Get form data for submission (cleaned)
      getSubmissionData: () => {
        const { formData } = get();
        return {
          ...formData,
          assumptions: formData.assumptions.filter(assumption => assumption.trim() !== ""),
          scenarios: formData.scenarios.filter(scenario => scenario.trim() !== ""),
        };
      },
    }),
    {
      name: 'create-project-run-form-storage',
      version: 1,
      // Only persist form data and project name, not isDirty
      partialize: (state) => ({
        formData: state.formData,
        projectName: state.projectName,
      }),
      // Merge persisted state with initial state
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...persistedState,
        isDirty: false, // Reset isDirty on load
      }),
    }
  )
);

// Hook to automatically clear form when effective project changes
export const useProjectRunFormSync = () => {
  const { setProjectName, clearFormData } = useCreateProjectRunFormStore();

  return {
    syncWithProject: (effectivePname) => {
      if (effectivePname) {
        setProjectName(effectivePname);
      } else {
        clearFormData();
      }
    },
  };
};
