const fs = require('fs')
const path = require('path')

// 需要更新的文件列表
const htmlFiles = [
  'smart_heating_station_terminal.html',
  '工艺流程图SCADA.html',
  'scada_process_react.html',
  'station_startup.html',
  'station_patrol.html',
  'system_settings.html',
  'health_monitor.html',
  'asset_inventory.html',
  'home.html',
]

// 资源映射表
const resourceMap = {
  // React SCADA 资源
  'https://unpkg.com/react@18/umd/react.production.min.js': '../libs/react.production.min.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js': '../libs/react-dom.production.min.js',
  'https://unpkg.com/@babel/standalone/babel.min.js': '../libs/babel.min.js',
  'https://cdn.tailwindcss.com': '../libs/tailwindcss.js',
  'https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Inter:wght@400;500;600;700&display=swap':
    '../libs/google-fonts.css',
}

console.log('🚀 开始更新本地资源引用...\n')

htmlFiles.forEach((filename) => {
  const filePath = path.join(__dirname, filename)

  if (!fs.existsSync(filePath)) {
    console.log(`❌ 文件不存在: ${filename}`)
    return
  }

  let content = fs.readFileSync(filePath, 'utf8')
  let updated = false

  // 替换每个外部资源引用
  Object.entries(resourceMap).forEach(([external, local]) => {
    if (content.includes(external)) {
      content = content.replace(new RegExp(external.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), local)
      console.log(`✅ ${filename}: 已更新 ${external}`)
      updated = true
    }
  })

  // 如果有更新，写回文件
  if (updated) {
    fs.writeFileSync(filePath, content)
    console.log(`💾 已保存: ${filename}\n`)
  } else {
    console.log(`ℹ️  ${filename}: 无需更新\n`)
  }
})

console.log('🎉 资源引用更新完成！')
console.log('\n📋 资源清单:')
Object.entries(resourceMap).forEach(([external, local]) => {
  console.log(`  ${local} ← ${external}`)
})
