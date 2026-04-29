import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { logout } from '@/app/actions/auth'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Xin chào, {profile?.full_name || 'Học viên'}!</h1>
            <p className="text-gray-600">Lớp {profile?.grade || 'Chưa cập nhật'}</p>
          </div>
          <form action={logout}>
            <button className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-100 transition-colors">
              Đăng xuất
            </button>
          </form>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-600 rounded-xl p-6 text-white shadow-lg">
            <h2 className="text-xl font-semibold mb-2">Khóa học của bạn</h2>
            <p className="opacity-90">Bắt đầu học ngay để đạt điểm cao.</p>
            <button className="mt-4 bg-white text-blue-600 px-4 py-2 rounded-lg font-bold">
              Tiếp tục học
            </button>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <h2 className="text-xl font-semibold mb-2 text-gray-900">Kết quả luyện tập</h2>
            <p className="text-gray-600">Bạn chưa có bài luyện tập nào.</p>
            <button className="mt-4 border border-blue-600 text-blue-600 px-4 py-2 rounded-lg font-bold">
              Làm bài ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
