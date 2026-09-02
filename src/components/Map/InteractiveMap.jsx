import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { ShieldCheck, Crosshair, Navigation, LocateFixed } from 'lucide-react';
import { translateCategory, translateWorkerName } from '../../utils/translateHelpers';

// Fix Leaflet default icon paths in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

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
  const { workers, radiusKm, setSelectedWorker, setBookingModalOpen, userCoords, detectUserLocation, isLocating } = useApp();
  const { t, lang } = useLanguage();

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
