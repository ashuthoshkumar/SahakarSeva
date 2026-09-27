import React, { useState, useEffect, useCallback } from 'react';
import { Link2, Shield, CheckCircle2, Hash, Clock, ChevronDown, ChevronUp, Copy, Search } from 'lucide-react';

const API = '/api';
const RENDER_BACKEND_URL = 'https://sahakar-seva-api-h1zm.onrender.com/api';

const safeFetch = async (endpoint) => {
  const urls = [`${API}${endpoint}`, `${RENDER_BACKEND_URL}${endpoint}`, `http://localhost:5050/api${endpoint}`];
  for (const url of urls) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
      if (res.ok) return await res.json();
    } catch (e) {}
  }
  return { success: false };
};

export const NyayaPramaanModal = ({ isOpen, onClose }) => {
  const [chain, setChain] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedBlock, setExpandedBlock] = useState(null);
  const [chainMeta, setChainMeta] = useState({});
  const [copiedHash, setCopiedHash] = useState(null);
  const [searchId, setSearchId] = useState('');
  const [verifyResult, setVerifyResult] = useState(null);

  const fetchChain = useCallback(async () => {
    setLoading(true);
    const data = await safeFetch('/nyaya/chain');
    if (data.success) {
      setChain(data.chain || []);
      setChainMeta({
        chainLength: data.chainLength,
        genesisHash: data.genesisHash,
        latestHash: data.latestHash,
        tamperProof: data.tamperProof
      });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isOpen) fetchChain();
  }, [isOpen, fetchChain]);

  const handleCopyHash = (hash) => {
    navigator.clipboard?.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const handleVerify = async () => {
    if (!searchId.trim()) return;
    setVerifyResult(null);
    const data = await safeFetch(`/nyaya/verify/${searchId.trim()}`);
    setVerifyResult(data);
  };

  if (!isOpen) return null;

  const wageBlocks = chain.filter(b => b.type === 'WAGE_PAYMENT');
  const totalWagesPaid = wageBlocks.reduce((s, b) => s + (b.baseWage || 0), 0);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-700/60 bg-gradient-to-b from-[#0c1222] to-[#0a0f1a] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-[#0c1222] via-[#111827] to-[#0c1222] border-b border-slate-700/50 px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
                <Link2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">न्याय प्रमाण — Nyaya Pramaan</h2>
                <p className="text-xs text-slate-400">Immutable Fair Wage Proof Chain • SHA-256 Merkle Ledger</p>
              </div>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white text-2xl font-light transition-colors">×</button>
          </div>

          {/* Chain Stats */}
          <div className="grid grid-cols-4 gap-3 mt-4">
            <div className="bg-slate-800/50 rounded-xl p-2.5 text-center">
              <p className="text-lg font-bold text-teal-400">{chainMeta.chainLength || 0}</p>
              <p className="text-[10px] text-slate-500">Blocks</p>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-2.5 text-center">
              <p className="text-lg font-bold text-emerald-400">₹{totalWagesPaid.toLocaleString()}</p>
              <p className="text-[10px] text-slate-500">Wages Recorded</p>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-2.5 text-center">
              <p className="text-lg font-bold text-amber-400">{wageBlocks.length}</p>
              <p className="text-[10px] text-slate-500">Payments</p>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-2.5 text-center flex flex-col items-center justify-center">
              <Shield className={`w-5 h-5 ${chainMeta.tamperProof ? 'text-emerald-400' : 'text-red-400'}`} />
              <p className="text-[10px] text-slate-500 mt-0.5">{chainMeta.tamperProof ? 'Tamper-Proof' : 'Checking...'}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Verify a specific booking */}
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4">
            <h3 className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-teal-400" />
              Verify Wage Payment
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter Booking ID (e.g., BK-2026-123)"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="flex-1 bg-slate-900/80 border border-slate-600/50 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none"
              />
              <button
                onClick={handleVerify}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-sm font-bold rounded-xl transition-colors"
              >
                Verify
              </button>
            </div>
            {verifyResult && (
              <div className={`mt-3 p-3 rounded-xl border text-xs ${verifyResult.verified ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-amber-500/10 border-amber-500/30 text-amber-300'}`}>
                <p className="font-bold">{verifyResult.message}</p>
                {verifyResult.verified && (
                  <div className="mt-1.5 space-y-0.5 text-slate-400">
                    <p>Worker: <span className="text-white">{verifyResult.workerName}</span></p>
                    <p>Base Wage: <span className="text-emerald-300">₹{verifyResult.baseWage}</span></p>
                    <p className="font-mono text-[10px] break-all">Hash: {verifyResult.hash}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex justify-center py-10">
              <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Chain Blocks */}
          {!loading && chain.map((block, idx) => {
            const isExpanded = expandedBlock === idx;
            const isGenesis = block.type === 'GENESIS';

            return (
              <div key={idx} className="relative">
                {/* Connector Line */}
                {idx > 0 && (
                  <div className="absolute -top-2 left-6 w-0.5 h-4 bg-gradient-to-b from-teal-500/60 to-slate-700/30" />
                )}

                <div
                  className={`border rounded-2xl overflow-hidden transition-colors cursor-pointer ${
                    isGenesis
                      ? 'bg-gradient-to-r from-teal-900/20 to-cyan-900/20 border-teal-500/30'
                      : 'bg-slate-800/30 border-slate-700/40 hover:border-slate-600/60'
                  }`}
                  onClick={() => setExpandedBlock(isExpanded ? null : idx)}
                >
                  <div className="p-4 flex items-center gap-3">
                    {/* Block Number */}
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                      isGenesis ? 'bg-teal-500/20 text-teal-300' : 'bg-slate-700/50 text-slate-300'
                    }`}>
                      #{block.blockIndex}
                    </div>

                    {/* Block Info */}
                    <div className="flex-1 min-w-0">
                      {isGenesis ? (
                        <p className="text-sm font-bold text-teal-300">🏛️ Genesis Block — Ledger Initialized</p>
                      ) : (
                        <div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span className="text-sm font-bold text-white truncate">{block.workerName}</span>
                            <span className="text-xs text-emerald-400 font-bold">₹{block.baseWage}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-slate-500">{block.bookingId}</span>
                            <span className="text-[10px] text-slate-600">•</span>
                            <span className="text-[10px] text-slate-500">{block.category}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Hash Preview */}
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-mono text-[10px] text-slate-500 hidden sm:inline">
                        {block.hash?.slice(0, 8)}...
                      </span>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                    </div>
                  </div>

                  {/* Expanded Hash Details */}
                  {isExpanded && (
                    <div className="border-t border-slate-700/30 p-4 bg-slate-900/40 space-y-2">
                      <div className="flex items-start gap-2">
                        <Hash className="w-3.5 h-3.5 text-teal-400 mt-0.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-slate-500 mb-0.5">Current Block Hash (SHA-256):</p>
                          <div className="flex items-center gap-1.5">
                            <p className="font-mono text-[11px] text-teal-300 break-all">{block.hash}</p>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleCopyHash(block.hash); }}
                              className="shrink-0 p-1 rounded hover:bg-slate-700/50 transition-colors"
                            >
                              <Copy className={`w-3 h-3 ${copiedHash === block.hash ? 'text-emerald-400' : 'text-slate-500'}`} />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Link2 className="w-3.5 h-3.5 text-slate-500 mt-0.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-slate-500 mb-0.5">Previous Block Hash:</p>
                          <p className="font-mono text-[11px] text-slate-400 break-all">{block.prevHash}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <p className="text-[10px] text-slate-500">Timestamp: {block.timestamp}</p>
                      </div>

                      {block.type === 'WAGE_PAYMENT' && (
                        <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-700/30">
                          <div className="text-center">
                            <p className="text-xs font-bold text-emerald-400">₹{block.baseWage}</p>
                            <p className="text-[9px] text-slate-500">Base Wage (90%)</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs font-bold text-amber-400">₹{block.welfareContribution}</p>
                            <p className="text-[9px] text-slate-500">Welfare (5%)</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs font-bold text-white">₹{block.totalAmount}</p>
                            <p className="text-[9px] text-slate-500">Total Paid</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Empty State */}
          {!loading && wageBlocks.length === 0 && (
            <div className="text-center py-8">
              <Link2 className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">No wage payments recorded yet.</p>
              <p className="text-slate-500 text-xs mt-1">Complete a booking with payment to see it on the proof chain.</p>
            </div>
          )}

          {/* Integrity Footer */}
          <div className="bg-gradient-to-r from-teal-900/20 to-cyan-900/20 border border-teal-500/20 rounded-2xl p-4 mt-4">
            <p className="text-xs text-teal-300 font-bold mb-1">🔐 Merkle Hash Chain Integrity</p>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Each wage payment is cryptographically linked to the previous one using SHA-256 hashing.
              Modifying any past record would break all subsequent hashes — making the ledger tamper-evident.
              Any cooperative member can independently verify their payment was correctly recorded.
            </p>
            {chainMeta.latestHash && (
              <p className="font-mono text-[9px] text-slate-500 mt-2 break-all">
                Latest: {chainMeta.latestHash}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NyayaPramaanModal;
