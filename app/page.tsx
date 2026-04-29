import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, BookOpen, BrainCircuit, GraduationCap, Play, Star, Users, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  const { data: featuredCourses } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(3)

  const stats = [
    { label: 'Học sinh', value: '500+', icon: <Users size={24} /> },
    { label: 'Khóa học', value: '20+', icon: <BookOpen size={24} /> },
    { label: 'Câu hỏi', value: '1000+', icon: <BrainCircuit size={24} /> },
    { label: 'Đánh giá', value: '4.8/5', icon: <Star size={24} /> },
  ]

  const testimonials = [
    {
      name: 'Nguyễn Văn An',
      role: 'Học sinh lớp 12',
      content: 'Nhờ Kho Toán mà mình đã lấy lại căn bản chỉ sau 1 tháng. Các bài giảng rất dễ hiểu và bám sát đề thi THPT Quốc gia.',
      avatar: 'https://i.pravatar.cc/150?u=1'
    },
    {
      name: 'Trần Thị Bình',
      role: 'Học sinh lớp 9',
      content: 'Hệ thống luyện đề cực kỳ thông minh. Mình biết chính xác mình yếu ở đâu để cải thiện. Kỳ thi vào 10 vừa rồi mình được 9.5 điểm Toán!',
      avatar: 'https://i.pravatar.cc/150?u=2'
    },
    {
      name: 'Lê Hoàng Long',
      role: 'Học sinh lớp 11',
      content: 'Giao diện mượt mà, học trên điện thoại hay máy tính đều rất tiện. Rất thích cách thầy cô giải bài chi tiết.',
      avatar: 'https://i.pravatar.cc/150?u=3'
    }
  ]

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-16 pb-24 overflow-hidden bg-white dark:bg-slate-950">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 translate-x-1/2" />
        
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-8">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-ping" />
              Nền tảng học toán số 1 Việt Nam
            </div>
            <h1 className="text-6xl lg:text-7xl font-black text-gray-900 dark:text-white leading-[1.1] mb-8 tracking-tight">
              Học Toán <br />
              <span className="text-primary underline decoration-secondary decoration-wavy underline-offset-8">Thông Minh</span> <br />
              Hơn Mỗi Ngày
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-10 max-w-lg">
              Hệ thống bài giảng thông minh bám sát chương trình GDPT 2018. Học tập tương tác, lộ trình cá nhân hóa cho học sinh từ lớp 6 đến lớp 12.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/courses" className="group bg-primary text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center gap-2 hover:bg-primary-dark hover:scale-105 transition-all shadow-xl shadow-primary/20">
                Xem khóa học
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/practice" className="bg-secondary text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-secondary-dark hover:scale-105 transition-all shadow-xl shadow-secondary/20">
                Luyện thi ngay
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white dark:border-slate-800 rotate-2 hover:rotate-0 transition-transform duration-500">
              <Image 
                src="/login-bg.png" 
                alt="Học Toán" 
                width={800} 
                height={600} 
                priority
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-secondary rounded-full flex items-center justify-center text-white font-black text-2xl rotate-12 shadow-xl border-4 border-white dark:border-slate-800">
              -50%
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {stats.map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center text-center text-white">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm">
                  {stat.icon}
                </div>
                <div className="text-4xl font-black mb-1">{stat.value}</div>
                <div className="text-white/70 font-bold uppercase tracking-widest text-xs">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-24 bg-gray-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">Khóa học nổi bật</h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">Bắt đầu hành trình chinh phục môn Toán ngay hôm nay</p>
            </div>
            <Link href="/courses" className="text-primary font-bold flex items-center gap-2 hover:underline">
              Tất cả khóa học <ArrowRight size={20} />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredCourses?.map((course: any) => (
              <div key={course.id} className="group bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden border border-gray-100 dark:border-slate-800 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500">
                <div className="relative h-48 bg-gray-200 overflow-hidden">
                  <Image 
                    src={course.image_url || '/login-bg.png'} 
                    alt={course.title} 
                    fill 
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-secondary text-white px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                    Lớp {course.grade}
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-1 text-secondary mb-3">
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <span className="text-xs font-bold text-gray-400 ml-1">(4.9)</span>
                  </div>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-6 line-clamp-2">
                    {course.description || 'Học toán cùng chuyên gia, nắm chắc kiến thức và kỹ năng giải bài tập.'}
                  </p>
                  <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-gray-500">
                        <Users size={16} />
                      </div>
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{course.teacher_name}</span>
                    </div>
                    <div className="text-lg font-black text-primary">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {(!featuredCourses || featuredCourses.length === 0) && (
              <div className="col-span-3 py-20 text-center text-gray-500 font-medium bg-white rounded-3xl border-2 border-dashed border-gray-200">
                Chưa có khóa học nào được hiển thị.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 overflow-hidden bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">Học viên nói gì về Kho Toán?</h2>
            <div className="w-24 h-1.5 bg-secondary mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testi, idx) => (
              <div key={idx} className="relative p-10 rounded-[2.5rem] bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 hover:scale-105 transition-all duration-300 group">
                <div className="absolute top-8 right-10 text-primary/10 group-hover:text-primary/20 transition-colors">
                  <Play size={64} className="fill-current" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden relative border-2 border-primary/20">
                      <Image src={testi.avatar} alt={testi.name} fill className="object-cover" />
                    </div>
                    <div>
                      <h4 className="font-black text-gray-900 dark:text-white">{testi.name}</h4>
                      <p className="text-xs font-bold text-primary uppercase tracking-widest">{testi.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 italic leading-relaxed font-medium">
                    "{testi.content}"
                  </p>
                  <div className="mt-8 flex items-center gap-2">
                    <CheckCircle className="text-green-500" size={16} />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Học viên đã xác thực</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto rounded-[4rem] bg-gradient-to-br from-primary to-primary-dark p-12 lg:p-20 text-center relative overflow-hidden shadow-2xl shadow-primary/40">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
             <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl" />
             <div className="absolute bottom-10 right-10 w-60 h-60 bg-white rounded-full blur-3xl" />
          </div>
          
          <h2 className="text-4xl lg:text-6xl font-black text-white mb-8 tracking-tight relative z-10">
            Sẵn sàng để trở thành <br /> "Chiến Thần" môn Toán?
          </h2>
          <p className="text-white/80 text-xl font-medium mb-12 max-w-2xl mx-auto relative z-10">
            Tham gia cùng 50,000+ học viên và bắt đầu lộ trình học tập tối ưu ngay hôm nay.
          </p>
          <div className="flex flex-wrap justify-center gap-6 relative z-10">
            <Link href="/register" className="bg-white text-primary px-10 py-5 rounded-2xl font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-xl">
              Đăng ký miễn phí
            </Link>
            <Link href="/contact" className="bg-primary-dark text-white border-2 border-white/20 px-10 py-5 rounded-2xl font-black text-xl hover:bg-primary transition-all">
              Tư vấn lộ trình
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
