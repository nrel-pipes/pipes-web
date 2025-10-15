import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCreateCatalogModelFormStore = create(
  persist(
    (set, get) => ({
      formData: {
        projectName: '',
        projectRunName: '',
        name: '',
        displayName: '',
        type: '',
        description: '',
        assumptions: [''],
        expectedScenarios: [''],
        scenarioMappings: {},
        requirements: {},
        other: {}
      },

      // Update form data
      updateFormData: (newData) => set((state) => ({
        formData: { ...state.formData, ...newData }
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
          assumptions: [''],
          expectedScenarios: [''],
          scenarioMappings: {},
          requirements: {},
          other: {}
        }
      }),

      // Get current form data
      getFormData: () => get().formData,

      // Check if form has data
      hasFormData: () => {
        const data = get().formData;
        return !!(data.name || data.type || data.description ||
                 (data.assumptions && data.assumptions.some(a => a.trim())) ||
                 (data.expectedScenarios && data.expectedScenarios.some(s => s.trim())) ||
                 (data.scenarioMappings && Object.keys(data.scenarioMappings).length > 0) ||
                 (data.requirements && Object.keys(data.requirements).length > 0));
      }
    }),
    {
      name: 'create-catalog-model-form-storage',
      version: 1,
    }
  )
);

export const useUpdateCatalogModelFormStore = create(
  persist(
    (set, get) => ({
      formData: {
        name: '',
        displayName: '',
        type: '',
        description: '',
        assumptions: [''],
        expectedScenarios: [''],
        requirements: {},
        other: {}
      },

      // Update form data
      updateFormData: (newData) => set((state) => ({
        formData: { ...state.formData, ...newData }
      })),

      // Clear form data
      clearFormData: () => set({
        formData: {
          name: '',
          displayName: '',
          type: '',
          description: '',
          assumptions: [''],
          expectedScenarios: [''],
          requirements: {},
          other: {}
        }
      }),

      // Get current form data
      getFormData: () => get().formData,

      // Check if form has data
      hasFormData: () => {
        const data = get().formData;
        return !!(data.name || data.type || data.description ||
                 (data.assumptions && data.assumptions.some(a => a.trim())) ||
                 (data.expectedScenarios && data.expectedScenarios.some(s => s.trim())) ||
                 (data.requirements && Object.keys(data.requirements).length > 0));
      }
    }),
    {
      name: 'update-catalog-model-form-storage',
      version: 1,
    }
  )
);
