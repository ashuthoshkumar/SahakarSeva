import React, { useState, useEffect } from 'react';
import { AIDemandForecaster } from './AIDemandForecaster';
import { useApp } from '../../context/AppContext';
import { Landmark, Users, TrendingUp, ShieldCheck, MapPin, Activity, Award } from 'lucide-react';

export const FederationDashboard = () => {
  const { workers, bookings, societies } = useApp();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Build fallback stats from local data
  const buildLocalStats = () => {
    const paidBookings = bookings.filter(b => b.status?.includes('Paid'));
    const totalRevenue = paidBookings.reduce((s, b) => s + (b.totalAmount || 0), 0);
    const totalWelfare = paidBookings.reduce((s, b) => s + (b.welfareContribution || 0), 0);
    const onDutyCount = workers.filter(w => w.onDuty).length;
    const avgRating = workers.length > 0
      ? (workers.reduce((s, w) => s + (w.rating || 5), 0) / workers.length)
      : 0;
    const totalReviews = workers.reduce((s, w) => s + (w.reviewsCount || 0), 0);
    return {
      success: true,
      affiliatedSocieties: societies.length || 0,
      totalRegisteredWorkers: workers.length || 0,
      monthlyFairWages: totalRevenue,
      welfareFundTotal: totalWelfare,
      workerUtilizationRate: workers.length > 0
        ? ((onDutyCount / workers.length) * 100).toFixed(1) + '% Active'
        : '0% Active',
      customerTrustScore: parseFloat(avgRating.toFixed(2)),
      totalReviews
    };
  };

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        let res = await fetch('/api/federation/stats');
        if (!res.ok) res = await fetch('http://localhost:5050/api/federation/stats');
        const data = await res.json();
        if (data.success) {
          setStats(data);
        } else {
          setStats(buildLocalStats());
        }
      } catch (err) {
        console.error('API unavailable, using local data:', err);
        setStats(buildLocalStats());
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [workers, bookings, societies]);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center p-16">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-bold text-slate-600">Loading federation dashboard...</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    if (amount >= 10000000) return `₹ ${(amount / 10000000).toFixed(2)} Crores`;
    if (amount >= 100000) return `₹ ${(amount / 100000).toFixed(2)} Lakhs`;
    return `₹ ${amount.toLocaleString()}`;
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Federation Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-200">
              <Landmark className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">Labour Cooperative Federation</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-bold text-xs">
                  Apex Federation
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Overseeing {stats.affiliatedSocieties} Affiliated Societies • {stats.totalRegisteredWorkers} Registered Workers
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Worker Utilization Rate</span>
              <p className="text-lg font-black text-emerald-700">{stats.workerUtilizationRate}</p>
            </div>
            <div className="pl-3 border-l border-slate-300">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Fair Wage Compliance</span>
              <p className="text-lg font-black text-indigo-700">100% Guaranteed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase">Affiliated Societies</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{stats.affiliatedSocieties} Societies</p>
          <span className="text-[10px] text-slate-500 font-medium">{stats.totalRegisteredWorkers} Total Registered Workers</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase">Fair Wages Disbursed</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{formatCurrency(stats.monthlyFairWages)}</p>
          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
            Direct Escrow Settlement
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase">Federation Welfare Fund</span>
            <ShieldCheck className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{formatCurrency(stats.welfareFundTotal)}</p>
          <span className="text-[10px] text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded">
            Emergency Medical & PF Trust Pool
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase">Customer Trust Score</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">{stats.customerTrustScore} / 5.0</p>
          <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded">
            Based on {stats.totalReviews.toLocaleString()} Reviews
          </span>
        </div>
      </div>

      {/* AI Demand Forecasting Microservice */}
      <AIDemandForecaster />

    </div>
  );
};
