<script setup>
import { ref, reactive, computed, onMounted } from 'vue';

const currentStep = ref(-1); // -1 (idle), 0, 1, 2, 3 (done)
const isStarting = ref(false);
const logs = reactive([]);
const errorMsg = ref('');
const currentPressure = ref(0.25);

onMounted(() => {
});

const checkItems = reactive([
  { name: '一次网阀门状态', status: 'pending', statusText: '待检' },
  { name: '二次网水箱液位', status: 'pending', statusText: '待检' },
  { name: '循环泵变频器通讯', status: 'pending', statusText: '待检' },
  { name: '补水泵电源状态', status: 'pending', statusText: '待检' },
  { name: '仪表数据采集', status: 'pending', statusText: '待检' }
]);

const progressWidth = computed(() => {
  if (currentStep.value < 0) return 0;
  return (currentStep.value / 3) * 100;
});

const addLog = (msg, type = 'info') => {
  const time = new Date().toLocaleTimeString();
  logs.unshift({ time, msg, type });
};

const getStatusClass = (status) => {
  return {
    'status-pending': status === 'pending',
    'status-ok': status === 'ok',
    'status-err': status === 'err'
  };
};

const getStepClass = (step) => {
  return {
    'active': currentStep.value >= step,
    'done': currentStep.value > step,
    'error': errorMsg.value && currentStep.value === step
  };
};

const startSystem = async () => {
  isStarting.value = true;
  errorMsg.value = '';
  currentStep.value = 0;
  addLog(">>> 启动流程开始");

  // Step 0: System Check
  addLog("正在进行全系统预检...");
  for (let i = 0; i < checkItems.length; i++) {
    await new Promise(r => setTimeout(r, 600));
    checkItems[i].status = 'ok';
    checkItems[i].statusText = '通过';
    addLog(`检查项 [${checkItems[i].name}] - OK`);
  }

  // Step 1: Feed Water
  currentStep.value = 1;
  addLog("启动补水泵，开始系统建立压...");
  const timer = setInterval(() => {
    if (currentPressure.value < 0.6) {
      currentPressure.value = parseFloat((currentPressure.value + 0.05).toFixed(2));
    } else {
      clearInterval(timer);
    }
  }, 500);
  await new Promise(r => setTimeout(r, 3000));
  addLog("系统定压建立完成 (0.60 MPa)");

  // Step 2: Circulation
  currentStep.value = 2;
  addLog("正在缓慢开启循环泵...");
  await new Promise(r => setTimeout(r, 3000));
  addLog("循环泵运行频率 35Hz，流量稳定");

  // Step 3: Done
  currentStep.value = 3;
  addLog(">>> 系统启站流程圆满完成", 'success');
  isStarting.value = false;
};

const resetSystem = () => {
  currentStep.value = -1;
  isStarting.value = false;
  errorMsg.value = '';
  currentPressure.value = 0.25;
  checkItems.forEach(item => {
    item.status = 'pending';
    item.statusText = '待检';
  });
  logs.length = 0;
};
</script>

<template>
  <div class="startup-view">
    <header class="view-header">
  <div class="header-left">
    <div class="page-title">一键启停系统</div>
    <div class="page-subtitle">SMART STARTUP TERMINAL</div>
  </div>
</header>

    <div class="main-grid">
      <div class="panel">
        <div class="panel-title">1. 系统自检项</div>
        <div class="check-list">
          <div class="check-item" v-for="(item, index) in checkItems" :key="index">
            <span class="check-label">{{ item.name }}</span>
            <span class="status-tag" :class="getStatusClass(item.status)">
              {{ item.statusText }}
            </span>
          </div>
        </div>

        <div class="tip-box">
          <strong class="warning-text">提示：</strong><br>
          如自检发现“阀门关闭”或“液位过低”，系统将自动中止启动流程并报警。请现场处理后重试。
        </div>
      </div>

      <div class="panel">
        <div class="panel-title">2. 启动进程可视化</div>

        <div class="process-visual">
          <div class="step-track">
            <div class="step-track-fill" :style="{ width: progressWidth + '%' }"></div>

            <div class="step-node" :class="getStepClass(0)">
              <div class="step-icon">
                <i class="iconfont">&#xe688;</i>
              </div>
              <div class="step-label">系统检查</div>
            </div>
            <div class="step-node" :class="getStepClass(1)">
              <div class="step-icon">
                <i class="iconfont">&#xe612;</i>
              </div>
              <div class="step-label">启动补水</div>
            </div>
            <div class="step-node" :class="getStepClass(2)">
              <div class="step-icon">
                <i class="iconfont">&#xe60f;</i>
              </div>
              <div class="step-label">启动循环</div>
            </div>
            <div class="step-node" :class="getStepClass(3)">
              <div class="step-icon">
                <i class="iconfont">&#xe606;</i>
              </div>
              <div class="step-label">完成</div>
            </div>
          </div>

          <div class="anim-stage">
            <div v-if="currentStep === -1" class="idle-state">
              <div class="idle-icon">🟥</div>
              <div class="status-big idle-text">系统待机中</div>
            </div>

            <div v-if="currentStep === 1" class="filling-state">
              <svg width="200" height="200" viewBox="0 0 200 200">
                <path d="M50,150 L150,150 L150,50 L50,50 Z" fill="none" stroke="#4facfe" stroke-width="2" />
                <rect x="50" y="100" width="100" height="50" fill="rgba(79,172,254,0.5)">
                  <animate attributeName="y" values="100;60" dur="2s" fill="freeze" />
                  <animate attributeName="height" values="50;90" dur="2s" fill="freeze" />
                </rect>
                <text x="100" y="180" text-anchor="middle" fill="#fff" font-size="14">补水加压中...</text>
              </svg>
              <div class="status-big">正在建立定压...</div>
              <div class="pressure-info">当前回压: {{ currentPressure }} MPa</div>
            </div>

            <div v-if="currentStep === 2" class="pumping-state">
              <svg width="150" height="150" viewBox="0 0 100 100" class="pump-spin">
                <path d="M50,50 L50,10 A40,40 0 0,1 90,50 Z" fill="#00e676" opacity="0.8" />
                <path d="M50,50 L90,50 A40,40 0 0,1 50,90 Z" fill="#00e676" opacity="0.6" />
                <path d="M50,50 L50,90 A40,40 0 0,1 10,50 Z" fill="#00e676" opacity="0.4" />
                <circle cx="50" cy="50" r="10" fill="#fff" />
              </svg>
              <div class="status-big success">循环泵启动中</div>
            </div>

            <div v-if="currentStep === 3" class="done-state">
              <div class="done-icon">✔</div>
              <div class="status-big success">启站流程完成</div>
            </div>

            <div v-if="errorMsg" class="error-overlay">
              <div class="error-icon">⚠️</div>
              <div class="error-text">{{ errorMsg }}</div>
              <button @click="resetSystem" class="reset-btn">重置系统</button>
            </div>
          </div>
        </div>
      </div>

      <div class="panel">
        <div class="panel-title">3. 系统操作控制台</div>
        <div class="console-log">
          <div v-for="(log, idx) in logs" :key="idx" class="log-line" :class="log.type">
            [{{ log.time }}] {{ log.msg }}
          </div>
        </div>
        
        <button 
          class="btn-start-large" 
          :class="{ 'btn-stop': currentStep === 3 }" 
          :disabled="isStarting"
          @click="currentStep === 3 ? resetSystem() : startSystem()"
        >
          {{ currentStep === 3 ? '停止并重置系统' : (isStarting ? '正在启动...' : '一键开启系统') }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.startup-view {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.view-header {
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
  background: rgba(16, 42, 67, 0.6);
  border-bottom: 2px solid var(--accent-blue);
  border-radius: 4px;
}

.page-title {
  font-size: 32px;
  font-weight: bold;
  letter-spacing: 2px;
  color: #fff;
  text-shadow: 0 0 10px var(--accent-blue);
}

.main-grid {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 20px;
}

.panel {
  background: var(--bg-panel);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  padding: 20px;
  position: relative;
  transition: background-color 0.3s ease;
}

.panel-title {
  font-size: 20px;
  color: var(--accent-cyan);
  margin-bottom: 20px;
  font-weight: bold;
  border-left: 4px solid var(--accent-cyan);
  padding-left: 10px;
}

.check-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.check-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: var(--bg-panel);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  transition: all 0.3s ease;
}

.check-label {
  font-size: 16px;
  color: var(--text-secondary);
}

.status-tag {
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  min-width: 60px;
  text-align: center;
}

.status-pending {
  background: var(--bg-panel);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.status-ok {
  background: rgba(0, 230, 118, 0.2);
  color: var(--accent-green);
  border: 1px solid var(--accent-green);
  transition: all 0.3s ease;
}

.status-err {
  background: rgba(255, 51, 0, 0.2);
  color: var(--accent-red);
  border: 1px solid var(--accent-red);
  transition: all 0.3s ease;
}

.tip-box {
  margin-top: auto;
  padding: 15px;
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.5;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

.warning-text {
  color: #ffd103;
}

.process-visual {
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.step-track {
  display: flex;
  justify-content: space-between;
  width: 85%;
  position: relative;
  margin-bottom: 60px;
}

.step-track::before {
  content: '';
  position: absolute;
  top: 25px;
  left: 0;
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  z-index: 0;
}

.step-track-fill {
  position: absolute;
  top: 25px;
  left: 0;
  height: 4px;
  background: var(--accent-cyan);
  z-index: 0;
  transition: width 0.5s ease;
}

.step-node {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  opacity: 0.5;
  transition: all 0.5s;
}

.step-node.active {
  opacity: 1;
}

.step-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid #555;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  transition: all 0.5s;
}

.step-node.active .step-icon {
  border-color: var(--accent-cyan);
  color: var(--accent-cyan);
  background: rgba(0, 242, 254, 0.1);
  box-shadow: 0 0 15px var(--accent-cyan);
}

.step-node.done .step-icon {
  border-color: var(--accent-green);
  color: var(--accent-green);
  background: rgba(0, 230, 118, 0.1);
}

.anim-stage {
  width: 100%;
  height: 350px;
  background: radial-gradient(circle, rgba(79, 172, 254, 0.05) 0%, transparent 70%);
  border: 1px dashed var(--border-color);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
}

.status-big {
  font-size: 28px;
  font-weight: bold;
  color: var(--accent-cyan);
  text-shadow: 0 0 20px var(--accent-cyan);
  margin-top: 20px;
}

.status-big.success {
  color: var(--accent-green);
  text-shadow: 0 0 20px var(--accent-green);
}

.idle-icon {
  font-size: 60px;
  opacity: 0.3;
}

.idle-text {
  color: var(--text-secondary);
  text-shadow: none;
}

.pressure-info {
  color: #fff;
  margin-top: 10px;
}

.pump-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  100% { transform: rotate(360deg); }
}

.done-icon {
  font-size: 80px;
  color: var(--accent-green);
}

.error-overlay {
  text-align: center;
  position: absolute;
  background: rgba(0, 0, 0, 0.85);
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.error-icon {
  font-size: 60px;
}

.error-text {
  color: var(--accent-red);
  font-size: 24px;
  margin-top: 20px;
}

.reset-btn {
  margin-top: 20px;
  padding: 10px 30px;
  background: var(--accent-red);
  border: none;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
  font-weight: bold;
}

.console-log {
  flex: 1;
  background: var(--bg-panel);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 15px;
  font-family: 'Consolas', monospace;
  font-size: 13px;
  color: var(--text-primary);
  overflow-y: auto;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column-reverse;
  gap: 5px;
  transition: all 0.3s ease;
}

.log-line.error { color: #ff3300; }
.log-line.info { color: #4facfe; }
.log-line.success { color: #00e676; }

.btn-start-large {
  width: 100%;
  height: 80px;
  background: linear-gradient(90deg, #00f2fe, #4facfe);
  border: none;
  border-radius: 8px;
  color: #000;
  font-size: 24px;
  font-weight: bold;
  letter-spacing: 4px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 20px rgba(0, 242, 254, 0.3);
}

.btn-start-large:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(0, 242, 254, 0.5);
}

.btn-start-large.btn-stop {
  background: linear-gradient(90deg, #ff6b6b, #ee5a5a);
  color: #fff;
}

.btn-start-large.btn-stop:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(255, 107, 107, 0.5);
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
  margin-bottom: 20px;
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

.btn-start-large:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}
</style>
