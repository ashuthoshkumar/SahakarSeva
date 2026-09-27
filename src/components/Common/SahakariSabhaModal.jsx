import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Vote, Plus, CheckCircle2, XCircle, Clock, Users, TrendingUp, Shield, Banknote, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

const API = '/api';
const RENDER_BACKEND_URL = 'https://sahakar-seva-api-h1zm.onrender.com/api';

const safeFetch = async (endpoint, options = {}) => {
  const urls = [`${API}${endpoint}`, `http://localhost:5050/api${endpoint}`, `${RENDER_BACKEND_URL}${endpoint}`];
  let lastErr = null;
  for (const url of urls) {
    try {
      const res = await fetch(url, { ...options, credentials: 'include', signal: AbortSignal.timeout(4000) });
      const data = await res.json().catch(() => null);
      if (res.ok) return data || { success: true };
      if (data && (data.error || data.message)) {
        return { success: false, error: data.error || data.message };
      }
    } catch (e) {
      lastErr = e.message;
    }
  }
  return { success: false, error: lastErr || 'Network request failed' };
};

const CATEGORY_ICONS = {
  wage_policy: { icon: Banknote, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  safety: { icon: Shield, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  general: { icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  governance: { icon: Vote, color: 'text-purple-400', bg: 'bg-purple-500/10' },
};

const STATUS_STYLES = {
  ACTIVE: { label: 'Voting Open', color: 'text-emerald-300', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30', dot: 'bg-emerald-400' },
  PASSED: { label: '✅ Passed & Enforced', color: 'text-blue-300', bg: 'bg-blue-500/15', border: 'border-blue-500/30', dot: 'bg-blue-400' },
  REJECTED: { label: '❌ Rejected', color: 'text-red-300', bg: 'bg-red-500/15', border: 'border-red-500/30', dot: 'bg-red-400' },
};

export const SahakariSabhaModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewForm, setShowNewForm] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState('general');
  const [voteLoading, setVoteLoading] = useState(null);
  const [feedback, setFeedback] = useState({});

  const fetchProposals = useCallback(async () => {
    setLoading(true);
    const query = user?.id ? `?voterId=${encodeURIComponent(user.id)}` : '';
    const data = await safeFetch(`/sabha/proposals${query}`);
    if (data && data.success) setProposals(data.proposals || []);
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    if (isOpen) fetchProposals();
  }, [isOpen, fetchProposals]);

  const handleVote = async (proposalId, voteYes) => {
    if (!user?.id) return;
    setVoteLoading(proposalId);
    const data = await safeFetch('/sabha/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ proposalId, voterId: user.id, vote: voteYes })
    });
    setVoteLoading(null);
    if (data && data.success) {
      setFeedback(prev => ({
        ...prev,
        [proposalId]: {
          text: data.message || (voteYes ? 'Vote YES registered! Jai Sahakari!' : 'Vote NO registered! Jai Sahakari!'),
          type: 'success'
        }
      }));
      await fetchProposals();
      setTimeout(() => {
        setFeedback(prev => {
          const next = { ...prev };
          delete next[proposalId];
          return next;
        });
      }, 4000);
    } else {
      setFeedback(prev => ({
        ...prev,
        [proposalId]: {
          text: data?.error || 'Vote could not be processed. Please try again.',
          type: 'error'
        }
      }));
    }
  };

  const handleSubmitProposal = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) return;
    const data = await safeFetch('/sabha/proposals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: newTitle,
        description: newDescription,
        category: newCategory,
        proposedBy: user?.id || 'anonymous',
        proposedByName: user?.name || 'Cooperative Member'
      })
    });
    if (data && data.success) {
      setNewTitle('');
      setNewDescription('');
      setShowNewForm(false);
      fetchProposals();
    }
  };

  if (!isOpen) return null;

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
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                <Vote className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">सहकारी सभा — Sahakari Sabha</h2>
                <p className="text-xs text-slate-400">Democratic Cooperative Governance • ICA Principle #2</p>
              </div>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white text-2xl font-light transition-colors">×</button>
          </div>

          {/* Stats Bar */}
          <div className="flex gap-4 mt-4">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{proposals.filter(p => p.status === 'ACTIVE').length} Active Resolutions</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <CheckCircle2 className="w-3 h-3 text-blue-400" />
              <span>{proposals.filter(p => p.status === 'PASSED').length} Passed</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Users className="w-3 h-3 text-teal-400" />
              <span>{proposals.reduce((s, p) => s + (p.totalVotes || 0), 0)} Total Votes Cast</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* New Proposal Button */}
          {user && (
            <button
              onClick={() => setShowNewForm(!showNewForm)}
              className="w-full py-3 rounded-2xl border-2 border-dashed border-purple-500/30 text-purple-300 hover:bg-purple-500/10 transition-all flex items-center justify-center gap-2 text-sm font-semibold"
            >
              <Plus className="w-4 h-4" />
              {showNewForm ? 'Cancel' : 'Propose New Resolution'}
            </button>
          )}

          {/* New Proposal Form */}
          {showNewForm && (
            <form onSubmit={handleSubmitProposal} className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white">📝 New Cooperative Resolution</h3>
              <input
                type="text"
                placeholder="Resolution Title (e.g., 'Increase wage floor to ₹400/hr')"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-600/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
                required
              />
              <textarea
                placeholder="Detailed description with rationale, impact analysis, and proposed implementation..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                rows={4}
                className="w-full bg-slate-900/80 border border-slate-600/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none resize-none"
                required
              />
              <div className="flex gap-3">
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="bg-slate-900/80 border border-slate-600/50 rounded-xl px-4 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
                >
                  <option value="general">📋 General</option>
                  <option value="wage_policy">💰 Wage Policy</option>
                  <option value="safety">🛡️ Safety</option>
                  <option value="governance">🏛️ Governance</option>
                </select>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
                >
                  Publish Resolution for Democratic Vote
                </button>
              </div>
            </form>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex justify-center py-10">
              <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Proposals List */}
          {!loading && proposals.map((proposal) => {
            const catStyle = CATEGORY_ICONS[proposal.category] || CATEGORY_ICONS.general;
            const statusStyle = STATUS_STYLES[proposal.status] || STATUS_STYLES.ACTIVE;
            const CatIcon = catStyle.icon;
            const isExpanded = expandedId === proposal.id;

            return (
              <div key={proposal.id} className="bg-slate-800/40 border border-slate-700/50 rounded-2xl overflow-hidden hover:border-slate-600/60 transition-colors">
                {/* Proposal Header */}
                <div
                  className="p-5 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : proposal.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl ${catStyle.bg} flex items-center justify-center shrink-0`}>
                      <CatIcon className={`w-5 h-5 ${catStyle.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${statusStyle.bg} ${statusStyle.color} border ${statusStyle.border}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot} ${proposal.status === 'ACTIVE' ? 'animate-pulse' : ''}`} />
                          {statusStyle.label}
                        </span>
                        {proposal.status === 'ACTIVE' && (
                          <span className="text-[10px] text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {proposal.daysRemaining}d remaining
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-white leading-snug">{proposal.title}</h3>
                      <p className="text-xs text-slate-400 mt-1">Proposed by: {proposal.proposedByName}</p>
                    </div>
                    <div className="shrink-0 text-slate-500">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>

                  {/* Vote Progress Bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-emerald-400 font-bold">👍 {proposal.votesYes} Yes ({proposal.yesPercent}%)</span>
                      <span className="text-slate-500">{proposal.totalVotes} total votes</span>
                      <span className="text-red-400 font-bold">👎 {proposal.votesNo} No</span>
                    </div>
                    <div className="h-2 bg-slate-700/60 rounded-full overflow-hidden flex">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500 rounded-l-full"
                        style={{ width: `${proposal.totalVotes > 0 ? proposal.yesPercent : 0}%` }}
                      />
                      <div
                        className="h-full bg-gradient-to-r from-red-500 to-red-400 transition-all duration-500 rounded-r-full"
                        style={{ width: `${proposal.totalVotes > 0 ? (100 - proposal.yesPercent) : 0}%` }}
                      />
                    </div>
                    {proposal.yesPercent >= 60 && proposal.status === 'ACTIVE' && (
                      <p className="text-[10px] text-emerald-400 mt-1">📊 Trending toward PASS (60% threshold met)</p>
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-slate-700/40 p-5 bg-slate-900/30">
                    <p className="text-xs text-slate-300 leading-relaxed mb-4">{proposal.description}</p>

                    {/* Feedback message banner */}
                    {feedback[proposal.id] && (
                      <div className={`mb-3 p-3 rounded-xl text-xs font-semibold flex items-center gap-2 border ${
                        feedback[proposal.id].type === 'success'
                          ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                          : 'bg-red-500/15 border-red-500/30 text-red-300'
                      }`}>
                        {feedback[proposal.id].type === 'success' ? (
                          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                        )}
                        <span>{feedback[proposal.id].text}</span>
                      </div>
                    )}

                    {/* Member's Existing Vote Badge */}
                    {proposal.status === 'ACTIVE' && user && proposal.myVote !== null && proposal.myVote !== undefined && (
                      <div className="mb-3 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center justify-between text-xs">
                        <span className="text-slate-400">Your Democratic Record:</span>
                        <span className={`font-bold flex items-center gap-1 ${proposal.myVote === 1 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {proposal.myVote === 1 ? '✓ You Voted IN FAVOR (YES)' : '✓ You Voted AGAINST (NO)'}
                        </span>
                      </div>
                    )}

                    {/* Vote Buttons */}
                    {proposal.status === 'ACTIVE' && user && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleVote(proposal.id, true)}
                          disabled={voteLoading === proposal.id}
                          className={`flex-1 py-2.5 rounded-xl border font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${
                            proposal.myVote === 1
                              ? 'bg-emerald-600/30 border-emerald-400 text-emerald-200 ring-2 ring-emerald-500/40'
                              : 'bg-emerald-600/15 border-emerald-500/30 text-emerald-300 hover:bg-emerald-600/25'
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          {voteLoading === proposal.id ? 'Recording...' : proposal.myVote === 1 ? '✓ Voted YES (Samarthan)' : proposal.myVote === 0 ? 'Change Vote to YES' : 'Vote YES — Samarthan'}
                        </button>
                        <button
                          onClick={() => handleVote(proposal.id, false)}
                          disabled={voteLoading === proposal.id}
                          className={`flex-1 py-2.5 rounded-xl border font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${
                            proposal.myVote === 0
                              ? 'bg-red-600/30 border-red-400 text-red-200 ring-2 ring-red-500/40'
                              : 'bg-red-600/15 border-red-500/30 text-red-300 hover:bg-red-600/25'
                          }`}
                        >
                          <XCircle className="w-4 h-4" />
                          {voteLoading === proposal.id ? 'Recording...' : proposal.myVote === 0 ? '✓ Voted NO (Virodh)' : proposal.myVote === 1 ? 'Change Vote to NO' : 'Vote NO — Virodh'}
                        </button>
                      </div>
                    )}

                    {!user && proposal.status === 'ACTIVE' && (
                      <p className="text-xs text-slate-500 text-center py-2">🔒 Login as a cooperative member to cast your democratic vote</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Empty State */}
          {!loading && proposals.length === 0 && (
            <div className="text-center py-12">
              <Vote className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">No resolutions yet. Be the first to propose!</p>
            </div>
          )}

          {/* ICA Principle Footer */}
          <div className="bg-gradient-to-r from-purple-900/20 to-indigo-900/20 border border-purple-500/20 rounded-2xl p-4 mt-4">
            <p className="text-xs text-purple-300 font-bold mb-1">🏛️ ICA Cooperative Principle #2 — Democratic Member Control</p>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              "Cooperatives are democratic organisations controlled by their members, who actively participate in setting policies and making decisions.
              Representatives are accountable to the membership. Members have equal voting rights — one member, one vote."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SahakariSabhaModal;
