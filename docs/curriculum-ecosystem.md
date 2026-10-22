# 全栈学习路线：生态课程选型建议

**调研日期：2026-10-22**  
**用途：** 为课程内容编纂提供技术生态候选清单，不是应用本身的依赖清单。主线技术（Node.js、TypeScript、React、Next.js、NestJS、React Native）仍按完整课程深度设计；第三方库采用短课，解释“解决什么问题、常用的关键 API、何时选择”，附一个短小且可运行的 TypeScript 示例。

## 选型原则与证据边界

1. **主流且能形成可迁移知识。** 以 Stack Overflow Developer Survey 2026 的 web framework 使用度为行业面宽度参考：Node.js 46.4%、React 41.5%、Next.js 20.6%、Express 15.6%、NestJS 5.8%。这支持把这些主线纳入路线，但调查结果不能证明某工具适合每种项目。[Stack Overflow 2026 web framework 数据](https://survey.stackoverflow.co/2026/technology/data/web-framework)
2. **按功能选一个主教工具，再展示替代项。** 避免把同类库全部展开成平行课程。State of JavaScript 2025 指出受访者通常只用少数后端框架，Express 仍领先、Nest 正增长；State of React 2025 观察到 Zustand 增长快且满意度高，同时提醒原生 `useState`/`useContext` 对很多场景已足够。[State of JavaScript：后端框架](https://2025.stateofjs.com/en-US/libraries/back-end-frameworks/) [State of React：状态管理](https://2025.stateofreact.com/en-US/libraries/state-management/)
3. **调查是社区快照，不是普查或官方背书。** State of React 2025 有 3,760 份答卷，页面注明样本以过往调查订阅者和社交媒体流量为主，并非 React 官方调查；State of React Native 也明确为非官方调查。将趋势与官方文档、维护状态、项目适配一起判断。[State of React 调查说明](https://2025.stateofreact.com/en-US/about/) [State of React Native 2025](https://results.stateofreactnative.com/en-US/)
4. **不把 npm 下载量当成用户数。** npm 自己说明下载统计按 tarball 成功响应计数，可能包括 CI 构建服务器、镜像、机器人，并非实际开发者人数。若以下载趋势辅助评估，应标注口径和时间窗，并结合调查、发布节奏、维护状态和官方文档。[npm：下载量统计口径](https://blog.npmjs.org/post/92574016600/numeric-precision-matters-how-npm-download-counts-work.html)
5. **课程版本核验。** 每个技术栈章节编写和发布前，核对项目官方文档及支持政策、最新稳定版、Node LTS 兼容性、弃用/维护公告和代码示例是否仍可执行。尤其不能仅按“最新版”生成教程；Node.js 生产环境选择受支持的 LTS 版本。[Node.js 发布状态](https://nodejs.org/en/about/previous-releases) [Next.js 支持政策](https://nextjs.org/support-policy)

## 分阶段推荐清单

| 阶段 / 主题 | 推荐课程单元 | 教学深度与理由 |
|---|---|---|
| JavaScript / TypeScript 基础之后：代码质量与运行时校验 | **Zod**；ESLint（含 typescript-eslint）概览；Prettier 概览 | Zod 学 schema、`parse`/`safeParse`、类型推导；lint 与格式化讲规则、自动修复和团队一致性。Zod 的价值在于把外部输入校验与静态类型连接起来。[Zod 官方基础](https://zod.dev/basics) |
| React 核心之后：路由 | **React Router** | 用一个 SPA 小例子理解路由表、嵌套路由、参数、loader/action；随后明确 Next App Router 是 Next 自带路由体系，不要机械叠加。 |
| React 核心之后：客户端状态 | **Zustand** 为轻量示范；展示 Redux Toolkit 为大型/复杂状态方案 | Zustand 讲 store、selector、action；Redux Toolkit 只做定位和何时选择。先说明 `useState`、`useReducer`、Context 已覆盖许多场景，不为使用库而使用库。[State of React 2025](https://2025.stateofreact.com/en-US/libraries/state-management/) [Zustand 文档](https://zustand.docs.pmnd.rs/)
| React / Next：服务端数据状态 | **TanStack Query** | 讲 query key、`useQuery`、`useMutation`、缓存、失效和加载/错误状态；与本地 UI 状态、Next 服务端数据获取分别说明边界。Next 特定的 Server Components / Server Actions 用 Next 主线教授，不强行套 Query。官方文档提供 React 与 React Native 用法。[TanStack Query 文档](https://tanstack.com/query/latest/docs/framework/react/overview) |
| React 表单 | **React Hook Form + Zod resolver** | 讲 `useForm`、字段注册、提交、错误和 schema 集成；示例只做一个带校验的表单。[React Hook Form](https://react-hook-form.com/) [Zod resolver](https://github.com/react-hook-form/resolvers) |
| React / Next 样式与 UI | **Tailwind CSS**；shadcn/ui 作为组件代码范例 | Tailwind 讲 utility-first、响应式断点、主题 token；shadcn/ui 讲可检查/可复制的组件实现与无障碍语义，不误称为传统封装组件库。[Tailwind 文档](https://tailwindcss.com/docs) [shadcn/ui](https://ui.shadcn.com/docs)
| Node.js HTTP 基础 | **Express**；Fastify 作为短比较 | Express 讲 middleware、route、request/response 和错误中间件；Fastify 对照 schema/插件/性能定位即可。随后以 NestJS 完整教授模块、DI、控制器、守卫、拦截器等架构能力，不把 Express/Nest 重复讲成同一深度。[State of JS：后端框架](https://2025.stateofjs.com/en-US/libraries/back-end-frameworks/) [Express 官方指南](https://expressjs.com/en/guide/routing.html) [Fastify 文档](https://fastify.dev/docs/latest/)
| Node / Nest：数据访问（作为完整全栈知识，不代表本产品采用数据库） | **Prisma** 为入门 ORM；**Drizzle ORM** 对照 SQL-first 类型化方案 | 介绍 schema/migration/client 查询与事务的概念，突出 ORM 不代替 SQL、索引和事务知识；只深入一种建模流程，另一种简短对照。[Prisma 文档](https://www.prisma.io/docs) [Drizzle 文档](https://orm.drizzle.team/docs/overview)
| Node / Nest：类型安全 API | **OpenAPI/Swagger**；tRPC 作可选短课 | 先教 HTTP 与 REST 契约，Nest 的 Swagger/OpenAPI 做 API 文档；tRPC 示例展示共享 TS 类型的端到端调用及其前后端耦合权衡。[Nest OpenAPI 文档](https://docs.nestjs.com/openapi/introduction) [tRPC 文档](https://trpc.io/docs)
| 自动化测试：单元与组件 | Web **Vitest + React Testing Library**；Node 内建 `node:test` 介绍；React Native **Jest + React Native Testing Library** | Vitest 讲 `describe`/`it`/`expect`、mock；Testing Library 按用户可见行为查找/交互；只展示与 Jest 的迁移/取舍。Node 内建测试运行器用于免第三方依赖的基础测试。State of JS 2025 显示 Vitest 使用快速上升、Jest 仍很常用；React Native 调查中 Jest 与 RNTL 是主流组合。[State of JS：测试](https://2025.stateofjs.com/en-US/libraries/testing/) [RN：测试与监控](https://results.stateofreactnative.com/en-US/testing-and-monitoring/) [Node test runner](https://nodejs.org/api/test.html)
| 集成测试：网络边界 | **MSW** | 拦截浏览器/Node 请求，为组件/API 客户端提供真实 HTTP 边界的模拟；讲 `http.get`、`HttpResponse.json` 与 handler 复用。[MSW 文档](https://mswjs.io/docs/)
| 端到端测试：Web | **Playwright** | 讲页面导航、定位器、断言、移动视口和 Chromium/WebKit/Firefox 多浏览器回归；优先用于路线核心流程的真实浏览器验收。[Playwright 文档](https://playwright.dev/docs/intro) State of JS 2025 将 Playwright 列为高满意度工具。[State of JS 总览](https://2025.stateofjs.com/en-US/libraries/)
| React Native / Expo 壳 | **Expo** 与 **Expo Router**；**react-native-webview** | Expo SDK、打包/开发构建和原生能力属于 RN 主线的实践环境；Expo Router 讲文件路由/深链；WebView 讲加载 URL、加载状态、错误/返回处理、`onMessage` / `postMessage` 桥接边界。调查中 expo-router 与 react-navigation 都有较高使用度，且 Web 平台/深链仍是常见痛点；本项目壳只需选定一种主路线实现，教学中可对照 React Navigation。[RN 导航调查](https://results.stateofreactnative.com/en-US/navigation/) [Expo Router](https://docs.expo.dev/router/introduction/) [React Native WebView](https://github.com/react-native-webview/react-native-webview)
| React Native 动画与手势 | **React Native Reanimated + Gesture Handler** | 展示 UI thread 动画、手势识别和一个可运行小动效；概念课即可，不在课程首批覆盖复杂手势。State of RN 2025 中 Reanimated 使用率靠前。[RN 库调查](https://results.stateofreactnative.com/en-US/libraries/) [Reanimated](https://docs.swmansion.com/react-native-reanimated/) [Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/)
| React Native 持久化概念 | **AsyncStorage**（非敏感轻量数据）；平台安全存储只作提示 | 解释异步键值存储 API 和序列化。WebView 的 `localStorage` 与 RN 原生 AsyncStorage 不是同一存储，WebView 壳项目需明确进度由网页源内存储还是通过桥接写入原生存储；本产品需求若限定网页本地存储，不能暗中引入原生同步层。[AsyncStorage](https://react-native-async-storage.github.io/async-storage/)
| Cloudflare 部署 | **Wrangler** 与 Workers Static Assets | 教学内容对准本产品实际部署：build 输出、静态资源配置、SPA fallback、预览/发布、默认 `workers.dev` 地址和部署后验证。不要在课程里混淆 Cloudflare Pages 与 Workers Static Assets 两个流程。[Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/) [Wrangler](https://developers.cloudflare.com/workers/wrangler/)

### 每个第三方库短课的标准结构

第三方库都按以下模板写，不发展成该库的完整参考手册：

1. **它解决什么问题：** 用一个日常开发痛点说明适用范围。
2. **核心概念与 API：** 通常 3–5 个，不罗列全部 API。
3. **一个完整 TypeScript 例子：** 输入、输出和关键类型都可见；标出安装/运行前提；中文注释解释关键行；必要时给出常见错误。
4. **选择边界：** 何时用原生能力、何时用这款库、何时考虑一个替代项。
5. **官方资料与核验日期：** 链接官方文档，记录采用的稳定版及最后检查日期。

主线技术内容需远超这个模板：提供循序渐进课程、概念解释、多个代码示例、练习/项目、常见错误和版本/部署实践。第三方依赖不能挤占主线完整性。

## 对本项目课程内容的特别约束

- 这是“广覆盖、高质量”的学习网站，但每个阶段允许并列技术节点。例如服务端阶段可先学 HTTP/Node 基础，再选择 Express 路线或 NestJS 路线；前端阶段分别安排 React 与 Next.js 的定位和衔接，而不是假设所有人只学一个框架。
- Web 与 iOS/Android WebView 壳同时交付；课程主线覆盖 React Native，但项目本身不因此需要数据库或登录服务。用户进度与节奏保存在客户端本地，技术课程中数据库、鉴权、ORM 仍作为行业知识教学主题。
- 内容选择应兼顾个人开发者/初学者可读性与行业代表性。主线框架的“全覆盖”指概念、常用能力、架构、调试、测试和交付流程有体系；不是把所有生态包都列入首发课程。
- 用户学习节奏可选慢/中/快三档并可随时切换，节奏只影响建议的每日学习量/复习间隔，不隐藏或删除路线中的并列技术节点。

## 官方与调查来源索引

- [Stack Overflow Developer Survey 2026：web framework 数据](https://survey.stackoverflow.co/2026/technology/data/web-framework)；[语言数据与 survey overview](https://survey.stackoverflow.co/2026/technology)
- [State of JavaScript 2025：总览与图表](https://2025.stateofjs.com/en-US/libraries/)；[框架](https://2025.stateofjs.com/en-US/libraries/front-end-frameworks/)；[Meta-frameworks](https://2025.stateofjs.com/en-US/libraries/meta-frameworks/)；[后端](https://2025.stateofjs.com/en-US/libraries/back-end-frameworks/)；[测试](https://2025.stateofjs.com/en-US/libraries/testing/)；[构建工具](https://2025.stateofjs.com/en-US/libraries/build-tools/)
- [State of React 2025：调查说明](https://2025.stateofreact.com/en-US/about/)；[状态管理结果](https://2025.stateofreact.com/en-US/libraries/state-management/)
- [State of React Native 2025：总览](https://results.stateofreactnative.com/en-US/)；[生态库](https://results.stateofreactnative.com/en-US/libraries/)；[导航](https://results.stateofreactnative.com/en-US/navigation/)；[测试与监控](https://results.stateofreactnative.com/en-US/testing-and-monitoring/)
- npm 下载量统计：[npm 官方博客说明](https://blog.npmjs.org/post/92574016600/numeric-precision-matters-how-npm-download-counts-work.html)

