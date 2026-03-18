<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const navigate = (path) => {
  router.push(path);
};
</script>

<template>
  <div class="home-view">
    <header class="nav-header">
      <h2 class="glow-title">换热站智能终端控制中心</h2>
    </header>

    <section class="function-grid">
      <div class="grid-card active-module" @click="navigate('/patrol')">
        <i class="iconfont">&#xe65c;</i>
        <div class="label">一键巡站</div>
      </div>
      <div class="grid-card empty-slot"></div>
      <div class="grid-card active-module" @click="navigate('/health')">
        <i class="iconfont">&#xe61f;</i>
        <div class="label">健康监测分析</div>
      </div>

      <div class="grid-card empty-slot"></div>

      <div class="grid-card active-module center-module" @click="navigate('/terminal')">
        <i class="iconfont">&#xe84a;</i>
        <div class="label">我的换热站</div>
      </div>

      <div class="grid-card empty-slot"></div>

      <div class="grid-card active-module" @click="navigate('/startup')">
        <i class="iconfont">&#xe6db;</i>
        <div class="label">一键启停</div>
      </div>
      <div class="grid-card empty-slot"></div>
      <div class="grid-card active-module" @click="navigate('/assets')">
        <i class="iconfont">&#xe668;</i>
        <div class="label">资产盘点</div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-view {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.nav-header {
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--bg-header);
  border-bottom: 2px solid var(--border-color);
  box-shadow: var(--shadow-premium);
  z-index: 10;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.glow-title {
  color: var(--text-primary);
  font-size: 2rem;
  letter-spacing: 6px;
  font-weight: bold;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.9), 0 0 20px rgba(255, 255, 255, 0.4);
  margin: 0;
  transition: color 0.3s ease;
}

body.light-mode .glow-title {
  color: var(--accent-blue);
  text-shadow: 0 0 10px rgba(37, 99, 235, 0.3);
}

.function-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 25px;
  padding: 40px;
  position: relative;
  z-index: 10;
}

.grid-card {
  background: var(--bg-panel);
  border: 1px solid var(--border-color);
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: all 0.4s ease;
  cursor: pointer;
  z-index: 5;
}

.grid-card::before,
.grid-card::after {
  content: "";
  position: absolute;
  width: 15px;
  height: 15px;
  border: 2px solid var(--accent-blue);
}

.grid-card::before {
  top: -1px;
  left: -1px;
  border-right: none;
  border-bottom: none;
}

.grid-card::after {
  bottom: -1px;
  right: -1px;
  border-left: none;
  border-top: none;
}

.grid-card .iconfont {
  font-size: 40px;
  color: #60a5fa;
  margin-bottom: 6px;
  filter: drop-shadow(0 0 5px #60a5fa);
  transition: all 0.3s ease;
}

.label {
  font-size: 1.4rem;
  color: var(--text-secondary);
  letter-spacing: 2px;
  transition: color 0.3s ease;
}

.center-module {
  background: var(--bg-panel);
}

.grid-card:hover {
  transform: translateY(-5px) scale(1.02);
  border-color: #ffffff;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 80%);
  box-shadow: 0 0 30px rgba(79, 172, 254, 0.3);
}

.grid-card:hover .label {
  color: var(--accent-blue);
  text-shadow: 0 0 10px var(--accent-blue);
}

.grid-card:hover .iconfont {
  color: var(--accent-blue);
  filter: drop-shadow(0 0 10px var(--accent-blue));
}

.empty-slot {
  border: 1px dashed rgba(79, 172, 254, 0.1);
  background: transparent;
  pointer-events: none;
}
</style>
