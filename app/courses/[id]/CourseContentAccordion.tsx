'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Clock, Video, FileText, ChevronRight } from 'lucide-react'

export type LessonGroup = {
  chapterName: string
  lessons: {
    id: string
    title: string
    video_url: string | null
    pdf_url: string | null
    duration_minutes: number
    globalIndex: number
  }[]
}

interface Props {
  groups: LessonGroup[]
  activeLessonId?: string
  isEnrolled: boolean
  courseId: string
  initialOpenIndex: number
}

const selectCls =
  'w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all'
const labelCls = 'text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5'

/** Parse multi-line pdf_url field into array of {label, url} */
function parsePdfUrls(raw: string | null): { label: string; url: string }[] {
  if (!raw) return []
  return raw.split('\n').map(s => s.trim()).filter(Boolean).map((line, i) => {
    const sep = line.indexOf('|')
    if (sep > 0) {
      return { label: line.slice(0, sep).trim(), url: line.slice(sep + 1).trim() }
    }
    // fallback: no label, use default
    const labels = ['Bài học', 'Viết tay', 'Lời giải', 'Tài liệu']
    return { label: labels[i] ?? `PDF ${i + 1}`, url: line }
  }).filter(p => p.url)
}

export default function CourseContentAccordion({
  groups,
  activeLessonId,
  isEnrolled,
  courseId,
  initialOpenIndex,
}: Props) {
  const router = useRouter()

  const [selectedChapterIdx, setSelectedChapterIdx] = useState<number>(
    initialOpenIndex >= 0 ? initialOpenIndex : -1
  )

  // Find current lesson's chapter on mount
  const [selectedLessonId, setSelectedLessonId] = useState<string>(activeLessonId ?? '')

  const currentGroup = selectedChapterIdx >= 0 ? groups[selectedChapterIdx] : null
  const lessons = currentGroup?.lessons ?? []

  const handleChapterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const idx = Number(e.target.value)
    setSelectedChapterIdx(idx)
    setSelectedLessonId('')
  }

  const handleLessonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lessonId = e.target.value
    setSelectedLessonId(lessonId)
    if (lessonId && isEnrolled) {
      router.push(`/courses/${courseId}?lesson=${lessonId}`)
    }
  }

  const activeLesson = lessons.find(l => l.id === selectedLessonId)

  return (
    <div className="flex flex-col gap-4">
      {/* Chapter dropdown */}
      <div>
        <p className={labelCls}>
          <span className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[9px] font-black shrink-0">①</span>
          Chương
        </p>
        <div className="relative">
          <select
            value={selectedChapterIdx}
            onChange={handleChapterChange}
            className={selectCls}
          >
            <option value={-1}>— Tất cả chương —</option>
            {groups.map((g, i) => (
              <option key={i} value={i}>{g.chapterName}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Lesson dropdown */}
      <div>
        <p className={labelCls}>
          <span className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[9px] font-black shrink-0">②</span>
          Bài học
        </p>
        <div className="relative">
          <select
            value={selectedLessonId}
            onChange={handleLessonChange}
            disabled={!currentGroup}
            className={`${selectCls} disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            <option value="">— Tất cả bài —</option>
            {lessons.map(l => (
              <option key={l.id} value={l.id}>
                {String(l.globalIndex + 1).padStart(2, '0')}. {l.title}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Selected lesson preview */}
      {activeLesson && (
        <div className={`p-3 rounded-xl border transition-all ${
          activeLesson.id === activeLessonId
            ? 'bg-primary/10 border-primary/20'
            : 'bg-slate-800/50 border-slate-700'
        }`}>
          {/* Multiple PDF links */}
          {parsePdfUrls(activeLesson.pdf_url).length > 0 && (
            <div className="mt-1.5 flex flex-col gap-1">
              {parsePdfUrls(activeLesson.pdf_url).map((pdf, i) => (
                <a
                  key={i}
                  href={pdf.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-[10px] text-red-400 hover:text-red-300 font-bold underline-offset-2 hover:underline transition-colors"
                >
                  <FileText size={10} />
                  {pdf.label}
                </a>
              ))}
            </div>
          )}
          {isEnrolled && activeLesson.id !== activeLessonId && (
            <button
              onClick={() => router.push(`/courses/${courseId}?lesson=${activeLesson.id}`)}
              className="mt-2 w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-primary text-white text-[11px] font-bold hover:bg-primary/90 transition-colors"
            >
              Học bài này <ChevronRight size={12} />
            </button>
          )}
          {!isEnrolled && (
            <p className="mt-2 text-[10px] text-gray-500 font-medium">
              Đăng ký khóa học để học bài này
            </p>
          )}
        </div>
      )}

      {/* Chapter summary when no lesson selected */}
      {currentGroup && !activeLesson && (
        <div className="flex flex-col gap-1 max-h-52 overflow-y-auto custom-scrollbar">
          {currentGroup.lessons.map(lesson => (
            <div
              key={lesson.id}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors cursor-pointer group ${
                lesson.id === activeLessonId
                  ? 'bg-primary/10 text-primary'
                  : 'hover:bg-slate-800/50 text-gray-400 hover:text-gray-200'
              }`}
              onClick={() => {
                setSelectedLessonId(lesson.id)
                if (isEnrolled) router.push(`/courses/${courseId}?lesson=${lesson.id}`)
              }}
            >
              <span className="text-[10px] font-black w-5 shrink-0">
                {String(lesson.globalIndex + 1).padStart(2, '0')}
              </span>
              <span className="text-[12px] font-medium line-clamp-1 flex-1">{lesson.title}</span>
              <div className="flex items-center gap-1.5 shrink-0" onClick={e => e.stopPropagation()}>
                {lesson.video_url && (
                  <a href={lesson.video_url} target="_blank" rel="noreferrer" title="Xem video"
                     className="hover:opacity-70 transition-opacity">
                    <Video size={11} className="text-blue-400" />
                  </a>
                )}
                {parsePdfUrls(lesson.pdf_url).length > 0 && (
                  <span className="flex items-center gap-0.5 text-red-400" title={`${parsePdfUrls(lesson.pdf_url).length} file PDF`}>
                    <FileText size={11} />
                    {parsePdfUrls(lesson.pdf_url).length > 1 && (
                      <span className="text-[9px] font-black">{parsePdfUrls(lesson.pdf_url).length}</span>
                    )}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
