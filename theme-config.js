// 主题配置文件 - 白天/深色模式切换
window.ThemeConfig = {
  // 深色模式配置
  dark: {
    background: '#020617',
    panel: '#0f172a',
    border: '#1e293b',
    text: '#ffffff',
    textSecondary: '#9ca3af',
    textMuted: '#6b7280',
    grid: 'radial-gradient(rgba(100, 116, 139, 0.25) 1px, transparent 1px)',
    colors: {
      cyan: '#06b6d4',
      blue: '#3b82f6',
      red: '#ef4444',
      orange: '#f97316',
      purple: '#8b5cf6',
    },
  },

  // 白天模式配置
  light: {
    background: '#f8fafc',
    panel: '#ffffff',
    border: '#e2e8f0',
    text: '#1e293b',
    textSecondary: '#64748b',
    textMuted: '#94a3b8',
    grid: 'radial-gradient(rgba(148, 163, 184, 0.3) 1px, transparent 1px)',
    colors: {
      cyan: '#0891b2',
      blue: '#2563eb',
      red: '#dc2626',
      orange: '#ea580c',
      purple: '#7c3aed',
    },
  },

  // 获取当前主题
  getCurrent: function () {
    return document.body.classList.contains('light-mode') ? this.light : this.dark
  },

  // 应用主题
  apply: function (theme) {
    const config = this[theme]
    const root = document.documentElement
    const body = document.body

    // 移除现有主题类
    body.classList.remove('light-mode', 'dark-mode')

    // 添加新主题类
    body.classList.add(`${theme}-mode`)

    // 更新CSS变量
    root.style.setProperty('--theme-bg', config.background)
    root.style.setProperty('--theme-panel', config.panel)
    root.style.setProperty('--theme-border', config.border)
    root.style.setProperty('--theme-text', config.text)
    root.style.setProperty('--theme-text-secondary', config.textSecondary)
    root.style.setProperty('--theme-text-muted', config.textMuted)
    root.style.setProperty('--theme-grid', config.grid)

    // 更新切换按钮状态
    this.updateToggleButton(theme)

    // 保存到本地存储
    localStorage.setItem('theme', theme)

    // 触发主题变化事件
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }))
  },

  // 更新切换按钮状态
  updateToggleButton: function (theme) {
    const moonSlider = document.getElementById('themeSlider')
    const sunSlider = document.getElementById('themeSliderSun')

    if (moonSlider && sunSlider) {
      if (theme === 'light') {
        moonSlider.style.display = 'none'
        sunSlider.style.display = 'flex'
      } else {
        moonSlider.style.display = 'flex'
        sunSlider.style.display = 'none'
      }
    }
  },

  // 初始化主题
  init: function () {
    const savedTheme = localStorage.getItem('theme') || 'dark'
    this.apply(savedTheme)

    // 监听本地存储变化，实现多标签页同步
    window.addEventListener('storage', (event) => {
      if (event.key === 'theme') {
        const newTheme = event.newValue
        if (newTheme && (newTheme === 'dark' || newTheme === 'light')) {
          this.apply(newTheme)
        }
      }
    })
  },

  // 切换主题
  toggle: function () {
    const currentTheme = localStorage.getItem('theme') || 'dark'
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark'
    this.apply(newTheme)
  },
}

// 页面加载完成后初始化主题
document.addEventListener('DOMContentLoaded', function () {
  ThemeConfig.init()
})
