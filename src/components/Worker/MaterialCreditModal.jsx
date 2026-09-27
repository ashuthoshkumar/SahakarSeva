import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Wrench, CheckCircle2, X, Plus, Trash2, QrCode,
  ShieldCheck, ArrowRight, Store, Sparkles, CreditCard,
  Copy, Check, Download, AlertCircle, ShoppingBag
} from 'lucide-react';

const COMMON_PARTS_CATALOG = [
  { id: 'p1', name: 'Anchor 32A Double-Pole MCB', category: 'electrician', price: 480, unit: 'piece' },
  { id: 'p2', name: 'Finolex 2.5mm Copper Wire (10m)', category: 'electrician', price: 650, unit: 'coil' },
  { id: 'p3', name: 'Brass Gate / Ball Valve 1/2-inch', category: 'plumber', price: 380, unit: 'piece' },
  { id: 'p4', name: 'CPVC High-Pressure Pipe Joint (x2)', category: 'plumber', price: 220, unit: 'pair' },
  { id: 'p5', name: '45 MFD Dual Motor AC Capacitor', category: 'technician', price: 350, unit: 'piece' },
  { id: 'p6', name: 'Heavy-Duty Brass Mortise Door Lock', category: 'carpenter', price: 850, unit: 'set' }
];

export const MaterialCreditModal = ({ isOpen, onClose }) => {
  const { addNotification } = useApp();

  const [selectedItems, setSelectedItems] = useState([COMMON_PARTS_CATALOG[0]]);
  const [customItemName, setCustomItemName] = useState('');
  const [customItemPrice, setCustomItemPrice] = useState('');
  const [merchantName, setMerchantName] = useState('Sharma Electricals & Hardware');
  const [merchantUpi, setMerchantUpi] = useState('sharmahardware@oksbi');
  const [generatedVoucher, setGeneratedVoucher] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  const totalCost = selectedItems.reduce((sum, item) => sum + item.price, 0);

  const handleAddCustomItem = () => {
    if (!customItemName.trim() || !customItemPrice || isNaN(customItemPrice)) return;
    const newItem = {
      id: 'custom_' + Date.now(),
      name: customItemName.trim(),
      price: Number(customItemPrice),
      unit: 'custom'
    };
    setSelectedItems([...selectedItems, newItem]);
    setCustomItemName('');
    setCustomItemPrice('');
  };

  const handleRemoveItem = (id) => {
    setSelectedItems(selectedItems.filter((i) => i.id !== id));
  };

  const handleIssueVoucher = (e) => {
    e.preventDefault();
    if (selectedItems.length === 0 || !merchantName.trim()) return;

    const voucherId = 'ERUPI-PACS-' + Math.floor(100000 + Math.random() * 900000);
    setGeneratedVoucher({
      voucherId,
      amount: totalCost,
      merchant: merchantName,
      upi: merchantUpi,
      issuedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      validTill: '24 Hours (Auto-Settled from Job Payout)',
      status: 'Active • Guaranteed by PACS Escrow'
    });

    addNotification(`Zero-Interest e-RUPI Voucher of ₹${totalCost} issued to ${merchantName}!`, 'success');
  };

  const handleCopyVoucher = () => {
    if (!generatedVoucher) return;
    navigator.clipboard?.writeText(generatedVoucher.voucherId);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
      <div 
        className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header — Clean Cooperative Financial Institution Look */}
        <div className="bg-slate-900 border-b border-slate-800 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-400/30">
                  PACS Micro-Credit • e-RUPI
                </span>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  0% Interest
                </span>
              </div>
              <h3 className="text-base font-black text-white mt-1 leading-tight">
                Material & Spare Parts Vault
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1 text-slate-800 bg-[#f8fafc]">
          
          {!generatedVoucher ? (
            <>
              {/* Working Capital Guarantee Notice */}
              <div className="bg-white border border-amber-200/80 rounded-2xl p-4 shadow-xs space-y-1">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <h4 className="text-xs font-black text-amber-950 uppercase tracking-wide">
                    Zero Out-of-Pocket Cost for Artisans
                  </h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Backed by the Ministry of Cooperation & PACS. Purchase required hardware items from any local shop via instant <strong>e-RUPI merchant vouchers</strong> without paying from your pocket. The cost is auto-settled upon customer completion.
                </p>
              </div>

              {/* Selected Materials List */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-slate-600" />
                    <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                      Selected Hardware & Parts ({selectedItems.length})
                    </span>
                  </div>
                  <span className="text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    Total: ₹{totalCost}
                  </span>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedItems.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-4">No materials selected yet. Pick from catalog below or add custom item.</p>
                  ) : (
                    selectedItems.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs hover:border-slate-300 transition-colors"
                      >
                        <div>
                          <p className="font-bold text-slate-900">{item.name}</p>
                          <span className="text-[10px] text-slate-400 capitalize">{item.unit || 'unit'}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-black text-slate-900 text-sm">₹{item.price}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Remove"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Quick Add Catalog Pills */}
                <div className="pt-2 border-t border-slate-100">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Quick Add Common Parts:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {COMMON_PARTS_CATALOG.filter(
                      (p) => !selectedItems.some((s) => s.id === p.id)
                    ).map((part) => (
                      <button
                        key={part.id}
                        type="button"
                        onClick={() => setSelectedItems([...selectedItems, part])}
                        className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-amber-50 hover:border-amber-300 border border-slate-200 text-xs text-slate-700 font-semibold transition-all flex items-center gap-1 active:scale-95"
                      >
                        <Plus className="w-3 h-3 text-amber-600" />
                        <span>{part.name}</span>
                        <strong className="text-slate-900 ml-0.5">₹{part.price}</strong>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Add Custom Item Inputs */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-2">
                <span className="text-xs font-black text-slate-800 uppercase tracking-wider block">
                  Add Custom Item From Store:
                </span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customItemName}
                    onChange={(e) => setCustomItemName(e.target.value)}
                    placeholder="Part Name (e.g. 1/2-inch Brass Coupling)"
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                  />
                  <div className="relative w-28">
                    <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">₹</span>
                    <input
                      type="number"
                      value={customItemPrice}
                      onChange={(e) => setCustomItemPrice(e.target.value)}
                      placeholder="Price"
                      className="w-full pl-6 pr-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddCustomItem}
                    className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1 shrink-0 active:scale-95 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              {/* Merchant Details */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-slate-600" />
                  <label className="text-xs font-black text-slate-800 uppercase tracking-wider">
                    Hardware Store Destination:
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Store / Merchant Name</label>
                    <input
                      type="text"
                      value={merchantName}
                      onChange={(e) => setMerchantName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Store UPI / VPA ID</label>
                    <input
                      type="text"
                      value={merchantUpi}
                      onChange={(e) => setMerchantUpi(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Action Submit */}
              <button
                type="button"
                onClick={handleIssueVoucher}
                disabled={selectedItems.length === 0 || totalCost === 0}
                className="w-full py-3.5 bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-700 hover:to-amber-900 disabled:opacity-50 text-white font-black text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
              >
                <CreditCard className="w-4 h-4" />
                <span>Issue Instant ₹{totalCost} e-RUPI Voucher →</span>
              </button>
            </>
          ) : (
            /* Digital e-RUPI Voucher Generated Screen — Authentic Bank/NPCI Instrument */
            <div className="bg-white border-2 border-emerald-400 rounded-3xl p-6 shadow-md text-center space-y-4 animate-fadeIn">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  e-RUPI Digital Voucher Live
                </span>
                <h4 className="text-2xl font-black text-slate-900 mt-2">
                  ₹{generatedVoucher.amount}.00 Authorized
                </h4>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                    {generatedVoucher.voucherId}
                  </span>
                  <button
                    onClick={handleCopyVoucher}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
                    title="Copy Voucher Code"
                  >
                    {copiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Simulated QR Code */}
              <div className="w-40 h-40 mx-auto bg-slate-900 p-3 rounded-2xl border-4 border-emerald-100 shadow-md flex items-center justify-center">
                <QrCode className="w-full h-full text-white" />
              </div>

              {/* Itemized Instrument Details */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-left space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Merchant Store:</span>
                  <strong className="text-slate-900 font-bold">{generatedVoucher.merchant}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Merchant UPI:</span>
                  <strong className="text-slate-800 font-mono text-[11px]">{generatedVoucher.upi}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Cooperative Sponsor:</span>
                  <strong className="text-emerald-700 font-bold">PACS Sahakari Credit Line</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Interest Rate:</span>
                  <strong className="text-emerald-700 font-bold">0.00% Zero-Interest Advance</strong>
                </div>
                <div className="flex justify-between items-center border-t border-slate-200 pt-1.5">
                  <span className="text-slate-500">Settlement:</span>
                  <strong className="text-slate-700 font-semibold">{generatedVoucher.validTill}</strong>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setGeneratedVoucher(null);
                    onClose();
                  }}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow transition-all cursor-pointer"
                >
                  Confirm & Return to Job
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-100 border-t border-slate-200 text-center text-[11px] text-slate-500 font-medium">
          Integrated with PACS E-Governance Network & NABARD Cooperative Framework
        </div>

      </div>
    </div>
  );
};

export default MaterialCreditModal;
