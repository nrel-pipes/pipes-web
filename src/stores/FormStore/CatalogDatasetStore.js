import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCreateCatalogDatasetFormStore = create(
  persist(
    (set, get) => ({
      formData: {
        name: '',
        display_name: '',
        description: '',
        version: '',
        previous_version: '',
        hash_value: '',
        data_format: '',
        schema_info: {},
        location: {},
        weather_years: [],
        model_years: [],
        units: [],
        temporal_info: {},
        spatial_info: {},
        scenarios: [],
        sensitivities: [],
        source_code: {
          location: '',
          branch: '',
          tag: '',
          image: '',
        },
        relevant_links: [],
        resource_url: '',
      },

      // Update form data
      updateFormData: (newData) => set((state) => ({
        formData: { ...state.formData, ...newData }
      })),

      // Clear form data
      clearFormData: () => set({
        formData: {
          name: '',
          display_name: '',
          description: '',
          version: '',
          previous_version: '',
          hash_value: '',
          data_format: '',
          schema_info: {},
          location: {},
          weather_years: [],
          model_years: [],
          units: [],
          temporal_info: {},
          spatial_info: {},
          scenarios: [],
          sensitivities: [],
          source_code: {
            location: '',
            branch: '',
            tag: '',
            image: '',
          },
          relevant_links: [],
          resource_url: '',
        }
      }),

      // Get current form data
      getFormData: () => get().formData,

      // Check if form has data
      hasFormData: () => {
        const data = get().formData;
        return !!(
          data.name ||
          data.display_name ||
          data.description ||
          data.version ||
          data.data_format
        );
      }
    }),
    {
      name: 'create-catalog-dataset-form-storage',
      version: 1,
    }
  )
);

export const useUpdateCatalogDatasetFormStore = create(
  persist(
    (set, get) => ({
      formData: {
        name: '',
        display_name: '',
        description: '',
        version: '',
        previous_version: '',
        hash_value: '',
        data_format: '',
        schema_info: {},
        location: {},
        weather_years: [],
        model_years: [],
        units: [],
        temporal_info: {},
        spatial_info: {},
        scenarios: [],
        sensitivities: [],
        source_code: {
          location: '',
          branch: '',
          tag: '',
          image: '',
        },
        relevant_links: [],
        resource_url: '',
      },

      // Update form data
      updateFormData: (newData) => set((state) => ({
        formData: { ...state.formData, ...newData }
      })),

      // Clear form data
      clearFormData: () => set({
        formData: {
          name: '',
          display_name: '',
          description: '',
          version: '',
          previous_version: '',
          hash_value: '',
          data_format: '',
          schema_info: {},
          location: {},
          weather_years: [],
          model_years: [],
          units: [],
          temporal_info: {},
          spatial_info: {},
          scenarios: [],
          sensitivities: [],
          source_code: {
            location: '',
            branch: '',
            tag: '',
            image: '',
          },
          relevant_links: [],
          resource_url: '',
        }
      }),

      // Get current form data
      getFormData: () => get().formData,

      // Check if form has data
      hasFormData: () => {
        const data = get().formData;
        return !!(
          data.name ||
          data.display_name ||
          data.description ||
          data.version ||
          data.data_format
        );
      }
    }),
    {
      name: 'update-catalog-dataset-form-storage',
      version: 1,
    }
  )
);
