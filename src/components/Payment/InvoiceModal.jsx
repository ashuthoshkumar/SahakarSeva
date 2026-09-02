import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Modal } from '../Common/Modal';
import { Download, Printer, ShieldCheck, CheckCircle2, Building2, Landmark, FileText, Sparkles, HeartHandshake } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { translateCategory, translateWorkerName } from '../../utils/translateHelpers';

export const InvoiceModal = () => {
  const { invoiceModalOpen, setInvoiceModalOpen, selectedBooking, addNotification } = useApp();
  const { t, lang } = useLanguage();
  const [isDownloading, setIsDownloading] = useState(false);

  if (!selectedBooking) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    const element = document.getElementById('invoice-paper-content');
    if (!element) return;

    setIsDownloading(true);
    try {
      const opt = {
        margin: [8, 8, 8, 8],
        filename: `SahakarSeva_Invoice_${selectedBooking.id}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      await html2pdf().set(opt).from(element).save();
      addNotification('Official PDF Invoice Downloaded!', 'success');
    } catch (err) {
      console.warn('PDF generation error:', err);
      addNotification('PDF download failed on this device. Use "Print" button to save as PDF.', 'error');
    } finally {
      setIsDownloading(false);
    }
  };

  const formattedDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const baseWage = selectedBooking.baseWage || 700;
  const welfareContrib = selectedBooking.welfareContribution || Math.round(baseWage * 0.05);
  const healthContrib = selectedBooking.healthInsurance || Math.round(baseWage * 0.02);
  const platformFee = selectedBooking.platformFee || Math.round(baseWage * 0.03);
  const totalAmount = selectedBooking.totalAmount || (baseWage + welfareContrib + healthContrib + platformFee);

  return (
    <Modal
      isOpen={invoiceModalOpen}
      onClose={() => setInvoiceModalOpen(false)}
      title="Official Tax & Fair Wage Bill Receipt"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4 font-sans text-slate-800">
        
        {/* PRINTABLE PDF CONTAINER */}
        <div
          id="invoice-paper-content"
          className="p-5 sm:p-7 bg-white border border-slate-300 rounded-2xl shadow-sm space-y-5 relative overflow-hidden"
        >
          {/* PAID WATERMARK STAMP */}
          <div className="absolute top-12 right-12 opacity-15 pointer-events-none select-none rotate-[-12deg]">
            <div className="border-4 border-emerald-600 text-emerald-600 px-6 py-2 rounded-xl text-3xl font-black tracking-widest uppercase text-center">
              PAID & VERIFIED
            </div>
          </div>

          {/* OFFICIAL GOVT COOP HEADER */}
          <div className="flex items-start justify-between border-b-2 border-teal-600 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-white font-black text-sm flex items-center justify-center shadow">
                  🤝
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none">
                    Sahakar<span className="text-teal-600">Seva</span>
                  </h2>
                  <p className="text-[10px] text-teal-800 font-extrabold tracking-wide uppercase">
                    Labour Cooperative Portal
                  </p>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">
                Ministry of Cooperation • NCCT Govt of India Framework
              </p>
              <p className="text-[9px] text-slate-400 font-mono">Reg. No: MSCS/CR/2026/842-DEL</p>
            </div>

            <div className="text-right space-y-0.5">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[10px] border border-emerald-300">
                TAX & WAGE RECEIPT
              </span>
              <p className="text-xs font-mono font-bold text-slate-900 mt-1">Inv #{selectedBooking.id}</p>
              <p className="text-[11px] text-slate-500">Date: {formattedDate}</p>
              <p className="text-[10px] text-teal-700 font-bold">UPI TXN: #{selectedBooking.id}_SETTLED</p>
            </div>
          </div>

          {/* BILLED TO / WORKER DETAILS GRID */}
          <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="space-y-0.5">
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Billed Customer</span>
              <p className="font-extrabold text-slate-900 text-sm">{selectedBooking.customerName || 'Customer'}</p>
              <p className="text-slate-600 text-[11px] leading-tight">{selectedBooking.address || 'GPS Service Location'}</p>
              <p className="text-slate-500 text-[10px] mt-0.5">Phone: {selectedBooking.customerPhone || 'N/A'}</p>
            </div>

            <div className="space-y-0.5 border-l border-slate-200 pl-3">
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Assigned Cooperative Worker</span>
              <p className="font-extrabold text-slate-900 text-sm">{translateWorkerName(selectedBooking.workerName, lang)}</p>
              <div className="flex items-center gap-1 text-teal-700 font-bold text-[10px]">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>NCCT Verified Craftsman</span>
              </div>
              <p className="text-slate-500 text-[10px]">Society: {selectedBooking.societyName || 'Cooperative Society'}</p>
            </div>
          </div>

          {/* FARE BREAKDOWN TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white font-bold">
                  <th className="py-2 px-3 rounded-l-lg">Service Item Description</th>
                  <th className="py-2 px-3 text-center">Hours</th>
                  <th className="py-2 px-3 text-right rounded-r-lg">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                <tr>
                  <td className="py-2.5 px-3">
                    <p className="font-extrabold text-slate-900 text-xs">
                      {translateCategory(selectedBooking.category, t)} Service
                    </p>
                    <p className="text-[10px] text-slate-500">100% Minimum Wage Floor Direct Payout to Worker</p>
                  </td>
                  <td className="py-2.5 px-3 text-center font-bold text-slate-800">
                    {selectedBooking.hours || 2} hrs
                  </td>
                  <td className="py-2.5 px-3 text-right font-extrabold text-slate-900">
                    ₹{baseWage}.00
                  </td>
                </tr>

                {/* Statutory Cooperative Contributions */}
                <tr className="bg-teal-50/60">
                  <td colSpan={2} className="py-2 px-3 font-semibold text-teal-900 text-[11px]">
                    <span className="flex items-center gap-1">
                      <HeartHandshake className="w-3 h-3 text-teal-600" />
                      Labor Cooperative Pension & Welfare Fund (5%)
                    </span>
                  </td>
                  <td className="py-2 px-3 text-right font-bold text-teal-900 text-[11px]">
                    + ₹{welfareContrib}.00
                  </td>
                </tr>

                <tr className="bg-teal-50/30">
                  <td colSpan={2} className="py-2 px-3 text-slate-700 text-[11px]">
                    Ayushman Bharat Worker Health & Insurance Cover (2%)
                  </td>
                  <td className="py-2 px-3 text-right font-bold text-slate-800 text-[11px]">
                    + ₹{healthContrib}.00
                  </td>
                </tr>

                <tr>
                  <td colSpan={2} className="py-2 px-3 text-slate-600 text-[11px]">
                    SahakarSeva Platform Operations Fee (3%)
                  </td>
                  <td className="py-2 px-3 text-right font-bold text-slate-700 text-[11px]">
                    + ₹{platformFee}.00
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* TOTAL AMOUNT & STATUS BOX */}
          <div className="flex items-center justify-between p-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-xl shadow-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
              <div>
                <p className="font-extrabold text-xs">Payment Escrow Verified</p>
                <p className="text-[10px] text-emerald-100">Settled to Worker's Sahakari Account</p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-200">Total Billed</span>
              <p className="text-xl font-black text-white">₹{totalAmount}.00</p>
            </div>
          </div>

          {/* FOOTER CERTIFICATION & DIGITAL SIGNATURE */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <Landmark className="w-3.5 h-3.5 text-teal-600" />
              <span className="font-medium">Digitally Signed by NCCT Authority</span>
            </div>
            <span className="font-bold text-emerald-700">Fair Wages Guaranteed • 0% Exploitation</span>
          </div>

        </div>

        {/* ACTION BUTTONS: PRINT & DOWNLOAD PDF */}
        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt</span>
          </button>
          
          <button
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className="px-4 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 active:from-teal-700 active:to-emerald-700 text-white rounded-xl font-extrabold text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>{isDownloading ? 'Generating PDF...' : 'Download Official PDF'}</span>
          </button>
        </div>

      </div>
    </Modal>
  );
};
