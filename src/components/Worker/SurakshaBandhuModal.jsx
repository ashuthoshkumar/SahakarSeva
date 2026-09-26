import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldAlert, AlertTriangle, Phone, MapPin, Users, Radio, 
  Volume2, VolumeX, Mic, CheckCircle2, X, Clock, Navigation, 
  Share2, ShieldCheck, HeartHandshake, Eye, AlertOctagon, HelpCircle
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const EMERGENCY_TYPES = [
  {
    id: 'harassment',
    label: 'Harassment & Safety Threat',
    labelHi: 'दुर्व्यवहार या सुरक्षा खतरा',
    desc: 'Verbal/physical harassment, locked premises, hostile customer',
    icon: AlertOctagon,
    severity: 'critical',
    badgeColor: 'bg-rose-600 text-white'
  },
  {
    id: 'electrical_accident',
    label: 'Electrical Shock & Fire',
    labelHi: 'बिजली का झटका या आग',
    desc: 'Live wire contact, spark explosion, flash burns',
    icon: AlertTriangle,
    severity: 'critical',
    badgeColor: 'bg-amber-600 text-white'
  },
  {
    id: 'fall_injury',
    label: 'Fall & Physical Injury',
    labelHi: 'गिरने से गंभीर चोट / दुर्घटना',
    desc: 'Ladder collapse, deep cut, fractures, head trauma',
    icon: ShieldAlert,
    severity: 'high',
    badgeColor: 'bg-red-600 text-white'
  },
  {
    id: 'medical_emergency',
    label: 'Medical Emergency',
    labelHi: 'अचानक स्वास्थ्य आपातकाल',
    desc: 'Chest pain, heat stroke, breathing difficulty, fainting',
    icon: HeartHandshake,
    severity: 'high',
    badgeColor: 'bg-purple-600 text-white'
  }
];

export const MOCK_NEARBY_PEERS = [
  {
    id: 'peer_1',
    name: 'Rajesh Kumar',
    trade: 'Electrician (NCCT Level 3)',
    phone: '+91 98112 34567',
    distanceKm: 0.35,
    etaMinutes: 3,
    status: 'En-route on two-wheeler',
    avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 'peer_2',
    name: 'Manoj Verma',
    trade: 'Plumber & Sanitation Lead',
    phone: '+91 98711 22334',
    distanceKm: 0.72,
    etaMinutes: 5,
    status: 'Alert received • Moving towards location',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 'peer_3',
    name: 'Sunita Devi',
    trade: 'Housekeeping & Care Lead',
    phone: '+91 98990 44556',
    distanceKm: 1.1,
    etaMinutes: 8,
    status: 'Standby • Society Vigilance Contacted',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150'
  }
];

export const SurakshaBandhuModal = ({ isOpen, onClose, worker, activeJob }) => {
  const { t, lang } = useLanguage();
  const [selectedIncident, setSelectedIncident] = useState('harassment');
  const [sosActive, setSosActive] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [dispatchedTime, setDispatchedTime] = useState(null);
  const [isAudioRecording, setIsAudioRecording] = useState(false);
  const [isSirenMuted, setIsSirenMuted] = useState(false);
  const [standDownPin, setStandDownPin] = useState('');
  const [standDownError, setStandDownError] = useState('');
  const [showStandDownInput, setShowStandDownInput] = useState(false);

  const audioCtxRef = useRef(null);
  const oscillatorRef = useRef(null);
  const sirenTimerRef = useRef(null);

  // Load existing active SOS from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('sahakar_active_sos');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.active) {
          setSosActive(true);
          setSelectedIncident(parsed.incidentId || 'harassment');
          setDispatchedTime(parsed.dispatchedAt || new Date().toLocaleTimeString());
        }
      }
    } catch (e) {}
  }, []);

  // Web Audio API Siren Generator
  const startSiren = () => {
    try {
      if (isSirenMuted) return;
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;

      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }

      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      const osc = audioCtxRef.current.createOscillator();
      const gain = audioCtxRef.current.createGain();

      osc.type = 'sawtooth';
      gain.gain.setValueAtTime(0.08, audioCtxRef.current.currentTime);

      osc.connect(gain);
      gain.connect(audioCtxRef.current.destination);

      let toggle = false;
      osc.frequency.setValueAtTime(800, audioCtxRef.current.currentTime);
      osc.start();
      oscillatorRef.current = osc;

      sirenTimerRef.current = setInterval(() => {
        if (!oscillatorRef.current || !audioCtxRef.current) return;
        toggle = !toggle;
        const targetFreq = toggle ? 960 : 720;
        oscillatorRef.current.frequency.exponentialRampToValueAtTime(
          targetFreq,
          audioCtxRef.current.currentTime + 0.3
        );
      }, 400);
    } catch (err) {
      console.warn('Audio siren notice:', err);
    }
  };

  const stopSiren = () => {
    try {
      if (sirenTimerRef.current) clearInterval(sirenTimerRef.current);
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
        oscillatorRef.current = null;
      }
    } catch (e) {}
  };

  useEffect(() => {
    return () => {
      stopSiren();
      if (audioCtxRef.current) {
        try { audioCtxRef.current.close(); } catch (e) {}
      }
    };
  }, []);

  const triggerSOSNow = () => {
    const timeStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setSosActive(true);
    setDispatchedTime(timeStr);
    setIsAudioRecording(true);
    startSiren();

    const sosPayload = {
      active: true,
      workerId: worker?.id || 'wrk_current',
      workerName: worker?.name || 'Worker',
      workerPhone: worker?.phone || '+91 97013 92418',
      societyId: worker?.societyId || 'soc_delhi_1',
      incidentId: selectedIncident,
      dispatchedAt: timeStr,
      location: activeJob?.address || 'Site: Flat 402, Royal Palms, Connaught Place, New Delhi',
      jobId: activeJob?.id || 'job_live_01',
      status: 'RESPONDING'
    };

    localStorage.setItem('sahakar_active_sos', JSON.stringify(sosPayload));
  };

  const toggleSirenMute = () => {
    if (isSirenMuted) {
      setIsSirenMuted(false);
      if (sosActive) startSiren();
    } else {
      setIsSirenMuted(true);
      stopSiren();
    }
  };

  const handleStandDown = () => {
    if (standDownPin !== '1234' && standDownPin !== '0000') {
      setStandDownError('Invalid PIN. Use 1234 to stand-down safely.');
      return;
    }
    stopSiren();
    setSosActive(false);
    setIsAudioRecording(false);
    setShowStandDownInput(false);
    setStandDownPin('');
    setStandDownError('');
    localStorage.removeItem('sahakar_active_sos');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className={`relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border-2 transition-all ${
        sosActive ? 'border-rose-500 ring-4 ring-rose-500/20' : 'border-slate-200'
      }`}>
        
        {/* Header Bar */}
        <div className={`p-5 text-white flex items-center justify-between ${
          sosActive ? 'bg-gradient-to-r from-rose-700 via-red-600 to-rose-800 animate-pulse' : 'bg-gradient-to-r from-slate-900 to-slate-800'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl ${sosActive ? 'bg-white text-rose-700 shadow-lg' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black tracking-tight">
                  {lang === 'hi' ? 'सहकार सुरक्षा बंधु' : 'Suraksha Bandhu'}
                </h3>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-white/20 border border-white/30 tracking-wider">
                  SIH26089 Peer Network
                </span>
              </div>
              <p className="text-xs text-rose-100 font-medium mt-0.5">
                {sosActive 
                  ? '🚨 ACTIVE EMERGENCY BROADCAST DISPATCHED TO 3 NEARBY PEERS' 
                  : 'Hyperlocal Cooperative Peer Emergency & Anti-Harassment Network'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {sosActive && (
              <button
                onClick={toggleSirenMute}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all text-xs font-bold flex items-center gap-1.5"
                title={isSirenMuted ? 'Unmute Siren' : 'Mute Siren'}
              >
                {isSirenMuted ? <VolumeX className="w-4 h-4 text-amber-300" /> : <Volume2 className="w-4 h-4 text-white" />}
                <span className="hidden sm:inline">{isSirenMuted ? 'Muted' : 'Siren'}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[82vh] overflow-y-auto space-y-6">

          {/* ACTIVE EMERGENCY STATE BANNER */}
          {sosActive ? (
            <div className="space-y-5">
              
              {/* Telemetry Alert Card */}
              <div className="p-4 bg-rose-50 border-2 border-rose-400 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-rose-800 font-black text-sm">
                    <Radio className="w-5 h-5 text-rose-600 animate-ping" />
                    <span>BROADCAST LIVE AT {dispatchedTime || 'NOW'}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-black bg-rose-600 text-white shadow-sm">
                    POLICE 112 & SOCIETY NOTIFIED
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="bg-white p-2.5 rounded-xl border border-rose-200">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Current Location</span>
                    <p className="font-extrabold text-slate-900 truncate">
                      {activeJob?.address || 'Flat 402, Royal Palms, Connaught Place'}
                    </p>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-rose-200">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Dispatched Incident</span>
                    <p className="font-extrabold text-rose-700 capitalize">
                      {EMERGENCY_TYPES.find(e => e.id === selectedIncident)?.label || 'General Distress'}
                    </p>
                  </div>
                </div>

                {isAudioRecording && (
                  <div className="flex items-center justify-between p-2.5 bg-rose-100/70 border border-rose-300 rounded-xl text-xs font-bold text-rose-900">
                    <span className="flex items-center gap-2">
                      <Mic className="w-4 h-4 text-rose-600 animate-pulse" />
                      <span>Discreet Audio Evidence Recorder Active</span>
                    </span>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-rose-600 text-white">REC</span>
                  </div>
                )}
              </div>

              {/* 3 Nearby Responding Peers List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <Users className="w-4 h-4 text-rose-600" />
                    <span>Responding Cooperative Peers (Nearest 1.5 km)</span>
                  </h4>
                  <span className="text-xs font-bold text-emerald-600">3 Peers En-Route</span>
                </div>

                <div className="space-y-2">
                  {MOCK_NEARBY_PEERS.map((peer) => (
                    <div
                      key={peer.id}
                      className="p-3 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-center justify-between gap-3 hover:border-slate-300 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={peer.avatar}
                          alt={peer.name}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-sm"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-slate-900 text-sm">{peer.name}</span>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                              ETA {peer.etaMinutes}m
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 font-medium">{peer.trade} • {peer.distanceKm} km away</p>
                          <p className="text-[11px] text-teal-700 font-bold mt-0.5">{peer.status}</p>
                        </div>
                      </div>

                      <a
                        href={`tel:${peer.phone}`}
                        className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow transition-all flex items-center gap-1 text-xs font-bold shrink-0"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Call</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instant Emergency Dials */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <a
                  href="tel:112"
                  className="py-3 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs text-center flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Police (112)</span>
                </a>
                <a
                  href="tel:+919800011122"
                  className="py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs text-center flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Society Vigilance Desk</span>
                </a>
              </div>

              {/* Stand Down Section */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                {!showStandDownInput ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-800">Situation Under Control?</p>
                      <p className="text-[11px] text-slate-500">Stand down the alert to notify peers you are safe.</p>
                    </div>
                    <button
                      onClick={() => setShowStandDownInput(true)}
                      className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl transition-all"
                    >
                      Stand Down Alert
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 animate-fadeIn">
                    <p className="text-xs font-bold text-slate-700">Enter Security PIN to Confirm Safety (Default: 1234)</p>
                    <div className="flex gap-2">
                      <input
                        type="password"
                        maxLength={4}
                        value={standDownPin}
                        onChange={(e) => setStandDownPin(e.target.value)}
                        placeholder="PIN"
                        className="w-28 px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono text-center text-sm font-bold focus:outline-none focus:border-slate-500"
                      />
                      <button
                        onClick={handleStandDown}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-all"
                      >
                        Confirm I am Safe
                      </button>
                      <button
                        onClick={() => setShowStandDownInput(false)}
                        className="px-3 py-2 text-slate-500 hover:text-slate-700 text-xs font-bold"
                      >
                        Cancel
                      </button>
                    </div>
                    {standDownError && (
                      <p className="text-xs text-rose-600 font-bold">{standDownError}</p>
                    )}
                  </div>
                )}
              </div>

            </div>
          ) : (
            /* PRE-EMERGENCY SELECTION & TRIGGER STATE */
            <div className="space-y-6">

              {/* Context Banner */}
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed text-amber-950">
                  <p className="font-extrabold">Cooperative Member Solidarity Guarantee</p>
                  <p className="mt-0.5 text-amber-800 font-medium">
                    Unlike commercial apps that leave you stranded, SahakarSeva leverages the collective power of cooperative brotherhood. 
                    Activating SOS alerts the 3 nearest registered cooperative technicians within 1.5 km to rush to your assistance.
                  </p>
                </div>
              </div>

              {/* Select Incident Nature */}
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-wider text-slate-600 flex items-center justify-between">
                  <span>1. Select Incident Nature</span>
                  <span className="text-[11px] text-rose-600 font-bold">Fast-Classify for Response Protocol</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {EMERGENCY_TYPES.map((type) => {
                    const Icon = type.icon;
                    const isSelected = selectedIncident === type.id;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setSelectedIncident(type.id)}
                        className={`p-3.5 rounded-2xl border-2 text-left transition-all flex items-start gap-3 ${
                          isSelected
                            ? 'border-rose-600 bg-rose-50/70 shadow-sm'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className={`p-2 rounded-xl shrink-0 ${isSelected ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-slate-900 text-xs">{lang === 'hi' ? type.labelHi : type.label}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{type.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Site Telemetry Summary */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Target Broadcast Coordinates</span>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <MapPin className="w-4 h-4 text-rose-600 shrink-0" />
                  <span className="truncate">{activeJob?.address || 'Site: Flat 402, Royal Palms, Connaught Place, New Delhi'}</span>
                </div>
                <div className="flex items-center gap-4 text-[11px] text-slate-500 font-medium pt-1">
                  <span>Society: <strong className="text-slate-800">Delhi NCR Shramik Sahakari Samiti</strong></span>
                  <span>Radius: <strong className="text-slate-800">1.5 km Hyperlocal</strong></span>
                </div>
              </div>

              {/* BIG RED SOS BROADCAST TRIGGER */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={triggerSOSNow}
                  className="w-full py-5 px-6 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black text-base shadow-xl shadow-red-500/25 transition-all flex items-center justify-center gap-3 active:scale-95 cursor-pointer"
                >
                  <ShieldAlert className="w-6 h-6 animate-pulse" />
                  <span>
                    {lang === 'hi' ? '🚨 अभी आपातकालीन SOS भेजें' : '🚨 BROADCAST INSTANT PEER SOS NOW'}
                  </span>
                </button>
                <p className="text-[11px] text-center text-slate-400 font-medium">
                  Triggers high-decibel siren, dispatches GPS coordinates to 3 nearby peers, notifies Society Secretary & begins evidence recording.
                </p>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Ministry of Cooperation & NCCT Worker Safety Standard</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-700 font-bold hover:bg-slate-200 transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
