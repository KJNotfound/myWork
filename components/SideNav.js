// components/SideNav.js
const SideNav = {
  template: `
    <aside class="side-nav">
      <div class="nav-wrapper">
        <div v-for="item in menuItems" 
             :key="item.path" 
             :class="['nav-item', { active: currentPath.includes(item.path) }]"
             @click="navigate(item.path)">
          <i class="iconfont nav-icon" v-html="item.icon"></i>
          <div class="nav-label">{{ item.label }}</div>
        </div>
      </div>
    </aside>
  `,
  setup() {
    // 统一配置菜单项，这里的 iconfont 代码需确保与你 fonts/iconfont.css 一致
    const menuItems = [
      { label: '首页', path: 'home.html', icon: '&#xe603;' },
      { label: '换热站', path: 'smart_heating_station_terminal.html', icon: '&#xe84a;' },
      { label: '一键巡站', path: 'station_patrol.html', icon: '&#xe65c;' },
      { label: '一键启停', path: 'station_startup.html', icon: '&#xe6db;' },
      { label: '健康监测', path: 'health_monitor.html', icon: '&#xe61f;' },
      { label: '资产盘点', path: 'asset_inventory.html', icon: '&#xe668;' },
      { label: '系统设置', path: 'system_settings.html', icon: '&#xe602;' },
    ]

    // 自动检测当前处于哪个页面，用于高亮
    const currentPath = window.location.pathname.split('/').pop() || 'home.html'

    const navigate = (path) => {
      if (currentPath !== path) {
        // 增加切换时的淡出动效（如果需要可以保留）
        document.body.style.opacity = '0'
        setTimeout(() => {
          window.location.href = path
        }, 150)
      }
    }

    return { menuItems, currentPath, navigate }
  },
}
