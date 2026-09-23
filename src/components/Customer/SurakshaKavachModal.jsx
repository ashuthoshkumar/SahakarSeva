import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck, AlertTriangle, CheckCircle2, X, FileText,
  Clock, Award, HeartHandshake, Sparkles, Send, ShieldAlert
} from 'lucide-react';

export const SurakshaKavachModal = ({ isOpen, onClose }) => {
  const { addNotification } = useApp();
  const [claimView, setClaimView] = useState(false);
  const [claimCategory, setClaimCategory] = useState('accidental_damage');
  const [claimDescription, setClaimDescription] = useState('');
  const [submittedClaim, setSubmittedClaim] = useState(null);

  if (!isOpen) return null;

  const handleSubmitClaim = (e) => {
    e.preventDefault();
    if (!claimDescription.trim()) return;

    const token = 'KAVACH-' + Math.floor(100000 + Math.random() * 900000);
    setSubmittedClaim({
      token,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'Auditor Assigned (Level 4 Master Craftsman)',
      coverageAmount: 'Up to ₹25,000'
    });
    addNotification(`Warranty Claim ${token} registered! Free inspection dispatched within 2 hours.`, 'success');
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-scaleUp">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white p-4 relative flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 shadow-inner">
              <ShieldCheck className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-400/30">
                  Cooperative Mutual Fund
                </span>
                <span className="text-[10px] text-slate-300 font-bold">100% Zero-Deductible</span>
              </div>
              <h3 className="text-base font-extrabold text-white leading-tight">
                Sahakari Suraksha Kavach
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

        {/* Scrollable Body */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1 text-slate-800">
          
          {!claimView ? (
            <>
              {/* Top Hero Guarantee Banner */}
              <div className="bg-gradient-to-br from-teal-900 via-emerald-950 to-slate-900 text-white p-4 rounded-2xl border border-emerald-600/40 shadow-md space-y-2 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-black tracking-wider text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                    ₹25,000 Protection Included
                  </span>
                  <span className="text-xs font-bold text-slate-300">Cooperative Guarantee</span>
                </div>

                <h4 className="text-base font-black text-white leading-snug">
                  Every SahakarSeva Booking is Insured Against Property Damage & Defects
                </h4>
                <p className="text-[11px] text-slate-300 leading-snug">
                  Funded directly by the 5% Cooperative Society Welfare Pool. You never pay extra for insurance, and you never have to chase private third-party insurers.
                </p>
              </div>

              {/* 3 Pillars of Protection */}
              <div className="space-y-2.5">
                <h5 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                  What is Covered under Suraksha Kavach:
                </h5>

                <div className="grid grid-cols-1 gap-2.5 text-xs">
                  
                  {/* Pillar 1 */}
                  <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-emerald-600 text-white shrink-0 mt-0.5">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-extrabold text-emerald-950 text-xs">
                        ₹25,000 Accidental Property Damage Guarantee
                      </p>
                      <p className="text-[11px] text-emerald-800 mt-0.5 leading-snug">
                        If a worker accidentally damages tiles, sanitary fittings, electrical appliances, or furniture during work, your repair cost is 100% reimbursed from the society guarantee fund.
                      </p>
                    </div>
                  </div>

                  {/* Pillar 2 */}
                  <div className="p-3 rounded-2xl bg-teal-50/70 border border-teal-200 flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-teal-600 text-white shrink-0 mt-0.5">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-extrabold text-teal-950 text-xs">
                        30-Day Free Re-Work Warranty
                      </p>
                      <p className="text-[11px] text-teal-800 mt-0.5 leading-snug">
                        If the same leak or electrical fault recurs within 30 days, an NCCT Level 4 Master Craftsman is dispatched to rectify it completely free of charge.
                      </p>
                    </div>
                  </div>

                  {/* Pillar 3 */}
                  <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-200 flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-blue-600 text-white shrink-0 mt-0.5">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-extrabold text-blue-950 text-xs">
                        Zero-Deductible, Direct Society Settlement
                      </p>
                      <p className="text-[11px] text-blue-800 mt-0.5 leading-snug">
                        Unlike corporate apps with hidden ₹2,000 deductibles and 15-day claim delays, our Cooperative Society Committee approves settlements within 24 hours.
                      </p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Action Button to File / Test Claim */}
              <div className="pt-2">
                <button
                  onClick={() => setClaimView(true)}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-extrabold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-1.5"
                >
                  <FileText className="w-4 h-4" />
                  <span>File a Warranty / Damage Protection Claim →</span>
                </button>
              </div>
            </>
          ) : (
            /* Interactive Claim Filing View */
            <div className="space-y-3.5 animate-fadeIn">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <h5 className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-emerald-600" />
                  <span>Suraksha Kavach 1-Tap Claim Form</span>
                </h5>
                <button
                  onClick={() => setClaimView(false)}
                  className="text-xs font-bold text-teal-600 hover:underline"
                >
                  ← Back to Terms
                </button>
              </div>

              {!submittedClaim ? (
                <form onSubmit={handleSubmitClaim} className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Claim Type</label>
                    <select
                      value={claimCategory}
                      onChange={(e) => setClaimCategory(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="accidental_damage">Accidental Property Damage (Reimbursement)</option>
                      <option value="rework_warranty">Work Quality Defect (30-Day Free Re-work)</option>
                      <option value="part_failure">Installed Spare Part Defect</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Describe the Issue</label>
                    <textarea
                      rows={3}
                      value={claimDescription}
                      onChange={(e) => setClaimDescription(e.target.value)}
                      placeholder="E.g., Tile was chipped during sanitary installation, or tap is leaking again after repair..."
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-slate-400 resize-none"
                    />
                  </div>

                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-[11px] space-y-1">
                    <p className="font-bold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>Cooperative Rapid Response Guarantee:</span>
                    </p>
                    <p className="text-amber-800">
                      An NCCT Level 4 Master Inspector will arrive at your premises within 2 hours. Zero paperwork required.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={!claimDescription.trim()}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold rounded-xl shadow transition-all flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Suraksha Kavach Claim</span>
                  </button>
                </form>
              ) : (
                /* Claim Registered Success State */
                <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl text-center space-y-2.5 animate-fadeIn">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-sm text-emerald-950">
                      Claim Successfully Logged & Approved!
                    </h5>
                    <p className="text-xs text-emerald-800 mt-0.5">
                      Token: <strong className="font-mono text-emerald-900">{submittedClaim.token}</strong>
                    </p>
                  </div>

                  <div className="p-2.5 bg-white rounded-xl border border-emerald-200 text-xs text-left space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Status:</span>
                      <strong className="text-emerald-800 font-bold">{submittedClaim.status}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Guaranteed Coverage:</span>
                      <strong className="text-slate-800">{submittedClaim.coverageAmount}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Date Logged:</span>
                      <span className="text-slate-700">{submittedClaim.date}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSubmittedClaim(null);
                      setClaimView(false);
                      onClose();
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow transition-all"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-[10px] text-slate-400">
          Backed by Labour Cooperative Mutual Guarantee Reserve • Ministry of Cooperation
        </div>

      </div>
    </div>
  );
};
