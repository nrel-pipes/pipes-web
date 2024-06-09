import { create} from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useColorStore = create(persist(
  (set, get) => ({
    colors: {},

    getColor: (name) => {
      const colors = get().colors;
      if (colors[name]) {
        return colors[name]
      } else {
        // Generate a new color if not found
        const newColor = getRandomColor();
        set(state => ({ colors: { ...state.colors, [name]: newColor } }));
        return newColor;
      }
    },

    setColor: (name, color) => {
      if (color) { // Only set if the color is defined
        set(state => ({ colors: { ...state.colors, [name]: color } }));
      }
    }
  }),
  {
    name: 'ColorStore',
    storage: createJSONStorage(() => localStorage)
  }
));

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export default useColorStore;
