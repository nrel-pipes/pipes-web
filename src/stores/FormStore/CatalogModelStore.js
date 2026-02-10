import { config } from '@fortawesome/fontawesome-svg-core';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCreateCatalogModelFormStore = create(
  persist(
    (set, get) => ({
      formData: {
        name: '',
        displayName: '',
        type: '',
        description: '',
        assumptions: [''],
        expectedScenarios: [''],
        scenarioMappings: {},
        requirements: {},
        modelingTeam: { name: '', members: [] },
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
          scenarioMappings: {},
          requirements: {},
          modelingTeam: { name: '', members: [] },
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
                 (data.requirements && Object.keys(data.requirements).length > 0) ||
                 (data.modelingTeam && (data.modelingTeam.name || data.modelingTeam.members?.length > 0)));
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
        modelingTeam: { name: '', members: [] },
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
          modelingTeam: { name: '', members: [] },
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
                 (data.requirements && Object.keys(data.requirements).length > 0) ||
                 (data.modelingTeam && (data.modelingTeam.name || data.modelingTeam.members?.length > 0)));
      }
    }),
    {
      name: 'update-catalog-model-form-storage',
      version: 1,
    }
  )
);

export const useCreateCatalogModelFormStoreIFAC = create(
  persist(
    (set, get) => ({
      formData: {
        name: '',
        displayName: '',
        type: '',
        description: '',
        source: '',
        version: '',
        branch: '',
        documentation: '',
        training: '',
        maturity: {},
        assumptions: [''],
        features: [''],
        use_cases: [''],
        tags: [''],
        expected_scenarios: [''],
        inputs: [],
        requirements: {},
        outputs: [],
        teams: [],
        config: {},
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
          source: '',
          version: '',
          branch: '',
          documentation: '',
          training: '',
          maturity: {},
          assumptions: [''],
          features: [''],
          use_cases: [''],
          tags: [''],
          expected_scenarios: [''],
          inputs: [],
          requirements: {},
          outputs: [],
          teams: [],
          config: {},
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
                 (data.features && data.features.some(a => a.trim())) ||
                 (data.expectedScenarios && data.expectedScenarios.some(s => s.trim())) ||
                 (data.requirements && Object.keys(data.requirements).length > 0) ||
                 (data.teams && (data.teams.length > 0)));
      }
    }),
    {
      name: 'create-catalog-model-form-storage-IFAC',
      version: 1,
    }
  )
);

export const useUpdateCatalogModelFormStoreIFAC = create(
  persist(
    (set, get) => ({
      formData: {
        name: '',
        displayName: '',
        type: '',
        description: '',
        source: '',
        version: '',
        branch: '',
        documentation: '',
        training: '',
        maturity: {},
        assumptions: [''],
        features: [''],
        use_cases: [''],
        tags: [''],
        expected_scenarios: [''],
        inputs: [],
        requirements: {},
        outputs: [],
        teams: [],
        config: {},
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
          source: '',
          version: '',
          branch: '',
          documentation: '',
          training: '',
          maturity: {},
          assumptions: [''],
          features: [''],
          use_cases: [''],
          tags: [''],
          expected_scenarios: [''],
          inputs: [],
          requirements: {},
          outputs: [],
          teams: [],
          config: {},
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
                 (data.features && data.features.some(a => a.trim())) ||
                 (data.expectedScenarios && data.expectedScenarios.some(s => s.trim())) ||
                 (data.inputs && (data.inputs.length > 0)) ||
                 (data.requirements && Object.keys(data.requirements).length > 0) ||
                 (data.outputs && (data.outputs.length > 0)) ||
                 (data.teams && (data.teams.length > 0)));
      }
    }),
    {
      name: 'update-catalog-model-form-storage-IFAC',
      version: 1,
    }
  )
);
