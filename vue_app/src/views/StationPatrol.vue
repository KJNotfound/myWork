<script setup>
import { ref, reactive, onMounted } from 'vue';

const currentTime = ref('');
const scanState = ref('idle'); // idle, scanning, success
const currentUser = ref('');
const selectedRole = ref('');
const showSuccessModal = ref(false);
const justUpdated = ref(false);

// 模拟统计数据
const stats = reactive({
  month: 12,
  year: 45
});

const lastUser = ref('张工');
const lastRole = ref('热力队伍');
const lastTime = ref('今日 08:30');

const logs = reactive([]);

// 添加日志
const addLog = (msg, type = 'info') => {
  const time = new Date().toLocaleTimeString();
  logs.unshift({ time, msg, type }); // 最新日志在最上
};

// 1. 初始化：进入页面自动开始扫描
const startProcess = () => {
  addLog("摄像头已激活，等待人脸...");
  setTimeout(() => {
    scanState.value = 'scanning';
    addLog("检测到面部特征，正在比对数据库...");

    // 模拟识别过程 (2秒)
    setTimeout(() => {
      scanState.value = 'success';
      currentUser.value = '李明'; // 模拟识别结果
      addLog("识别成功：李明。请选择巡视职能。", 'success');
    }, 2000);
  }, 1000);
};

// 2. 选择角色并完成打卡
const selectRole = (role) => {
  if (scanState.value !== 'success') return;

  selectedRole.value = role;
  addLog(`用户选择了职能：${role}`);

  // 提交数据
  setTimeout(() => {
    completeCheckIn();
  }, 500);
};

const completeCheckIn = () => {
  // 更新统计
  stats.month++;
  stats.year++;
  justUpdated.value = true;

  // 更新上次记录
  lastUser.value = currentUser.value;
  lastRole.value = selectedRole.value;
  lastTime.value = new Date().toLocaleTimeString();

  // 重置扫描状态，避免辉光干扰模态窗
  scanState.value = 'idle';

  addLog("数据已上传至后台。", 'success');
  showSuccessModal.value = true;

  // 3秒后移除高亮
  setTimeout(() => { justUpdated.value = false; }, 3000);
};

const closeModal = () => {
  showSuccessModal.value = false;
  // 重置状态，准备下一次
  scanState.value = 'idle';
  currentUser.value = '';
  selectedRole.value = '';
  addLog("系统待机中...");

  // 5秒后自动重新开始扫描
  setTimeout(startProcess, 2000);
};

onMounted(() => {
  startProcess(); // 启动流程
  setInterval(() => {
    const now = new Date();
    currentTime.value = now.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).replace(/\//g, '-');
  }, 1000);
});
</script>

<template>
  <div class="patrol-view">
    <header class="view-header">
      <div class="header-left">
        <div class="page-title">一键巡站系统</div>
        <div class="page-subtitle">SMART PATROL TERMINAL</div>
      </div>
      <div class="page-time">{{ currentTime }}</div>
    </header>

    <div class="content-grid">
      <div class="glass-panel">
        <h3 class="panel-title">巡视统计数据</h3>

        <div class="stat-box" :class="{ highlight: justUpdated }">
          <div class="stat-label">本月巡视总次数</div>
          <div>
            <span class="stat-value">{{ stats.month }}</span><span class="stat-unit">次</span>
          </div>
        </div>

        <div class="stat-box" :class="{ highlight: justUpdated }">
          <div class="stat-label">今年累计巡视</div>
          <div>
            <span class="stat-value">{{ stats.year }}</span><span class="stat-unit">次</span>
          </div>
        </div>

        <div class="stat-box">
          <div class="stat-label">上次打卡人员</div>
          <div class="last-patrol-info">
            {{ lastUser }} <span class="patrol-role">({{ lastRole }})</span>
          </div>
          <div class="last-patrol-time">{{ lastTime }}</div>
        </div>
      </div>

      <div class="camera-container">
        <div class="camera-feed"></div>
        <div class="face-frame" :class="scanState">
          <div class="scan-laser"></div>
        </div>

        <div class="camera-status">
          <span v-if="scanState === 'idle'" class="status-idle">请正对摄像头...</span>
          <span v-if="scanState === 'scanning'" class="status-scanning blink">正在识别身份特征...</span>
          <span v-if="scanState === 'success'" class="status-success">✔ 识别成功：{{ currentUser }}</span>
        </div>
      </div>

      <div class="glass-panel">
        <h3 class="panel-title">请确认巡视职能</h3>

        <div class="role-section">
          <div 
            class="role-btn" 
            :class="{ selected: selectedRole === '管家', disabled: scanState !== 'success' }"
            @click="selectRole('管家')"
          >
            <span class="check-icon">✔</span> 管家
          </div>
          <div 
            class="role-btn" 
            :class="{ selected: selectedRole === '热力队伍', disabled: scanState !== 'success' }"
            @click="selectRole('热力队伍')"
          >
            <span class="check-icon">✔</span> 热力队伍
          </div>
          <div 
            class="role-btn" 
            :class="{ selected: selectedRole === '电气队伍', disabled: scanState !== 'success' }"
            @click="selectRole('电气队伍')"
          >
            <span class="check-icon">✔</span> 电气队伍
          </div>
        </div>

        <div class="log-panel">
          <div v-for="(log, idx) in logs" :key="idx" class="log-entry" :class="{ success: log.type === 'success' }">
            [{{ log.time }}] {{ log.msg }}
          </div>
        </div>
      </div>
    </div>

    <div class="success-modal" :class="{ show: showSuccessModal }">
      <div class="modal-content">
        <div class="success-icon">✔</div>
        <h2 class="modal-title">打卡成功</h2>
        <p class="modal-info">{{ currentUser }} ({{ selectedRole }})</p>
        <p class="modal-time">{{ currentTime }}</p>
        <button class="modal-btn" @click="closeModal">返回</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.patrol-view {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
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
  transition: background-color 0.3s ease;
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

.page-time {
  font-size: 20px;
  color: var(--accent-cyan);
  font-family: 'Share Tech Mono', monospace;
}

.content-grid {
  display: grid;
  grid-template-columns: 350px 1fr 350px;
  gap: 30px;
  flex: 1;
}

.glass-panel {
  background: var(--bg-panel);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 25px;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-premium);
  transition: all 0.3s ease;
}

.panel-title {
  color: var(--accent-blue);
  margin-bottom: 20px;
  border-left: 4px solid var(--accent-blue);
  padding-left: 10px;
  font-size: 18px;
}

.stat-box {
  margin-bottom: 25px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.03);
  border-left: 4px solid var(--accent-blue);
  border-radius: 4px;
  transition: all 0.3s;
}

.stat-box.highlight {
  border-left-color: var(--accent-green);
  transform: scale(1.05);
  box-shadow: 0 0 20px var(--accent-green);
}

.stat-box.highlight .stat-value {
  color: var(--accent-green);
}

.stat-label {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 5px;
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  color: var(--text-primary);
  transition: color 0.3s ease;
}

.stat-unit {
  font-size: 14px;
  margin-left: 5px;
  color: #aaa;
}

.last-patrol-info {
  font-size: 18px;
  color: var(--text-primary);
  margin-top: 5px;
  transition: color 0.3s ease;
}

.patrol-role {
  font-size: 12px;
  color: var(--text-secondary);
}

.last-patrol-time {
  font-size: 12px;
  color: #666;
  margin-top: 5px;
}

.camera-container {
  position: relative;
  z-index: 5;
  background: var(--bg-color);
  border: 2px solid var(--accent-blue);
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: background 0.3s ease;
}

.camera-feed {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, var(--bg-panel) 0%, var(--bg-color) 100%);
  opacity: 0.6;
  transition: background 0.3s ease;
}

.face-frame {
  width: 300px;
  height: 300px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  position: relative;
  transition: all 0.3s;
}

.face-frame::before,
.face-frame::after {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  border-color: var(--accent-cyan);
  border-style: solid;
  transition: all 0.3s;
}

.face-frame::before {
  top: -2px;
  left: -2px;
  border-width: 4px 0 0 4px;
}

.face-frame::after {
  bottom: -2px;
  right: -2px;
  border-width: 0 4px 4px 0;
}

.face-frame.scanning {
  border-color: var(--accent-cyan);
  box-shadow: 0 0 20px var(--accent-cyan);
}

.face-frame.success {
  border-color: var(--accent-blue);
  box-shadow: 0 0 30px var(--accent-blue);
}

.face-frame.success::before,
.face-frame.success::after {
  border-color: var(--accent-blue);
}

.scan-laser {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--accent-cyan);
  box-shadow: 0 0 10px var(--accent-cyan);
  opacity: 0;
}

.face-frame.scanning .scan-laser {
  opacity: 1;
  animation: scanDown 1.5s linear infinite;
}

@keyframes scanDown {
  0% { top: 0; opacity: 0; }
  20% { opacity: 1; }
  80% { opacity: 1; }
  100% { top: 100%; opacity: 0; }
}

.camera-status {
  margin-top: 20px;
  z-index: 10;
  font-size: 18px;
  font-weight: bold;
  padding: 8px 20px;
  border-radius: 20px;
  background: rgba(37, 99, 235, 0.5);
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;
}

.status-idle {
  color: var(--text-primary);
}

.status-scanning {
  color: var(--accent-cyan);
}

.status-success {
  color: var(--accent-blue);
  background: rgba(37, 99, 235, 0.2);
}

.blink {
  animation: blink 1s infinite;
}

@keyframes blink {
  50% { opacity: 0.5; }
}

.role-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
  flex: 1;
}

.role-btn {
  flex: 1;
  background: rgba(37, 99, 235, 0.2);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.role-btn:hover:not(.disabled) {
  border-color: var(--accent-blue);
  background: rgba(37, 99, 235, 0.3);
}

.role-btn.selected {
  background: var(--accent-blue);
  color: #000;
  font-weight: bold;
  box-shadow: 0 0 20px var(--accent-blue);
  border: none;
}

.role-btn.disabled {
  opacity: 0.3;
  cursor: not-allowed;
  filter: grayscale(1);
}

.check-icon {
  display: none;
  font-size: 20px;
}

.role-btn.selected .check-icon {
  display: block;
}

.log-panel {
  height: 200px;
  margin-top: 20px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  padding: 15px;
  overflow-y: auto;
  font-family: monospace;
  font-size: 12px;
}

.log-entry {
  margin-bottom: 5px;
  color: var(--text-secondary);
}

.log-entry.success {
  color: var(--accent-green);
}

.success-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transition: 0.3s;
}

.success-modal.show {
  opacity: 1;
  pointer-events: auto;
}

.modal-content {
  width: 500px;
  background: var(--bg-panel);
  border: 2px solid var(--accent-green);
  border-radius: 12px;
  padding: 40px;
  text-align: center;
  box-shadow: 0 0 50px rgba(0, 230, 118, 0.3);
  transform: scale(0.8);
  transition: 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.success-modal.show .modal-content {
  transform: scale(1);
}

.success-icon {
  font-size: 80px;
  color: var(--accent-green);
  margin-bottom: 20px;
}

.modal-title {
  color: var(--text-primary);
  margin-bottom: 10px;
  transition: color 0.3s ease;
}

.modal-info {
  color: var(--text-secondary);
  font-size: 18px;
}

.modal-time {
  color: var(--accent-blue);
  margin-top: 20px;
  font-family: monospace;
}

.modal-btn {
  margin-top: 30px;
  padding: 10px 40px;
  background: var(--accent-blue);
  border: none;
  border-radius: 20px;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}
</style>
