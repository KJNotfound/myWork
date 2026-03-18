const fs = require('fs');
const path = require('path');

const directory = '.';
const files = fs.readdirSync(directory).filter(file => file.endsWith('.html'));

files.forEach(file => {
    const filePath = path.join(directory, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Remove HTML theme-toggle
    content = content.replace(/<!-- 主题切换按钮 -->\s*<div class="theme-toggle"[\s\S]*?<\/div>/g, '');
    content = content.replace(/<div class="theme-toggle"[\s\S]*?<\/div>/g, '');

    // Remove CSS theme-toggle
    content = content.replace(/\/\* 主题切换按钮样式 \*\/[\s\S]*?\.theme-toggle[\s\S]*?{[\s\S]*?}[\s\S]*?\.theme-toggle:hover[\s\S]*?{[\s\S]*?}[\s\S]*?\.theme-toggle svg[\s\S]*?{[\s\S]*?}[\s\S]*?\.light-mode \.theme-toggle[\s\S]*?{[\s\S]*?}[\s\S]*?\.light-mode \.theme-toggle svg[\s\S]*?{[\s\S]*?}/g, '');
    
    // Catch variants
    content = content.replace(/\.theme-toggle[\s\S]*?{[\s\S]*?}/g, '');
    content = content.replace(/\.theme-toggle:hover[\s\S]*?{[\s\S]*?}/g, '');
    content = content.replace(/\.theme-toggle:active[\s\S]*?{[\s\S]*?}/g, '');
    content = content.replace(/\.theme-toggle svg[\s\S]*?{[\s\S]*?}/g, '');
    content = content.replace(/\.theme-toggle-slider[\s\S]*?{[\s\S]*?}/g, '');
    content = content.replace(/\.theme-toggle-slider svg[\s\S]*?{[\s\S]*?}/g, '');
    content = content.replace(/\.theme-toggle-slider\.moon[\s\S]*?{[\s\S]*?}/g, '');
    content = content.replace(/\.theme-toggle-slider\.sun[\s\S]*?{[\s\S]*?}/g, '');
    content = content.replace(/\.light-mode \.theme-toggle[\s\S]*?{[\s\S]*?}/g, '');
    content = content.replace(/\.light-mode \.theme-toggle:hover[\s\S]*?{[\s\S]*?}/g, '');
    content = content.replace(/\.light-mode \.theme-toggle-slider\.moon[\s\S]*?{[\s\S]*?}/g, '');
    content = content.replace(/\.light-mode \.theme-toggle-slider\.sun[\s\S]*?{[\s\S]*?}/g, '');
    content = content.replace(/\.light-mode \.theme-toggle-slider svg[\s\S]*?{[\s\S]*?}/g, '');
    content = content.replace(/\.light-mode \.theme-toggle svg[\s\S]*?{[\s\S]*?}/g, '');
    content = content.replace(/body\.light-mode \.theme-toggle[\s\S]*?{[\s\S]*?}/g, '');
    content = content.replace(/body\.light-mode \.theme-toggle svg[\s\S]*?{[\s\S]*?}/g, '');

    fs.writeFileSync(filePath, content, 'utf8');
});
