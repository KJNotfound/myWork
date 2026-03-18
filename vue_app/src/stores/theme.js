import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export const useThemeStore = defineStore('theme', () => {
  const lightMode = ref(false);

  // Initialize from localStorage
  const saved = localStorage.getItem('heat-system-settings');
  if (saved) {
    try {
      const settings = JSON.parse(saved);
      if (settings.basic?.lightMode !== undefined) {
        lightMode.value = settings.basic.lightMode;
      }
    } catch (e) {
      console.error('Failed to load theme settings', e);
    }
  }

  const toggleTheme = () => {
    lightMode.value = !lightMode.value;
    
    // Persist
    const saved = localStorage.getItem('heat-system-settings');
    let settings = {};
    if (saved) {
      try {
        settings = JSON.parse(saved);
      } catch (e) {}
    }
    if (!settings.basic) settings.basic = {};
    settings.basic.lightMode = lightMode.value;
    localStorage.setItem('heat-system-settings', JSON.stringify(settings));
  };

  // Sync with body class
  watch(lightMode, (val) => {
    if (val) {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  }, { immediate: true });

  return { lightMode, toggleTheme };
});
