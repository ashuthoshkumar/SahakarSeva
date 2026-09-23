import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  Sparkles, Mic, MicOff, Send, X, AlertTriangle, ShieldCheck,
  Clock, Wrench, CheckCircle2, ArrowRight, TrendingUp, Users, Heart
} from 'lucide-react';
import { PRESET_DIAGNOSTICS, diagnoseProblem } from '../../utils/aiDiagnosticEngine';
import { translateCategory, translateWorkerName } from '../../utils/translateHelpers';

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

  // Find best matched certified worker
  const matchedWorkers = diagnosticResult
    ? workers.filter((w) => {
        const dist = w.distanceKm !== undefined && !isNaN(w.distanceKm) ? w.distanceKm : 0.8;
        return w.category === diagnosticResult.category && dist <= radiusKm;
      })
    : [];

  const topWorker = matchedWorkers[0] || workers.find((w) => w.category === diagnosticResult?.category) || workers[0];

  const handleBookWorker = () => {
    if (topWorker) {
      setSelectedWorker(topWorker);
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
