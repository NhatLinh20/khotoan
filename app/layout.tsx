import type { Metadata } from"next";
import { Oswald, Inter } from"next/font/google";
import"./globals.css";
import Navbar from"@/components/Navbar";
import Footer from"@/components/Footer";
import { createClient } from"@/lib/supabase/server";

const oswald = Oswald({ 
 subsets: ["latin"],
 weight: ["400","600","700"],
 variable:"--font-display",
});

const inter = Inter({ 
 subsets: ["latin"],
 weight: ["400","500"],
 variable:"--font-body",
});

export const metadata: Metadata = {
 title:"Kho Toán - Nền tảng học toán số 1 Việt Nam",
 description:"Dạy toán THCS-THPT thông minh, cá nhân hóa lộ trình học tập.",
};

export default async function RootLayout({
 children,
}: Readonly<{
 children: React.ReactNode;
}>) {
 const supabase = await createClient();
 const { data: { user } } = await supabase.auth.getUser();

 let profile = null;
 if (user) {
 const { data } = await supabase
 .from('profiles')
 .select('*')
 .eq('id', user.id)
 .single();
 profile = data;
 }

 return (
 <html lang="en" className={`${oswald.variable} ${inter.variable}`}>
 <body className="antialiased bg-neutral text-primary font-body">
 <Navbar user={user} profile={profile} />
 <main className="min-h-screen pt-20">
 {children}
 </main>
 <Footer />
 </body>
 </html>
 );
}
