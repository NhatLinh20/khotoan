// Hệ thống phân loại toán 10-11-12 theo ID 6 tham số
// grade: 0=Lớp10, 1=Lớp11, 2=Lớp12
// subject: D=Đại số/XS/TK, H=Hình học, C=Chuyên đề

import { D10 } from './taxonomy/d10'
import { H10, C10 } from './taxonomy/h10_c10'
import { D11 } from './taxonomy/d11'
import { H11, C11 } from './taxonomy/h11_c11'
import { D12, H12 } from './taxonomy/d12_h12'

export interface FormItem { value: number; label: string }
export interface LessonItem { value: number; label: string; forms: FormItem[] }
export interface ChapterItem { value: number; label: string; lessons: LessonItem[] }
export interface SubjectGroup { grade: '0'|'1'|'2'; subject: 'D'|'H'|'C'; chapters: ChapterItem[] }

const C12: ChapterItem[] = [
  { value: 1, label: 'Chuyên đề 1', lessons: [
    { value: 1, label: 'Bài 1', forms: [{ value: 1, label: 'Dạng 1' }] },
  ]},
]

export const MATH_TAXONOMY: SubjectGroup[] = [
  { grade: '0', subject: 'D', chapters: D10 },
  { grade: '0', subject: 'H', chapters: H10 },
  { grade: '0', subject: 'C', chapters: C10 },
  { grade: '1', subject: 'D', chapters: D11 },
  { grade: '1', subject: 'H', chapters: H11 },
  { grade: '1', subject: 'C', chapters: C11 },
  { grade: '2', subject: 'D', chapters: D12 },
  { grade: '2', subject: 'H', chapters: H12 },
  { grade: '2', subject: 'C', chapters: C12 },
]

export function getChapters(grade: string, subject: string): ChapterItem[] {
  return MATH_TAXONOMY.find((g) => g.grade === grade && g.subject === subject)?.chapters ?? []
}

export function getLessons(grade: string, subject: string, chapter: number): LessonItem[] {
  return getChapters(grade, subject).find((c) => c.value === chapter)?.lessons ?? []
}

export function getForms(grade: string, subject: string, chapter: number, lesson: number): FormItem[] {
  const fallback = [{ value: 1, label: 'Dạng 1' }]
  return getLessons(grade, subject, chapter).find((l) => l.value === lesson)?.forms ?? fallback
}
