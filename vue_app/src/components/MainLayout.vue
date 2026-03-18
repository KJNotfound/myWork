<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import SideNav from './SideNav.vue';
import TopBar from './TopBar.vue';
import { useRoute } from 'vue-router';
import { useThemeStore } from '../stores/theme';

const route = useRoute();
const appRef = ref(null);
const themeStore = useThemeStore();

const handleResize = () => {
  const designWidth = 1920;
  const designHeight = 1080;
  const clientWidth = document.documentElement.clientWidth;
  const clientHeight = document.documentElement.clientHeight;

  const scale = Math.min(clientWidth / designWidth, clientHeight / designHeight);

  if (appRef.value) {
    appRef.value.style.transform = `scale(${scale})`;
    const left = (clientWidth - designWidth * scale) / 2;
    const top = (clientHeight - designHeight * scale) / 2;
    appRef.value.style.left = `${left}px`;
    appRef.value.style.top = `${top}px`;
  }
};

onMounted(() => {
  handleResize();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<template>
  <div ref="appRef" class="dashboard-root">
    <SideNav v-if="route.path !== '/home'" />
    <div class="layout-wrapper" :style="{ marginLeft: route.path === '/home' ? '0' : '110px' }">
      <TopBar v-if="route.path !== '/home'" />
      <main class="main-container">
        <div class="content-area">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.dashboard-root {
  width: 1920px;
  height: 1080px;
  display: flex;
  background-color: var(--bg-color);
  position: absolute;
  top: 0;
  left: 0;
  transform-origin: left top;
  overflow: hidden;
  transition: background-color 0.3s ease;
}

.layout-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0 20px 15px;
  overflow: hidden;
  position: relative;
}

.content-area {
  flex: 1;
  overflow: hidden;
}

/* Page transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
