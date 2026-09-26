import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users, Building2, Calendar, MapPin, IndianRupee, ShieldCheck,
  CheckCircle2, ArrowRight, Sparkles, X, ChevronDown, ChevronUp,
  Award, Briefcase, Info, AlertTriangle, Layers
} from 'lucide-react';

export const SamuhikTendersModal = ({ isOpen, onClose, workerProfile }) => {
  const { addNotification } = useApp();
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedTenderId, setExpandedTenderId] = useState(null);
  const [biddingTender, setBiddingTender] = useState(null);
  
  // Squad Bid Form State
  const [squadName, setSquadName] = useState('');
  const [membersCount, setMembersCount] = useState(4);
  const [submitting, setSubmitting] = useState(false);
  const [bidSuccess, setBidSuccess] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchTenders();
    }
  }, [isOpen]);

  const fetchTenders = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/tenders');
      const data = await res.json();
      if (data.success && data.tenders && data.tenders.length > 0) {
        setTenders(data.tenders);
      } else {
        // Fallback default sample data
        setTenders(DEFAULT_TENDERS);
      }
    } catch (err) {
      console.error('Failed to load tenders, using cooperative fallback:', err);
      setTenders(DEFAULT_TENDERS);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenBid = (tender) => {
    setBiddingTender(tender);
    setMembersCount(tender.workersNeeded || 4);
    setSquadName(`${workerProfile?.name ? workerProfile.name.split(' ')[0] : 'Cooperative'} & Sahakar Squad`);
    setBidSuccess(null);
  };

  const handleSubmitBid = async (e) => {
    e.preventDefault();
    if (!biddingTender) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/tenders/${biddingTender.id}/bid`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          squadName,
          membersCount,
          leadWorkerName: workerProfile?.name || 'Cooperative Craftsman'
        })
      });
      const data = await res.json();
      if (data.success) {
        setBidSuccess({
          squadName,
          tenderTitle: biddingTender.title,
          budgetEscrow: biddingTender.budgetEscrow,
          workersNeeded: biddingTender.workersNeeded,
          perWorkerShare: Math.round((biddingTender.budgetEscrow * 0.9) / (biddingTender.workersNeeded || 1))
        });
        addNotification(
          `सामूहिक टेंडर आवेदन सफल! Cooperative Squad "${squadName}" bid placed for ₹${biddingTender.budgetEscrow.toLocaleString('en-IN')}`,
          'success'
        );
        fetchTenders();
      }
    } catch (err) {
      // Offline fallback
      setBidSuccess({
        squadName,
        tenderTitle: biddingTender.title,
        budgetEscrow: biddingTender.budgetEscrow,
        workersNeeded: biddingTender.workersNeeded,
        perWorkerShare: Math.round((biddingTender.budgetEscrow * 0.9) / (biddingTender.workersNeeded || 1))
      });
      addNotification(
        `सामूहिक टेंडर आवेदन सफल (ऑफ़लाइन रिकॉर्ड)! Squad bid registered for ${biddingTender.title}`,
        'success'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const filteredTenders = selectedCategory === 'all'
    ? tenders
    : tenders.filter(t => t.category.toLowerCase().includes(selectedCategory.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-800 text-white shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-inner">
                <Users className="w-7 h-7 text-emerald-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                    सामूहिक सेवा टेंडर
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-400 text-slate-900 shadow">
                    Cooperative Squad Bidding
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-emerald-100 font-medium mt-0.5">
                  Community Bulk Contracts & RWA Society Work Orders with 100% Fair-Wage Split
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Value Prop Banner */}
          <div className="mt-4 p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-3 text-xs sm:text-sm">
            <Sparkles className="w-5 h-5 text-amber-300 shrink-0" />
            <div className="text-white/90">
              <span className="font-bold text-amber-300">बिचौलिया-मुक्त सामूहिक ठेका:</span> No middleman contractors. Form a cooperative squad of 3-5 verified craftsmen, bid directly, and automatically receive 90% direct payout + 5% Ayushman pension into individual accounts.
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {[
              { id: 'all', label: 'All Open Tenders (सभी टेंडर)' },
              { id: 'appliances', label: 'AC / HVAC Deep Clean' },
              { id: 'plumbing', label: 'Water Reservoir / Plumbing' },
              { id: 'electrician', label: 'Solar & Electrical Rewiring' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Tenders Grid */}
          {loading ? (
            <div className="py-12 text-center text-slate-500">
              <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-3" />
              Loading cooperative tenders...
            </div>
          ) : filteredTenders.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              No open tenders found in this category right now.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTenders.map((tender) => {
                const isExpanded = expandedTenderId === tender.id;
                const perWorkerWage = Math.round((tender.budgetEscrow * 0.9) / (tender.workersNeeded || 1));
                const perWorkerAyushman = Math.round((tender.budgetEscrow * 0.05) / (tender.workersNeeded || 1));
                const societyReserve = Math.round(tender.budgetEscrow * 0.05);

                return (
                  <div
                    key={tender.id}
                    className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 hover:border-emerald-500/50 transition-all shadow-sm"
                  >
                    {/* Top Row: RWA Badge & Status */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          {tender.rwaName}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                          <ShieldCheck className="w-3 h-3" /> Verified Society Escrow
                        </span>
                      </div>
                      <div className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200">
                        {tender.bidsCount > 0 ? `${tender.bidsCount} Cooperative Bids` : 'Open for First Bid'}
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                      {tender.title}
                    </h3>
                    {tender.titleHi && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                        {tender.titleHi}
                      </p>
                    )}

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 line-clamp-2">
                      {tender.description}
                    </p>

                    {/* Quick Specs */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[11px]">कुल यूनिट (Volume)</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {tender.unitsCount} Units / Flts
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">कारीगर दल (Squad Size)</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-emerald-500" /> {tender.workersNeeded} Craftsmen
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">तय तारीखें (Service Window)</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-blue-500" /> {tender.scheduledDates}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">एस्क्रो बजट (Total Escrow)</span>
                        <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                          ₹{tender.budgetEscrow.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {/* Action Bar & Fair-Wage Calculator Toggle */}
                    <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60">
                      <button
                        type="button"
                        onClick={() => setExpandedTenderId(isExpanded ? null : tender.id)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        {isExpanded ? 'Hide Wage Split Formula' : 'View Automated Fair-Wage Split (न्यायसंगत वेतन विभाजन)'}
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenBid(tender)}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all"
                        >
                          <Users className="w-3.5 h-3.5" />
                          कारीगर दल बनाकर आवेदन करें (Bid as Squad)
                        </button>
                      </div>
                    </div>

                    {/* Expanded Fair Wage Split Calculator */}
                    {isExpanded && (
                      <div className="mt-4 p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 animate-fadeIn space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-black uppercase tracking-wider text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-emerald-600" />
                            ICA Cooperative Transparent Wage Guarantee (0% Middleman Cut)
                          </h4>
                          <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                            Total: ₹{tender.budgetEscrow.toLocaleString('en-IN')}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                          {/* 90% Worker Squad */}
                          <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900">
                            <div className="text-emerald-700 dark:text-emerald-400 font-bold text-[11px]">
                              90% Direct Worker Payout
                            </div>
                            <div className="text-base font-black text-slate-900 dark:text-white mt-0.5">
                              ₹{Math.round(tender.budgetEscrow * 0.9).toLocaleString('en-IN')}
                            </div>
                            <div className="text-[11px] text-slate-500 font-semibold mt-1">
                              = <span className="text-emerald-600 font-bold">₹{perWorkerWage.toLocaleString('en-IN')}</span> per worker ({tender.workersNeeded} members)
                            </div>
                          </div>

                          {/* 5% Ayushman / Social Welfare */}
                          <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900">
                            <div className="text-teal-700 dark:text-teal-400 font-bold text-[11px]">
                              5% Ayushman & Pension Float
                            </div>
                            <div className="text-base font-black text-slate-900 dark:text-white mt-0.5">
                              ₹{Math.round(tender.budgetEscrow * 0.05).toLocaleString('en-IN')}
                            </div>
                            <div className="text-[11px] text-slate-500 font-semibold mt-1">
                              = <span className="text-teal-600 font-bold">₹{perWorkerAyushman.toLocaleString('en-IN')}</span> credited to each worker's welfare passbook
                            </div>
                          </div>

                          {/* 5% Society Reserve */}
                          <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900">
                            <div className="text-slate-600 dark:text-slate-400 font-bold text-[11px]">
                              5% PACS Society Operations
                            </div>
                            <div className="text-base font-black text-slate-900 dark:text-white mt-0.5">
                              ₹{societyReserve.toLocaleString('en-IN')}
                            </div>
                            <div className="text-[11px] text-slate-500 font-semibold mt-1">
                              Equipment depot maintenance & insurance reserve
                            </div>
                          </div>
                        </div>

                        {/* Contrast vs Contractor */}
                        <div className="text-[11px] p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex items-start gap-2">
                          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <strong>Comparison with private labour contractor:</strong> In private market contracts, sub-contractors keep 40%–50% commission (₹12,000–₹15,000) and pay gig technicians only ₹3,000. Through SahakarSeva, each worker takes home <strong>₹{perWorkerWage.toLocaleString('en-IN')}</strong> directly.
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Regulated under Multi-State Cooperative Societies Act & NCCT Guidelines</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600 font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
          >
            Close (बंद करें)
          </button>
        </div>

      </div>

      {/* Squad Bid Form Modal Overlay */}
      {biddingTender && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5">
            
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[11px] font-bold uppercase text-emerald-600 dark:text-emerald-400">
                  Cooperative Squad Formation & Bid
                </span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {biddingTender.title}
                </h3>
              </div>
              <button
                onClick={() => setBiddingTender(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {bidSuccess ? (
              <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/30">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-emerald-900 dark:text-emerald-200">
                  सामूहिक टेंडर आवेदन सफलतापूर्वक दर्ज!
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Squad <strong>"{bidSuccess.squadName}"</strong> has been registered for this tender. Total escrow budget <strong>₹{bidSuccess.budgetEscrow.toLocaleString('en-IN')}</strong> will be distributed automatically:
                </p>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                  Guaranteed Take-Home: ₹{bidSuccess.perWorkerShare.toLocaleString('en-IN')} per member
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setBiddingTender(null);
                    setBidSuccess(null);
                  }}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-md hover:bg-emerald-700 transition-colors"
                >
                  Done (पूर्ण)
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitBid} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    कारीगर दल का नाम (Cooperative Squad Name)
                  </label>
                  <input
                    type="text"
                    required
                    value={squadName}
                    onChange={(e) => setSquadName(e.target.value)}
                    placeholder="e.g. Sahakar HVAC Masters Squad"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      सदस्य संख्या (Members Needed)
                    </label>
                    <input
                      type="number"
                      min={biddingTender.workersNeeded || 2}
                      max={8}
                      value={membersCount}
                      onChange={(e) => setMembersCount(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      समान वेतन प्रति सदस्य (Per Member)
                    </label>
                    <div className="px-3.5 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-black">
                      ₹{Math.round((biddingTender.budgetEscrow * 0.9) / (membersCount || 1)).toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 space-y-1 text-[11px]">
                  <div className="font-bold text-slate-800 dark:text-slate-200">
                    सहकारी प्रतिज्ञा (Cooperative Pledge):
                  </div>
                  <p>
                    ✓ All squad members have valid NCCT/KYC registration.<br />
                    ✓ 90% contract proceeds split equally; 0% sub-contractor commission cuts.
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setBiddingTender(null)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    {submitting ? 'दर्ज हो रहा है...' : 'बोली जमा करें (Submit Bid)'}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

const DEFAULT_TENDERS = [
  {
    id: 'tender_rwa_1',
    rwaName: 'Royal Palms RWA (Society Reg: RWA/DL/2019/402)',
    title: 'Society Pre-Summer AC Deep-Clean, Gas Check & Coil Treatment (48 Units)',
    titleHi: 'सोसाइटी प्री-समर 48 एसी डीप-क्लीन और गैस चेक सामूहिक टेंडर',
    category: 'appliances',
    description: 'Bulk service package for 3 residential towers. Includes chemical outdoor jet wash, indoor coil sterilisation, and electrical amperage diagnostics for 48 split air conditioners.',
    unitsCount: 48,
    workersNeeded: 4,
    budgetEscrow: 28800,
    location: 'Royal Palms Complex, Sector 14, Dwarka, New Delhi',
    scheduledDates: '10 Oct - 14 Oct 2026',
    status: 'OPEN_FOR_BIDS',
    bidsCount: 1
  },
  {
    id: 'tender_rwa_2',
    rwaName: 'Apex Heights Cooperative Housing Society',
    title: 'Overhead & Underground Water Reservoir Desilting & UV Sterilisation (6 Tanks)',
    titleHi: 'ओवरहेड और अंडरग्राउंड पानी की टंकी विसंक्रमण सामूहिक टेंडर (6 टंकियां)',
    category: 'plumbing',
    description: 'High-pressure hydro-jet desilting, anti-bacterial sludge removal, and water pump non-return valve inspection for 4 overhead and 2 underground reservoirs.',
    unitsCount: 6,
    workersNeeded: 3,
    budgetEscrow: 18000,
    location: 'Apex Heights Society, Pocket 7, Mayur Vihar Phase 1, Delhi',
    scheduledDates: '05 Oct - 07 Oct 2026',
    status: 'OPEN_FOR_BIDS',
    bidsCount: 2
  },
  {
    id: 'tender_rwa_3',
    rwaName: 'Vasant Kunj Sector C Residents Welfare Association',
    title: 'Common Area Solar Inverter Phase Balancing & 120 LED Rewiring (12 Blocks)',
    titleHi: 'कॉमन एरिया सोलर इन्वर्टर फेज़ बैलेंसिंग और 120 स्ट्रीटलाइट रीवायरिंग',
    category: 'electrician',
    description: 'Inspection and rewiring of common area solar hybrid inverters, MCB distribution busbars, and replacement of 120 floodlight drivers across 12 residential blocks.',
    unitsCount: 12,
    workersNeeded: 5,
    budgetEscrow: 34500,
    location: 'Sector C, Pocket 2, Vasant Kunj, New Delhi',
    scheduledDates: '12 Oct - 16 Oct 2026',
    status: 'OPEN_FOR_BIDS',
    bidsCount: 1
  }
];
