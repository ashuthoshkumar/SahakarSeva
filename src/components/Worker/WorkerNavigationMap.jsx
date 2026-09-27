import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { Navigation, Phone, MapPin, ExternalLink, Compass, Maximize2, Minimize2, X } from 'lucide-react';

// Fix Leaflet default icon paths in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Worker Current Location Pin
const createWorkerPinIcon = () => {
  return L.divIcon({
    className: 'worker-gps-pin',
    html: `
      <div style="
        background: linear-gradient(135deg, #0f766e, #0d9488);
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
        font-weight: bold;
      ">
        👷
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });
};

// Customer Destination Pin
const createCustomerDestIcon = () => {
  return L.divIcon({
    className: 'customer-dest-pin',
    html: `
      <div style="
        background: linear-gradient(135deg, #e11d48, #be123c);
        width: 38px;
        height: 38px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 4px 14px rgba(225, 29, 72, 0.45);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 18px;
        animation: bounce 1.5s infinite;
      ">
        📍
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -19],
  });
};

// Reusable Map Layer for Navigation
const NavigationLayers = ({ wLat, wLng, cLat, cLng, customerName, customerAddress }) => {
  return (
    <>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Route line between worker & customer */}
      <Polyline
        positions={[
          [wLat, wLng],
          [cLat, cLng]
        ]}
        pathOptions={{
          color: '#0d9488',
          weight: 5,
          opacity: 0.85,
          dashArray: '8, 8'
        }}
      />

      {/* Worker Location Marker */}
      <Marker position={[wLat, wLng]} icon={createWorkerPinIcon()}>
        <Popup>
          <div className="p-1 font-sans text-xs">
            <p className="font-bold text-teal-800">👷 Your Current Location</p>
            <p className="text-[10px] text-slate-500">Departure Point</p>
          </div>
        </Popup>
      </Marker>

      {/* Customer Destination Marker */}
      <Marker position={[cLat, cLng]} icon={createCustomerDestIcon()}>
        <Popup>
          <div className="p-1.5 font-sans text-xs space-y-1">
            <p className="font-bold text-rose-700">🏠 Customer Destination</p>
            <p className="font-extrabold text-slate-900">{customerName}</p>
            <p className="text-slate-600 text-[10px]">{customerAddress}</p>
          </div>
        </Popup>
      </Marker>
    </>
  );
};

export const WorkerNavigationMap = ({
  workerLat = 28.6139,
  workerLng = 77.2090,
  customerLat = 28.6250,
  customerLng = 77.2180,
  customerName = 'Customer',
  customerAddress = 'Doorstep Service Address',
  customerPhone = '',
  height = '320px'
}) => {
  const [isEnlarged, setIsEnlarged] = useState(false);

  const wLat = Number(workerLat) || 28.6139;
  const wLng = Number(workerLng) || 77.2090;
  const cLat = Number(customerLat) || 28.6250;
  const cLng = Number(customerLng) || 77.2180;

  // Center the map between worker and customer
  const centerLat = (wLat + cLat) / 2;
  const centerLng = (wLng + cLng) / 2;

  // Close enlarged view on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsEnlarged(false);
    };
    if (isEnlarged) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEnlarged]);

  // Google Maps navigation direction URL
  const navUrl = (cLat && cLng && (cLat !== wLat || cLng !== wLng))
    ? `https://www.google.com/maps/dir/?api=1&origin=${wLat},${wLng}&destination=${cLat},${cLng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(customerAddress)}`;

  return (
    <div className="space-y-3 font-sans">
      {/* Compact Map Container */}
      <div className="relative w-full rounded-2xl overflow-hidden border border-slate-300 shadow-inner group">
        
        {/* Destination Header Pill */}
        <div className="absolute top-3 left-3 z-[1000] bg-slate-900/90 backdrop-blur-md text-white px-3 py-1.5 rounded-xl border border-slate-700 text-xs flex items-center gap-2 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-bold">Navigation Route Active</span>
        </div>

        {/* Enlarge Overlay Button */}
        <button
          type="button"
          onClick={() => setIsEnlarged(true)}
          className="absolute bottom-3 right-3 z-[1000] bg-slate-900/90 hover:bg-slate-900 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-xl border border-slate-700 backdrop-blur-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 group-hover:scale-105"
          title="Enlarge Navigation Map"
        >
          <Maximize2 className="w-3.5 h-3.5 text-teal-400" />
          <span>Enlarge Map</span>
        </button>

        <MapContainer
          center={[centerLat, centerLng]}
          zoom={13}
          style={{ height, width: '100%' }}
          scrollWheelZoom={false}
        >
          <NavigationLayers
            wLat={wLat}
            wLng={wLng}
            cLat={cLat}
            cLng={cLng}
            customerName={customerName}
            customerAddress={customerAddress}
          />
        </MapContainer>
      </div>

      {/* Action Bar for Quick Navigation & Calling */}
      <div className="flex flex-col sm:flex-row items-center gap-2.5">
        <a
          href={navUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:flex-1 py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <Compass className="w-4 h-4" />
          <span>🧭 Turn-by-Turn Navigation (Google Maps)</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-80" />
        </a>

        {customerPhone && (
          <a
            href={`tel:${customerPhone}`}
            className="w-full sm:w-auto py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <Phone className="w-4 h-4 text-emerald-400" />
            <span>Call Customer</span>
          </a>
        )}
      </div>

      {/* Full-Screen Enlarged Modal */}
      {isEnlarged && (
        <div 
          className="fixed inset-0 z-[300] flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setIsEnlarged(false)}
        >
          <div 
            className="relative w-full max-w-6xl h-[88vh] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-slate-900 border-b border-slate-800 text-white px-6 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-400/30 flex items-center justify-center">
                  <Navigation className="w-5 h-5 text-teal-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-white">
                      GPS Turn-by-Turn Route Navigation (Enlarged)
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                      Destination: {customerName}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {customerAddress}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={navUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition-all"
                >
                  <Compass className="w-4 h-4" />
                  <span>Open Google Maps</span>
                </a>
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

            {/* Map Canvas */}
            <div className="flex-1 w-full relative">
              <MapContainer
                key="worker-enlarged-map"
                center={[centerLat, centerLng]}
                zoom={14}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
              >
                <NavigationLayers
                  wLat={wLat}
                  wLng={wLng}
                  cLat={cLat}
                  cLng={cLng}
                  customerName={customerName}
                  customerAddress={customerAddress}
                />
              </MapContainer>
            </div>

            {/* Footer */}
            <div className="px-6 py-3.5 bg-slate-100 border-t border-slate-200 text-xs text-slate-600 flex items-center justify-between shrink-0">
              <span className="font-medium">
                Destination: <strong>{customerAddress}</strong>
              </span>
              <button
                type="button"
                onClick={() => setIsEnlarged(false)}
                className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1 cursor-pointer"
              >
                <Minimize2 className="w-3.5 h-3.5" />
                <span>Exit Full View</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkerNavigationMap;
