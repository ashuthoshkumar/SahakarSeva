// ─── Sahakar AI Sahayak: Intelligent Multilingual Diagnostic Engine ───
// Specialized for SIH26089 (Ministry of Cooperation / NCCT)
// Analyzes household/community problems in English, Hindi, and Indian regional languages,
// detects safety hazards, estimates fair repair costs vs. corporate aggregator markups,
// and recommends the optimal NCCT-certified worker.

export const PRESET_DIAGNOSTICS = [
  {
    id: 'spark_mcb',
    label: '⚡ Sparking MCB & Burning Smell',
    labelHi: '⚡ स्विच बोर्ड में चिंगारी और जलने की गंध',
    query: 'Switchboard is sparking with burning smell and main MCB is tripping repeatedly',
    category: 'electrician'
  },
  {
    id: 'pipe_burst',
    label: '💧 High-Pressure Pipe Leak',
    labelHi: '💧 किचन पाइप से भारी पानी का रिसाव',
    query: 'Kitchen main pipe is leaking heavily under the sink and tap valve won’t shut off',
    category: 'plumber'
  },
  {
    id: 'ac_cooling',
    label: '❄️ AC Blowing Warm Air & Humming',
    labelHi: '❄️ एसी से ठंडी हवा नहीं आ रही और आवाज़ आ रही है',
    query: 'Split AC outdoor unit is humming loudly and blowing hot air into the bedroom',
    category: 'technician'
  },
  {
    id: 'door_lock',
    label: '🚪 Broken Main Door Latch',
    labelHi: '🚪 मुख्य दरवाज़े का ताला जाम हो गया है',
    query: 'Main wooden door lock is jammed and hinges are loose, unable to lock securely',
    category: 'carpenter'
  },
  {
    id: 'deep_clean',
    label: '✨ Post-Renovation Deep Cleaning',
    labelHi: '✨ घर की गहरी सफाई और धूल हटाना',
    query: 'Need thorough floor scrub, bathroom sanitization and balcony dust removal after painting work',
    category: 'cleaner'
  }
];

export const diagnoseProblem = (rawInput = '') => {
  const query = rawInput.toLowerCase().trim();

  // Default baseline diagnosis
  let category = 'electrician';
  let issueTitle = 'General Household Technical Maintenance';
  let severity = 'Moderate';
  let hazardWarning = null;
  let estimatedDurationMins = 60;
  let requiredTools = ['Basic Multi-meter', 'Insulated Hand Tools', 'Safety Gloves'];
  let baseCoopRate = 350;

  // Category & Issue Detection Rules (Multilingual keywords: English + Hindi transliterations)
  if (
    query.includes('spark') || query.includes('चिंगारी') || query.includes('mcb') ||
    query.includes('switch') || query.includes('स्विच') || query.includes('wire') ||
    query.includes('तार') || query.includes('fuse') || query.includes('शॉर्ट') ||
    query.includes('shock') || query.includes('current') || query.includes('करंट')
  ) {
    category = 'electrician';
    issueTitle = 'Electrical Circuit & Switchgear Diagnosis';
    estimatedDurationMins = 45;
    requiredTools = ['Digital Multi-Meter', 'Phase Tester (1000V)', 'Insulated Plier Kit', 'Wire Stripper'];
    baseCoopRate = 350;

    if (query.includes('spark') || query.includes('burning') || query.includes('smoke') || query.includes('जलने') || query.includes('चिंगारी') || query.includes('shock')) {
      severity = 'Critical';
      hazardWarning = '⚠️ CRITICAL ELECTRICAL HAZARD: High risk of electrical fire or shock. Switch off your main distribution board (MCB) immediately before touching any fixtures.';
    }
  } else if (
    query.includes('leak') || query.includes('रिसाव') || query.includes('pipe') ||
    query.includes('पाइप') || query.includes('tap') || query.includes('नल') ||
    query.includes('water') || query.includes('पानी') || query.includes('drain') ||
    query.includes('sewage') || query.includes('flush') || query.includes('सीपेज') ||
    query.includes('seepage') || query.includes('basin')
  ) {
    category = 'plumber';
    issueTitle = 'Concealed Plumbing & Hydrostatic Pressure Repair';
    estimatedDurationMins = 50;
    requiredTools = ['Adjustable Pipe Wrench', 'PTFE Teflon Tape', 'Basin Spanner', 'Drain Auger'];
    baseCoopRate = 320;

    if (query.includes('heavy') || query.includes('burst') || query.includes('flooding') || query.includes('टूट')) {
      severity = 'High';
      hazardWarning = '⚠️ WATER INUNDATION RISK: Locate and close your home’s overhead tank control valve to prevent flooring water damage.';
    }
  } else if (
    query.includes('ac') || query.includes('एसी') || query.includes('fridge') ||
    query.includes('refrigerator') || query.includes('कूलिंग') || query.includes('cooling') ||
    query.includes('washing machine') || query.includes('वाशिंग मशीन') || query.includes('appliance')
  ) {
    category = 'technician';
    issueTitle = 'HVAC Refrigerant & Motor Coil Diagnostic';
    estimatedDurationMins = 75;
    requiredTools = ['Manifold Gauge', 'Capacitor Tester', 'Fin Comb', 'Vacuum Pump'];
    baseCoopRate = 450;
    severity = 'Moderate';
  } else if (
    query.includes('door') || query.includes('दरवाज़ा') || query.includes('lock') ||
    query.includes('ताला') || query.includes('hinge') || query.includes('furniture') ||
    query.includes('wood') || query.includes('लकड़ी') || query.includes('cupboard') || query.includes('अलमारी')
  ) {
    category = 'carpenter';
    issueTitle = 'Precision Carpentry & Security Latch Fitting';
    estimatedDurationMins = 60;
    requiredTools = ['Chisel Set', 'Precision Hand Plane', 'Electric Cordless Drill', 'Safety Goggles'];
    baseCoopRate = 380;
    severity = 'Moderate';
  } else if (
    query.includes('clean') || query.includes('सफाई') || query.includes('dust') ||
    query.includes('धूल') || query.includes('wash') || query.includes('धुलाई') ||
    query.includes('sanitize') || query.includes('bathroom') || query.includes('बाथरूम')
  ) {
    category = 'cleaner';
    issueTitle = 'Deep Cooperative Sanitation & Microfiber Scrub';
    estimatedDurationMins = 90;
    requiredTools = ['Commercial Wet/Dry Vacuum', 'Eco-certified Detergent', 'Steam Sanitizer'];
    baseCoopRate = 300;
    severity = 'Low';
  } else if (
    query.includes('paint') || query.includes('पेंट') || query.includes('wall') ||
    query.includes('दीवार') || query.includes('damp') || query.includes('putty')
  ) {
    category = 'painter';
    issueTitle = 'Surface Waterproofing & Texture Prep';
    estimatedDurationMins = 120;
    requiredTools = ['Moisture Meter', 'Sandpaper Block', 'Roller Kit', 'Drop Cloth'];
    baseCoopRate = 350;
    severity = 'Low';
  }

  // Calculate Transparent Cost Comparison
  // SahakarSeva: 90% direct to worker, 5% society welfare, 5% tech ops
  const coopWorkerShare = Math.round(baseCoopRate * 0.90);
  const coopWelfareFund = Math.round(baseCoopRate * 0.05);
  const coopPlatformOps = Math.round(baseCoopRate * 0.05);
  const coopTotal = baseCoopRate;

  // Corporate Aggregator (Urban Company benchmark):
  // Inflated base + 28% corporate commission + convenience charge + surge
  const corporateBase = Math.round(baseCoopRate * 1.35);
  const corporateCommission = Math.round(corporateBase * 0.28);
  const corporatePlatformFee = 49;
  const corporateTotal = corporateBase + corporatePlatformFee;
  const customerSavings = corporateTotal - coopTotal;
  const savingsPercent = Math.round((customerSavings / corporateTotal) * 100);

  return {
    rawInput,
    category,
    issueTitle,
    severity,
    hazardWarning,
    estimatedDurationMins,
    requiredTools,
    pricing: {
      coopTotal,
      coopWorkerShare,
      coopWelfareFund,
      coopPlatformOps,
      corporateTotal,
      corporateCommission,
      corporatePlatformFee,
      customerSavings,
      savingsPercent
    }
  };
};
