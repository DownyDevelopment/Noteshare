export interface Review {
  id: string;
  userName: string;
  userNrp: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Note {
  id: string;
  title: string;
  courseCode: string;
  courseName: string;
  topic: string;
  lecturer: string;
  semester: number;
  faculty: string; // e.g., FTEIC, FTIB, etc.
  uploaderName: string;
  uploaderAvatar: string;
  uploaderNrp: string;
  rating: number;
  reviewsCount: number;
  price: number;
  isPremium: boolean;
  views: number;
  downloads: number;
  dateUploaded: string;
  pdfUrl: string;
  previewPages: string[]; // List of preview page images/drawings
  description: string;
  reviews: Review[];
}

export interface Transaction {
  id: string;
  type: 'purchase' | 'sale' | 'withdrawal';
  amount: number;
  description: string;
  status: 'success' | 'pending' | 'failed';
  date: string;
}

export interface User {
  nrp: string;
  name: string;
  email: string;
  avatar: string;
  balance: number;
  bookmarks: string[]; // Note IDs
  followedCourses: string[]; // Course Names/Codes
  purchasedNotes: string[]; // Note IDs
  uploadedNotes: string[]; // Note IDs
}

export interface SignUpInput {
  name: string;
  nrp: string;
  email: string;
  password: string;
}

export interface SignInInput {
  email: string;
  password: string;
}
