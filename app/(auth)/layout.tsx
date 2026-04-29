import Image from 'next/image'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left side: Background & Branding */}
      <div className="hidden lg:flex relative bg-blue-700 items-center justify-center overflow-hidden">
        <Image
          src="/login-bg.png"
          alt="Math Background"
          fill
          className="object-cover opacity-50 mix-blend-soft-light"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 to-transparent z-0" />
        
        <div className="relative z-10 p-12 text-white max-w-xl">
          <div className="mb-8 inline-block px-4 py-1 rounded-full bg-blue-500/30 backdrop-blur-sm border border-white/20 text-sm font-medium">
            ✨ Chương trình mới 2018
          </div>
          <h1 className="text-6xl font-black mb-6 tracking-tight leading-tight">
            Nền tảng học toán <span className="text-blue-300">số 1</span> Việt Nam
          </h1>
          <p className="text-xl opacity-90 leading-relaxed font-light">
            Chinh phục mọi kỳ thi với hệ thống bài giảng tương tác và kho câu hỏi thông minh bám sát chương trình GDPT 2018.
          </p>
          
          <div className="mt-16 grid grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all duration-300 group">
              <div className="text-3xl font-bold text-blue-200 group-hover:scale-110 transition-transform origin-left">10K+</div>
              <div className="text-sm opacity-70 mt-1 uppercase tracking-wider font-semibold">Câu hỏi luyện tập</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all duration-300 group">
              <div className="text-3xl font-bold text-blue-200 group-hover:scale-110 transition-transform origin-left">500+</div>
              <div className="text-sm opacity-70 mt-1 uppercase tracking-wider font-semibold">Bài giảng Video</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side: Forms */}
      <div className="flex items-center justify-center p-8 bg-gray-50 dark:bg-slate-950">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden text-center">
             <h1 className="text-3xl font-black text-blue-600">Kho Toán</h1>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
