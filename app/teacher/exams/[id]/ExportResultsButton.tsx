'use client'

import { Download } from 'lucide-react'

export default function ExportResultsButton({ results, totalScore }: { results: any[], totalScore: number }) {
  const handleExport = () => {
    // Generate CSV
    const headers = ['Hạng', 'Họ tên', 'Email', 'Điểm', 'Điểm tối đa', 'Tỉ lệ (%)', 'Thời gian (giây)', 'Ngày nộp']
    
    const rows = results.map((r, i) => {
      const profile = r.profiles
      const pct = totalScore > 0 ? Math.round((r.score / totalScore) * 100) : 0
      const submittedAt = r.created_at
        ? new Date(r.created_at).toLocaleString('vi-VN')
        : ''
        
      return [
        i + 1,
        `"${profile?.full_name || 'Không có tên'}"`,
        `"${profile?.email || ''}"`,
        (r.score ?? 0).toFixed(2),
        totalScore.toFixed(2),
        pct,
        r.time_spent_seconds ?? 0,
        `"${submittedAt}"`
      ].join(',')
    })
    
    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n')
    
    // Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `ket_qua_thi_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <button
      onClick={handleExport}
      className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500 text-surface rounded-md text-xs font-bold hover:bg-emerald-600 transition-all"
    >
      <Download size={13} /> Xuất bảng điểm
    </button>
  )
}
