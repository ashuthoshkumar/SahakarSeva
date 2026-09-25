import React from 'react';
import { ShieldCheck, HeartHandshake, PhoneCall, Award, ExternalLink, Globe, Lock, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';

export const WebFooter = ({ setActiveTab }) => {
  const { t, openLanguageModal, lang } = useLanguage();
  const { setEmergencyModalOpen } = useApp();

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-xs font-sans mt-auto">
      {/* Top Value Banner */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-extrabold text-white text-xs">100% Aadhaar & NCCT Verified</h5>
              <p className="text-[11px] text-slate-400">Certified craftsmen with certified skills</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-extrabold text-white text-xs">Zero Middleman Cut</h5>
              <p className="text-[11px] text-slate-400">100% wages go straight to cooperative workers</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-extrabold text-white text-xs">₹25,000 Suraksha Kavach</h5>
              <p className="text-[11px] text-slate-400">Escrow damage protection for every booking</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-extrabold text-white text-xs">15-Minute SOS Dispatch</h5>
              <p className="text-[11px] text-slate-400">Rapid emergency response 24/7</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-400 to-emerald-500 flex items-center justify-center text-slate-950 font-black text-sm shadow">
                🤝
              </div>
              <span className="text-lg font-black text-white tracking-tight">
                Sahakar<span className="text-teal-400">Seva</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Empowering India’s blue-collar gig workforce through digital cooperative federations, algorithmic wage floors, and automated social security ledgers. Built for Smart India Hackathon (SIH 2026).
            </p>
            <div className="pt-1 flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-teal-500/15 text-teal-300 text-[10px] font-bold border border-teal-500/30">
                NCCT Certified
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-[10px] font-bold border border-slate-700">
                SIH26089
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                12 District Federations
              </span>
            </div>
          </div>

          {/* Customer Links */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">For Customers</h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button onClick={() => setActiveTab && setActiveTab('home')} className="hover:text-teal-400 transition-colors">
                  Book a Service
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab && setActiveTab('home')} className="hover:text-teal-400 transition-colors">
                  Verified Worker Directory
                </button>
              </li>
              <li>
                <button onClick={() => setEmergencyModalOpen(true)} className="text-rose-400 hover:text-rose-300 transition-colors font-bold">
                  Emergency SOS Dispatch
                </button>
              </li>
              <li>
                <span className="text-slate-500">Suraksha Kavach (₹25k)</span>
              </li>
              <li>
                <button onClick={() => setActiveTab && setActiveTab('bookings')} className="hover:text-teal-400 transition-colors">
                  Invoices & Receipt History
                </button>
              </li>
            </ul>
          </div>

          {/* Worker & Cooperative Links */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Cooperative Network</h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <span className="text-slate-300">NCCT Skill Certification</span>
              </li>
              <li>
                <span className="text-slate-300">Social Security Passbook</span>
              </li>
              <li>
                <span className="text-slate-300">Emergency Micro-Credit Vault</span>
              </li>
              <li>
                <span className="text-slate-300">District Cooperative Wage Floors</span>
              </li>
              <li>
                <span className="text-slate-300">Society Admin Portal</span>
              </li>
            </ul>
          </div>

          {/* Support & Helpline */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Helpline & Support</h4>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
              <p className="text-[11px] text-slate-400 font-medium">National Cooperative Toll-Free:</p>
              <p className="text-sm font-extrabold text-teal-300 font-mono">1800-SAHAKAR-247</p>
              <p className="text-[10px] text-slate-500">24 Hours / 7 Days Hindi, English, & Regional</p>
            </div>
            <button
              onClick={openLanguageModal}
              className="mt-2 text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1 font-bold"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Languages Supported (8 Regional)</span>
            </button>
          </div>

        </div>
      </div>

      {/* Bottom Legal / Copyright */}
      <div className="border-t border-slate-900 bg-slate-950 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
          <p>© 2026 SahakarSeva Platform • Developed for Smart India Hackathon (NCCT Cooperative Services).</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400">Cooperative Charter</span>
            <span>•</span>
            <span className="hover:text-slate-400">Wage Floor Transparency</span>
            <span>•</span>
            <span className="hover:text-slate-400">Privacy Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
