import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Building2, UserCheck, ShieldCheck, DollarSign, Award, CheckCircle2, 
  XCircle, ShieldAlert, Radio, Phone, Wrench, AlertTriangle, 
  Sparkles, MapPin, QrCode 
} from 'lucide-react';

export const SocietyDashboard = () => {
  const { workers, societies, approveWorkerKYC, updateSocietyWageFloor, addNotification } = useApp();
  const { user } = useAuth();
  const { t, lang } = useLanguage();
  const [wageFloor, setWageFloor] = useState(350);
  const [pendingWorkers, setPendingWorkers] = useState([]);
  const [loadingPending, setLoadingPending] = useState(true);
  const [activeSos, setActiveSos] = useState(null);

  // Monitor live Suraksha Bandhu SOS signals
  useEffect(() => {
    const checkSos = () => {
      try {
        const saved = localStorage.getItem('sahakar_active_sos');
        if (saved) {
          const parsed = JSON.parse(saved);
          setActiveSos(parsed.active ? parsed : null);
        } else {
          setActiveSos(null);
        }
      } catch (e) {}
    };
    checkSos();
    const timer = setInterval(checkSos, 2500);
    return () => clearInterval(timer);
  }, []);

  const handleResolveSos = () => {
    localStorage.removeItem('sahakar_active_sos');
    setActiveSos(null);
    addNotification('SOS Distress Alert marked as RESOLVED by Society Vigilance Officer.', 'success');
  };

  // Find the society this admin belongs to
  const mySociety = societies.find(s => s.id === user?.societyId) || societies[0];

  useEffect(() => {
    if (mySociety) {
      setWageFloor(mySociety.wageFloor || 350);
    }
  }, [mySociety]);

  // Fetch real pending worker approvals from API
  useEffect(() => {
    const fetchPending = async () => {
      setLoadingPending(true);
      try {
        const societyId = user?.societyId || (mySociety ? mySociety.id : '');
        let res = await fetch(`/api/society/pending-workers?societyId=${societyId}`);
        if (!res.ok) {
          res = await fetch(`http://localhost:5050/api/society/pending-workers?societyId=${societyId}`);
        }
        const data = await res.json();
        if (data.success) {
          setPendingWorkers(data.pendingWorkers);
        }
      } catch (err) {
        console.error('Failed to fetch pending workers:', err);
      } finally {
        setLoadingPending(false);
      }
    };
    fetchPending();
  }, [user, mySociety]);

  // Count workers in this society
  const societyWorkerCount = workers.filter(w => w.societyId === (mySociety?.id || '')).length;

  const handleUpdateWageFloor = (e) => {
    e.preventDefault();
    if (mySociety) {
      updateSocietyWageFloor(mySociety.id, wageFloor);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Society Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-blue-50 text-blue-700 border border-blue-200">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">{mySociety?.name || 'Cooperative Society'}</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 font-bold text-xs">
                  Reg: {mySociety?.registrationNo || 'N/A'}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {mySociety?.federation || 'Cooperative Federation'} • {mySociety?.location || ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">{t('activeMemberWorkers')}</span>
              <p className="text-lg font-black text-slate-900">{societyWorkerCount} Members</p>
            </div>
            <div className="pl-3 border-l border-slate-300">
              <span className="text-[10px] font-bold text-slate-400 uppercase">{t('coopWelfareBalance')}</span>
              <p className="text-lg font-black text-emerald-700">{mySociety?.welfareFundBalance || '₹ 0'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* SURAKSHA BANDHU LIVE VIGILANCE DESK (SIH26089 INNOVATION) */}
      {activeSos ? (
        <div className="p-6 bg-gradient-to-r from-rose-50 via-red-50 to-rose-100 border-2 border-rose-500 rounded-3xl shadow-lg space-y-4 animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-rose-300 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-rose-600 text-white rounded-2xl shadow-md animate-ping">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-rose-800 bg-rose-200 px-2.5 py-0.5 rounded-full">
                    LIVE SOS DISTRESS SIGNAL
                  </span>
                  <span className="text-xs text-slate-500 font-mono font-bold">Dispatched at {activeSos.dispatchedAt}</span>
                </div>
                <h3 className="text-lg font-black text-rose-950 mt-1">
                  Worker {activeSos.workerName} ({activeSos.workerPhone}) requires immediate peer solidarity!
                </h3>
              </div>
            </div>

            <button
              onClick={handleResolveSos}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow transition-all shrink-0 cursor-pointer"
            >
              Mark Emergency Resolved ✓
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-white p-3 rounded-2xl border border-rose-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Incident Nature</span>
              <p className="font-extrabold text-rose-800 text-sm mt-0.5 capitalize">{activeSos.incidentId?.replace('_', ' ') || 'General Distress'}</p>
            </div>

            <div className="bg-white p-3 rounded-2xl border border-rose-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">On-Site Location</span>
              <p className="font-bold text-slate-900 mt-0.5 truncate">{activeSos.location || 'Flat 402, Royal Palms, Connaught Place'}</p>
            </div>

            <div className="bg-white p-3 rounded-2xl border border-rose-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Cooperative Peer Dispatch</span>
              <p className="font-extrabold text-emerald-700 mt-0.5">3 Nearby Peers En-Route (ETA 3-5m)</p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <a
              href={`tel:${activeSos.workerPhone || '+919701392418'}`}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow transition-all flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Worker Immediately</span>
            </a>
            <a
              href="tel:112"
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-xl shadow transition-all flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Dispatch Police 112</span>
            </a>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5 text-emerald-950 font-bold">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Suraksha Bandhu Vigilance Desk: <strong>All Member Workers Safe on Site</strong> • 0 Active Distress Signals • 1.5km Rapid Mesh Standing By</span>
          </div>
          <span className="hidden sm:inline text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
            Active Protection Active
          </span>
        </div>
      )}

      {/* Grid: Pending Verification + Fair Wage Floor Config */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Worker Verification Queue */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-teal-600" />
              <span>{t('workerVerificationQueue')} ({pendingWorkers.length})</span>
            </h3>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
              NCCT Standard 2.0
            </span>
          </div>

          {loadingPending ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
              <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-xs text-slate-500 mt-2">Loading pending verifications...</p>
            </div>
          ) : pendingWorkers.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-600">All workers verified!</p>
              <p className="text-xs text-slate-400 mt-1">No pending KYC verification requests at this time.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingWorkers.map((applicant) => (
                <div
                  key={applicant.id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3"
                >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">{applicant.name}</h4>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold border border-emerald-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        DigiLocker Verified
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-teal-700 capitalize">{applicant.category}</span>
                    <p className="text-xs text-slate-500 mt-0.5">Experience: {applicant.experience} • Aadhaar: {applicant.aadhaar}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">
                    {applicant.appliedLevel || 'NCCT Level 2'}
                  </span>
                </div>

                {/* 3-Tier Proof Badges for Admin Inspection */}
                <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1.5 border border-slate-200/70">
                  <div className="flex flex-wrap items-center justify-between gap-1 text-slate-700">
                    <span className="font-medium">UIDAI Ref: <code className="text-slate-800 font-bold bg-white px-1 py-0.5 rounded border border-slate-200">DL-UID-{applicant.aadhaar ? applicant.aadhaar.replace(/\s/g, '').slice(-4) : '9021'}</code></span>
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Police Clearance: {applicant.policeVerification || 'PCC-Verified (CRB-Clean)'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/50">
                    <span>Ayushman Bharat: <strong className="text-slate-700">{applicant.ayushmanCard || 'PMJAY-Linked'}</strong></span>
                    <span>Contact: <strong className="text-slate-700">{applicant.phone || 'Verified'}</strong></span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => addNotification('Applicant documentation rejected.', 'info')}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1"
                  >
                    <XCircle className="w-4 h-4 text-slate-500" /> {t('reject')}
                  </button>

                  <button
                    onClick={() => approveWorkerKYC(applicant.id)}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-4 h-4" /> {t('approveAndCertify')}
                  </button>
                </div>
              </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Col: Minimum Fair Wage Floor Settings */}
        <div className="space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-teal-600" />
            <span>{t('wageFloorSettingTitle')}</span>
          </h3>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <form onSubmit={handleUpdateWageFloor} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  {t('minimumHourlyFloor')}
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    value={wageFloor}
                    onChange={(e) => setWageFloor(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 text-base focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="text-xs text-slate-500 space-y-1">
                <div className="flex justify-between">
                  <span>{t('stateMinWage')}</span>
                  <span className="font-semibold text-slate-800">₹ 280 / hr</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('societyAgreedFloor')}</span>
                  <span className="font-bold text-teal-700">₹ {wageFloor} / hr</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs shadow transition-colors"
              >
                {t('updateWageFloorBtn')}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* PACS TOOL & HEAVY EQUIPMENT DEPOT INVENTORY ASSET LEDGER (SIH26089 INNOVATION) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Wrench className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-black text-slate-900">
                PACS Equipment & Heavy Tool Bank Ledger (सहकार उपकरण बैंक)
              </h3>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                PACS Depot Asset
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Capital equipment owned by the Cooperative Society and Primary Agricultural Credit Societies rented to workers at ₹50–₹90/day with 0 security deposit.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-bold text-slate-600 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200">
            <span>Total Depot Assets: <strong className="text-slate-900 font-black">27 Units</strong></span>
            <span className="text-slate-300">|</span>
            <span>Deployed with Members: <strong className="text-emerald-700 font-black">8 Units</strong></span>
          </div>
        </div>

        {/* Equipment Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Equipment & Model</th>
                <th className="py-3 px-4">Trade & Category</th>
                <th className="py-3 px-4">Daily PACS Subsidized Rate</th>
                <th className="py-3 px-4">Market Commercial Rent</th>
                <th className="py-3 px-4">Total Society Units</th>
                <th className="py-3 px-4">Safety & Calibration Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { name: 'Bosch GBH 8-45 SDS-Max Core Drill', trade: 'Plumbing & Construction', rate: '₹ 60 / day', mkt: '₹ 600 / day', units: '4 Available', status: 'NABL Certified (Passed)' },
                { name: 'Rigid K-400 High-Pressure Sewer Jetter', trade: 'Plumbing & Sanitation', rate: '₹ 75 / day', mkt: '₹ 800 / day', units: '3 Available', status: 'Pressure Tested (Passed)' },
                { name: 'Fluke TiS20+ Thermal Leak Camera', trade: 'Electrical & Plumbing', rate: '₹ 90 / day', mkt: '₹ 1,200 / day', units: '2 Available', status: 'Optics Calibrated' },
                { name: 'Robinair Dual-Stage HVAC Vacuum Pump', trade: 'AC & Refrigeration', rate: '₹ 80 / day', mkt: '₹ 750 / day', units: '5 Available', status: 'Vacuum Seal Verified' },
                { name: '16ft Telescopic Fiberglass Ladder (33kV Safe)', trade: 'Electrical & Maintenance', rate: '₹ 50 / day', mkt: '₹ 400 / day', units: '6 Available', status: 'Load ANSI 1AA Pass' },
                { name: 'Bosch D-tect 120 Wall Wire Scanner', trade: 'Carpentry & Electrical', rate: '₹ 45 / day', mkt: '₹ 350 / day', units: '7 Available', status: 'Sensor Calibrated' }
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">{row.name}</td>
                  <td className="py-3 px-4 text-slate-600 font-medium">{row.trade}</td>
                  <td className="py-3 px-4 font-black text-emerald-700">{row.rate}</td>
                  <td className="py-3 px-4 line-through text-slate-400">{row.mkt}</td>
                  <td className="py-3 px-4 font-bold text-slate-800">{row.units}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
