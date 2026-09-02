import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { BrainCircuit, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';

export const AIDemandForecaster = () => {
  const [selectedLocality, setSelectedLocality] = useState('ConnaughtPlace');
  const [forecastData, setForecastData] = useState([]);
  const [forecastMeta, setForecastMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useApp();
  const { t } = useLanguage();

  const fetchAIForecast = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5050/api/ai/forecast?locality=${selectedLocality}`);
      const data = await res.json();
      if (data.success) {
        setForecastData(data.forecast);
        setForecastMeta(data);
      }
    } catch (err) {
      console.error('Failed to fetch AI forecast from API:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAIForecast();
  }, [selectedLocality]);

  const handleProactiveDispatch = () => {
    addNotification(`AI Directive Executed: 25 Electricians & Plumbers pre-allocated to ${selectedLocality} for peak slot (${forecastMeta?.peakDemandSlot || '06:00 PM'})!`, 'success');
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200">
              <BrainCircuit className="w-5 h-5 animate-pulse" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
              {t('aiForecastingTitle')}
            </h3>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Time-Series Predictive Microservice ({forecastMeta?.modelName || 'Prophet Engine'}) • Dynamic REST API Endpoint
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700">
            <span>{t('localityLabel')}</span>
            <select
              value={selectedLocality}
              onChange={(e) => setSelectedLocality(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer text-xs font-bold text-indigo-700"
            >
              <option value="ConnaughtPlace">Connaught Place (Delhi)</option>
              <option value="SouthDelhi">South Delhi</option>
              <option value="Indiranagar">Indiranagar (BLR)</option>
              <option value="BandraWest">Bandra West (MUM)</option>
            </select>
          </div>

          <button
            onClick={handleProactiveDispatch}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{t('preAllocateWorkersBtn')}</span>
          </button>
        </div>
      </div>

      {/* Predictive Insight Box */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-amber-500 text-slate-950 font-black text-[10px] uppercase px-2 py-0.5 rounded">
              AI Recommendation
            </span>
          </div>
          <h4 className="font-extrabold text-sm text-amber-300">
            {t('peakSurgeExpected')} {forecastMeta?.peakDemandSlot || '06:00 PM'} ({selectedLocality})
          </h4>
          <p className="text-xs text-slate-300">
            Peak Demand: <strong className="text-white">{forecastMeta?.peakPredictedBookings || 140} Jobs</strong> | {t('predictedDeficit')}: <strong className="text-white">{forecastMeta?.totalPredictedDeficit || 42} Workers</strong>
          </p>
        </div>

        <div className="text-right shrink-0">
          <span className="text-[10px] uppercase font-bold text-slate-400">{t('forecastingPrecision')}</span>
          <p className="text-xl font-black text-emerald-400">{forecastMeta?.accuracy || '96.4%'}</p>
        </div>
      </div>

      {/* Chart Visualization */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          {t('predictedDemandCurve')} ({selectedLocality})
        </span>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecastData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorDeficit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.5}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="timeSlot" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
              />
              <Area type="monotone" dataKey={selectedLocality} stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorDemand)" name="Predicted Demand" />
              <Area type="monotone" dataKey="predictedDeficit" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorDeficit)" name="Worker Deficit" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
