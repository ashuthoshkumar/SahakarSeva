import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { Navigation, Phone, MapPin, ExternalLink, Compass } from 'lucide-react';

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

// Customer Destination Address Pin
const createCustomerDestIcon = () => {
  return L.divIcon({
    className: 'customer-dest-pin',
    html: `
      <div style="
        background: linear-gradient(135deg, #ef4444, #dc2626);
        width: 38px;
        height: 38px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 0 16px rgba(239,68,68,0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 16px;
      ">
        🏠
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -19],
  });
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
  const wLat = Number(workerLat) || 28.6139;
  const wLng = Number(workerLng) || 77.2090;
  const cLat = Number(customerLat) || 28.6250;
  const cLng = Number(customerLng) || 77.2180;

  // Center the map between worker and customer
  const centerLat = (wLat + cLat) / 2;
  const centerLng = (wLng + cLng) / 2;

  // Google Maps navigation direction URL
  const navUrl = (cLat && cLng && (cLat !== wLat || cLng !== wLng))
    ? `https://www.google.com/maps/dir/?api=1&origin=${wLat},${wLng}&destination=${cLat},${cLng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(customerAddress)}`;

  return (
    <div className="space-y-3 font-sans">
      <div className="relative w-full rounded-2xl overflow-hidden border border-slate-300 shadow-inner">
        
        {/* Destination Header Pill */}
        <div className="absolute top-3 left-3 z-[1000] bg-slate-900/90 backdrop-blur-md text-white px-3 py-1.5 rounded-xl border border-slate-700 text-xs flex items-center gap-2 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-bold">Navigation Route Active</span>
        </div>

        <MapContainer
          center={[centerLat, centerLng]}
          zoom={13}
          style={{ height, width: '100%' }}
          scrollWheelZoom={false}
        >
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
    </div>
  );
};
