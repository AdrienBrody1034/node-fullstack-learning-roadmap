import type { Curriculum, LearningNode, Lesson } from '../apps/web/src/types/curriculum';

const lesson = (
  id: string,
  title: string,
  intro: string,
  sections: Lesson['sections'],
  codeExamples: Lesson['codeExamples'],
  keyPoints: string[] = [],
): Lesson => ({
  id,
  title,
  intro,
  sections,
  codeExamples: codeExamples.map((example) => ({
    ...example,
    title: `教学片段｜${example.title}`,
    explanation: `代码定位：这是对应课程主题的片段，需放入说明中的项目/文件上下文；不是独立可运行文件。依赖：以 import、课程说明及片段中标出的项目 API 为准。边界：示意占位函数应由学习者按本课前置步骤实现。${example.explanation ? ` ${example.explanation}` : ''}`,
  })),
  keyPoints,
});

const core = (node: Omit<LearningNode, 'depth'>): LearningNode => ({ ...node, depth: 'core' });
const ecosystem = (node: Omit<LearningNode, 'depth'>): LearningNode => ({ ...node, depth: 'ecosystem' });

export const curriculum: Curriculum = {
  title: 'Node 全栈学习路线',
  subtitle: '从 JavaScript 到 Web 与移动端，用一条可实践的路线掌握全栈开发。阶段中并列学习相关技术，理解它们各自解决的问题。',
  phases: [
    {
      id: 'foundation',
      title: '开发基础与 Web 原理',
      summary: '先熟悉开发工具和浏览器，再建立编写与调试程序所需的基本能力。',
      outcomes: ['会用终端与 Git', '理解浏览器和 HTTP', '能写并调试基础 JavaScript'],
      stacks: [
        {
          id: 'web-foundations', name: 'Web 与工程基础', description: '不同技术栈共同依赖的基础',
          nodes: [
            core({ id: 'terminal-git', title: '终端、Git 与 npm', summary: '理解命令行、版本记录和包管理的基本工作方式。', level: '入门', estimatedMinutes: 90, lessons: [
              lesson('terminal-git-basics', '让项目有来有回：终端、Git 与 npm', '终端是给电脑下命令的入口；Git 记录项目每次有意义的变化；npm 帮你管理项目所需的包。三者一起构成日常开发的工作台。', [
                { heading: '用目录理解项目', body: '先用 `pwd` 看当前目录，用 `ls` 看文件，用 `cd` 进入项目。命令的作用范围由当前目录决定，所以执行安装、提交前先确认自己在哪。' },
                { heading: 'Git 记录变化', body: '`git status` 告诉你哪些文件变化了，`git add` 把准备提交的变化放进暂存区，`git commit` 为这组变化留下说明。提交是一个可读的检查点，不是备份服务器。' },
              ], [{ title: '创建一个可重复的提交', language: 'bash', code: 'git status\ngit add src/\ngit commit -m "Add first lesson"', explanation: '在已有 Git 项目中，先检查状态，再只暂存目标目录，最后提交。执行前应确认 `src/` 是本次想保存的内容。' }], ['先看 git status 再 add。', 'npm install 会根据 package.json 安装项目依赖。']),
            ] }),
            core({ id: 'http-browser', title: '浏览器、HTTP 与网页基础', summary: '弄清浏览器如何请求页面与 API，读懂 HTML、CSS 和状态码。', level: '入门', estimatedMinutes: 120, lessons: [
              lesson('http-request-response', '一次网页请求发生了什么', '浏览器像顾客，服务器像柜台：浏览器发出请求，服务器返回状态码、响应头和内容。理解这段往返，前后端的边界就清楚了。', [
                { heading: '请求和响应各有信息', body: '请求包含方法、路径、请求头和可选正文；响应先给状态码，再给响应头和数据。200 表示成功，404 表示目标不存在，500 表示服务端处理失败。' },
                { heading: 'JSON 是常见的数据约定', body: '接口通常用 JSON 传对象。浏览器拿到响应后还需要检查状态并解析正文；网络失败和 HTTP 失败是两种不同情况。' },
              ], [{ title: '检查 HTTP 响应', language: 'ts', code: 'async function loadCourse(id: string) {\n  const response = await fetch(`/api/courses/${id}`);\n\n  if (!response.ok) {\n    throw new Error(`课程加载失败：${response.status}`);\n  }\n\n  return response.json();\n}', explanation: '`fetch` 解决网络请求；`response.ok` 检查 HTTP 状态。404 不会让 fetch 自动抛错，所以要显式处理。' }], ['HTTP 状态码属于响应；网络断开时可能根本没有响应。', 'JSON 是数据格式，不是数据库。']),
            ] }),
          ],
        },
        {
          id: 'javascript', name: 'JavaScript', description: '后端、前端和移动端共同使用的语言基础',
          nodes: [
            core({ id: 'javascript-language', title: 'JavaScript 语言与模块', summary: '从值、函数、对象和模块写出可组合的程序。', level: '入门', estimatedMinutes: 180, lessons: [
              lesson('js-values-functions', '把任务拆成函数', '函数把一段有名字的工作收起来，输入资料后给出结果。先写清楚输入和输出，程序就更容易测试，也更容易复用。', [
                { heading: '纯函数更容易推理', body: '如果同样的输入总是得到同样输出，而且函数不偷偷修改外部状态，它就是纯函数。不是所有代码都必须纯，但纯函数很适合处理格式转换和计算。' },
                { heading: '对象描述一件事', body: '对象把相关数据放在一起。解构可以从对象取值；模块则让不同文件各自负责一块能力，再通过 export/import 共享。' },
              ], [{ title: '把价格计算抽成函数', language: 'js', code: 'function total(items) {\n  return items.reduce(\n    (sum, item) => sum + item.price * item.quantity,\n    0,\n  );\n}\n\nconsole.log(total([{ name: "书", price: 20, quantity: 2 }])); // 40', explanation: '纯 JavaScript 版本不含 TypeScript 类型语法；先用运行结果理解函数，后续 TypeScript 课再给数据加类型。' }], ['函数名应说清它做什么。', '模块边界按职责拆分，不要把所有代码塞进一个文件。']),
              lesson('js-async', 'Promise 与 async/await', '网络和磁盘操作需要时间。Promise 表示“稍后会得到的结果”；await 让当前异步函数在结果可用后继续，不会把整个服务器卡住。', [
                { heading: '成功和失败都要处理', body: '请求可以成功，也可能超时、断网或返回错误状态。把异常转成可理解的错误，再由界面或调用方决定怎样提示用户。' },
                { heading: '并行与顺序', body: '不互相依赖的请求可以用 Promise.all 并行；有依赖的步骤才按顺序 await。不要为了“看起来异步”而忘了处理拒绝状态。' },
              ], [{ title: '加载多个独立资源', language: 'ts', code: 'async function loadDashboard() {\n  const [profile, courses] = await Promise.all([\n    fetchJson<{ name: string }>("/api/profile"),\n    fetchJson<{ id: string; title: string }[]>("/api/courses"),\n  ]);\n\n  return { greeting: `你好，${profile.name}`, courses };\n}\n\nasync function fetchJson<T>(url: string): Promise<T> {\n  const response = await fetch(url);\n  if (!response.ok) throw new Error(`请求失败：${response.status}`);\n  return response.json() as Promise<T>;\n}', explanation: '两个请求互不依赖，所以并行执行。泛型 T 告诉 TypeScript 调用方期待的结果形状；实际接口仍应通过运行时校验。' }], ['await 只允许用于 async 函数或模块顶层。', '错误需要被捕获、提示或继续抛给合适的边界。']),
            ] }),
            core({ id: 'javascript-browser', title: '浏览器事件与 DOM', summary: '理解输入事件、页面更新和浏览器存储，为 React 打基础。', level: '入门', estimatedMinutes: 100, lessons: [
              lesson('js-events', '事件、状态与用户动作', '网页不是一张静态海报：用户点击、输入和键盘操作都会产生事件。事件处理器读取当前状态，再更新界面。', [
                { heading: '避免直接改 DOM', body: '原生 DOM API 能更新页面，但复杂应用里手动找节点、改文本很容易和实际状态不一致。React 等 UI 库通过状态描述界面，让更新更可预测。' },
              ], [{ title: '监听一个表单提交', language: 'ts', code: 'const form = document.querySelector<HTMLFormElement>("#search");\n\nform?.addEventListener("submit", (event) => {\n  event.preventDefault();\n  const data = new FormData(form);\n  const query = String(data.get("query") ?? "").trim();\n  console.log(`搜索：${query}`);\n});', explanation: 'preventDefault 阻止表单默认刷新；FormData 读取表单字段。React 中会用受控状态和 onSubmit 实现同样的用户流程。' }], ['事件回调不是自动运行的，它会在对应用户动作发生时执行。']),
            ] }),
          ],
        },
      ],
    },
    {
      id: 'typescript',
      title: 'TypeScript：让数据形状说清楚',
      summary: '在 JavaScript 上增加静态类型，让编辑器和编译器尽早发现数据使用错误。',
      outcomes: ['给函数和数据建模', '用联合类型表达状态', '区分静态类型与运行时检查'],
      stacks: [{ id: 'ts-stack', name: 'TypeScript', description: '从基础类型到应用边界建模', nodes: [
        core({ id: 'ts-basics', title: '类型、对象与函数', summary: '给数据、函数参数和返回值写出可靠约定。', level: '基础', estimatedMinutes: 150, lessons: [
          lesson('ts-shapes', '用类型描述数据', 'TypeScript 类型像一份数据说明书：告诉编辑器对象应该有哪些字段、函数需要什么输入。它能在运行前报告一部分错误，但不会替你验证外部数据。', [
            { heading: '结构类型', body: 'TypeScript 关心对象是否具有需要的字段，不要求它必须来自某个 class。interface 和 type 都能描述对象结构，团队应保持写法一致。' },
            { heading: '类型推断', body: '编译器能从初始值推断类型。不要到处重复注解；在公共函数边界和不明显的数据结构处写类型最有帮助。' },
          ], [{ title: '定义课程对象', language: 'ts', code: 'type Lesson = {\n  id: string;\n  title: string;\n  durationMinutes: number;\n  prerequisites: string[];\n};\n\nfunction formatDuration(lesson: Lesson): string {\n  return `${lesson.durationMinutes} 分钟`;\n}\n\nconst intro: Lesson = {\n  id: "http-basics",\n  title: "HTTP 入门",\n  durationMinutes: 25,\n  prerequisites: [],\n};\n\nconsole.log(formatDuration(intro));', explanation: '对象字面量会被检查：漏掉 title 或把 durationMinutes 写成字符串，编辑器就会指出。' }], ['类型不会在浏览器或 Node 运行时自动检查用户输入。']),
        ] }),
        core({ id: 'ts-modeling', title: '联合类型与状态建模', summary: '用有限状态表达界面和业务流程，减少含糊的布尔值组合。', level: '进阶', estimatedMinutes: 130, lessons: [
          lesson('ts-discriminated-union', '用判别联合表达加载状态', '三个互不相关的布尔值可能形成八种组合，其中多数没有意义。联合类型可以明确规定：加载中、成功和失败各自拥有不同数据。', [
            { heading: '先区分，再读取', body: '检查 status 后，TypeScript 会缩小类型范围。成功分支可以安全访问 data，失败分支可以安全访问 message。' },
          ], [{ title: '完整描述请求状态', language: 'ts', code: 'type Result<T> =\n  | { status: "loading" }\n  | { status: "success"; data: T }\n  | { status: "error"; message: string };\n\nfunction describe(result: Result<string[]>): string {\n  switch (result.status) {\n    case "loading": return "正在加载…";\n    case "success": return `找到 ${result.data.length} 节课`;\n    case "error": return `加载失败：${result.message}`;\n  }\n}', explanation: 'status 是判别字段。每种状态拥有不同字段，遗漏某个分支时可以再开启穷尽检查。' }], ['用联合类型表达“只能是其中一种”的状态。']),
        ] }),
        core({ id: 'ts-generics', title: '泛型与可复用类型', summary: '编写适用于多种数据、同时保留具体类型信息的函数和结构。', level: '进阶', estimatedMinutes: 120, lessons: [
          lesson('ts-generics-basics', '让函数保留输入类型', '泛型是可在调用时确定的类型参数。它让函数复用算法时仍能保留输入与输出之间的联系。', [
            { heading: '泛型不是 any', body: 'any 放弃类型检查；泛型把未知类型保存为一个变量，返回时仍然知道它是什么。' },
          ], [{ title: '安全地取第一项', language: 'ts', code: 'function first<T>(items: T[]): T | undefined {\n  return items[0];\n}\n\nconst title = first(["Node", "React"]); // string | undefined\nconst id = first([101, 202]); // number | undefined', explanation: '同一个函数可处理字符串列表和数字列表，返回类型仍与输入对应。' }], ['只有在类型关系需要复用时才引入泛型。']),
        ] }),
        core({ id: 'ts-narrowing-utility', title: '类型缩窄、穷尽检查与工具类型', summary: '在运行时分支中安全收窄类型，并用内置工具类型表达常见转换。', level: '进阶', estimatedMinutes: 130, lessons: [
          lesson('ts-narrowing', '从 unknown 安全地读取外部数据', '来自网络、文件或 localStorage 的值应先视为 unknown。用 typeof、in 和判别字段检查后，才能安全使用具体属性。类型断言只是告诉编译器相信你，不会在运行时验证数据。', [
            { heading: '分支覆盖全部情况', body: '判别联合配合 never 可以让新增状态时编译器提醒你补分支。Partial、Pick、Omit、Record 等工具类型适合从已有模型派生形状，但不该掩盖不清楚的数据契约。' },
          ], [{ title: 'unknown 缩窄与穷尽检查', language: 'ts', code: 'type State = { kind: "ready"; count: number } | { kind: "empty" } | { kind: "failed"; message: string };\n\nfunction renderState(value: unknown): string {\n  if (typeof value !== "object" || value === null || !("kind" in value)) return "无效状态";\n  const state = value as State;\n  switch (state.kind) {\n    case "ready": return `共 ${state.count} 项`;\n    case "empty": return "暂无内容";\n    case "failed": return state.message;\n    default: { const exhaustive: never = state; return exhaustive; }\n  }\n}\n\ntype Course = { id: string; title: string; body: string };\ntype CourseCard = Pick<Course, "id" | "title">;', explanation: 'TypeScript 示例，无外部依赖。真实数据应使用 Zod 等运行时校验库解析；类型断言本身不验证输入。' }], ['unknown 比 any 安全，因为使用前必须先缩窄。', 'Pick 只影响静态类型，不会删除运行时对象字段。']),
        ] }),
        core({ id: 'ts-async-modules', title: '异步类型、模块与项目配置', summary: '为 Promise、模块边界和严格编译选项建立一致约定。', level: '进阶', estimatedMinutes: 120, lessons: [
          lesson('ts-async-contracts', 'Promise 与 API 边界类型', 'Promise<T> 描述成功时的值，不代表网络请求一定成功。用 discriminated union 返回可预期结果；对错误分支保留清楚的错误信息，不把异常吞掉。', [
            { heading: '严格模式帮助早发现空值', body: 'strictNullChecks 让可能缺失的值显式出现。模块应通过 export/import 维护边界，类型专用导入可帮助明确它不会成为运行时代码。' },
          ], [{ title: '把请求结果建模为成功或失败', language: 'ts', code: 'type ApiResult<T> =\n  | { ok: true; data: T }\n  | { ok: false; message: string };\n\nasync function getJson<T>(url: string): Promise<ApiResult<T>> {\n  try {\n    const response = await fetch(url);\n    if (!response.ok) return { ok: false, message: `HTTP ${response.status}` };\n    return { ok: true, data: (await response.json()) as T };\n  } catch (error) {\n    return { ok: false, message: error instanceof Error ? error.message : "网络错误" };\n  }\n}', explanation: '浏览器 TypeScript，无外部库。生产 API 应在 JSON 解析后使用运行时 schema 校验，不能只靠泛型断言。' }], ['类型系统描述代码约定；运行时 schema 负责验证数据。']),
        ] }),
        ecosystem({ id: 'ts-tooling', title: 'TypeScript 工具链速览', summary: '认识编译器、类型检查和 lint 格式化工具各自的边界。', level: '拓展', estimatedMinutes: 35, lessons: [
          lesson('ts-tooling-overview', 'tsc、ESLint 与格式化工具各做什么', 'tsc 检查类型并可转译代码；ESLint 检查代码模式；格式化工具统一排版。它们解决不同问题，不应把 lint 通过当成代码正确的证明。', [
            { heading: '常用工作流', body: '编辑器负责快速反馈，命令行和 CI 再重复执行同一检查，避免“我电脑上没报错”成为唯一质量标准。' },
          ], [{ title: '常见检查命令', language: 'bash', code: 'npx tsc --noEmit\nnpx eslint src\nnpx prettier --check .', explanation: 'noEmit 只做类型检查，不输出 JavaScript。实际参数以项目 package scripts 为准。' }], ['TypeScript 的类型会在转译后被移除。']),
        ] }),
      ] }],
    },
    {
      id: 'node-core',
      title: 'Node.js 运行时与服务端基础',
      summary: '理解 Node 运行 JavaScript 的方式，学会处理网络、文件和错误。',
      outcomes: ['使用 Node 模块和标准库', '理解异步 I/O 与事件循环', '编写安全可测的基础 HTTP 服务'],
      stacks: [{ id: 'node-stack', name: 'Node.js', description: '运行时、标准库和服务端程序', nodes: [
        core({ id: 'node-runtime', title: '运行时、模块与 npm', summary: '认识 Node、进程、环境变量、模块系统和依赖锁定。', level: '基础', estimatedMinutes: 140, lessons: [
          lesson('node-runtime-basics', 'Node.js 是什么，不是什么', 'Node.js 是让 JavaScript 在服务器、命令行等环境运行的工具。浏览器提供 DOM，Node 提供文件、进程和网络等服务端 API。', [
            { heading: '模块边界', body: '应用代码从入口开始执行。ES Modules 用 import/export 表示依赖关系；package.json 记录脚本和依赖，锁文件让团队安装到一致版本。' },
            { heading: '配置放在环境中', body: '端口、开发模式等部署配置不应散落在代码里。读取环境变量后应检查缺失值并给出清楚错误。' },
          ], [{ title: '验证服务配置', language: 'ts', code: 'const port = Number(process.env.PORT ?? 3000);\n\nif (!Number.isInteger(port) || port < 1 || port > 65535) {\n  throw new Error("PORT 必须是 1 到 65535 之间的整数");\n}\n\nconsole.log(`服务将监听端口 ${port}`);', explanation: '环境变量都是字符串，使用前要转换并验证。默认值让本地开发更容易启动。' }], ['锁文件和 package.json 应一起提交。', '不要把密钥写进源码或提交到 Git。']),
        ] }),
        core({ id: 'node-async', title: '事件循环、异步 I/O 与错误', summary: '理解 Node 如何处理多个 I/O 工作而不阻塞主线程。', level: '基础', estimatedMinutes: 180, lessons: [
          lesson('node-event-loop', 'Node 的事件循环和 I/O', 'Node 通常用少量 JavaScript 线程协调很多等待中的网络和文件任务。等待磁盘或网络时，程序可以处理别的工作；长时间同步计算仍会阻塞事件循环。', [
            { heading: '异步不等于并行计算', body: '异步让程序不用在 I/O 等待期间停住。CPU 密集任务如果占住 JavaScript 线程，其他回调仍要等；需要时再评估 Worker Threads 或任务队列。' },
          ], [{ title: '优先使用 Promise API', language: 'ts', code: 'import { readFile } from "node:fs/promises";\n\nasync function readConfig(path: string) {\n  try {\n    const text = await readFile(path, "utf8");\n    return JSON.parse(text) as unknown;\n  } catch (error) {\n    if ((error as NodeJS.ErrnoException).code === "ENOENT") {\n      throw new Error(`找不到配置文件：${path}`);\n    }\n    throw error;\n  }\n}', explanation: 'Promise 版本的 fs API 能自然地配合 async/await。错误按明确情况转换，未知错误继续交给上层处理。' }], ['避免在请求处理路径中做耗时同步 I/O。']),
        ] }),
        core({ id: 'node-http', title: 'HTTP、流与资源管理', summary: '从 Node 原生 API 理解请求生命周期、流和文件资源。', level: '进阶', estimatedMinutes: 160, lessons: [
          lesson('node-http-server', '用 Node 原生 HTTP 理解服务端', '框架最后仍要处理请求和响应。先用内置 http 模块看清方法、URL、状态码和响应体，再学框架提供的路由与插件。', [
            { heading: '响应必须结束', body: '每个请求需要返回合适的状态码和内容类型，并结束响应。生产服务还要考虑输入验证、异常边界、请求体大小和日志。' },
          ], [{ title: '最小只读接口', language: 'ts', code: 'import { createServer } from "node:http";\n\nconst server = createServer((request, response) => {\n  if (request.method === "GET" && request.url === "/health") {\n    response.writeHead(200, { "content-type": "application/json" });\n    response.end(JSON.stringify({ ok: true }));\n    return;\n  }\n\n  response.writeHead(404, { "content-type": "application/json" });\n  response.end(JSON.stringify({ error: "Not found" }));\n});\n\nserver.listen(3000);', explanation: '这个例子只提供健康检查，用来学习请求分支和响应格式；它不包含生产所需的超时、日志和输入验证。' }], ['HTTP 方法与状态码表达请求意图和结果。']),
        ] }),
        core({ id: 'node-streams', title: 'Streams 与背压', summary: '按块处理大文件和网络数据，避免一次性把所有内容读入内存。', level: '进阶', estimatedMinutes: 150, lessons: [
          lesson('node-stream-pipeline', '用 pipeline 安全地连接流', 'Readable 产生数据、Transform 逐块处理、Writable 消费数据。背压让慢速消费者可以减缓生产者；stream/promises 的 pipeline 会处理错误并在失败时清理管道。', [
            { heading: '流适合大数据和连续数据', body: '小 JSON 配置可直接 readFile；大日志、上传文件或压缩任务更适合流式处理。管道中的异常要被捕获，输出文件也要选择安全路径。' },
          ], [{ title: '完整文件：大文件压缩管道', language: 'ts', code: 'import { createReadStream, createWriteStream } from "node:fs";\nimport { pipeline } from "node:stream/promises";\nimport { createGzip } from "node:zlib";\n\nasync function main() {\n  await pipeline(\n    createReadStream("input.log"),\n    createGzip(),\n    createWriteStream("input.log.gz"),\n  );\n  console.log("压缩完成");\n}\n\nmain().catch((error: unknown) => {\n  console.error("压缩失败", error);\n  process.exitCode = 1;\n});', explanation: 'Node.js ESM，使用内置 fs/stream/zlib，无第三方依赖；需在当前目录准备 input.log。pipeline 会传播错误并遵循背压。' }], ['不要忽略流的 error。', '大文件处理优先考虑流式 API，而不是 Buffer 全量读入内存。']),
        ] }),
        core({ id: 'node-process', title: '进程生命周期与 CPU 密集任务', summary: '正确响应关闭信号，理解 Worker Threads 适用的计算场景。', level: '进阶', estimatedMinutes: 130, lessons: [
          lesson('node-shutdown-worker', '优雅关闭与 Worker Threads 的边界', '服务收到 SIGTERM 时应停止接收新请求、等待正在进行的工作结束并关闭连接池。Worker Threads 适合 CPU 密集计算，不是加速普通网络 I/O 的通用办法。', [
            { heading: '让进程可管理', body: '部署平台会通过信号要求进程退出。设置退出码、清理定时器和数据库连接，让平台知道何时可以安全替换实例。' },
          ], [{ title: '完整文件：接收退出信号', language: 'ts', code: 'import { createServer } from "node:http";\n\nconst server = createServer((_request, response) => {\n  response.writeHead(200).end("ok");\n});\nserver.listen(3000);\n\nprocess.once("SIGTERM", () => {\n  console.log("停止接收新请求");\n  server.close((error) => {\n    if (error) {\n      console.error(error);\n      process.exitCode = 1;\n    }\n  });\n});', explanation: 'Node.js ESM 完整最小文件，无第三方依赖。复杂应用还需在 close 前停止队列消费者并关闭数据库连接。' }], ['关闭流程要有时间上限，避免永不退出。', 'CPU 密集任务可评估 Worker Threads；普通 I/O 通常无需线程池改写。']),
        ] }),
        ecosystem({ id: 'node-ecosystem', title: 'Node 常用生态库速览', summary: '了解校验、日志、任务队列和缓存库在服务端的用途。', level: '拓展', estimatedMinutes: 60, lessons: [
          lesson('node-libraries-overview', '校验、日志与后台任务库', 'Zod 用运行时 schema 检查外部数据；Pino 写结构化日志；BullMQ 配合 Redis 处理可重试后台任务。它们都应按项目确实遇到的问题再引入。', [
            { heading: '库不要替代基础概念', body: '先理解 HTTP 输入、日志字段和任务生命周期，再学习库的 API。库速览只关注主要功能和最短可理解用法。' },
          ], [
            { title: '用 schema 检查外部数据', language: 'ts', code: 'import { z } from "zod";\n\nconst CreatePlan = z.object({\n  title: z.string().trim().min(1).max(80),\n  weeklyHours: z.number().min(1).max(40),\n});\n\nconst result = CreatePlan.safeParse({ title: "React 入门", weeklyHours: 5 });\nif (!result.success) {\n  console.error(result.error.issues);\n} else {\n  console.log(result.data.title);\n}', explanation: 'Node.js/TypeScript 片段，依赖 zod。safeParse 返回成功/失败分支；适合校验 HTTP、环境变量、文件和第三方 API 输入。' },
            { title: '片段：Pino 输出结构化日志', language: 'ts', code: 'import pino from "pino";\n\nconst logger = pino({ level: process.env.LOG_LEVEL ?? "info" });\nlogger.info({ courseId: "node-core", action: "lesson_opened" }, "学习者打开课程");\nlogger.error({ err: new Error("数据库暂不可用") }, "读取进度失败");', explanation: 'Node.js/TypeScript 片段，依赖 pino。结构化字段便于日志检索；避免记录密钥、完整请求正文或敏感个人数据。' },
          ], ['校验发生在信任边界：HTTP 输入、环境变量、文件和第三方 API。']),
        ] }),
      ] }],
    },
    {
      id: 'server-frameworks',
      title: 'Node.js 后端框架并列学习',
      summary: '在同一阶段学习轻量路由框架与结构化框架，比较抽象层次而不是争论谁“最好”。',
      outcomes: ['理解路由和中间件', '比较 Express、Fastify、NestJS', '用统一 API 任务对照实现'],
      stacks: [
        { id: 'express-stack', name: 'Express', description: '成熟、灵活的 Node HTTP 框架', nodes: [
          core({ id: 'express-core', title: 'Express 路由与中间件', summary: '用路由拆分接口，用中间件处理重复的请求步骤。', level: '进阶', estimatedMinutes: 130, lessons: [
            lesson('express-route-middleware', 'Express 的路由、中间件和错误边界', 'Express 在 Node HTTP 上提供路由与中间件模型。请求沿着注册顺序经过函数，函数可以继续传递、结束响应或把错误交给错误处理中间件。', [
              { heading: '先验证，再使用输入', body: '路由参数和请求正文都来自外部。类型断言不会验证 JSON；用运行时 schema 校验之后再把数据交给业务逻辑。' },
            ], [{ title: '显式分开路由与错误处理', language: 'ts', code: 'import express from "express";\n\nconst app = express();\napp.use(express.json({ limit: "32kb" }));\n\napp.get("/api/health", (_req, res) => {\n  res.json({ ok: true });\n});\n\napp.use((_req, res) => {\n  res.status(404).json({ error: "Not found" });\n});\n\napp.listen(3000);', explanation: '路由顺序很重要；生产应用还需要集中式错误处理、输入 schema 和合理的请求体限制。' }], ['中间件要么结束响应，要么调用 next()。']),
          ] }),
        ] },
        { id: 'fastify-stack', name: 'Fastify', description: '以 schema 和插件封装强调性能与边界的框架', nodes: [
          core({ id: 'fastify-core', title: 'Fastify schema 与插件', summary: '用 schema 描述请求/响应边界，用插件封装可组合能力。', level: '进阶', estimatedMinutes: 120, lessons: [
            lesson('fastify-schema-route', 'Fastify 路由 schema 的价值', 'Fastify 可以用 schema 描述参数、请求和响应。schema 不只是文档：它还能帮助验证输入并保持接口形状清楚。', [
              { heading: '插件组织功能', body: '插件把有关的路由、装饰器和钩子放在一起。清楚的注册顺序和作用域有助于避免“某个路由为什么拿不到依赖”的问题。' },
            ], [{ title: '为路由声明输入形状', language: 'ts', code: 'import Fastify from "fastify";\n\nconst app = Fastify({ logger: true });\nconst courses = [{ id: "1", title: "Node.js 入门" }];\n\napp.get<{ Params: { id: string } }>(\n  "/api/courses/:id",\n  { schema: { params: { type: "object", required: ["id"], properties: { id: { type: "string" } } } } },\n  async (request, reply) => {\n    const course = courses.find((item) => item.id === request.params.id);\n    if (!course) return reply.code(404).send({ error: "Not found" });\n    return course;\n  },\n);', explanation: '示例展示请求边界和 404 路径；生产代码可将 schema 提取为独立定义并验证响应结构。' }], ['Fastify 可以从 schema 生成接口文档，但 schema 仍要维护准确。']),
          ] }),
        ] },
        { id: 'nestjs-stack', name: 'NestJS', description: '模块化、依赖注入和装饰器组成的应用框架', nodes: [
          core({ id: 'nestjs-architecture', title: 'Module、Controller 与 Provider', summary: '用模块组织功能，用控制器接 HTTP，用 provider 管理业务依赖。', level: '进阶', estimatedMinutes: 160, lessons: [
            lesson('nest-module-controller', 'NestJS 的模块化思路', 'Nest 把应用拆成模块；Controller 负责把 HTTP 请求交给业务逻辑；Provider 通常承载可注入的 service。这样可以在不把所有代码堆进路由的情况下组织项目。', [
              { heading: '依赖注入解决什么问题', body: '类不必自己创建所有依赖，可以由框架在模块范围内提供。测试时也更容易替换 service。不要为了使用装饰器而盲目增加层次。' },
            ], [{ title: '最小 Controller 与 Service', language: 'ts', code: 'import { Controller, Get, Injectable, Module } from "@nestjs/common";\n\n@Injectable()\nclass CoursesService {\n  findAll() {\n    return [{ id: "node-1", title: "Node.js 入门" }];\n  }\n}\n\n@Controller("courses")\nclass CoursesController {\n  constructor(private readonly courses: CoursesService) {}\n\n  @Get()\n  list() { return this.courses.findAll(); }\n}\n\n@Module({ controllers: [CoursesController], providers: [CoursesService] })\nclass CoursesModule {}', explanation: '真实项目应把这些类放在独立文件、通过 Nest CLI 生成模块，并对 HTTP 输入使用 DTO 与验证管道。' }], ['Controller 管 HTTP，service 管业务规则。']),
            lesson('nestjs-validation-guards', 'DTO、Pipe 与 Guard', 'Pipe 可以转换或验证进入处理器的数据；Guard 决定请求是否可以进入处理器。它们都位于业务 service 之前，但解决的问题不同。', [
              { heading: '认证不等于授权', body: '认证回答“你是谁”，授权回答“你能对这个资源做什么”。每个私有资源仍应按当前用户验证访问权限。' },
            ], [{ title: '从参数中取出已验证的 ID', language: 'ts', code: 'import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";\n\n@Controller("lessons")\nclass LessonsController {\n  @Get(":id")\n  findOne(@Param("id", ParseIntPipe) id: number) {\n    return { id, title: `课程 ${id}` };\n  }\n}', explanation: 'ParseIntPipe 在控制器处理前转换并验证参数；不能转换的值会产生客户端错误，而不是带着 NaN 进入业务逻辑。' }], ['Pipe 处理数据转换/验证；Guard 处理访问决策。']),
          ] }),
          core({ id: 'nestjs-crud', title: 'Service、DTO 与完整资源流程', summary: '从创建请求到业务服务，理解 Nest 中一条资源接口如何协作。', level: '进阶', estimatedMinutes: 150, lessons: [
            lesson('nestjs-crud-service', 'Controller 薄、Service 负责业务', 'Controller 负责 HTTP 参数和响应，Service 承载业务规则。DTO 描述输入形状，ValidationPipe 执行运行时校验；TypeScript 类型本身不会验证 JSON。', [
              { heading: '模块必须导出需要共享的 Provider', body: '模块声明 controllers/providers/imports/exports。其他模块需要某服务时，应通过 exports 暴露并在 imports 引入，避免在每个文件自行 new 依赖。' },
            ], [{ title: '片段：创建课程的 Controller 与 Service', language: 'ts', code: 'import { Body, Controller, Injectable, Module, Post } from "@nestjs/common";\n\nclass CreateCourseDto {\n  title!: string;\n}\n@Injectable()\nclass CoursesService {\n  create(input: CreateCourseDto) { return { id: "course-1", title: input.title }; }\n}\n@Controller("courses")\nclass CoursesController {\n  constructor(private readonly courses: CoursesService) {}\n  @Post() create(@Body() input: CreateCourseDto) { return this.courses.create(input); }\n}\n@Module({ controllers: [CoursesController], providers: [CoursesService] })\nclass CoursesModule {}', explanation: 'NestJS 片段，依赖 @nestjs/common，并要求项目启用装饰器编译选项；DTO 验证还需 class-validator/class-transformer 与全局 ValidationPipe。' }], ['避免在 Controller 重复业务规则。']),
          ] }),
          core({ id: 'nestjs-errors-auth', title: '异常、认证授权与配置', summary: '用异常过滤和 Guard 建立一致的错误及访问控制边界。', level: '进阶', estimatedMinutes: 140, lessons: [
            lesson('nestjs-guard-errors', 'Guard 做权限边界，异常表达失败', 'Guard 在处理器前判断请求是否允许继续；认证识别用户，授权检查用户对具体资源的权限。框架异常过滤器可统一映射错误响应，但不能把堆栈和秘密传给客户端。', [
              { heading: '先验证资源归属', body: '只检查“已登录”不代表用户能读取任意记录。访问详情时还要按 userId/tenantId 检查资源归属，并在测试中覆盖拒绝路径。' },
            ], [{ title: '片段：角色 Guard', language: 'ts', code: 'import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";\n\ntype RequestWithUser = { user?: { roles: string[] } };\n@Injectable()\nexport class AdminGuard implements CanActivate {\n  canActivate(context: ExecutionContext): boolean {\n    const request = context.switchToHttp().getRequest<RequestWithUser>();\n    return request.user?.roles.includes("admin") ?? false;\n  }\n}', explanation: 'NestJS 片段，依赖 @nestjs/common；假设认证 Guard 已把 user 放入请求。生产授权还应检查资源级权限，并用测试覆盖未登录和无权限情形。' }], ['认证和授权是两个不同判断。']),
          ] }),
          core({ id: 'nestjs-testing-docs', title: 'Nest 测试、OpenAPI 与模块集成', summary: '测试服务行为并为 HTTP 接口生成可检查的契约文档。', level: '进阶', estimatedMinutes: 120, lessons: [
            lesson('nestjs-testing', '替换依赖测试 Service', 'Nest TestingModule 可以按模块创建测试容器，并用替代 Provider 隔离数据库或外部 API。Service 单测速度快；HTTP 集成测试再验证路由、验证管道和状态码。', [
              { heading: '接口契约便于协作', body: 'Swagger/OpenAPI 描述路径、参数和响应，让前端能查接口并支持生成客户端。文档需和真实校验及响应保持一致。' },
            ], [{ title: '片段：Nest TestingModule 测试', language: 'ts', code: 'import { Test } from "@nestjs/testing";\n\nclass CoursesService { findAll() { return []; } }\ndescribe("CoursesService", () => {\n  it("returns an empty list", async () => {\n    const moduleRef = await Test.createTestingModule({\n      providers: [CoursesService],\n    }).compile();\n    const service = moduleRef.get(CoursesService);\n    expect(service.findAll()).toEqual([]);\n    await moduleRef.close();\n  });\n});', explanation: '依赖 @nestjs/testing、Jest 和本课前面定义的 CoursesService；若 service 注入其他依赖，应在 providers 中提供测试替身。' }], ['测试结果和接口契约应反映用户可见行为。']),
          ] }),
        ] },
      ],
    },
    {
      id: 'data-api',
      title: 'API、数据库与服务边界',
      summary: '把数据建模、验证和 API 设计连接起来，让应用有可靠的数据基础。',
      outcomes: ['会设计 REST 接口', '掌握 SQL 和关系', '理解校验、ORM 与测试各自的作用'],
      stacks: [{ id: 'data-stack', name: '数据库与服务生态', description: '从 SQL 基础到常见数据工具', nodes: [
        core({ id: 'sql-postgres', title: 'SQL 与 PostgreSQL', summary: '用关系、约束、索引和事务保存一致的数据。', level: '进阶', estimatedMinutes: 220, lessons: [
          lesson('sql-relations', '从表和关系理解数据模型', '关系数据库把实体放在表里，通过主键和外键连接。先想清楚数据关系和需要保护的不变量，再决定是否使用 ORM。', [
            { heading: '约束让坏数据进不来', body: 'NOT NULL、UNIQUE、外键和 CHECK 约束能在数据库层保护数据。应用校验负责给用户友好提示，数据库约束负责最后一道一致性保障。' },
            { heading: '事务是成组操作', body: '转账或一次性创建父子记录时，多个 SQL 操作要么全部成功，要么全部回滚。事务的边界应尽量短。' },
          ], [{ title: '查询并分页读取课程', language: 'sql', code: 'SELECT id, title, level\nFROM lessons\nWHERE published = true\nORDER BY position ASC\nLIMIT 20 OFFSET 0;', explanation: '先筛选已发布内容，再按稳定顺序分页。大数据量时通常会讲 keyset pagination，不能随意依赖不稳定顺序。' }], ['外键表达表之间的关系。']),
          lesson('sql-transaction', '事务与唯一约束', '数据库事务让一组相关写入一起成功或一起失败。它是维护数据不变量的工具，不是简单的“多条 SQL 一起跑”。', [
            { heading: '并发也要考虑', body: '两个请求可能同时检查“还没有这条记录”然后一起插入。唯一约束会在并发情况下提供可靠防线，应用再把冲突转换成友好结果。' },
          ], [{ title: '事务伪代码', language: 'ts', code: 'await db.transaction(async (tx) => {\n  const plan = await tx.plan.create({ data: { title: "Node 路线" } });\n  await tx.lesson.createMany({\n    data: [\n      { planId: plan.id, title: "HTTP 基础" },\n      { planId: plan.id, title: "事件循环" },\n    ],\n  });\n});', explanation: '任何一步失败，事务会回滚，避免只创建计划却缺少其课程。不同 ORM 的事务 API 具体写法略有差异。' }], ['用数据库约束保护必须成立的数据规则。']),
        ] }),
        core({ id: 'orm-query', title: 'ORM 与查询构建工具', summary: '了解 Prisma、Drizzle 等工具如何映射模型、生成查询和迁移。', level: '进阶', estimatedMinutes: 100, lessons: [
          lesson('orm-tradeoffs', 'ORM 帮你做什么，也不能替你做什么', 'ORM 帮你把应用对象和 SQL 表联系起来，减少重复映射，并可能提供类型生成。它不会替你理解数据模型、事务和查询性能。', [
            { heading: '学过 SQL 再学 ORM', body: '理解查询、索引和连接后，ORM 生成的 SQL 才看得懂。遇到慢查询时要检查实际 SQL 和执行计划，而不是先换库。' },
          ], [{ title: '关系查询的伪代码', language: 'ts', code: 'const plan = await db.plan.findUnique({\n  where: { id: planId },\n  include: { lessons: { orderBy: { position: "asc" } } },\n});', explanation: '不同 ORM 的 API 形状不同，关键是清楚读取了哪些表、是否一次加载过多关系，以及数据库最终运行了什么 SQL。' }], ['ORM 是 SQL 的抽象层，不是数据库本身。']),
        ] }),
        ecosystem({ id: 'data-ecosystem', title: '校验与 API 测试速览', summary: '用简短示例认识 Zod、API 契约和 Supertest 一类测试工具。', level: '拓展', estimatedMinutes: 45, lessons: [
          lesson('api-validation-testing', '输入校验、错误格式与接口测试', '浏览器送来的 JSON 不可信。运行时 schema 可检查字段；接口测试可以启动应用并验证真实 HTTP 行为。', [
            { heading: '返回可操作的错误', body: '错误响应应给出稳定错误代码和简短说明，不要把堆栈、SQL 或密钥送给客户端。接口测试应检查无效输入、未找到资源和成功路径。' },
          ], [{ title: '接口测试的结构', language: 'ts', code: 'it("无效的课程标题会返回 400", async () => {\n  const response = await request(app)\n    .post("/api/courses")\n    .send({ title: "" });\n\n  expect(response.status).toBe(400);\n  expect(response.body.error).toBe("VALIDATION_ERROR");\n});', explanation: '测试要验证外部可观察的状态码和错误形状，不应只断言某个私有函数被调用。' }], ['对成功、无效输入、权限拒绝和资源不存在分别编写用例。']),
        ] }),
      ] }],
    },
    {
      id: 'react',
      title: 'React：用组件构建界面',
      summary: '掌握声明式 UI、状态、表单和组件组合，再进入完整 Web 框架。',
      outcomes: ['拆分可复用组件', '管理本地界面状态', '处理加载、错误与表单'],
      stacks: [{ id: 'react-stack', name: 'React', description: 'Web 界面组件模型与生态', nodes: [
        core({ id: 'react-components', title: '组件、Props 与 JSX', summary: '用小组件表达界面单元，通过 props 传入外部数据。', level: '基础', estimatedMinutes: 150, lessons: [
          lesson('react-components', '把页面拆成组件', '组件是接收输入并返回界面的函数。把课程卡片、进度条和页面布局分开，能让每个部分更容易理解和复用。', [
            { heading: 'Props 是组件输入', body: '父组件把需要的数据和回调通过 props 传给子组件。子组件不应偷偷修改父组件数据；状态由拥有它的组件负责。' },
            { heading: '列表需要稳定 key', body: 'React 用 key 对比前后列表项，知道哪些内容被新增、移除或移动。尽量使用稳定 ID，不要在可重排列表里用数组索引。' },
          ], [{ title: '渲染一张课程卡片', language: 'tsx', code: 'type Course = { id: string; title: string; done: boolean };\n\nexport function CourseList({ courses }: { courses: Course[] }) {\n  return <ul>{courses.map((course) => (\n    <li key={course.id}><strong>{course.title}</strong><span>{course.done ? "已完成" : "待学习"}</span></li>\n  ))}</ul>;\n}', explanation: 'React + TypeScript JSX 组件片段，无外部库。courses 是父组件传来的 props；key 使用稳定 ID，列表重排时不会错配状态。' }], ['组件优先描述界面，不把每个 div 都拆成一个组件。']),
        ] }),
        core({ id: 'react-state', title: 'State、事件与表单', summary: '让交互状态驱动界面，并处理用户输入。', level: '基础', estimatedMinutes: 180, lessons: [
          lesson('react-state', 'State 是界面变化的来源', 'React state 保存需要在重新渲染间记住的值。调用 setter 后 React 会安排一次新的渲染；不要直接修改对象或数组原值。', [
            { heading: '函数式更新处理旧状态', body: '当新值取决于旧值时，用 setState(previous => next) 避免读取过时的闭包值。' },
          ], [{ title: '不可变地更新进度', language: 'tsx', code: 'import { useState } from "react";\n\nexport function LessonToggle() {\n  const [done, setDone] = useState(false);\n  return <button onClick={() => setDone((previous) => !previous)}>{done ? "已完成" : "标记完成"}</button>;\n}', explanation: 'React + TypeScript 组件片段；依赖 react，需置于已配置 React JSX 的项目。事件触发 setter 后重新渲染，不要直接修改状态变量。' }], ['State 是可变化的应用数据；props 是父组件给的输入。']),
        ] }),
        core({ id: 'react-effects', title: 'Hooks 与副作用边界', summary: '掌握 useState/useEffect 的基本使用与常见误区。', level: '进阶', estimatedMinutes: 130, lessons: [
          lesson('react-effect', '什么时候需要 useEffect', 'Effect 用来让 React 与外部系统同步，例如订阅事件或更新 document title。计算派生值和响应点击，通常不需要 Effect。', [
            { heading: '清理外部订阅', body: 'Effect 返回清理函数，可在组件离开或依赖变化时取消订阅。缺少清理会造成重复监听或资源泄漏。' },
          ], [{ title: '订阅并清理窗口事件', language: 'tsx', code: 'import { useEffect, useState } from "react";\n\nexport function ViewportWidth() {\n  const [width, setWidth] = useState(0);\n  useEffect(() => {\n    const onResize = () => setWidth(window.innerWidth);\n    window.addEventListener("resize", onResize);\n    onResize();\n    return () => window.removeEventListener("resize", onResize);\n  }, []);\n  return <p>窗口宽度：{width}px</p>;\n}', explanation: 'React + TypeScript 浏览器组件片段，依赖 react。window 只存在于浏览器，Next.js SSR 项目应只在 effect 中访问它。' }], ['先问是否可以在渲染时计算或在事件处理器里完成，再决定要不要 Effect。']),
        ] }),
        core({ id: 'react-context-reducer', title: 'Context、Reducer 与复杂交互', summary: '为跨层共享状态和多步骤状态转换选合适的 React 原语。', level: '进阶', estimatedMinutes: 130, lessons: [
          lesson('react-context-reducer', '用 Reducer 明确状态转换', 'useReducer 把“当前状态 + 动作”转换成新状态，适合多个动作共享同一状态规则的交互。Context 负责让深层组件读取共享值，不应把所有状态都放进去。', [
            { heading: '状态更新保持纯函数', body: 'Reducer 不应发网络请求或改外部变量。副作用放在事件处理或专门的数据请求工具中；这样状态变化可预测、容易测试。' },
          ], [{ title: '完整组件：Reducer 管理课程标记', language: 'tsx', code: 'import { useReducer } from "react";\n\ntype State = { doneIds: string[] };\ntype Action = { type: "toggle"; id: string };\nfunction reducer(state: State, action: Action): State {\n  const exists = state.doneIds.includes(action.id);\n  return { doneIds: exists ? state.doneIds.filter((id) => id !== action.id) : [...state.doneIds, action.id] };\n}\nexport function ProgressButton({ id }: { id: string }) {\n  const [state, dispatch] = useReducer(reducer, { doneIds: [] });\n  const done = state.doneIds.includes(id);\n  return <button onClick={() => dispatch({ type: "toggle", id })}>{done ? "已完成" : "标记完成"}</button>;\n}', explanation: 'React + TypeScript 组件，无外部库。适合展示 reducer 的状态转换；持久化和跨页面共享需另加 Context/存储方案。' }], ['Reducer 只计算新状态，不执行副作用。']),
        ] }),
        core({ id: 'react-forms-a11y', title: '表单、校验与可访问性', summary: '让键盘、屏幕阅读器和表单错误提示都能被用户理解。', level: '进阶', estimatedMinutes: 130, lessons: [
          lesson('react-form-accessible', '构建可访问的受控表单', 'label 要关联输入框，错误提示要与字段建立关系。提交时验证用户输入，并在失败后让用户知道如何修正；不要只用颜色表达错误。', [
            { heading: '原生能力先用好', body: 'type、required、minLength 等原生约束可改善移动键盘和基础校验。复杂表单可学习 React Hook Form 与 Zod，但仍需显示可访问的错误信息。' },
          ], [{ title: '完整组件：带错误提示的表单', language: 'tsx', code: 'import { useState, type FormEvent } from "react";\n\nexport function PlanForm() {\n  const [error, setError] = useState("");\n  function submit(event: FormEvent<HTMLFormElement>) {\n    event.preventDefault();\n    const data = new FormData(event.currentTarget);\n    const title = String(data.get("title") ?? "").trim();\n    setError(title.length >= 2 ? "" : "标题至少需要 2 个字");\n  }\n  return <form onSubmit={submit} noValidate>\n    <label htmlFor="title">计划名称</label>\n    <input id="title" name="title" aria-invalid={Boolean(error)} aria-describedby={error ? "title-error" : undefined} />\n    {error && <p id="title-error" role="alert">{error}</p>}\n    <button type="submit">保存计划</button>\n  </form>;\n}', explanation: 'React + TypeScript 浏览器组件，依赖 react。演示前端反馈，不替代服务端/运行时校验。' }], ['每个输入框都应有可见关联标签。', '错误文案要说明如何修正。']),
        ] }),
        ecosystem({ id: 'react-libraries', title: 'React 常用库速览', summary: '认识数据请求、表单、状态管理和 CSS 工具的主要职责。', level: '拓展', estimatedMinutes: 60, lessons: [
          lesson('react-ecosystem-overview', '服务端数据和界面状态要分开想', 'TanStack Query 管理远程请求结果的缓存、加载和刷新；Zustand/Redux 管客户端共享状态；React Hook Form 管表单字段状态。React 自带 state 仍是很多局部交互的最佳起点。', [
            { heading: '库各管一类问题', body: '不要把请求结果和菜单是否展开混成一种状态。服务端状态需要缓存失效和错误重试；界面状态通常只在当前交互中存在。' },
          ], [
            { title: '片段：TanStack Query 加载课程', language: 'tsx', code: 'import { useQuery } from "@tanstack/react-query";\n\ntype Course = { id: string; title: string };\nasync function fetchCourses(): Promise<Course[]> {\n  const response = await fetch("/api/courses");\n  if (!response.ok) throw new Error("课程加载失败");\n  return response.json() as Promise<Course[]>;\n}\nexport function Courses() {\n  const query = useQuery({ queryKey: ["courses"], queryFn: fetchCourses });\n  if (query.isPending) return <p>加载中…</p>;\n  if (query.isError) return <p role="alert">{query.error.message}</p>;\n  return <ul>{query.data.map((course) => <li key={course.id}>{course.title}</li>)}</ul>;\n}', explanation: 'React + @tanstack/react-query 片段；应用根部需包 QueryClientProvider。泛型断言不验证 JSON，实际应用应在边界使用 Zod 等 schema。' },
            { title: '片段：Zustand 保存筛选状态', language: 'tsx', code: 'import { create } from "zustand";\n\ntype FilterStore = { level: string; setLevel: (level: string) => void };\nconst useFilterStore = create<FilterStore>((set) => ({\n  level: "全部",\n  setLevel: (level) => set({ level }),\n}));\nexport function LevelFilter() {\n  const { level, setLevel } = useFilterStore();\n  return <select value={level} onChange={(event) => setLevel(event.target.value)}>\n    <option>全部</option><option>基础</option><option>进阶</option>\n  </select>;\n}', explanation: 'React + zustand 片段，无需 Provider。这里只存共享的界面筛选状态；远程服务器数据应交给 query 工具缓存。' },
            { title: '片段：React Hook Form 处理输入', language: 'tsx', code: 'import { useForm } from "react-hook-form";\n\ntype Values = { title: string };\nexport function CourseForm() {\n  const { register, handleSubmit, formState: { errors } } = useForm<Values>();\n  return <form onSubmit={handleSubmit((values) => console.log(values))}>\n    <label>课程标题<input {...register("title", { required: "请填写标题", minLength: { value: 2, message: "至少 2 个字" } })} /></label>\n    {errors.title && <p role="alert">{errors.title.message}</p>}\n    <button type="submit">保存</button>\n  </form>;\n}', explanation: 'React + react-hook-form 片段；复杂 schema 可结合 @hookform/resolvers 与 Zod。console.log 仅作教学占位，正式提交要调用业务函数。' },
          ], ['TanStack Query 管远程数据缓存；Zustand 管共享界面状态；React Hook Form 管表单状态。']),
        ] }),
      ] }],
    },
    {
      id: 'web-frameworks',
      title: 'React Web 应用与 Next.js',
      summary: '并列理解 SPA 路由和全栈 React 框架，根据页面需求选择渲染方式。',
      outcomes: ['处理客户端路由', '区分客户端与服务端渲染', '构建完整 Next.js 应用'],
      stacks: [
        { id: 'react-router-stack', name: 'React Router / SPA', description: '客户端导航和浏览器页面结构', nodes: [
          core({ id: 'react-routing', title: '路由、导航与页面状态', summary: '将 URL 映射到页面，让导航可分享、可刷新和可返回。', level: '进阶', estimatedMinutes: 120, lessons: [
            lesson('react-router-basics', 'URL 是应用状态的一部分', '好的路线页面有可分享的网址。URL 应能表达用户现在看的课程或筛选条件，浏览器刷新后应该仍能回到同一内容。', [
              { heading: '导航要尊重浏览器', body: '链接应该支持打开新标签、复制网址和键盘访问。路由库处理客户端切换，但部署服务器也必须把深路径回退到 SPA 入口。' },
            ], [{ title: '用链接表示导航目标', language: 'tsx', code: 'import { Link } from "react-router-dom";\n\ntype Course = { id: string; title: string };\nexport function CourseLink({ course }: { course: Course }) {\n  return <Link to={`/courses/${course.id}`}>{course.title}</Link>;\n}', explanation: 'React + react-router-dom 组件片段。course 作为 props 传入；真实项目还需在 RouterProvider/BrowserRouter 下渲染。' }], ['搜索条件适合保存在 query string，能复制分享。']),
          ] }),
        ] },
        { id: 'next-stack', name: 'Next.js', description: '以路由约定和服务端能力构建 React Web 应用', nodes: [
          core({ id: 'next-app-router', title: 'App Router、Layout 与路由', summary: '使用文件系统路由、嵌套布局和错误/加载边界。', level: '进阶', estimatedMinutes: 180, lessons: [
            lesson('next-app-router', '文件系统路由和嵌套布局', 'Next.js App Router 用目录和文件表达 URL、布局和页面。布局在相关页面之间共享，让导航外壳不必每次重建。', [
              { heading: '加载状态是用户体验', body: '网络请求可能较慢。loading UI、空状态和错误边界要与正常页面一起设计，避免用户面对空白屏幕。' },
            ], [{ title: '最小页面组件', language: 'tsx', code: 'export default function CoursePage() {\n  return (\n    <main>\n      <h1>Node.js 事件循环</h1>\n      <p>理解异步 I/O 如何让服务端保持响应。</p>\n    </main>\n  );\n}', explanation: '文件路径决定 URL；真实课程页还要加入 metadata、数据读取、加载状态和错误处理。' }], ['学习 App Router 前先掌握 React 组件与服务端基础。']),
            lesson('next-server-client', '服务端组件与客户端组件', '服务端组件可以在服务端读取数据并减少送到浏览器的 JavaScript；客户端组件负责点击、输入和浏览器 API。use client 表示客户端边界，不是性能开关。', [
              { heading: '边界两侧传什么', body: '服务端到客户端传递的 props 需要可序列化。不要把服务器密钥或仅服务端依赖带入客户端 bundle。' },
            ], [{ title: '服务端页面读取数据，交互组件处理按钮', language: 'tsx', code: '// app/courses/page.tsx (Server Component)\nimport { CourseList } from "./course-list";\ntype Course = { id: string; title: string };\nasync function getCourses(): Promise<Course[]> {\n  return [{ id: "node-1", title: "Node.js 入门" }];\n}\nexport default async function CoursesPage() {\n  const courses = await getCourses();\n  return <CourseList courses={courses} />;\n}\n\n// app/courses/course-list.tsx\n"use client";\nimport { useState } from "react";\ntype Course = { id: string; title: string };\nexport function CourseList({ courses }: { courses: Course[] }) {\n  const [selected, setSelected] = useState<string | null>(null);\n  return courses.map((course) => (\n    <button key={course.id} onClick={() => setSelected(course.id)}>\n      {course.title}{selected === course.id ? "（当前）" : ""}\n    </button>\n  ));\n}', explanation: 'Next.js App Router 两个文件的示意片段；依赖 next/react 和自动 JSX 配置。服务端与客户端各自声明 Course，生产项目建议从共享 types 模块导入。' }], ['只有需要浏览器交互的组件才进入客户端边界。']),
          ] }),
          core({ id: 'next-data', title: '数据获取、缓存与 Server Actions', summary: '理解请求数据、缓存失效和表单变更的安全边界。', level: '进阶', estimatedMinutes: 180, lessons: [
            lesson('next-data-cache', '缓存需要明确失效条件', '缓存让相同数据不用每次重新计算或请求，但缓存也会让旧数据继续出现。要明确缓存什么、何时过期、写操作后怎样刷新。', [
              { heading: '读写逻辑分开考虑', body: '读页面可以缓存；用户提交的变更需要校验、鉴权并处理重复提交。不能仅因请求来自自己的界面就信任其输入。' },
            ], [{ title: '表单动作的概念示例', language: 'tsx', code: '"use server";\n\nimport { revalidatePath } from "next/cache";\n\nasync function saveCourse(input: { title: string }) {\n  // 教学占位：真实项目在这里写入服务端存储。\n  return input;\n}\n\nexport async function createCourse(formData: FormData) {\n  const title = String(formData.get("title") ?? "").trim();\n  if (title.length < 2) return { error: "标题至少需要 2 个字" };\n\n  await saveCourse({ title });\n  revalidatePath("/courses");\n  return { ok: true };\n}', explanation: 'Next.js Server Action 片段，依赖 next/cache；saveCourse 是服务端持久化占位函数。真实实现需鉴权、运行时校验、处理重复提交并安全返回错误。' }], ['缓存策略是产品语义的一部分，不是盲目套用的优化。']),
          ] }),
          core({ id: 'next-routes-seo', title: 'Route Handlers、Metadata 与部署边界', summary: '为 API 请求和网页元信息建立清晰的服务端入口。', level: '进阶', estimatedMinutes: 140, lessons: [
            lesson('next-route-handler', '在 Route Handler 中实现 HTTP API', 'app/api/.../route.ts 用标准 Request/Response 处理 HTTP。它适合提供 API；需要更复杂校验、认证、速率限制时仍要显式设计这些边界。', [
              { heading: '状态码与输入校验', body: 'JSON.parse 或类型声明不会验证不可信输入。用 Zod 等运行时 schema 检查请求正文，并为无效数据返回明确 400。' },
            ], [{ title: '完整文件：Next API Route Handler', language: 'ts', code: 'import { NextResponse } from "next/server";\n\nexport async function GET() {\n  return NextResponse.json({ ok: true });\n}\n\nexport async function POST(request: Request) {\n  const body: unknown = await request.json().catch(() => null);\n  if (!body || typeof body !== "object" || !("title" in body)) {\n    return NextResponse.json({ error: "INVALID_INPUT" }, { status: 400 });\n  }\n  return NextResponse.json({ accepted: true }, { status: 201 });\n}', explanation: 'Next.js App Router 文件 app/api/health/route.ts，依赖 next/server。示例只演示路由和响应；生产应使用 schema 校验字段、长度及权限。' }], ['Route Handler 在服务端运行，不要把密钥放进客户端组件。']),
            lesson('next-metadata-deploy', 'Metadata、渲染选择与缓存', '静态页面适合预生成；用户个性化内容需要请求时读取；缓存适合变化频率较低的数据。Metadata 应让搜索结果和分享卡片准确，部署平台还要支持 Next 所需的运行时能力。', [
              { heading: '先明确内容是否因用户而异', body: '用户特定页面不能被错误地共享缓存。部署前验证构建模式、环境变量、图片域名和运行时限制，不能把 Next 服务端功能假设成任意静态托管都能运行。' },
            ], [{ title: '片段：页面 Metadata', language: 'tsx', code: 'import type { Metadata } from "next";\n\nexport const metadata: Metadata = {\n  title: "Node 全栈学习路线",\n  description: "按自己的节奏学习 Node、React 与移动开发。",\n};\n\nexport default function Page() {\n  return <main><h1>学习路线</h1></main>;\n}', explanation: 'Next.js App Router 的 app/page.tsx 片段，依赖 next 的 Metadata 类型和 React JSX；静态 metadata 适合不依赖请求参数的页面。' }], ['缓存必须遵循内容的隐私和更新语义。']),
          ] }),
        ] },
      ],
    },
    {
      id: 'mobile',
      title: 'React Native 与 Expo 移动开发',
      summary: '使用 React 技能构建 iOS 与 Android 体验，理解原生平台边界和构建流程。',
      outcomes: ['理解 RN 与浏览器 UI 的不同', '完成导航和设备适配', '构建 iOS/Android 安装包'],
      stacks: [{ id: 'rn-stack', name: 'React Native / Expo', description: '共享 JavaScript 代码，使用原生平台视图', nodes: [
        core({ id: 'rn-primitives', title: '组件、样式与平台差异', summary: '使用 View、Text、Pressable 与 Flexbox 构造原生界面。', level: '进阶', estimatedMinutes: 150, lessons: [
          lesson('rn-component-model', 'React Native 不是把网页塞进 App', 'React Native 的 View、Text、Pressable 会映射到原生视图，不是 HTML 标签。布局类似 Flexbox，但样式能力和浏览器 CSS 并不完全相同。', [
            { heading: '平台差异要显式处理', body: '安全区域、键盘、权限和返回行为都属于移动端体验。尽量先用跨平台组件；平台特定行为再用 Platform 或平台文件处理。' },
          ], [{ title: '实现一个触控友好的卡片', language: 'tsx', code: 'import { Pressable, StyleSheet, Text } from "react-native";\n\nexport function CourseCard({ title, onPress }: { title: string; onPress: () => void }) {\n  return <Pressable onPress={onPress} accessibilityRole="button" style={({ pressed }) => [styles.card, pressed && styles.pressed]}>\n    <Text style={styles.title}>{title}</Text>\n  </Pressable>;\n}\nconst styles = StyleSheet.create({\n  card: { padding: 16, borderRadius: 12, backgroundColor: "white" },\n  pressed: { opacity: 0.72 },\n  title: { fontSize: 18, fontWeight: "600" },\n});', explanation: 'React Native + TypeScript 组件片段，依赖 react-native。Touchable target 和 accessibilityRole 一起设计；StyleSheet 不是完整 CSS。' }], ['页面 WebView 包壳和原生 UI 是两种不同架构，需按产品体验选择。']),
        ] }),
        core({ id: 'expo-navigation', title: '导航、状态栏与安全区域', summary: '组织移动页面导航并适配系统状态栏、手势和安全区域。', level: '进阶', estimatedMinutes: 130, lessons: [
          lesson('expo-routing', '移动端路由与返回栈', '移动导航不仅是切换页面，还要理解返回栈：从列表进入详情后，系统返回通常应回到列表原位置。深链接也应能直接打开对应内容。', [
            { heading: 'Expo Router 与 React Navigation', body: 'Expo Router 以文件组织路由并建立在 React Navigation 之上；React Navigation 提供导航器和屏幕选项。选一套路线深入即可，速览时说明它们的关系。' },
          ], [{ title: '读取路由参数的形状', language: 'tsx', code: 'type CourseRoute = {\n  name: "course";\n  params: { courseId: string };\n};\n\nfunction CourseScreen({ route }: { route: CourseRoute }) {\n  return <Text>课程编号：{route.params.courseId}</Text>;\n}', explanation: '例子只描述屏幕收到的参数类型；真实导航库会提供自己的 route 类型和导航 props。' }], ['系统返回键、导航返回按钮和手势应保持一致。']),
        ] }),
        core({ id: 'expo-build', title: '设备能力、调试与应用构建', summary: '了解权限、本地存储、日志和 Expo 安装包构建流程。', level: '进阶', estimatedMinutes: 150, lessons: [
          lesson('expo-build-release', '从模拟器到可安装包', '开发构建用于连本地开发工具调试；生产构建是可安装的独立应用。签名和应用标识都影响安装与分发，构建前要区分 iOS 和 Android 要求。', [
            { heading: '测试设备行为', body: '至少检查键盘、安全区域、低网速、失去网络、权限拒绝、系统返回和应用重启。模拟器有帮助，但依赖相机、推送或特定硬件的能力需要真实设备补测。' },
          ], [{ title: 'Expo 构建命令示例', language: 'bash', code: 'npx expo start\neas build --platform android\neas build --platform ios', explanation: '第一条启动开发服务器；后两条通过 EAS 生成平台构建物。iOS 真机安装与分发需要相应签名配置。' }], ['React Native 本地 UI 常用 AsyncStorage 或 SQLite；WebView 页面则使用其来源域名的浏览器存储。']),
        ] }),
        core({ id: 'rn-webview-shell', title: 'React Native WebView 壳与安全导航', summary: '把响应式 Web 学习站装入 iOS/Android 外壳，处理加载、错误与外链。', level: '进阶', estimatedMinutes: 140, lessons: [
          lesson('rn-webview-load', '加载远程 Web 并处理导航边界', 'WebView 可以复用响应式网站界面，但它不会自动让网页拥有原生体验。明确可信站点域名、加载指示、失败重试、离线说明和返回行为，避免任意网页在 App 内打开。', [
            { heading: '权限与来源要有限制', body: '只允许可信 HTTPS 域名留在 WebView；外部链接交给系统浏览器。不要通过宽泛的 JavaScript bridge 让网页调用任意原生能力。' },
          ], [{ title: '片段：仅允许本站内导航', language: 'tsx', code: 'import { useState } from "react";\nimport { ActivityIndicator, View } from "react-native";\nimport { WebView } from "react-native-webview";\n\nconst SITE = "https://your-project.workers.dev"; // 替换为部署后得到的 Cloudflare 地址\nexport function LearningWebView() {\n  const [loading, setLoading] = useState(true);\n  return <View style={{ flex: 1 }}>\n    {loading && <ActivityIndicator />}\n    <WebView\n      source={{ uri: SITE }}\n      onLoadEnd={() => setLoading(false)}\n      onShouldStartLoadWithRequest={(request) => {\n        try { return new URL(request.url).origin === SITE; } catch { return false; }\n      }}\n      javaScriptEnabled\n      domStorageEnabled\n    />\n  </View>;\n}', explanation: 'Expo/React Native 组件片段，依赖 react、react-native、react-native-webview；将 SITE 替换为实际站点域名。此示例仅允许同源导航，外链应另行通过 Linking 安全打开并测试平台差异。' }], ['WebView 的网页 localStorage 属于该站点的 Web 存储，不等同于 AsyncStorage。']),
        ] }),
        core({ id: 'rn-web-bridge', title: 'Web 与原生消息、存储及发布', summary: '理解 WebView 消息桥、端侧进度持久化和应用打包所需的边界。', level: '进阶', estimatedMinutes: 130, lessons: [
          lesson('rn-webview-bridge', '为消息桥定义有限协议', '网页可通过 postMessage 向原生发送消息，原生通过 injectJavaScript 回传。消息必须先解析、校验 type 和 payload，再执行明确允许的动作；不要把任意字符串当作命令执行。', [
            { heading: '优先让进度留在网页', body: '本项目进度保存在浏览器 localStorage。WebView 重新加载同一来源时可继续使用网页存储；若要原生备份或通知，先设计版本化协议和失败回退。' },
          ], [{ title: '片段：验证一条 WebView 消息', language: 'tsx', code: 'import type { WebViewMessageEvent } from "react-native-webview";\n\ntype WebMessage = { type: "OPEN_LESSON"; lessonId: string };\nfunction onMessage(event: WebViewMessageEvent) {\n  let value: unknown;\n  try { value = JSON.parse(event.nativeEvent.data); } catch { return; }\n  if (typeof value !== "object" || value === null || !("type" in value) || !("lessonId" in value)) return;\n  const message = value as WebMessage;\n  if (message.type === "OPEN_LESSON" && /^[a-z0-9-]+$/.test(message.lessonId)) {\n    console.log("打开课程", message.lessonId);\n  }\n}', explanation: 'React Native + react-native-webview 片段。示例只接受固定消息类型和安全 ID；真实实现应校验完整 schema、来源/调用场景并避免日志泄露。' }], ['消息协议要版本化并限制可调用能力。', '打包与签名按平台分别处理；不上架仍需签名才能安装到设备。']),
        ] }),
        ecosystem({ id: 'rn-ecosystem', title: 'React Native 导航与动画库速览', summary: '快速认识 Expo Router、React Navigation、Gesture Handler 和 Reanimated。', level: '拓展', estimatedMinutes: 45, lessons: [
          lesson('rn-library-tour', 'RN 生态库各自处理哪类问题', 'Expo Router 组织页面路由；React Navigation 管屏幕导航；Gesture Handler 处理复杂手势；Reanimated 让动画在 UI 线程更顺畅。先掌握平台基本组件，再按需求添加库。', [
            { heading: '检查 SDK 兼容性', body: '原生依赖需要匹配 React Native 与 Expo SDK。安装时使用 expo install 或官方兼容表，并在 iOS 与 Android 都构建一次。' },
          ], [{ title: '片段：Reanimated 弹性按压反馈', language: 'tsx', code: 'import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";\nimport { Pressable, Text } from "react-native";\n\nexport function AnimatedButton() {\n  const scale = useSharedValue(1);\n  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));\n  return <Pressable onPressIn={() => { scale.value = withSpring(0.96); }} onPressOut={() => { scale.value = withSpring(1); }}>\n    <Animated.View style={style}><Text>继续学习</Text></Animated.View>\n  </Pressable>;\n}', explanation: 'Expo + react-native-reanimated 组件片段。先按 Expo SDK 版本安装兼容依赖并按官方要求配置插件；动画应尊重减少动态效果偏好。' }], ['动画增强交互反馈，但不应妨碍减少动态效果的用户。']),
        ] }),
      ] }],
    },
    {
      id: 'engineering',
      title: '测试、交付与综合项目',
      summary: '把前面学到的技术连起来，建立能验证、部署和说明项目的习惯。',
      outcomes: ['写关键路径测试', '理解环境配置与安全', '交付可运行的完整作品'],
      stacks: [{ id: 'engineering-stack', name: '工程实践', description: '跨端应用共同需要的交付能力', nodes: [
        core({ id: 'testing', title: '单元、集成与端到端测试', summary: '按用户风险选择测试层次，检查代码行为而非实现细节。', level: '进阶', estimatedMinutes: 180, lessons: [
          lesson('testing-pyramid', '为行为选择合适的测试', '单元测试快，适合纯逻辑；集成测试检查模块协作；端到端测试从用户界面走一遍关键流程。三者不是互相替代关系。', [
            { heading: '测试可观察行为', body: '用户更关心点“完成课程”后状态是否改变，而不关心组件内部用了几个 hook。测试边界越接近用户，信心通常越强，但维护成本也越高。' },
          ], [{ title: 'Vitest 单元测试示例', language: 'ts', code: 'import { describe, expect, it } from "vitest";\n\nfunction completionRate(done: number, total: number) {\n  return total === 0 ? 0 : Math.round((done / total) * 100);\n}\n\ndescribe("completionRate", () => {\n  it("空路线显示 0%", () => {\n    expect(completionRate(0, 0)).toBe(0);\n  });\n\n  it("把完成比例四舍五入", () => {\n    expect(completionRate(1, 3)).toBe(33);\n  });\n});', explanation: '覆盖正常和边界情况。纯函数便于快速测试；浏览器 E2E 还需验证点击和本地保存流程。' }], ['测试应让错误发生时能快速指出原因。']),
          lesson('e2e-testing', '端到端测试用户学习流程', 'E2E 测试像机器人用户一样操作真实页面。它适合验证核心链路，例如打开课程、标记完成、刷新并确认进度仍在。', [
            { heading: '减少脆弱选择器', body: '优先通过可访问名称、角色和可见文本定位元素，而不是依赖深层 CSS class。测试数据要可重复，避免使用真实用户账户。' },
          ], [{ title: 'Playwright 流程示例', language: 'ts', code: 'test("完成课程后刷新仍保留进度", async ({ page }) => {\n  await page.goto("/");\n  await page.getByRole("button", { name: "开启我的学习之旅" }).click();\n  await page.getByRole("button", { name: /完成本节学习/ }).click();\n  await page.reload();\n  await expect(page.getByText("已完成")).toBeVisible();\n});', explanation: '测试围绕学习者能观察到的结果，而不是 localStorage 的内部实现。' }], ['隔离或清理测试存储，避免用例互相影响。']),
        ] }),
        ecosystem({ id: 'testing-tools', title: '测试与代码质量工具速览', summary: '认识 Vitest/Jest、Testing Library、Playwright 和 ESLint 的职责。', level: '拓展', estimatedMinutes: 45, lessons: [
          lesson('quality-libraries', '测试库和静态检查各做什么', 'Vitest/Jest 跑单元测试；Testing Library 从用户交互角度测试组件；Playwright 控制真实浏览器；ESLint 静态检查常见错误和约定。', [
            { heading: '不要用工具名替代质量标准', body: '选择工具后仍需要定义要保护的流程、边界情况和失败时如何定位。最贵的测试不是最全面的测试，而是无人能维护的测试。' },
          ], [{ title: '利用语义角色定位按钮', language: 'ts', code: 'const saveButton = screen.getByRole("button", { name: "保存计划" });\nawait user.click(saveButton);\nexpect(screen.getByText("已保存")).toBeVisible();', explanation: '基于用户可见名称查找，能同时提醒开发者按钮是否有清楚的可访问标签。' }], ['Testing Library 关注用户能怎样操作界面。']),
        ] }),
        core({ id: 'security-delivery', title: '配置、安全与最终交付', summary: '保护密钥、校验输入并把项目打包部署。', level: '进阶', estimatedMinutes: 130, lessons: [
          lesson('secure-config', '把密钥留在服务器环境', '密钥一旦进入前端 bundle，就对任何打开网页的人可见。前端只能放公开配置；私人令牌、数据库密码必须放在服务端机密环境。', [
            { heading: '最小权限和输入边界', body: '只给服务需要的权限；用户输入在使用前验证；日志不要写入密码、令牌或私人资料。把这些习惯放进开发流程，比上线前补一张“安全清单”更可靠。' },
          ], [{ title: '不把私密变量前缀为公开变量', language: 'ts', code: '// 私有服务端变量（不要暴露到浏览器）\nconst secret = process.env.API_SECRET;\n\n// Vite 的 VITE_ 前缀变量会进入客户端构建，必须视为公开\nconst publicSiteName = import.meta.env.VITE_SITE_NAME;', explanation: '不同构建工具的公开前缀规则不同；任何进入浏览器的值都可被用户检查。' }], ['永远不要提交真实密钥。']),
        ] }),
      ] }],
    },
  ],
};

