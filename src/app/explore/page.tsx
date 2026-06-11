'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, SlidersHorizontal, BookOpen, Star, Eye, Download, X, Grid, List, RefreshCw } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Note } from '@/types';
import { MOCK_COURSES } from '@/mockData';

function ExploreContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { notes } = useApp();

  // URL states
  const initialQuery = searchParams.get('q') || '';
  const initialFaculty = searchParams.get('faculty') || 'All';
  const initialCourse = searchParams.get('course') || 'All';
  const initialPriceType = searchParams.get('priceType') || 'All'; // 'All' | 'Free' | 'Premium'
  const initialSemester = searchParams.get('semester') || 'All';

  // React states
  const [searchVal, setSearchVal] = useState(initialQuery);
  const [selectedFaculty, setSelectedFaculty] = useState(initialFaculty);
  const [selectedCourse, setSelectedCourse] = useState(initialCourse);
  const [priceFilter, setPriceFilter] = useState(initialPriceType);
  const [semesterFilter, setSemesterFilter] = useState(initialSemester);
  const [lecturerSearch, setLecturerSearch] = useState('');
  
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'newest'>('popular');
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Sync state from query parameters on load
  useEffect(() => {
    setSearchVal(searchParams.get('q') || '');
    setSelectedFaculty(searchParams.get('faculty') || 'All');
    setSelectedCourse(searchParams.get('course') || 'All');
    setPriceFilter(searchParams.get('priceType') || 'All');
    setSemesterFilter(searchParams.get('semester') || 'All');
  }, [searchParams]);

  // Handle filtering
  useEffect(() => {
    setIsLoading(true);
    const delayTimer = setTimeout(() => {
      let result = [...notes];

      // 1. Keyword search
      if (searchVal.trim()) {
        const query = searchVal.toLowerCase();
        result = result.filter(
          (note) =>
            note.title.toLowerCase().includes(query) ||
            note.courseName.toLowerCase().includes(query) ||
            note.courseCode.toLowerCase().includes(query) ||
            note.topic.toLowerCase().includes(query)
        );
      }

      // 2. Faculty
      if (selectedFaculty !== 'All') {
        result = result.filter((note) => note.faculty === selectedFaculty);
      }

      // 3. Course
      if (selectedCourse !== 'All') {
        result = result.filter((note) => note.courseName === selectedCourse);
      }

      // 4. Semester
      if (semesterFilter !== 'All') {
        result = result.filter((note) => note.semester === parseInt(semesterFilter));
      }

      // 5. Price type
      if (priceFilter === 'Free') {
        result = result.filter((note) => !note.isPremium);
      } else if (priceFilter === 'Premium') {
        result = result.filter((note) => note.isPremium);
      }

      // 6. Lecturer
      if (lecturerSearch.trim()) {
        result = result.filter((note) =>
          note.lecturer.toLowerCase().includes(lecturerSearch.toLowerCase())
        );
      }

      // Sorting
      if (sortBy === 'popular') {
        result.sort((a, b) => b.downloads - a.downloads);
      } else if (sortBy === 'rating') {
        result.sort((a, b) => b.rating - a.rating);
      } else if (sortBy === 'newest') {
        result.sort((a, b) => b.dateUploaded.localeCompare(a.dateUploaded));
      }

      setFilteredNotes(result);
      setIsLoading(false);
    }, 450); // Simulate API network roundtrip latency

    return () => clearTimeout(delayTimer);
  }, [searchVal, selectedFaculty, selectedCourse, priceFilter, semesterFilter, lecturerSearch, sortBy, notes]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrl({ q: searchVal });
  };

  const updateUrl = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, val]) => {
      if (val === 'All' || val === '') {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });
    router.push(`/explore?${params.toString()}`);
  };

  const resetFilters = () => {
    setSearchVal('');
    setSelectedFaculty('All');
    setSelectedCourse('All');
    setPriceFilter('All');
    setSemesterFilter('All');
    setLecturerSearch('');
    router.push('/explore');
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

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Search Header Banner */}
      <div className="mb-8 space-y-4">
        <h1 className="text-2xl font-extrabold text-brand-dark sm:text-3xl">Jelajahi Catatan Akademik</h1>
        <p className="text-xs text-gray-500">Gunakan filter untuk mempersempit pencarian materi TPB SKPB atau departemen ITS.</p>
        
        {/* Mobile Filter Trigger & Search Bar */}
        <div className="flex gap-2">
          <form onSubmit={handleSearchSubmit} className="flex flex-1 items-center rounded-xl bg-white px-3 py-2.5 shadow-sm border border-brand-secondary/20 focus-within:border-brand-primary">
            <Search className="h-4 w-4 text-brand-primary mr-2.5" />
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Cari kata kunci: Limit, Dinamika Rotasi, C++..."
              className="w-full text-xs font-semibold text-brand-dark bg-transparent border-0 p-0 focus:ring-0 focus:outline-none placeholder:text-gray-400"
            />
          </form>
          
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-brand-secondary/35 bg-white px-4 py-2.5 text-xs font-bold text-brand-dark md:hidden hover:bg-gray-50 active:scale-95 shadow-sm"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filter
          </button>
        </div>
      </div>

      <div className="flex gap-8 items-start">
        
        {/* ================= LEFT SIDEBAR FILTER (DESKTOP) ================= */}
        <aside className="hidden md:block w-64 shrink-0 rounded-2xl border border-brand-secondary/15 bg-white p-5 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-dark flex items-center gap-1.5">
              <SlidersHorizontal className="h-4 w-4 text-brand-primary" />
              Advanced Filters
            </h3>
            <button
              onClick={resetFilters}
              className="text-[10px] font-bold text-brand-primary hover:text-brand-accent transition-colors"
            >
              Reset
            </button>
          </div>

          {/* Filter 1: Faculty */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Fakultas / TPB</label>
            <select
              value={selectedFaculty}
              onChange={(e) => {
                setSelectedFaculty(e.target.value);
                updateUrl({ faculty: e.target.value, course: 'All' });
              }}
              className="w-full rounded-lg border border-brand-secondary/20 bg-white px-2.5 py-2 text-xs font-medium text-brand-dark focus:border-brand-primary focus:outline-none"
            >
              <option value="All">Semua Fakultas</option>
              <option value="SKPB">SKPB (TPB Bersama)</option>
              <option value="FTEIC">FTEIC (Elektro/Informatika)</option>
              <option value="FTIB">FTIB (Industri/Sistem)</option>
              <option value="FSAD">FSAD (Sains/Data)</option>
            </select>
          </div>

          {/* Filter 2: Course Selection */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Mata Kuliah</label>
            <select
              value={selectedCourse}
              onChange={(e) => {
                setSelectedCourse(e.target.value);
                updateUrl({ course: e.target.value });
              }}
              className="w-full rounded-lg border border-brand-secondary/20 bg-white px-2.5 py-2 text-xs font-medium text-brand-dark focus:border-brand-primary focus:outline-none"
            >
              <option value="All">Semua Mata Kuliah</option>
              {MOCK_COURSES.filter(
                (c) => selectedFaculty === 'All' || c.faculty === selectedFaculty
              ).map((course) => (
                <option key={course.id} value={course.name}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filter 3: Semester */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Semester</label>
            <select
              value={semesterFilter}
              onChange={(e) => {
                setSemesterFilter(e.target.value);
                updateUrl({ semester: e.target.value });
              }}
              className="w-full rounded-lg border border-brand-secondary/20 bg-white px-2.5 py-2 text-xs font-medium text-brand-dark focus:border-brand-primary focus:outline-none"
            >
              <option value="All">Semua Semester</option>
              <option value="1">Semester 1</option>
              <option value="2">Semester 2</option>
              <option value="3">Semester 3</option>
              <option value="4">Semester 4</option>
            </select>
          </div>

          {/* Filter 4: Price Type */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Tipe Harga</label>
            <div className="grid grid-cols-3 gap-1 bg-gray-50 p-1 rounded-lg border border-brand-secondary/10">
              {['All', 'Free', 'Premium'].map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setPriceFilter(type);
                    updateUrl({ priceType: type });
                  }}
                  className={`rounded py-1 text-[10px] font-bold transition-all ${
                    priceFilter === type
                      ? 'bg-brand-primary text-brand-light shadow-sm'
                      : 'text-gray-500 hover:bg-gray-150'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Filter 5: Lecturer Search */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Dosen Pengampu</label>
            <input
              type="text"
              value={lecturerSearch}
              onChange={(e) => setLecturerSearch(e.target.value)}
              placeholder="Nama dosen..."
              className="w-full rounded-lg border border-brand-secondary/20 bg-white px-2.5 py-2 text-xs font-medium text-brand-dark focus:border-brand-primary focus:outline-none placeholder:text-gray-300"
            />
          </div>
        </aside>

        {/* ================= RIGHT RESULTS GRID ================= */}
        <section className="flex-1 space-y-6">
          {/* Sorting / Results Count Bar */}
          <div className="flex items-center justify-between border-b border-brand-secondary/15 pb-4">
            <span className="text-xs font-bold text-gray-500">
              {isLoading ? 'Mencari...' : `${filteredNotes.length} Catatan Ditemukan`}
            </span>
            
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Urutkan:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="rounded-lg border border-brand-secondary/10 bg-white px-2.5 py-1.5 text-xs font-medium text-brand-dark focus:outline-none"
              >
                <option value="popular">Paling Populer</option>
                <option value="rating">Rating Tertinggi</option>
                <option value="newest">Terbaru</option>
              </select>
            </div>
          </div>

          {/* RESULTS */}
          {isLoading ? (
            /* Skeleton Loading Grid */
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((idx) => (
                <div key={idx} className="flex flex-col overflow-hidden rounded-2xl border border-brand-secondary/10 bg-white h-[360px] shadow-sm select-none">
                  <div className="shimmer h-[160px] w-full"></div>
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="shimmer h-4 w-3/4 rounded"></div>
                      <div className="shimmer h-3 w-full rounded"></div>
                      <div className="shimmer h-3 w-5/6 rounded"></div>
                    </div>
                    <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                      <div className="flex items-center gap-1.5">
                        <div className="shimmer h-6 w-6 rounded-full"></div>
                        <div className="shimmer h-3 w-12 rounded"></div>
                      </div>
                      <div className="shimmer h-3 w-10 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredNotes.length > 0 ? (
            /* Note Cards Grid */
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredNotes.map((note) => (
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
                      <span className="text-[10px] text-gray-400 font-medium">Harga:</span>
                      <span className="text-xs font-bold text-brand-primary">
                        {formatRupiah(note.price)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="rounded-2xl border border-dashed border-brand-secondary/30 bg-white p-12 text-center space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-secondary/10 text-brand-primary">
                <Search className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-brand-dark">Tidak Ada Catatan Ditemukan</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Cobalah mengganti filter pencarian Anda atau reset kembali untuk melihat semua data materi kuliah.
                </p>
              </div>
              <button
                onClick={resetFilters}
                className="rounded-lg bg-brand-primary px-4 py-2 text-xs font-bold text-brand-light hover:bg-brand-primary-hover shadow-sm transition-all"
              >
                Reset Semua Filter
              </button>
            </div>
          )}
        </section>
      </div>

      {/* ================= MOBILE FILTER OVERLAY DIALOG ================= */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end md:hidden">
          <div className="w-full max-w-[320px] bg-white h-full flex flex-col p-6 shadow-2xl animate-in slide-in-from-right duration-250">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-6">
              <h3 className="text-sm font-bold text-brand-dark flex items-center gap-2">
                <SlidersHorizontal className="h-4.5 w-4.5 text-brand-primary" />
                Filter Catatan
              </h3>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="rounded-full bg-gray-100 p-1 hover:bg-gray-250 transition-colors"
              >
                <X className="h-4.5 w-4.5 text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 pr-1">
              {/* Faculty Filter */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Fakultas / TPB</label>
                <select
                  value={selectedFaculty}
                  onChange={(e) => {
                    setSelectedFaculty(e.target.value);
                    updateUrl({ faculty: e.target.value, course: 'All' });
                  }}
                  className="w-full rounded-lg border border-brand-secondary/20 bg-white px-2.5 py-2 text-xs font-medium text-brand-dark focus:outline-none"
                >
                  <option value="All">Semua Fakultas</option>
                  <option value="SKPB">SKPB (TPB Bersama)</option>
                  <option value="FTEIC">FTEIC (Elektro/Informatika)</option>
                  <option value="FTIB">FTIB (Industri/Sistem)</option>
                  <option value="FSAD">FSAD (Sains/Data)</option>
                </select>
              </div>

              {/* Course Filter */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Mata Kuliah</label>
                <select
                  value={selectedCourse}
                  onChange={(e) => {
                    setSelectedCourse(e.target.value);
                    updateUrl({ course: e.target.value });
                  }}
                  className="w-full rounded-lg border border-brand-secondary/20 bg-white px-2.5 py-2 text-xs font-medium text-brand-dark focus:outline-none"
                >
                  <option value="All">Semua Mata Kuliah</option>
                  {MOCK_COURSES.filter(
                    (c) => selectedFaculty === 'All' || c.faculty === selectedFaculty
                  ).map((course) => (
                    <option key={course.id} value={course.name}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Semester Filter */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Semester</label>
                <select
                  value={semesterFilter}
                  onChange={(e) => {
                    setSemesterFilter(e.target.value);
                    updateUrl({ semester: e.target.value });
                  }}
                  className="w-full rounded-lg border border-brand-secondary/20 bg-white px-2.5 py-2 text-xs font-medium text-brand-dark focus:outline-none"
                >
                  <option value="All">Semua Semester</option>
                  <option value="1">Semester 1</option>
                  <option value="2">Semester 2</option>
                  <option value="3">Semester 3</option>
                  <option value="4">Semester 4</option>
                </select>
              </div>

              {/* Price Type */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Tipe Harga</label>
                <div className="grid grid-cols-3 gap-1 bg-gray-50 p-1 rounded-lg border border-brand-secondary/10">
                  {['All', 'Free', 'Premium'].map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        setPriceFilter(type);
                        updateUrl({ priceType: type });
                      }}
                      className={`rounded py-1 text-[10px] font-bold transition-all ${
                        priceFilter === type
                          ? 'bg-brand-primary text-brand-light shadow-sm'
                          : 'text-gray-500 hover:bg-gray-150'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lecturer Search */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Dosen Pengampu</label>
                <input
                  type="text"
                  value={lecturerSearch}
                  onChange={(e) => setLecturerSearch(e.target.value)}
                  placeholder="Nama dosen..."
                  className="w-full rounded-lg border border-brand-secondary/20 bg-white px-2.5 py-2 text-xs font-medium text-brand-dark focus:outline-none"
                />
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 mt-6 flex gap-2">
              <button
                onClick={resetFilters}
                className="w-1/2 rounded-lg border border-gray-200 bg-white py-2.5 text-xs font-bold text-gray-500 hover:bg-gray-50"
              >
                Reset
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-1/2 rounded-lg bg-brand-primary py-2.5 text-xs font-bold text-white hover:bg-brand-primary-hover shadow-sm"
              >
                Terapkan
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function Explore() {
  return (
    <Suspense fallback={
      <div className="mx-auto max-w-7xl px-4 py-20 text-center text-xs font-semibold text-gray-400 flex items-center justify-center gap-2">
        <RefreshCw className="h-4 w-4 animate-spin text-brand-primary" />
        Memuat Halaman Eksplorasi...
      </div>
    }>
      <ExploreContent />
    </Suspense>
  );
}
