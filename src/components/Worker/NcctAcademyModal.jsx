import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import {
  Award, TrendingUp, BookOpen, CheckCircle2, X, Sparkles,
  Calendar, MapPin, ArrowRight, ShieldCheck, Zap, QrCode,
  Download, ExternalLink, ChevronRight
} from 'lucide-react';

const NCCT_COURSES = [
  {
    id: 'solar_pv_3',
    title: 'Solar Rooftop & Grid-Tied Inverter Technician (Level 3)',
    institute: 'Institute of Cooperative Management (ICM Delhi)',
    duration: '3 Days (Weekend Hybrid)',
    dates: '28 Sep - 30 Sep 2026',
    wageBoost: '+₹170/hr',
    badge: 'High Market Demand',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    desc: 'Grid-tied solar inverters, bi-directional net metering, array tilt optimization & lightning surge arrestors.'
  },
  {
    id: 'ev_charger_3',
    title: 'Commercial EV Fast-Charger Setup & High-Voltage Safety',
    institute: 'RICM Regional Cooperative Training Institute',
    duration: '2 Days (In-Person Workshop)',
    dates: '05 Oct - 06 Oct 2026',
    wageBoost: '+₹200/hr',
    badge: 'Govt. Subsidized',
    badgeColor: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    desc: 'AC/DC commercial EV fast charger commissioning, dedicated earthing standards, and emergency isolation interlocks.'
  },
  {
    id: 'iot_home_3',
    title: 'IoT Smart Automation & Wi-Fi Micro-Circuit Panels',
    institute: 'VAMNICOM National Cooperative Academy',
    duration: '1 Day Intensive Lab',
    dates: '12 Oct 2026',
    wageBoost: '+₹150/hr',
    badge: 'Popular',
    badgeColor: 'bg-purple-50 text-purple-800 border-purple-200',
    desc: 'Smart relay switches, Wi-Fi MCBs, mobile app scene programming & Google Home/Alexa hub integration.'
  }
];

export const NcctAcademyModal = ({ isOpen, onClose }) => {
  const { addNotification } = useApp();
  const { user } = useAuth();

  const [enrolledCourseId, setEnrolledCourseId] = useState(null);
  const [showCertificatePreview, setShowCertificatePreview] = useState(false);

  if (!isOpen) return null;

  const handleEnroll = (course) => {
    setEnrolledCourseId(course.id);
    addNotification(`Enrolled successfully in "${course.title}". Training fees 100% sponsored by Cooperative Welfare Fund!`, 'success');
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
      <div 
        className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header — Official NCCT Academy Institution Look */}
        <div className="bg-slate-900 border-b border-slate-800 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-500/15 border border-indigo-400/30 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-full border border-indigo-400/30">
                  NCCT Statutory Council
                </span>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  100% Free for Members
                </span>
              </div>
              <h3 className="text-base font-black text-white mt-1 leading-tight">
                National Cooperative Skill Academy (NCCT)
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1 text-slate-800 bg-[#f8fafc]">
          
          {/* Current Level vs Target Card — Clean Professional Layout */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                  Your Current Certified Status
                </span>
                <h4 className="text-lg font-black text-slate-900 mt-1">
                  Level 2 Certified Craftsman
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Current Wage Floor: <strong className="text-slate-900">₹350/hr</strong> • Verified Member ID: <strong className="font-mono text-slate-700">{user?.id || 'usr_wrk_1'}</strong>
                </p>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-black text-sm shrink-0">
                Lvl 2
              </div>
            </div>

            {/* AI Skill Growth Banner */}
            <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 rounded-2xl space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-emerald-950 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Recommended Career Advancement:</span>
                </span>
                <span className="text-xs font-black text-emerald-700 bg-white px-2 py-0.5 rounded-md border border-emerald-300">
                  +48% Wage Multiplier
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pt-1">
                You have completed 15+ verified 5-star jobs! You are pre-qualified to advance to <strong>Level 3: Solar PV & Smart Grid Specialist</strong>. Certified workers automatically unlock the higher wage floor of <strong>₹520/hr</strong>.
              </p>
            </div>

            <button
              onClick={() => setShowCertificatePreview(!showCertificatePreview)}
              className="text-xs text-indigo-600 font-bold hover:underline flex items-center gap-1.5 cursor-pointer"
            >
              <QrCode className="w-4 h-4" />
              <span>{showCertificatePreview ? 'Hide Digital Credential' : 'View Verifiable NCCT QR Credential →'}</span>
            </button>

            {/* Simulated Digital Certificate Preview */}
            {showCertificatePreview && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 animate-fadeIn text-center">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div>
                  <h5 className="font-black text-xs text-slate-900 uppercase tracking-wider">
                    National Council for Cooperative Training (NCCT)
                  </h5>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Statutory Certification issued to <strong>{user?.name || 'Ramesh Sharma'}</strong>
                  </p>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-[11px] text-slate-600 font-mono flex items-center justify-between">
                  <span>NCCT-CERT-2026-DL-84920</span>
                  <span className="text-emerald-700 font-bold">✓ Ministry Verified</span>
                </div>
              </div>
            )}
          </div>

          {/* NCCT Sponsored Training Courses */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>Upcoming Free Certification Workshops</span>
              </h4>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Cooperative Sponsored
              </span>
            </div>

            <div className="space-y-3">
              {NCCT_COURSES.map((course) => {
                const isEnrolled = enrolledCourseId === course.id;

                return (
                  <div
                    key={course.id}
                    className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-3 hover:border-indigo-300 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${course.badgeColor}`}>
                            {course.badge}
                          </span>
                          <span className="text-xs font-bold text-emerald-700 flex items-center gap-0.5">
                            <TrendingUp className="w-3.5 h-3.5" />
                            {course.wageBoost} Wage Boost
                          </span>
                        </div>
                        <h5 className="font-black text-slate-900 text-sm leading-snug">
                          {course.title}
                        </h5>
                        <p className="text-xs text-slate-500 mt-0.5">{course.institute}</p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {course.desc}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{course.dates} ({course.duration})</span>
                      </div>

                      <button
                        onClick={() => handleEnroll(course)}
                        disabled={isEnrolled}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          isEnrolled
                            ? 'bg-emerald-600 text-white font-black'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                        }`}
                      >
                        {isEnrolled ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Enrolled (Sponsored)</span>
                          </>
                        ) : (
                          <>
                            <span>Free Enroll</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-100 border-t border-slate-200 text-center text-[11px] text-slate-500 font-medium">
          Accredited by National Council for Cooperative Training (NCCT) • Ministry of Cooperation, New Delhi
        </div>

      </div>
    </div>
  );
};

export default NcctAcademyModal;
