import { Mail, Phone, MapPin, Send } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Liên hệ - Kho Toán',
  description: 'Liên hệ với chúng tôi để được tư vấn lộ trình học toán cá nhân hóa',
}

export default function ContactPage() {
  return (
    <div className="flex flex-col bg-neutral text-primary font-body min-h-[calc(100vh-80px)]">
      {/* Header Section */}
      <section className="bg-primary pt-16 pb-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute -top-10 -left-10 w-60 h-60 bg-surface rounded-full blur-3xl" />
          <div className="absolute top-20 right-10 w-40 h-40 bg-surface rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-surface/10 border border-surface/20 text-surface font-display text-sm tracking-[0.14em] uppercase font-bold mb-6">
            Liên hệ với chúng tôi
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-surface mb-6 tracking-tight">
            Chúng tôi ở đây để <br className="hidden md:block" />
            <span className="text-tertiary">hỗ trợ bạn</span>
          </h1>
          <p className="text-surface/80 text-[0.95rem] leading-[1.55] max-w-2xl mx-auto">
            Có câu hỏi về lộ trình học tập, tài khoản, hay thanh toán? Đừng ngần ngại để lại lời nhắn, đội ngũ tư vấn viên của Kho Toán sẽ phản hồi bạn trong thời gian sớm nhất.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-neutral -mt-8 relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            
            {/* Contact Info Cards */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              <div className="bg-surface p-8 rounded-lg border border-secondary/10 shadow-sm flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300">
                <div className="w-14 h-14 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                  <Phone size={24} />
                </div>
                <h3 className="font-display font-semibold text-primary text-xl mb-2">Điện thoại</h3>
                <p className="text-secondary text-[0.95rem] mb-4">Hỗ trợ nhanh chóng qua hotline 24/7</p>
                <a href="tel:19001234" className="font-display font-bold text-tertiary text-lg hover:underline">1900 1234</a>
              </div>

              <div className="bg-surface p-8 rounded-lg border border-secondary/10 shadow-sm flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300">
                <div className="w-14 h-14 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                  <Mail size={24} />
                </div>
                <h3 className="font-display font-semibold text-primary text-xl mb-2">Email</h3>
                <p className="text-secondary text-[0.95rem] mb-4">Gửi email cho chúng tôi để được giải đáp chi tiết</p>
                <a href="mailto:hotro@khotoan.vn" className="font-display font-bold text-tertiary text-lg hover:underline">hotro@khotoan.vn</a>
              </div>

              <div className="bg-surface p-8 rounded-lg border border-secondary/10 shadow-sm flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300">
                <div className="w-14 h-14 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                  <MapPin size={24} />
                </div>
                <h3 className="font-display font-semibold text-primary text-xl mb-2">Văn phòng</h3>
                <p className="text-secondary text-[0.95rem] mb-4">Làm việc từ T2 - T7 (8:00 - 17:30)</p>
                <address className="not-italic font-display font-bold text-primary text-center">
                  Tòa nhà Kho Toán, Đường A<br />
                  Quận 1, TP. Hồ Chí Minh
                </address>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-surface p-8 md:p-12 rounded-lg border border-secondary/10 shadow-lg">
                <h2 className="text-3xl font-display font-bold text-primary mb-2">Gửi tin nhắn</h2>
                <p className="text-secondary text-[0.95rem] mb-8">Điền thông tin của bạn vào mẫu dưới đây và chúng tôi sẽ liên hệ lại.</p>
                
                <form className="space-y-6" action="#" method="POST" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="firstName" className="block text-sm font-semibold text-primary uppercase tracking-wider">Họ & tên đệm</label>
                      <input 
                        type="text" 
                        id="firstName" 
                        className="w-full bg-neutral border border-secondary/20 rounded-md px-4 py-3 text-primary focus:outline-none focus:ring-2 focus:ring-tertiary/50 focus:border-tertiary transition-colors"
                        placeholder="Nguyễn Văn"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="lastName" className="block text-sm font-semibold text-primary uppercase tracking-wider">Tên</label>
                      <input 
                        type="text" 
                        id="lastName" 
                        className="w-full bg-neutral border border-secondary/20 rounded-md px-4 py-3 text-primary focus:outline-none focus:ring-2 focus:ring-tertiary/50 focus:border-tertiary transition-colors"
                        placeholder="An"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-sm font-semibold text-primary uppercase tracking-wider">Email</label>
                      <input 
                        type="email" 
                        id="email" 
                        className="w-full bg-neutral border border-secondary/20 rounded-md px-4 py-3 text-primary focus:outline-none focus:ring-2 focus:ring-tertiary/50 focus:border-tertiary transition-colors"
                        placeholder="email@example.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="phone" className="block text-sm font-semibold text-primary uppercase tracking-wider">Số điện thoại</label>
                      <input 
                        type="tel" 
                        id="phone" 
                        className="w-full bg-neutral border border-secondary/20 rounded-md px-4 py-3 text-primary focus:outline-none focus:ring-2 focus:ring-tertiary/50 focus:border-tertiary transition-colors"
                        placeholder="09xx xxx xxx"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="block text-sm font-semibold text-primary uppercase tracking-wider">Chủ đề</label>
                    <select 
                      id="subject"
                      className="w-full bg-neutral border border-secondary/20 rounded-md px-4 py-3 text-primary focus:outline-none focus:ring-2 focus:ring-tertiary/50 focus:border-tertiary transition-colors appearance-none"
                      defaultValue=""
                    >
                      <option value="" disabled>-- Chọn chủ đề hỗ trợ --</option>
                      <option value="course">Tư vấn khóa học</option>
                      <option value="account">Vấn đề tài khoản</option>
                      <option value="payment">Thanh toán/Học phí</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="block text-sm font-semibold text-primary uppercase tracking-wider">Nội dung</label>
                    <textarea 
                      id="message" 
                      rows={5}
                      className="w-full bg-neutral border border-secondary/20 rounded-md px-4 py-3 text-primary focus:outline-none focus:ring-2 focus:ring-tertiary/50 focus:border-tertiary transition-colors resize-y"
                      placeholder="Mô tả chi tiết vấn đề hoặc câu hỏi của bạn..."
                      required
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-tertiary text-surface font-display font-bold text-lg px-8 py-4 rounded-md flex items-center justify-center gap-2 hover:bg-tertiary/90 transition-colors shadow-md group"
                  >
                    Gửi tin nhắn
                    <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
