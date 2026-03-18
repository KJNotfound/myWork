# Smart Heat（智慧换热站前端）

面向“换热站智能终端控制中心”的前端项目，提供站点运行监控、巡检、启停、健康分析、资产盘点与系统设置等功能页面，用于大屏/驾驶舱式展示与操作。

## 功能模块

- 首页：模块入口与快捷导航
- 我的换热站：站点驾驶舱（能耗/供温/室温/阻力等可视化 + 工艺流程图）
- 一键巡站：巡检流程与结果展示
- 一键启停：自检项、启停流程、日志与重置
- 健康监测分析：扫描进度、健康评分、异常项与分析建议
- 资产盘点：扫码/手工录入、清单状态与盘点进度
- 系统设置：基础配置入口

## 技术栈

- Vue 3（SFC，`<script setup>`）
- Vue Router 4
- Pinia
- Vite
- Tailwind CSS
- ECharts
- Axios、GSAP

## 快速开始

前置条件：Node.js（建议使用较新的 LTS 版本）与 npm。

安装依赖：

```bash
npm install
```

本地开发：

```bash
npm run dev
```

打包构建：

```bash
npm run build
```

本地预览：

```bash
npm run preview
```

## 目录结构（核心）

```text
src/
  components/        可复用组件（侧边栏、工艺流程图等）
  views/             业务页面（首页/巡站/启停/健康/盘点/设置等）
  router/            路由配置
  stores/            Pinia 状态（主题、实时数据模拟等）
  assets/            全局样式与静态资源
```

## 开发说明

- 页面入口在 `src/main.js`，路由在 `src/router/index.js`
- 主题切换与持久化在 `src/stores/theme.js`
- 如果未接入后端接口，部分页面会使用 `src/stores/realtime.js` 的模拟数据驱动展示

## 常见问题

### 为什么 Git 提示“LF 变成 CRLF”？

这表示同一文件的换行符被转换了（Windows 常见）。通常不影响运行，但会导致 Git 认为文件发生了改动；建议在团队内统一换行符策略并保持一致。

### AI 监控分析功能配置

系统集成了 DeepSeek-V3 供热运维专家分析功能。要在本地或线上正常运行，请在项目根目录创建一个 `.env` 文件，并添加你的 API Key：

```env
VUE_APP_DEEPSEEK_KEY=你的_DEEPSEEK_API_KEY_放在这里
```
注意：`.env` 文件已被 git 忽略，请勿将其提交到版本库中。

