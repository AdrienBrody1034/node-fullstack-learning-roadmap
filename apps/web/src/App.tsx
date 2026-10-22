import { useEffect, useMemo, useState } from 'react';
import { curriculum } from '@content/curriculum';
import type { LearningNode, Lesson } from './types/curriculum';

type Pace = 'slow' | 'medium' | 'fast';
type View = 'overview' | 'roadmap' | 'library';
type SavedState = { pace: Pace; started: boolean; completed: string[]; activeLessonId?: string };
const STORAGE_KEY = 'fullstack-roadmap-v1';
const paceLabels: Record<Pace, string> = { slow: '慢速', medium: '中速', fast: '快速' };
const paceCopy: Record<Pace, string> = { slow: '每天 30 分钟 × 每周 5 天 · 共约 2 小时 30 分', medium: '每天 60 分钟 × 每周 6 天 · 共约 6 小时', fast: '每天 120 分钟 × 每周 5 天 · 共约 10 小时' };

function readSaved(): SavedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw) as Partial<SavedState>;
      return { pace: data.pace === 'slow' || data.pace === 'fast' ? data.pace : 'medium', started: Boolean(data.started), completed: Array.isArray(data.completed) ? data.completed : [], activeLessonId: data.activeLessonId };
    }
  } catch { /* Ignore invalid local state and start cleanly. */ }
  return { pace: 'medium', started: false, completed: [] };
}

function Icon({ name, size = 18 }: { name: string; size?: number }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true as const };
  const paths: Record<string, React.ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
    map: <><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3z"/><path d="M9 3v15m6-12v15"/></>,
    book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 0 4 22z"/><path d="M4 5.5v14A2.5 2.5 0 0 1 6.5 17H20"/></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.5 4.5"/></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></>,
    close: <><path d="m6 6 12 12M18 6 6 18"/></>,
  };
  return <svg {...common}>{paths[name] || paths.grid}</svg>;
}

function App() {
  const [saved, setSaved] = useState<SavedState>(readSaved);
  const [view, setView] = useState<View>('overview');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'core' | 'ecosystem'>('all');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [selectedNode, setSelectedNode] = useState<LearningNode | null>(null);
  const [mobileNav, setMobileNav] = useState(false);

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(saved)); }, [saved]);

  const lessons = useMemo(() => curriculum.phases.flatMap(phase => phase.stacks.flatMap(stack => stack.nodes.flatMap(node => node.lessons.map(lesson => ({ lesson, node, stack, phase }))))), []);
  const totalLessons = lessons.length;
  const completedCount = lessons.filter(item => saved.completed.includes(item.lesson.id)).length;
  const percent = totalLessons ? Math.round(completedCount / totalLessons * 100) : 0;
  const current = lessons.find(item => item.lesson.id === saved.activeLessonId) || lessons.find(item => !saved.completed.includes(item.lesson.id)) || lessons[0];
  const filteredLessons = lessons.filter(item => {
    const matches = `${item.lesson.title} ${item.lesson.intro} ${item.node.title} ${item.stack.name}`.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || (filter === 'core' ? item.node.depth !== 'ecosystem' : item.node.depth === 'ecosystem');
    return matches && matchesFilter;
  });

  function update(patch: Partial<SavedState>) { setSaved(previous => ({ ...previous, ...patch })); }
  function begin() {
    update({ started: true, activeLessonId: current?.lesson.id });
    if (current) { setSelectedLesson(current.lesson); setSelectedNode(current.node); }
    setView('roadmap');
  }
  function openLesson(lesson: Lesson, node: LearningNode) {
    update({ activeLessonId: lesson.id });
    setSelectedLesson(lesson); setSelectedNode(node); setView('roadmap');
  }
  function toggleComplete(lesson: Lesson) {
    const next = saved.completed.includes(lesson.id) ? saved.completed.filter(id => id !== lesson.id) : [...saved.completed, lesson.id];
    update({ completed: next });
  }

  return <div className="app-shell">
    <aside className={`sidebar ${mobileNav ? 'sidebar-open' : ''}`}>
      <div className="brand"><span className="brand-mark"><span /></span><span>研习社<span className="brand-dot">.</span></span></div>
      <div className="workspace-label">你的学习空间</div>
      <nav className="primary-nav" aria-label="主导航">
        {[['overview', 'grid', '总览'], ['roadmap', 'map', '学习路线'], ['library', 'book', '知识库']].map(([id, icon, label]) => <button key={id} className={`nav-item ${view === id ? 'nav-active' : ''}`} onClick={() => { setView(id as View); setSelectedLesson(null); setMobileNav(false); }}><Icon name={icon}/><span>{label}</span>{id === 'roadmap' && <span className="nav-count">{curriculum.phases.length}</span>}</button>)}
      </nav>
      <div className="sidebar-progress">
        <div className="progress-heading"><span>整体进度</span><span>{percent}%</span></div>
        <div className="progress-track"><span style={{ width: `${percent}%` }}/></div>
        <p>{completedCount} / {totalLessons} 个知识点已完成</p>
      </div>
      <div className="sidebar-bottom">
        <div className="pace-card pace-card-selector"><div className="pace-card-heading"><div className="pace-icon"><Icon name="sun" size={16}/></div><div><span className="pace-caption">学习节奏</span><strong>{paceLabels[saved.pace]} · {saved.pace === 'slow' ? '每周 5 天，约 2 小时 30 分' : saved.pace === 'medium' ? '每周 6 天，约 6 小时' : '每周 5 天，约 10 小时'}</strong></div></div><div className="pace-sidebar-options">{(['slow', 'medium', 'fast'] as Pace[]).map(pace => <button key={pace} aria-pressed={saved.pace === pace} className={saved.pace === pace ? 'pace-sidebar-selected' : ''} title={paceCopy[pace]} onClick={() => update({ pace })}>{paceLabels[pace]}</button>)}</div></div>
        <div className="local-note"><span className="status-dot"/>进度仅保存在此设备</div>
      </div>
    </aside>
    <main className="main-area">
      <header className="topbar"><button className="mobile-menu icon-button" aria-label="打开导航" onClick={() => setMobileNav(!mobileNav)}><span className="hamburger">☰</span></button><div className="breadcrumb">全栈学习 <span>/</span> <strong>{view === 'overview' ? '学习总览' : view === 'roadmap' ? '学习路线' : '知识库'}</strong></div><div className="topbar-actions"><div className="local-status"><span className="status-dot"/>本地保存</div><button className="avatar" aria-label="学习设置" onClick={() => document.getElementById('pace-control')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}>学</button></div></header>
      <div className="page-content">
        {view === 'overview' && <>
          {!saved.started && <section className="welcome-banner"><div className="welcome-text"><div className="eyebrow"><span className="eyebrow-line"/>从这里开始</div><h1>成为全栈开发者，<br/><em>一步一步来。</em></h1><p>一张清晰的路线图，带你从基础到实战。选择适合自己的节奏，每一点进步都算数。</p><button className="button-primary" onClick={begin}>开启我的学习之旅 <Icon name="arrow" size={16}/></button></div><div className="welcome-art"><div className="art-orbit orbit-one"/><div className="art-orbit orbit-two"/><div className="art-core"><span>JS</span><small>FULL STACK</small></div><span className="float-tag tag-react">⚛ React</span><span className="float-tag tag-node">⬡ Node.js</span><span className="float-tag tag-ts">TS</span><span className="spark spark-a">✳</span><span className="spark spark-b">✦</span></div></section>}
          {saved.started && <section className="greeting-row"><div><div className="eyebrow"><span className="eyebrow-line"/>持续前进</div><h1>欢迎回来<span className="greeting-period">.</span></h1><p>每次写下一行代码，都是在靠近目标。</p></div><button className="button-primary compact" onClick={() => begin()}>继续学习 <Icon name="arrow" size={16}/></button></section>}
          <section className="stats-grid"><Stat label="学习进度" value={`${percent}%`} detail={`${completedCount} 个知识点完成`} icon="↗"/><Stat label="学习阶段" value={`${curriculum.phases.length}`} detail="循序渐进的成长路径" icon="◉"/><Stat label="每日建议" value={saved.pace === 'slow' ? '30' : saved.pace === 'fast' ? '120' : '60'} detail="分钟，按自己的节奏" icon="◷"/></section>
          <div className="section-heading"><div><div className="eyebrow">YOUR NEXT STEP</div><h2>接下来学什么</h2></div><button className="link-button" onClick={() => setView('roadmap')}>查看完整路线 <Icon name="arrow" size={15}/></button></div>
          {current ? <section className="next-card"><div className="next-icon"><Icon name="book" size={21}/></div><div className="next-copy"><div className="next-meta"><span className="pill pill-teal">{current.phase.title}</span><span className="tiny-dot"/>{current.stack.name}</div><h3>{current.lesson.title}</h3><p>{current.lesson.intro}</p><div className="next-footer"><span><Icon name="clock" size={14}/>{current.node.estimatedMinutes || 15} 分钟</span><span>{current.node.depth === 'ecosystem' ? '生态拓展' : '核心知识'}</span></div></div><button className="circle-arrow" aria-label="开始学习" onClick={() => openLesson(current.lesson, current.node)}><Icon name="arrow"/></button></section> : <div className="empty-card">课程内容正在准备中，稍后即可开始学习。</div>}
          <section className="phase-section"><div className="section-heading compact-heading"><div><div className="eyebrow">THE ROADMAP</div><h2>你的学习路线</h2></div><button className="link-button" onClick={() => setView('roadmap')}>全部阶段 <Icon name="arrow" size={15}/></button></div><div className="phase-list">{curriculum.phases.slice(0, 4).map((phase, index) => <button className="phase-row" key={phase.id} onClick={() => setView('roadmap')}><span className={`phase-index ${index === 0 ? 'phase-index-current' : ''}`}>{String(index + 1).padStart(2, '0')}</span><span className="phase-row-copy"><strong>{phase.title}</strong><small>{phase.summary}</small></span><span className="phase-row-count">{phase.stacks.reduce((sum, stack) => sum + stack.nodes.length, 0)} 个知识点</span><Icon name="arrow" size={16}/></button>)}</div></section>
          <section id="pace-control" className="pace-settings"><div><div className="eyebrow">MAKE IT YOURS</div><h2>找到适合你的节奏</h2><p>节奏建议可随时调整，不会影响已完成的进度。</p></div><div className="pace-options">{(['slow', 'medium', 'fast'] as Pace[]).map(pace => <button key={pace} className={`pace-option ${saved.pace === pace ? 'pace-selected' : ''}`} aria-pressed={saved.pace === pace} onClick={() => update({ pace })}><strong>{paceLabels[pace]}</strong><span>{paceCopy[pace]}</span>{saved.pace === pace && <span className="selected-check"><Icon name="check" size={12}/></span>}</button>)}</div></section>
        </>}
        {view === 'roadmap' && <Roadmap curriculum={curriculum} completed={saved.completed} onOpen={openLesson} />}
        {view === 'library' && <section className="library-page"><div className="eyebrow"><span className="eyebrow-line"/>REFERENCE LIBRARY</div><h1>知识库<span className="greeting-period">.</span></h1><p className="page-intro">在路线中遇到的每个概念，都可以在这里找到。</p><div className="search-row"><div className="search-box"><Icon name="search"/><input value={search} onChange={event => setSearch(event.target.value)} placeholder="搜索技术、概念或课程..." /></div><div className="filter-pills">{[['all', '全部'], ['core', '核心技术'], ['ecosystem', '生态库']].map(([id, label]) => <button className={filter === id ? 'filter-active' : ''} key={id} onClick={() => setFilter(id as typeof filter)}>{label}</button>)}</div></div><div className="result-count">找到 {filteredLessons.length} 个学习内容</div><div className="library-list">{filteredLessons.map(({ lesson, node, stack, phase }) => <button className="library-item" key={lesson.id} onClick={() => openLesson(lesson, node)}><span className="library-item-icon"><Icon name="book" size={17}/></span><span className="library-item-main"><small>{phase.title} <span>/</span> {stack.name}</small><strong>{lesson.title}</strong><span>{lesson.intro}</span></span><span className="library-type">{node.depth === 'ecosystem' ? '生态拓展' : '核心技术'}</span><Icon name="arrow" size={16}/></button>)}</div>{filteredLessons.length === 0 && <div className="empty-card">没有找到相关内容，试试其他关键词。</div>}</section>}
      </div>
      <footer className="footer"><span>为每一个认真学习的人而做 <span className="footer-heart">✳</span></span><span>你的进度保存在本地设备</span></footer>
    </main>
    {mobileNav && <button className="nav-scrim" aria-label="关闭导航" onClick={() => setMobileNav(false)}/>}
    {selectedLesson && selectedNode && <div className="lesson-overlay" role="dialog" aria-modal="true" aria-labelledby="lesson-title"><div className="lesson-drawer"><header className="drawer-header"><button className="back-button" onClick={() => setSelectedLesson(null)}>← <span>返回路线</span></button><button className="icon-button" aria-label="关闭" onClick={() => setSelectedLesson(null)}><Icon name="close"/></button></header><div className="lesson-scroll"><div className="eyebrow"><span className="eyebrow-line"/>学习内容 · {selectedNode.depth === 'ecosystem' ? '生态拓展' : '核心知识'}</div><h1 id="lesson-title">{selectedLesson.title}</h1><p className="lesson-intro">{selectedLesson.intro}</p><div className="lesson-progress-line"><div className="progress-track"><span style={{ width: saved.completed.includes(selectedLesson.id) ? '100%' : '0%' }}/></div><span>{saved.completed.includes(selectedLesson.id) ? '已完成' : '学习中'}</span></div>{selectedLesson.sections.map(section => <section className="lesson-section" key={section.heading}><h2>{section.heading}</h2><p>{section.body}</p></section>)}{selectedLesson.codeExamples.map(example => <section className="lesson-section" key={example.title}><h2>{example.title}</h2>{example.explanation && <p>{example.explanation}</p>}<div className="code-block"><div className="code-toolbar"><span><i/>{example.language}</span><span>示例代码</span></div><pre><code>{example.code}</code></pre></div></section>)}{selectedLesson.keyPoints && <div className="key-points"><h2>记住这几点</h2>{selectedLesson.keyPoints.map(point => <p key={point}><Icon name="check" size={16}/>{point}</p>)}</div>}{selectedLesson.sources?.some(source => isSafeExternalUrl(source.url)) && <section className="lesson-sources"><h2>官方文档与延伸阅读</h2>{selectedLesson.sources.filter(source => isSafeExternalUrl(source.url)).map(source => <a key={`${source.label}-${source.url}`} href={source.url} target="_blank" rel="noopener noreferrer">{source.label}<span>↗</span></a>)}</section>}<button className={`button-primary complete-button ${saved.completed.includes(selectedLe