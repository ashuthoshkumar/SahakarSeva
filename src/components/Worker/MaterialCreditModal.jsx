import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Wrench, CheckCircle2, X, Plus, Trash2, QrCode,
  ShieldCheck, ArrowRight, DollarSign, Store, Sparkles, CreditCard
} from 'lucide-react';

const COMMON_PARTS_CATALOG = [
  { id: 'p1', name: 'Anchor 32A Double-Pole MCB', category: 'electrician', price: 480 },
  { id: 'p2', name: 'Finolex 2.5mm Copper Wire (10m)', category: 'electrician', price: 650 },
  { id: 'p3', name: 'Brass Gate/Ball Valve 1/2-inch', category: 'plumber', price: 380 },
  { id: 'p4', name: 'CPVC High-Pressure Pipe Joint (x2)', category: 'plumber', price: 220 },
  { id: 'p5', name: '45 MFD Dual Motor Capacitor', category: 'technician', price: 350 },
  { id: 'p6', name: 'Heavy-Duty Brass Mortise Door Lock', category: 'carpenter', price: 850 }
];

export const MaterialCreditModal = ({ isOpen, onClose }) => {
  const { addNotification } = useApp();

  const [selectedItems, setSelectedItems] = useState([COMMON_PARTS_CATALOG[0]]);
  const [customItemName, setCustomItemName] = useState('');
  const [customItemPrice, setCustomItemPrice] = useState('');
  const [merchantName, setMerchantName] = useState('Sharma Electricals & Hardware');
  const [merchantUpi, setMerchantUpi] = useState('sharmahardware@oksbi');
  const [generatedVoucher, setGeneratedVoucher] = useState(null);

  if (!isOpen) return null;

  const totalCost = selectedItems.reduce((sum, item) => sum + item.price, 0);

  const handleAddCustomItem = () => {
    if (!customItemName.trim() || !customItemPrice || isNaN(customItemPrice)) return;
    const newItem = {
      id: 'custom_' + Date.now(),
      name: customItemName.trim(),
      price: Number(customItemPrice)
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
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Active • Direct Merchant Settlement'
    });

    addNotification(`Zero-Interest e-RUPI Voucher of ₹${totalCost} issued to ${merchantName}!`, 'success');
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-scaleUp">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-teal-950 text-white p-4 relative flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-400/30 shadow-inner">
              <Wrench className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-400/30">
                  PACS Credit Line
                </span>
                <span className="text-[10px] text-slate-300 font-bold">0% Interest</span>
              </div>
              <h3 className="text-base font-extrabold text-white leading-tight">
                Material & Spare Parts Micro-Credit Vault
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1 text-slate-800">
          
          {!generatedVoucher ? (
            <>
              {/* Working Capital Banner */}
              <div className="bg-amber-500/10 border border-amber-400/40 rounded-2xl p-3.5 space-y-1 text-xs">
                <p className="font-extrabold text-amber-950 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Never Pay Out-of-Pocket for Replacement Parts</span>
                </p>
                <p className="text-slate-600 text-[11px] leading-snug">
                  Powered by Ministry of Cooperation’s <strong>Primary Agricultural Credit Societies (PACS)</strong>. Get immediate 24-hr working capital credit directly disbursed to any local hardware merchant.
                </p>
              </div>

              {/* Selected Materials List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-slate-800 uppercase tracking-wider">
                    Required Materials for Current Job:
                  </label>
                  <span className="text-xs font-black text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                    Total: ₹{totalCost}
                  </span>
                </div>

                <div className="space-y-1.5">
                  {selectedItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                    >
                      <span className="font-bold text-slate-800">{item.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900">₹{item.price}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Custom Item Inputs */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs">
                <span className="font-bold text-slate-700 block text-[11px] uppercase">
                  Add Item from Local Hardware Store:
                </span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customItemName}
                    onChange={(e) => setCustomItemName(e.target.value)}
                    placeholder="Part Name (e.g. Copper coupling)"
                    className="flex-1 p-2 rounded-xl border border-slate-300 bg-white font-medium focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <input
                    type="number"
                    value={customItemPrice}
                    onChange={(e) => setCustomItemPrice(e.target.value)}
                    placeholder="Price (₹)"
                    className="w-24 p-2 rounded-xl border border-slate-300 bg-white font-medium focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomItem}
                    className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-sm flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>

                {/* Quick Add Catalog Pills */}
                <div className="pt-1 flex flex-wrap gap-1">
                  {COMMON_PARTS_CATALOG.filter(
                    (p) => !selectedItems.some((s) => s.id === p.id)
                  ).slice(0, 3).map((part) => (
                    <button
                      key={part.id}
                      type="button"
                      onClick={() => setSelectedItems([...selectedItems, part])}
                      className="px-2 py-0.5 rounded-lg bg-white border border-slate-200 hover:border-amber-300 text-[10px] text-slate-600 font-medium"
                    >
                      + {part.name} (₹{part.price})
                    </button>
                  ))}
                </div>
              </div>

              {/* Merchant Details */}
              <div className="space-y-2 text-xs">
                <label className="font-black text-slate-800 uppercase tracking-wider block">
                  Hardware Store Destination:
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-500 block mb-0.5">Shop / Store Name</label>
                    <input
                      type="text"
                      value={merchantName}
                      onChange={(e) => setMerchantName(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-500 block mb-0.5">Store UPI / VPA ID</label>
                    <input
                      type="text"
                      value={merchantUpi}
                      onChange={(e) => setMerchantUpi(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Action Submit */}
              <button
                type="button"
                onClick={handleIssueVoucher}
                disabled={selectedItems.length === 0 || totalCost === 0}
                className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-95"
              >
                <CreditCard className="w-4 h-4" />
                <span>Issue Instant ₹{totalCost} e-RUPI Voucher →</span>
              </button>
            </>
          ) : (
            /* Digital e-RUPI Voucher Generated Screen */
            <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl text-center space-y-3 animate-fadeIn">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                  e-RUPI Digital Voucher Live
                </span>
                <h4 className="text-base font-black text-emerald-950 mt-1">
                  ₹{generatedVoucher.amount}.00 Authorized to Merchant
                </h4>
                <p className="text-xs text-emerald-800 mt-0.5 font-mono">
                  {generatedVoucher.voucherId}
                </p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-emerald-200 text-xs text-left space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Merchant Store:</span>
                  <strong className="text-slate-900">{generatedVoucher.merchant}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Merchant UPI:</span>
                  <strong className="text-slate-800 font-mono text-[11px]">{generatedVoucher.upi}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Cooperative Sponsor:</span>
                  <strong className="text-emerald-700 font-bold">PACS Sahakari Credit Line</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Interest Rate:</span>
                  <strong className="text-emerald-700 font-bold">0.00% Free Credit</strong>
                </div>
              </div>

              <p className="text-[11px] text-slate-500">
                The hardware merchant can scan this voucher or accept payment directly to {generatedVoucher.upi}. This amount is now transparently recorded in the customer's escrow bill.
              </p>

              <button
                onClick={() => {
                  setGeneratedVoucher(null);
                  onClose();
                }}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow transition-all"
              >
                Return to Job
              </button>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-[10px] text-slate-400">
          Integrated with PACS E-Governance Network & NABARD Cooperative Framework
        </div>

      </div>
    </div>
  );
};
