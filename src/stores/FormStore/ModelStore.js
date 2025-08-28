import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCreateModelFormStore = create(
  persist(
    (set, get) => ({
      formData: {
        projectName: '',
        projectRunName: '',
        name: '',
        display_name: '',
        type: '',
        description: '',
        modeling_team: '',
        assumptions: [''],
        scheduled_start: '',
        scheduled_end: '',
        expected_scenarios: [''],
        scenario_mappings: {},
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
          display_name: '',
          type: '',
          description: '',
          modeling_team: '',
          assumptions: [''],
          scheduled_start: '',
          scheduled_end: '',
          expected_scenarios: [''],
          scenario_mappings: {},
          requirements: {}, // <-- add requirements here
          other: {}
        }
      }),

      // Get current form data
      getFormData: () => get().formData,

      // Check if form has data
      hasFormData: () => {
        const data = get().formData;
        return !!(data.name || data.type || data.description || data.modeling_team ||
                 data.scheduled_start || data.scheduled_end ||
                 (data.assumptions && data.assumptions.some(a => a.trim())) ||
                 (data.expected_scenarios && data.expected_scenarios.some(s => s.trim())) ||
                 (data.scenario_mappings && Object.keys(data.scenario_mappings).length > 0) ||
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
        display_name: '',
        type: '',
        description: '',
        modeling_team: '',
        assumptions: [''],
        scheduled_start: '',
        scheduled_end: '',
        expected_scenarios: [''],
        scenario_mappings: {},
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
          display_name: '',
          type: '',
          description: '',
          modeling_team: '',
          assumptions: [''],
          scheduled_start: '',
          scheduled_end: '',
          expected_scenarios: [''],
          scenario_mappings: {},
          requirements: {}, // <-- add requirements here
          other: {}
        }
      }),

      // Get current form data
      getFormData: () => get().formData,

      // Check if form has data
      hasFormData: () => {
        const data = get().formData;
        return !!(data.name || data.type || data.description || data.modeling_team ||
                 data.scheduled_start || data.scheduled_end ||
                 (data.assumptions && data.assumptions.some(a => a.trim())) ||
                 (data.expected_scenarios && data.expected_scenarios.some(s => s.trim())) ||
                 (data.scenario_mappings && Object.keys(data.scenario_mappings).length > 0) ||
                 (data.requirements && Object.keys(data.requirements).length > 0)); // <-- check requirements
      }
    }),
    {
      name: 'update-model-form-storage',
      version: 1,
    }
  )
);
