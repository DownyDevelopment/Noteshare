'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Note, Transaction } from '@/types';
import { 
  BookOpen, Bookmark, GraduationCap, DollarSign, Download, UploadCloud, 
  ArrowUpRight, Wallet, ArrowDownLeft, Trash2, Calendar, FileText, CheckCircle2,
  AlertCircle, ChevronRight, BarChart3, PlusCircle, UserCheck, RefreshCw
} from 'lucide-react';
import { MOCK_COURSES } from '@/mockData';

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { notes, user, isAuthLoading, transactions, uploadNote, withdrawFunds, bookmarkNote, followCourse } = useApp();

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.replace('/login?redirect=/dashboard');
    }
  }, [isAuthLoading, user, router]);

  if (isAuthLoading || !user) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-brand-primary border-t-transparent" />
        <p className="text-sm text-gray-500 mt-4">Memuat dashboard...</p>
      </div>
    );
  }

  // Active view tabs: 'consumer' | 'creator'
  const [activeTab, setActiveTab] = useState<'consumer' | 'creator'>('consumer');
  
  // Consumer Sub-tabs: 'library' | 'bookmarks' | 'courses'
  const [consumerSubTab, setConsumerSubTab] = useState<'library' | 'bookmarks' | 'courses'>('library');

  // Sync activeTab from URL search query on mount/update
  useEffect(() => {
    const viewParam = searchParams.get('view');
    if (viewParam === 'creator') {
      setActiveTab('creator');
    } else {
      setActiveTab('consumer');
    }

    const actionParam = searchParams.get('action');
    if (actionParam === 'upload') {
      setIsUploading(true);
    }
  }, [searchParams]);

  // Upload Form states
  const [isUploading, setIsUploading] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCourseCode, setUploadCourseCode] = useState('');
  const [uploadCourseName, setUploadCourseName] = useState('');
  const [uploadTopic, setUploadTopic] = useState('');
  const [uploadLecturer, setUploadLecturer] = useState('');
  const [uploadSemester, setUploadSemester] = useState(1);
  const [uploadFaculty, setUploadFaculty] = useState('FSAD');
  const [uploadPriceType, setUploadPriceType] = useState<'free' | 'premium'>('free');
  const [uploadPrice, setUploadPrice] = useState(15000);
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  // Withdrawal States
  const [withdrawAmount, setWithdrawAmount] = useState(20000);
  const [withdrawPhone, setWithdrawPhone] = useState('0821-3945-8823');
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [withdrawStatus, setWithdrawStatus] = useState({ show: false, success: false, message: '' });

  // Get notes for library & bookmarks
  const purchasedNotes = notes.filter(n => user.purchasedNotes.includes(n.id));
  const bookmarkedNotes = notes.filter(n => user.bookmarks.includes(n.id));
  const uploadedNotes = notes.filter(n => user.uploadedNotes.includes(n.id));

  // Compute analytics
  const totalUploaded = uploadedNotes.length;
  // Calculate downloads & sales of own notes
  const totalDownloads = uploadedNotes.reduce((sum, n) => sum + n.downloads, 0);
  const totalSalesCount = uploadedNotes.reduce((sum, n) => sum + (n.isPremium ? n.downloads : 0), 0);
  const totalEarnings = uploadedNotes.reduce((sum, n) => sum + (n.isPremium ? n.downloads * n.price : 0), 0);

  // Form input validation
  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!uploadTitle.trim() || !uploadCourseName.trim() || !uploadCourseCode.trim() || !uploadTopic.trim() || !uploadLecturer.trim() || !uploadDescription.trim()) {
      setFormError('Semua kolom formulir wajib diisi.');
      return;
    }

    if (uploadPriceType === 'premium' && (!uploadPrice || uploadPrice < 5000)) {
      setFormError('Untuk catatan premium, minimal harga adalah Rp 5.000');
      return;
    }

    if (!uploadFile) {
      setFormError('Harap lampirkan berkas catatan kuliah Anda (format PDF).');
      return;
    }

    // File size limit check (10MB)
    if (uploadFile.size > 10 * 1024 * 1024) {
      setFormError('Ukuran file melebihi batas 10MB.');
      return;
    }

    // Trigger upload
    uploadNote({
      title: uploadTitle.trim(),
      courseCode: uploadCourseCode.trim().toUpperCase(),
      courseName: uploadCourseName.trim(),
      topic: uploadTopic.trim(),
      lecturer: uploadLecturer.trim(),
      semester: Number(uploadSemester),
      faculty: uploadFaculty,
      isPremium: uploadPriceType === 'premium',
      price: uploadPriceType === 'premium' ? Number(uploadPrice) : 0,
      description: uploadDescription.trim(),
      file: uploadFile
    });

    setFormSuccess(true);
    // Reset form fields
    setUploadTitle('');
    setUploadCourseCode('');
    setUploadCourseName('');
    setUploadTopic('');
    setUploadLecturer('');
    setUploadFile(null);
    setUploadDescription('');
    setFormError('');

    setTimeout(() => {
      setFormSuccess(false);
      setIsUploading(false);
      // Remove Action from url params
      const params = new URLSearchParams(searchParams.toString());
      params.delete('action');
      router.push(`/dashboard?view=creator&${params.toString()}`);
    }, 2000);
  };

  const handleWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawStatus({ show: false, success: false, message: '' });

    if (user.balance < withdrawAmount) {
      setWithdrawStatus({ show: true, success: false, message: 'Saldo DANA Anda tidak mencukupi.' });
      return;
    }

    if (withdrawAmount < 10000) {
      setWithdrawStatus({ show: true, success: false, message: 'Minimal penarikan dana adalah Rp 10.000.' });
      return;
    }

    setWithdrawLoading(true);

    // Simulated API payload submission
    setTimeout(() => {
      const response = withdrawFunds(withdrawAmount, withdrawPhone);
      setWithdrawLoading(false);
      setWithdrawStatus({
        show: true,
        success: response.success,
        message: response.message
      });
      if (response.success) {
        setWithdrawAmount(10000); // Reset
      }
    }, 1500);
  };

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Dashboard Top Intro Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-brand-secondary/15 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-4">
          <img src={user.avatar} alt={user.name} className="h-16 w-16 rounded-full border border-brand-secondary/25 bg-amber-50" />
          <div>
            <h1 className="text-xl font-extrabold text-brand-dark">Halo, {user.name}!</h1>
            <p className="text-xs text-gray-500 mt-0.5">NRP {user.nrp} • Fakultas FTEIC • Teknik Informatika ITS</p>
          </div>
        </div>

        {/* Global Tab Switcher */}
        <div className="flex gap-1.5 bg-gray-100 p-1.5 rounded-2xl border border-brand-secondary/10 shrink-0 self-start md:self-center">
          <button
            onClick={() => {
              setActiveTab('consumer');
              router.push('/dashboard?view=consumer');
            }}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition-all ${
              activeTab === 'consumer'
                ? 'bg-brand-primary text-brand-light shadow-md'
                : 'text-gray-500 hover:text-brand-primary'
            }`}
          >
            <UserCheck className="h-4 w-4" />
            Sebagai Pembaca
          </button>
          
          <button
            onClick={() => {
              setActiveTab('creator');
              router.push('/dashboard?view=creator');
            }}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition-all ${
              activeTab === 'creator'
                ? 'bg-brand-primary text-brand-light shadow-md'
                : 'text-gray-500 hover:text-brand-primary'
            }`}
            style={activeTab === 'creator' ? {} : { background: 'transparent', color: '#6B7280', boxShadow: 'none' }}
          >
            <BarChart3 className="h-4 w-4" />
            Sebagai Kreator
          </button>
        </div>
      </div>

      {/* ======================================================= */}
      {/* 1. CONSUMER / READER DASHBOARD VIEW */}
      {/* ======================================================= */}
      {activeTab === 'consumer' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Sub Navigation Sidebar */}
          <aside className="lg:col-span-1 rounded-2xl border border-brand-secondary/15 bg-white p-4 shadow-sm flex flex-col gap-1">
            <button
              onClick={() => setConsumerSubTab('library')}
              className={`flex items-center gap-2.5 rounded-xl px-4 py-3 text-xs font-bold text-left transition-all ${
                consumerSubTab === 'library'
                  ? 'bg-brand-secondary/20 text-brand-primary'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-brand-primary'
              }`}
            >
              <BookOpen className="h-4.5 w-4.5" />
              Perpustakaan Saya
              <span className="ml-auto rounded-full bg-white px-2 py-0.5 border border-brand-secondary/20 text-[10px]">
                {purchasedNotes.length}
              </span>
            </button>

            <button
              onClick={() => setConsumerSubTab('bookmarks')}
              className={`flex items-center gap-2.5 rounded-xl px-4 py-3 text-xs font-bold text-left transition-all ${
                consumerSubTab === 'bookmarks'
                  ? 'bg-brand-secondary/20 text-brand-primary'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-brand-primary'
              }`}
            >
              <Bookmark className="h-4.5 w-4.5" />
              Disimpan (Bookmark)
              <span className="ml-auto rounded-full bg-white px-2 py-0.5 border border-brand-secondary/20 text-[10px]">
                {bookmarkedNotes.length}
              </span>
            </button>

            <button
              onClick={() => setConsumerSubTab('courses')}
              className={`flex items-center gap-2.5 rounded-xl px-4 py-3 text-xs font-bold text-left transition-all ${
                consumerSubTab === 'courses'
                  ? 'bg-brand-secondary/20 text-brand-primary'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-brand-primary'
              }`}
            >
              <GraduationCap className="h-4.5 w-4.5" />
              Mata Kuliah Diikuti
              <span className="ml-auto rounded-full bg-white px-2 py-0.5 border border-brand-secondary/20 text-[10px]">
                {user.followedCourses.length}
              </span>
            </button>
          </aside>

          {/* Sub Content Grid */}
          <main className="lg:col-span-3 space-y-6">
            
            {/* subtab 1: library */}
            {consumerSubTab === 'library' && (
              <div className="bg-white rounded-2xl border border-brand-secondary/15 p-6 shadow-sm space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-brand-dark">Perpustakaan Saya</h3>
                  <p className="text-[11px] text-gray-400 mt-0.5">Catatan kuliah yang sudah Anda unduh atau beli sebelumnya.</p>
                </div>

                {purchasedNotes.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {purchasedNotes.map((note) => (
                      <div
                        key={note.id}
                        className="flex border border-brand-secondary/10 rounded-xl overflow-hidden hover:shadow transition-all bg-gray-50/50 p-3 items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                            <BookOpen className="h-5.5 w-5.5" />
                          </div>
                          <div>
                            <h4
                              onClick={() => router.push(`/notes/${note.id}`)}
                              className="text-xs font-bold text-brand-dark hover:text-brand-primary cursor-pointer line-clamp-1"
                            >
                              {note.title}
                            </h4>
                            <p className="text-[9px] text-gray-400 font-medium mt-0.5">{note.courseName} • Uploader: {note.uploaderName}</p>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            note.downloads += 1;
                            alert(`Simulasi Download: Berkas "${note.title}.pdf" berhasil diunduh.`);
                          }}
                          className="rounded-lg bg-brand-primary p-2 text-white hover:bg-brand-primary-hover shadow-sm transition-all"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 space-y-3">
                    <BookOpen className="mx-auto h-8 w-8 text-gray-300 animate-pulse" />
                    <p className="text-xs text-gray-400 font-medium">Anda belum mengunduh catatan apapun.</p>
                    <button onClick={() => router.push('/explore')} className="rounded-lg bg-brand-primary px-3 py-1.5 text-[10px] font-bold text-white hover:bg-brand-primary-hover shadow-sm">Jelajahi Materi</button>
                  </div>
                )}
              </div>
            )}

            {/* subtab 2: bookmarks */}
            {consumerSubTab === 'bookmarks' && (
              <div className="bg-white rounded-2xl border border-brand-secondary/15 p-6 shadow-sm space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-brand-dark">Catatan yang Disimpan</h3>
                  <p className="text-[11px] text-gray-400 mt-0.5">Daftar bookmark catatan untuk dibaca atau dibeli nanti.</p>
                </div>

                {bookmarkedNotes.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {bookmarkedNotes.map((note) => (
                      <div
                        key={note.id}
                        className="flex border border-brand-secondary/10 rounded-xl overflow-hidden hover:shadow transition-all bg-gray-50/50 p-3 items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-brand-accent border border-amber-155">
                            <Bookmark className="h-5.5 w-5.5 fill-amber-400" />
                          </div>
                          <div>
                            <h4
                              onClick={() => router.push(`/notes/${note.id}`)}
                              className="text-xs font-bold text-brand-dark hover:text-brand-primary cursor-pointer line-clamp-1"
                            >
                              {note.title}
                            </h4>
                            <p className="text-[9px] text-gray-400 font-medium mt-0.5">{note.courseName} • {note.isPremium ? formatRupiah(note.price) : 'Gratis'}</p>
                          </div>
                        </div>

                        <button
                          onClick={() => bookmarkNote(note.id)}
                          className="rounded-lg bg-red-50 p-2 text-red-500 hover:bg-red-100 transition-all"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 space-y-3">
                    <Bookmark className="mx-auto h-8 w-8 text-gray-300" />
                    <p className="text-xs text-gray-400 font-medium">Belum ada catatan di bookmark Anda.</p>
                  </div>
                )}
              </div>
            )}

            {/* subtab 3: followed courses */}
            {consumerSubTab === 'courses' && (
              <div className="bg-white rounded-2xl border border-brand-secondary/15 p-6 shadow-sm space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-brand-dark">Mata Kuliah yang Diikuti</h3>
                  <p className="text-[11px] text-gray-400 mt-0.5">Dapatkan akses cepat ke materi berdasarkan mata kuliah langganan Anda.</p>
                </div>

                {user.followedCourses.length > 0 ? (
                  <div className="space-y-3">
                    {user.followedCourses.map((courseName, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between border border-brand-secondary/10 rounded-xl bg-gray-50/50 p-3.5 gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <GraduationCap className="h-5 w-5 text-brand-primary shrink-0" />
                          <div>
                            <h4 className="text-xs font-bold text-brand-dark">{courseName}</h4>
                            <p className="text-[9px] text-gray-400 font-medium">Materi Bersama / SKPB ITS</p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => router.push(`/explore?course=${encodeURIComponent(courseName)}`)}
                            className="rounded-lg bg-brand-primary/10 border border-brand-primary/15 px-3 py-1.5 text-[10px] font-bold text-brand-primary hover:bg-brand-primary hover:text-white transition-all flex items-center gap-1"
                          >
                            Explore Notes
                            <ChevronRight className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => followCourse(courseName)}
                            className="rounded-lg bg-red-50 p-2 text-red-500 hover:bg-red-100 transition-all"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 space-y-3">
                    <GraduationCap className="mx-auto h-8 w-8 text-gray-300" />
                    <p className="text-xs text-gray-400 font-medium">Anda belum mengikuti mata kuliah manapun.</p>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      )}

      {/* ======================================================= */}
      {/* 2. CREATOR DASHBOARD VIEW */}
      {/* ======================================================= */}
      {activeTab === 'creator' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          {/* A. FINANCIAL ANALYTICS HEADER */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Wallet Cash card */}
            <div className="rounded-2xl border border-brand-secondary/15 bg-white p-5 shadow-sm space-y-4 md:col-span-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Saldo NoteShare</span>
                <span className="rounded bg-sky-50 px-2 py-0.5 text-[9px] font-bold text-[#108EE9] uppercase tracking-wider flex items-center gap-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-pulse"></span> DANA Ready
                </span>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="text-2xl font-black text-brand-dark flex items-center gap-1.5">
                  <Wallet className="h-6 w-6 text-brand-primary" />
                  {formatRupiah(user.balance)}
                </h3>
                
                {/* Trigger Payout form collapse or quick button */}
                <a 
                  href="#dana-withdraw-card"
                  className="rounded-xl bg-[#108EE9] hover:bg-[#0c7ecf] text-white py-2 px-4 text-xs font-bold text-center shadow-md shadow-sky-600/10 transition-all active:scale-97 flex items-center justify-center gap-1"
                >
                  <ArrowUpRight className="h-4 w-4" />
                  Tarik ke DANA
                </a>
              </div>
            </div>

            {/* Total Downloads */}
            <div className="rounded-2xl border border-brand-secondary/15 bg-white p-5 shadow-sm space-y-3">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Unduhan Materi</span>
              <div className="space-y-1">
                <h3 className="text-2xl font-black text-brand-dark">{totalDownloads}x</h3>
                <p className="text-[10px] text-gray-400 font-semibold">{totalUploaded} Materi Terunggah</p>
              </div>
            </div>

            {/* Total Earnings */}
            <div className="rounded-2xl border border-brand-secondary/15 bg-white p-5 shadow-sm space-y-3">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Akumulasi Pendapatan</span>
              <div className="space-y-1">
                <h3 className="text-2xl font-black text-brand-primary">{formatRupiah(totalEarnings)}</h3>
                <p className="text-[10px] text-emerald-600 font-bold">{totalSalesCount} Catatan Terjual</p>
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* B. CREATOR MAIN AREA: UPLOAD & WALLET */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Note Upload Widget */}
              <div className="bg-white rounded-2xl border border-brand-secondary/15 p-6 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-gray-50 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-brand-dark flex items-center gap-1.5">
                      <PlusCircle className="h-4.5 w-4.5 text-brand-primary" />
                      Studio Unggah Catatan
                    </h3>
                    <p className="text-[10px] text-gray-400 mt-0.5">Bagikan ilmu Anda secara cuma-cuma atau tetapkan harga jual komersil.</p>
                  </div>
                  <button
                    onClick={() => setIsUploading(!isUploading)}
                    className="rounded-lg bg-brand-primary/10 border border-brand-primary/15 px-3 py-1.5 text-[10px] font-bold text-brand-primary hover:bg-brand-primary hover:text-white transition-all shadow-sm"
                  >
                    {isUploading ? 'Tutup Formulir' : 'Mulai Unggah'}
                  </button>
                </div>

                {isUploading ? (
                  <form onSubmit={handleUploadSubmit} className="space-y-4 animate-in fade-in duration-200">
                    
                    {/* Error Alerts */}
                    {formError && (
                      <div className="flex items-center gap-1.5 rounded-lg bg-red-50 p-3 text-[11px] font-semibold text-red-600 border border-red-200">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>{formError}</span>
                      </div>
                    )}

                    {/* Success Alert */}
                    {formSuccess && (
                      <div className="flex items-center gap-1.5 rounded-lg bg-emerald-50 p-3 text-[11px] font-semibold text-emerald-700 border border-emerald-250">
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                        <span>Catatan berhasil diunggah! Memperbarui database studio...</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Note Title */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Judul Ringkasan</label>
                        <input
                          type="text"
                          value={uploadTitle}
                          onChange={(e) => setUploadTitle(e.target.value)}
                          placeholder="Contoh: Rangkuman Mandiri Fisika Dasar I"
                          className="w-full rounded-xl border border-brand-secondary/20 bg-white px-3 py-2.5 text-xs font-semibold text-brand-dark focus:border-brand-primary focus:outline-none"
                        />
                      </div>

                      {/* Topic Tag */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Topik Bahasan</label>
                        <input
                          type="text"
                          value={uploadTopic}
                          onChange={(e) => setUploadTopic(e.target.value)}
                          placeholder="Contoh: Integral Lipat, Turunan, Dinamika Gaya"
                          className="w-full rounded-xl border border-brand-secondary/20 bg-white px-3 py-2.5 text-xs font-semibold text-brand-dark focus:border-brand-primary focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Course Selection autocomplete preview */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Kode Mata Kuliah</label>
                        <input
                          type="text"
                          value={uploadCourseCode}
                          onChange={(e) => setUploadCourseCode(e.target.value)}
                          placeholder="Contoh: SF141301"
                          className="w-full rounded-xl border border-brand-secondary/20 bg-white px-3 py-2.5 text-xs font-semibold text-brand-dark focus:border-brand-primary focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Nama Mata Kuliah</label>
                        <input
                          type="text"
                          value={uploadCourseName}
                          onChange={(e) => setUploadCourseName(e.target.value)}
                          placeholder="Contoh: Kalkulus I"
                          className="w-full rounded-xl border border-brand-secondary/20 bg-white px-3 py-2.5 text-xs font-semibold text-brand-dark focus:border-brand-primary focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Fakultas / TPB</label>
                        <select
                          value={uploadFaculty}
                          onChange={(e) => setUploadFaculty(e.target.value)}
                          className="w-full rounded-xl border border-brand-secondary/20 bg-white px-3 py-2.5 text-xs font-semibold text-brand-dark focus:border-brand-primary focus:outline-none"
                        >
                          <option value="FSAD">FSAD (Sains)</option>
                          <option value="FTEIC">FTEIC (Informatika)</option>
                          <option value="SKPB">SKPB (TPB Bersama)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Semester */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Semester Kelas</label>
                        <select
                          value={uploadSemester}
                          onChange={(e) => setUploadSemester(Number(e.target.value))}
                          className="w-full rounded-xl border border-brand-secondary/20 bg-white px-3 py-2.5 text-xs font-semibold text-brand-dark focus:border-brand-primary focus:outline-none"
                        >
                          <option value={1}>Semester 1 (Ganjil)</option>
                          <option value={2}>Semester 2 (Genap)</option>
                          <option value={3}>Semester 3</option>
                          <option value={4}>Semester 4</option>
                        </select>
                      </div>

                      {/* Lecturer */}
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Nama Dosen Pengampu</label>
                        <input
                          type="text"
                          value={uploadLecturer}
                          onChange={(e) => setUploadLecturer(e.target.value)}
                          placeholder="Nama lengkap beserta gelar..."
                          className="w-full rounded-xl border border-brand-secondary/20 bg-white px-3 py-2.5 text-xs font-semibold text-brand-dark focus:border-brand-primary focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Price Setup */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 border border-brand-secondary/10 p-4 rounded-xl">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Jenis Lisensi</label>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setUploadPriceType('free')}
                            className={`flex-1 rounded-lg py-2.5 text-xs font-bold transition-all border ${
                              uploadPriceType === 'free'
                                ? 'bg-emerald-50 border-emerald-350 text-emerald-800'
                                : 'bg-white border-brand-secondary/20 text-gray-500 hover:bg-gray-100'
                            }`}
                          >
                            FREE (Gratis)
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => setUploadPriceType('premium')}
                            className={`flex-1 rounded-lg py-2.5 text-xs font-bold transition-all border ${
                              uploadPriceType === 'premium'
                                ? 'bg-amber-50 border-amber-350 text-brand-accent'
                                : 'bg-white border-brand-secondary/20 text-gray-500 hover:bg-gray-100'
                            }`}
                          >
                            PREMIUM (Berbayar)
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Harga Jual (Rupiah)</label>
                        <div className="flex rounded-xl border border-brand-secondary/20 bg-white px-3 py-2 focus-within:border-brand-primary">
                          <span className="text-xs font-bold text-gray-400 self-center mr-1">Rp</span>
                          <input
                            type="number"
                            value={uploadPrice}
                            onChange={(e) => setUploadPrice(Number(e.target.value))}
                            disabled={uploadPriceType === 'free'}
                            className="w-full text-xs font-bold text-brand-dark bg-transparent border-0 p-0 focus:ring-0 focus:outline-none disabled:text-gray-300"
                          />
                        </div>
                        <span className="text-[8px] text-gray-400">Rekomendasi harga: Rp 10.000 - Rp 35.000</span>
                      </div>
                    </div>

                    {/* File Attachment */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Berkas Catatan Kuliah (PDF)</label>
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-brand-secondary/25 border-dashed rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100/50 transition-colors">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <UploadCloud className="w-8 h-8 text-brand-primary mb-1.5" />
                            {uploadFile ? (
                              <div className="text-center">
                                <p className="text-xs font-bold text-emerald-600 flex items-center justify-center gap-1">
                                  <FileText className="h-4 w-4" /> {uploadFile.name}
                                </p>
                                <p className="text-[9px] text-gray-400 mt-0.5">{(uploadFile.size / (1024 * 1024)).toFixed(2)} MB • Klik untuk ganti berkas</p>
                              </div>
                            ) : (
                              <>
                                <p className="text-xs text-gray-500 font-semibold">Tarik file di sini atau <span className="text-brand-primary font-bold">pilih dari browser</span></p>
                                <p className="text-[9px] text-gray-400 mt-1">Ukuran berkas PDF maksimal 10MB</p>
                              </>
                            )}
                          </div>
                          <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Deskripsi & Outline Rangkuman</label>
                      <textarea
                        rows={3}
                        value={uploadDescription}
                        onChange={(e) => setUploadDescription(e.target.value)}
                        placeholder="Berikan detail isi materi catatan. Uraikan sub-materi agar pembeli yakin catatannya rapi & terstruktur..."
                        className="w-full rounded-xl border border-brand-secondary/20 bg-white px-3 py-2.5 text-xs font-semibold text-brand-dark focus:border-brand-primary focus:outline-none placeholder:text-gray-300"
                      />
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => setIsUploading(false)}
                        className="rounded-xl border border-gray-200 bg-white py-2.5 px-4 text-xs font-bold text-gray-500 hover:bg-gray-100 transition-all"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="rounded-xl bg-brand-primary py-2.5 px-6 text-xs font-bold text-white shadow-md hover:bg-brand-primary-hover transition-all active:scale-97"
                      >
                        Unggah Catatan Kuliah
                      </button>
                    </div>

                  </form>
                ) : (
                  /* Creator Uploaded Notes Log List */
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Daftar Catatan Diunggah</h4>
                    
                    {uploadedNotes.length > 0 ? (
                      <div className="space-y-3">
                        {uploadedNotes.map((note) => (
                          <div
                            key={note.id}
                            className="flex border border-brand-secondary/10 rounded-xl bg-gray-50/30 p-3 items-center justify-between gap-4 hover:bg-gray-55 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600 border border-orange-100">
                                <BookOpen className="h-5 w-5" />
                              </div>
                              <div>
                                <h4
                                  onClick={() => router.push(`/notes/${note.id}`)}
                                  className="text-xs font-bold text-brand-dark hover:text-brand-primary cursor-pointer line-clamp-1"
                                >
                                  {note.title}
                                </h4>
                                <p className="text-[9px] text-gray-400 font-semibold mt-0.5">
                                  {note.courseCode} • {note.downloads} Unduhan • Lisensi: {note.isPremium ? formatRupiah(note.price) : 'Gratis'}
                                </p>
                              </div>
                            </div>
                            
                            <span className="text-[10px] text-gray-400 font-medium">{note.dateUploaded}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 text-center py-6 font-semibold">Studio kosong. Belum ada catatan kuliah yang Anda unggah.</p>
                    )}
                  </div>
                )}
              </div>

              {/* C. TRANSACTIONS LEDGER LEDGER */}
              <div className="bg-white rounded-2xl border border-brand-secondary/15 p-6 shadow-sm space-y-4 overflow-hidden">
                <div>
                  <h3 className="text-sm font-bold text-brand-dark">Riwayat Ledger Transaksi</h3>
                  <p className="text-[10px] text-gray-400 mt-0.5">Daftar lengkap transaksi saldo penjualan, pembelian catatan, dan pencairan dana.</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-[11px] text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-150 text-gray-400 font-bold uppercase tracking-wider text-[9px]">
                        <th className="py-3 px-2">Tanggal</th>
                        <th className="py-3 px-2">Deskripsi / Detail</th>
                        <th className="py-3 px-2">Jenis</th>
                        <th className="py-3 px-2">Status</th>
                        <th className="py-3 px-2 text-right">Jumlah</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {transactions.map((tx) => {
                        const isEarning = tx.type === 'sale';
                        const isExpense = tx.type === 'purchase' || tx.type === 'withdrawal';
                        
                        return (
                          <tr key={tx.id} className="hover:bg-gray-50/50">
                            <td className="py-3 px-2 font-medium text-gray-500 whitespace-nowrap">{tx.date}</td>
                            <td className="py-3 px-2 font-semibold text-brand-dark max-w-[200px] truncate">{tx.description}</td>
                            <td className="py-3 px-2 whitespace-nowrap">
                              <span className={`rounded-full px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-wide ${
                                tx.type === 'sale' ? 'bg-emerald-50 text-emerald-700' :
                                tx.type === 'purchase' ? 'bg-sky-50 text-sky-700' :
                                'bg-gray-100 text-gray-600'
                              }`}>
                                {tx.type}
                              </span>
                            </td>
                            <td className="py-3 px-2 whitespace-nowrap">
                              <span className="flex items-center gap-1 font-semibold text-emerald-600">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                                {tx.status}
                              </span>
                            </td>
                            <td className={`py-3 px-2 text-right font-bold whitespace-nowrap ${isEarning ? 'text-emerald-600' : 'text-gray-700'}`}>
                              {isEarning ? '+' : '-'}{formatRupiah(tx.amount)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* ========================================================= */}
            {/* C. CREATOR SIDEBAR AREA: DANA WITHDRAW simulation */}
            {/* ========================================================= */}
            <aside id="dana-withdraw-card" className="space-y-6">
              
              <div className="rounded-2xl border border-brand-secondary/15 bg-white p-5 shadow-sm space-y-5">
                
                {/* DANA Widget Payout header */}
                <div className="border-b border-gray-100 pb-3 flex justify-between items-center">
                  <h4 className="text-xs font-bold text-brand-dark flex items-center gap-1">
                    <ArrowDownLeft className="h-4.5 w-4.5 text-brand-primary" />
                    Pencairan ke DANA
                  </h4>
                  <span className="text-[10px] tracking-wide font-extrabold text-[#108EE9]">DANA</span>
                </div>

                <form onSubmit={handleWithdrawal} className="space-y-4">
                  {/* Status update widget */}
                  {withdrawStatus.show && (
                    <div className={`flex items-center gap-1.5 rounded-lg p-2.5 text-[10px] font-semibold border ${
                      withdrawStatus.success 
                        ? 'bg-emerald-50 border-emerald-150 text-emerald-700' 
                        : 'bg-red-50 border-red-150 text-red-650'
                    }`}>
                      {withdrawStatus.success ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
                      <span>{withdrawStatus.message}</span>
                    </div>
                  )}

                  {/* Input Phone number */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Nomor Ponsel DANA</label>
                    <input
                      type="text"
                      value={withdrawPhone}
                      onChange={(e) => setWithdrawPhone(e.target.value)}
                      placeholder="081234567890"
                      className="w-full rounded-xl border border-brand-secondary/20 bg-white px-3 py-2 text-xs font-bold text-brand-dark focus:border-brand-primary focus:outline-none"
                    />
                  </div>

                  {/* Input Amount */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Nominal Penarikan (Rp)</label>
                    <div className="flex rounded-xl border border-brand-secondary/20 bg-white px-3 py-2 focus-within:border-brand-primary">
                      <span className="text-xs font-bold text-gray-400 self-center mr-1">Rp</span>
                      <input
                        type="number"
                        step={1000}
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                        className="w-full text-xs font-bold text-brand-dark bg-transparent border-0 p-0 focus:ring-0 focus:outline-none"
                      />
                    </div>
                    <span className="text-[8px] text-gray-400 block mt-0.5">Saldo saat ini: {formatRupiah(user.balance)}</span>
                  </div>

                  {/* Submit withdrawal */}
                  <button
                    type="submit"
                    disabled={withdrawLoading || user.balance < 10000}
                    className="w-full rounded-xl bg-[#108EE9] hover:bg-[#0c7ecf] py-3 text-xs font-bold text-white shadow-md disabled:bg-gray-100 disabled:text-gray-300 disabled:shadow-none transition-all active:scale-97 flex items-center justify-center gap-1.5"
                  >
                    {withdrawLoading ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin text-gray-400" />
                        Memproses Transfer...
                      </>
                    ) : (
                      <>
                        <ArrowUpRight className="h-4 w-4" />
                        Cairkan ke Saldo DANA
                      </>
                    )}
                  </button>

                  <div className="text-center">
                    <p className="text-[8px] text-gray-400">Proses pencairan dana e-wallet disimulasikan selesai instan.</p>
                  </div>
                </form>
              </div>

              {/* Creator FAQ banner */}
              <div className="rounded-2xl border border-brand-secondary/10 bg-brand-light p-4 text-[10px] text-gray-500 space-y-2 border-l-4 border-l-brand-primary">
                <p className="font-bold text-brand-dark uppercase tracking-wider">Peraturan Lisensi Creator</p>
                <p className="leading-relaxed">Mahasiswa dilarang mengunggah dokumen berhak-cipta (copyright) milik dosen tanpa persetujuan, atau file PDF milik perpustakaan ITS. NoteShare mengutamakan catatan buatan mandiri berhak pakai pribadi.</p>
              </div>
            </aside>

          </div>
        </div>
      )}

    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={
      <div className="mx-auto max-w-7xl px-4 py-20 text-center text-xs font-semibold text-gray-400 flex items-center justify-center gap-2">
        <RefreshCw className="h-4 w-4 animate-spin text-brand-primary" />
        Memuat Halaman Dashboard...
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
