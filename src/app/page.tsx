'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, GraduationCap, DollarSign, Users, Award, ChevronRight, Star, Eye, Download, BookOpen } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { MOCK_COURSES } from '@/mockData';

export default function Home() {
  const router = useRouter();
  const { notes } = useApp();
  const [localSearch, setLocalSearch] = useState('');
  const [suggestions, setSuggestions] = useState<{ name: string; code: string }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);

  // Autocomplete logic
  useEffect(() => {
    if (!localSearch.trim()) {
      setSuggestions([]);
      return;
    }

    const filtered = MOCK_COURSES.filter(
      (course) =>
        course.name.toLowerCase().includes(localSearch.toLowerCase()) ||
        course.code.toLowerCase().includes(localSearch.toLowerCase())
    ).map(c => ({ name: c.name, code: c.code }));

    setSuggestions(filtered.slice(0, 5));
  }, [localSearch]);

  // Click outside autocomplete to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      router.push(`/explore?q=${encodeURIComponent(localSearch.trim())}`);
    } else {
      router.push('/explore');
    }
  };

  const handleSuggestionClick = (courseName: string) => {
    router.push(`/explore?course=${encodeURIComponent(courseName)}`);
  };

  const formatRupiah = (amount: number) => {
    if (amount === 0) return 'FREE';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Pre-seeded creators leaderboard
  const topCreators = [
    {
      name: 'Bagus Prasetyo',
      nrp: '5025211002',
      dept: 'Teknik Informatika',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bagus',
      notesCount: 8,
      rating: 4.8,
      downloads: 1352
    },
    {
      name: 'Dewi Lestari',
      nrp: '5009211045',
      dept: 'Teknik Kimia',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dewi',
      notesCount: 5,
      rating: 4.9,
      downloads: 870
    },
    {
      name: 'Achmad Zulkarnain',
      nrp: '5025221008',
      dept: 'Teknik Informatika',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zul',
      notesCount: 12,
      rating: 4.7,
      downloads: 1205
    }
  ];

  return (
    <div className="space-y-20 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-secondary/10 via-brand-light to-transparent py-20 lg:py-28">
        {/* Subtle decorative mesh background */}
        <div className="absolute inset-0 -z-10 opacity-30">
          <div className="absolute top-1/4 left-1/10 h-96 w-96 rounded-full bg-brand-secondary/30 blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/10 h-96 w-96 rounded-full bg-brand-accent/20 blur-3xl"></div>
        </div>

        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8 space-y-8">
          {/* Header Badging */}
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-primary/15 bg-white px-3 py-1.5 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-brand-accent"></span>
            <span className="text-xs font-semibold text-brand-dark uppercase tracking-wider">
              Platform Akademik Terpercaya ITS
            </span>
          </div>

          {/* Hero Heading */}
          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="text-4xl font-extrabold tracking-tight text-brand-dark sm:text-5xl md:text-6xl leading-[1.1]">
              Marketplace Catatan Kuliah <br />
              <span className="bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">
                Eksklusif Mahasiswa ITS
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-base text-gray-600 sm:text-lg">
              Temukan ribuan rangkuman kuliah terstruktur, cheat sheet UTS/UAS, dan diktat praktis yang dibuat langsung oleh sesama mahasiswa ITS sesuai kurikulum jurusanmu.
            </p>
          </div>

          {/* Interactive Search Bar & Autocomplete */}
          <div ref={suggestionRef} className="mx-auto max-w-2xl relative">
            <form onSubmit={handleSearchSubmit} className="flex items-center rounded-2xl bg-white p-2 shadow-xl border border-brand-secondary/25 focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-brand-primary/10 transition-all">
              <div className="flex flex-1 items-center px-3">
                <Search className="h-5 w-5 text-brand-primary mr-3 shrink-0" />
                <input
                  type="text"
                  value={localSearch}
                  onChange={(e) => {
                    setLocalSearch(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Cari materi kuliah: 'Kalkulus I', 'Fisika Dasar', 'Struktur Data'..."
                  className="w-full text-sm font-medium text-brand-dark bg-transparent border-0 p-0 focus:ring-0 focus:outline-none placeholder:text-gray-400"
                />
              </div>
              <button
                type="submit"
                className="rounded-xl bg-brand-primary px-6 py-3 text-xs font-bold text-brand-light shadow-md hover:bg-brand-primary-hover transition-all active:scale-97"
              >
                Cari Catatan
              </button>
            </form>

            {/* Autocomplete Dropdown list */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 rounded-2xl border border-brand-secondary/20 bg-white p-2 shadow-2xl z-30 text-left animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3.5 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50">
                  Rekomendasi Kelas SKPB & Jurusan
                </div>
                <div className="divide-y divide-gray-50 mt-1">
                  {suggestions.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(item.name)}
                      className="flex w-full items-center justify-between rounded-lg px-3.5 py-2.5 text-left text-xs font-medium text-brand-dark hover:bg-brand-secondary/10 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-brand-accent" />
                        <span>{item.name}</span>
                      </div>
                      <span className="rounded bg-brand-secondary/15 px-2 py-0.5 text-[9px] font-bold text-brand-primary">
                        {item.code}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Search Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
            <span className="text-xs text-gray-500 font-semibold">Sering dicari:</span>
            {['Kalkulus I', 'Fisika Dasar I', 'Kimia Dasar I', 'Struktur Data'].map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestionClick(chip)}
                className="rounded-full bg-white border border-brand-secondary/20 px-3.5 py-1.5 text-xs font-semibold text-brand-dark hover:border-brand-primary hover:text-brand-primary transition-all active:scale-95 shadow-sm"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. VALUE PROPOSITIONS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-2xl font-extrabold text-brand-dark sm:text-3xl">
            Kenapa Menggunakan NoteShare?
          </h2>
          <p className="text-xs text-gray-500 max-w-lg mx-auto">
            Platform penunjang akademik mahasiswa ITS dengan benefit terlengkap untuk konsumen maupun kreator.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Prop 1 */}
          <div className="group rounded-2xl border border-brand-secondary/15 bg-white p-6 shadow-sm hover:border-brand-primary/30 hover:shadow-md transition-all duration-300">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-brand-accent group-hover:scale-110 transition-transform">
              <GraduationCap className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-sm font-bold text-brand-dark">Platform Eksklusif ITS</h3>
            <p className="mt-2 text-xs text-gray-500 leading-relaxed">
              Catatan disesuaikan secara spesifik dengan kurikulum departemen & silabus mata kuliah yang diajarkan oleh dosen ITS.
            </p>
          </div>

          {/* Prop 2 */}
          <div className="group rounded-2xl border border-brand-secondary/15 bg-white p-6 shadow-sm hover:border-brand-primary/30 hover:shadow-md transition-all duration-300">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600 group-hover:scale-110 transition-transform">
              <Award className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-sm font-bold text-brand-dark">Struktur Catatan Rapi</h3>
            <p className="mt-2 text-xs text-gray-500 leading-relaxed">
              Dilengkapi dengan preview dokumen gratis, penilaian bintang dari rekan sejawat, dan deskripsi detail sebelum mengunduh.
            </p>
          </div>

          {/* Prop 3 */}
          <div className="group rounded-2xl border border-brand-secondary/15 bg-white p-6 shadow-sm hover:border-brand-primary/30 hover:shadow-md transition-all duration-300">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-sm font-bold text-brand-dark">Kolaboratif & Interaktif</h3>
            <p className="mt-2 text-xs text-gray-500 leading-relaxed">
              Tulis ulasan, berikan rating bintang, dan tanyakan materi secara langsung melalui kolom tanggapan peer-review.
            </p>
          </div>

          {/* Prop 4 */}
          <div className="group rounded-2xl border border-brand-secondary/15 bg-white p-6 shadow-sm hover:border-brand-primary/30 hover:shadow-md transition-all duration-300">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600 group-hover:scale-110 transition-transform">
              <DollarSign className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-sm font-bold text-brand-dark">Monetisasi Hasil Belajar</h3>
            <p className="mt-2 text-xs text-gray-500 leading-relaxed">
              Unggah catatan bermutu milikmu, tetapkan harga premium, dan cairkan penghasilanmu secara instan ke e-wallet DANA.
            </p>
          </div>
        </div>
      </section>

      {/* 3. TRENDING NOTES SECTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-brand-secondary/15 pb-5 mb-8">
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-brand-dark">Catatan Terpopuler Semester Ini</h2>
            <p className="text-xs text-gray-500">Kumpulan materi terpopuler dari kelas SKPB (Kalkulus & Fisika) mahasiswa baru.</p>
          </div>
          <button
            onClick={() => router.push('/explore')}
            className="flex items-center gap-1 text-xs font-bold text-brand-primary hover:text-brand-accent transition-colors"
          >
            Lihat Semua Materi
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {notes.slice(0, 3).map((note) => (
            <div
              key={note.id}
              onClick={() => router.push(`/notes/${note.id}`)}
              className="flex flex-col overflow-hidden rounded-2xl border border-brand-secondary/15 bg-white hover:border-brand-primary/25 hover:shadow-lg transition-all duration-300 cursor-pointer group"
            >
              {/* Note Thumbnail Mock */}
              <div className="relative aspect-[4/2.5] bg-gradient-to-br from-brand-secondary/20 to-brand-primary/5 p-4 flex flex-col justify-between select-none">
                <span className="self-start rounded-full bg-brand-primary px-2.5 py-0.5 text-[9px] font-bold text-brand-light uppercase tracking-wider">
                  {note.courseCode}
                </span>
                
                {/* Visual file paper stacked representation */}
                <div className="self-center flex flex-col items-center justify-center p-3 w-11/12 bg-white rounded-lg shadow-sm border border-brand-secondary/10 group-hover:scale-102 transition-transform duration-300">
                  <BookOpen className="h-5 w-5 text-brand-primary mb-1" />
                  <p className="text-[10px] font-bold text-brand-dark text-center truncate w-full">{note.courseName}</p>
                  <p className="text-[8px] text-gray-400 truncate w-full text-center">{note.topic}</p>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[9px] text-gray-500 font-semibold">{note.faculty} Department</span>
                  <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                    note.isPremium 
                      ? 'bg-amber-100 text-brand-accent' 
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {note.isPremium ? 'PREMIUM' : 'FREE'}
                  </span>
                </div>
              </div>

              {/* Description Panel */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-brand-dark group-hover:text-brand-primary transition-colors line-clamp-2">
                    {note.title}
                  </h3>
                  <p className="text-[11px] text-gray-500 line-clamp-2">{note.description}</p>
                </div>

                {/* Footer Metadata */}
                <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <img src={note.uploaderAvatar} alt={note.uploaderName} className="h-6 w-6 rounded-full border border-brand-secondary/20" />
                    <span className="text-[10px] font-medium text-gray-600 truncate max-w-[80px]">{note.uploaderName}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-gray-400">
                    <span className="flex items-center gap-0.5 text-[10px] font-semibold">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      {note.rating}
                    </span>
                    <span className="flex items-center gap-0.5 text-[10px]">
                      <Download className="h-3 w-3" />
                      {note.downloads}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-gray-50">
                  <span className="text-[10px] text-gray-400">Harga:</span>
                  <span className="text-xs font-bold text-brand-primary">
                    {formatRupiah(note.price)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. CREATOR LEADERBOARD */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-brand-secondary/15 bg-white p-8 sm:p-10 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 h-40 w-40 bg-brand-secondary/5 rounded-bl-full -z-10"></div>
          
          <div className="text-center space-y-2 mb-8">
            <h2 className="text-xl font-extrabold text-brand-dark sm:text-2xl">
              Papan Peringkat Kreator Teraktif ITS
            </h2>
            <p className="text-xs text-gray-500">Mahasiswa inspiratif dengan jumlah unduhan materi terbanyak semester ini.</p>
          </div>

          <div className="space-y-4">
            {topCreators.map((creator, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-brand-secondary/10 bg-brand-light/40 hover:bg-brand-light/80 p-4 transition-all"
              >
                <div className="flex items-center gap-3">
                  {/* Placement Trophy Badge */}
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    index === 0 ? 'bg-amber-100 text-brand-accent' :
                    index === 1 ? 'bg-gray-100 text-gray-600' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {index + 1}
                  </span>
                  
                  <img src={creator.avatar} alt={creator.name} className="h-10 w-10 rounded-full border border-brand-secondary/10 shadow-sm" />
                  
                  <div>
                    <h4 className="text-sm font-bold text-brand-dark">{creator.name}</h4>
                    <p className="text-[10px] text-gray-500">{creator.dept} ITS • NRP {creator.nrp.substring(0, 4)}...</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 sm:gap-10 text-center">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Materi</p>
                    <p className="text-sm font-bold text-brand-dark">{creator.notesCount}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Rating</p>
                    <p className="text-sm font-bold text-brand-dark flex items-center justify-center gap-0.5">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      {creator.rating}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Unduhan</p>
                    <p className="text-sm font-bold text-brand-primary">{creator.downloads}x</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center pt-2">
            <p className="text-xs text-gray-500">
              Punya catatan kuliah rapi yang bisa membantu maba? 
              <button
                onClick={() => router.push('/dashboard?view=creator&action=upload')}
                className="ml-1 text-brand-primary font-bold hover:underline transition-all"
              >
                Mulai unggah & dapatkan penghasilan!
              </button>
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
