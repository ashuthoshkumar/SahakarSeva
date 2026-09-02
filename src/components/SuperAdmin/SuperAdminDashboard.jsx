import React, { useState, useEffect, useMemo } from 'react';
import { Crown, Building, Globe2, ShieldCheck, CheckCircle2, TrendingUp, Sparkles, Scale } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';

export const SuperAdminDashboard = () => {
  const { addNotification, platformStats, workers, bookings, societies } = useApp();
  const { t } = useLanguage();

  const [stateMetrics, setStateMetrics] = useState([]);
  const [loadingMetrics, setLoadingMetrics] = useState(true);

  // Offline fallback: build per-society metrics from localStorage
  const buildLocalMetrics = () =>
    societies.map((s) => {
      const sWorkers = workers.filter(w => w.societyId === s.id);
      const sPaid = bookings.filter(
        b => b.status?.includes('Paid') && sWorkers.some(w => w.name === b.workerName)
      );
      const revenue = sPaid.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
      return {
        state: s.location || 'India',
        societyName: s.name,
        societyId: s.id,
        workers: sWorkers.length,
        compliance: (s.complianceScore || 100) + '%',
        monthlyWages: '₹ ' + revenue.toLocaleString(),
        wageFloor: s.wageFloor,
        status: s.status || 'Active'
      };
    });

  // Fetch real per-society state metrics from API
  useEffect(() => {
    const fetchMetrics = async () => {
      setLoadingMetrics(true);
      try {
        let res = await fetch('/api/admin/state-metrics');
        if (!res.ok) res = await fetch('http://localhost:5050/api/admin/state-metrics');
        const data = await res.json();
        if (data.success) {
          setStateMetrics(data.metrics);
        } else {
          setStateMetrics(buildLocalMetrics());
        }
      } catch (err) {
        console.error('API unavailable, using local society data:', err);
        setStateMetrics(buildLocalMetrics());
      } finally {
        setLoadingMetrics(false);
      }
    };
    fetchMetrics();
  }, [societies, workers, bookings]);

  const formatCurrency = (amount) => {
    if (amount >= 10000000) return `₹ ${(amount / 10000000).toFixed(2)} Crores`;
    if (amount >= 100000) return `₹ ${(amount / 100000).toFixed(2)} Lakhs`;
    return `₹ ${amount.toLocaleString()}`;
  };

  const handleIssueDirective = (e) => {
    e.preventDefault();
    addNotification('NCCT National Policy Directive Issued: Minimum Wage Floor updated across all registered societies!', 'success');
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Super Admin Header */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-purple-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30 backdrop-blur-md">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>{t('nationalOversightBadge')}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            {t('nationalPortalTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Real-time compliance monitoring, workforce allocation, and NCCT policy enforcement across all registered Labour Cooperative Federations.
          </p>
        </div>
      </div>

      {/* National KPI Cards — Real Data */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase">{t('totalSocieties')}</span>
            <Building className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{platformStats?.totalSocieties || 0} Societies</p>
          <span className="text-[10px] text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded">
            {platformStats?.totalWorkers || 0} Verified Skilled Workers
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase">{t('totalFairWagesPaid')}</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{formatCurrency(platformStats?.totalFairWagesPaid || 0)}</p>
          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
            Direct Escrow Settlement
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase">{t('nationalWageCompliance')}</span>
            <Scale className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{platformStats?.totalBookings || 0} Bookings</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase">{t('ayushmanCoverage')}</span>
            <ShieldCheck className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">⭐ {platformStats?.avgWorkerRating || 0}</p>
          <span className="text-[10px] text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded">
            Average Worker Rating
          </span>
        </div>
      </div>

      {/* State-wise Cooperative Roster Table — Real Data */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-purple-600" />
            <span>{t('stateFederationPerformance')}</span>
          </h3>
          <button
            onClick={handleIssueDirective}
            className="px-3.5 py-1.5 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-amber-300" /> {t('issueNationalDirective')}
          </button>
        </div>

        {loadingMetrics ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-slate-500 mt-2">Loading state metrics...</p>
          </div>
        ) : stateMetrics.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
            <p className="text-sm font-bold text-slate-600">No societies registered yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">{t('colState')}</th>
                  <th className="py-3 px-4">Society</th>
                  <th className="py-3 px-4">{t('colWorkers')}</th>
                  <th className="py-3 px-4">{t('colCompliance')}</th>
                  <th className="py-3 px-4 text-right">{t('colMonthlyWages')}</th>
                  <th className="py-3 px-4 text-center">{t('colStatus')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {stateMetrics.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{row.state}</td>
                    <td className="py-3.5 px-4 text-slate-700 text-[11px]">{row.societyName}</td>
                    <td className="py-3.5 px-4 text-slate-700">{row.workers} Members</td>
                    <td className="py-3.5 px-4 font-bold text-indigo-700">{row.compliance}</td>
                    <td className="py-3.5 px-4 text-right font-bold text-emerald-700">{row.monthlyWages}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
