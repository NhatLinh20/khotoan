import Link from 'next/link'

export default function Footer() {
 return (
 <footer className="bg-primary border-t border-secondary/20">
 <div className="max-w-7xl mx-auto px-6 py-12">
 <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
 {/* Logo & Desc */}
 <div className="col-span-1 md:col-span-2">
 <div className="flex items-center gap-2 mb-4">
 <div className="w-8 h-8 bg-surface rounded-md flex items-center justify-center text-primary font-display font-bold">K</div>
 <span className="text-xl font-display font-display font-bold text-surface">Kho Toán</span>
 </div>
 <p className="text-sm text-neutral/80 max-w-sm leading-relaxed">
 Nền tảng học toán thông minh dành cho học sinh THCS & THPT. 
 Chinh phục mọi kỳ thi với lộ trình cá nhân hóa và kho bài tập khổng lồ.
 </p>
 </div>

 {/* Links */}
 <div>
 <h4 className="text-sm font-display font-bold text-surface uppercase tracking-wider mb-4">Khám phá</h4>
 <ul className="space-y-3 text-sm">
 <li><Link href="/" className="text-neutral/70 hover:text-surface transition-colors">Trang chủ</Link></li>
 <li><Link href="/courses" className="text-neutral/70 hover:text-surface transition-colors">Khóa học</Link></li>
 <li><Link href="/practice" className="text-neutral/70 hover:text-surface transition-colors">Luyện thi</Link></li>
 <li><Link href="/contact" className="text-neutral/70 hover:text-surface transition-colors">Liên hệ</Link></li>
 </ul>
 </div>

 {/* Contact */}
 <div>
 <h4 className="text-sm font-display font-bold text-surface uppercase tracking-wider mb-4">Liên hệ</h4>
 <ul className="space-y-3 text-sm text-neutral/70">
 <li>Email: contact@khotoan.edu.vn</li>
 <li>Hotline: 1900 123 456</li>
 <li>Địa chỉ: Hà Nội, Việt Nam</li>
 </ul>
 </div>
 </div>

 <div className="pt-8 border-t border-secondary/30 flex flex-col md:flex-row justify-between items-center gap-4">
 <p className="text-xs text-neutral/50 font-medium">
 © {new Date().getFullYear()} Kho Toán. Tất cả quyền được bảo lưu.
 </p>
 <div className="flex gap-4">
 <Link href="#" className="text-neutral/50 hover:text-surface transition-colors"><span className="sr-only">Facebook</span>FB</Link>
 <Link href="#" className="text-neutral/50 hover:text-surface transition-colors"><span className="sr-only">YouTube</span>YT</Link>
 </div>
 </div>
 </div>
 </footer>
 )
}
