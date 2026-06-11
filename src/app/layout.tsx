import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { AppContextProvider } from '@/context/AppContext';
import Navbar from '@/components/Navbar';
import DanaModal from '@/components/DanaModal';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'NoteShare ITS - Academic Notes Marketplace',
  description: 'Exclusive academic notes marketplace for ITS (Institut Teknologi Sepuluh Nopember) students. Share, find, and monetize structured study notes, cheat sheets, and course summaries.',
  keywords: 'ITS, Institut Teknologi Sepuluh Nopember, Catatan Kuliah, Kalkulus, Fisika Dasar, SKPB, Teknik Informatika, Rangkuman Ujian, Study Notes',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${plusJakartaSans.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-brand-light text-brand-dark font-sans antialiased">
        <AppContextProvider>
          {/* Header Section */}
          <Navbar />

          {/* DANA Payment Overlay Simulator */}
          <DanaModal />

          {/* Main Application Area */}
          <main className="flex-grow">
            {children}
          </main>

          {/* Footer Section */}
          <footer className="border-t border-brand-secondary/20 bg-brand-dark text-brand-light/90 py-10 mt-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Brand Column */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-light text-brand-dark">
                      <span className="font-bold text-sm">N</span>
                    </div>
                    <span className="text-lg font-bold tracking-tight text-white">
                      Note<span className="text-brand-secondary">Share</span>
                    </span>
                  </div>
                  <p className="text-xs text-brand-secondary/70 leading-relaxed">
                    Platform marketplace akademik eksklusif mahasiswa ITS. Membantu mahasiswa berkolaborasi melalui catatan berkualitas tinggi dan membantu kreator memonetisasi pengetahuannya.
                  </p>
                </div>

                {/* SKPB TPB Courses */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Materi Bersama (SKPB)</h4>
                  <ul className="space-y-2 text-xs text-brand-secondary/65">
                    <li><a href="/explore?course=Kalkulus+I" className="hover:text-white transition-colors">Kalkulus I (SF141301)</a></li>
                    <li><a href="/explore?course=Fisika+Dasar+I" className="hover:text-white transition-colors">Fisika Dasar I (SF141303)</a></li>
                    <li><a href="/explore?course=Kimia+Dasar+I" className="hover:text-white transition-colors">Fisika Dasar II (SF141305)</a></li>
                    <li><a href="/explore?course=Kalkulus+II" className="hover:text-white transition-colors">Kalkulus II (SF141302)</a></li>
                  </ul>
                </div>

                {/* Major Specifics */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Fakultas / Jurusan</h4>
                  <ul className="space-y-2 text-xs text-brand-secondary/65">
                    <li><a href="/explore?faculty=FTEIC" className="hover:text-white transition-colors">FTEIC (Elektro & Informatika)</a></li>
                    <li><a href="/explore?faculty=FSAD" className="hover:text-white transition-colors">FSAD (Sains & Analitika Data)</a></li>
                  </ul>
                </div>

                {/* Integration Details */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Integrasi Sistem</h4>
                  <div className="space-y-2.5">
                    <div className="rounded-lg bg-white/5 p-2.5 border border-white/10">
                      <p className="text-[10px] text-brand-secondary/60">Payment Gateway Ready</p>
                      <p className="text-[11px] font-bold text-sky-400 mt-0.5">DANA Simulator Active</p>
                    </div>
                    <div className="rounded-lg bg-white/5 p-2.5 border border-white/10">
                      <p className="text-[10px] text-brand-secondary/60">Database & Storage</p>
                      <p className="text-[11px] font-bold text-emerald-400 mt-0.5">Supabase Connect Ready</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Copyright */}
              <div className="border-t border-white/10 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center text-[10px] text-brand-secondary/50 gap-3">
                <p>© {new Date().getFullYear()} NoteShare ITS. Built with ❤️ for Vivat ITS!</p>
                <div className="flex gap-4">
                  <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                  <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                  <a href="#" className="hover:text-white transition-colors">ITS Portal Link</a>
                </div>
              </div>
            </div>
          </footer>
        </AppContextProvider>
      </body>
    </html>
  );
}
