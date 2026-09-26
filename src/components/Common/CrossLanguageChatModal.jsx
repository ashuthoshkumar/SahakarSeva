import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import {
  X, Send, Volume2, Mic, MicOff, Globe, Sparkles, MessageSquare, ShieldCheck, CheckCheck
} from 'lucide-react';
import { bhashiniTranslate, bhashiniSpeakText, bhashiniStopSpeaking } from '../../services/bhashiniService';

export const CrossLanguageChatModal = ({ isOpen, onClose, booking }) => {
  const { lang, t } = useLanguage();
  const { user } = useAuth();

  const [messages, setMessages] = useState(() => {
    // Initial sample messages contextualized for the booking
    return [
      {
        id: 'msg_1',
        senderRole: 'customer',
        senderName: booking?.customerName || 'Customer',
        originalText: 'Hello, please bring an extra tester and 16A switch.',
        sourceLang: 'en',
        translatedText: 'नमस्ते, कृपया एक अतिरिक्त टेस्टर और 16A स्विच साथ लाएं।',
        targetLang: 'hi',
        time: 'Just now'
      }
    ];
  });

  const [inputText, setInputText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isPlayingAudioId, setIsPlayingAudioId] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);

  const isWorker = user?.role === 'worker';
  const myRole = isWorker ? 'worker' : 'customer';
  const myName = user?.name || (isWorker ? 'Worker' : 'Customer');

  // Auto scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Clean up audio playback on unmount
  useEffect(() => {
    return () => {
      bhashiniStopSpeaking();
    };
  }, []);

  if (!isOpen) return null;

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    const currentText = inputText.trim();
    setInputText('');
    setIsTranslating(true);

    const sourceLang = isWorker ? (lang || 'hi') : 'en';
    const targetLang = isWorker ? 'en' : (lang || 'hi');

    // Call Bhashini NMT via backend proxy
    let translated = currentText;
    try {
      translated = await bhashiniTranslate(currentText, sourceLang, targetLang);
    } catch (err) {
      console.warn('Bhashini translate fallback:', err);
    }

    const newMsg = {
      id: `msg_${Date.now()}`,
      senderRole: myRole,
      senderName: myName,
      originalText: currentText,
      sourceLang,
      translatedText: translated,
      targetLang,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, newMsg]);
    setIsTranslating(false);
  };

  const handleSpeakMessage = (msg) => {
    if (isPlayingAudioId === msg.id) {
      bhashiniStopSpeaking();
      setIsPlayingAudioId(null);
      return;
    }

    // Worker hears the translated or native text in their language
    const textToSpeak = isWorker ? (msg.senderRole === 'worker' ? msg.originalText : msg.translatedText) : msg.originalText;
    const speakLang = isWorker ? (lang || 'hi') : 'en';

    setIsPlayingAudioId(msg.id);
    bhashiniSpeakText(textToSpeak, speakLang, () => {
      setIsPlayingAudioId(null);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-200">
        
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm text-white">
                  {isWorker ? (booking?.customerName || 'Customer') : (booking?.workerName || 'Assigned Worker')}
                </h3>
                <span className="inline-flex items-center gap-1 text-[9px] font-black bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded-full">
                  <Sparkles className="w-2.5 h-2.5" />
                  Bhashini AI Live
                </span>
              </div>
              <p className="text-[11px] text-teal-200/80 flex items-center gap-1 mt-0.5">
                <Globe className="w-3 h-3 text-teal-400" />
                <span>Automatic 2-way real-time Indian language translation</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Bhashini Info Banner */}
        <div className="bg-teal-50 px-4 py-2 border-b border-teal-100 flex items-center justify-between text-[11px] text-teal-900">
          <span className="font-semibold flex items-center gap-1.5">
            🇮🇳 Digital India Bhashini Protocol
          </span>
          <span className="text-[10px] text-teal-700 bg-white px-2 py-0.5 rounded-md border border-teal-200 font-bold">
            {isWorker ? 'श्रमिक सहायक मोड (Worker Mode)' : 'Citizen Customer Mode'}
          </span>
        </div>

        {/* Message Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/70">
          {messages.map((msg) => {
            const isMe = msg.senderRole === myRole;
            const isAudioActive = isPlayingAudioId === msg.id;

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}
              >
                <span className="text-[10px] font-bold text-slate-400 px-1">
                  {msg.senderName} • {msg.time}
                </span>

                <div
                  className={`max-w-[85%] rounded-2xl p-3 shadow-sm space-y-1.5 ${
                    isMe
                      ? 'bg-teal-600 text-white rounded-tr-none'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                  }`}
                >
                  {/* Original Content */}
                  <p className="text-xs font-semibold leading-relaxed">
                    {msg.originalText}
                  </p>

                  {/* Bhashini Real-Time Translated Bubble */}
                  {msg.translatedText && msg.translatedText !== msg.originalText && (
                    <div
                      className={`text-[11px] p-2 rounded-xl border flex items-start gap-1.5 ${
                        isMe
                          ? 'bg-teal-700/60 border-teal-500/50 text-teal-100'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <Globe className="w-3 h-3 shrink-0 mt-0.5 text-teal-400" />
                      <div className="flex-1">
                        <span className="text-[9px] uppercase font-bold tracking-wider opacity-75 block">
                          Bhashini Translation:
                        </span>
                        <p className="font-medium">{msg.translatedText}</p>
                      </div>
                    </div>
                  )}

                  {/* Listen (TTS) button */}
                  <div className="flex items-center justify-between pt-1 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => handleSpeakMessage(msg)}
                      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg transition-colors ${
                        isMe
                          ? 'text-teal-200 hover:text-white bg-teal-700/50'
                          : 'text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 border border-teal-200'
                      }`}
                    >
                      <Volume2 className={`w-3 h-3 ${isAudioActive ? 'animate-bounce text-amber-300' : ''}`} />
                      <span>{isAudioActive ? 'Playing...' : '🔊 Listen (सुनें)'}</span>
                    </button>

                    <div className="flex items-center gap-1 text-[10px] opacity-75">
                      <CheckCheck className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {isTranslating && (
            <div className="flex items-center gap-2 text-xs font-bold text-teal-700 p-2 bg-teal-50 rounded-xl w-fit">
              <div className="w-3 h-3 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
              <span>Bhashini AI is translating into regional dialect...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Footer */}
        <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                isWorker
                  ? 'अपनी भाषा में लिखें (उदा. मैं 10 मिनट में आ रहा हूँ)...'
                  : 'Type in English or Hindi (e.g., Please bring spare valve)...'
              }
              className="flex-1 px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-inner"
            />

            <button
              type="submit"
              disabled={!inputText.trim() || isTranslating}
              className="p-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 px-1 font-medium">
            <span>Powered by Bhashini AI (GoI)</span>
            <span>Messages auto-translate between Worker & Customer</span>
          </div>
        </form>

      </div>
    </div>
  );
};
