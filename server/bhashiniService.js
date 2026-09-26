// ===================================================================
// SahakarSeva - Bhashini AI Services (MeitY / Digital India)
// Official National Language Translation Mission Integration
// ===================================================================

import fs from 'fs';
import path from 'path';

// Attempt to load .env if process.loadEnvFile is available
try {
  if (typeof process.loadEnvFile === 'function') {
    process.loadEnvFile();
  } else {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      content.split('\n').forEach(line => {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (match && !match[1].startsWith('#')) {
          const key = match[1].trim();
          let value = (match[2] || '').trim();
          if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
          if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
          if (!process.env[key]) process.env[key] = value;
        }
      });
    }
  }
} catch (e) {
  console.warn('[Bhashini] Notice: .env file loading skipped:', e.message);
}

const BHASHINI_PIPELINE_URL = 'https://meity-auth.ulcacontrib.org/ulca/apis/v0/model/getModelsPipeline';
const DEFAULT_PIPELINE_ID = process.env.BHASHINI_PIPELINE_ID || '64392f96daac500b55c543d7';

// In-memory cache for pipeline compute configs
const pipelineCache = new Map();

/**
 * Check if active Bhashini credentials exist
 */
export function getBhashiniCredentials() {
  const rawApiKey = process.env.BHASHINI_API_KEY || process.env.VITE_BHASHINI_API_KEY || '';
  const rawUserId = process.env.BHASHINI_USER_ID || process.env.VITE_BHASHINI_USER_ID || '';
  const rawPipelineId = process.env.BHASHINI_PIPELINE_ID || process.env.VITE_BHASHINI_PIPELINE_ID || DEFAULT_PIPELINE_ID;

  // Clean any accidental whitespace from copy-pasting
  const apiKey = rawApiKey.replace(/\s+/g, '').trim();
  const userId = rawUserId.replace(/\s+/g, '').trim();
  const pipelineId = rawPipelineId.replace(/\s+/g, '').trim() || DEFAULT_PIPELINE_ID;

  const isConfigured = Boolean(
    apiKey &&
    apiKey !== 'YOUR_BHASHINI_API_KEY_HERE' &&
    userId &&
    userId !== 'YOUR_BHASHINI_USER_ID_HERE'
  );

  return { apiKey, userId, pipelineId, isConfigured };
}

/**
 * Fetch and cache the pipeline configuration for requested tasks and languages
 */
async function getPipelineConfig({ tasks, sourceLang, targetLang }) {
  const { apiKey, userId, pipelineId, isConfigured } = getBhashiniCredentials();
  if (!isConfigured) {
    throw new Error('Bhashini API Key and User ID are not configured in .env');
  }

  const cacheKey = `${tasks.join('_')}_${sourceLang || ''}_${targetLang || ''}`;
  if (pipelineCache.has(cacheKey)) {
    return pipelineCache.get(cacheKey);
  }

  const pipelineTasks = [];
  if (tasks.includes('asr')) {
    pipelineTasks.push({
      taskType: 'asr',
      config: {
        language: { sourceLanguage: sourceLang || 'hi' }
      }
    });
  }
  if (tasks.includes('translation')) {
    pipelineTasks.push({
      taskType: 'translation',
      config: {
        language: {
          sourceLanguage: sourceLang || 'hi',
          targetLanguage: targetLang || 'en'
        }
      }
    });
  }
  if (tasks.includes('tts')) {
    pipelineTasks.push({
      taskType: 'tts',
      config: {
        language: { sourceLanguage: sourceLang || 'hi' }
      }
    });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 2500);

  try {
    const res = await fetch(BHASHINI_PIPELINE_URL, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'ulcaApiKey': apiKey,
        'userID': userId
      },
      body: JSON.stringify({
        pipelineTasks,
        pipelineRequestConfig: { pipelineId }
      })
    });
    clearTimeout(timer);

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Bhashini Pipeline Discovery Error (${res.status}): ${errText}`);
    }

    const data = await res.json();
    pipelineCache.set(cacheKey, data);
    return data;
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

/**
 * 1. NMT: Translate text between Indian languages and English
 */
export async function translateText({ text, sourceLang = 'en', targetLang = 'hi' }) {
  if (!text || text.trim() === '') {
    return { translatedText: '', sourceLang, targetLang };
  }

  if (sourceLang === targetLang) {
    return { translatedText: text, sourceLang, targetLang };
  }

  const { apiKey, isConfigured } = getBhashiniCredentials();

  // If not configured, provide clean fallback
  if (!isConfigured) {
    return {
      translatedText: text,
      sourceLang,
      targetLang,
      isFallback: true,
      message: 'Bhashini API Key not set in .env. Returned original text.'
    };
  }

  try {
    const pipelineData = await getPipelineConfig({
      tasks: ['translation'],
      sourceLang,
      targetLang
    });

    const callbackUrl = pipelineData.pipelineInferenceAPIEndPoint?.callbackUrl || 'https://dhruva-api.bhashini.gov.in/services/inference/pipeline';
    const inferenceApiKey = pipelineData.pipelineInferenceAPIEndPoint?.inferenceApiKey?.value || apiKey;
    const inferenceHeaderName = pipelineData.pipelineInferenceAPIEndPoint?.inferenceApiKey?.name || 'Authorization';
    const translationServiceId = pipelineData.pipelineResponseConfig?.find(c => c.taskType === 'translation')?.config?.[0]?.serviceId;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const computeRes = await fetch(callbackUrl, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        [inferenceHeaderName]: inferenceApiKey
      },
      body: JSON.stringify({
        pipelineTasks: [
          {
            taskType: 'translation',
            config: {
              language: { sourceLanguage: sourceLang, targetLanguage: targetLang },
              serviceId: translationServiceId
            }
          }
        ],
        inputData: {
          input: [{ source: text }]
        }
      })
    });
    clearTimeout(timeoutId);

    if (!computeRes.ok) {
      const err = await computeRes.text();
      throw new Error(`Bhashini Compute Failed (${computeRes.status}): ${err}`);
    }

    const computeData = await computeRes.json();
    const translatedText = computeData.pipelineResponse?.[0]?.output?.[0]?.target || text;

    return {
      translatedText,
      sourceLang,
      targetLang,
      isFallback: false
    };
  } catch (err) {
    // Smart cooperative domain translation fallback for network timeouts
    const smartFallback = getSmartCooperativeFallback(text, sourceLang, targetLang);
    return {
      translatedText: smartFallback || text,
      sourceLang,
      targetLang,
      isFallback: true,
      note: 'Auto-fallback active',
      error: err.message
    };
  }
}

// Cooperative domain dictionary for instant offline / timeout support
function getSmartCooperativeFallback(text, sourceLang, targetLang) {
  if (!text) return text;
  const lower = text.toLowerCase().trim();

  const dictEnHi = {
    'hello': 'नमस्ते',
    'hello, please bring an extra tester and 16a switch.': 'नमस्ते, कृपया एक अतिरिक्त टेस्टर और 16A स्विच साथ लाएं।',
    'please bring an extra tester and 16a switch': 'कृपया अतिरिक्त टेस्टर और 16A स्विच साथ लाएं',
    'where are you?': 'आप कहां पहुंचे हैं?',
    'i am arriving in 10 minutes': 'मैं 10 मिनट में पहुंच रहा हूँ',
    'i have reached the location': 'मैं आपके दिए पते पर पहुंच गया हूँ',
    'work is completed': 'काम पूरा हो चुका है',
    'please approve the work': 'कृपया काम की जांच कर अनुमोदन दें',
    'please bring spare switch': 'कृपया अतिरिक्त स्विच साथ लाएं',
    'need electrician immediately': 'तत्काल इलेक्ट्रीशियन की आवश्यकता है',
    'need plumber': 'प्लंबर की आवश्यकता है',
    'pipe is leaking': 'पाइप से पानी टपक रहा है'
  };

  const dictHiEn = {
    'नमस्ते': 'Hello',
    'मैं 10 मिनट में पहुंच रहा हूँ': 'I am arriving in 10 minutes',
    'मैं 10 मिनट में आ रहा हूँ': 'I am arriving in 10 minutes',
    'मैं पहुंच गया हूँ': 'I have reached the location',
    'काम पूरा हो गया': 'Work has been completed',
    'काम पूरा हो चुका है': 'Work is completed',
    'कृपया भुगतान करें': 'Please proceed with payment'
  };

  if (sourceLang === 'en' && targetLang === 'hi') {
    for (const [key, val] of Object.entries(dictEnHi)) {
      if (lower.includes(key)) return val;
    }
  }

  if (sourceLang === 'hi' && targetLang === 'en') {
    for (const [key, val] of Object.entries(dictHiEn)) {
      if (lower.includes(key)) return val;
    }
  }

  return null;
}

/**
 * 2. ASR: Convert voice speech to text
 */
export async function speechToText({ audioContent, sourceLang = 'hi', audioFormat = 'wav' }) {
  if (!audioContent) {
    throw new Error('audioContent (base64) is required for speechToText');
  }

  const { apiKey, isConfigured } = getBhashiniCredentials();
  if (!isConfigured) {
    throw new Error('Bhashini credentials not configured in .env');
  }

  const pipelineData = await getPipelineConfig({
    tasks: ['asr'],
    sourceLang
  });

  const callbackUrl = pipelineData.pipelineInferenceAPIEndPoint?.callbackUrl || 'https://dhruva-api.bhashini.gov.in/services/inference/pipeline';
  const inferenceApiKey = pipelineData.pipelineInferenceAPIEndPoint?.inferenceApiKey?.value || apiKey;
  const inferenceHeaderName = pipelineData.pipelineInferenceAPIEndPoint?.inferenceApiKey?.name || 'Authorization';
  const asrServiceId = pipelineData.pipelineResponseConfig?.find(c => c.taskType === 'asr')?.config?.[0]?.serviceId;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 3000);

  let computeRes;
  try {
    computeRes = await fetch(callbackUrl, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        [inferenceHeaderName]: inferenceApiKey
      },
      body: JSON.stringify({
        pipelineTasks: [
          {
            taskType: 'asr',
            config: {
              language: { sourceLanguage: sourceLang },
              serviceId: asrServiceId,
              audioFormat: audioFormat,
              samplingRate: 16000
            }
          }
        ],
        inputData: {
          audio: [{ audioContent }]
        }
      })
    });
  } finally {
    clearTimeout(timer);
  }

  if (!computeRes.ok) {
    const err = await computeRes.text();
    throw new Error(`Bhashini ASR Failed (${computeRes.status}): ${err}`);
  }

  const computeData = await computeRes.json();
  const transcript = computeData.pipelineResponse?.[0]?.output?.[0]?.source || '';

  return {
    transcript,
    sourceLang
  };
}

/**
 * 3. TTS: Convert text to speech audio
 */
export async function textToSpeech({ text, sourceLang = 'hi', gender = 'female' }) {
  if (!text) {
    throw new Error('text is required for textToSpeech');
  }

  const { apiKey, isConfigured } = getBhashiniCredentials();
  if (!isConfigured) {
    throw new Error('Bhashini credentials not configured in .env');
  }

  const pipelineData = await getPipelineConfig({
    tasks: ['tts'],
    sourceLang
  });

  const callbackUrl = pipelineData.pipelineInferenceAPIEndPoint?.callbackUrl || 'https://dhruva-api.bhashini.gov.in/services/inference/pipeline';
  const inferenceApiKey = pipelineData.pipelineInferenceAPIEndPoint?.inferenceApiKey?.value || apiKey;
  const inferenceHeaderName = pipelineData.pipelineInferenceAPIEndPoint?.inferenceApiKey?.name || 'Authorization';
  const ttsServiceId = pipelineData.pipelineResponseConfig?.find(c => c.taskType === 'tts')?.config?.[0]?.serviceId;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 3000);

  let computeRes;
  try {
    computeRes = await fetch(callbackUrl, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        [inferenceHeaderName]: inferenceApiKey
      },
      body: JSON.stringify({
        pipelineTasks: [
          {
            taskType: 'tts',
            config: {
              language: { sourceLanguage: sourceLang },
              serviceId: ttsServiceId,
              gender: gender
            }
          }
        ],
        inputData: {
          input: [{ source: text }]
        }
      })
    });
  } finally {
    clearTimeout(timer);
  }

  if (!computeRes.ok) {
    const err = await computeRes.text();
    throw new Error(`Bhashini TTS Failed (${computeRes.status}): ${err}`);
  }

  const computeData = await computeRes.json();
  const audioContent = computeData.pipelineResponse?.[0]?.audio?.[0]?.audioContent || '';

  return {
    audioContent,
    audioUri: audioContent ? `data:audio/wav;base64,${audioContent}` : null,
    sourceLang
  };
}
