import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import {
  Award, TrendingUp, BookOpen, CheckCircle2, X, Sparkles,
  Calendar, MapPin, ArrowRight, ShieldCheck, Zap, QrCode
} from 'lucide-react';

const NCCT_COURSES = [
  {
    id: 'solar_pv_3',
    title: 'Solar Rooftop & Inverter Technician (Level 3)',
    institute: 'ICM Delhi (Institute of Cooperative Management)',
    duration: '3 Days (Weekend)',
    dates: '28 Sep - 30 Sep 2026',
    wageBoost: '+₹170/hr',
    badge: 'High Demand',
    desc: 'Grid-tied solar inverters, PV panel wiring, and net metering integration.'
  },
  {
    id: 'ev_charger_3',
    title: 'EV Fast-Charger Setup & Smart Safety (Level 3)',
    institute: 'RICM Regional Cooperative Training Center',
    duration: '2 Days (Hybrid)',
    dates: '05 Oct - 06 Oct 2026',
    wageBoost: '+₹200/hr',
    badge: 'Govt. Subsidized',
    desc: 'AC/DC commercial EV charger installation, earthing standards, and high-voltage safety.'
  },
  {
    id: 'iot_home_3',
    title: 'IoT Smart Switchboards & Home Automation',
    institute: 'VAMNICOM National Cooperative Academy',
    duration: '1 Day Intensive',
    dates: '12 Oct 2026',
    wageBoost: '+₹150/hr',
    badge: 'Popular',
    desc: 'Smart relay switches, Wi-Fi MCBs, voice control hubs (Alexa/Google Home).'
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
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-scaleUp">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-950 via-teal-950 to-slate-900 text-white p-4 relative flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-blue-500/20 text-blue-300 border border-blue-400/30 shadow-inner">
              <Award className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-300 bg-blue-500/20 px-2 py-0.5 rounded-full border border-blue-400/30">
                  NCCT Mandate
                </span>
                <span className="text-[10px] text-slate-300 font-bold">Upskilling Ladder</span>
              </div>
              <h3 className="text-base font-extrabold text-white leading-tight">
                AI Skill Ladder & NCCT Academy
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

        {/* Scrollable Content */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1 text-slate-800">
          
          {/* Current Level vs Next Target Card */}
          <div className="bg-gradient-to-br from-teal-900 via-slate-900 to-slate-950 text-white p-4 rounded-2xl border border-teal-700/40 shadow-md space-y-3 relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-teal-300 tracking-wider">
                  Current Certified Level
                </span>
                <h4 className="text-base font-extrabold text-white mt-0.5">
                  Level 2 Certified Craftsman
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  Base Wage: <strong>₹350/hr</strong> • 15 Verified Jobs Completed
                </p>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 text-xs font-black">
                NCCT Level 2
              </span>
            </div>

            {/* AI Skill Recommendation */}
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/15 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-amber-300 font-extrabold flex items-center gap-1 text-[11px]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Upskilling Recommendation:</span>
                </span>
                <span className="text-emerald-400 font-black text-xs">+48% Earning Boost</span>
              </div>
              <p className="text-xs text-slate-200 leading-snug">
                You qualify to advance to <strong>Level 3: Solar & Smart Grid Specialist</strong>. Completing Level 3 increases your base hourly wage from <strong>₹350/hr → ₹520/hr</strong>!
              </p>
            </div>

            <button
              onClick={() => setShowCertificatePreview(!showCertificatePreview)}
              className="text-xs text-teal-300 font-bold hover:underline flex items-center gap-1"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>{showCertificatePreview ? 'Hide Digital Certificate' : 'Preview Verifiable NCCT Credential →'}</span>
            </button>
          </div>

          {/* Simulated Digital Certificate Preview */}
          {showCertificatePreview && (
            <div className="p-4 bg-amber-50/60 border-2 border-amber-300 rounded-2xl space-y-2 animate-fadeIn text-center">
              <div className="inline-block p-1 bg-white rounded-lg shadow-sm border border-amber-200">
                <ShieldCheck className="w-8 h-8 text-amber-600 mx-auto" />
              </div>
              <h5 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
                National Council for Cooperative Training (NCCT)
              </h5>
              <p className="text-[11px] text-slate-600">
                Verifiable Digital Skill Credential issued to <strong>{user?.name || 'Kavita Verma'}</strong>
              </p>
              <div className="p-2 bg-white rounded-xl border border-slate-200 text-[10px] text-slate-500 font-mono">
                NCCT-CERT-2026-DL-84920 • Ministry of Cooperation Verified
              </div>
            </div>
          )}

          {/* NCCT Sponsored Training Courses */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>Upcoming Regional NCCT Workshops (Free Enrollment)</span>
              </h4>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                100% Sponsored
              </span>
            </div>

            <div className="space-y-3">
              {NCCT_COURSES.map((course) => {
                const isEnrolled = enrolledCourseId === course.id;

                return (
                  <div
                    key={course.id}
                    className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl hover:border-blue-300 transition-all space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[9px] font-black uppercase text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">
                          {course.badge}
                        </span>
                        <h5 className="font-extrabold text-xs text-slate-900 mt-1">
                          {course.title}
                        </h5>
                        <p className="text-[11px] text-slate-500">{course.institute}</p>
                      </div>

                      <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-1 rounded-xl border border-emerald-200 shrink-0">
                        {course.wageBoost}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 leading-snug">
                      {course.desc}
                    </p>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/80 text-xs">
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>{course.dates} ({course.duration})</span>
                      </div>

                      <button
                        onClick={() => handleEnroll(course)}
                        disabled={isEnrolled}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs shadow-sm transition-all flex items-center gap-1 ${
                          isEnrolled
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-blue-600 hover:bg-blue-700 text-white active:scale-95'
                        }`}
                      >
                        {isEnrolled ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Enrolled</span>
                          </>
                        ) : (
                          <>
                            <span>Enroll Free</span>
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
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-[10px] text-slate-400">
          Funded by NCCT Cooperative Education Fund • Govt of India
        </div>

      </div>
    </div>
  );
};
