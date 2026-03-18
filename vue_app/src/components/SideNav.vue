<script setup>
import { useRouter, useRoute } from 'vue-router';
import { useThemeStore } from '../stores/theme';

const router = useRouter();
const route = useRoute();
const themeStore = useThemeStore();

const navItems = [
  { path: '/home', label: '总体概况', icon: '&#xe603;' },
  { path: '/terminal', label: '我的换热站', icon: '&#xe84a;' },
  { path: '/patrol', label: '一键巡站', icon: '&#xe65c;' },
  { path: '/startup', label: '一键启停', icon: '&#xe6db;' },
  { path: '/health', label: '健康监测', icon: '&#xe61f;' },
  { path: '/assets', label: '资产盘点', icon: '&#xe668;' },
  { path: '/settings', label: '系统设置', icon: '&#xe602;' }
];

const navigate = (path) => {
  router.push(path);
};
</script>

<template>
  <aside class="side-nav">
    <div class="nav-wrapper">
      <div 
        v-for="item in navItems" 
        :key="item.path"
        class="nav-item"
        :class="{ active: route.path === item.path }"
        @click="navigate(item.path)"
      >
        <div class="nav-icon">
          <i class="iconfont" v-html="item.icon"></i>
        </div>
        <span class="nav-label">{{ item.label }}</span>
      </div>
    </div>

    <!-- Bottom-Tools section removed theme toggle -->
    <div class="bottom-tools">
    </div>
  </aside>
</template>

<style scoped>
.side-nav {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 110px;
  height: 100%;
  background: var(--bg-sidebar);
  border-right: 1px solid var(--border-color);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 60px 0 30px;
  transition: all 0.3s ease;
}

.nav-wrapper {
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
  width: 100%;
}

.bottom-tools {
  width: 100%;
  border-top: 1px solid var(--border-color);
  padding-top: 15px;
}

.nav-item {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 15px 0;
  position: relative;
  transition: all 0.3s ease;
  color: var(--text-secondary);
}

.nav-icon {
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  font-size: 24px;
}

.nav-label {
  font-size: 14px;
  color: inherit;
  text-align: center;
  letter-spacing: 1px;
}

/* 导航交互状态 */
.nav-item:hover,
.nav-item.active {
  background: linear-gradient(135deg, rgba(79, 172, 254, 0.1) 0%, rgba(0, 242, 254, 0.05) 100%);
  color: var(--accent-blue);
}

.nav-item.active .nav-label {
  font-weight: bold;
}

.nav-item.active .nav-icon {
  transform: scale(1.1);
}

.nav-item.active::after {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: var(--accent-blue);
  box-shadow: 0 0 10px var(--accent-blue);
}
</style>
