'use client'

import { useState, useTransition } from 'react'
import { Check, X, RotateCcw, Users, Clock, UserCheck, Mail, GraduationCap, Calendar, Search, Loader2 } from 'lucide-react'
import { approveStudent, revokeStudent, deleteStudent } from '@/app/actions/auth'

type Student = {
  id: string
  full_name: string | null
  email: string | null
  grade: number | null
  is_approved: boolean
  created_at: string
}

type Tab = 'pending' | 'approved'

interface StudentsClientProps {
  pending: Student[]
  approved: Student[]
}

export default function StudentsClient({ pending, approved }: StudentsClientProps) {
  const [tab, setTab] = useState<Tab>('pending')
  const [search, setSearch] = useState('')
  const [isPending, startTransition] = useTransition()
  const [actionId, setActionId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  function showToast(msg: string, type: 'success' | 'error' = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  async function handleApprove(id: string) {
    setActionId(id)
    startTransition(async () => {
      const res = await approveStudent(id)
      if (res?.error) showToast(res.error, 'error')
      else showToast('Đã duyệt tài khoản thành công!')
      setActionId(null)
    })
  }

  async function handleRevoke(id: string) {
    setActionId(id)
    startTransition(async () => {
      const res = await revokeStudent(id)
      if (res?.error) showToast(res.error, 'error')
      else showToast('Đã thu hồi kích hoạt.')
      setActionId(null)
    })
  }

  async function handleDelete(id: string, name: string | null) {
    if (!confirm(`Bạn có chắc muốn từ chối và xoá tài khoản của "${name || 'học sinh này'}"?`)) return
    setActionId(id)
    startTransition(async () => {
      const res = await deleteStudent(id)
      if (res?.error) showToast(res.error, 'error')
      else showToast('Đã xoá tài khoản.')
      setActionId(null)
    })
  }

  const filterList = (list: Student[]) =>
    list.filter((s) => {
      const q = search.toLowerCase()
      return (
        (s.full_name || '').toLowerCase().includes(q) ||
        (s.email || '').toLowerCase().includes(q) ||
        String(s.grade || '').includes(q)
      )
    })

  const currentList = filterList(tab === 'pending' ? pending : approved)

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  return (
    <div className="space-y-6 relative">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-white font-semibold text-sm animate-in slide-in-from-top-4 duration-300 ${
            toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}
        >
          {toast.type === 'success' ? <Check size={16} /> : <X size={16} />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Quản lý học viên</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {pending.length} chờ duyệt · {approved.length} đã duyệt
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm tên, email, lớp..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-gray-800 dark:text-white"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-gray-100 dark:bg-slate-800 rounded-2xl w-fit">
        <button
          onClick={() => setTab('pending')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
            tab === 'pending'
              ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <Clock size={15} className={tab === 'pending' ? 'text-amber-500' : ''} />
          Chờ duyệt
          {pending.length > 0 && (
            <span className="ml-1 bg-amber-500 text-white text-xs font-black rounded-full w-5 h-5 flex items-center justify-center">
              {pending.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab('approved')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
            tab === 'approved'
              ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <UserCheck size={15} className={tab === 'approved' ? 'text-green-500' : ''} />
          Đã duyệt
          <span className="ml-1 bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-gray-300 text-xs font-black rounded-full w-5 h-5 flex items-center justify-center">
            {approved.length}
          </span>
        </button>
      </div>

      {/* Table */}
      {currentList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Users size={48} strokeWidth={1} className="mb-4 opacity-40" />
          <p className="font-semibold">
            {search ? 'Không tìm thấy kết quả' : tab === 'pending' ? 'Không có tài khoản chờ duyệt' : 'Chưa có học viên nào được duyệt'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-800/60">
                <th className="px-5 py-3.5 text-left font-bold text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider">Học viên</th>
                <th className="px-5 py-3.5 text-left font-bold text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider">Email</th>
                <th className="px-5 py-3.5 text-left font-bold text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider">Lớp</th>
                <th className="px-5 py-3.5 text-left font-bold text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider">
                  {tab === 'pending' ? 'Ngày đăng ký' : 'Ngày duyệt'}
                </th>
                <th className="px-5 py-3.5 text-right font-bold text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
              {currentList.map((student) => {
                const isLoading = actionId === student.id && isPending
                return (
                  <tr key={student.id} className="bg-white dark:bg-slate-900 hover:bg-gray-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-sm flex-shrink-0">
                          {(student.full_name || '?')[0].toUpperCase()}
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-white">{student.full_name || '—'}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                        <Mail size={13} />
                        {student.email || '—'}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {student.grade ? (
                        <div className="flex items-center gap-1.5">
                          <GraduationCap size={13} className="text-gray-400" />
                          <span className="font-semibold text-gray-700 dark:text-gray-300">Lớp {student.grade}</span>
                        </div>
                      ) : '—'}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                        <Calendar size={13} />
                        {formatDate(student.created_at)}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {isLoading ? (
                          <Loader2 size={18} className="animate-spin text-gray-400" />
                        ) : tab === 'pending' ? (
                          <>
                            <button
                              onClick={() => handleApprove(student.id)}
                              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-bold text-xs hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors border border-green-200 dark:border-green-800/40"
                            >
                              <Check size={13} />
                              Duyệt
                            </button>
                            <button
                              onClick={() => handleDelete(student.id, student.full_name)}
                              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 font-bold text-xs hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors border border-red-200 dark:border-red-800/40"
                            >
                              <X size={13} />
                              Từ chối
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleRevoke(student.id)}
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 font-bold text-xs hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors border border-orange-200 dark:border-orange-800/40"
                          >
                            <RotateCcw size={13} />
                            Thu hồi
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
