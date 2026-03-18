<script setup>
defineProps({
  title: String,
  showIcon: {
    type: Boolean,
    default: true
  }
});
</script>

<template>
  <div class="panel">
    <div class="panel-header">
      <div class="header-left">
        <i v-if="showIcon" class="iconfont icon-panel-decorator"></i>
        <span>{{ title }}</span>
      </div>
      <slot name="header-right"></slot>
    </div>
    <div class="panel-body">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.panel {
  background: var(--bg-panel);
  border: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
}

.panel-header {
  height: 32px;
  padding: 0 12px;
  background: var(--bg-header);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  font-weight: bold;
  color: var(--accent-blue);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.panel-body {
  flex: 1;
  position: relative;
  overflow: hidden;
}
</style>
