import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo & Desc */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">K</div>
              <span className="text-xl font-black text-gray-900 dark:text-white">Kho Toán</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm leading-relaxed">
              Nền tảng học toán thông minh dành cho học sinh THCS & THPT. 
              Chinh phục mọi kỳ thi với lộ trình cá nhân hóa và kho bài tập khổng lồ.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Khám phá</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">Trang chủ</Link></li>
              <li><Link href="/courses" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">Khóa học</Link></li>
              <li><Link href="/practice" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">Luyện thi</Link></li>
              <li><Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">Liên hệ</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Liên hệ</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>Email: contact@khotoan.edu.vn</li>
              <li>Hotline: 1900 123 456</li>
              <li>Địa chỉ: Hà Nội, Việt Nam</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            © {new Date().getFullYear()} Kho Toán. Tất cả quyền được bảo lưu.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-gray-400 hover:text-primary transition-colors"><span className="sr-only">Facebook</span>FB</Link>
            <Link href="#" className="text-gray-400 hover:text-primary transition-colors"><span className="sr-only">YouTube</span>YT</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
