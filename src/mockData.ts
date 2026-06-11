import { Note, User, Transaction } from './types';

export const MOCK_COURSES = [
  { id: 'SKPB-KAL1', code: 'SF141301', name: 'Kalkulus I', department: 'SKPB', faculty: 'FSAD' },
  { id: 'SKPB-FIS1', code: 'SF141303', name: 'Fisika Dasar I', department: 'SKPB', faculty: 'FSAD' },
  { id: 'SKPB-KIM1', code: 'SF141305', name: 'Kimia Dasar I', department: 'SKPB', faculty: 'FSAD' },
  { id: 'SKPB-KAL2', code: 'SF141302', name: 'Kalkulus II', department: 'SKPB', faculty: 'FSAD' },
  { id: 'SKPB-FIS2', code: 'SF141304', name: 'Fisika Dasar II', department: 'SKPB', faculty: 'FSAD' },
  { id: 'TC-PROGDAS', code: 'IF184101', name: 'Pemrograman Dasar', department: 'Teknik Informatika', faculty: 'FTEIC' },
  { id: 'TC-STRUDAT', code: 'IF184202', name: 'Struktur Data', department: 'Teknik Informatika', faculty: 'FTEIC' },
  { id: 'TC-ALIN', code: 'IF184301', name: 'Aljabar Linear', department: 'Teknik Informatika', faculty: 'FTEIC' },
  { id: 'IS-SBD', code: 'IS184302', name: 'Sistem Basis Data', department: 'Sistem Informasi', faculty: 'FTEIC' },
  { id: 'TI-ORG', code: 'TI184201', name: 'Organisasi & Manajemen Industri', department: 'Teknik Industri', faculty: 'FTIB' }
];

export const MOCK_NOTES: Note[] = [
  {
    id: 'note-1',
    title: 'Diktat Lengkap Kalkulus I (Limit, Turunan, & Integral)',
    courseCode: 'SF141301',
    courseName: 'Kalkulus I',
    topic: 'Kalkulus SKPB Semester 1',
    lecturer: 'Drs. Lukman Hanafi, M.Sc.',
    semester: 1,
    faculty: 'FSAD',
    uploaderName: 'Bagus Prasetyo',
    uploaderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bagus',
    uploaderNrp: '5025211002',
    rating: 4.8,
    reviewsCount: 12,
    price: 0,
    isPremium: false,
    views: 1250,
    downloads: 840,
    dateUploaded: '2025-09-15',
    pdfUrl: '/files/kalkulus-1-complete.pdf',
    description: 'Catatan komprehensif Kalkulus I untuk persiapan UTS dan UAS. Berisi teori singkat, contoh soal bertahap, dan pembahasan latihan soal sub-bab Limit, Aturan Rantai Turunan, Aplikasi Turunan (Nilai Ekstrim), hingga Integral Tentu & Tak Tentu. Sangat cocok untuk anak TPB/SKPB ITS!',
    previewPages: [
      'Halaman 1: Konsep Limit Fungsi & Asimtot. Teorema Apit dibahas secara visual.',
      'Halaman 2: Aturan Turunan (Product Rule, Quotient Rule, Chain Rule) & Turunan Implisit.',
      'Halaman 3: Aplikasi Turunan: Teorema Nilai Rata-rata, Kemonotonan & Kecekungan Kurva.',
      'Halaman 4: Pengantar Integral: Jumlah Riemann & Teorema Dasar Kalkulus.'
    ],
    reviews: [
      { id: 'rev-1-1', userName: 'Ahmad Farid', userNrp: '5022231002', rating: 5, comment: 'Penjelasannya gampang dipahami dibanding slide dosen. Latihan soal integralnya keluar pas UTS kemaren!', date: '2025-10-12' },
      { id: 'rev-1-2', userName: 'Siti Aminah', userNrp: '5001231015', rating: 4, comment: 'Bagus banget catatannya rapi, ada warna-warni penjelasannya jadi ga bosen bacanya.', date: '2025-10-20' },
      { id: 'rev-1-3', userName: 'Rian Hidayat', userNrp: '5025231099', rating: 5, comment: 'Penyelamat pas H-1 UAS Kalkulus! Makasih banyak mas Bagus!', date: '2025-12-05' }
    ]
  },
  {
    id: 'note-2',
    title: 'Cheat Sheet Fisika Dasar I - Kinematika s/d Dinamika Rotasi',
    courseCode: 'SF141303',
    courseName: 'Fisika Dasar I',
    topic: 'Materi UTS Fisika Dasar I',
    lecturer: 'Prof. Dr. Ir. H. Adi Soeprijanto, M.T.',
    semester: 1,
    faculty: 'FSAD',
    uploaderName: 'Dewi Lestari',
    uploaderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dewi',
    uploaderNrp: '5009211045',
    rating: 4.9,
    reviewsCount: 8,
    price: 15000,
    isPremium: true,
    views: 940,
    downloads: 320,
    dateUploaded: '2025-10-02',
    pdfUrl: '/files/fisika-dasar-1-uts.pdf',
    description: 'Rumus cepat dan konsep inti Fisika Dasar I. Dibuat kompak hanya dalam 6 halaman padat untuk persiapan cepat UTS. Mencakup Vektor, Gerak 1D & 2D (Peluru/Melingkar), Hukum Newton tentang Gerak, Usaha & Energi, Momentum Linier, dan Dinamika Rotasi (Momen Inersia). Dilengkapi trik analisis diagram gaya!',
    previewPages: [
      'Halaman 1 (PREVIEW): Analisis Vektor & Gerak Parabola. Rumus cepat jangkauan maksimum.',
      'Halaman 2 (BLURRED): Aplikasi Hukum Newton I, II, III pada Bidang Miring & Katrol Majemuk.',
      'Halaman 3 (BLURRED): Teorema Usaha-Energi Mekanik & Tumbukan Lenting Sebagian.',
      'Halaman 4 (BLURRED): Dinamika Rotasi & Momen Inersia berbagai Benda Tegar.'
    ],
    reviews: [
      { id: 'rev-2-1', userName: 'Gede Artha', userNrp: '5024231005', rating: 5, comment: 'Bermanfaat banget ringkasannya! Soal-soal analisis gaya katrolnya ngebantu banget pas ngerjain tugas mingguan.', date: '2025-10-18' },
      { id: 'rev-2-2', userName: 'Farhan Hanif', userNrp: '5025231012', rating: 5, comment: 'Ga nyesel beli seharga kopi segelas, isinya super padat dan rapi. Penulisan diagram gayanya detil.', date: '2025-11-02' }
    ]
  },
  {
    id: 'note-3',
    title: 'Rangkuman Praktis Kimia Dasar I - Stoikiometri & Struktur Atom',
    courseCode: 'SF141305',
    courseName: 'Kimia Dasar I',
    topic: 'Dasar Kimia TPB',
    lecturer: 'Dr. Didik Prasetyoko, M.Sc.',
    semester: 1,
    faculty: 'FSAD',
    uploaderName: 'Fikri Alamsyah',
    uploaderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fikri',
    uploaderNrp: '5012211022',
    rating: 4.6,
    reviewsCount: 5,
    price: 0,
    isPremium: false,
    views: 450,
    downloads: 180,
    dateUploaded: '2025-09-22',
    pdfUrl: '/files/kimia-1-stoikiometri.pdf',
    description: 'Materi ringkas Kimia Dasar I untuk mahasiswa baru ITS. Fokus pada Stoikiometri (Konsep Mol, Reaktan Pembatas, Persentase Hasil), Teori Atom Bohr & Mekanika Kuantum (Bilangan Kuantum), Konfigurasi Elektron, dan Tren Sifat Periodik Unsur (Jari-jari, Elektronegativitas, Energi Ionisasi).',
    previewPages: [
      'Halaman 1: Stoikiometri Larutan & Penentuan Rumus Empiris.',
      'Halaman 2: Bilangan Kuantum (Utama, Azimut, Magnetik, Spin) & Aturan Aufbau/Hund.',
      'Halaman 3: Sifat Periodik Unsur & Ikatan Kimia (Kovalen vs Ionik).'
    ],
    reviews: [
      { id: 'rev-3-1', userName: 'Putu Eka', userNrp: '5020231014', rating: 5, comment: 'Terbaik! Ngebantu nyusun laporan resmi praktikum kimia dasar juga.', date: '2025-10-05' }
    ]
  },
  {
    id: 'note-4',
    title: 'Pembahasan Soal UAS Kalkulus II (Tahun 2022 - 2024)',
    courseCode: 'SF141302',
    courseName: 'Kalkulus II',
    topic: 'Persiapan UAS Kalkulus II',
    lecturer: 'Dra. Erna Aprillia, M.Si.',
    semester: 2,
    faculty: 'FSAD',
    uploaderName: 'Bagus Prasetyo',
    uploaderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bagus',
    uploaderNrp: '5025211002',
    rating: 4.9,
    reviewsCount: 15,
    price: 20000,
    isPremium: true,
    views: 1420,
    downloads: 512,
    dateUploaded: '2026-05-10',
    pdfUrl: '/files/kalkulus-2-uas.pdf',
    description: 'Eksklusif! Pembahasan lengkap langkah-demi-langkah soal-soal UAS Kalkulus II ITS dari 3 tahun terakhir. Berisi pembahasan Deret Tak Hingga (Uji Konvergensi), Deret Taylor/MacLaurin, Integral Lipat Dua & Tiga pada Koordinat Kartesian/Tabung/Bola, serta aplikasi Persamaan Diferensial Biasa (PDB) orde satu.',
    previewPages: [
      'Halaman 1 (PREVIEW): Pembahasan Soal Deret Positif & Uji Rasio / Integral.',
      'Halaman 2 (BLURRED): Penentuan Deret Taylor untuk Fungsi Trigonometri di sekitar x = a.',
      'Halaman 3 (BLURRED): Perhitungan Volume Benda Tegar menggunakan Integral Lipat Dua.',
      'Halaman 4 (BLURRED): Penyelesaian PDB Linier Orde 1 dengan Faktor Integrasi.'
    ],
    reviews: [
      { id: 'rev-4-1', userName: 'Hafidh Alwan', userNrp: '5025231021', rating: 5, comment: 'Gila penjelasannya clear banget! Step integral lipat duanya gampang diikutin. Sangat recommended buat yang takut ga lulus Kal II!', date: '2026-05-25' },
      { id: 'rev-4-2', userName: 'Clara Sinta', userNrp: '5008231034', rating: 5, comment: 'Detail banget pengerjaannya, ada coretan tips & trik identitas trigonometri yang sering lupa.', date: '2026-06-01' }
    ]
  },
  {
    id: 'note-5',
    title: 'Catatan Kuliah Struktur Data: Implementasi Tree & Graph C++',
    courseCode: 'IF184202',
    courseName: 'Struktur Data',
    topic: 'Struktur Data FTEIC',
    lecturer: 'Rully Soelaiman, S.Kom., M.T.',
    semester: 2,
    faculty: 'FTEIC',
    uploaderName: 'Achmad Zulkarnain',
    uploaderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zul',
    uploaderNrp: '5025221008',
    rating: 4.7,
    reviewsCount: 7,
    price: 25000,
    isPremium: true,
    views: 890,
    downloads: 240,
    dateUploaded: '2026-03-20',
    pdfUrl: '/files/struktur-data-tree-graph.pdf',
    description: 'Catatan komprehensif kuliah Struktur Data Informatika ITS. Dilengkapi kode C++ murni yang sudah dicoba dan bebas bug untuk Binary Search Tree (BST), AVL Tree (dengan rotasi Left/Right), Red-Black Tree konsep dasar, Heap, serta representasi Graph (Adjacency Matrix & List) beserta algoritma BFS & DFS.',
    previewPages: [
      'Halaman 1 (PREVIEW): BST Insertion & Traversal (Inorder, Preorder, Postorder) C++.',
      'Halaman 2 (BLURRED): Logika Penyeimbangan AVL Tree (Single & Double Rotation).',
      'Halaman 3 (BLURRED): Graph Representation: Matriks vs List Ketenagaan & BFS Code.',
      'Halaman 4 (BLURRED): DFS Algorithm & Deteksi Siklus pada Directed Graph.'
    ],
    reviews: [
      { id: 'rev-5-1', userName: 'Nabila Putri', userNrp: '5025231070', rating: 5, comment: 'Ngebantu banget buat ngerjain tugas besar ASD. Kodenya clean dan gampang di-porting.', date: '2026-04-12' },
      { id: 'rev-5-2', userName: 'Kevin Wijaya', userNrp: '5026231001', rating: 4, comment: 'Sangat rapi, tumpukan visual pohon biner-nya bikin cepet ngerti dibanding baca modul slide.', date: '2026-04-18' }
    ]
  },
  {
    id: 'note-6',
    title: 'Aljabar Linear: Transformasi Linier, Nilai Eigen & Vektor Eigen',
    courseCode: 'IF184301',
    courseName: 'Aljabar Linear',
    topic: 'Materi UTS/UAS Alin Informatika',
    lecturer: 'Dr. Bilqis Amaliah, S.Kom., M.Kom.',
    semester: 3,
    faculty: 'FTEIC',
    uploaderName: 'Achmad Zulkarnain',
    uploaderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zul',
    uploaderNrp: '5025221008',
    rating: 4.8,
    reviewsCount: 4,
    price: 0,
    isPremium: false,
    views: 620,
    downloads: 390,
    dateUploaded: '2025-11-10',
    pdfUrl: '/files/aljabar-linear-eigen.pdf',
    description: 'Catatan kuliah Aljabar Linear (Alin) Informatika ITS. Berisi penjelasan detail dan pembuktian matematis serta contoh soal tentang Ruang Vektor, Basis & Dimensi, Transformasi Linier (Kernel & Jangkauan), Nilai Eigen & Vektor Eigen, serta Diagonalisasi Matriks. Tulisan tangan rapi discan resolusi tinggi!',
    previewPages: [
      'Halaman 1: Definisi Ruang Vektor & Subruang beserta 10 Aksiomanya.',
      'Halaman 2: Menentukan Basis Ortonormal dengan Proses Gram-Schmidt.',
      'Halaman 3: Karakteristik Matriks: Menghitung Persamaan Karakteristik & Vektor Eigen.'
    ],
    reviews: [
      { id: 'rev-6-1', userName: 'Yusuf Gibran', userNrp: '5025231054', rating: 5, comment: 'Mantap mas Zul, tulisannya bagus banget dan gampang dibaca! Gram-Schmidt-nya detil banget angkanya.', date: '2025-11-28' }
    ]
  }
];

export const MOCK_USER: User = {
  nrp: '5025231045',
  name: 'Rafi Ardian',
  email: 'rafi.ardian23@mhs.its.ac.id',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rafi',
  balance: 85000,
  bookmarks: ['note-1', 'note-3'],
  followedCourses: ['Kalkulus I', 'Fisika Dasar I'],
  purchasedNotes: ['note-1'], // Already unlocked note-1 (it's free anyway)
  uploadedNotes: []
};

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-001',
    type: 'purchase',
    amount: 15000,
    description: 'Pembelian Catatan: Cheat Sheet Fisika Dasar I',
    status: 'success',
    date: '2026-06-01 14:22'
  },
  {
    id: 'tx-002',
    type: 'sale',
    amount: 25000,
    description: 'Penjualan Catatan: Pemrograman Dasar Praktis',
    status: 'success',
    date: '2026-06-03 09:15'
  },
  {
    id: 'tx-003',
    type: 'withdrawal',
    amount: 50000,
    description: 'Pencairan Dana NoteShare ke DANA (081234567890)',
    status: 'success',
    date: '2026-06-05 18:45'
  }
];
