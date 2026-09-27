import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  ShieldCheck, Crosshair, Navigation, LocateFixed, Phone, 
  CheckCircle2, Maximize2, Minimize2, X, Compass, Users 
} from 'lucide-react';
import { translateCategory, translateWorkerName } from '../../utils/translateHelpers';

// Fix Leaflet default icon paths in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Pulsing Live Tracking Icon for Worker On The Way
const createActiveWorkerIcon = () => {
  return L.divIcon({
    className: 'active-worker-tracking-pin',
    html: `
      <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 44px; height: 44px;">
        <span style="position: absolute; width: 44px; height: 44px; border-radius: 50%; background: rgba(16, 185, 129, 0.4); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
        <div style="
          background: linear-gradient(135deg, #10b981, #059669);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 16px;
          z-index: 10;
        ">
          🛵
        </div>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -22],
  });
};

// Custom Teal Icon for Cooperative Worker
const createCustomIcon = (color = '#0d9488') => {
  return L.divIcon({
    className: 'custom-map-pin',
    html: `
      <div style="
        background-color: ${color};
        width: 34px;
        height: 34px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.25);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 15px;
      ">
        🛠️
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -17],
  });
};

// Pulsing Blue Icon for User / Customer Current Location
const createUserLocationIcon = () => {
  return L.divIcon({
    className: 'user-location-pin',
    html: `
      <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 32px; height: 32px;">
        <span style="position: absolute; width: 32px; height: 32px; border-radius: 50%; background: rgba(59, 130, 246, 0.35); animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
        <div style="
          background: #2563eb;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.35);
        "></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

function ChangeMapView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

// Reusable Layer rendering user, radius, polyline, and workers
const MapLayers = ({ userCoords, radiusKm, workers, activeBooking, lang, t, setSelectedWorker, setBookingModalOpen }) => {
  return (
    <>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Live Route Polyline connecting Worker and Customer */}
      {activeBooking && (
        <>
          <Polyline
            positions={[
              [activeBooking.workerLat || 28.6139, activeBooking.workerLng || 77.2090],
              [activeBooking.customerLat || userCoords[0], activeBooking.customerLng || userCoords[1]]
            ]}
            pathOptions={{
              color: '#10b981',
              weight: 4,
              dashArray: '6, 8',
              opacity: 0.9
            }}
          />
          {/* Live Worker Pin on the way */}
          <Marker
            position={[activeBooking.workerLat || 28.6139, activeBooking.workerLng || 77.2090]}
            icon={createActiveWorkerIcon()}
          >
            <Popup>
              <div className="p-2 font-sans space-y-1 text-xs min-w-[170px]">
                <p className="font-extrabold text-emerald-700 flex items-center gap-1">
                  <span>🛵 On The Way</span>
                </p>
                <p className="font-black text-slate-900">{activeBooking.workerName}</p>
                <p className="text-[10px] text-slate-500 capitalize">{activeBooking.category}</p>
                {activeBooking.workerPhone && (
                  <a
                    href={`tel:${activeBooking.workerPhone}`}
                    className="mt-1.5 block w-full py-1 text-center bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[10px]"
                  >
                    Call {activeBooking.workerPhone}
                  </a>
                )}
              </div>
            </Popup>
          </Marker>
        </>
      )}

      {/* User Current Live Location Marker */}
      <Marker position={userCoords} icon={createUserLocationIcon()}>
        <Popup>
          <div className="p-1 font-sans text-xs">
            <span className="font-bold text-blue-700 block">📍 {t('yourLocationCenter')}</span>
            <span className="text-slate-500 text-[10px]">{radiusKm}km PostGIS</span>
          </div>
        </Popup>
      </Marker>

      {/* Spatial Radius Coverage Circle */}
      <Circle
        center={userCoords}
        radius={radiusKm * 1000}
        pathOptions={{
          color: '#0d9488',
          fillColor: '#14b8a6',
          fillOpacity: 0.12,
          weight: 2,
          dashArray: '6, 6'
        }}
      />

      {/* Worker Markers */}
      {workers.map((w) => (
        <Marker
          key={w.id}
          position={[w.lat, w.lng]}
          icon={createCustomIcon('#0d9488')}
        >
          <Popup>
            <div className="p-1 font-sans space-y-2 min-w-[200px]">
              <div className="flex items-center gap-2">
                {w.photo ? (
                  <img
                    src={w.photo}
                    alt={w.name}
                    className="w-10 h-10 rounded-full object-cover border"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center border border-teal-500">
                    {w.name ? w.name.substring(0, 2).toUpperCase() : 'WK'}
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-slate-900 text-xs leading-tight">{translateWorkerName(w.name, lang)}</h4>
                  <span className="text-[10px] font-semibold text-teal-700 capitalize">{translateCategory(w.category, t)}</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-600 space-y-1">
                <p className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                  <span>{w.societyName}</span>
                </p>
                <p className="font-bold text-slate-800">
                  ₹{w.hourlyRate} / hr • <span className="text-teal-700">{w.distanceKm ? `${w.distanceKm.toFixed(1)} km` : ''}</span>
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedWorker(w);
                  setBookingModalOpen(true);
                }}
                className="w-full py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-[11px] font-bold shadow transition-colors cursor-pointer"
              >
                {t('bookServiceNow')}
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
};

export const InteractiveMap = ({ height = '450px' }) => {
  const { workers, radiusKm, setSelectedWorker, setBookingModalOpen, userCoords, detectUserLocation, isLocating, bookings } = useApp();
  const { t, lang } = useLanguage();
  const [isEnlarged, setIsEnlarged] = useState(false);

  // Close enlarged view on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsEnlarged(false);
    };
    if (isEnlarged) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEnlarged]);

  // Find any active accepted job for live tracking
  const activeBooking = bookings.find(
    b => b.status === 'Accepted' || b.status?.includes('Awaiting Approval')
  );

  // Wait for GPS coordinates before rendering map
  if (!userCoords) {
    return (
      <div className="relative w-full rounded-3xl overflow-hidden border border-slate-200 shadow-md bg-slate-100 flex items-center justify-center" style={{ height }}>
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-3 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-bold text-slate-500">Detecting your GPS location...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* 1. COMPACT DASHBOARD MAP CONTAINER */}
      <div className="relative w-full rounded-3xl overflow-hidden border border-slate-200 shadow-md group">
        
        {/* Live Worker GPS Tracking Floating Banner */}
        {activeBooking && (
          <div className="absolute top-3 left-3 z-[1000] bg-slate-900/95 text-white border border-emerald-500/40 px-3 py-1.5 rounded-2xl shadow-xl backdrop-blur-md flex items-center gap-2 max-w-[85%] sm:max-w-none">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
              🛵
            </div>
            <div className="min-w-0">
              <p className="text-[9px] text-emerald-400 font-extrabold uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Worker Live GPS</span>
              </p>
              <p className="text-xs font-black text-white truncate">{activeBooking.workerName}</p>
            </div>
            {activeBooking.workerPhone && (
              <a
                href={`tel:${activeBooking.workerPhone}`}
                className="ml-1 px-2 py-0.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 shadow shrink-0"
              >
                <Phone className="w-3 h-3" />
                <span>Call</span>
              </a>
            )}
          </div>
        )}

        {/* GPS Locate Button overlay */}
        <button
          type="button"
          onClick={detectUserLocation}
          disabled={isLocating}
          className="absolute top-3 right-3 z-[1000] bg-white/95 hover:bg-white text-slate-800 px-3 py-1.5 rounded-xl text-xs font-bold shadow-md border border-slate-200 backdrop-blur-md transition-all flex items-center gap-1.5 cursor-pointer"
          title="Locate My Position"
        >
          <LocateFixed className={`w-3.5 h-3.5 text-blue-600 ${isLocating ? 'animate-spin' : ''}`} />
          <span>{isLocating ? 'GPS...' : t('yourLocationCenter')}</span>
        </button>

        {/* Enlarge / Fullscreen Overlay Button (Always visible & prominent on hover) */}
        <button
          type="button"
          onClick={() => setIsEnlarged(true)}
          className="absolute bottom-3 right-3 z-[1000] bg-slate-900/90 hover:bg-slate-900 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-xl border border-slate-700/80 backdrop-blur-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 group-hover:scale-105"
          title="Click to enlarge map to full screen"
        >
          <Maximize2 className="w-3.5 h-3.5 text-teal-400" />
          <span>{lang === 'hi' ? 'नक्शा बड़ा करें' : 'Enlarge Map'}</span>
        </button>

        {/* Compact Map */}
        <MapContainer
          center={userCoords}
          zoom={13}
          style={{ height, width: '100%' }}
          scrollWheelZoom={false}
        >
          <ChangeMapView center={userCoords} zoom={13} />
          <MapLayers
            userCoords={userCoords}
            radiusKm={radiusKm}
            workers={workers}
            activeBooking={activeBooking}
            lang={lang}
            t={t}
            setSelectedWorker={setSelectedWorker}
            setBookingModalOpen={setBookingModalOpen}
          />
        </MapContainer>
      </div>

      {/* 2. ENLARGED FULL-SCREEN MAP MODAL */}
      {isEnlarged && (
        <div 
          className="fixed inset-0 z-[300] flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setIsEnlarged(false)}
        >
          <div 
            className="relative w-full max-w-6xl h-[88vh] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Enlarged Modal Header */}
            <div className="bg-slate-900 border-b border-slate-800 text-white px-6 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-400/30 flex items-center justify-center">
                  <Navigation className="w-5 h-5 text-teal-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-white">
                      {lang === 'hi' ? 'लाइव जीपीएस श्रमिक रडार (विस्तृत नक्शा)' : 'Real-Time GPS Worker Radar (Enlarged Map)'}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-400/30">
                      Live {radiusKm} km Radius
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Interactive cooperative technician map. Click any pin to inspect worker ratings, rates & book directly.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={detectUserLocation}
                  disabled={isLocating}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Locate My Position"
                >
                  <LocateFixed className={`w-3.5 h-3.5 text-teal-400 ${isLocating ? 'animate-spin' : ''}`} />
                  <span>{isLocating ? 'Locating...' : 'My Location'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsEnlarged(false)}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  title="Close Enlarged Map (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Enlarged Map Canvas */}
            <div className="flex-1 w-full relative">
              <MapContainer
                key="enlarged-map"
                center={userCoords}
                zoom={14}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
              >
                <ChangeMapView center={userCoords} zoom={14} />
                <MapLayers
                  userCoords={userCoords}
                  radiusKm={radiusKm}
                  workers={workers}
                  activeBooking={activeBooking}
                  lang={lang}
                  t={t}
                  setSelectedWorker={(w) => {
                    setSelectedWorker(w);
                    setIsEnlarged(false);
                    setBookingModalOpen(true);
                  }}
                  setBookingModalOpen={setBookingModalOpen}
                />
              </MapContainer>
            </div>

            {/* Enlarged Footer Bar */}
            <div className="px-6 py-3.5 bg-slate-100 border-t border-slate-200 text-xs text-slate-600 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-teal-600" />
                <span>
                  Showing <strong>{workers.length}</strong> active on-duty cooperative workers within <strong>{radiusKm} km</strong> radius.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsEnlarged(false)}
                className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1 cursor-pointer"
              >
                <Minimize2 className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? 'सामान्य दृश्य पर लौटें' : 'Exit Full View'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InteractiveMap;
