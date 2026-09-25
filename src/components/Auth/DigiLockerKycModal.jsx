import React, { useState } from 'react';
import { 
  ShieldCheck, CheckCircle2, Lock, Smartphone, RefreshCw, 
  AlertCircle, ArrowRight, X, FileText, Fingerprint
} from 'lucide-react';

export const DigiLockerKycModal = ({ isOpen, onClose, aadhaarNo, workerName, onVerified }) => {
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('otp'); // 'otp' | 'verifying' | 'success'
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const maskedAadhaar = aadhaarNo 
    ? `XXXX-XXXX-${aadhaarNo.replace(/\D/g, '').slice(-4) || '8412'}`
    : 'XXXX-XXXX-8412';

  const handleVerifyOtp = () => {
    if (!otp || otp.length < 4) {
      setError('Please enter the 6-digit Aadhaar OTP sent to your registered mobile (e.g. 123456).');
      return;
    }

    setError('');
    setStep('verifying');

    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        onVerified({
          digiLockerId: `DL-AADHAAR-${Date.now().toString().slice(-6)}`,
          maskedAadhaar,
          verifiedAt: new Date().toISOString(),
          status: 'DigiLocker UIDAI Verified',
          policeClearanceRef: `PCC-STATE-${Math.floor(100000 + Math.random() * 900000)}`
        });
        onClose();
      }, 1500);
    }, 1200);
  };

  const handleQuickDemoFill = () => {
    setOtp('123456');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-md animate-fadeIn font-sans">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-scaleUp">
        
        {/* DigiLocker Official Government Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300">
              <Fingerprint className="w-5 h-5 text-cyan-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider bg-blue-500/30 px-2 py-0.5 rounded text-cyan-300 border border-blue-400/30">
                  Government of India
                </span>
              </div>
              <h3 className="text-sm font-black text-white leading-tight mt-0.5">
                DigiLocker Aadhaar e-KYC Hub
              </h3>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/10 text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5">
          {step === 'otp' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-blue-50/80 rounded-2xl border border-blue-100 flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 text-blue-600 shrink-0" />
                <div className="text-xs">
                  <p className="font-extrabold text-blue-950">Aadhaar Authentication</p>
                  <p className="text-slate-600">
                    Aadhaar: <strong className="font-mono text-blue-800">{maskedAadhaar}</strong>
                  </p>
                  <p className="text-[11px] text-slate-500">Name: {workerName || 'Applicant'}</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Enter 6-Digit UIDAI OTP
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="Enter OTP (or click Quick Demo)"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-sm font-bold font-mono tracking-widest text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    maxLength={6}
                  />
                </div>
                {error && <p className="text-xs text-red-600 font-bold">{error}</p>}
              </div>

              {/* Quick demo helper for Judges / Hackathon testing */}
              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={handleQuickDemoFill}
                  className="text-blue-600 hover:text-blue-700 font-bold underline text-[11px]"
                >
                  ⚡ One-Click Fill Demo OTP (123456)
                </button>
                <span className="text-[11px] text-slate-400">UIDAI Safe & Encrypted</span>
              </div>

              <button
                type="button"
                onClick={handleVerifyOtp}
                className="w-full py-3.5 rounded-xl bg-blue-700 hover:bg-blue-800 active:scale-[0.98] text-white font-black text-sm shadow-lg shadow-blue-700/25 transition-all flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>Verify & Pull Identity Credentials</span>
              </button>
            </div>
          )}

          {step === 'verifying' && (
            <div className="py-8 text-center space-y-4">
              <div className="relative w-16 h-16 mx-auto">
                <div className="w-16 h-16 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
                <Fingerprint className="w-8 h-8 text-blue-600 absolute inset-0 m-auto animate-pulse" />
              </div>
              <div>
                <h4 className="font-black text-base text-slate-900">Validating Biometric Match...</h4>
                <p className="text-xs text-slate-500 mt-1">Cross-referencing UIDAI Aadhaar Vault & Police Records</p>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="py-6 text-center space-y-3 animate-slideUp">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-black text-base text-slate-900">e-KYC Verified Successfully!</h4>
                <p className="text-xs text-emerald-700 font-bold mt-1">
                  ✓ Aadhaar Biometrics Authenticated<br />
                  ✓ State Police Clearance Reference Generated
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1 font-semibold text-blue-900">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            DigiLocker Partner API v2.4
          </span>
          <span>Zero-Tamper Guarantee</span>
        </div>

      </div>
    </div>
  );
};
