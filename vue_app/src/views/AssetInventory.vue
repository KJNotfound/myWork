<script setup>
import { ref, reactive, computed, onMounted } from 'vue';

const isScanning = ref(false);
const scanProgress = ref(0);
const authStep = ref('camera');
const showRadarDot = ref(false);

const showManualModal = ref(false);
const showSubmitModal = ref(false);
const showSuccessToast = ref(false);
const toastMessage = ref('');

const manualForm = reactive({
  id: '',
  name: '',
  type: '动力设备',
  remark: ''
});

const typeOptions = ['动力设备', '换热设备', '监测仪器', '控制设备', '管道阀门'];

const assets = reactive([
  { id: 'ST-001', name: '1# 循环泵', type: '动力设备', status: 'pending', time: '-' },
  { id: 'ST-002', name: '2# 循环泵', type: '动力设备', status: 'pending', time: '-' },
  { id: 'ST-003', name: '1# 补水泵', type: '动力设备', status: 'pending', time: '-' },
  { id: 'ST-004', name: '1# 换热器', type: '换热设备', status: 'pending', time: '-' },
  { id: 'ST-005', name: '2# 换热器', type: '换热设备', status: 'pending', time: '-' },
  { id: 'ST-006', name: '一次网流量计', type: '监测仪器', status: 'pending', time: '-' },
  { id: 'ST-007', name: '压力变送器 A', type: '监测仪器', status: 'pending', time: '-' }
]);

const scannedCount = computed(() => assets.filter(a => a.status === 'ok').length);
const totalPercent = computed(() => Math.round((scannedCount.value / assets.length) * 100));

const startInventory = async () => {
  isScanning.value = true;
  for (let i = 0; i < assets.length; i++) {
    await new Promise(r => setTimeout(r, 800));
    assets[i].status = 'ok';
    assets[i].time = new Date().toLocaleTimeString();
    showRadarDot.value = true;
    setTimeout(() => showRadarDot.value = false, 500);
  }
  isScanning.value = false;
};

const openManualModal = () => {
  manualForm.id = '';
  manualForm.name = '';
  manualForm.type = '动力设备';
  manualForm.remark = '';
  showManualModal.value = true;
};

const closeManualModal = () => {
  showManualModal.value = false;
};

const submitManualEntry = () => {
  if (!manualForm.id.trim() || !manualForm.name.trim()) {
    showToast('请填写完整的资产信息');
    return;
  }
  
  const exists = assets.find(a => a.id === manualForm.id.trim());
  if (exists) {
    exists.status = 'ok';
    exists.time = new Date().toLocaleTimeString();
    showToast(`资产 ${manualForm.id} 已更新`);
  } else {
    assets.push({
      id: manualForm.id.trim(),
      name: manualForm.name.trim(),
      type: manualForm.type,
      status: 'ok',
      time: new Date().toLocaleTimeString()
    });
    showToast(`资产 ${manualForm.id} 已添加`);
  }
  
  closeManualModal();
};

const openSubmitModal = () => {
  if (scannedCount.value === 0) {
    showToast('请先完成资产盘点');
    return;
  }
  showSubmitModal.value = true;
};

const closeSubmitModal = () => {
  showSubmitModal.value = false;
};

const confirmSubmit = () => {
  closeSubmitModal();
  showToast('盘点报告已提交成功！');
  
  setTimeout(() => {
    assets.forEach(asset => {
      asset.status = 'pending';
      asset.time = '-';
    });
  }, 1500);
};

const showToast = (msg) => {
  toastMessage.value = msg;
  showSuccessToast.value = true;
  setTimeout(() => {
    showSuccessToast.value = false;
  }, 2500);
};

onMounted(() => {
  setTimeout(startInventory, 1000);
});
</script>

<template>
  <div class="inventory-view">
    <header class="view-header">
  <div class="header-left">
    <div class="page-title">站内资产盘点</div>
    <div class="page-subtitle">ASSET INVENTORY SYSTEM</div>
  </div>
</header>

    <div class="inventory-grid">
      <div class="panel">
        <div class="panel-header">
          <span>资产实物清单</span>
          <span class="tech-number">TOTAL: {{ assets.length }}</span>
        </div>
        <div class="asset-table-container">
          <table class="asset-table">
            <thead>
              <tr>
                <th>编号</th>
                <th>名称</th>
                <th>类别</th>
                <th>盘点状态</th>
                <th>更新时间</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="asset in assets" 
                :key="asset.id"
                :class="{ 'row-scanned': asset.status === 'ok' }"
              >
                <td>{{ asset.id }}</td>
                <td>{{ asset.name }}</td>
                <td>{{ asset.type }}</td>
                <td>
                  <span class="status-badge" :class="'status-' + asset.status">
                    {{ asset.status === 'ok' ? '已盘点' : '待扫描' }}
                  </span>
                </td>
                <td>{{ asset.time }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="dashboard-panel panel">
        <div class="chart-box">
          <div class="tech-border top-left"></div>
          <div class="tech-border top-right"></div>
          <div class="tech-border bottom-left"></div>
          <div class="tech-border bottom-right"></div>
          
          <svg width="200" height="200" viewBox="0 0 200 200" class="progress-svg">
            <circle cx="100" cy="100" r="80" stroke="rgba(79, 172, 254, 0.1)" stroke-width="12" fill="none" />
            <circle 
              cx="100" cy="100" r="80" 
              stroke="url(#grad1)" 
              stroke-width="12" 
              fill="none" 
              stroke-dasharray="502"
              :stroke-dashoffset="502 - (502 * totalPercent / 100)"
              transform="rotate(-90 100 100)"
              style="transition: stroke-dashoffset 0.8s ease"
            />
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#00f2fe" />
                <stop offset="100%" style="stop-color:#4facfe" />
              </linearGradient>
            </defs>
          </svg>
          
          <div class="progress-info">
            <div class="progress-percent">{{ totalPercent }}%</div>
            <div class="progress-label">盘点进度</div>
          </div>
        </div>

        <div class="stat-row">
          <div class="stat-item">
            <div class="stat-num">{{ scannedCount }}</div>
            <div class="stat-desc">已确认</div>
          </div>
          <div class="stat-item">
            <div class="stat-num danger">{{ assets.length - scannedCount }}</div>
            <div class="stat-desc">待盘点</div>
          </div>
        </div>

        <div class="radar-box">
          <div class="radar-scan">
            <div v-if="showRadarDot" class="radar-dot"></div>
          </div>
          <div class="radar-status">RFID 智能扫描中...</div>
        </div>

        <div class="btn-group">
          <button class="btn btn-manual" @click="openManualModal">手动补录</button>
          <button class="btn btn-submit" :disabled="isScanning" @click="openSubmitModal">提交报告</button>
        </div>
      </div>
    </div>

    <div v-if="showManualModal" class="modal-overlay" @click.self="closeManualModal">
      <div class="modal-content">
        <div class="modal-header">
          <span>手动补录资产</span>
          <button class="modal-close" @click="closeManualModal">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>资产编号</label>
            <input v-model="manualForm.id" type="text" placeholder="请输入资产编号" />
          </div>
          <div class="form-group">
            <label>资产名称</label>
            <input v-model="manualForm.name" type="text" placeholder="请输入资产名称" />
          </div>
          <div class="form-group">
            <label>资产类型</label>
            <select v-model="manualForm.type">
              <option v-for="opt in typeOptions" :key="opt" :value="opt">{{ opt }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>备注</label>
            <textarea v-model="manualForm.remark" placeholder="选填"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-cancel" @click="closeManualModal">取消</button>
          <button class="btn btn-confirm" @click="submitManualEntry">确认添加</button>
        </div>
      </div>
    </div>

    <div v-if="showSubmitModal" class="modal-overlay" @click.self="closeSubmitModal">
      <div class="modal-content modal-small">
        <div class="modal-header">
          <span>提交盘点报告</span>
          <button class="modal-close" @click="closeSubmitModal">&times;</button>
        </div>
        <div class="modal-body">
          <div class="submit-summary">
            <div class="summary-item">
              <span class="summary-label">已盘点资产</span>
              <span class="summary-value">{{ scannedCount }} 项</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">盘点进度</span>
              <span class="summary-value">{{ totalPercent }}%</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">待盘点资产</span>
              <span class="summary-value warning">{{ assets.length - scannedCount }} 项</span>
            </div>
          </div>
          <p class="submit-tip">确认提交后，盘点数据将被记录并生成报告。</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-cancel" @click="closeSubmitModal">取消</button>
          <button class="btn btn-confirm" @click="confirmSubmit">确认提交</button>
        </div>
      </div>
    </div>

    <transition name="toast">
      <div v-if="showSuccessToast" class="toast-message">
        {{ toastMessage }}
      </div>
    </transition>
  </div>
</template>

<style scoped>
.inventory-view {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
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

.page-time {
  font-size: 20px;
  color: var(--accent-cyan);
  font-family: 'Share Tech Mono', monospace;
}

.inventory-grid {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 20px;
  overflow: hidden;
}

.panel {
  background: var(--bg-panel);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  transition: background-color 0.3s ease;
}

.panel-header {
  height: 50px;
  background: var(--bg-header);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  font-size: 18px;
  font-weight: bold;
  color: var(--accent-blue);
  transition: background-color 0.3s ease;
}

.asset-table-container {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.asset-table {
  width: 100%;
  border-collapse: collapse;
}

.asset-table th {
  position: sticky;
  top: 0;
  background: var(--bg-header);
  z-index: 10;
  padding: 15px;
  text-align: left;
  color: var(--text-secondary);
  border-bottom: 2px solid var(--border-color);
  transition: background-color 0.3s ease;
}

.asset-table td {
  padding: 12px 15px;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-primary);
  transition: all 0.3s;
}

.row-scanned {
  background: rgba(0, 230, 118, 0.05);
}

.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}

.status-pending { background: rgba(255, 255, 255, 0.1); color: #aaa; }
.status-ok { background: rgba(0, 230, 118, 0.2); color: var(--accent-green); border: 1px solid var(--accent-green); }

.dashboard-panel {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.chart-box {
  height: 220px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress-info {
  position: absolute;
  text-align: center;
}

.progress-percent {
  font-size: 36px;
  font-weight: bold;
  color: var(--accent-cyan);
}

.progress-label {
  font-size: 14px;
  color: var(--text-secondary);
}

.stat-row {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.stat-item {
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  padding: 15px;
  border-radius: 8px;
  text-align: center;
}

.stat-num {
  font-size: 24px;
  font-weight: bold;
  color: var(--text-primary);
  transition: color 0.3s ease;
}

.stat-num.danger { color: var(--accent-red); }

.stat-desc {
  font-size: 12px;
  color: var(--text-secondary);
}

.radar-box {
  flex: 1;
  background: var(--bg-panel);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  transition: background 0.3s ease;
}

.radar-scan {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 1px solid rgba(0, 242, 254, 0.6);
  position: relative;
  box-shadow: 0 0 10px rgba(0, 242, 254, 0.4);
}

.radar-scan::after {
  content: '';
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  border-radius: 50%;
  background: conic-gradient(from 0deg, transparent 0deg, rgba(0, 242, 254, 0.6) 60deg, transparent 60deg);
  animation: scanRotate 2s linear infinite;
  box-shadow: 0 0 15px rgba(0, 242, 254, 0.5);
}

@keyframes scanRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.radar-dot {
  position: absolute;
  width: 8px;
  height: 8px;
  background: var(--accent-green);
  border-radius: 50%;
  box-shadow: 0 0 10px var(--accent-green);
  top: 40%;
  left: 60%;
}

.radar-status {
  font-size: 14px;
  color: var(--accent-cyan);
}

.btn-group {
  display: flex;
  gap: 15px;
}

.btn {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
}

.btn-manual { background: linear-gradient(90deg, #00f2fe, #4facfe); color: #000; transition: all 0.3s ease; }
.btn-manual:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(0, 242, 254, 0.4); }
.btn-submit { background: linear-gradient(90deg, #00f2fe, #4facfe); color: #000; transition: all 0.3s ease; }
.btn-submit:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(0, 242, 254, 0.4); }
.btn-submit:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

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
  width: 420px;
  max-width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  transition: background-color 0.3s ease;
}

.modal-small {
  width: 360px;
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
  transition: background-color 0.3s ease;
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
  padding: 20px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: var(--text-secondary);
  font-size: 14px;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px 12px;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  color: var(--text-primary);
  font-size: 14px;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--accent-blue);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.form-group textarea {
  min-height: 80px;
  resize: vertical;
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
  background: linear-gradient(90deg, #00f2fe, #4facfe);
  color: #000;
  font-weight: bold;
}

.btn-confirm:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 242, 254, 0.3);
}

.submit-summary {
  background: var(--bg-color);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid var(--border-color);
}

.summary-item:last-child {
  border-bottom: none;
}

.summary-label {
  color: var(--text-secondary);
}

.summary-value {
  color: var(--accent-cyan);
  font-weight: bold;
}

.summary-value.warning {
  color: var(--accent-orange);
}

.submit-tip {
  color: var(--text-secondary);
  font-size: 13px;
  text-align: center;
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

.tech-border {
  position: absolute;
  width: 20px;
  height: 20px;
  border: 1px solid rgba(0, 242, 255, 0.4);
}

.top-left { top: 10px; left: 10px; border-right: none; border-bottom: none; }
.top-right { top: 10px; right: 10px; border-left: none; border-bottom: none; }
.bottom-left { bottom: 10px; left: 10px; border-right: none; border-top: none; }
.bottom-right { bottom: 10px; right: 10px; border-left: none; border-top: none; }
</style>
