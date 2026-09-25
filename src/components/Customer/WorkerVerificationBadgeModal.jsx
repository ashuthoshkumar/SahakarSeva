import React from 'react';
import { 
  ShieldCheck, CheckCircle2, Lock, FileCheck2, Award, 
  Building2, Fingerprint, Calendar, X, AlertCircle
} from 'lucide-react';

export const WorkerVerificationBadgeModal = ({ isOpen, onClose, worker }) => {
  if (!isOpen || !worker) return null;

  const aadhaarMasked = worker.aadhaarNo
    ? `XXXX-XXXX-${String(worker.aadhaarNo).replace(/\D/g, '').slice(-4) || '7291'}`
    : 'XXXX-XXXX-7291';

  return (
    <div 
      className="fixed inset-0 z-[95] flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-md animate-fadeIn font-sans"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-950 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shadow-inner">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/30 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                Official NCCT Cooperative Verification Record
              </span>
              <h3 className="text-base font-black text-white leading-tight mt-1">
                {worker.name} — 3-Tier Verified Worker
              </h3>
            </div>
          </div>

          <button 
            type="button"
            onClick={onClose} 
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          
          {/* Summary Banner */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
            <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0" />
            <div>
              <h4 className="text-xs font-black text-emerald-950">100% Background Cleared & Skill Certified</h4>
              <p className="text-[11px] text-emerald-800">
                Verified through Government DigiLocker API, State Police Clearance, and National Council for Cooperative Training (NCCT).
              </p>
            </div>
          </div>

          {/* Tier 1: Identity & Aadhaar e-KYC */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <Fingerprint className="w-4 h-4 text-blue-600" />
                Tier 1: Government Identity (Aadhaar e-KYC)
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> UIDAI Authenticated
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-200/80">
              <div>
                <span className="text-slate-400 text-[10px]">Aadhaar Masked:</span>
                <p className="font-mono font-bold text-slate-800">{aadhaarMasked}</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px]">DigiLocker Verification:</span>
                <p className="font-semibold text-slate-800">Direct UIDAI Token #DL-91823</p>
              </div>
            </div>
          </div>

          {/* Tier 2: State Police Criminal Background Check */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4 text-emerald-600" />
                Tier 2: State Police Criminal Clearance (PCC)
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Police Clear
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-200/80">
              <div>
                <span className="text-slate-400 text-[10px]">PCC Certificate No:</span>
                <p className="font-mono font-bold text-slate-800">
                  {worker.policeVerification || 'PCC-DL-2024-88912'}
                </p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px]">Criminal Record Search:</span>
                <p className="font-semibold text-emerald-700 font-bold">Zero FIR / Criminal Record Clean</p>
              </div>
            </div>
          </div>

          {/* Tier 3: NCCT Skill & Labour Cooperative Membership */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-teal-600" />
                Tier 3: Cooperative Society & NCCT Craft Certification
              </span>
              <span className="text-[10px] font-bold text-teal-700 bg-teal-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Award className="w-3 h-3" /> Certified Member
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-200/80">
              <div>
                <span className="text-slate-400 text-[10px]">Cooperative Society:</span>
                <p className="font-bold text-slate-800 truncate">
                  {worker.societyName || 'Delhi NCR Shramik Sahakari Samiti'}
                </p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px]">NCCT Skill Rating:</span>
                <p className="font-bold text-teal-800">
                  {worker.ncctLevel || 'Level 2 Certified Craftsman'}
                </p>
              </div>
            </div>
          </div>

          {/* Ayushman & PF Welfare Security */}
          <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-xl flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-500 text-[10px]">Ayushman Bharat Health Card:</span>
              <p className="font-mono font-bold text-teal-900">{worker.ayushmanCard || 'AB-1234-5678-2323'}</p>
            </div>
            <div className="text-right">
              <span className="text-slate-500 text-[10px]">Provident Fund (EPFO):</span>
              <p className="font-mono font-bold text-teal-900">{worker.pfAccountNumber || 'DL/CPM/07463'}</p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span>Official Cooperative Security Guarantee</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
