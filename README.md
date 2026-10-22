# Node 全栈学习路线

面向 Node.js 全栈开发者的中文学习路线，包含响应式 Web 课程站点、React Native WebView App 壳和课程内容。

## 项目结构

- `apps/web`：React + TypeScript + Vite 网站，支持桌面与移动端布局。
- `apps/mobile`：Expo / React Native iOS 与 Android WebView 壳。
- `content/curriculum.ts`：课程、学习节点与代码示例。
- `docs`：PRD、技术规格、智能体分工和生态调研文档。

## 本地启动网站

```bash
cd apps/web
npm install
npm run dev
```

## 本地启动 App

先启动网站，再在另一个终端启动 Expo：

```bash
cd apps/mobile
npm install
npm start
```

按 `i` 启动 iOS Simulator，按 `a` 启动 Android Emulator。App 开发配置默认加载本地 Vite 站点；生产构建需先设置 `EXPO_PUBLIC_WEB_URL` 为已部署的 HTTPS 地址。

## Cloudflare

网站使用 `apps/web/wrangler.jsonc` 配置 Cloudflare Workers Static Assets 部署，构建产物由 Vite 输出到 `apps/web/dist`。
