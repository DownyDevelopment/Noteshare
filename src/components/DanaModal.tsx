'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { X, ShieldAlert, CheckCircle, Smartphone, Lock, ArrowRight, Loader2, CreditCard } from 'lucide-react';

export default function DanaModal() {
  const { activePaymentNote, setActivePaymentNote, completePayment, user } = useApp();
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [phone, setPhone] = useState('0821-3945-8823');
  const [otp, setOtp] = useState('');
  const [pin, setPin] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!activePaymentNote || !user) return null;

  const handleClose = () => {
    setActivePaymentNote(null);
    setStep(1);
    setOtp('');
    setPin('');
    setErrorMessage('');
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 9) {
      setErrorMessage('Masukkan nomor telepon DANA yang valid');
      return;
    }
    setErrorMessage('');
    setStep(2);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 4) {
      setErrorMessage('OTP harus berupa 4 digit angka');
      return;
    }
    setErrorMessage('');
    setStep(3);
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 6) {
      setErrorMessage('PIN DANA harus berupa 6 digit angka');
      return;
    }
    
    if (user.balance < activePaymentNote.price) {
      setErrorMessage('Saldo DANA Anda tidak mencukupi untuk melakukan transaksi ini');
      return;
    }

    setErrorMessage('');
    setStep(4);

    setTimeout(() => {
      setStep(5);
    }, 2000);
  };

  const handleSuccessDone = () => {
    completePayment();
    handleClose();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      {/* Container */}
      <div className="relative w-full max-w-[400px] overflow-hidden rounded-3xl bg-gray-50 shadow-2xl transition-all duration-300">
        
        {/* DANA Header */}
        <div className="bg-[#108EE9] px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Simulated DANA text logo */}
              <span className="text-xl font-extrabold tracking-wider">DANA</span>
              <span className="rounded bg-white/20 px-1.5 py-0.5 text-[9px] font-medium tracking-wide uppercase">
                Secure checkout
              </span>
            </div>
            {step !== 4 && step !== 5 && (
              <button 
                onClick={handleClose}
                className="rounded-full bg-white/10 p-1.5 hover:bg-white/20 transition-all active:scale-95"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          {/* Merchant / Order Summary */}
          <div className="mt-4 border-t border-white/15 pt-3 flex justify-between items-end">
            <div>
              <p className="text-[10px] text-white/75">Merchant</p>
              <p className="text-xs font-semibold">NoteShare ITS (Institut Teknologi Sepuluh Nopember)</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-white/75">Total Bayar</p>
              <p className="text-lg font-bold">{formatRupiah(activePaymentNote.price)}</p>
            </div>
          </div>
        </div>

        {/* Payment Steps Content */}
        <div className="p-6">
          
          {/* STEP 1: Phone Login */}
          {step === 1 && (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div className="text-center space-y-1">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-sky-50 text-[#108EE9] mb-1">
                  <Smartphone className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-bold text-gray-800">Hubungkan Akun DANA</h3>
                <p className="text-[11px] text-gray-500">Masukkan nomor ponsel terdaftar untuk membayar menggunakan DANA</p>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Nomor Ponsel</label>
                <div className="flex rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 shadow-sm focus-within:border-[#108EE9] focus-within:ring-1 focus-within:ring-[#108EE9]">
                  <span className="text-sm font-semibold text-gray-500 mr-1.5">+62</span>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="812-3456-7890"
                    className="w-full text-sm font-medium text-gray-800 bg-transparent border-0 p-0 focus:ring-0 focus:outline-none"
                  />
                </div>
              </div>

              {errorMessage && (
                <div className="flex items-center gap-1.5 rounded-lg bg-red-50 p-2.5 text-[11px] font-medium text-red-600">
                  <ShieldAlert className="h-4 w-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#108EE9] py-3 text-xs font-bold text-white shadow-md shadow-sky-600/10 hover:bg-[#0c7ecf] transition-all active:scale-98"
              >
                Lanjutkan
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
              
              <div className="text-center pt-2">
                <p className="text-[10px] text-gray-400">Dengan melanjutkan, Anda menyetujui Ketentuan Layanan DANA</p>
              </div>
            </form>
          )}

          {/* STEP 2: OTP Verification */}
          {step === 2 && (
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div className="text-center space-y-1">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-sky-50 text-[#108EE9] mb-1">
                  <Lock className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-bold text-gray-800">Verifikasi Kode OTP</h3>
                <p className="text-[11px] text-gray-500">Kode OTP 4-digit dikirim ke nomor <span className="font-semibold">{phone}</span></p>
              </div>

              <div className="space-y-1 text-center">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Kode OTP</label>
                <input
                  type="text"
                  maxLength={4}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••"
                  className="mx-auto block w-28 text-center text-xl font-bold tracking-[0.6em] border-b-2 border-gray-200 focus:border-[#108EE9] focus:outline-none py-1"
                />
              </div>

              {errorMessage && (
                <div className="flex items-center gap-1.5 rounded-lg bg-red-50 p-2.5 text-[11px] font-medium text-red-600">
                  <ShieldAlert className="h-4 w-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="flex justify-between items-center text-[11px] px-1">
                <button
                  type="button"
                  onClick={() => setOtp('6315')}
                  className="font-bold text-[#108EE9] hover:underline"
                >
                  Autofill Kode (6315)
                </button>
                <span className="text-gray-400">Kirim Ulang (59s)</span>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 rounded-xl border border-gray-200 bg-white py-3 text-xs font-bold text-gray-600 hover:bg-gray-100 transition-all"
                >
                  Kembali
                </button>
                <button
                  type="submit"
                  className="w-2/3 rounded-xl bg-[#108EE9] py-3 text-xs font-bold text-white shadow-md hover:bg-[#0c7ecf] transition-all active:scale-98"
                >
                  Verifikasi
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: PIN Secure Entry */}
          {step === 3 && (
            <form onSubmit={handlePinSubmit} className="space-y-4">
              <div className="text-center space-y-1">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-sky-50 text-[#108EE9] mb-1">
                  <CreditCard className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-bold text-gray-800">Masukkan PIN DANA</h3>
                <p className="text-[11px] text-gray-500">Masukkan 6-digit Personal Identification Number Anda</p>
              </div>

              <div className="space-y-1 text-center">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">PIN DANA</label>
                <input
                  type="password"
                  maxLength={6}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••••"
                  className="mx-auto block w-36 text-center text-2xl font-bold tracking-[0.5em] border-b-2 border-gray-200 focus:border-[#108EE9] focus:outline-none py-1"
                />
              </div>

              {errorMessage && (
                <div className="flex items-center gap-1.5 rounded-lg bg-red-50 p-2.5 text-[11px] font-medium text-red-600">
                  <ShieldAlert className="h-4 w-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="flex justify-between items-center text-[11px] px-1">
                <button
                  type="button"
                  onClick={() => setPin('502523')}
                  className="font-bold text-[#108EE9] hover:underline"
                >
                  Autofill PIN (502523)
                </button>
                <span className="text-gray-400">Lupa PIN?</span>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-1/3 rounded-xl border border-gray-200 bg-white py-3 text-xs font-bold text-gray-600 hover:bg-gray-100 transition-all"
                >
                  Kembali
                </button>
                <button
                  type="submit"
                  className="w-2/3 rounded-xl bg-[#108EE9] py-3 text-xs font-bold text-white shadow-md hover:bg-[#0c7ecf] transition-all active:scale-98"
                >
                  Bayar Sekarang
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: Processing Animation */}
          {step === 4 && (
            <div className="py-8 flex flex-col items-center justify-center space-y-4">
              <Loader2 className="h-10 w-10 text-[#108EE9] animate-spin" />
              <div className="text-center space-y-1">
                <h3 className="text-sm font-bold text-gray-800">Memproses Pembayaran</h3>
                <p className="text-[11px] text-gray-500">Harap tidak menutup jendela browser Anda...</p>
              </div>
            </div>
          )}

          {/* STEP 5: Success Output */}
          {step === 5 && (
            <div className="space-y-5 text-center py-2">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 mb-1">
                <CheckCircle className="h-10 w-10" />
              </div>
              
              <div className="space-y-1">
                <h3 className="text-md font-bold text-gray-800">Pembayaran Berhasil!</h3>
                <p className="text-xs text-gray-500">Catatan eksklusif Anda telah berhasil di-unlock.</p>
              </div>

              {/* Receipt Panel */}
              <div className="rounded-2xl bg-gray-100 p-4 text-left text-[11px] space-y-2 border border-gray-200">
                <div className="flex justify-between">
                  <span className="text-gray-500">ID Transaksi:</span>
                  <span className="font-semibold text-gray-800">TX-DANA-{Date.now().toString().slice(-6)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Catatan:</span>
                  <span className="font-semibold text-gray-800 text-right max-w-[200px] truncate">{activePaymentNote.title}</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2 font-bold text-xs">
                  <span className="text-gray-700">Metode Bayar:</span>
                  <span className="text-[#108EE9]">DANA Saldo</span>
                </div>
              </div>

              <button
                onClick={handleSuccessDone}
                className="w-full rounded-xl bg-[#108EE9] py-3 text-xs font-bold text-white shadow-md hover:bg-[#0c7ecf] transition-all active:scale-98"
              >
                Mulai Baca Catatan
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
