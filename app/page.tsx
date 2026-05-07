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
 <div className="flex flex-col bg-neutral text-primary font-body">
 {/* Hero Section */}
 <section className="relative pt-16 pb-24 overflow-hidden bg-neutral">
 <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
 <div className="relative z-10">
 <div className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-surface border border-secondary/20 text-primary font-display text-sm tracking-[0.14em] uppercase font-bold mb-8 shadow-sm">
 <span className="flex h-2 w-2 rounded-full bg-tertiary animate-ping" />
 Nền tảng học toán số 1 Việt Nam
 </div>
 <h1 className="text-6xl lg:text-7xl font-display font-bold text-primary leading-[1.1] mb-8 tracking-tight">
 Học Toán <br />
 <span className="text-tertiary">Thông Minh</span> <br />
 Hơn Mỗi Ngày
 </h1>
 <p className="text-[0.95rem] text-secondary leading-[1.55] mb-10 max-w-lg">
 Hệ thống bài giảng thông minh bám sát chương trình GDPT 2018. Học tập tương tác, lộ trình cá nhân hóa cho học sinh từ lớp 6 đến lớp 12.
 </p>
 <div className="flex flex-wrap gap-4">
 <Link href="/courses" className="group bg-tertiary text-surface px-8 py-4 rounded-lg font-display font-semibold text-lg flex items-center gap-2 hover:bg-tertiary/90 transition-colors">
 Xem khóa học
 <ArrowRight className="group-hover:translate-x-1 transition-transform" />
 </Link>
 <Link href="/practice" className="border-2 border-primary text-primary px-8 py-4 rounded-lg font-display font-semibold text-lg hover:bg-primary/5 transition-colors">
 Luyện thi ngay
 </Link>
 </div>
 </div>

 <div className="relative">
 <div className="relative z-10 rounded-lg overflow-hidden shadow-lg border-4 border-surface rotate-2 hover:rotate-0 transition-transform duration-500">
 <Image 
 src="/login-bg.png" 
 alt="Học Toán" 
 width={800} 
 height={600} 
 priority
 className="w-full h-full object-cover"
 />
 </div>
 <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary rounded-full flex items-center justify-center text-surface font-display font-bold text-2xl rotate-12 shadow-md border-4 border-surface">
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
 <div key={idx} className="flex flex-col items-center text-center text-surface">
 <div className="w-14 h-14 bg-surface/10 rounded-lg flex items-center justify-center mb-4">
 {stat.icon}
 </div>
 <div className="text-4xl font-display font-bold mb-1">{stat.value}</div>
 <div className="text-surface/70 font-display font-bold uppercase tracking-[0.14em] text-[0.78rem]">{stat.label}</div>
 </div>
 ))}
 </div>
 </div>
 </section>

 {/* Featured Courses Section */}
 <section className="py-24 bg-neutral">
 <div className="max-w-7xl mx-auto px-6">
 <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
 <div>
 <h2 className="text-4xl font-display font-bold text-primary mb-4 tracking-tight">Khóa học nổi bật</h2>
 <p className="text-secondary text-[0.95rem] leading-[1.55]">Bắt đầu hành trình chinh phục môn Toán ngay hôm nay</p>
 </div>
 <Link href="/courses" className="text-tertiary font-display font-semibold flex items-center gap-2 hover:underline">
 Tất cả khóa học <ArrowRight size={20} />
 </Link>
 </div>

 <div className="grid md:grid-cols-3 gap-8">
 {featuredCourses?.map((course: any) => (
 <div key={course.id} className="group bg-surface rounded-lg overflow-hidden border border-secondary/10 hover:shadow-lg transition-all duration-300">
 <div className="relative h-48 bg-neutral overflow-hidden">
 <Image 
 src={course.image_url || '/login-bg.png'} 
 alt={course.title} 
 fill 
 sizes="(max-width: 768px) 100vw, 33vw"
 className="object-cover group-hover:scale-105 transition-transform duration-500"
 />
 <div className="absolute top-4 left-4 bg-primary text-surface px-3 py-1 rounded-sm text-[0.78rem] font-display font-bold uppercase tracking-[0.14em]">
 Lớp {course.grade}
 </div>
 </div>
 <div className="p-8">
 <div className="flex items-center gap-1 text-tertiary mb-3">
 <Star size={16} fill="currentColor" />
 <Star size={16} fill="currentColor" />
 <Star size={16} fill="currentColor" />
 <Star size={16} fill="currentColor" />
 <Star size={16} fill="currentColor" />
 <span className="text-[0.78rem] font-bold text-secondary ml-1">(4.9)</span>
 </div>
 <h3 className="text-[1.5rem] font-display font-semibold text-primary mb-2 line-clamp-1 group-hover:text-tertiary transition-colors">
 {course.title}
 </h3>
 <p className="text-secondary text-[0.95rem] leading-[1.55] mb-6 line-clamp-2">
 {course.description || 'Học toán cùng chuyên gia, nắm chắc kiến thức và kỹ năng giải bài tập.'}
 </p>
 <div className="flex items-center justify-between pt-6 border-t border-secondary/10">
 <div className="flex items-center gap-2">
 <div className="w-8 h-8 rounded-full bg-neutral flex items-center justify-center text-secondary">
 <Users size={16} />
 </div>
 <span className="text-[0.95rem] font-semibold text-primary">{course.teacher_name}</span>
 </div>
 <div className="text-[1.2rem] font-display font-bold text-primary">
 {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price)}
 </div>
 </div>
 </div>
 </div>
 ))}
 
 {(!featuredCourses || featuredCourses.length === 0) && (
 <div className="col-span-3 py-20 text-center text-secondary font-medium bg-surface rounded-lg border border-secondary/20">
 Chưa có khóa học nào được hiển thị.
 </div>
 )}
 </div>
 </div>
 </section>

 {/* Testimonials Section */}
 <section className="py-24 overflow-hidden bg-neutral border-t border-secondary/10">
 <div className="max-w-7xl mx-auto px-6">
 <div className="text-center mb-20">
 <h2 className="text-4xl font-display font-bold text-primary mb-6 tracking-tight">Học viên nói gì về Kho Toán?</h2>
 <div className="w-24 h-1.5 bg-tertiary mx-auto rounded-sm" />
 </div>

 <div className="grid md:grid-cols-3 gap-8">
 {testimonials.map((testi, idx) => (
 <div key={idx} className="relative p-10 rounded-lg bg-surface border border-secondary/10 hover:-translate-y-1 transition-transform duration-300 group">
 <div className="absolute top-8 right-10 text-primary/5">
 <Play size={64} className="fill-current" />
 </div>
 <div className="relative z-10">
 <div className="flex items-center gap-4 mb-8">
 <div className="w-14 h-14 rounded-lg overflow-hidden relative border border-secondary/20">
 <Image src={testi.avatar} alt={testi.name} fill className="object-cover" />
 </div>
 <div>
 <h4 className="font-display font-semibold text-primary text-lg">{testi.name}</h4>
 <p className="text-[0.78rem] font-display font-bold text-secondary uppercase tracking-[0.14em]">{testi.role}</p>
 </div>
 </div>
 <p className="text-secondary text-[0.95rem] leading-[1.55] italic">
"{testi.content}"
 </p>
 <div className="mt-8 flex items-center gap-2">
 <CheckCircle className="text-green-600" size={16} />
 <span className="text-[0.78rem] font-display font-bold text-secondary uppercase tracking-[0.14em]">Học viên đã xác thực</span>
 </div>
 </div>
 </div>
 ))}
 </div>
 </div>
 </section>

 {/* CTA Section */}
 <section className="py-24 px-6 bg-neutral">
 <div className="max-w-5xl mx-auto rounded-lg bg-primary p-12 lg:p-20 text-center relative overflow-hidden shadow-lg">
 <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
 <div className="absolute top-10 left-10 w-40 h-40 bg-surface rounded-full blur-3xl" />
 <div className="absolute bottom-10 right-10 w-60 h-60 bg-surface rounded-full blur-3xl" />
 </div>
 
 <h2 className="text-4xl lg:text-[2.3rem] font-display font-semibold text-surface mb-8 tracking-tight relative z-10">
 Sẵn sàng để trở thành <span className="text-tertiary">"Chiến Thần"</span> môn Toán?
 </h2>
 <p className="text-neutral/80 text-[0.95rem] leading-[1.55] mb-12 max-w-2xl mx-auto relative z-10">
 Tham gia cùng 50,000+ học viên và bắt đầu lộ trình học tập tối ưu ngay hôm nay.
 </p>
 <div className="flex flex-wrap justify-center gap-6 relative z-10">
 <Link href="/register" className="bg-tertiary text-surface px-10 py-5 rounded-lg font-display font-bold text-lg hover:bg-tertiary/90 transition-colors shadow-md">
 Đăng ký miễn phí
 </Link>
 <Link href="/contact" className="border-2 border-surface text-surface bg-transparent px-10 py-5 rounded-lg font-display font-bold text-lg hover:bg-surface/10 transition-colors">
 Tư vấn lộ trình
 </Link>
 </div>
 </div>
 </section>
 </div>
 )
}
