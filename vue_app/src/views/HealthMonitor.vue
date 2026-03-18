<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue';

const isScanning = ref(false);
const scanProgress = ref(0);
const healthScore = ref(0);
const scanTimer = ref("00:00:00");
const userInput = ref("");
const currentSelectedId = ref(null);
const chatBoxRef = ref(null);

onMounted(() => {
  setTimeout(startScan, 500);
});

const categories = reactive([
  {
    id: 1, title: "系统连接和健康状态", isOpen: true, errorCount: 2,
    items: [
      { id: 101, desc: "1. 目前换热站实时温度105℃异常", aiAnalysis: "目前换热站内温度显示过高，检测到是5分钟前突发性的，考虑站内环境温度表计异常。建议立即派人核查表计或检查是否有火灾隐患。" },
      { id: 102, desc: "2. 目前低区换热器换热效率为10%异常", aiAnalysis: "板换效率极低，且一二次侧温差过大。初步判断为板片严重结垢或反接。建议列入检修计划进行反冲洗。" }
    ]
  },
  {
    id: 2, title: "异常数据校验", isOpen: false, errorCount: 1,
    items: [{ id: 201, desc: "1. 一次侧阀门开度0%但有大流量", aiAnalysis: "物理逻辑冲突：阀门反馈关闭但流量计读数很大。可能是阀门反馈信号故障或流量计漂移。建议优先检查阀门限位开关。" }]
  },
  {
    id: 3, title: "经济运行情况", isOpen: false, errorCount: 1,
    items: [{ id: 301, desc: "1. 夜间补水量异常偏高", aiAnalysis: "夜间补水量达到 5t/h，远超正常值。结合压力曲线分析，疑似二网末端存在泄漏或用户放水。建议排查高区管网。" }]
  }
]);

const totalErrors = computed(() => categories.reduce((sum, c) => sum + c.errorCount, 0));
const messages = reactive([{ role: 'ai', text: '体检已完成。左侧列出了检测到的异常项目，请点击查看详细分析。', hasAction: false }]);

const scrollToBottom = async () => {
  await nextTick();
  if (chatBoxRef.value) {
    chatBoxRef.value.scrollTop = chatBoxRef.value.scrollHeight;
  }
};

const startScan = () => {
  isScanning.value = true;
  scanProgress.value = 0;
  healthScore.value = 0;
  messages.length = 0;
  let p = 0;
  const interval = setInterval(() => {
    p += 2;
    scanProgress.value = p;
    const sec = Math.floor(p / 100 * 600);
    scanTimer.value = `00:${Math.floor(sec / 60).toString().padStart(2, '0')}:${(sec % 60).toString().padStart(2, '0')}`;
    if (p >= 100) {
      clearInterval(interval);
      isScanning.value = false;
      healthScore.value = 85;
      messages.push({ role: 'ai', text: '监测完成！发现 ' + totalErrors.value + ' 个异常项，请点击左侧列表查看分析。', hasAction: false });
      scrollToBottom();
    }
  }, 30);
};

const toggleCategory = (cate) => cate.isOpen = !cate.isOpen;

const selectIssue = (item) => {
  currentSelectedId.value = item.id;
  setTimeout(() => {
    messages.push({ 
      role: 'ai', 
      text: `<strong>针对 "${item.desc}" 的分析：</strong><br/>${item.aiAnalysis}`, 
      hasAction: true, 
      isSynced: false, 
      relatedId: item.id 
    });
    scrollToBottom();
  }, 300);
};

const syncToTask = (msg) => {
  if (!msg.isSynced) msg.isSynced = true;
};

const sendMessage = () => {
  if (!userInput.value.trim()) return;
  messages.push({ role: 'user', text: userInput.value });
  const input = userInput.value;
  userInput.value = "";
  scrollToBottom();

  setTimeout(() => {
    messages.push({ 
      role: 'ai', 
      text: `针对您的疑问 "${input}"，建议优先排查传感器接线和输出模块。`, 
      hasAction: false 
    });
    scrollToBottom();
  }, 1000);
};

onMounted(() => {
  setTimeout(startScan, 500);
});
</script>

<template>
  <div class="health-view">
    <header class="view-header">
  <div class="header-left">
    <div class="page-title">健康检测系统</div>
    <div class="page-subtitle">HEALTH MONITORING SYSTEM</div>
  </div>
</header>

    <div class="header-section">
      <div class="progress-wrapper">
        <div v-if="isScanning" class="progress-track">
          <div class="progress-bar" :style="{ width: scanProgress + '%' }"></div>
        </div>
        <div v-else class="score-display">
          健康评分: <span :class="healthScore > 80 ? 'accent-green' : 'accent-red'">{{ healthScore }}</span>
        </div>
      </div>
      <div class="stats-row">
        <div class="stat-item"><span>监测对象：</span><span class="stat-val">38个</span></div>
        <div class="stat-item"><span>总用时：</span><span class="stat-val">{{ scanTimer }}</span></div>
        <div class="stat-item"><span>发现异常：</span><span class="stat-val danger">{{ totalErrors }}个</span></div>
        <button class="btn-restart" @click="startScan">{{ isScanning ? '监测中...' : '再次监测' }}</button>
      </div>
    </div>

    <div class="main-content">
      <div class="left-panel">
        <div class="panel-header">检测项目清单</div>
        <div class="accordion-container">
          <div class="acc-item" v-for="cate in categories" :key="cate.id">
            <div class="acc-header" @click="toggleCategory(cate)">
              <span class="acc-title">{{ cate.title }}</span>
              <div class="acc-info">
                <span v-if="cate.errorCount > 0" class="error-count">异常: {{ cate.errorCount }}个</span>
                <span class="arrow">{{ cate.isOpen ? '▲' : '▼' }}</span>
              </div>
            </div>
            <div class="acc-body" :class="{ open: cate.isOpen }">
              <div 
                v-for="item in cate.items" 
                :key="item.id" 
                class="error-item"
                :class="{ active: currentSelectedId === item.id }" 
                @click="selectIssue(item)"
              >
                <span class="dot">●</span>{{ item.desc }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="right-panel">
        <div class="panel-header">AI 结果分析</div>
        <div class="chat-container" ref="chatBoxRef">
          <div v-for="(msg, index) in messages" :key="index" class="chat-msg" :class="msg.role">
            <div class="avatar">
              <i v-if="msg.role === 'ai'" class="iconfont">&#xe87d;</i>
              <i v-else class="iconfont">&#xe602;</i>
            </div>
            <div class="msg-content">
              <div v-html="msg.text"></div>
              <div v-if="msg.role === 'ai' && msg.hasAction">
                <button class="btn-action" :class="{ synced: msg.isSynced }" @click="syncToTask(msg)">
                  {{ msg.isSynced ? '✔ 已完成同步' : '⚡ 同步至任务列表' }}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="input-area">
          <input 
            type="text" 
            class="chat-input" 
            v-model="userInput" 
            @keyup.enter="sendMessage"
            placeholder="针对当前问题询问 AI..."
          >
          <button class="btn-send" @click="sendMessage">➤</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.health-view {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.header-section {
  height: 120px;
  background: var(--bg-panel);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 0 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: background-color 0.3s ease;
}

.progress-wrapper {
  width: 100%;
  height: 30px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.progress-track {
  flex: 1;
  height: 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--accent-blue), var(--accent-cyan));
  width: 0%;
  transition: width 0.3s ease;
  box-shadow: 0 0 10px var(--accent-cyan);
}

.score-display {
  font-size: 28px;
  font-weight: bold;
  color: var(--accent-cyan);
}

.accent-green { color: var(--accent-green); }
.accent-red { color: var(--accent-red); }

.stats-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
  font-size: 16px;
  color: var(--text-secondary);
}

.stat-val {
  color: var(--text-primary);
  font-weight: bold;
  font-size: 18px;
  margin-left: 5px;
  transition: color 0.3s ease;
}

.stat-val.danger {
  color: var(--accent-red);
  font-size: 20px;
}

.btn-restart {
  padding: 6px 20px;
  background: rgba(0, 242, 254, 0.15);
  border: 1px solid var(--accent-cyan);
  color: var(--accent-cyan);
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s;
}

.btn-restart:hover {
  background: var(--accent-cyan);
  color: #000;
}

.main-content {
  flex: 1;
  display: flex;
  gap: 15px;
  overflow: hidden;
}

.left-panel, .right-panel {
  background: var(--bg-panel);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: background-color 0.3s ease;
}

.left-panel { flex: 0.4; }
.right-panel { flex: 0.6; }

.panel-header {
  height: 48px;
  background: var(--bg-header);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  padding: 0 20px;
  font-size: 18px;
  font-weight: bold;
  color: var(--accent-blue);
  transition: background-color 0.3s ease;
}

.accordion-container {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.acc-item {
  margin-bottom: 8px;
  border: 1px solid var(--border-color);
  background: var(--bg-panel);
  transition: all 0.3s ease;
}

.acc-header {
  padding: 12px 15px;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
}

.acc-title {
  font-size: 16px;
  color: var(--text-primary);
  transition: color 0.3s ease;
}

.acc-info {
  display: flex;
  align-items: center;
}

.error-count {
  color: var(--accent-red);
  margin-right: 10px;
  font-weight: bold;
}

.arrow {
  color: var(--text-secondary);
  font-size: 12px;
}

.acc-body {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-out;
}

.acc-body.open {
  max-height: 600px;
}

.error-item {
  padding: 10px 15px 10px 30px;
  border-top: 1px dashed var(--border-color);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
}

.error-item:hover, .error-item.active {
  background: rgba(239, 68, 68, 0.1);
  color: var(--text-primary);
  border-left: 3px solid var(--accent-red);
}

.dot {
  color: var(--accent-red);
  margin-right: 8px;
}

.chat-container {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.chat-msg {
  display: flex;
  gap: 15px;
  max-width: 90%;
}

.chat-msg.user {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #000;
  border: 1px solid var(--accent-blue);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.msg-content {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color);
  padding: 12px 15px;
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 14px;
  line-height: 1.6;
  transition: all 0.3s ease;
}

.chat-msg.ai .msg-content {
  border-top-left-radius: 0;
  border-color: var(--accent-blue);
}

.chat-msg.user .msg-content {
  border-top-right-radius: 0;
  background: rgba(79, 172, 254, 0.2);
}

.btn-action {
  margin-top: 10px;
  padding: 5px 12px;
  font-size: 12px;
  border: 1px solid var(--accent-red);
  color: var(--accent-red);
  border-radius: 15px;
  cursor: pointer;
  background: transparent;
  transition: all 0.3s;
}

.btn-action:hover {
  background: var(--accent-red);
  color: #fff;
}

.btn-action.synced {
  border-color: var(--accent-green);
  color: var(--accent-green);
  cursor: default;
}

.input-area {
  height: 60px;
  border-top: 1px solid var(--border-color);
  padding: 0 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  background: transparent;
  transition: all 0.3s ease;
}

.chat-input {
  flex: 1;
  height: 36px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color);
  border-radius: 18px;
  padding: 0 15px;
  color: var(--text-primary);
  outline: none;
  transition: all 0.3s ease;
}

.btn-send {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--accent-blue);
  border: none;
  color: #fff;
  cursor: pointer;
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

</style>
