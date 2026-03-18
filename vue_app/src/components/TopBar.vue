<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  title: {
    type: String,
    default: '智慧换热站'
  }
});

const currentTime = ref('');
const stationName = ref('智慧换热站');

const loadStationName = () => {
  const saved = localStorage.getItem('heat-system-settings');
  if (saved) {
    try {
      const settings = JSON.parse(saved);
      if (settings.basic?.stationName) {
        // stationName.value = settings.basic.stationName; // Overridden by design mandate
      }
    } catch (e) {}
  }
};
let timer = null;

const updateTime = () => {
  const now = new Date();
  const weeks = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  const week = weeks[now.getDay()];
  const dateStr = now.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const timeStr = now.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  currentTime.value = `${dateStr} ${week} ${timeStr}`;
};

onMounted(() => {
  updateTime();
  timer = setInterval(updateTime, 1000);
  loadStationName();
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>

<template>
  <header class="top-bar">
    <div class="left-info">
      <div class="time-box">
        <i class="iconfont">&#xeb9b;</i>
        <span>{{ currentTime }}</span>
      </div>
    </div>
    
    <div class="center-title">
      {{ stationName }}
    </div>
    
    <div class="right-info">
      <div class="tool-item weather">
        <i class="iconfont" style="color: #ffce55;">&#xe87f;</i>
        <span>3℃ 晴 | 风力2级</span>
      </div>
      <div class="tool-item user">
        <i class="iconfont icon-user"></i>
        <span>管理员</span>
      </div>
    </div>
  </header>
</template>

<style scoped>
.top-bar {
  height: 80px;
  min-height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
  background: var(--bg-header);
  border-bottom: 2px solid var(--accent-blue);
  position: relative;
  z-index: 2000;
  box-shadow: var(--shadow-premium);
  margin-bottom: 10px;
  transition: all 0.3s ease;
}

.left-info {
  flex: 1;
  display: flex;
  justify-content: flex-start;
}

.time-box {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-primary);
  font-size: 14px;
  font-family: "Microsoft YaHei", sans-serif;
  text-shadow: 0 0 8px var(--accent-blue);
}

.center-title {
  font-size: 32px;
  font-weight: 900;
  letter-spacing: 5px;
  color: var(--text-primary);
  text-shadow: 0 0 20px var(--accent-blue), 0 0 40px rgba(79, 172, 254, 0.2);
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  transition: text-shadow 0.3s ease;
}

body.light-mode .center-title {
  color: var(--accent-blue);
  text-shadow: 0 0 10px rgba(37, 99, 235, 0.3);
}

.right-info {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  gap: 25px;
}

.tool-item {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-secondary);
  font-size: 14px;
}

.time-box .iconfont {
  font-size: 18px;
  color: var(--accent-blue);
}

@media screen and (max-width: 1400px) {
  .center-title { font-size: 24px; }
  .top-bar { padding: 0 20px; }
}
</style>
