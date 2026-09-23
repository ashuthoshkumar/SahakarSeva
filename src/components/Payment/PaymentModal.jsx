import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Modal } from '../Common/Modal';
import { ShieldCheck, QrCode, CreditCard, Building, ArrowRight, HeartHandshake, CheckCircle2, Camera, ThumbsUp, Sparkles, Check, AlertCircle, Heart } from 'lucide-react';
import { translateCategory, translateWorkerName } from '../../utils/translateHelpers';

export const PaymentModal = () => {
  const {
    paymentModalOpen,
    setPaymentModalOpen,
    selectedBooking,
    completePayment,
    setRatingModalOpen,
    setRatingBooking
  } = useApp();
  const { t, lang } = useLanguage();

  const [paymentMethod, setPaymentMethod] = useState('upi_qr');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!selectedBooking) return null;

  // Only allow payment if work is approved
  const isWorkApproved = selectedBooking.workApproved || selectedBooking.status?.includes('Approved');
  const hasCompletionPhoto = Boolean(selectedBooking.completionPhoto);

  const upiQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=upi://pay?pa=sahakar.coop@upi%26pn=SahakarSeva+Labor+Cooperative%26am=${selectedBooking.totalAmount}%26tn=Booking_${selectedBooking.id}%26cu=INR`;

  const handlePay = (e) => {
    e.preventDefault();
    if (!isWorkApproved) return;

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      completePayment(selectedBooking.id);
      
      // Automatically open Rating Modal after payment
      setRatingBooking(selectedBooking);
      setRatingModalOpen(true);
    }, 1500);
  };

  return (
    <Modal
      isOpen={paymentModalOpen}
      onClose={() => setPaymentModalOpen(false)}
      title={t('workInspectionEscrowPayment') || 'Work Inspection & Escrow Payment'}
    >
      <div className="space-y-5 font-sans text-slate-800">
        
        {/* STEP 1: WORK COMPLETION PHOTO PROOF INSPECTION */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-teal-600" />
              <span>{t('step1WorkProof') || 'Step 1: Work Completion Photo Proof'}</span>
            </h4>
            {hasCompletionPhoto ? (
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                {t('workerSubmittedProof') || 'Worker Submitted Proof'}
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                {t('noPhotoYet') || 'No Photo Yet'}
              </span>
            )}
          </div>

          {/* Photo Proof Card — Real uploaded photo or placeholder */}
          {hasCompletionPhoto ? (
            <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-900 group">
              <img
                src={selectedBooking.completionPhoto}
                alt="Work Completion Proof"
                className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent p-3 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-xs">{selectedBooking.category} Service Completed</p>
                    <p className="text-[10px] text-teal-300">Worker: {selectedBooking.workerName}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-extrabold text-[10px] border border-teal-500/30">
                    Real Photo
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-100 p-8 text-center space-y-2">
              <Camera className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs font-bold text-slate-600">Worker has not uploaded completion photo yet</p>
              <p className="text-[10px] text-slate-400">The worker will upload a real photo after completing the work</p>
            </div>
          )}

          {/* Work approval status */}
          {isWorkApproved ? (
            <div className="flex items-center gap-2.5 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-xs font-bold text-emerald-900">
                {t('workApprovedMsg') || '✓ You have approved the completed work. Proceed to payment.'}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2.5 p-2.5 bg-amber-50 border border-amber-200 rounded-xl">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="text-xs font-bold text-amber-900">
                {t('workNeedApprovalMsg') || 'You must approve the work from your Bookings page before payment.'}
              </span>
            </div>
          )}
        </div>

        {/* STEP 2: TRANSPARENT FARE BREAKDOWN */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2 text-xs">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100 font-bold text-slate-900">
            <span>Booking #{selectedBooking.id}</span>
            <span className="text-emerald-700 text-sm">₹{selectedBooking.totalAmount}.00</span>
          </div>

          <div className="space-y-1.5 text-slate-600 pt-1">
            <div className="flex justify-between">
              <span>{t('workerNetTakehome') || 'Worker Base Payout'} (100% Direct):</span>
              <span className="font-semibold text-slate-800">₹{selectedBooking.baseWage}.00</span>
            </div>
            <div className="flex justify-between text-teal-700 font-medium">
              <span className="flex items-center gap-1">
                <HeartHandshake className="w-3.5 h-3.5 text-teal-600" /> {t('workerWelfareFund') || 'Labor Coop Welfare Fund'} (5%):
              </span>
              <span>+ ₹{selectedBooking.welfareContribution || Math.round(selectedBooking.baseWage * 0.05)}.00</span>
            </div>
          </div>
        </div>

        {/* STEP 3: PAYMENT METHOD & DYNAMIC UPI QR */}
        <div className="space-y-3">
          <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">
            {t('step2ChoosePaymentMethod') || 'Step 2: Choose Escrow Payment Method'}
          </label>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setPaymentMethod('upi_qr')}
              className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all text-xs font-bold ${
                paymentMethod === 'upi_qr'
                  ? 'border-teal-600 bg-teal-50 text-teal-900 shadow-sm'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <QrCode className="w-5 h-5 text-teal-600" />
              <span>{t('upiInstantQr') || 'UPI QR Code'}</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('upi_id')}
              className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all text-xs font-bold ${
                paymentMethod === 'upi_id'
                  ? 'border-teal-600 bg-teal-50 text-teal-900 shadow-sm'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <CreditCard className="w-5 h-5 text-teal-600" />
              <span>UPI Apps</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('netbanking')}
              className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all text-xs font-bold ${
                paymentMethod === 'netbanking'
                  ? 'border-teal-600 bg-teal-50 text-teal-900 shadow-sm'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Building className="w-5 h-5 text-teal-600" />
              <span>Net Banking</span>
            </button>
          </div>
        </div>

        {/* DYNAMIC UPI QR CODE DISPLAY */}
        {paymentMethod === 'upi_qr' && (
          <div className="flex flex-col items-center justify-center p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-3">
            <div className="p-3 bg-white rounded-2xl shadow-xl border-4 border-teal-500">
              <img
                src={upiQrUrl}
                alt="Dynamic UPI QR Code"
                className="w-44 h-44 rounded-lg"
              />
            </div>
            <div className="text-center space-y-1">
              <p className="text-xs font-extrabold text-white">Scan & Pay ₹{selectedBooking.totalAmount}.00</p>
              <p className="text-[10px] text-slate-300">Works with GPay, PhonePe, Paytm & BHIM UPI</p>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-bold border border-teal-500/30">
                🔒 Safe Escrow Settlement to Labor Coop
              </span>
            </div>
          </div>
        )}

        {/* DIRECT UPI APP TRIGGERS */}
        {paymentMethod === 'upi_id' && (
          <div className="space-y-3">
            <p className="text-xs font-bold text-slate-700">Pay directly using your installed UPI App:</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                className="p-3 rounded-xl bg-slate-100 hover:bg-teal-50 border border-slate-200 text-slate-800 font-extrabold text-xs flex flex-col items-center gap-1"
              >
                <span>🔵 Google Pay</span>
              </button>
              <button
                type="button"
                className="p-3 rounded-xl bg-slate-100 hover:bg-teal-50 border border-slate-200 text-slate-800 font-extrabold text-xs flex flex-col items-center gap-1"
              >
                <span>🟣 PhonePe</span>
              </button>
              <button
                type="button"
                className="p-3 rounded-xl bg-slate-100 hover:bg-teal-50 border border-slate-200 text-slate-800 font-extrabold text-xs flex flex-col items-center gap-1"
              >
                <span>🟦 Paytm UPI</span>
              </button>
            </div>
          </div>
        )}

        {/* COOPERATIVE SOCIAL IMPACT BADGE */}
        <div className="bg-emerald-50/90 border border-emerald-200 rounded-2xl p-3 flex items-center gap-3 shadow-sm">
          <div className="p-2 rounded-xl bg-emerald-600 text-white shrink-0">
            <Heart className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <p className="font-extrabold text-emerald-950">🌱 Your Cooperative Impact</p>
            <p className="text-[11px] text-emerald-800 leading-snug">
              ₹{selectedBooking.welfareContribution || Math.round(selectedBooking.totalAmount * 0.05)} is directly deposited into {selectedBooking.workerName}’s Ayushman Bharat healthcare escrow. 0% exploitative corporate commission!
            </p>
          </div>
        </div>

        {/* CONFIRM & PAY BUTTON */}
        <button
          onClick={handlePay}
          disabled={isProcessing || !isWorkApproved}
          className={`w-full py-3.5 rounded-xl font-extrabold text-sm shadow-lg transition-all flex items-center justify-center gap-2 ${
            isWorkApproved
              ? 'bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white'
              : 'bg-slate-300 text-slate-500 cursor-not-allowed'
          }`}
        >
          {isProcessing ? (
            <span>{t('processingPayment') || 'Processing Escrow & Releasing Funds...'}</span>
          ) : !isWorkApproved ? (
            <>
              <AlertCircle className="w-4 h-4" />
              <span>Approve Work First to Pay</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>{t('payAndReleaseEscrow') || 'Pay & Release Escrow'} (₹{selectedBooking.totalAmount}.00)</span>
            </>
          )}
        </button>

      </div>
    </Modal>
  );
};
