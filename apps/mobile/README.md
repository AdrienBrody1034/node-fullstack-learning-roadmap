# Node 全栈学习计划 App 壳

Expo / React Native 的 iOS 与 Android 壳，通过 WebView 加载 `apps/web` 发布的响应式网站。课程 UI 和学习进度都由网站实现；App 不复制课程，也不另存学习数据。WebView 的 `localStorage` 会在每个 App 安装内独立保存进度。

## 开发

要求 Node.js 22.13 或更新的 22.x/兼容版本（Expo SDK 57 的最低版本要求），并安装 Xcode（iOS Simulator）和 Android Studio/SDK（Android Emulator）。

1. 在 `apps/web` 启动网站：`npm run dev`（默认 `http://localhost:5173`）。
2. 在 `apps/mobile` 安装依赖：`npm install`。
3. 启动 Expo：`npm start`，然后按 `i` 启动 iOS Simulator 或按 `a` 启动 Android Emulator。

默认加载本地 Vite 地址 `http://localhost:5173`。iOS Simulator 直接使用该地址；Android Emulator 自动将 `localhost` 映射到宿主机地址 `10.0.2.2`。实体 Android 设备需要在 `.env.local` 中填写电脑局域网地址，例如：

```dotenv
EXPO_PUBLIC_WEB_URL=http://192.168.1.23:5173
```

本地开发时也可用同一配置指向预览站点。`EXPO_PUBLIC_WEB_URL` 会被打包进应用，不要放置密钥或私人 URL。

## 内部分发构建

先把网站部署到 Cloudflare，再以默认 `workers.dev` HTTPS 地址配置 `EXPO_PUBLIC_WEB_URL`：

```dotenv
EXPO_PUBLIC_WEB_URL=https://your-worker.your-subdomain.workers.dev
```

随后运行 `npm run build:android` 或 `npm run build:ios`。EAS preview 配置生成内部安装构建；Android 输出 APK，iOS 输出 Simulator 构建。如需在实体 iPhone 安装，需 Apple 开发签名与相应 EAS 凭据/分发配置。项目不配置 App Store 或 Google Play 发布。

生产构建缺少 `EXPO_PUBLIC_WEB_URL` 时，Expo 配置会报错；开发构建才使用 localhost 默认值。
