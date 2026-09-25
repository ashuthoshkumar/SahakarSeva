import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { ShieldCheck, Crosshair, Navigation, LocateFixed, Phone, CheckCircle2 } from 'lucide-react';
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
        font-size: 14px;
      ">
        🤝
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -17],
  });
};

// Custom User GPS Location Pin Icon
const createUserLocationIcon = () => {
  return L.divIcon({
    className: 'user-gps-pin',
    html: `
      <div style="
        background-color: #2563eb;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 0 15px rgba(37,99,235,0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 14px;
        animation: pulse 2s infinite;
      ">
        📍
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

export const InteractiveMap = ({ height = '450px' }) => {
  const { workers, radiusKm, setSelectedWorker, setBookingModalOpen, userCoords, detectUserLocation, isLocating, bookings } = useApp();
  const { t, lang } = useLanguage();

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
    <div className="relative w-full rounded-3xl overflow-hidden border border-slate-200 shadow-md">
      
      {/* Live Worker GPS Tracking Floating Banner */}
      {activeBooking && (
        <div className="absolute top-4 left-4 z-[1000] bg-slate-900/95 text-white border border-emerald-500/40 px-3.5 py-2 rounded-2xl shadow-xl backdrop-blur-md flex items-center gap-2.5 max-w-[85%] sm:max-w-none">
          <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm shrink-0">
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
              className="ml-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[10px] font-bold flex items-center gap-1 shadow shrink-0"
            >
              <Phone className="w-3 h-3" />
              <span>Call</span>
            </a>
          )}
        </div>
      )}

      {/* GPS Locate Button overlay */}
      <button
        onClick={detectUserLocation}
        disabled={isLocating}
        className="absolute top-4 right-4 z-[1000] bg-white/95 hover:bg-white text-slate-800 px-3.5 py-2 rounded-xl text-xs font-bold shadow-md border border-slate-200 backdrop-blur-md transition-all flex items-center gap-1.5 cursor-pointer"
        title="Locate My Position"
      >
        <LocateFixed className={`w-4 h-4 text-blue-600 ${isLocating ? 'animate-spin' : ''}`} />
        <span>{isLocating ? 'GPS...' : t('yourLocationCenter')}</span>
      </button>

      <MapContainer
        center={userCoords}
        zoom={13}
        style={{ height, width: '100%' }}
        scrollWheelZoom={false}
      >
        <ChangeMapView center={userCoords} zoom={13} />
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
                  className="w-full py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-[11px] font-bold shadow transition-colors"
                >
                  {t('bookServiceNow')}
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
