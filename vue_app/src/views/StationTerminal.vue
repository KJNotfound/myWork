<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';
import * as echarts from 'echarts';
import ScadaFlowchart from '../components/ScadaFlowchart.vue';
import ParticleBackground from '../components/ParticleBackground.vue';
import { useThemeStore } from '../stores/theme';

const themeStore = useThemeStore();

// Chart refs
const energyCurveRef = ref(null);
const supplyTempRef = ref(null);
const roomDistRef = ref(null);
const resistancePieRef = ref(null);

let charts = {};

const energyRange = ref('24小时');
const energyRanges = ['24小时', '上周', '上月', '本采暖季'];

const activeZone = ref('low'); // Shared state for SCADA

onMounted(() => {
  initCharts();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  Object.values(charts).forEach(chart => chart?.dispose());
});

// Watch for theme changes to re-init charts
watch(() => themeStore.lightMode, () => {
  initCharts();
});

const handleResize = () => {
  Object.values(charts).forEach(chart => chart?.resize());
};

const initCharts = () => {
  const textColor = getComputedStyle(document.body).getPropertyValue('--text-secondary').trim() || '#94a3b8';
  const accentColor = getComputedStyle(document.body).getPropertyValue('--accent-cyan').trim() || '#06b6d4';
  const borderColor = 'rgba(255, 255, 255, 0.05)';

  // 1. 能耗曲线 (Line)
  if (energyCurveRef.value) {
    charts.energy = echarts.init(energyCurveRef.value);
    charts.energy.setOption({
      grid: { top: 30, bottom: 40, left: 45, right: 15 },
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00'],
        axisLabel: { color: textColor, fontSize: 10 },
        axisLine: { lineStyle: { color: 'rgba(79, 172, 254, 0.2)' } }
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: textColor, fontSize: 10 },
        splitLine: { lineStyle: { color: borderColor } }
      },
      series: [{
        name: '能耗',
        type: 'line',
        smooth: true,
        data: [120, 150, 130, 170, 140, 160],
        lineStyle: { width: 3, color: '#06b6d4' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(6, 182, 212, 0.3)' },
            { offset: 1, color: 'rgba(6, 182, 212, 0)' }
          ])
        }
      }]
    });
  }

  // 2. 供温曲线 (3 Lines: ACTUAL, SET, FORECAST)
  if (supplyTempRef.value) {
    charts.supplyTemp = echarts.init(supplyTempRef.value);
    charts.supplyTemp.setOption({
      grid: { top: 40, bottom: 30, left: 40, right: 15 },
      tooltip: { trigger: 'axis' },
      legend: { data: ['实际供温', '设定供温', '预测供温'], textStyle: { color: textColor, fontSize: 10 }, top: 0 },
      xAxis: {
        type: 'category',
        data: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'],
        axisLabel: { color: textColor, fontSize: 10 }
      },
      yAxis: { type: 'value', min: 35, max: 65, axisLabel: { color: textColor, fontSize: 10 } },
      series: [
        { name: '实际供温', type: 'line', smooth: true, data: [45, 48, 50, 52, 49, 47], itemStyle: { color: '#3b82f6' } },
        { name: '设定供温', type: 'line', step: 'start', data: [50, 50, 50, 50, 55, 55], lineStyle: { type: 'dashed' }, itemStyle: { color: '#06b6d4' } },
        { name: '预测供温', type: 'line', smooth: true, data: [44, 47, 49, 53, 56, 58], lineStyle: { type: 'dotted' }, itemStyle: { color: '#8b5cf6' } }
      ]
    });
  }

  // 3. 室温分布 (Bar)
  if (roomDistRef.value) {
    charts.roomDist = echarts.init(roomDistRef.value);
    charts.roomDist.setOption({
      grid: { top: 20, bottom: 40, left: 40, right: 15 },
      xAxis: { type: 'category', data: ['18℃以下', '18-20℃', '20-22℃', '22-24℃', '24℃以上'], axisLabel: { color: textColor, fontSize: 9 } },
      yAxis: { type: 'value', axisLabel: { color: textColor, fontSize: 10 } },
      series: [{
        type: 'bar',
        barWidth: '40%',
        data: [15, 45, 120, 80, 20],
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#06b6d4' }, { offset: 1, color: '#3b82f6' }])
        }
      }]
    });
  }

  // 4. 机组阻力饼图 (Ring)
  if (resistancePieRef.value) {
    charts.resistance = echarts.init(resistancePieRef.value);
    charts.resistance.setOption({
      tooltip: { trigger: 'item' },
      series: [{
        type: 'pie',
        radius: ['45%', '70%'],
        avoidLabelOverlap: false,
        label: { show: true, position: 'outside', color: textColor, fontSize: 10, formatter: '{b}\n{d}%' },
        data: [
          { value: 40, name: '板换', itemStyle: { color: '#3b82f6' } },
          { value: 25, name: '除污器', itemStyle: { color: '#06b6d4' } },
          { value: 20, name: '外网', itemStyle: { color: '#8b5cf6' } },
          { value: 15, name: '其他', itemStyle: { color: '#64748b' } }
        ]
      }]
    });
  }
};
</script>

<template>
  <div class="terminal-view">
    <ParticleBackground v-if="!themeStore.lightMode" />
    
    <main class="cockpit-layout">
      <!-- Left Column: Energy & Overview -->
      <section class="column side">
        <!-- (1) 机组基本概况 -->
        <div class="panel">
          <div class="panel-header">机组基本概况</div>
          <div class="panel-body">
            <table class="simple-info-table">
              <tbody>
                <tr><td class="label">入网面积</td><td class="val">27.2万㎡</td><td class="label">入网户数</td><td class="val">2460户</td></tr>
                <tr><td class="label">供热比</td><td class="val">96.7%</td><td class="label">节能形式</td><td class="val">气候补偿</td></tr>
                <tr><td class="label">散热形式</td><td class="val">地暖/暖气片</td><td class="label">入网时间</td><td class="val">2024-10-15</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- (2) 我的能耗情况 -->
        <div class="panel">
          <div class="panel-header">
            <span>我的能耗情况</span>
            <div class="header-tools">
              <span v-for="r in energyRanges" :key="r" @click="energyRange = r" :class="{ active: energyRange === r }">{{ r }}</span>
            </div>
          </div>
          <div class="panel-body">
            <table class="rank-table">
              <thead>
                <tr><th>机组</th><th>热单耗</th><th>室温</th><th>电单耗</th><th>水单耗</th></tr>
              </thead>
              <tbody>
                <tr><td>低区</td><td>12.6 <span class="rank">5/30</span></td><td>22.1 <span class="rank">12/30</span></td><td>4.50 <span class="rank">8/30</span></td><td>36.0 <span class="rank">4/30</span></td></tr>
                <tr><td>中区</td><td>11.2 <span class="rank">2/30</span></td><td>21.8 <span class="rank">15/30</span></td><td>4.20 <span class="rank">6/30</span></td><td>34.5 <span class="rank">3/30</span></td></tr>
                <tr><td>高区</td><td>13.4 <span class="rank">8/30</span></td><td>22.5 <span class="rank">9/30</span></td><td>4.85 <span class="rank">11/30</span></td><td>38.2 <span class="rank">7/30</span></td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- (3) 能耗曲线 -->
        <div class="panel">
          <div class="panel-header">能耗曲线</div>
          <div class="panel-body">
            <div ref="energyCurveRef" class="chart-box"></div>
          </div>
        </div>
      </section>

      <!-- Middle Column: Core Process & Logic -->
      <section class="column middle">
        <!-- (1) 机组工艺流程图 -->
        <div class="panel scada">
          <div class="panel-header">机组工艺流程图</div>
          <div class="panel-body scada-body">
             <ScadaFlowchart v-model:activeZone="activeZone" />
          </div>
        </div>

        <!-- (2) 下半部分: 供温曲线 & 室温分布 -->
        <div class="bottom-charts">
          <div class="panel">
            <div class="panel-header">供温曲线</div>
            <div class="panel-body">
              <div ref="supplyTempRef" class="chart-box"></div>
            </div>
          </div>
          <div class="panel">
            <div class="panel-header">室温分布</div>
            <div class="panel-body relative">
              <div ref="roomDistRef" class="chart-box"></div>
              
            </div>
          </div>
        </div>
      </section>

      <!-- Right Column: Tasks & Charts -->
      <section class="column side">
        <!-- (1) 任务清单/检修计划 -->
        <div class="panel">
          <div class="panel-header">任务清单 / 检修计划</div>
          <div class="panel-body scroll-container">
            <div class="task-scroll">
              <div class="task-row alarm"><span class="tag">故障</span><span class="text">二网压差异常报警 - 处理中</span></div>
              <div class="task-row routine"><span class="tag">例行</span><span class="text">1#泵回温数据周期性巡检</span></div>
              <div class="task-row alarm"><span class="tag">故障</span><span class="text">高区补水泵变频器通讯中断</span></div>
              <div class="task-row routine"><span class="tag">例行</span><span class="text">站房安防视频系统日常抽检</span></div>
              <div class="task-row routine"><span class="tag">例行</span><span class="text">过滤器前后压差清理提醒</span></div>
            </div>
          </div>
        </div>

        <!-- (2) 机组阻力饼图 -->
        <div class="panel">
          <div class="panel-header">机组阻力饼图</div>
          <div class="panel-body">
            <div ref="resistancePieRef" class="chart-box"></div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.terminal-view {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background-color: var(--bg-color);
  color: var(--text-primary);
  transition: background-color 0.3s ease;
}

.cockpit-layout {
  position: relative;
  z-index: 10;
  display: flex;
  height: 100%;
  padding: 15px;
  gap: 15px;
}

.column {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.column.side {
  width: 420px;
}

.column.middle {
  flex: 1;
}

.panel {
  background: var(--bg-panel);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: var(--shadow-premium);
  transition: all 0.3s ease;
}

/* Specific Panel Heights */
.column.side .panel:nth-child(1) { height: 25%; }
.column.side .panel:nth-child(2) { height: 35%; }
.column.side .panel:nth-child(3) { height: 40%; }

.column.side:last-child .panel:nth-child(1) { height: 60%; }
.column.side:last-child .panel:nth-child(2) { height: 40%; }

.column.middle .panel.scada { height: 65%; }
.bottom-charts { height: 35%; display: flex; gap: 15px; }
.bottom-charts .panel { flex: 1; }

.panel-header {
  height: 38px;
  padding: 0 15px;
  background: var(--bg-header);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  font-weight: bold;
  color: var(--accent-blue);
  letter-spacing: 1px;
}

.panel-body {
  flex: 1;
  padding: 12px;
  overflow: hidden;
  color: var(--text-primary);
}

.scada-body {
  padding: 0;
  background-color: var(--bg-cockpit);
}

.chart-box {
  width: 100%;
  height: 100%;
}

/* Tables Styling */
.simple-info-table, .rank-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

.simple-info-table td {
  padding: 10px 5px;
  border-bottom: 1px solid var(--border-color);
}

.simple-info-table .label { color: var(--text-secondary); width: 80px; }
.simple-info-table .val { color: var(--text-primary); font-weight: bold; }

.rank-table th {
  text-align: left;
  color: var(--accent-cyan);
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-color);
}

.rank-table td {
  padding: 12px 2px;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-primary);
}

.rank-table .rank {
  font-size: 10px;
  color: var(--text-muted);
  margin-left: 5px;
}

/* Header Tools (Tabs) */
.header-tools { display: flex; gap: 6px; }
.header-tools span {
  font-size: 10px;
  padding: 2px 6px;
  background: rgba(128, 128, 128, 0.1);
  border-radius: 2px;
  cursor: pointer;
  color: var(--text-secondary);
}
.header-tools span.active { background: var(--accent-blue); color: #fff; }

/* Task Scrolling */
.scroll-container { overflow-y: auto; }
.task-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-bottom: 1px solid var(--border-color);
}

.task-row .tag {
  padding: 2px 6px;
  font-size: 10px;
  border-radius: 2px;
}

.task-row.alarm .tag { background: rgba(239, 68, 68, 0.2); color: #ef4444; }
.task-row.routine .tag { background: rgba(59, 130, 246, 0.2); color: #3b82f6; }
.task-row .text { font-size: 12px; color: var(--text-secondary); }

/* Responsive adjustments */
@media screen and (max-width: 1400px) {
  .column.side { width: 350px; }
}
</style>
