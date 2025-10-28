import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCreateCatalogDatasetFormStore = create(
  persist(
    (set, get) => ({
      formData: {
        name: '',
        displayName: '',
        description: '',
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
          description: '',
        }
      }),

      // Get current form data
      getFormData: () => get().formData,

      // Check if form has data
      hasFormData: () => {
        const data = get().formData;
        return !!(data.name || data.type || data.description );
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
        displayName: '',
        description: '',
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
          description: '',
        }
      }),

      // Get current form data
      getFormData: () => get().formData,

      // Check if form has data
      hasFormData: () => {
        const data = get().formData;
        return !!(data.name || data.displayName || data.description);
      }
    }),
    {
      name: 'update-catalog-dataset-form-storage',
      version: 1,
    }
  )
);
