import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  Sparkles, Mic, MicOff, Send, X, AlertTriangle, ShieldCheck,
  Clock, Wrench, CheckCircle2, ArrowRight, TrendingUp, Users, Heart
} from 'lucide-react';
import { PRESET_DIAGNOSTICS, diagnoseProblem } from '../../utils/aiDiagnosticEngine';
import { translateCategory, translateWorkerName } from '../../utils/translateHelpers';

export const CERTIFIED_CATEGORY_EXPERTS = {
  electrician: {
    id: 'wrk_seed_elec',
    name: 'Rajesh Sharma',
    photo: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=250',
    category: 'electrician',
    societyId: 'soc_delhi_1',
    societyName: 'Delhi NCR Shramik Sahakari Samiti Ltd.',
    rating: 4.9,
    reviewsCount: 38,
    jobsCompleted: 142,
    experienceYears: 8,
    hourlyRate: 350,
    ncctLevel: 'Level 3 Master Craftsman',
    kycStatus: 'Aadhaar & NCCT Verified',
    policeVerification: 'Clear (Verified by Police)',
    ayushmanCard: 'AB-8821-3940-1120',
    pfAccountNumber: 'DL/CPM/09812',
    onDuty: true,
    skills: ['Circuit Tripping', 'MCB Replacement', 'Switchboard Rewiring', 'Short Circuit Isolation'],
    phone: '+91 98112 34567',
    distanceKm: 1.2
  },
  plumber: {
    id: 'wrk_1790319807439',
    name: 'pravalika',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    category: 'plumber',
    societyId: 'soc_delhi_1',
    societyName: 'Delhi NCR Shramik Sahakari Samiti Ltd.',
    rating: 5.0,
    reviewsCount: 19,
    jobsCompleted: 64,
    experienceYears: 3,
    hourlyRate: 350,
    ncctLevel: 'Level 2 Certified Craftsman',
    kycStatus: 'Aadhaar & NCCT Verified',
    policeVerification: 'Clear (Verified by Police)',
    ayushmanCard: 'AB-1234-5678-2323',
    pfAccountNumber: 'DL/CPM/07463',
    onDuty: true,
    skills: ['High Pressure Leak Fix', 'Basin Installation', 'Concealed Pipeline Repair'],
    phone: '+91 70322 72683',
    distanceKm: 0.9
  },
  technician: {
    id: 'wrk_seed_tech',
    name: 'Mohammed Arif',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=250',
    category: 'technician',
    societyId: 'soc_delhi_1',
    societyName: 'Delhi NCR Shramik Sahakari Samiti Ltd.',
    rating: 4.9,
    reviewsCount: 45,
    jobsCompleted: 180,
    experienceYears: 7,
    hourlyRate: 450,
    ncctLevel: 'Level 3 Certified HVAC Specialist',
    kycStatus: 'Aadhaar & NCCT Verified',
    policeVerification: 'Clear (Verified by Police)',
    ayushmanCard: 'AB-4491-1029-4412',
    pfAccountNumber: 'DL/CPM/10928',
    onDuty: true,
    skills: ['AC Gas Refill', 'Compressor Diagnostic', 'PCB Inverter Repair', 'Appliance Servicing'],
    phone: '+91 98711 55678',
    distanceKm: 1.5
  },
  carpenter: {
    id: 'wrk_seed_carp',
    name: 'Harpreet Singh',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    category: 'carpenter',
    societyId: 'soc_delhi_1',
    societyName: 'Delhi NCR Shramik Sahakari Samiti Ltd.',
    rating: 4.8,
    reviewsCount: 29,
    jobsCompleted: 98,
    experienceYears: 6,
    hourlyRate: 380,
    ncctLevel: 'Level 2 Certified Woodcraftsman',
    kycStatus: 'Aadhaar & NCCT Verified',
    policeVerification: 'Clear (Verified by Police)',
    ayushmanCard: 'AB-7762-9901-3321',
    pfAccountNumber: 'DL/CPM/08273',
    onDuty: true,
    skills: ['Door Lock Replacement', 'Hinge Realignment', 'Modular Furniture Repair'],
    phone: '+91 98223 44556',
    distanceKm: 1.8
  },
  cleaner: {
    id: 'wrk_seed_clean',
    name: 'Sunita Devi',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250',
    category: 'cleaner',
    societyId: 'soc_delhi_1',
    societyName: 'Delhi NCR Shramik Sahakari Samiti Ltd.',
    rating: 4.9,
    reviewsCount: 52,
    jobsCompleted: 210,
    experienceYears: 5,
    hourlyRate: 300,
    ncctLevel: 'Level 2 Deep Sanitation Expert',
    kycStatus: 'Aadhaar & NCCT Verified',
    policeVerification: 'Clear (Verified by Police)',
    ayushmanCard: 'AB-3321-7789-5561',
    pfAccountNumber: 'DL/CPM/06519',
    onDuty: true,
    skills: ['Post-Renovation Cleaning', 'Bathroom Deep Sanitization', 'Floor Buffing'],
    phone: '+91 98334 55667',
    distanceKm: 1.1
  },
  painter: {
    id: 'wrk_seed_paint',
    name: 'Santosh Yadav',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    category: 'painter',
    societyId: 'soc_delhi_1',
    societyName: 'Delhi NCR Shramik Sahakari Samiti Ltd.',
    rating: 4.8,
    reviewsCount: 31,
    jobsCompleted: 115,
    experienceYears: 7,
    hourlyRate: 350,
    ncctLevel: 'Level 2 Wall Texture Specialist',
    kycStatus: 'Aadhaar & NCCT Verified',
    policeVerification: 'Clear (Verified by Police)',
    ayushmanCard: 'AB-9981-2234-8871',
    pfAccountNumber: 'DL/CPM/07712',
    onDuty: true,
    skills: ['Damp Proofing', 'Putty & Acrylic Emulsion', 'Water Seepage Seal'],
    phone: '+91 98445 66778',
    distanceKm: 2.1
  },
  domestic_helper: {
    id: 'wrk_1790324215269',
    name: 'ash',
    photo: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=250',
    category: 'domestic_helper',
    societyId: 'soc_delhi_1',
    societyName: 'Delhi NCR Shramik Sahakari Samiti Ltd.',
    rating: 4.9,
    reviewsCount: 41,
    jobsCompleted: 130,
    experienceYears: 4,
    hourlyRate: 320,
    ncctLevel: 'Level 2 Certified Home Assistant',
    kycStatus: 'Aadhaar & NCCT Verified',
    policeVerification: 'Clear (Verified by Police)',
    ayushmanCard: 'AB-6612-8874-9901',
    pfAccountNumber: 'DL/CPM/05432',
    onDuty: true,
    skills: ['Home Cooking', 'Dishwashing', 'Housekeeping'],
    phone: '+91 98556 77889',
    distanceKm: 1.4
  }
};

export const AiSahayakModal = ({ isOpen, onClose }) => {
  const { workers, radiusKm, setSelectedWorker, setBookingModalOpen } = useApp();
  const { t, lang } = useLanguage();

  const [inputQuery, setInputQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const recognitionRef = useRef(null);

  // Setup Web Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputQuery(transcript);
        setIsListening(false);
        handleRunDiagnosis(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [lang]);

  if (!isOpen) return null;

  const toggleListening = () => {
    if (!speechSupported || !recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please type your issue below.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleRunDiagnosis = (text) => {
    const targetText = text || inputQuery;
    if (!targetText.trim()) return;

    setIsAnalyzing(true);
    setTimeout(() => {
      const result = diagnoseProblem(targetText);
      setDiagnosticResult(result);
      setIsAnalyzing(false);
    }, 400);
  };

  const handleSelectPreset = (preset) => {
    setInputQuery(preset.query);
    handleRunDiagnosis(preset.query);
  };

  // Category normalizer for robust cross-dialect matching
  const normalizeCategory = (cat) => {
    if (!cat) return '';
    const c = String(cat).toLowerCase().trim();
    if (c.includes('plumb')) return 'plumber';
    if (c.includes('elect')) return 'electrician';
    if (c.includes('carp')) return 'carpenter';
    if (c.includes('paint')) return 'painter';
    if (c.includes('clean') || c.includes('sanit')) return 'cleaner';
    if (c.includes('tech') || c.includes('ac') || c.includes('appliance') || c.includes('hvac')) return 'technician';
    if (c.includes('cook') || c.includes('help') || c.includes('maid')) return 'domestic_helper';
    return c;
  };

  const targetCategory = normalizeCategory(diagnosticResult?.category);

  // 1. Strict category-matching against registered workers
  const matchedWorkers = diagnosticResult
    ? workers.filter((w) => normalizeCategory(w.category) === targetCategory)
    : [];

  // 2. Fallback to certified NCCT cooperative craftsman for THIS EXACT trade (never show an unrelated trade)
  const topWorker = matchedWorkers[0] 
    || (targetCategory && CERTIFIED_CATEGORY_EXPERTS[targetCategory]) 
    || CERTIFIED_CATEGORY_EXPERTS['electrician'];

  const handleBookWorker = () => {
    if (topWorker) {
      const workerToBook = {
        ...topWorker,
        category: topWorker.category || targetCategory
      };
      setSelectedWorker(workerToBook);
      onClose();
      setBookingModalOpen(true);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-scaleUp">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-950 via-teal-900 to-slate-900 text-white p-4 relative flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-teal-500/20 text-teal-300 border border-teal-400/30 shadow-inner">
              <Sparkles className="w-5 h-5 text-teal-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-teal-300 bg-teal-500/20 px-2 py-0.5 rounded-full border border-teal-400/30">
                  SIH26089 Innovation
                </span>
                <span className="text-[10px] text-slate-300 font-bold">Multilingual AI</span>
              </div>
              <h3 className="text-base font-extrabold text-white leading-tight">
                Sahakar AI Sahayak
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
          
          {/* Natural Language Voice & Text Input Box */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold text-slate-700 flex items-center justify-between">
              <span>Describe the issue (Voice or Text in any language)</span>
              <span className="text-[10px] text-teal-600 font-bold">हिंदी / English / मराठी</span>
            </label>

            <div className="relative">
              <textarea
                rows={2}
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="E.g., Kitchen pipe burst under sink or स्विच बोर्ड में चिंगारी आ रही है..."
                className="w-full pl-3 pr-20 py-2.5 rounded-2xl border border-slate-300 bg-slate-50 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-inner resize-none placeholder:text-slate-400"
              />

              <div className="absolute right-2 top-2.5 flex items-center gap-1">
                {speechSupported && (
                  <button
                    type="button"
                    onClick={toggleListening}
                    className={`p-2 rounded-xl transition-all shadow-sm ${
                      isListening
                        ? 'bg-rose-600 text-white animate-pulse'
                        : 'bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200'
                    }`}
                    title={isListening ? 'Listening...' : 'Speak your issue'}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleRunDiagnosis()}
                  disabled={!inputQuery.trim() || isAnalyzing}
                  className="p-2 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white shadow-sm transition-all"
                  title="Run AI Diagnosis"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            {isListening && (
              <p className="text-[11px] font-bold text-rose-600 flex items-center gap-1.5 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                Listening... Speak naturally in your mother tongue now
              </p>
            )}
          </div>

          {/* Preset Issue Quick Buttons */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              1-Tap Common Diagnostics:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_DIAGNOSTICS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-teal-50 hover:border-teal-300 border border-slate-200 text-[11px] font-semibold text-slate-700 transition-all text-left"
                >
                  {lang === 'hi' ? preset.labelHi : preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* AI Analysis Loading State */}
          {isAnalyzing && (
            <div className="p-6 text-center space-y-2 bg-teal-50/60 rounded-2xl border border-teal-200">
              <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-xs font-bold text-teal-900">
                AI Sahayak is analyzing issue, hazard level & fair pricing...
              </p>
            </div>
          )}

          {/* Diagnosis Results Card */}
          {diagnosticResult && !isAnalyzing && (
            <div className="space-y-3.5 pt-1 animate-fadeIn">
              
              {/* Critical Hazard Alert Banner */}
              {diagnosticResult.hazardWarning && (
                <div className="p-3 rounded-2xl bg-amber-500/10 border-2 border-amber-500 text-amber-950 flex items-start gap-2.5 shadow-sm">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-extrabold text-amber-900 leading-snug">
                      Safety Warning Detected
                    </p>
                    <p className="text-[11px] font-medium text-amber-800 mt-0.5">
                      {diagnosticResult.hazardWarning}
                    </p>
                  </div>
                </div>
              )}

              {/* Diagnosis Overview */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-teal-700 bg-teal-100 px-2 py-0.5 rounded-md">
                    {translateCategory(diagnosticResult.category, t)}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    diagnosticResult.severity === 'Critical' ? 'bg-rose-100 text-rose-800' :
                    diagnosticResult.severity === 'High' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    Severity: {diagnosticResult.severity}
                  </span>
                </div>

                <h4 className="font-extrabold text-sm text-slate-900">
                  {diagnosticResult.issueTitle}
                </h4>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Clock className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>Est. Time: <strong>~{diagnosticResult.estimatedDurationMins} mins</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Wrench className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>Tools: <strong>{diagnosticResult.requiredTools.length} Required</strong></span>
                  </div>
                </div>
              </div>

              {/* Transparent Cooperative vs Corporate Cost Comparison */}
              <div className="border border-teal-200 rounded-2xl p-3.5 bg-gradient-to-br from-teal-50/80 via-white to-emerald-50/50 shadow-sm space-y-2.5">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Fair-Wage Cooperative vs. Corporate Price Matrix</span>
                  </h5>
                  <span className="text-[10px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded-full shadow-sm">
                    Save {diagnosticResult.pricing.savingsPercent}%
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {/* SahakarSeva Cooperative Column */}
                  <div className="p-2.5 rounded-xl bg-white border-2 border-emerald-500 shadow-sm space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-extrabold text-emerald-800">
                      <span>🇮🇳 SahakarSeva</span>
                      <span>₹{diagnosticResult.pricing.coopTotal}</span>
                    </div>
                    <div className="text-[10px] text-slate-600 space-y-0.5 border-t border-slate-100 pt-1">
                      <p>✓ Worker Base Wage: <strong>₹{diagnosticResult.pricing.coopWorkerShare}</strong> (90%)</p>
                      <p>✓ Ayushman Healthcare: <strong>₹{diagnosticResult.pricing.coopWelfareFund}</strong> (5%)</p>
                      <p>✓ Tech & Audit: <strong>₹{diagnosticResult.pricing.coopPlatformOps}</strong> (5%)</p>
                      <p className="font-bold text-emerald-700">✓ 0% Exploitative Cut</p>
                    </div>
                  </div>

                  {/* Corporate Aggregator Column */}
                  <div className="p-2.5 rounded-xl bg-slate-100/90 border border-slate-300 space-y-1 opacity-90">
                    <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-700">
                      <span>🏢 Corporate App</span>
                      <span className="line-through text-slate-500">₹{diagnosticResult.pricing.corporateTotal}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 space-y-0.5 border-t border-slate-200 pt-1">
                      <p>✗ Worker Base: ~₹380</p>
                      <p>✗ 28% Commission: ₹{diagnosticResult.pricing.corporateCommission}</p>
                      <p>✗ Convenience Fee: ₹{diagnosticResult.pricing.corporatePlatformFee}</p>
                      <p className="text-rose-600 font-bold">✗ 0% Health/PF Fund</p>
                    </div>
                  </div>
                </div>

                <p className="text-[10px] text-slate-500 text-center font-medium">
                  By booking through SahakarSeva, you save <strong className="text-emerald-700 font-bold">₹{diagnosticResult.pricing.customerSavings}</strong> and fund worker social security.
                </p>
              </div>

              {/* Matched Certified Worker */}
              {topWorker && (
                <div className="p-3 bg-white border border-slate-200 rounded-2xl flex items-center justify-between gap-3 shadow-sm">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {topWorker.photo ? (
                      <img
                        src={topWorker.photo}
                        alt={topWorker.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-teal-500 shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center shrink-0">
                        {topWorker.name ? topWorker.name.substring(0, 2) : 'WK'}
                      </div>
                    )}
                    <div className="min-w-0">
                      <h5 className="font-extrabold text-xs text-slate-900 truncate flex items-center gap-1">
                        <span>{translateWorkerName(topWorker.name, lang)}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      </h5>
                      <p className="text-[11px] font-bold text-teal-700 truncate">
                        {translateCategory(topWorker.category || targetCategory, t)} Specialist
                      </p>
                      <p className="text-[10px] text-slate-500 truncate">
                        {topWorker.ncctLevel} • {topWorker.distanceKm || 0.8} km away
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleBookWorker}
                    className="px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-extrabold text-xs shadow-md transition-all flex items-center gap-1 shrink-0 active:scale-95"
                  >
                    <span>Book Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-[10px] text-slate-400">
          Powered by National Council for Cooperative Training (NCCT) Fair Wage Framework
        </div>

      </div>
    </div>
  );
};
