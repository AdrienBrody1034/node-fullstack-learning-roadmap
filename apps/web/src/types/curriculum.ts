export type LessonDepth = 'core' | 'ecosystem';

export interface CodeExample {
  title: string;
  language: string;
  code: string;
  explanation?: string;
}

export interface LessonSection {
  heading: string;
  body: string;
}

export interface Lesson {
  id: string;
  title: string;
  intro: string;
  sections: LessonSection[];
  codeExamples: CodeExample[];
  keyPoints?: string[];
  sources?: { label: string; url: string }[];
}

export interface LearningNode {
  id: string;
  title: string;
  summary: string;
  depth?: LessonDepth;
  prerequisites?: string[];
  level?: string;
  estimatedMinutes?: number;
  lessons: Lesson[];
}

export interface LearningStack {
  id: string;
  name: string;
  description: string;
  nodes: LearningNode[];
}

export interface LearningPhase {
  id: string;
  title: string;
  summary: string;
  outcomes: string[];
  stacks: LearningStack[];
}

export interface Curriculum {
  title: string;
  subtitle: string;
  phases: LearningPhase[];
}
