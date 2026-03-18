import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('../components/MainLayout.vue'),
      redirect: '/home',
      children: [
        {
          path: 'home',
          name: 'home',
          component: () => import('../views/Home.vue'),
          meta: { title: '首页' }
        },
        {
          path: 'terminal',
          name: 'terminal',
          component: () => import('../views/StationTerminal.vue'),
          meta: { title: '智慧换热站智能终端' }
        },
        {
          path: 'patrol',
          name: 'patrol',
          component: () => import('../views/StationPatrol.vue'),
          meta: { title: '一键巡站' }
        },
        {
          path: 'startup',
          name: 'startup',
          component: () => import('../views/StationStartup.vue'),
          meta: { title: '一键启停' }
        },
        {
          path: 'health',
          name: 'health',
          component: () => import('../views/HealthMonitor.vue'),
          meta: { title: '健康监测分析' }
        },
        {
          path: 'assets',
          name: 'assets',
          component: () => import('../views/AssetInventory.vue'),
          meta: { title: '资产盘点' }
        },
        {
          path: 'settings',
          name: 'settings',
          component: () => import('../views/SystemSettings.vue'),
          meta: { title: '系统设置' }
        }
      ]
    }
  ]
});

export default router;
