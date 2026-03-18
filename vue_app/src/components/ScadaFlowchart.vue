<script setup>
import { ref, computed } from 'vue';

const props = defineProps(['activeZone']);
const emit = defineEmits(['update:activeZone']);

const ZONES_DATA = {
  low: {
    name: '低区机组 (Low Zone)', status: 'normal',
    data: {
      primSupT: { val: 85.2, unit: '℃' }, primSupP: { val: 1.25, unit: 'MPa' }, primSupF: { val: 150.4, unit: 't/h' },
      valvePrim: { val: 72, unit: '%' }, valveSec: { val: 88, unit: '%' },
      dirtDropP: { val: 0.05, unit: 'MPa' }, hxPrimInP: { val: 1.20, unit: 'MPa' }, hxPrimOutP: { val: 0.95, unit: 'MPa' },
      primRetT: { val: 55.4, unit: '℃' }, primRetP: { val: 0.90, unit: 'MPa' }, primRetF: { val: 150.4, unit: 't/h' },
      secSupT: { val: 60.5, unit: '℃' }, secSupP: { val: 0.65, unit: 'MPa' }, secSupF: { val: 210.5, unit: 't/h' },
      hxSecOutP: { val: 0.65, unit: 'MPa' }, hxSecInP: { val: 0.75, unit: 'MPa' },
      pumpOutP: { val: 0.75, unit: 'MPa' }, pumpInP: { val: 0.50, unit: 'MPa' },
      secRetT: { val: 45.3, unit: '℃' }, secRetP: { val: 0.50, unit: 'MPa' }, secRetF: { val: 245.0, unit: 't/h' }
    }, anomalies: {}
  },
  mid: {
    name: '中区机组 (Middle Zone)', status: 'warning',
    data: {
      primSupT: { val: 95.0, unit: '℃' }, primSupP: { val: 1.45, unit: 'MPa' }, primSupF: { val: 180.2, unit: 't/h' },
      valvePrim: { val: 85, unit: '%' }, valveSec: { val: 92, unit: '%' },
      dirtDropP: { val: 0.35, unit: 'MPa' }, hxPrimInP: { val: 1.10, unit: 'MPa' }, hxPrimOutP: { val: 0.85, unit: 'MPa' },
      primRetT: { val: 62.1, unit: '℃' }, primRetP: { val: 0.80, unit: 'MPa' }, primRetF: { val: 180.2, unit: 't/h' },
      secSupT: { val: 68.2, unit: '℃' }, secSupP: { val: 0.85, unit: 'MPa' }, secSupF: { val: 245.0, unit: 't/h' },
      hxSecOutP: { val: 0.85, unit: 'MPa' }, hxSecInP: { val: 0.95, unit: 'MPa' },
      pumpOutP: { val: 0.95, unit: 'MPa' }, pumpInP: { val: 0.50, unit: 'MPa' },
      secRetT: { val: 45.3, unit: '℃' }, secRetP: { val: 0.50, unit: 'MPa' }, secRetF: { val: 245.0, unit: 't/h' }
    }, anomalies: { dirtDropP: true }
  },
  high: {
    name: '高区机组 (High Zone)', status: 'error',
    data: {
      primSupT: { val: 110.5, unit: '℃' }, primSupP: { val: 1.85, unit: 'MPa' }, primSupF: { val: 210.6, unit: 't/h' },
      valvePrim: { val: 95, unit: '%' }, valveSec: { val: 78, unit: '%' },
      dirtDropP: { val: 0.08, unit: 'MPa' }, hxPrimInP: { val: 1.77, unit: 'MPa' }, hxPrimOutP: { val: 1.45, unit: 'MPa' },
      primRetT: { val: 70.4, unit: '℃' }, primRetP: { val: 1.40, unit: 'MPa' }, primRetF: { val: 210.6, unit: 't/h' },
      secSupT: { val: 80.5, unit: '℃' }, secSupP: { val: 1.15, unit: 'MPa' }, secSupF: { val: 120.5, unit: 't/h' },
      hxSecOutP: { val: 1.15, unit: 'MPa' }, hxSecInP: { val: 1.25, unit: 'MPa' },
      pumpOutP: { val: 1.25, unit: 'MPa' }, pumpInP: { val: 0.12, unit: 'MPa' },
      secRetT: { val: 55.1, unit: '℃' }, secRetP: { val: 0.12, unit: 'MPa' }, secRetF: { val: 120.5, unit: 't/h' }
    }, anomalies: { pumpInP: true, pumpOutP: true, secRetP: true }
  }
};

const current = computed(() => ZONES_DATA[props.activeZone]);

// Pre-map the data for the template to avoid repeated .value.data access
const displayData = computed(() => {
  const c = current.value;
  if (!c || !c.data) return null;
  
  return {
    ...c,
    labels: [
      { id: 'dirt', label: '除污器压差', val: c.data.dirtDropP, error: c.anomalies.dirtDropP },
      { id: 'prim-in', label: '一网进站压', val: c.data.hxPrimInP, error: c.anomalies.hxPrimInP },
      { id: 'sec-out', label: '二网出站压', val: c.data.hxSecOutP, error: c.anomalies.hxSecOutP },
      { id: 'prim-out', label: '一网出站压', val: c.data.hxPrimOutP, error: c.anomalies.hxPrimOutP },
      { id: 'sec-in', label: '板换进口压', val: c.data.hxSecInP, error: c.anomalies.hxSecInP },
      { id: 'pump-out', label: '泵出口压力', val: c.data.pumpOutP, error: c.anomalies.pumpOutP },
      { id: 'pump-in', label: '泵进口压力', val: c.data.pumpInP, error: c.anomalies.pumpInP }
    ]
  };
});
</script>

<template>
  <div v-if="displayData" class="scada-container w-full h-full flex flex-col items-center select-none overflow-hidden bg-scada-bg">
    <!-- Main SCADA Stages -->
    <main class="scada-main w-full flex-1 relative rounded-2xl shadow-lg overflow-hidden scada-grid">
      
      <!-- Tabs Header -->
      <header class="absolute top-2 left-1/2 -translate-x-1/2 flex justify-center items-center z-20">
        <div class="inline-flex rounded-lg overflow-hidden border border-scada-border">
          <button
            v-for="(zone, key) in ZONES_DATA"
            :key="key"
            @click="emit('update:activeZone', key)"
            :class="[
              'zone-btn relative inline-flex items-center justify-center gap-1.5 px-6 py-2 text-[11px] font-mono font-semibold tracking-widest transition-all duration-300 border-r border-scada-border last:border-r-0 min-w-[100px] overflow-hidden',
              activeZone === key ? 'zone-btn-active' : 'zone-btn-inactive'
            ]"
          >
            <span :class="[
              'zone-indicator w-2 h-2 rounded-full flex-shrink-0 transition-all duration-300',
              zone.status === 'error' ? 'zone-indicator-error' :
              zone.status === 'warning' ? 'zone-indicator-warning' :
              'zone-indicator-normal'
            ]" :title="zone.status"></span>
            <span class="relative z-10">{{ zone.name.split(' ')[0] }}</span>
            <div v-if="activeZone === key" class="zone-underline absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full"></div>
          </button>
        </div>
      </header>
      
      <!-- Network Badges -->
      <div class="badge-nw badge-top-left z-20 p-2 rounded-lg border bg-slate-900/80 border-cyan-500/30 shadow-lg min-w-[140px] backdrop-blur-md">
        <div class="text-[10px] text-slate-400 border-b border-slate-700/50 pb-1 mb-1 font-bold">一次供水管网</div>
        <div class="flex justify-between items-baseline mb-1">
          <span class="text-[9px] text-slate-500">供水温</span>
          <span class="text-xs font-mono font-bold text-scada-cyan">{{ displayData.data.primSupT.val }}℃</span>
        </div>
        <div class="flex justify-between items-baseline">
          <span class="text-[9px] text-slate-500">进站压</span>
          <span class="text-xs font-mono font-bold text-scada-cyan">{{ displayData.data.primSupP.val }}MPa</span>
        </div>
      </div>

      <div class="badge-nw badge-bottom-left z-20 p-2 rounded-lg border bg-slate-900/80 border-cyan-500/30 shadow-lg min-w-[140px] backdrop-blur-md">
        <div class="text-[10px] text-slate-400 border-b border-slate-700/50 pb-1 mb-1 font-bold">一次回水管网</div>
        <div class="flex justify-between items-baseline mb-1">
          <span class="text-[9px] text-slate-500">回水温</span>
          <span class="text-xs font-mono font-bold text-scada-cyan">{{ displayData.data.primRetT.val }}℃</span>
        </div>
        <div class="flex justify-between items-baseline">
          <span class="text-[9px] text-slate-500">出站压</span>
          <span class="text-xs font-mono font-bold text-scada-cyan">{{ displayData.data.primRetP.val }}MPa</span>
        </div>
      </div>

      <div class="badge-nw badge-top-right z-20 p-2 rounded-lg border bg-slate-900/80 border-cyan-500/30 shadow-lg min-w-[140px] backdrop-blur-md">
        <div class="text-[10px] text-slate-400 border-b border-slate-700/50 pb-1 mb-1 font-bold">二次供水管网</div>
        <div class="flex justify-between items-baseline mb-1">
          <span class="text-[9px] text-slate-500">供水温</span>
          <span class="text-xs font-mono font-bold text-scada-cyan">{{ displayData.data.secSupT.val }}℃</span>
        </div>
        <div class="flex justify-between items-baseline">
          <span class="text-[9px] text-slate-500">出站压</span>
          <span class="text-xs font-mono font-bold text-scada-cyan">{{ displayData.data.secSupP.val }}MPa</span>
        </div>
      </div>

      <div class="badge-nw badge-bottom-right z-20 p-2 rounded-lg border bg-slate-900/80 border-cyan-500/30 shadow-lg min-w-[140px] backdrop-blur-md">
        <div class="text-[10px] text-slate-400 border-b border-slate-700/50 pb-1 mb-1 font-bold">二次回水管网</div>
        <div class="flex justify-between items-baseline mb-1">
          <span class="text-[9px] text-slate-500">回水温</span>
          <span class="text-xs font-mono font-bold text-scada-cyan">{{ displayData.data.secRetT.val }}℃</span>
        </div>
        <div class="flex justify-between items-baseline">
          <span class="text-[9px] text-slate-500">进站压</span>
          <span class="text-xs font-mono font-bold text-scada-cyan">{{ displayData.data.secRetP.val }}MPa</span>
        </div>
      </div>

      <!-- SVG Process Flow -->
      <svg viewBox="0 0 1200 600" class="scada-svg absolute inset-0 w-full h-full z-10" preserveAspectRatio="xMidYMid meet">
        <defs>
          <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient id="hx-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0f172a" />
            <stop offset="100%" stop-color="#020617" />
          </linearGradient>
        </defs>

        <!-- Pipelines -->
        <g stroke-linecap="round" fill="none">
          <!-- 一次供水管道 (红色) - 向右流动 -->
          <path d="M 100 220 L 530 220" stroke="var(--accent-red)" stroke-width="12" opacity="0.6" />
          <path d="M 100 220 L 530 220" stroke="var(--accent-red)" stroke-width="4" opacity="0.8" stroke-dasharray="15 20">
            <animate attributeName="stroke-dashoffset" from="35" to="0" dur="1s" repeatCount="indefinite" />
          </path>
          
          <!-- 一次回水管道 (紫色) - 向左流动 -->
          <path d="M 530 380 L 100 380" stroke="var(--accent-purple)" stroke-width="12" opacity="0.6" />
          <path d="M 530 380 L 100 380" stroke="var(--accent-purple)" stroke-width="4" opacity="0.8" stroke-dasharray="15 20">
            <animate attributeName="stroke-dashoffset" from="35" to="0" dur="1.2s" repeatCount="indefinite" />
          </path>
          
          <!-- 二次供水管道 (橙色) - 向右流动 -->
          <path d="M 670 220 L 1100 220" stroke="var(--accent-orange)" stroke-width="12" opacity="0.6" />
          <path d="M 670 220 L 1100 220" stroke="var(--accent-orange)" stroke-width="4" opacity="0.8" stroke-dasharray="15 20">
            <animate attributeName="stroke-dashoffset" from="35" to="0" dur="0.8s" repeatCount="indefinite" />
          </path>
          
          <!-- 二次回水管道 (蓝色) - 向左流动 -->
          <path d="M 1100 380 L 670 380" stroke="var(--accent-blue)" stroke-width="12" opacity="0.6" />
          <path d="M 1100 380 L 670 380" stroke="var(--accent-blue)" stroke-width="4" opacity="0.8" stroke-dasharray="15 20">
            <animate attributeName="stroke-dashoffset" from="35" to="0" dur="1s" repeatCount="indefinite" />
          </path>
        </g>

        <!-- Equipment Icons -->
        <g transform="translate(275, 195)">
          <rect width="50" height="50" rx="4" fill="var(--bg-panel)" stroke="var(--accent-orange)" stroke-width="2" />
          <line x1="10" y1="40" x2="40" y2="10" stroke="var(--accent-orange)" stroke-width="2" stroke-dasharray="4 2" />
          <text x="25" y="75" text-anchor="middle" font-size="12" fill="var(--text-secondary)" font-weight="bold">除污器</text>
        </g>

        <g transform="translate(530, 150)">
          <rect width="140" height="300" rx="8" fill="var(--bg-panel)" stroke="var(--accent-blue)" stroke-width="3" />
          <text x="70" y="140" text-anchor="middle" font-size="20" fill="var(--text-primary)" font-weight="extrabold" letter-spacing="4">板式</text>
          <text x="70" y="175" text-anchor="middle" font-size="20" fill="var(--text-primary)" font-weight="extrabold" letter-spacing="4">换热</text>
        </g>

        <g transform="translate(980, 380)">
          <circle r="34" fill="var(--bg-panel)" stroke="var(--accent-blue)" stroke-width="3" />
          <g class="animate-[spin_4s_linear_infinite]">
            <rect x="-2" y="-18" width="4" height="36" fill="var(--accent-blue)" />
            <rect x="-18" y="-2" width="36" height="4" fill="var(--accent-blue)" />
          </g>
          <text x="0" y="65" text-anchor="middle" font-size="12" fill="var(--text-secondary)" font-weight="bold">1# 循环泵</text>
        </g>
      </svg>
      
      <!-- Suspended Data Labels (DataBadges) -->
      <div class="labels-container absolute inset-0 z-30 pointer-events-none">
        <!-- Explicitly positioned floating labels -->
        <div v-for="(item, index) in displayData.labels" :key="item.id"
          class="data-label absolute pointer-events-auto"
          :class="[item.id, item.error ? 'is-error' : '']">
          <div class="label-header">
            {{ item.label }}
            <span v-if="item.error" class="error-warn">⚠️</span>
          </div>
          <div class="label-value">
            <span class="num">{{ item.val.val.toFixed(2) }}</span>
            <span class="unit">{{ item.val.unit }}</span>
          </div>
        </div>
      </div>

      <!-- Footer Legend -->
      <footer class="absolute bottom-2 left-1/2 -translate-x-1/2 flex justify-center gap-6 text-[11px] font-bold tracking-widest text-slate-500 z-20">
        <div class="flex items-center gap-1.5">
          <span class="w-2.5 h-2.5 rounded-full bg-scada-cyan shadow-[0_0_8px_#06b6d4]"></span> 数据正常
        </div>
        <div class="flex items-center gap-1.5">
          <span class="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_10px_#ef4444] animate-pulse"></span> 告警拦截
        </div>
      </footer>
    </main>
  </div>
</template>

<style scoped>
.scada-container {
  display: flex !important;
  flex-direction: column !important;
  position: relative;
  width: 100%;
  height: 100%;
}

.tabs-header {
  position: relative !important;
  z-index: 50 !important;
}

/* Zone Buttons Styles */
.zone-btn {
  position: relative;
  cursor: pointer;
}

.zone-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, transparent 0%, rgba(6, 182, 212, 0.1) 50%, transparent 100%);
  transform: translateX(-100%);
  transition: transform 0.5s ease;
}

.zone-btn:hover::before {
  transform: translateX(100%);
}

.zone-btn-active {
  background: rgba(6, 182, 212, 0.15);
  color: var(--accent-cyan);
  text-shadow: 0 0 8px var(--accent-cyan);
}

.zone-btn-active::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, rgba(6, 182, 212, 0.2) 0%, transparent 70%);
  animation: pulse-glow 2s ease-in-out infinite;
}

.zone-btn-inactive {
  color: var(--text-secondary);
}

.zone-btn-inactive:hover {
  color: var(--accent-blue);
  background: rgba(37, 99, 235, 0.1);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
}

.zone-indicator {
  position: relative;
}

.zone-indicator-normal {
  background: #10b981;
  box-shadow: 0 0 8px #10b981;
  animation: glow-pulse 2s ease-in-out infinite;
}

.zone-indicator-warning {
  background: #f97316;
  box-shadow: 0 0 12px #f97316;
  animation: warning-pulse 1s ease-in-out infinite;
}

.zone-indicator-error {
  background: #ef4444;
  box-shadow: 0 0 16px #ef4444;
  animation: error-pulse 0.5s ease-in-out infinite;
}

.zone-underline {
  background: var(--accent-cyan);
  box-shadow: 0 0 10px var(--accent-cyan);
  animation: underline-glow 1.5s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

@keyframes glow-pulse {
  0%, 100% { 
    transform: scale(1);
    box-shadow: 0 0 8px #10b981;
  }
  50% { 
    transform: scale(1.2);
    box-shadow: 0 0 16px #10b981;
  }
}

@keyframes warning-pulse {
  0%, 100% { 
    transform: scale(1);
    box-shadow: 0 0 12px #f97316;
  }
  50% { 
    transform: scale(1.3);
    box-shadow: 0 0 20px #f97316;
  }
}

@keyframes error-pulse {
  0%, 100% { 
    transform: scale(1);
    box-shadow: 0 0 16px #ef4444;
  }
  50% { 
    transform: scale(1.4);
    box-shadow: 0 0 24px #ef4444;
  }
}

@keyframes underline-glow {
  0%, 100% { 
    opacity: 0.7;
    box-shadow: 0 0 10px var(--accent-cyan);
  }
  50% { 
    opacity: 1;
    box-shadow: 0 0 20px var(--accent-cyan);
  }
}

.scada-main {
  position: relative;
  overflow: hidden;
  background: var(--bg-panel);
  background-image: var(--scada-grid);
  background-size: 20px 20px;
  transition: all 0.3s ease;
}

/* Network Badges Positioning */
.badge-nw {
  position: absolute !important;
  background: var(--bg-panel);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-premium);
  transition: all 0.3s ease;
}
.badge-top-left { top: 48px; left: 20px; }
.badge-bottom-left { bottom: 20px; left: 20px; }
.badge-top-right { top: 48px; right: 20px; }
.badge-bottom-right { bottom: 20px; right: 20px; }

/* Data Labels (Floating Badges) Style */
.data-label {
  padding: 8px;
  background: var(--bg-panel);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  min-width: 100px;
  box-shadow: var(--shadow-premium);
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

.data-label.is-error {
  border-color: var(--accent-red);
  background: var(--bg-panel);
  box-shadow: 0 0 10px rgba(239, 68, 68, 0.2);
  transition: all 0.3s ease;
}

.label-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 10px;
  color: var(--text-secondary);
  font-weight: bold;
  margin-bottom: 4px;
  transition: all 0.3s ease;
}

.error-warn {
  color: var(--accent-red);
  animation: pulse 1s infinite;
  font-size: 12px;
  transition: all 0.3s ease;
}

.label-value {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.label-value .num {
  font-family: monospace;
  font-size: 16px;
  font-weight: bold;
  color: var(--accent-blue);
  transition: all 0.3s ease;
}

.label-value .unit {
  font-size: 9px;
  color: var(--text-muted);
  font-weight: bold;
  transition: all 0.3s ease;
}

.data-label.is-error .num { color: var(--accent-red); transition: all 0.3s ease; }

/* Specific Coordinates */
.data-label.dirt { left: 25%; top: 18%; }
.data-label.prim-in { left: 38%; top: 18%; }
.data-label.sec-out { left: 62%; top: 18%; }
.data-label.prim-out { left: 38%; top: 82%; }
.data-label.sec-in { left: 62%; top: 82%; }
.data-label.pump-out { left: 75%; top: 82%; }
.data-label.pump-in { left: 88%; top: 82%; }

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
