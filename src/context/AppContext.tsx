'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Note, User, Transaction, Review, SignUpInput, SignInInput } from '@/types';
import { MOCK_NOTES, MOCK_TRANSACTIONS } from '@/mockData';
import {
  AuthResult,
  clearSessionCookie,
  createDefaultUser,
  getStoredAuthUsers,
  hashPassword,
  saveStoredAuthUsers,
  setSessionCookie,
  toPublicUser,
  validateItsEmail,
  validateName,
  validateNrp,
  validatePassword,
} from '@/lib/auth';

interface AppContextType {
  notes: Note[];
  user: User | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  transactions: Transaction[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  signUp: (input: SignUpInput) => Promise<AuthResult>;
  signIn: (input: SignInInput) => Promise<AuthResult>;
  signOut: () => void;
  bookmarkNote: (noteId: string) => void;
  purchaseNote: (noteId: string) => void;
  uploadNote: (noteData: Omit<Note, 'id' | 'views' | 'downloads' | 'rating' | 'reviewsCount' | 'uploaderName' | 'uploaderAvatar' | 'uploaderNrp' | 'dateUploaded' | 'reviews' | 'previewPages' | 'pdfUrl'> & { file: File | null }) => void;
  withdrawFunds: (amount: number, phone: string) => { success: boolean; message: string };
  followCourse: (courseName: string) => void;
  addReview: (noteId: string, rating: number, comment: string) => void;
  activePaymentNote: Note | null;
  setActivePaymentNote: (note: Note | null) => void;
  completePayment: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function mergeUserData(baseUser: User, savedUser: Partial<User> | null): User {
  if (!savedUser) return baseUser;
  return {
    ...baseUser,
    ...savedUser,
    nrp: baseUser.nrp,
    email: baseUser.email,
    name: savedUser.name ?? baseUser.name,
    avatar: savedUser.avatar ?? baseUser.avatar,
  };
}

export function AppContextProvider({ children }: { children: React.ReactNode }) {
  const [notes, setNotes] = useState<Note[]>(MOCK_NOTES);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activePaymentNote, setActivePaymentNote] = useState<Note | null>(null);

  useEffect(() => {
    const savedNotes = localStorage.getItem('ns_notes');
    const savedUser = localStorage.getItem('ns_user');
    const savedTxs = localStorage.getItem('ns_txs');
    const sessionNrp = document.cookie
      .split('; ')
      .find((row) => row.startsWith('ns_session='))
      ?.split('=')[1];

    if (savedNotes) setNotes(JSON.parse(savedNotes));

    if (sessionNrp) {
      const decodedNrp = decodeURIComponent(sessionNrp);
      const authUsers = getStoredAuthUsers();
      const authUser = authUsers.find((u) => u.nrp === decodedNrp);

      if (authUser) {
        const parsedSavedUser = savedUser ? (JSON.parse(savedUser) as User) : null;
        const mergedUser = mergeUserData(toPublicUser(authUser), parsedSavedUser);
        setUser(mergedUser);
      } else {
        clearSessionCookie();
        localStorage.removeItem('ns_user');
      }
    }

    if (savedTxs) setTransactions(JSON.parse(savedTxs));
    setIsAuthLoading(false);
  }, []);

  const saveToStorage = (newNotes: Note[], newUser: User | null, newTxs: Transaction[]) => {
    setNotes(newNotes);
    setUser(newUser);
    setTransactions(newTxs);
    localStorage.setItem('ns_notes', JSON.stringify(newNotes));
    if (newUser) {
      localStorage.setItem('ns_user', JSON.stringify(newUser));
    } else {
      localStorage.removeItem('ns_user');
    }
    localStorage.setItem('ns_txs', JSON.stringify(newTxs));
  };

  const signUp = async (input: SignUpInput): Promise<AuthResult> => {
    const nameError = validateName(input.name);
    if (nameError) return { success: false, message: nameError };

    const nrpError = validateNrp(input.nrp);
    if (nrpError) return { success: false, message: nrpError };

    const emailError = validateItsEmail(input.email);
    if (emailError) return { success: false, message: emailError };

    const passwordError = validatePassword(input.password);
    if (passwordError) return { success: false, message: passwordError };

    const users = getStoredAuthUsers();
    const normalizedEmail = input.email.trim().toLowerCase();
    const normalizedNrp = input.nrp.trim();

    if (users.some((u) => u.email === normalizedEmail)) {
      return { success: false, message: 'Email sudah terdaftar. Silakan masuk.' };
    }

    if (users.some((u) => u.nrp === normalizedNrp)) {
      return { success: false, message: 'NRP sudah terdaftar.' };
    }

    const passwordHash = await hashPassword(input.password);
    const newUser = {
      ...createDefaultUser(normalizedNrp, input.name, normalizedEmail),
      passwordHash,
    };

    saveStoredAuthUsers([...users, newUser]);

    const publicUser = toPublicUser(newUser);
    setSessionCookie(publicUser.nrp);
    saveToStorage(notes, publicUser, transactions);

    return { success: true, message: 'Akun berhasil dibuat!', user: publicUser };
  };

  const signIn = async (input: SignInInput): Promise<AuthResult> => {
    const emailError = validateItsEmail(input.email);
    if (emailError) return { success: false, message: emailError };

    const passwordError = validatePassword(input.password);
    if (passwordError) return { success: false, message: passwordError };

    const users = getStoredAuthUsers();
    const normalizedEmail = input.email.trim().toLowerCase();
    const foundUser = users.find((u) => u.email === normalizedEmail);

    if (!foundUser) {
      return { success: false, message: 'Email atau password salah.' };
    }

    const passwordHash = await hashPassword(input.password);
    if (passwordHash !== foundUser.passwordHash) {
      return { success: false, message: 'Email atau password salah.' };
    }

    const savedUserRaw = localStorage.getItem('ns_user');
    const savedUser = savedUserRaw ? (JSON.parse(savedUserRaw) as User) : null;
    const publicUser = mergeUserData(toPublicUser(foundUser), savedUser);

    setSessionCookie(publicUser.nrp);
    saveToStorage(notes, publicUser, transactions);

    return { success: true, message: 'Berhasil masuk!', user: publicUser };
  };

  const signOut = () => {
    clearSessionCookie();
    saveToStorage(notes, null, transactions);
  };

  const requireUser = (): User => {
    if (!user) throw new Error('User must be authenticated');
    return user;
  };

  const bookmarkNote = (noteId: string) => {
    const currentUser = requireUser();
    const isBookmarked = currentUser.bookmarks.includes(noteId);
    const updatedBookmarks = isBookmarked
      ? currentUser.bookmarks.filter((id) => id !== noteId)
      : [...currentUser.bookmarks, noteId];

    const updatedUser = { ...currentUser, bookmarks: updatedBookmarks };
    saveToStorage(notes, updatedUser, transactions);
  };

  const purchaseNote = (noteId: string) => {
    const currentUser = requireUser();
    const note = notes.find((n) => n.id === noteId);
    if (!note) return;

    if (note.price === 0 || currentUser.purchasedNotes.includes(noteId)) {
      const updatedUser = {
        ...currentUser,
        purchasedNotes: [...currentUser.purchasedNotes, noteId],
      };
      saveToStorage(notes, updatedUser, transactions);
      return;
    }

    setActivePaymentNote(note);
  };

  const completePayment = () => {
    if (!activePaymentNote || !user) return;

    const noteId = activePaymentNote.id;
    const price = activePaymentNote.price;

    const updatedPurchased = [...user.purchasedNotes, noteId];

    const consumerTx: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'purchase',
      amount: price,
      description: `Pembelian Catatan: ${activePaymentNote.title}`,
      status: 'success',
      date: new Date().toLocaleString('sv-SE').slice(0, 16),
    };

    const updatedUser = {
      ...user,
      purchasedNotes: updatedPurchased,
    };

    const updatedNotes = notes.map((n) => {
      if (n.id === noteId) {
        return { ...n, downloads: n.downloads + 1 };
      }
      return n;
    });

    const updatedTxs = [consumerTx, ...transactions];

    saveToStorage(updatedNotes, updatedUser, updatedTxs);
    setActivePaymentNote(null);
  };

  const uploadNote = (
    noteData: Omit<
      Note,
      | 'id'
      | 'views'
      | 'downloads'
      | 'rating'
      | 'reviewsCount'
      | 'uploaderName'
      | 'uploaderAvatar'
      | 'uploaderNrp'
      | 'dateUploaded'
      | 'reviews'
      | 'previewPages'
      | 'pdfUrl'
    > & { file: File | null }
  ) => {
    const currentUser = requireUser();
    const newNoteId = `note-${Date.now()}`;

    const previewPages = [
      `Halaman 1: Cover & Pendahuluan untuk ${noteData.title}`,
      `Halaman 2 (BLURRED): Rangkuman detail Bab 1 ${noteData.topic}`,
      `Halaman 3 (BLURRED): Soal & Pembahasan Latihan Mandiri ${noteData.courseName}`,
    ];

    const newNote: Note = {
      id: newNoteId,
      title: noteData.title,
      courseCode: noteData.courseCode,
      courseName: noteData.courseName,
      topic: noteData.topic,
      lecturer: noteData.lecturer,
      semester: noteData.semester,
      faculty: noteData.faculty,
      uploaderName: currentUser.name,
      uploaderAvatar: currentUser.avatar,
      uploaderNrp: currentUser.nrp,
      rating: 5.0,
      reviewsCount: 0,
      price: noteData.isPremium ? noteData.price : 0,
      isPremium: noteData.isPremium,
      views: 0,
      downloads: 0,
      dateUploaded: new Date().toISOString().slice(0, 10),
      pdfUrl: noteData.file ? `/files/${noteData.file.name}` : '/files/default.pdf',
      previewPages,
      description: noteData.description,
      reviews: [],
    };

    const updatedNotes = [newNote, ...notes];
    const updatedUser = {
      ...currentUser,
      uploadedNotes: [...currentUser.uploadedNotes, newNoteId],
    };

    saveToStorage(updatedNotes, updatedUser, transactions);
  };

  const withdrawFunds = (amount: number, phone: string) => {
    const currentUser = requireUser();

    if (currentUser.balance < amount) {
      return { success: false, message: 'Saldo tidak mencukupi' };
    }

    if (amount < 10000) {
      return { success: false, message: 'Minimal penarikan Rp 10.000' };
    }

    const newBalance = currentUser.balance - amount;
    const withdrawalTx: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'withdrawal',
      amount,
      description: `Pencairan Dana ke DANA (${phone})`,
      status: 'success',
      date: new Date().toLocaleString('sv-SE').slice(0, 16),
    };

    const updatedUser = {
      ...currentUser,
      balance: newBalance,
    };

    const updatedTxs = [withdrawalTx, ...transactions];

    saveToStorage(notes, updatedUser, updatedTxs);
    return { success: true, message: 'Penarikan dana ke DANA berhasil!' };
  };

  const followCourse = (courseName: string) => {
    const currentUser = requireUser();
    const isFollowed = currentUser.followedCourses.includes(courseName);
    const updatedCourses = isFollowed
      ? currentUser.followedCourses.filter((name) => name !== courseName)
      : [...currentUser.followedCourses, courseName];

    const updatedUser = { ...currentUser, followedCourses: updatedCourses };
    saveToStorage(notes, updatedUser, transactions);
  };

  const addReview = (noteId: string, rating: number, comment: string) => {
    const currentUser = requireUser();

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      userName: currentUser.name,
      userNrp: currentUser.nrp,
      rating,
      comment,
      date: new Date().toISOString().slice(0, 10),
    };

    const updatedNotes = notes.map((n) => {
      if (n.id === noteId) {
        const newReviews = [newReview, ...n.reviews];
        const newRating = parseFloat(
          (newReviews.reduce((sum, r) => sum + r.rating, 0) / newReviews.length).toFixed(1)
        );
        return {
          ...n,
          reviews: newReviews,
          reviewsCount: newReviews.length,
          rating: newRating,
        };
      }
      return n;
    });

    saveToStorage(updatedNotes, currentUser, transactions);
  };

  return (
    <AppContext.Provider
      value={{
        notes,
        user,
        isAuthenticated: !!user,
        isAuthLoading,
        transactions,
        searchQuery,
        setSearchQuery,
        signUp,
        signIn,
        signOut,
        bookmarkNote,
        purchaseNote,
        uploadNote,
        withdrawFunds,
        followCourse,
        addReview,
        activePaymentNote,
        setActivePaymentNote,
        completePayment,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppContextProvider');
  }
  return context;
}
