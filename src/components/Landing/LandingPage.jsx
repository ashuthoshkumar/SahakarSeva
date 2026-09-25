import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, HeartHandshake, Zap, ArrowRight, 
  UserCheck, Lock, Sparkles, Wrench, Hammer, 
  ChefHat, Tv, Camera, CheckCircle2, AlertTriangle,
  Award, TrendingUp, PhoneCall, Star, Check, X,
  MapPin, Clock, DollarSign
} from 'lucide-react';
import { translateCategory } from '../../utils/translateHelpers';

export const LandingPage = ({ setActiveTab }) => {
  const { openAuthModal } = useAuth();
  const { t, lang } = useLanguage();
  const { setSelectedCategory, setEmergencyModalOpen } = useApp();

  const serviceCategories = [
    { id: 'electrician', name: 'Electrician', icon: Zap, rate: '₹199', badge: 'Popular', bg: 'bg-amber-50 text-amber-600 border-amber-200 hover:border-amber-400' },
    { id: 'plumber', name: 'Plumber', icon: Wrench, rate: '₹249', badge: 'High Demand', bg: 'bg-blue-50 text-blue-600 border-blue-200 hover:border-blue-400' },
    { id: 'carpenter', name: 'Carpenter', icon: Hammer, rate: '₹299', badge: 'Skilled', bg: 'bg-orange-50 text-orange-600 border-orange-200 hover:border-orange-400' },
    { id: 'caregiver', name: 'Caregiver', icon: HeartHandshake, rate: '₹349', badge: 'Verified', bg: 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:border-emerald-400' },
    { id: 'domestic_helper', name: 'Domestic Helper', icon: ChefHat, rate: '₹179', badge: 'Trusted', bg: 'bg-purple-50 text-purple-600 border-purple-200 hover:border-purple-400' },
    { id: 'technician', name: 'Appliance Technician', icon: Tv, rate: '₹279', badge: 'Certified', bg: 'bg-teal-50 text-teal-600 border-teal-200 hover:border-teal-400' },
  ];

  const highlights = [
    {
      icon: ShieldCheck,
      title: 'Aadhaar & NCCT Verified',
      desc: '100% background-checked skilled workers from certified cooperative societies with verifiable skill badges.',
      color: 'text-teal-600 bg-teal-50 border-teal-200'
    },
    {
      icon: HeartHandshake,
      title: '100% Fair Wages, Zero Exploitation',
      desc: 'Zero platform commission taken from workers. Every rupee goes directly to the worker along with social security benefits.',
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200'
    },
    {
      icon: Award,
      title: '₹25,000 Suraksha Kavach Escrow',
      desc: 'Customer payments are held in secure escrow. Inspect completion photo proof before releasing funds with damage protection.',
      color: 'text-blue-600 bg-blue-50 border-blue-200'
    },
    {
      icon: AlertTriangle,
      title: '15-Minute Emergency SOS',
      desc: 'On-demand rapid dispatch for urgent pipe bursts, electrical short circuits, and critical repairs.',
      color: 'text-rose-600 bg-rose-50 border-rose-200'
    }
  ];

  const workflowSteps = [
    {
      step: '01',
      title: 'Diagnose or Search',
      desc: 'Use AI Sahayak with voice/text to estimate fair repair costs or pick a certified worker by category & live GPS distance.'
    },
    {
      step: '02',
      title: 'Instant Cooperative Dispatch',
      desc: 'Book transparently with statutory minimum wage floors set democratically by district cooperative societies.'
    },
    {
      step: '03',
      title: 'Live Service & Photo Proof',
      desc: 'Worker arrives, completes service, and uploads before/after verification photos directly from job site.'
    },
    {
      step: '04',
      title: 'Escrow UPI Release + Welfare',
      desc: 'You approve the job and pay via QR code. 100% payout released directly to worker + social security pension credited.'
    }
  ];

  const comparisonData = [
    { feature: 'Platform Commission Cut', sahakar: '0% (Direct Cooperative)', others: '20% to 35% Deductions' },
    { feature: 'Worker Social Security & Pension', sahakar: 'Included with Every Booking', others: 'None (Unorganized)' },
    { feature: 'Skill Certification Standard', sahakar: 'NCCT & Aadhaar Verified', others: 'Basic Self-declaration' },
    { feature: 'Damage Guarantee / Escrow', sahakar: '₹25,000 Suraksha Kavach', others: 'Lengthy Claim Process' },
    { feature: 'Wage Governance', sahakar: 'Democratic Floor by District', others: 'Algorithmic Surge Penalties' }
  ];

  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    openAuthModal('register_customer');
  };

  return (
    <div className="space-y-16 font-sans text-slate-800 pb-12">
      
      {/* 1. HERO SECTION (SPLIT WEB LAYOUT) */}
      <section className="relative bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 lg:p-14 shadow-2xl overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Headline, Description, CTAs */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/40 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <Sparkles className="w-4 h-4 text-teal-300 shrink-0" />
              <span>Smart India Hackathon 2026 • Ministry of Cooperation</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-[1.15]">
              India’s First <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-300 to-teal-200">Decentralized Cooperative</span> Gig Workforce Platform
            </h1>

            <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-xl">
              Book certified local electricians, plumbers, carpenters, and technicians at fair rates with live GPS dispatch. 100% direct payouts to workers, automated social security, and ₹25,000 Suraksha Kavach escrow protection.
            </p>

            {/* Quick Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={() => openAuthModal('register_customer')}
                className="py-3.5 px-6 bg-gradient-to-r from-teal-400 via-teal-500 to-emerald-500 hover:from-teal-300 hover:to-emerald-400 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-teal-500/25 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Book a Service Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => openAuthModal('register_worker')}
                className="py-3.5 px-5 bg-slate-800/90 hover:bg-slate-700/90 text-white font-bold text-sm rounded-2xl border border-slate-700 shadow-md transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
              >
                <UserCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Join as Certified Worker</span>
              </button>

              <button
                onClick={() => setEmergencyModalOpen(true)}
                className="py-3.5 px-5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-2 sos-pulse-btn active:scale-95"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Emergency SOS 15M</span>
              </button>
            </div>

            {/* Trust Highlights Row */}
            <div className="pt-4 border-t border-slate-800/80 grid grid-cols-3 gap-4">
              <div>
                <p className="text-xl sm:text-2xl font-black text-teal-400">4,500+</p>
                <p className="text-xs text-slate-400 font-medium">Verified Workers</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-emerald-400">0% Cut</p>
                <p className="text-xs text-slate-400 font-medium">Platform Commission</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-amber-400">₹25,000</p>
                <p className="text-xs text-slate-400 font-medium">Suraksha Protection</p>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Live Platform Preview Card */}
          <div className="lg:col-span-5">
            <div className="bg-slate-800/90 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-5 shadow-2xl space-y-4">
              
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Live Cooperative Network</span>
                </div>
                <span className="text-xs font-bold bg-teal-500/20 text-teal-300 px-2.5 py-0.5 rounded-full border border-teal-500/30">
                  Active
                </span>
              </div>

              {/* Sample Live Worker Match Card */}
              <div className="bg-slate-900/90 rounded-xl p-3.5 border border-slate-700/60 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Latest Dispatch</span>
                  <span className="text-xs font-bold text-emerald-400">● On Way (0.8 km)</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-slate-950 font-black text-sm">
                    RK
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-white truncate">Rajesh Kumar</h4>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <p className="text-[11px] text-teal-300 font-medium">NCCT Level 2 Certified Electrician</p>
                    <p className="text-[10px] text-slate-400 truncate">Janata Cooperative Society</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-white">₹350/hr</span>
                    <div className="flex items-center gap-1 text-[11px] text-amber-400 justify-end">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>4.9</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Sahayak Highlight */}
              <div className="bg-gradient-to-r from-teal-950/60 to-slate-900 rounded-xl p-3 border border-teal-500/30 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-teal-500/20 text-teal-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="text-xs font-bold text-white">Sahakar AI Sahayak</h5>
                  <p className="text-[11px] text-slate-300 truncate">Voice diagnostic & fair wage estimator</p>
                </div>
                <button
                  onClick={() => openAuthModal('register_customer')}
                  className="px-2.5 py-1 bg-teal-500 text-slate-950 rounded-lg text-xs font-black hover:bg-teal-400"
                >
                  Try Free
                </button>
              </div>

              {/* Escrow Guarantee Pill */}
              <div className="flex items-center justify-between text-xs text-slate-300 px-1 pt-1">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-teal-400" />
                  <span>Escrow Guarantee Protected</span>
                </span>
                <span className="font-bold text-teal-400">₹25,000 Cover</span>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 2. STATS BAR (4 METRICS) */}
      <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <h3 className="text-2xl sm:text-3xl font-black text-teal-600">4,500+</h3>
            <p className="text-xs sm:text-sm font-bold text-slate-800">Skilled Craftsmen</p>
            <p className="text-xs text-slate-400">100% Aadhaar & NCCT certified</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl sm:text-3xl font-black text-emerald-600">0%</h3>
            <p className="text-xs sm:text-sm font-bold text-slate-800">Intermediary Commission</p>
            <p className="text-xs text-slate-400">100% direct payouts to workers</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl sm:text-3xl font-black text-blue-600">15 Mins</h3>
            <p className="text-xs sm:text-sm font-bold text-slate-800">SOS Emergency SLA</p>
            <p className="text-xs text-slate-400">Rapid local cooperative dispatch</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl sm:text-3xl font-black text-amber-600">₹25,000</h3>
            <p className="text-xs sm:text-sm font-bold text-slate-800">Suraksha Guarantee</p>
            <p className="text-xs text-slate-400">Zero-risk escrow payment model</p>
          </div>
        </div>
      </section>

      {/* 3. POPULAR SERVICES - 6 RICH CARDS GRID */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">Certified Services</span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
              Explore Popular On-Demand Services
            </h2>
          </div>
          <button
            onClick={() => openAuthModal('register_customer')}
            className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>View All Categories & Workers</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {serviceCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-xl transition-all duration-200 cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-2xl border ${cat.bg} transition-transform group-hover:scale-110 shadow-sm`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-extrabold uppercase">
                      {cat.badge}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-slate-900 group-hover:text-teal-700 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">
                    Verified local specialists equipped with certified tools and background clearance.
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Starting From</span>
                    <span className="font-black text-slate-900 text-sm">{cat.rate} / visit</span>
                  </div>
                  <button className="px-3 py-1.5 bg-slate-900 group-hover:bg-teal-600 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1">
                    <span>Book</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. COOPERATIVE MODEL VS PRIVATE AGGREGATORS (COMPARISON TABLE) */}
      <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-800 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">The Cooperative Advantage</span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Why SahakarSeva Beats Traditional Aggregators
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            A sustainable, equitable ecosystem where customers get lower prices, workers keep 100% of their earnings, and social security is guaranteed.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Feature / Guarantee</th>
                <th className="py-3 px-4 text-teal-400 font-extrabold">SahakarSeva (Cooperative)</th>
                <th className="py-3 px-4 text-slate-400">Private Tech Aggregators</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-medium">
              {comparisonData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-white">{row.feature}</td>
                  <td className="py-3 px-4 text-teal-300 font-bold flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{row.sahakar}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-400 flex items-center gap-2">
                    <X className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{row.others}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. HOW IT WORKS (4-STEP WORKFLOW) */}
      <section className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">Transparent & Simple</span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            How SahakarSeva Works
          </h2>
          <p className="text-xs text-slate-500">
            From problem diagnosis to escrow release in four simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {workflowSteps.map((s, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm relative group hover:border-teal-400 transition-colors">
              <span className="text-3xl font-black text-teal-500/20 group-hover:text-teal-500/40 transition-colors block mb-2 font-mono">
                {s.step}
              </span>
              <h3 className="font-extrabold text-sm text-slate-900 mb-1">
                {s.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FOUR CORE HIGHLIGHTS */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">Built on Trust</span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Why Thousands Trust SahakarSeva
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className={`p-3 rounded-2xl border ${item.color} w-fit`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 leading-snug">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. READY TO JOIN CTA BANNER */}
      <section className="bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 text-white rounded-3xl p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl text-center md:text-left">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            Ready to experience fair, reliable home services?
          </h2>
          <p className="text-xs sm:text-sm text-teal-100 font-medium">
            Join thousands of satisfied households and verified cooperative workers across India.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full sm:w-auto">
          <button
            onClick={() => openAuthModal('register_customer')}
            className="px-6 py-3.5 bg-slate-950 hover:bg-slate-900 text-white font-black text-xs rounded-2xl shadow-xl transition-transform active:scale-95"
          >
            Get Started as Customer
          </button>
          <button
            onClick={() => openAuthModal('register_worker')}
            className="px-6 py-3.5 bg-white/15 hover:bg-white/25 text-white font-black text-xs rounded-2xl border border-white/30 backdrop-blur transition-transform active:scale-95"
          >
            Register as Worker
          </button>
        </div>
      </section>

    </div>
  );
};
