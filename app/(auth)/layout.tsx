import Image from 'next/image'

export default function AuthLayout({
 children,
}: {
 children: React.ReactNode
}) {
 return (
 <div className="min-h-screen grid lg:grid-cols-2 font-body">
 {/* Left side: Background & Branding */}
 <div className="hidden lg:flex relative bg-primary items-center justify-center overflow-hidden">
 <Image
 src="/login-bg.png"
 alt="Math Background"
 fill
 className="object-cover opacity-30 mix-blend-soft-light"
 priority
 />
 
 <div className="relative z-10 p-12 text-surface max-w-xl">
 <div className="mb-8 inline-block px-4 py-1.5 rounded-sm bg-surface/10 backdrop-blur-sm border border-surface/20 text-[0.78rem] font-display font-bold uppercase tracking-[0.14em]">
 ✨ Chương trình mới 2018
 </div>
 <h1 className="text-6xl font-display font-bold mb-6 tracking-tight leading-tight">
 Nền tảng học toán <span className="text-tertiary italic">số 1</span> Việt Nam
 </h1>
 <p className="text-lg opacity-80 leading-[1.55] font-medium">
 Chinh phục mọi kỳ thi với hệ thống bài giảng tương tác và kho câu hỏi thông minh bám sát chương trình GDPT 2018.
 </p>
 
 <div className="mt-16 grid grid-cols-2 gap-6">
 <div className="bg-surface/5 backdrop-blur-lg rounded-lg p-6 border border-surface/10 hover:border-surface/30 transition-all duration-300 group">
 <div className="text-3xl font-display font-bold text-surface group-hover:scale-105 transition-transform origin-left">10K+</div>
 <div className="text-[0.78rem] opacity-70 mt-1 uppercase tracking-[0.14em] font-bold font-display">Câu hỏi luyện tập</div>
 </div>
 <div className="bg-surface/5 backdrop-blur-lg rounded-lg p-6 border border-surface/10 hover:border-surface/30 transition-all duration-300 group">
 <div className="text-3xl font-display font-bold text-surface group-hover:scale-105 transition-transform origin-left">500+</div>
 <div className="text-[0.78rem] opacity-70 mt-1 uppercase tracking-[0.14em] font-bold font-display">Bài giảng Video</div>
 </div>
 </div>
 </div>
 </div>

 {/* Right side: Forms */}
 <div className="flex items-center justify-center p-8 bg-surface">
 <div className="w-full max-w-md">
 <div className="mb-8 lg:hidden text-center">
 <h1 className="text-3xl font-display font-bold text-primary tracking-tight">KHO<span className="text-tertiary italic">TOÁN</span></h1>
 </div>
 {children}
 </div>
 </div>
 </div>
 )
}
