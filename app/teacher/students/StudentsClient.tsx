'use client'

import { useState, useTransition } from 'react'
import { Check, X, RotateCcw, Users, Clock, UserCheck, Mail, GraduationCap, Calendar, Search, Loader2, Activity, Globe, MonitorSmartphone, AlertTriangle } from 'lucide-react'
import { approveStudent, revokeStudent, deleteStudent } from '@/app/actions/auth'

type Student = {
 id: string
 full_name: string | null
 email: string | null
 grade: number | null
 is_approved: boolean
 created_at: string
}

type LoginLog = {
 id: string
 user_id: string
 ip_address: string | null
 country: string | null
 country_code: string | null
 region: string | null
 city: string | null
 isp: string | null
 user_agent: string | null
 is_suspicious: boolean
 suspicious_reason: string | null
 logged_in_at: string
 profiles?: {
 full_name: string | null
 email: string | null
 }
}

type Tab = 'pending' | 'approved' | 'loginLogs'

interface StudentsClientProps {
 pending: Student[]
 approved: Student[]
 loginLogs: LoginLog[]
}

export default function StudentsClient({ pending, approved, loginLogs }: StudentsClientProps) {
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
 if (!confirm(`Bạn có chắc muốn từ chối và xoá tài khoản của"${name || 'học sinh này'}"?`)) return
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

 const currentLogs = (loginLogs || []).filter((l) => {
 const q = search.toLowerCase()
 const p = Array.isArray(l.profiles) ? l.profiles[0] : l.profiles
 return (
 (p?.full_name || '').toLowerCase().includes(q) ||
 (p?.email || '').toLowerCase().includes(q) ||
 (l.ip_address || '').toLowerCase().includes(q)
 )
 })

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
 className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-md shadow-xl text-surface font-semibold text-sm animate-in slide-in-from-top-4 duration-300 ${
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
 <h1 className="text-2xl font-display font-bold text-primary">Quản lý học viên</h1>
 <p className="text-sm text-secondary mt-1">
 {pending.length} chờ duyệt · {approved.length} đã duyệt
 </p>
 </div>

 {/* Search */}
 <div className="relative w-full sm:w-72">
 <Search className="absolute left-3 top-3 h-4 w-4 text-secondary/80" />
 <input
 type="text"
 placeholder="Tìm tên, email, lớp..."
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 className="w-full pl-10 pr-4 py-2.5 text-sm bg-surface border border-secondary/20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-primary"
 />
 </div>
 </div>

 {/* Tabs */}
 <div className="flex gap-2 p-1 bg-neutral rounded-md w-fit">
 <button
 onClick={() => setTab('pending')}
 className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-bold transition-all ${
 tab === 'pending'
 ? 'bg-surface text-primary shadow-sm'
 : 'text-secondary hover:text-gray-700 :text-secondary/50'
 }`}
 >
 <Clock size={15} className={tab === 'pending' ? 'text-amber-500' : ''} />
 Chờ duyệt
 {pending.length > 0 && (
 <span className="ml-1 bg-amber-500 text-surface text-xs font-display font-bold rounded-full w-5 h-5 flex items-center justify-center">
 {pending.length}
 </span>
 )}
 </button>
 <button
 onClick={() => setTab('approved')}
 className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-bold transition-all ${
 tab === 'approved'
 ? 'bg-surface text-primary shadow-sm'
 : 'text-secondary hover:text-gray-700 :text-secondary/50'
 }`}
 >
 <UserCheck size={15} className={tab === 'approved' ? 'text-green-500' : ''} />
 Đã duyệt
 <span className="ml-1 bg-gray-200 text-gray-700 text-xs font-display font-bold rounded-full w-5 h-5 flex items-center justify-center">
 {approved.length}
 </span>
 </button>
 <button
 onClick={() => setTab('loginLogs')}
 className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-bold transition-all ${
 tab === 'loginLogs'
 ? 'bg-surface text-primary shadow-sm'
 : 'text-secondary hover:text-gray-700 :text-secondary/50'
 }`}
 >
 <Activity size={15} className={tab === 'loginLogs' ? 'text-blue-500' : ''} />
 Lịch sử Đăng nhập
 </button>
 </div>

 {/* Table */}
 {tab !== 'loginLogs' ? (
 currentList.length === 0 ? (
 <div className="flex flex-col items-center justify-center py-20 text-secondary/80">
 <Users size={48} strokeWidth={1} className="mb-4 opacity-40" />
 <p className="font-semibold">
 {search ? 'Không tìm thấy kết quả' : tab === 'pending' ? 'Không có tài khoản chờ duyệt' : 'Chưa có học viên nào được duyệt'}
 </p>
 </div>
 ) : (
 <div className="overflow-x-auto rounded-md border border-secondary/20 shadow-sm">
 <table className="w-full text-sm">
 <thead>
 <tr className="bg-neutral">
 <th className="px-5 py-3.5 text-left font-bold text-secondary text-xs uppercase tracking-wider">Học viên</th>
 <th className="px-5 py-3.5 text-left font-bold text-secondary text-xs uppercase tracking-wider">Email</th>
 <th className="px-5 py-3.5 text-left font-bold text-secondary text-xs uppercase tracking-wider">Lớp</th>
 <th className="px-5 py-3.5 text-left font-bold text-secondary text-xs uppercase tracking-wider">
 {tab === 'pending' ? 'Ngày đăng ký' : 'Ngày duyệt'}
 </th>
 <th className="px-5 py-3.5 text-right font-bold text-secondary text-xs uppercase tracking-wider">Hành động</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-gray-100">
 {currentList.map((student) => {
 const isLoading = actionId === student.id && isPending
 return (
 <tr key={student.id} className="bg-surface hover:bg-neutral/60 :bg-slate-800/40 transition-colors">
 <td className="px-5 py-4">
 <div className="flex items-center gap-3">
 <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-display font-bold text-sm flex-shrink-0">
 {(student.full_name || '?')[0].toUpperCase()}
 </div>
 <span className="font-semibold text-primary">{student.full_name || '—'}</span>
 </div>
 </td>
 <td className="px-5 py-4">
 <div className="flex items-center gap-1.5 text-secondary">
 <Mail size={13} />
 {student.email || '—'}
 </div>
 </td>
 <td className="px-5 py-4">
 {student.grade ? (
 <div className="flex items-center gap-1.5">
 <GraduationCap size={13} className="text-secondary/80" />
 <span className="font-semibold text-gray-700">Lớp {student.grade}</span>
 </div>
 ) : '—'}
 </td>
 <td className="px-5 py-4">
 <div className="flex items-center gap-1.5 text-secondary">
 <Calendar size={13} />
 {formatDate(student.created_at)}
 </div>
 </td>
 <td className="px-5 py-4">
 <div className="flex items-center justify-end gap-2">
 {isLoading ? (
 <Loader2 size={18} className="animate-spin text-secondary/80" />
 ) : tab === 'pending' ? (
 <>
 <button
 onClick={() => handleApprove(student.id)}
 className="flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-green-50 text-green-700 font-bold text-xs hover:bg-green-100 :bg-green-900/40 transition-colors border border-green-200"
 >
 <Check size={13} />
 Duyệt
 </button>
 <button
 onClick={() => handleDelete(student.id, student.full_name)}
 className="flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-red-50 text-red-700 font-bold text-xs hover:bg-red-100 :bg-red-900/40 transition-colors border border-red-200"
 >
 <X size={13} />
 Từ chối
 </button>
 </>
 ) : (
 <button
 onClick={() => handleRevoke(student.id)}
 className="flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-orange-50 text-orange-700 font-bold text-xs hover:bg-orange-100 :bg-orange-900/40 transition-colors border border-orange-200"
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
 )
 ) : (
 currentLogs.length === 0 ? (
 <div className="flex flex-col items-center justify-center py-20 text-secondary/80">
 <Activity size={48} strokeWidth={1} className="mb-4 opacity-40" />
 <p className="font-semibold">
 {search ? 'Không tìm thấy lịch sử đăng nhập phù hợp' : 'Chưa có lịch sử đăng nhập nào'}
 </p>
 </div>
 ) : (
 <div className="overflow-x-auto rounded-md border border-secondary/20 shadow-sm">
 <table className="w-full text-sm">
 <thead>
 <tr className="bg-neutral">
 <th className="px-5 py-3.5 text-left font-bold text-secondary text-xs uppercase tracking-wider">Học viên</th>
 <th className="px-5 py-3.5 text-left font-bold text-secondary text-xs uppercase tracking-wider">Địa chỉ IP / Vị trí</th>
 <th className="px-5 py-3.5 text-left font-bold text-secondary text-xs uppercase tracking-wider">Trạng thái</th>
 <th className="px-5 py-3.5 text-left font-bold text-secondary text-xs uppercase tracking-wider">Thiết bị</th>
 <th className="px-5 py-3.5 text-left font-bold text-secondary text-xs uppercase tracking-wider">Thời gian</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-gray-100">
 {currentLogs.map((log) => {
 const p = Array.isArray(log.profiles) ? log.profiles[0] : log.profiles
 return (
 <tr key={log.id} className="bg-surface hover:bg-neutral/60 :bg-slate-800/40 transition-colors">
 <td className="px-5 py-4">
 <div className="flex items-center gap-3">
 <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-display font-bold text-sm flex-shrink-0">
 {(p?.full_name || '?')[0].toUpperCase()}
 </div>
 <div>
 <span className="font-semibold text-primary block">{p?.full_name || '—'}</span>
 <span className="text-xs text-secondary">{p?.email || '—'}</span>
 </div>
 </div>
 </td>
 <td className="px-5 py-4">
 <div className="flex flex-col gap-1">
 <span className="font-mono text-xs bg-neutral px-2 py-1 rounded w-fit text-gray-700">
 {log.ip_address}
 </span>
 <div className="flex items-center gap-1.5 text-secondary text-xs">
 <Globe size={12} />
 {log.city ?`${log.city},` : ''}{log.country || 'Unknown'}
 </div>
 </div>
 </td>
 <td className="px-5 py-4">
 {log.is_suspicious ? (
 <div className="flex flex-col gap-1 max-w-[200px]">
 <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-red-100 text-red-700 w-fit">
 <AlertTriangle size={12} /> Bất thường
 </span>
 <span className="text-xs text-red-600/80 line-clamp-2" title={log.suspicious_reason || ''}>
 {log.suspicious_reason}
 </span>
 </div>
 ) : (
 <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-green-100 text-green-700 w-fit">
 <Check size={12} /> Bình thường
 </span>
 )}
 </td>
 <td className="px-5 py-4">
 <div className="flex items-center gap-1.5 text-secondary max-w-[150px]">
 <MonitorSmartphone size={14} className="flex-shrink-0" />
 <span className="text-xs truncate" title={log.user_agent || ''}>
 {log.user_agent?.split(' ')[0] || 'Unknown'}
 </span>
 </div>
 </td>
 <td className="px-5 py-4 whitespace-nowrap text-secondary text-xs">
 {new Date(log.logged_in_at).toLocaleString('vi-VN')}
 </td>
 </tr>
 )
 })}
 </tbody>
 </table>
 </div>
 )
 )}
 </div>
 )
}
