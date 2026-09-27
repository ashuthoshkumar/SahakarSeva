// ===================================================================
// SahakarSeva - Bhashini Frontend Service
// Connects to Bhashini API via backend proxy with browser speech fallback
// ===================================================================

import { getSavedBackendUrl } from '../utils/cloudSync';

const getApiBase = () => {
  return getSavedBackendUrl();
};

const fetchWithTimeout = (url, options = {}, timeoutMs = 2500) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { ...options, signal: controller.signal })
    .finally(() => clearTimeout(timer));
};

/**
 * 1. Translate text between Indian languages and English
 */
export async function bhashiniTranslate(text, sourceLang = 'en', targetLang = 'hi') {
  if (!text || !text.trim() || sourceLang === targetLang) {
    return text;
  }

  try {
    const apiBase = getApiBase();
    const res = await fetchWithTimeout(`${apiBase}/bhashini/translate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, sourceLang, targetLang })
    }, 2500);

    if (res.ok) {
      const data = await res.json();
      if (data.translatedText) {
        return data.translatedText;
      }
    }
  } catch (err) {
    console.warn('[Bhashini Frontend] Translation fallback:', err.message);
  }

  return text;
}

/**
 * 2. Speech-to-Text (ASR) via Bhashini
 */
export async function bhashiniSpeechToText(audioBlob, sourceLang = 'hi') {
  try {
    const reader = new FileReader();
    const base64Audio = await new Promise((resolve, reject) => {
      reader.onloadend = () => {
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(audioBlob);
    });

    const apiBase = getApiBase();
    const res = await fetchWithTimeout(`${apiBase}/bhashini/asr`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        audioContent: base64Audio,
        sourceLang,
        audioFormat: 'wav'
      })
    }, 3000);

    if (res.ok) {
      const data = await res.json();
      return data.transcript || '';
    }
  } catch (err) {
    console.warn('[Bhashini Frontend] ASR fallback:', err.message);
  }
  return '';
}

/**
 * 3. Text-to-Speech (TTS) via Bhashini
 */
export async function bhashiniTextToSpeech(text, sourceLang = 'hi', gender = 'female') {
  try {
    const apiBase = getApiBase();
    const res = await fetchWithTimeout(`${apiBase}/bhashini/tts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, sourceLang, gender })
    }, 3000);

    if (res.ok) {
      const data = await res.json();
      if (data.audioUri) {
        return data.audioUri;
      }
    }
  } catch (err) {
    console.warn('[Bhashini Frontend] TTS error:', err.message);
  }
  return null;
}

/**
 * Helper to clean and format text for natural, conversational speech readout
 */
function cleanSpeechText(rawText, lang) {
  if (!rawText) return '';
  let clean = rawText
    .replace(/[#*_`~[\]()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  if (lang === 'hi') {
    clean = clean.replace(/₹\s*(\d+)/g, '$1 रुपये');
  } else {
    clean = clean.replace(/₹\s*(\d+)/g, '$1 rupees');
  }
  return clean;
}

/**
 * 4. Ultra-fast, low-latency Speech Output (Instant Browser Speech + High-fidelity fallback)
 */
let currentAudio = null;

export async function bhashiniSpeakText(text, lang = 'hi', onEndCallback) {
  if (!text) return;

  // Immediate cancellation of any ongoing speech
  bhashiniStopSpeaking();

  const formattedText = cleanSpeechText(text, lang);

  // 1. Instant Zero-Latency Browser SpeechSynthesis (starts in <10ms)
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      const utterance = new SpeechSynthesisUtterance(formattedText);
      const targetCode = lang === 'hi' ? 'hi-IN' : (lang === 'kn' ? 'kn-IN' : (lang === 'te' ? 'te-IN' : (lang === 'ta' ? 'ta-IN' : (lang === 'mr' ? 'mr-IN' : 'en-IN'))));
      utterance.lang = targetCode;
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      // Select best regional or Indian voice if loaded in browser
      const voices = window.speechSynthesis.getVoices?.() || [];
      if (voices.length > 0) {
        const langPrefix = targetCode.slice(0, 2).toLowerCase();
        const preferred = voices.find(v => v.lang && v.lang.toLowerCase().replace('_', '-').startsWith(targetCode.toLowerCase()))
          || voices.find(v => v.lang && v.lang.toLowerCase().startsWith(langPrefix))
          || voices.find(v => v.lang && v.lang.toLowerCase().includes('in'));
        if (preferred) {
          utterance.voice = preferred;
        }
      }

      let ended = false;
      const finish = () => {
        if (!ended) {
          ended = true;
          if (onEndCallback) onEndCallback();
        }
      };

      utterance.onend = finish;
      utterance.onerror = finish;

      window.speechSynthesis.speak(utterance);
      return;
    } catch (err) {
      console.warn('[Speech] Direct utterance fallback:', err);
    }
  }

  // 2. High-fidelity Server Audio Fallback (if browser speech is unavailable)
  try {
    const audioUri = await bhashiniTextToSpeech(formattedText, lang);
    if (audioUri) {
      const audio = new Audio(audioUri);
      currentAudio = audio;
      if (onEndCallback) {
        audio.onended = () => {
          currentAudio = null;
          onEndCallback();
        };
        audio.onerror = () => {
          currentAudio = null;
          onEndCallback();
        };
      }
      await audio.play();
      return;
    }
  } catch (e) {
    console.warn('[Speech] Server audio fallback notice:', e.message);
  }

  if (onEndCallback) onEndCallback();
}

/**
 * Stop active speech playback
 */
export function bhashiniStopSpeaking() {
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } catch (e) {}
    currentAudio = null;
  }
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}
