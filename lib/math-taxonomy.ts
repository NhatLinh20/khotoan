// Hệ thống phân loại toán 10-11-12 theo ID 6 tham số
// grade: 0=Lớp10, 1=Lớp11, 2=Lớp12
// subject: D=Đại số/XS/TK, H=Hình học, C=Chuyên đề

import { D10 } from './taxonomy/d10'
import { H10, C10 } from './taxonomy/h10_c10'
import { D11 } from './taxonomy/d11'
import { H11, C11 } from './taxonomy/h11_c11'
import { D12, H12, C12 } from './taxonomy/d12_h12'
import { D6, H6, D7, H7, D8, H8, D9, H9 } from './taxonomy/midschool'

export interface FormItem { value: number; label: string }
export interface LessonItem { value: number; label: string; forms: FormItem[] }
export interface ChapterItem { value: number; label: string; lessons: LessonItem[]; subject?: string }
export interface SubjectGroup { grade: string; subject: string; chapters: ChapterItem[] }

function combineAll(d: ChapterItem[], h: ChapterItem[], c: ChapterItem[]): ChapterItem[] {
  const combined = [
    ...d.map(ch => ({ ...ch, subject: 'D' })),
    ...h.map(ch => ({ ...ch, subject: 'H' })),
    ...c.map(ch => ({ ...ch, subject: 'C', value: ch.value + 50 }))
  ]
  return combined.sort((a, b) => a.value - b.value)
}

export const MATH_TAXONOMY: SubjectGroup[] = [
  { grade: '6', subject: 'D', chapters: D6 },
  { grade: '6', subject: 'H', chapters: H6 },
  { grade: '6', subject: 'C', chapters: [] },
  { grade: '6', subject: 'ALL', chapters: combineAll(D6, H6, []) },
  { grade: '7', subject: 'D', chapters: D7 },
  { grade: '7', subject: 'H', chapters: H7 },
  { grade: '7', subject: 'C', chapters: [] },
  { grade: '7', subject: 'ALL', chapters: combineAll(D7, H7, []) },
  { grade: '8', subject: 'D', chapters: D8 },
  { grade: '8', subject: 'H', chapters: H8 },
  { grade: '8', subject: 'C', chapters: [] },
  { grade: '8', subject: 'ALL', chapters: combineAll(D8, H8, []) },
  { grade: '9', subject: 'D', chapters: D9 },
  { grade: '9', subject: 'H', chapters: H9 },
  { grade: '9', subject: 'C', chapters: [] },
  { grade: '9', subject: 'ALL', chapters: combineAll(D9, H9, []) },
  { grade: '0', subject: 'D', chapters: D10 },
  { grade: '0', subject: 'H', chapters: H10 },
  { grade: '0', subject: 'C', chapters: C10 },
  { grade: '0', subject: 'ALL', chapters: combineAll(D10, H10, C10) },
  { grade: '1', subject: 'D', chapters: D11 },
  { grade: '1', subject: 'H', chapters: H11 },
  { grade: '1', subject: 'C', chapters: C11 },
  { grade: '1', subject: 'ALL', chapters: combineAll(D11, H11, C11) },
  { grade: '2', subject: 'D', chapters: D12 },
  { grade: '2', subject: 'H', chapters: H12 },
  { grade: '2', subject: 'C', chapters: C12 },
  { grade: '2', subject: 'ALL', chapters: combineAll(D12, H12, C12) },
]

export function getChapters(grade: string, subject?: string): ChapterItem[] {
  const targetSubject = subject || 'ALL'
  return MATH_TAXONOMY.find((g) => g.grade === grade && g.subject === targetSubject)?.chapters ?? []
}

export function getLessons(grade: string, subject: string | undefined, chapter: number): LessonItem[] {
  return getChapters(grade, subject).find((c) => c.value === chapter)?.lessons ?? []
}

export function getForms(grade: string, subject: string | undefined, chapter: number, lesson: number): FormItem[] {
  const fallback = [{ value: 1, label: 'Dạng 1' }]
  return getLessons(grade, subject, chapter).find((l) => l.value === lesson)?.forms ?? fallback
}
