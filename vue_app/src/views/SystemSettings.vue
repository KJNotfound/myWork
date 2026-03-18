<script setup>
import { ref, onMounted } from 'vue';
import { useThemeStore } from '../stores/theme';

const themeStore = useThemeStore();
const settings = ref({
  stationName: '智慧换热站 A-01',
  refreshRate: 5000,
  tempAlarm: true,
  pressureAlarm: true,
  particles: true
});

const showToast = ref(false);
const toastMessage = ref('');
const showConfirmModal = ref(false);

const displayToast = (msg) => {
  toastMessage.value = msg;
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 2500);
};

const saveSettings = () => {
  localStorage.setItem('heatStationSettings', JSON.stringify(settings.value));
  displayToast('配置已成功保存并应用！');
};

const openResetConfirm = () => {
  showConfirmModal.value = true;
};

const closeConfirmModal = () => {
  showConfirmModal.value = false;
};

const confirmReset = () => {
  localStorage.removeItem('heatStationSettings');
  settings.value = {
    stationName: '智慧换热站 A-01',
    refreshRate: 5000,
    tempAlarm: true,
    pressureAlarm: true,
    particles: true
  };
  if (themeStore.lightMode) {
    themeStore.toggleTheme();
  }
  closeConfirmModal();
  displayToast('已恢复初始配置！');
};

onMounted(() => {
  const saved = localStorage.getItem('heatStationSettings');
  if (saved) settings.value = JSON.parse(saved);
});
</script>

<template>
  <div class="settings-view">
    <header class="view-header">
  <div class="header-left">
    <div class="page-title">系统设置</div>
    <div class="page-subtitle">SYSTEM SETTINGS</div>
  </div>
</header>

    <div class="settings-grid">
      <div class="settings-card">
        <div class="card-header">
          <i class="iconfont card-icon">&#xe602;</i>
          <h2 class="card-title">基本设置</h2>
        </div>
        <div class="setting-item">
          <label class="setting-label">换热站名称</label>
          <input type="text" class="setting-input" v-model="settings.stationName">
        </div>
        <div class="setting-item">
          <label class="setting-label">数据刷新频率</label>
          <select class="setting-select" v-model="settings.refreshRate">
            <option :value="5000">5秒（标准）</option>
            <option :value="1000">1秒（高频）</option>
          </select>
        </div>
      </div>

      <div class="settings-card">
        <div class="card-header">
          <i class="iconfont card-icon">&#xe623;</i>
          <h2 class="card-title">监控报警</h2>
        </div>
        <div class="setting-item">
          <div class="switch-container">
            <label class="setting-label">温度阈值报警</label>
            <div class="switch" :class="{ active: settings.tempAlarm }" @click="settings.tempAlarm = !settings.tempAlarm">
              <div class="switch-slider"></div>
            </div>
          </div>
        </div>
        <div class="setting-item">
          <div class="switch-container">
            <label class="setting-label">压力波动报警</label>
            <div class="switch" :class="{ active: settings.pressureAlarm }" @click="settings.pressureAlarm = !settings.pressureAlarm">
              <div class="switch-slider"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="settings-card">
        <div class="card-header">
          <i class="iconfont card-icon">&#xe634;</i>
          <h2 class="card-title">视觉效果</h2>
        </div>
        <div class="setting-item">
          <div class="switch-container">
            <label class="setting-label">背景粒子效果</label>
            <div class="switch" :class="{ active: settings.particles }" @click="settings.particles = !settings.particles">
              <div class="switch-slider"></div>
            </div>
          </div>
        </div>
        <div class="setting-item">
          <div class="switch-container">
            <label class="setting-label">白天模式</label>
            <div class="switch" :class="{ active: themeStore.lightMode }" @click="themeStore.toggleTheme">
              <div class="switch-slider"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="button-group">
      <button class="btn btn-primary" @click="saveSettings">保存应用配置</button>
      <button class="btn btn-secondary" @click="openResetConfirm">恢复初始状态</button>
    </div>

    <div v-if="showConfirmModal" class="modal-overlay" @click.self="closeConfirmModal">
      <div class="modal-content">
        <div class="modal-header">
          <span>确认恢复初始状态</span>
          <button class="modal-close" @click="closeConfirmModal">&times;</button>
        </div>
        <div class="modal-body">
          <p class="modal-text">此操作将恢复所有设置为默认值，包括主题模式。确定要继续吗？</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-cancel" @click="closeConfirmModal">取消</button>
          <button class="btn btn-confirm" @click="confirmReset">确认恢复</button>
        </div>
      </div>
    </div>

    <transition name="toast">
      <div v-if="showToast" class="toast-message">
        {{ toastMessage }}
      </div>
    </transition>
  </div>
</template>

<style scoped>
.settings-view {
  height: 100%;
  width: 100%;
  padding: 20px;
  background-color: var(--bg-color);
  transition: background-color 0.3s ease;
}

.view-header {
  height: 80px;
  background: var(--bg-panel);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px;
  margin-bottom: 30px;
  transition: background-color 0.3s ease;
}

.header-left {
  display: flex;
  flex-direction: column;
}

.page-title {
  font-size: 24px;
  font-weight: bold;
  color: var(--text-primary);
  text-shadow: 0 0 15px var(--accent-blue);
  transition: color 0.3s ease;
}

.page-subtitle {
  font-size: 14px;
  color: var(--text-secondary);
  margin-top: 5px;
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.settings-card {
  background: var(--bg-panel);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s;
}

.settings-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border-color: var(--accent-cyan);
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--border-color);
}

.card-icon {
  font-size: 28px;
  color: var(--accent-cyan);
  margin-right: 15px;
}

.card-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
}

.setting-item {
  margin-bottom: 25px;
}

.setting-label {
  display: block;
  margin-bottom: 12px;
  color: var(--text-secondary);
  font-size: 15px;
}

.setting-input, .setting-select {
  width: 100%;
  padding: 12px 16px;
  background: rgba(128, 128, 128, 0.05);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s, background-color 0.3s;
}

.setting-input:focus, .setting-select:focus {
  outline: none;
  border-color: var(--accent-cyan);
  background: rgba(128, 128, 128, 0.08);
}

.switch-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.switch {
  position: relative;
  width: 56px;
  height: 28px;
  background: var(--border-color);
  border-radius: 14px;
  cursor: pointer;
  transition: background 0.3s;
}

.switch.active {
  background: var(--accent-cyan);
  box-shadow: 0 0 10px var(--accent-cyan);
}

.switch-slider {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 22px;
  height: 22px;
  background: #fff;
  border-radius: 50%;
  transition: 0.3s cubic-bezier(0.18, 0.89, 0.35, 1.15);
}

.switch.active .switch-slider {
  transform: translateX(28px);
}

.button-group {
  display: flex;
  gap: 20px;
  margin-top: 50px;
}

.btn {
  padding: 14px 35px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 700;
  border: none;
  font-size: 16px;
  transition: all 0.3s;
}

.btn-primary {
  background: linear-gradient(90deg, #00f2fe, #4facfe);
  color: #000;
  box-shadow: 0 4px 15px rgba(0, 242, 254, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 242, 254, 0.5);
}

.btn-secondary {
  background: linear-gradient(90deg, #00f2fe, #4facfe);
  color: #000;
  box-shadow: 0 4px 15px rgba(0, 242, 254, 0.3);
}

.btn-secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 242, 254, 0.5);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: var(--bg-panel);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.modal-header {
  height: 50px;
  background: var(--bg-header);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  font-size: 16px;
  font-weight: bold;
  color: var(--accent-blue);
  border-radius: 12px 12px 0 0;
}

.modal-close {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 24px;
  cursor: pointer;
  transition: color 0.3s;
}

.modal-close:hover {
  color: var(--accent-red);
}

.modal-body {
  padding: 24px 20px;
}

.modal-text {
  color: var(--text-primary);
  font-size: 15px;
  line-height: 1.6;
  text-align: center;
}

.modal-footer {
  display: flex;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid var(--border-color);
}

.btn-cancel {
  flex: 1;
  background: var(--bg-color);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-cancel:hover {
  border-color: var(--accent-blue);
  color: var(--accent-blue);
}

.btn-confirm {
  flex: 1;
  background: linear-gradient(90deg, #ff6b6b, #ee5a5a);
  color: #fff;
  font-weight: bold;
}

.btn-confirm:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.4);
}

.toast-message {
  position: fixed;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, rgba(0, 230, 118, 0.9), rgba(0, 200, 100, 0.9));
  color: #fff;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: bold;
  box-shadow: 0 4px 20px rgba(0, 230, 118, 0.4);
  z-index: 3500;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px);
}
</style>
