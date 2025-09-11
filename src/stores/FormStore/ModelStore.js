import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCreateModelFormStore = create(
  persist(
    (set, get) => ({
      formData: {
        projectName: '',
        projectRunName: '',
        name: '',
        displayName: '',
        type: '',
        description: '',
        modelingTeam: '',
        assumptions: [''],
        scheduledStart: '',
        scheduledEnd: '',
        expectedScenarios: [''],
        scenarioMappings: {},
        requirements: {}, // <-- add requirements here
        other: {}
      },

      // Update form data
      updateFormData: (newData) => set((state) => ({
        formData: { ...state.formData, ...newData }
      })),

      // Set project context
      setProjectContext: (projectName, projectRunName) => set((state) => ({
        formData: { ...state.formData, projectName, projectRunName }
      })),

      // Clear form data
      clearFormData: () => set({
        formData: {
          projectName: '',
          projectRunName: '',
          name: '',
          displayName: '',
          type: '',
          description: '',
          modelingTeam: '',
          assumptions: [''],
          scheduledStart: '',
          scheduledEnd: '',
          expectedScenarios: [''],
          scenarioMappings: {},
          requirements: {}, // <-- add requirements here
          other: {}
        }
      }),

      // Get current form data
      getFormData: () => get().formData,

      // Check if form has data
      hasFormData: () => {
        const data = get().formData;
        return !!(data.name || data.type || data.description || data.modelingTeam ||
                 data.scheduledStart || data.scheduledEnd ||
                 (data.assumptions && data.assumptions.some(a => a.trim())) ||
                 (data.expectedScenarios && data.expectedScenarios.some(s => s.trim())) ||
                 (data.scenarioMappings && Object.keys(data.scenarioMappings).length > 0) ||
                 (data.requirements && Object.keys(data.requirements).length > 0)); // <-- check requirements
      }
    }),
    {
      name: 'create-model-form-storage',
      version: 1,
    }
  )
);

export const useUpdateModelFormStore = create(
  persist(
    (set, get) => ({
      formData: {
        modelId: '',
        projectName: '',
        projectRunName: '',
        name: '',
        displayName: '',
        type: '',
        description: '',
        modelingTeam: '',
        assumptions: [''],
        scheduledStart: '',
        scheduledEnd: '',
        expectedScenarios: [''],
        scenarioMappings: {},
        requirements: {}, // <-- add requirements here
        other: {}
      },

      // Update form data
      updateFormData: (newData) => set((state) => ({
        formData: { ...state.formData, ...newData }
      })),

      // Set model context
      setModelContext: (modelId, projectName, projectRunName) => set((state) => ({
        formData: { ...state.formData, modelId, projectName, projectRunName }
      })),

      // Clear form data
      clearFormData: () => set({
        formData: {
          modelId: '',
          projectName: '',
          projectRunName: '',
          name: '',
          displayName: '',
          type: '',
          description: '',
          modelingTeam: '',
          assumptions: [''],
          scheduledStart: '',
          scheduledEnd: '',
          expectedScenarios: [''],
          scenarioMappings: {},
          requirements: {}, // <-- add requirements here
          other: {}
        }
      }),

      // Get current form data
      getFormData: () => get().formData,

      // Check if form has data
      hasFormData: () => {
        const data = get().formData;
        return !!(data.name || data.type || data.description || data.modelingTeam ||
                 data.scheduledStart || data.scheduledEnd ||
                 (data.assumptions && data.assumptions.some(a => a.trim())) ||
                 (data.expectedScenarios && data.expectedScenarios.some(s => s.trim())) ||
                 (data.scenarioMappings && Object.keys(data.scenarioMappings).length > 0) ||
                 (data.requirements && Object.keys(data.requirements).length > 0)); // <-- check requirements
      }
    }),
    {
      name: 'update-model-form-storage',
      version: 1,
    }
  )
);
