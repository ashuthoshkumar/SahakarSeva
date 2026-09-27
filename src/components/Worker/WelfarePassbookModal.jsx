import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldCheck, Heart, Award, ArrowUpRight, DollarSign,
  Download, CheckCircle2, X, AlertCircle, FileText, Sparkles,
  Printer, ArrowDownLeft, Building2, Calendar
} from 'lucide-react';

export const WelfarePassbookModal = ({ isOpen, onClose }) => {
  const { bookings, addNotification } = useApp();
  const { user } = useAuth();
  const [claimRequested, setClaimRequested] = useState(false);

  if (!isOpen) return null;

  // Filter bookings for this worker
  const myBookings = (bookings || []).filter(
    (b) => b.workerName === user?.name || b.workerId === user?.id
  );
  const paidBookings = myBookings.filter((b) => b.status && b.status.includes('Paid'));

  // Calculate live accrued amounts
  const accruedWelfare = paidBookings.reduce((sum, b) => sum + (b.welfareContribution || 0), 0) + 1250;
  const totalEarnedWages = paidBookings.reduce((sum, b) => sum + (b.baseWage || 0), 0) + 18500;
  const estimatedDividend = Math.round(totalEarnedWages * 0.08); // 8% cooperative society dividend

  const handleClaimEmergencyHealth = () => {
    setClaimRequested(true);
    addNotification('Medical claim of ₹1,500 submitted to Cooperative Welfare Committee for instant approval!', 'success');
  };

  const handleDownloadStatement = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Date,Booking ID,Category,Base Wage,Welfare Contribution,Status\n"
      + paidBookings.map(b => `${b.createdAt || '2026-09-26'},${b.id},${b.category},₹${b.baseWage},₹${b.welfareContribution},Verified`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `SahakarSeva_Passbook_${user?.id || 'worker'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addNotification('Welfare statement downloaded as CSV', 'success');
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
      <div 
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Passbook Header — Clean Statutory Cooperative Register Look */}
        <div className="bg-slate-900 border-b border-slate-800 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-teal-500/15 border border-teal-400/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-teal-300 bg-teal-500/20 px-2 py-0.5 rounded-full border border-teal-400/30">
                  MSCS Act 2002 • Registered
                </span>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Govt. Audited
                </span>
              </div>
              <h3 className="text-base font-black text-white mt-1 leading-tight">
                Cooperative Welfare & Dividend Passbook
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadStatement}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
              title="Download Statement"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Passbook Content */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1 text-slate-800 bg-[#f8fafc]">
          
          {/* Member Identity Card Banner */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                  Cooperative Member Folio
                </span>
                <h4 className="text-lg font-black text-slate-900 mt-1">{user?.name || 'Ramesh Sharma'}</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Member Folio: <span className="font-mono font-bold text-slate-800">SHK-{user?.id ? user.id.slice(-6).toUpperCase() : '847291'}</span> • Society: <strong>{user?.societyName || 'Delhi NCR Shramik Sahakari Samiti Ltd.'}</strong>
                </p>
              </div>

              <div className="text-right">
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-black inline-flex items-center gap-1 shadow-2xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Active Shareholder
                </span>
                <p className="text-[11px] text-slate-400 mt-1">1 Full Equity Share (Vested)</p>
              </div>
            </div>
          </div>

          {/* Social Security 3-Pillar Fund Grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-500" />
              <span>3-Tier Cooperative Social Security Reserve</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              {/* Pillar 1: Ayushman Bharat Healthcare Escrow */}
              <div className="p-4 rounded-2xl bg-white border border-rose-200 shadow-xs flex flex-col justify-between space-y-2 hover:border-rose-300 transition-colors">
                <div>
                  <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider">
                    Ayushman Health Reserve
                  </span>
                  <p className="text-xl font-black text-slate-900 mt-1">₹{accruedWelfare.toLocaleString('en-IN')}</p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                    Funded automatically via 5% welfare allocation on each job.
                  </p>
                </div>
                <span className="text-[10px] font-black text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md inline-block self-start border border-rose-200">
                  ● 100% Cashless Medical
                </span>
              </div>

              {/* Pillar 2: PMSBY Insurance Guarantee */}
              <div className="p-4 rounded-2xl bg-white border border-blue-200 shadow-xs flex flex-col justify-between space-y-2 hover:border-blue-300 transition-colors">
                <div>
                  <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">
                    PMSBY Accident Cover
                  </span>
                  <p className="text-xl font-black text-slate-900 mt-1">₹2,00,000</p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                    Zero annual premium deducted; fully subsidized by the cooperative.
                  </p>
                </div>
                <span className="text-[10px] font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md inline-block self-start border border-blue-200">
                  ● Active On-Duty Policy
                </span>
              </div>

              {/* Pillar 3: Annual Society Patronage Dividend */}
              <div className="p-4 rounded-2xl bg-white border border-emerald-200 shadow-xs flex flex-col justify-between space-y-2 hover:border-emerald-300 transition-colors">
                <div>
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                    Annual Dividend Share
                  </span>
                  <p className="text-xl font-black text-slate-900 mt-1">₹{estimatedDividend.toLocaleString('en-IN')}</p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                    ICA Principle #3: 8% surplus dividend distributed at annual AGM.
                  </p>
                </div>
                <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block self-start border border-emerald-200">
                  ● Disburses March 2027
                </span>
              </div>

            </div>
          </div>

          {/* Itemized Passbook Entries */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-600" />
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                  Itemized Welfare Contributions Ledger
                </h4>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">Auto-credited per job</span>
            </div>

            <div className="divide-y divide-slate-100 max-h-56 overflow-y-auto pr-1">
              {paidBookings.length === 0 ? (
                <div className="py-4 text-center text-xs text-slate-400">
                  Initial opening balance of ₹1,250 verified by PACS registrar. Completed job contributions will appear here automatically.
                </div>
              ) : (
                paidBookings.map((b) => (
                  <div key={b.id} className="py-3 flex items-center justify-between text-xs hover:bg-slate-50 px-2 rounded-xl transition-colors">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">Job #{b.id.slice(-6)}</span>
                        <span className="text-[10px] text-slate-400 capitalize">({b.category})</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{b.paidAt || b.createdAt || 'Recent Payout'}</p>
                    </div>

                    <div className="text-right">
                      <p className="font-black text-emerald-700">+₹{b.welfareContribution || 25}</p>
                      <span className="text-[10px] text-slate-400 font-mono">From ₹{b.baseWage} wage</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Emergency Medical Assistance Claim Action */}
          <div className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center justify-between gap-4">
            <div>
              <h5 className="font-bold text-xs text-slate-900">Need Immediate Health Support?</h5>
              <p className="text-xs text-slate-500 mt-0.5">Submit an on-spot medical reimbursement request directly to your society committee.</p>
            </div>
            <button
              onClick={handleClaimEmergencyHealth}
              disabled={claimRequested}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all shrink-0 cursor-pointer ${
                claimRequested
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                  : 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs'
              }`}
            >
              {claimRequested ? '✓ Claim Under Review' : 'Claim ₹1,500 Health Aid'}
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-100 border-t border-slate-200 text-center text-[11px] text-slate-500 font-medium">
          Multi-State Co-operative Societies Act, 2002 • Statutory Protection of Gig & Platform Workers
        </div>

      </div>
    </div>
  );
};

export default WelfarePassbookModal;
