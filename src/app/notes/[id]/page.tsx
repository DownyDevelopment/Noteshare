'use client';

import React, { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { ChevronLeft, Star, Eye, Download, Bookmark, Lock, ArrowLeft, Send, Check, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function NoteDetail({ params }: PageProps) {
  const router = useRouter();
  const { id } = use(params);
  const { notes, user, isAuthenticated, bookmarkNote, purchaseNote, addReview } = useApp();

  // Find note
  const note = notes.find((n) => n.id === id);

  // States for writing review
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  if (!note) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center space-y-4">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
        <h2 className="text-lg font-bold text-brand-dark">Catatan Tidak Ditemukan</h2>
        <p className="text-xs text-gray-500">Materi yang Anda cari mungkin sudah dihapus atau tidak terdaftar.</p>
        <Link href="/explore" className="inline-block rounded-lg bg-brand-primary px-4 py-2 text-xs font-bold text-white hover:bg-brand-primary-hover shadow-sm">
          Kembali ke Eksplorasi
        </Link>
      </div>
    );
  }

  const isBookmarked = user?.bookmarks.includes(note.id) ?? false;
  const isPurchased = user?.purchasedNotes.includes(note.id) ?? false;
  const isCreator =
    (user?.uploadedNotes.includes(note.id) ?? false) || note.uploaderNrp === user?.nrp;

  const isUnlocked = !note.isPremium || isPurchased || isCreator;

  const requireAuth = (redirectPath?: string) => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(redirectPath || `/notes/${note.id}`)}`);
      return false;
    }
    return true;
  };

  const handleActionClick = () => {
    if (!requireAuth()) return;

    if (isUnlocked) {
      // Trigger simulated file download
      const link = document.createElement('a');
      link.href = '#';
      link.setAttribute('download', `${note.title}.pdf`);
      document.body.appendChild(link);
      
      // Increment download counter locally (simulated)
      note.downloads += 1;
      
      alert(`Simulasi Download: Berkas "${note.title}.pdf" berhasil diunduh ke perangkat Anda.`);
      router.refresh();
    } else {
      // Open DANA payment gateway modal
      purchaseNote(note.id);
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    if (!requireAuth()) return;

    addReview(note.id, ratingInput, commentInput.trim());
    setCommentInput('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  const formatRupiah = (amount: number) => {
    if (amount === 0) return 'Gratis';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-brand-primary transition-colors active:scale-95"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Hasil Cari
      </button>

      {/* Main Grid: Left content (Note & Preview), Right sidebar (Details card) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* ================= LEFT MAIN AREA ================= */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Note Info Header */}
          <div className="space-y-4 bg-white rounded-2xl border border-brand-secondary/15 p-6 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded bg-brand-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-brand-primary uppercase tracking-wider">
                {note.courseCode}
              </span>
              <span className="rounded bg-gray-100 px-2.5 py-0.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                {note.courseName}
              </span>
              <span className="rounded bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-brand-accent uppercase tracking-wider">
                Semester {note.semester}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-brand-dark leading-snug">
              {note.title}
            </h1>

            {/* Micro Stats */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 font-semibold border-t border-gray-50 pt-3">
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                {note.rating} ({note.reviewsCount} Ulasan)
              </span>
              <div className="h-3 w-px bg-gray-200"></div>
              <span>{note.views} Dilihat</span>
              <div className="h-3 w-px bg-gray-200"></div>
              <span>{note.downloads} Unduhan</span>
              <div className="h-3 w-px bg-gray-200"></div>
              <span>Diunggah {note.dateUploaded}</span>
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-white rounded-2xl border border-brand-secondary/15 p-6 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-dark">Deskripsi & Pokok Bahasan</h3>
            <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">
              {note.description}
            </p>
          </div>

          {/* DOCUMENT PREVIEW & FREEMIUM WALL */}
          <div className="bg-white rounded-2xl border border-brand-secondary/15 p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-dark">Preview Dokumen Catatan</h3>
            
            <div className="border border-brand-secondary/10 rounded-xl overflow-hidden bg-gray-50 max-h-[500px] overflow-y-auto space-y-4 p-4 relative">
              {note.previewPages.map((pageText, idx) => {
                const isPageBlurred = idx > 0 && !isUnlocked;
                
                return (
                  <div
                    key={idx}
                    className={`aspect-[1/1.4] w-full rounded-lg border border-gray-200 bg-white p-6 shadow-sm flex flex-col justify-between transition-all select-none relative ${
                      isPageBlurred ? 'blur-[5px] opacity-30 pointer-events-none' : ''
                    }`}
                  >
                    <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold border-b border-gray-100 pb-2">
                      <span>{note.courseName} - {note.topic}</span>
                      <span>Page {idx + 1} of {note.previewPages.length}</span>
                    </div>

                    <div className="flex-1 flex flex-col justify-center text-center p-4">
                      {/* Paper lines simulation */}
                      <p className="text-xs font-semibold text-brand-dark leading-relaxed italic">{pageText}</p>
                      
                      <div className="mt-8 space-y-2.5">
                        <div className="h-2 w-full bg-gray-100 rounded"></div>
                        <div className="h-2 w-4/5 bg-gray-100 rounded mx-auto"></div>
                        <div className="h-2 w-11/12 bg-gray-100 rounded"></div>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-2 text-center text-[8px] text-gray-400 font-semibold uppercase tracking-wider">
                      Eksklusif NoteShare ITS • Dokumen Terlindungi
                    </div>
                  </div>
                );
              })}

              {/* PREMIUM WALL BLUR OVERLAY */}
              {!isUnlocked && (
                <div className="absolute inset-x-0 bottom-0 top-[180px] bg-gradient-to-t from-gray-50 via-gray-50/95 to-transparent flex flex-col items-center justify-end p-6 pb-12 z-20">
                  <div className="w-full max-w-[340px] text-center rounded-2xl bg-white border border-brand-secondary/20 p-6 shadow-2xl space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-amber-50 text-brand-accent">
                      <Lock className="h-5.5 w-5.5" />
                    </div>
                    
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-bold text-brand-dark uppercase tracking-wider">Kunci Konten Premium</h4>
                      <p className="text-[11px] text-gray-500 leading-relaxed">
                        Anda hanya bisa melihat halaman pertama. Sisa {note.previewPages.length - 1} halaman terkunci. Hubungkan dompet DANA untuk membayar & mengunduh berkas lengkap.
                      </p>
                    </div>

                    <button
                      onClick={handleActionClick}
                      className="w-full rounded-xl bg-brand-primary hover:bg-brand-primary-hover py-3 text-xs font-bold text-white shadow-md transition-all active:scale-97 flex items-center justify-center gap-1.5"
                    >
                      Buka Sekarang ({formatRupiah(note.price)})
                    </button>
                    
                    <div className="flex justify-center items-center gap-1.5 text-[9px] text-sky-600 font-bold tracking-wider uppercase">
                      <span>Powered by</span>
                      <span className="text-[10px] tracking-wide font-extrabold text-[#108EE9]">DANA</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* PEER REVIEWS & RATING COMMENT SECTION */}
          <div className="bg-white rounded-2xl border border-brand-secondary/15 p-6 shadow-sm space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-dark">Diskusi & Ulasan Rekan Sejawat</h3>
            
            {/* Write a review form */}
            <form onSubmit={handleReviewSubmit} className="space-y-4 border-b border-gray-150 pb-6">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-brand-dark">Beri Nilai Catatan:</span>
                
                {/* Visual Star Selector */}
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRatingInput(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-0.5 focus:outline-none transition-transform active:scale-110"
                    >
                      <Star
                        className={`h-5 w-5 ${
                          (hoverRating || ratingInput) >= star
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-gray-200'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Tambahkan ulasan Anda (contoh: 'Materinya lengkap, sangat cocok buat UTS!')..."
                  className="w-full rounded-xl border border-brand-secondary/20 bg-white px-3.5 py-2.5 text-xs font-semibold text-brand-dark focus:border-brand-primary focus:outline-none placeholder:text-gray-300"
                />
                
                <button
                  type="submit"
                  disabled={!commentInput.trim()}
                  className="rounded-xl bg-brand-primary p-2.5 text-white hover:bg-brand-primary-hover disabled:bg-gray-100 disabled:text-gray-300 transition-all active:scale-95 shrink-0 shadow-sm"
                >
                  <Send className="h-4.5 w-4.5" />
                </button>
              </div>

              {reviewSubmitted && (
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-semibold">
                  <Check className="h-3.5 w-3.5" /> Ulasan Anda berhasil ditambahkan!
                </div>
              )}
            </form>

            {/* Reviews list */}
            {note.reviews && note.reviews.length > 0 ? (
              <div className="space-y-4 divide-y divide-gray-50">
                {note.reviews.map((rev) => (
                  <div key={rev.id} className="pt-4 first:pt-0 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-brand-secondary/20 flex items-center justify-center font-bold text-xs text-brand-primary">
                          {rev.userName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-brand-dark">{rev.userName}</p>
                          <p className="text-[9px] text-gray-400 font-medium">NRP {rev.userNrp.substring(0, 4)}... • {rev.date}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-3 w-3 ${
                              rev.rating >= star ? 'fill-amber-400 text-amber-400' : 'text-gray-150'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 pl-10 leading-relaxed font-medium">"{rev.comment}"</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 text-center py-4 font-semibold">Belum ada ulasan untuk catatan ini. Jadilah yang pertama memberikan review!</p>
            )}
          </div>
        </div>

        {/* ================= RIGHT ACTION SIDEBAR ================= */}
        <aside className="space-y-6">
          {/* Main Action Call to Action (CTA) Card */}
          <div className="rounded-2xl border border-brand-secondary/15 bg-white p-6 shadow-sm space-y-6">
            
            {/* Price Tag or status */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Harga Materi</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-brand-dark">
                  {formatRupiah(note.price)}
                </span>
                {note.isPremium && (
                  <span className="rounded bg-amber-50 px-2 py-0.5 text-[9px] font-bold text-brand-accent uppercase tracking-wider">
                    Premium
                  </span>
                )}
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-2.5">
              <button
                onClick={handleActionClick}
                className={`w-full rounded-xl py-3 text-xs font-bold text-white shadow-md transition-all active:scale-97 flex items-center justify-center gap-2 ${
                  isUnlocked 
                    ? 'bg-emerald-600 hover:bg-emerald-700' 
                    : 'bg-brand-primary hover:bg-brand-primary-hover'
                }`}
              >
                {isUnlocked ? (
                  <>
                    <Download className="h-4.5 w-4.5" />
                    Unduh Catatan (PDF)
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    Buka via DANA
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  if (requireAuth()) bookmarkNote(note.id);
                }}
                className={`w-full rounded-xl py-3 text-xs font-bold border transition-all active:scale-97 flex items-center justify-center gap-2 ${
                  isBookmarked
                    ? 'bg-amber-50 border-amber-300 text-brand-accent hover:bg-amber-100/50'
                    : 'bg-white border-brand-secondary/30 text-brand-dark hover:bg-gray-50'
                }`}
              >
                <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-amber-400' : ''}`} />
                {isBookmarked ? 'Disimpan di Bookmark' : 'Simpan ke Bookmark'}
              </button>
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-3">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Detail Pembeli & Keamanan</p>
              <div className="space-y-2 text-[11px] text-gray-500">
                <div className="flex justify-between">
                  <span>Status Lisensi:</span>
                  <span className="font-semibold text-brand-dark">
                    {isUnlocked ? (isCreator ? 'Pemilik Materi' : 'Terbuka / Gratis') : 'Belum Dibeli'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Ukuran File:</span>
                  <span className="font-semibold text-brand-dark">2.4 MB (PDF)</span>
                </div>
                <div className="flex justify-between">
                  <span>Dosen Terkait:</span>
                  <span className="font-semibold text-brand-dark truncate max-w-[120px]" title={note.lecturer}>
                    {note.lecturer}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Uploader profile card */}
          <div className="rounded-2xl border border-brand-secondary/15 bg-white p-5 shadow-sm space-y-4">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Diunggah Oleh</h4>
            
            <div className="flex items-center gap-3">
              <img
                src={note.uploaderAvatar}
                alt={note.uploaderName}
                className="h-11 w-11 rounded-full border border-brand-secondary/20 bg-amber-100 shadow-sm"
              />
              <div>
                <h5 className="text-xs font-bold text-brand-dark">{note.uploaderName}</h5>
                <p className="text-[9px] text-gray-400 font-medium">NRP {note.uploaderNrp.substring(0, 4)}...</p>
                <p className="text-[9px] text-gray-500 font-bold mt-0.5 uppercase text-brand-primary">Kreator NoteShare</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 border-t border-gray-50 pt-3 text-center text-[10px]">
              <div className="rounded-lg bg-gray-50 p-2">
                <p className="text-gray-400">Total Upload</p>
                <p className="font-bold text-brand-dark text-xs mt-0.5">5 Catatan</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-2">
                <p className="text-gray-400">Total Unduhan</p>
                <p className="font-bold text-brand-primary text-xs mt-0.5">180x</p>
              </div>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
