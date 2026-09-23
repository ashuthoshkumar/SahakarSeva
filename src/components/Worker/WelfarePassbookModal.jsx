import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldCheck, Heart, Award, ArrowUpRight, DollarSign,
  Download, CheckCircle2, X, AlertCircle, FileText, Sparkles
} from 'lucide-react';

export const WelfarePassbookModal = ({ isOpen, onClose }) => {
  const { bookings, addNotification } = useApp();
  const { user } = useAuth();
  const [claimRequested, setClaimRequested] = useState(false);

  if (!isOpen) return null;

  // Filter bookings for this worker
  const myBookings = bookings.filter(
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

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-scaleUp">
        
        {/* Passbook Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white p-4 relative flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 shadow-inner">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-400/30">
                  NCCT Verified
                </span>
                <span className="text-[10px] text-slate-300 font-bold">Social Security</span>
              </div>
              <h3 className="text-base font-extrabold text-white leading-tight">
                Cooperative Welfare & Dividend Passbook
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Passbook Content */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1 text-slate-800">
          
          {/* Member Identity Card Banner */}
          <div className="bg-gradient-to-br from-slate-900 to-teal-950 text-white p-4 rounded-2xl border border-teal-800/40 shadow-md relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl"></div>
            
            <div className="flex items-start justify-between relative z-10">
              <div>
                <span className="text-[10px] uppercase font-bold text-teal-300 tracking-wider">
                  Labour Cooperative Member
                </span>
                <h4 className="text-base font-extrabold text-white mt-0.5">{user?.name || 'Kavita Verma'}</h4>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  ID: <span className="font-mono text-teal-300">SHK-{user?.id ? user.id.slice(-6).toUpperCase() : '847291'}</span> • Society: {user?.societyName || 'SahakarSeva Delhi Central'}
                </p>
              </div>

              <div className="text-right">
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-black inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Active Member
                </span>
                <p className="text-[10px] text-slate-400 mt-1">1 Equity Shareholder</p>
              </div>
            </div>
          </div>

          {/* Social Security 3-Pillar Fund Grid */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-500" />
              <span>3-Tier Social Protection Ledgers</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              
              {/* Pillar 1: Ayushman Bharat Healthcare Escrow */}
              <div className="p-3 rounded-2xl bg-rose-50/80 border border-rose-200 flex flex-col justify-between space-y-2">
                <div>
                  <span className="text-[10px] font-bold text-rose-700 uppercase">
                    Ayushman Healthcare
                  </span>
                  <p className="text-lg font-black text-rose-900 mt-0.5">₹{accruedWelfare.toLocaleString()}</p>
                  <p className="text-[10px] text-rose-700 mt-0.5 leading-snug">
                    Funded via 5% welfare allocation on every completed job.
                  </p>
                </div>
                <span className="text-[9px] font-black text-rose-800 bg-rose-100/80 px-2 py-0.5 rounded-md inline-block self-start">
                  ● 100% Medical Cover
                </span>
              </div>

              {/* Pillar 2: PMSBY Insurance Guarantee */}
              <div className="p-3 rounded-2xl bg-blue-50/80 border border-blue-200 flex flex-col justify-between space-y-2">
                <div>
                  <span className="text-[10px] font-bold text-blue-700 uppercase">
                    PMSBY Accident Cover
                  </span>
                  <p className="text-lg font-black text-blue-900 mt-0.5">₹2,00,000</p>
                  <p className="text-[10px] text-blue-700 mt-0.5 leading-snug">
                    Government-backed disability and emergency accidental policy.
                  </p>
                </div>
                <span className="text-[9px] font-black text-blue-800 bg-blue-100/80 px-2 py-0.5 rounded-md inline-block self-start">
                  ● Policy Active
                </span>
              </div>

              {/* Pillar 3: Annual Cooperative Dividend */}
              <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 flex flex-col justify-between space-y-2">
                <div>
                  <span className="text-[10px] font-bold text-amber-800 uppercase">
                    Projected Dividend
                  </span>
                  <p className="text-lg font-black text-amber-900 mt-0.5">₹{estimatedDividend.toLocaleString()}</p>
                  <p className="text-[10px] text-amber-800 mt-0.5 leading-snug">
                    Annual surplus distribution to member-owners in March.
                  </p>
                </div>
                <span className="text-[9px] font-black text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-md inline-block self-start">
                  ● Year-End Share
                </span>
              </div>

            </div>
          </div>

          {/* Emergency Welfare Claim Action */}
          <div className="p-3.5 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between gap-3 shadow-sm">
            <div className="min-w-0">
              <h5 className="font-extrabold text-xs text-emerald-950">
                Need Instant Medical Fund Disbursement?
              </h5>
              <p className="text-[10px] text-emerald-700 mt-0.5">
                Claims up to ₹5,000 are processed instantly from your cooperative society escrow.
              </p>
            </div>

            <button
              onClick={handleClaimEmergencyHealth}
              disabled={claimRequested}
              className={`px-3 py-2 rounded-xl font-bold text-xs shrink-0 transition-all shadow-sm ${
                claimRequested
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95'
              }`}
            >
              {claimRequested ? '✓ Claim Submitted' : 'Claim Funds'}
            </button>
          </div>

          {/* Transparent Transaction Ledger */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h5 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-teal-600" />
                <span>Recent Booking Welfare Deposits</span>
              </h5>
              <span className="text-[10px] font-bold text-slate-500">Live Sync</span>
            </div>

            <div className="space-y-2">
              {[
                { date: 'Today, 02:30 PM', service: 'Concealed Wiring Repair', wage: '₹450', welfare: '+₹23.00' },
                { date: 'Yesterday, 11:15 AM', service: 'High-Pressure Pipe Fitting', wage: '₹380', welfare: '+₹19.00' },
                { date: '21 Sep 2026', service: 'Split AC Coil Servicing', wage: '₹550', welfare: '+₹27.50' },
              ].map((tx, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-extrabold text-slate-900 text-[11px]">{tx.service}</p>
                    <p className="text-[10px] text-slate-500">{tx.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-slate-900 text-[11px]">Wage: {tx.wage}</p>
                    <p className="text-[10px] font-black text-emerald-700">{tx.welfare} to Escrow</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-[10px] text-slate-400">
          Governed under Multi-State Cooperative Societies Act & Ministry of Cooperation
        </div>

      </div>
    </div>
  );
};
