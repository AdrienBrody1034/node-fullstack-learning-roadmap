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
            { heading: '严格模式帮助早发现空值', body: 'strictNullChecks 让可能缺失的值显式出现。模块应通过 export/import 维护边界，类型专用导入可帮助明确它不会成为运行时代码。' }