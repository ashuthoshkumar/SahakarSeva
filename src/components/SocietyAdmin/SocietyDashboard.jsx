import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Building2, UserCheck, ShieldCheck, DollarSign, Award, CheckCircle2, XCircle } from 'lucide-react';

export const SocietyDashboard = () => {
  const { workers, societies, approveWorkerKYC, updateSocietyWageFloor, addNotification } = useApp();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [wageFloor, setWageFloor] = useState(350);
  const [pendingWorkers, setPendingWorkers] = useState([]);
  const [loadingPending, setLoadingPending] = useState(true);

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
                    <h4 className="font-bold text-slate-900 text-sm">{applicant.name}</h4>
                    <span className="text-xs font-semibold text-teal-700 capitalize">{applicant.category}</span>
                    <p className="text-xs text-slate-500 mt-1">Experience: {applicant.experience} • Aadhaar: {applicant.aadhaar}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">
                    {applicant.appliedLevel}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl text-xs flex items-center justify-between text-slate-600">
                  <span>{t('policeVerificationDoc')} <strong className="text-emerald-700">{applicant.policeVerification}</strong></span>
                  <span className="text-slate-400">Phone: {applicant.phone}</span>
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
    </div>
  );
};
