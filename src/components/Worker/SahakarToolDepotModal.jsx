import React, { useState, useEffect } from 'react';
import { 
  Wrench, ShieldCheck, CheckCircle2, Clock, MapPin, 
  Sparkles, DollarSign, QrCode, ArrowRight, X, AlertCircle, 
  RotateCcw, Filter, Check, Calendar, ChevronRight, Download
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const PACS_DEPOT_LOCATIONS = [
  { id: 'depot_cp', name: 'Central Connaught Place PACS Tool Depot', distance: '0.8 km', address: 'B-Block Super Market, Outer Circle, CP' },
  { id: 'depot_delhi_hub', name: 'Delhi NCR Shramik Sahakari Depot HQ', distance: '2.4 km', address: 'Cooperative Bhawan, Pusa Road, New Delhi' },
  { id: 'depot_south', name: 'South Delhi Urban Cooperative Depot', distance: '4.1 km', address: 'Near Kalkaji Metro Station, New Delhi' }
];

export const TOOL_INVENTORY = [
  {
    id: 'tool_core_drill',
    name: 'Bosch GBH 8-45 Professional SDS-Max Core Drill',
    nameHi: 'बॉश हैवी कंक्रीट कोर ड्रिल और डस्ट एक्सट्रैक्टर',
    category: 'plumbing',
    trade: 'Plumbing & Construction',
    pacsRatePerDay: 60,
    commercialRentPerDay: 600,
    specs: '1500W motor, 12.5 Joules impact, up to 125mm core drill capacity with vacuum attachment',
    availableCount: 4,
    depotLocation: 'Central Connaught Place PACS Tool Depot',
    condition: 'Grade A+ (Certified & Inspected)',
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'tool_hydro_jet',
    name: 'Rigid K-400 High-Pressure Sewer Jetter & Drain Snake',
    nameHi: 'हाई-प्रेशर सीवर जेट्टर और ड्रेन क्लीनर',
    category: 'plumbing',
    trade: 'Plumbing & Sanitation',
    pacsRatePerDay: 75,
    commercialRentPerDay: 800,
    specs: '180 Bar pressure pump, 75ft autofeed inner-core cable, root cutter & grease blade set',
    availableCount: 3,
    depotLocation: 'Delhi NCR Shramik Sahakari Depot HQ',
    condition: 'Grade A+ (Sterilized & Pressure Tested)',
    image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'tool_thermal_cam',
    name: 'Fluke TiS20+ Thermal Imaging Camera (Leak & Short-Circuit)',
    nameHi: 'फ्लूक थर्मल इमेजिंग कैमरा (शॉर्ट सर्किट और लीकेज डिटेक्टर)',
    category: 'electrician',
    trade: 'Electrical & Plumbing',
    pacsRatePerDay: 90,
    commercialRentPerDay: 1200,
    specs: '120x90 infrared resolution, -20°C to 150°C range, instant wall moisture & hotspot detection',
    availableCount: 2,
    depotLocation: 'Central Connaught Place PACS Tool Depot',
    condition: 'Calibrated NABL Certified',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'tool_hvac_pump',
    name: 'Robinair Dual-Stage HVAC Vacuum Pump & Digital Manifold',
    nameHi: 'रॉबिनएयर एसी वैक्यूम पंप और डिजिटल मैनिफोल्ड किट',
    category: 'appliances',
    trade: 'AC & Refrigeration',
    pacsRatePerDay: 80,
    commercialRentPerDay: 750,
    specs: '5 CFM dual-stage, 15-micron deep vacuum, R-32, R-410A, R-134a compatible digital gauges',
    availableCount: 5,
    depotLocation: 'Central Connaught Place PACS Tool Depot',
    condition: 'Grade A (Vacuum Seal Tested)',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'tool_fiber_ladder',
    name: '16ft Telescopic Non-Conductive Heavy Fiberglass Ladder',
    nameHi: '16 फीट गैर-प्रवाहकीय भारी फाइबरग्लास सीढ़ी',
    category: 'electrician',
    trade: 'Electrical & Maintenance',
    pacsRatePerDay: 50,
    commercialRentPerDay: 400,
    specs: 'Heavy duty ANSI Type 1AA 170kg capacity, 100% electrical safe up to 33,000 Volts',
    availableCount: 6,
    depotLocation: 'Delhi NCR Shramik Sahakari Depot HQ',
    condition: 'Safety Load Certified',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'tool_wall_scanner',
    name: 'Bosch D-tect 120 Professional Wall & Wire Scanner',
    nameHi: 'बॉश दीवार के अंदर छिपे तार और पाइप डिटेक्टर',
    category: 'carpentry',
    trade: 'Carpentry & Electrical',
    pacsRatePerDay: 45,
    commercialRentPerDay: 350,
    specs: 'Detects live wires, water-filled plastic pipes, metal studs up to 12cm wall depth',
    availableCount: 7,
    depotLocation: 'South Delhi Urban Cooperative Depot',
    condition: 'Grade A+ (Calibrated)',
    image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&q=80&w=400'
  }
];

export const SahakarToolDepotModal = ({ isOpen, onClose, worker, onRentalConfirmed }) => {
  const { t, lang } = useLanguage();
  const [activeTab, setActiveTab] = useState('browse'); // 'browse' | 'my_rentals'
  const [selectedTrade, setSelectedTrade] = useState('all');
  const [selectedTool, setSelectedTool] = useState(null);
  const [selectedDays, setSelectedDays] = useState(1);
  const [selectedDepot, setSelectedDepot] = useState(PACS_DEPOT_LOCATIONS[0].id);
  const [confirmedPass, setConfirmedPass] = useState(null);
  const [rentedTools, setRentedTools] = useState([]);

  // Load rented tools from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('sahakar_rented_tools');
      if (saved) {
        setRentedTools(JSON.parse(saved));
      }
    } catch (e) {}
  }, []);

  const saveRentedTools = (list) => {
    setRentedTools(list);
    try {
      localStorage.setItem('sahakar_rented_tools', JSON.stringify(list));
    } catch (e) {}
  };

  const filteredTools = TOOL_INVENTORY.filter(tool => {
    if (selectedTrade === 'all') return true;
    return tool.category === selectedTrade;
  });

  const handleCheckoutTool = () => {
    if (!selectedTool) return;

    const depot = PACS_DEPOT_LOCATIONS.find(d => d.id === selectedDepot) || PACS_DEPOT_LOCATIONS[0];
    const totalPacsCost = selectedTool.pacsRatePerDay * selectedDays;
    const marketCost = selectedTool.commercialRentPerDay * selectedDays;
    const savings = marketCost - totalPacsCost;
    const now = new Date();
    const returnDate = new Date(now.getTime() + selectedDays * 24 * 60 * 60 * 1000);

    const rentalRecord = {
      rentalId: 'PACS_PASS_' + Math.floor(100000 + Math.random() * 900000),
      toolId: selectedTool.id,
      toolName: selectedTool.name,
      toolImage: selectedTool.image,
      depotName: depot.name,
      depotAddress: depot.address,
      rentedAt: now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      dueReturn: returnDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      days: selectedDays,
      pacsCost: totalPacsCost,
      savings,
      workerName: worker?.name || 'Worker',
      workerPhone: worker?.phone || '+91 97013 92418',
      societyName: worker?.societyName || 'Delhi NCR Shramik Sahakari Samiti Ltd.',
      serialNumber: 'EQ-' + Math.floor(1000 + Math.random() * 9000) + '-PACS',
      status: 'ACTIVE_DISPATCHED'
    };

    const updated = [rentalRecord, ...rentedTools];
    saveRentedTools(updated);
    setConfirmedPass(rentalRecord);

    if (onRentalConfirmed) {
      onRentalConfirmed(rentalRecord);
    }
  };

  const handleReturnTool = (rentalId) => {
    const updated = rentedTools.filter(r => r.rentalId !== rentalId);
    saveRentedTools(updated);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Header Bar */}
        <div className="p-5 bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black tracking-tight">
                  {lang === 'hi' ? 'सहकार उपकरण बैंक' : 'Sahakar Upkaran Bank'}
                </h3>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 tracking-wider">
                  PACS Depot Rental
                </span>
              </div>
              <p className="text-xs text-emerald-100 font-medium mt-0.5">
                Zero-Deposit Heavy Tool & Equipment Bank backed by Primary Agricultural Credit Societies
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-slate-800/80 rounded-xl p-1 border border-slate-700 text-xs font-bold">
              <button
                onClick={() => { setActiveTab('browse'); setConfirmedPass(null); }}
                className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'browse' ? 'bg-emerald-600 text-white shadow' : 'text-slate-300 hover:text-white'}`}
              >
                Browse Catalog
              </button>
              <button
                onClick={() => { setActiveTab('my_rentals'); setConfirmedPass(null); }}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${activeTab === 'my_rentals' ? 'bg-emerald-600 text-white shadow' : 'text-slate-300 hover:text-white'}`}
              >
                <span>My Active Tools</span>
                {rentedTools.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-amber-400 text-slate-950">
                    {rentedTools.length}
                  </span>
                )}
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto space-y-6">

          {/* CONFIRMED PASS VIEW (JUST RENTED) */}
          {confirmedPass ? (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-6 bg-gradient-to-br from-emerald-50 via-teal-50 to-white border-2 border-emerald-300 rounded-3xl shadow-sm space-y-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-emerald-200 pb-4">
                  <div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Zero-Deposit PACS Gate Pass Generated
                    </span>
                    <h3 className="text-xl font-black text-slate-900 mt-2">{confirmedPass.toolName}</h3>
                    <p className="text-xs text-slate-600 font-medium">Assigned Serial: <strong className="font-mono text-slate-900">{confirmedPass.serialNumber}</strong></p>
                  </div>

                  <div className="p-3 bg-white border border-emerald-200 rounded-2xl flex flex-col items-center shadow-sm shrink-0">
                    <QrCode className="w-16 h-16 text-slate-900" />
                    <span className="text-[10px] font-mono font-bold text-slate-500 mt-1">{confirmedPass.rentalId}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-2xl border border-emerald-100 shadow-sm">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Pickup Depot Location</span>
                    <p className="font-bold text-slate-900 mt-0.5">{confirmedPass.depotName}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{confirmedPass.depotAddress}</p>
                  </div>

                  <div className="bg-white p-3 rounded-2xl border border-emerald-100 shadow-sm">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Rental Duration & Due Return</span>
                    <p className="font-bold text-slate-900 mt-0.5">{confirmedPass.days} Day(s) Pass</p>
                    <p className="text-[11px] text-rose-600 font-bold mt-0.5">Return by: {confirmedPass.dueReturn}</p>
                  </div>

                  <div className="bg-white p-3 rounded-2xl border border-emerald-100 shadow-sm">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Settlement & Savings</span>
                    <p className="font-bold text-emerald-700 mt-0.5">₹{confirmedPass.pacsCost} (Auto-settled from job)</p>
                    <p className="text-[11px] text-emerald-800 font-extrabold mt-0.5">Saved ₹{confirmedPass.savings} vs market!</p>
                  </div>
                </div>

                <div className="p-4 bg-emerald-100/70 border border-emerald-300 rounded-2xl flex items-center justify-between text-xs text-emerald-950">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
                    <span><strong>100% Mutual Cooperative Guarantee:</strong> Zero security deposit charged. Covered by SahakarSeva Society Escrow.</span>
                  </div>
                  <button
                    onClick={() => setActiveTab('my_rentals')}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-sm transition-all shrink-0"
                  >
                    View in My Active Tools
                  </button>
                </div>
              </div>
            </div>
          ) : activeTab === 'browse' ? (
            /* BROWSE TOOL CATALOG */
            <div className="space-y-6">

              {/* Cooperative Advantage Banner */}
              <div className="p-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-white border border-emerald-200 rounded-2xl flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-emerald-950 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>PACS Subsidized Heavy Equipment Depot (Up to 90% Cheaper)</span>
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
                    Why buy expensive ₹40,000 tools or borrow from local loan sharks? Rent heavy professional equipment 
                    directly from Primary Agricultural Credit Societies for <strong>₹50–₹90/day</strong> with <strong>zero security deposit</strong>.
                  </p>
                </div>
                <div className="hidden sm:block text-right shrink-0">
                  <span className="text-xs font-bold text-slate-500 uppercase block">Average Worker Savings</span>
                  <span className="text-xl font-black text-emerald-700">₹650 / Day</span>
                </div>
              </div>

              {/* Trade Filter Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold">
                {[
                  { id: 'all', label: 'All Equipment' },
                  { id: 'plumbing', label: 'Plumbing & Drainage' },
                  { id: 'electrician', label: 'Electrical & Power' },
                  { id: 'appliances', label: 'HVAC & Appliances' },
                  { id: 'carpentry', label: 'Carpentry & Framing' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedTrade(cat.id)}
                    className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                      selectedTrade === cat.id
                        ? 'bg-slate-900 text-white shadow'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Tools Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTools.map(tool => (
                  <div
                    key={tool.id}
                    className="p-4 bg-white border border-slate-200 rounded-3xl shadow-sm hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="relative h-40 w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-100">
                        <img
                          src={tool.image}
                          alt={tool.name}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-slate-950/80 backdrop-blur-md text-white">
                          {tool.trade}
                        </span>
                        <span className="absolute bottom-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-600 text-white shadow-sm">
                          {tool.availableCount} Available at Depot
                        </span>
                      </div>

                      <div>
                        <h4 className="text-sm font-black text-slate-900 leading-snug">
                          {lang === 'hi' ? tool.nameHi : tool.name}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                          {tool.specs}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{tool.depotLocation}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-lg font-black text-emerald-700">₹{tool.pacsRatePerDay}</span>
                          <span className="text-xs text-slate-400 font-bold">/ day (PACS)</span>
                        </div>
                        <span className="text-[10px] text-slate-400 line-through">Commercial: ₹{tool.commercialRentPerDay}/day</span>
                      </div>

                      <button
                        onClick={() => setSelectedTool(tool)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>Rent from Depot</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ) : (
            /* MY ACTIVE RENTALS VIEW */
            <div className="space-y-5">
              {rentedTools.length === 0 ? (
                <div className="p-12 text-center bg-slate-50 border border-dashed border-slate-300 rounded-3xl space-y-3">
                  <Wrench className="w-12 h-12 text-slate-400 mx-auto" />
                  <h4 className="text-base font-bold text-slate-800">No Active Equipment Checked Out</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    You have not checked out any tools from the PACS Depot yet. Browse the catalog to rent heavy tools starting at ₹50/day.
                  </p>
                  <button
                    onClick={() => setActiveTab('browse')}
                    className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow"
                  >
                    Browse Available Tools
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black text-slate-900">
                      Currently Deployed PACS Tools ({rentedTools.length})
                    </h4>
                    <span className="text-xs text-emerald-700 font-bold">All Zero-Deposit Escrow Covered</span>
                  </div>

                  {rentedTools.map(item => (
                    <div
                      key={item.rentalId}
                      className="p-5 bg-white border border-slate-200 rounded-3xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-slate-300 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={item.toolImage}
                          alt={item.toolName}
                          className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-slate-900 text-sm">{item.toolName}</span>
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                              {item.serialNumber}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">Depot: {item.depotName}</p>
                          <div className="flex items-center gap-3 text-xs mt-1">
                            <span className="font-bold text-emerald-700">₹{item.pacsCost} Total ({item.days}d)</span>
                            <span className="text-slate-400">•</span>
                            <span className="text-rose-600 font-bold">Return Due: {item.dueReturn}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
                        <button
                          onClick={() => setConfirmedPass(item)}
                          className="flex-1 md:flex-none px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>Show QR Pass</span>
                        </button>

                        <button
                          onClick={() => handleReturnTool(item.rentalId)}
                          className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition-all"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Return to Depot</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* CHECKOUT MODAL DRAWER / OVERLAY */}
          {selectedTool && (
            <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
              <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 border border-slate-200 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-black uppercase text-emerald-700 tracking-wider">Zero-Deposit Checkout</span>
                    <h4 className="text-base font-black text-slate-900">{selectedTool.name}</h4>
                  </div>
                  <button onClick={() => setSelectedTool(null)} className="p-1.5 text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Duration Picker */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">1. Select Rental Duration</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 5].map(days => (
                      <button
                        key={days}
                        type="button"
                        onClick={() => setSelectedDays(days)}
                        className={`p-3 rounded-2xl border-2 text-center transition-all ${
                          selectedDays === days
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-black'
                            : 'border-slate-200 text-slate-600 font-bold hover:border-slate-300'
                        }`}
                      >
                        <span className="text-sm block">{days} Day{days > 1 ? 's' : ''}</span>
                        <span className="text-[10px] text-emerald-700 font-bold block">₹{selectedTool.pacsRatePerDay * days}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Depot Picker */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">2. Select Pickup PACS Depot</label>
                  <select
                    value={selectedDepot}
                    onChange={(e) => setSelectedDepot(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-600"
                  >
                    {PACS_DEPOT_LOCATIONS.map(d => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.distance})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Settlement Calculation */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Cooperative Depot Rate:</span>
                    <span>₹{selectedTool.pacsRatePerDay} × {selectedDays} Day(s) = ₹{selectedTool.pacsRatePerDay * selectedDays}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Commercial Market Equivalent:</span>
                    <span className="line-through text-slate-400">₹{selectedTool.commercialRentPerDay * selectedDays}</span>
                  </div>
                  <div className="flex justify-between font-black text-emerald-700 pt-1 border-t border-slate-200">
                    <span>Net Member Savings:</span>
                    <span>₹{(selectedTool.commercialRentPerDay - selectedTool.pacsRatePerDay) * selectedDays} (Save 90%)</span>
                  </div>
                  <div className="flex justify-between font-extrabold text-slate-900 pt-1">
                    <span>Upfront Cash Required Today:</span>
                    <span className="text-emerald-600 font-black">₹0 (Zero Deposit)</span>
                  </div>
                </div>

                {/* Confirm Button */}
                <button
                  onClick={() => {
                    handleCheckoutTool();
                    setSelectedTool(null);
                  }}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Generate QR Pickup Pass & Reserve</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Supported under PACS Modernization Program • Ministry of Cooperation</span>
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
