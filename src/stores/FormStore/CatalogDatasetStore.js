import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Helper function to deep merge objects
const deepMerge = (target, source) => {
  const output = { ...target };

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          output[key] = source[key];
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        output[key] = source[key];
      }
    });
  }

  return output;
};

const isObject = (item) => {
  return item && typeof item === 'object' && !Array.isArray(item);
};

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
        location: {
          system_type: '',
          storage_path: '',
          access_info: '',
          extra_note: '',
        },
        weather_years: [],
        model_years: [],
        units: [],
        temporal_info: {
          start_date: '',
          end_date: '',
          resolution: '',
        },
        spatial_info: {
          extent: '',
          resolution: '',
          coordinate_system: '',
        },
        scenarios: [''],
        sensitivities: [''],
        source_code: {
          location: '',
          branch: '',
          tag: '',
          image: '',
        },
        relevant_links: [],
        resource_url: '',
      },

      // Update form data with deep merge
      updateFormData: (newData) => set((state) => ({
        formData: deepMerge(state.formData, newData)
      })),
      setFormData: (formData) => set({ formData }),

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
          location: {
            system_type: '',
            storage_path: '',
            access_info: '',
            extra_note: '',
          },
          weather_years: [],
          model_years: [],
          units: [],
          temporal_info: {
            start_date: '',
            end_date: '',
            resolution: '',
          },
          spatial_info: {
            extent: '',
            resolution: '',
            coordinate_system: '',
          },
          scenarios: [''],
          sensitivities: [''],
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
      version: 2,
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
        location: {
          system_type: '',
          storage_path: '',
          access_info: '',
          extra_note: '',
        },
        weather_years: [],
        model_years: [],
        units: [],
        temporal_info: {
          start_date: '',
          end_date: '',
          resolution: '',
        },
        spatial_info: {
          extent: '',
          resolution: '',
          coordinate_system: '',
        },
        scenarios: [''],
        sensitivities: [''],
        source_code: {
          location: '',
          branch: '',
          tag: '',
          image: '',
        },
        relevant_links: [],
        resource_url: '',
      },

      // Update form data with deep merge
      updateFormData: (newData) => set((state) => ({
        formData: deepMerge(state.formData, newData)
      })),
      setFormData: (formData) => set({ formData }),

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
          location: {
            system_type: '',
            storage_path: '',
            access_info: '',
            extra_note: '',
          },
          weather_years: [],
          model_years: [],
          units: [],
          temporal_info: {
            start_date: '',
            end_date: '',
            resolution: '',
          },
          spatial_info: {
            extent: '',
            resolution: '',
            coordinate_system: '',
          },
          scenarios: [''],
          sensitivities: [''],
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
      version: 2,
    }
  )
);
