# Node 全栈学习计划技术规格（审阅草案）

**状态：已按用户审阅意见更新，作为实施基线。** 网站与 iOS/Android App 同步开发；完成当前版本后一次性交付。

## 1. 技术目标与边界

- Web 与移动端 App 同步交付；Web 同时适配桌面和手机屏幕。
- App 使用 React Native/Expo 作为轻量原生壳，通过 WebView 显示同一套响应式 Web 页面。
- 课程内容随网站静态发布；用户学习进度、偏好等数据仅存浏览器本地，不发送到服务端。
- 网站发布到 Cloudflare；移动端制作 iOS/Android 可安装构建物。
- 本项目按一次性建立和交付考虑，不设计账号体系、云同步、后端 API、数据库或持续迭代架构。
- 验收仍包含浏览器、手机布局、原生壳模拟器和生产部署验证。

## 2. 总体架构

建议从简，不采用 monorepo 构建系统或独立后端：

```text
apps/
  web/                 # React + TypeScript + Vite，响应式单页应用
  mobile/              # Expo + React Native，WebView 原生壳
content/               # 课程 Markdown/MDX 或结构化数据，构建时打包为静态资源
```

### Web 技术

- React + TypeScript + Vite，输出静态 SPA；不使用 Next.js 服务端功能，也不部署 NestJS API。
- 网站从桌面大屏到窄屏使用同一套页面与组件，导航、路线图、代码阅读、课程内容和进度控件按断点布局。
- 课程内容作为版本控制下的静态文件随构建发布；不需要内容数据库、用户数据库或服务端渲染。
- 样式方案遵循已接受的风格稿；实现颜色、字号、间距、断点和键盘焦点规范。
- 路由采用静态客户端路由；部署配置需将未知路径回退到 SPA 入口。

### React Native App 壳

- 使用 Expo + React Native，同时开发 iOS 与 Android 应用壳。
- 壳内使用 `react-native-webview`（或当前 Expo SDK 对应的 DOM/WebView 方案）加载 Cloudflare 上发布的网站地址。
- 壳负责启动页/加载状态、网络错误提示、状态栏/安全区域、返回行为、外链处理和 WebView 基础配置；课程主体仍由响应式 Web 呈现。
- App 与网站不重复实现课程页面；网站的移动断点也是 App 内显示效果的基础。
- App 首次启动需要网络加载页面。当前不承诺离线学习、独立原生课程 UI、推送或商店上架；只交付 iOS/Android 可安装构建包。
- 生产 App 加载固定的正式 Cloudflare HTTPS 地址；开发/测试构建可配置预览地址。

Expo 官方提供 WebView 能力与 Android/iOS 支持，且可构建 iOS/Android 安装包：[Expo WebView](https://docs.expo.dev/versions/latest/sdk/webview/)、[Expo EAS Build](https://docs.expo.dev/build/introduction/)。

## 3. 本地数据与持久化

- 无账号、无服务器 API、无数据库、无跨设备同步。
- 学习进度、用户路线偏好、已完成状态、书签/笔记（若纳入范围）保存在前端设备本地。
- 本版使用 `localStorage` 保存学习进度和学习偏好；不接 IndexedDB、数据库或云端持久化服务。
- 课程本身属于只读静态内容，与用户数据分离；清除浏览器/应用数据会删除学习记录。
- 桌面浏览器和 App 内 WebView 是不同的本地存储空间，进度不会自动共享；卸载 App 或清除 WebView 数据可能导致 App 记录丢失。
- 所有本地数据仅供当前设备使用，不用于分析或上传；不提供手动 JSON 导出/导入备份。
- 不收集个人身份信息，不添加第三方分析脚本或远程用户追踪。

## 4. 内容组织与编纂

- Markdown/MDX/JSON 课程内容由 Git 中的源文件维护，构建时生成可由前端直接读取的静态模块。
- schema 校验课程 ID、阶段、标题、先修、难度、预计时长、目标、正文、练习、适用版本、官方来源、核验日期和草稿/审阅状态。
- 教师智能体输出草稿，不直接发布；代码示例需注明依赖、运行命令、预期输出和错误路径，并由技术审校者核验。
- 不建立在线 CMS 或数据库内容管理后台。
- 完整教师角色约束见[教师智能体规范](./agents/it-teacher.md)。

## 5. 本地路线与搜索

- 路线按“阶段 → 并列技术节点 → 课程单元”建模。主要技术栈节点完整覆盖，同阶段可包含需要对照学习的多种技术，不把互为替代的方案压成一个节点。
- 路线、先修关系和推荐规则随课程数据打包在前端；根据用户基础在浏览器本地生成学习计划。
- 学习节奏设置为慢/中/快三档，分别提供不同的周任务量提示；用户随时可更改。节奏变化只影响未来的建议安排，不减少课程、不重置已完成状态。
- 允许本地调整顺序、跳过内容和更新进度；刷新页面后从设备本地恢复。
- 搜索采用前端标题、标签、技术栈和难度筛选；课程量较小时不引入搜索服务。
- 不使用机器学习推荐，也不在服务端处理学习者行为。

## 6. 质量与测试要求

### 自动化检查

- 内容 schema 校验、TypeScript 类型检查、lint、Web/App 构建。
- 关键 Web 流程 E2E：首次进入、选学习方向、打开课程、完成/撤销课程、刷新后恢复进度、搜索/筛选、切换学习节奏。
- 检查 localStorage 可用性、损坏数据恢复/清理策略，以及路由刷新行为。

### 浏览器与真机模拟测试智能体

- 必须使用 Codex 浏览器控制功能实际操作部署预览/本地预览，而不只看代码或截图。
- 覆盖桌面浏览器和移动浏览器；使用响应式视口/设备模拟检查常见窄屏布局、滚动、键盘和触控目标。
- 必须启动 iOS Simulator 与 Android Emulator（设备环境可用时），安装 Expo 构建或开发构建，检查 WebView 加载、状态栏与安全区域、系统返回、链接行为、本地进度保存和重启恢复。
- 输出逐项通过/失败记录、屏幕尺寸/系统版本、复现步骤和截图；不能运行某个平台时明确说明阻塞，不把浏览器模拟冒充原生模拟器测试。
- 详细角色和分工见[子智能体计划](./agent-plan.md)。

## 7. Cloudflare 部署

- 网站产物是静态 React SPA，不需要运行时数据库或业务 API。
- 建议将 Vite 构建产物部署为 **Cloudflare Workers Static Assets**，用 Wrangler/Cloudflare Vite 集成发布；配置 SPA 路由回退、HTTPS 和正式 URL。Cloudflare 当前将 Workers Static Assets 作为静态站点和 SPA 的推荐部署方式：[Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/)、[Cloudflare Workers 最佳实践](https://developers.cloudflare.com/workers/best-practices/workers-best-practices/)。
- Cloudflare Pages 也是静态 React SPA 的可用方案；除非部署前检查发现限制，否则按 Workers Static Assets 执行，以符合当前 Cloudflare 对新静态项目的推荐。
- 部署智能体负责部署前构建检查、配置 Wrangler、发布到 `*.workers.dev` 或已确认域名、验证 HTTPS/路由/静态资源/响应式关键流程并记录部署地址。
- 使用 Cloudflare 默认 `workers.dev` 地址，不配置自定义域名。
- 这是一次性交付，不建立复杂持续发布流水线。最终人工触发部署，部署智能体记录版本/提交、部署地址和回滚所需信息。

## 8. 已确认架构决策

| ADR | 建议决策 | 影响与限制 |
| --- | --- | --- |
| A1 | React + TypeScript + Vite，Web 作为静态 SPA | 简化无服务端数据场景；不使用 Next.js SSR/服务端 API。 |
| A2 | iOS/Android 同步开发 Expo + React Native WebView 壳 | 课程 UI 复用网站；App 依赖网络，需接受 WebView 的原生体验边界。 |
| A3 | 用户状态只用设备本地 `localStorage`，不做登录/数据库/同步/备份导入导出 | 数据只在当前浏览器或 App WebView；清数据或换设备不会自动恢复。 |
| A4 | 课程内容静态文件，随网站构建部署 | 首期不做在线编辑器/CMS；改内容需重新构建并部署。 |
| A5 | Cloudflare Workers Static Assets 托管网站 | 无后端服务；正式地址和自定义域名待定。 |
| A6 | 同时测试 Web 浏览器与 iOS/Android 模拟器 | 需本机或 CI 有对应模拟器环境；不可用时需报告覆盖缺口。 |
| A7 | 不设计后续功能迭代或复杂发布管线 | 仍保留一次最终构建、验收、Cloudflare 部署和交付记录。 |
| A8 | 阶段内支持并列技术栈节点，主流栈完整，三方库速览 | 课程 schema 需支持阶段分组、节点关系和内容深度类型。 |
| A9 | 慢/中/快三档节奏可随时切换 | 只调整本地计划的建议量，不跳过主课程或清除进度。 |

## 9. 风险与约束

| 风险/约束 | 处理方式 |
| --- | --- |
| WebView 的原生交互与独立原生界面有差异 | 限定壳功能，重点验证返回键、安全区域、加载错误、外链和触控。 |
| WebView 本地进度与电脑端不共享 | 在首次使用/帮助中说明；不提供云同步或手动备份。 |
| 应用卸载/清除数据导致进度丢失 | 明确本地数据限制；不承诺云备份。 |
| Cloudflare 运行时与目标框架差异 | 采用纯静态 SPA，规避 Next.js SSR adapter 兼容风险。Cloudflare 对 Next.js 当前建议特定 Workers 方案且部分路径仍有兼容状态，故此处不采用服务端 Next 部署。 |
| 真机模拟器环境不可用 | 测试智能体记录具体环境阻塞和未覆盖平台，交付验收前补测。 |
| 课程版本过期 | 课程内容记录适用版本与核验日期；一次性交付前进行官方来源和代码示例审校。 |

## 10. 审阅后实施顺序

1. 已确认 PRD、界面风格稿、WebView 壳方案、本地数据限制、Cloudflare 默认地址和 App 打包目标。
2. 同步实现 React/Vite 网站与 Expo/React Native 壳：Web 页面兼顾桌面/手机，App WebView 加载开发或预览站点。
3. 内容和本地路线接入：主流栈编写完整高质量课程，第三方库提供功能简介和示例；实现本地进度、慢/中/快三档节奏。
4. 测试智能体用 Codex 浏览器控制、桌面/移动视口和 iOS/Android 模拟器完成验收；修复关键问题。
5. 部署智能体将最终 Web 产物发布到 Cloudflare Workers Static Assets，并核验正式站点。
6. 生成 iOS/Android 可安装构建包，不提交 App Store/Google Play。

