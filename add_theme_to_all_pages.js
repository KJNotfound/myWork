// 批量为所有HTML页面添加主题切换功能的脚本
const fs = require('fs');
const path = require('path');

// 需要添加主题切换的页面列表
const pages = [
  'asset_inventory.html',
  'home.html', 
  'health_monitor.html',
  'scada_process_react.html',
  'station_patrol.html',
  'station_startup.html',
  'system_settings.html',
  '工艺流程图SCADA.html'
];

// 主题配置脚本引用
const themeScriptRef = '  <!-- 主题配置 -->\n  <script src="theme-config.js"></script>\n';

// 主题切换按钮HTML
const themeButtonHtml = `  <!-- 主题切换按钮 -->
  <div class="theme-toggle" onclick="ThemeConfig.toggle()" title="切换主题">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  </div>
`;

// 基础白天模式CSS样式
const baseLightModeCSS = `
    /* 白天模式样式 */
    .light-mode {
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%) !important;
      color: #1e293b !important;
    }

    /* 主题切换按钮样式 */
    .theme-toggle {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1000;
      background: rgba(15, 23, 42, 0.9);
      border: 1px solid rgba(30, 41, 59, 0.8);
      border-radius: 50%;
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .theme-toggle:hover {
      transform: scale(1.1);
    }

    .theme-toggle svg {
      width: 24px;
      height: 24px;
      color: white;
      transition: all 0.3s ease;
    }

    .light-mode .theme-toggle {
      background: rgba(255, 255, 255, 0.9);
      border-color: rgba(37, 99, 235, 0.3);
    }

    .light-mode .theme-toggle svg {
      color: #1e40af;
    }
`;

// 为每个页面添加主题切换功能
pages.forEach(page => {
  const filePath = path.join(__dirname, page);
  
  if (!fs.existsSync(filePath)) {
    console.log(`文件不存在: ${page}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // 检查是否已经有主题配置
  if (content.includes('theme-config.js')) {
    console.log(`${page} 已经包含主题配置，跳过`);
    return;
  }
  
  // 在head中添加主题配置脚本引用
  content = content.replace(
    /(<link[^>]*iconfont\.css[^>]*>)/,
    `$1\n${themeScriptRef}`
  );
  
  // 在样式末尾添加白天模式CSS
  content = content.replace(
    /(<\/style>)/,
    `${baseLightModeCSS}\n  $1`
  );
  
  // 在body开始处添加主题切换按钮
  content = content.replace(
    /(<body[^>]*>)/,
    `$1\n${themeButtonHtml}`
  );
  
  // 保存文件
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ 已为 ${page} 添加主题切换功能`);
});

console.log('\n🎉 所有页面主题切换功能添加完成！');
console.log('现在每个页面都可以使用统一的白天/深色模式切换了。');
