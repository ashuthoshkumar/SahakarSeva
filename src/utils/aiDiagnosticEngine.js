// ─── Sahakar AI Sahayak: Intelligent Multilingual Diagnostic Engine ───
// Specialized for SIH26089 (Ministry of Cooperation / NCCT)
// Analyzes household/community problems in English, Hindi (Devanagari & Hinglish), Telugu, and regional languages,
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

const CATEGORY_DEFINITIONS = {
  carpenter: {
    category: 'carpenter',
    issueTitle: 'Precision Carpentry & Woodwork Fitting',
    defaultDuration: 60,
    requiredTools: ['Chisel Set', 'Precision Hand Plane', 'Electric Cordless Drill', 'Safety Goggles'],
    baseRate: 380,
    severity: 'Moderate',
    roleKeywords: [
      'carpenter', 'carpentor', 'carpentry', 'badhai', 'barhai', 'badhae', 'woodworker', 'woodcraft',
      'बढ़ई', 'कारपेंटर', 'काष्ठशिल्पी', 'కార్పెంటర్', 'सुतार', 'কাঠমিস্ত্রি'
    ],
    symptomKeywords: [
      'door', 'दरवाजा', 'दरवाज़ा', 'दरवाजे', 'darwaza', 'darwaja', 'lock', 'ताला', 'ताले', 'hinge', 'कब्जा', 'hinges',
      'furniture', 'फर्नीचर', 'wood', 'लकड़ी', 'lakdi', 'lakadi', 'cupboard', 'अलमारी', 'almirah', 'almari',
      'table', 'मेज', 'mej', 'chair', 'कुर्सी', 'kursi', 'bed', 'पलंग', 'palang', 'bedframe', 'sofa', 'सोफा',
      'drawer', 'दराज', 'latch', 'handle', 'हैंडल', 'plywood', 'प्लाईवुड', 'woodwork', 'जाम', 'jammed',
      'loose hinge', 'wood rot', 'broken leg'
    ]
  },
  plumber: {
    category: 'plumber',
    issueTitle: 'Concealed Plumbing & Hydrostatic Pressure Repair',
    defaultDuration: 50,
    requiredTools: ['Adjustable Pipe Wrench', 'PTFE Teflon Tape', 'Basin Spanner', 'Drain Auger'],
    baseRate: 320,
    severity: 'Moderate',
    roleKeywords: [
      'plumber', 'plumbing', 'plumb', 'नलसाज', 'नलकार', 'प्लम्बर', 'प्लंबर', 'ప్లంబర్', 'प्लंबरवाला', 'नलवाला',
      'nalwala', 'plumberwala'
    ],
    symptomKeywords: [
      'leak', 'leaking', 'leakage', 'रिसाव', 'टपक', 'tapak', 'pipe', 'पाइप', 'tap', 'नल', 'nal', 'water',
      'पानी', 'pani', 'paani', 'drain', 'drainage', 'नाली', 'nali', 'sewage', 'flush', 'सीपेज', 'seepage',
      'basin', 'बेसिन', 'toilet', 'टॉयलेट', 'sink', 'सिंक', 'tank', 'टंकी', 'tanki', 'motor', 'मोटर',
      'pipeline', 'गीजर', 'geyser', 'valve', 'वाल्व', 'shower', 'फव्वारा', 'faucet', 'commode', 'कमोड',
      'water tank', 'clogged drain', 'नाली जाम'
    ]
  },
  electrician: {
    category: 'electrician',
    issueTitle: 'Electrical Circuit & Switchgear Diagnosis',
    defaultDuration: 45,
    requiredTools: ['Digital Multi-Meter', 'Phase Tester (1000V)', 'Insulated Plier Kit', 'Wire Stripper'],
    baseRate: 350,
    severity: 'Moderate',
    roleKeywords: [
      'electrician', 'electrical', 'electric', 'electritian', 'bijliwala', 'बिजलीवाला', 'इलेक्ट्रीशियन',
      'इलेक्ट्रिशियन', 'विद्युत', 'बिजली मिस्त्री', 'ఎలక్ట్రీషియన్', 'इलेक्ट्रिक', 'electricwala'
    ],
    symptomKeywords: [
      'spark', 'sparking', 'चिंगारी', 'mcb', 'switch', 'स्विच', 'wire', 'wiring', 'तार', 'वायरिंग',
      'fuse', 'फ्यूज', 'शॉर्ट', 'short circuit', 'shock', 'current', 'करंट', 'light', 'लाइट', 'fan',
      'पंखा', 'pankha', 'inverter', 'इन्वर्टर', 'voltage', 'bulb', 'बल्ब', 'board', 'बोर्ड', 'meter',
      'मीटर', 'tripping', 'बिजली', 'bijli', 'power', 'socket', 'सॉकेट', 'phase', 'voltage drop', 'burning smell'
    ]
  },
  technician: {
    category: 'technician',
    issueTitle: 'HVAC Refrigerant & Motor Coil Diagnostic',
    defaultDuration: 75,
    requiredTools: ['Manifold Gauge', 'Capacitor Tester', 'Fin Comb', 'Vacuum Pump'],
    baseRate: 450,
    severity: 'Moderate',
    roleKeywords: [
      'technician', 'technisian', 'mechanic', 'मैकेनिक', 'टेक्नीशियन', 'ac repair', 'ac mechanic',
      'fridge mechanic', 'appliance mechanic', 'appliance repair', 'ac technician', 'ac wala', 'एसी वाला',
      'fridge repair', 'washing machine repair', 'ఏసీ మెకానిక్'
    ],
    symptomKeywords: [
      'ac', 'air conditioner', 'aircon', 'एसी', 'split ac', 'window ac', 'fridge', 'refrigerator',
      'फ्रीज', 'रेफ्रिजरेटर', 'cooler', 'कूलर', 'washing machine', 'वाशिंग मशीन', 'microwave',
      'माइक्रोवेव', 'appliance', 'कूलिंग', 'cooling', 'gas', 'गैस', 'compressor', 'कंप्रेसर',
      'refrigerant', 'cooling coil', 'filter', 'humming', 'not cooling', 'ठंडा नहीं कर रहा', 'thanda'
    ]
  },
  cleaner: {
    category: 'cleaner',
    issueTitle: 'Deep Cooperative Sanitation & Microfiber Scrub',
    defaultDuration: 90,
    requiredTools: ['Commercial Wet/Dry Vacuum', 'Eco-certified Detergent', 'Steam Sanitizer'],
    baseRate: 300,
    severity: 'Low',
    roleKeywords: [
      'cleaner', 'cleaning', 'safai', 'safaiwala', 'safaiwali', 'सफाईवाला', 'सफाईवाली', 'सफाई', 'sweeper',
      'housekeeper', 'cleanerwala', 'క్లీనింగ్'
    ],
    symptomKeywords: [
      'clean', 'deep clean', 'floor scrub', 'dust', 'धूल', 'dhul', 'wash', 'धुलाई', 'dhulai', 'sanitize',
      'sanitization', 'सैनिटाइज', 'bathroom clean', 'sofa cleaning', 'carpet', 'balcony', 'पोछा', 'pocha',
      'mop', 'scrub', 'kitchen clean', 'घर की सफाई', 'tile cleaning'
    ]
  },
  painter: {
    category: 'painter',
    issueTitle: 'Surface Waterproofing & Texture Prep',
    defaultDuration: 120,
    requiredTools: ['Moisture Meter', 'Sandpaper Block', 'Roller Kit', 'Drop Cloth'],
    baseRate: 350,
    severity: 'Low',
    roleKeywords: [
      'painter', 'painting', 'रंगसाज', 'पेंटर', 'रंगाई', 'रंगवाला', 'paintwala', 'rangwala', 'పెయింటర్', 'पेंटवाला'
    ],
    symptomKeywords: [
      'paint', 'पेंट', 'wall', 'दीवार', 'दीवारें', 'deewar', 'putty', 'पुट्टी', 'whitewash', 'सफेदी',
      'waterproofing', 'वाटरप्रूफिंग', 'distemper', 'color', 'रंग', 'rang', 'damp', 'सीलन', 'seelan',
      'seepage wall', 'primer', 'प्राइमर', 'texture', 'roller', 'peeling paint', 'पेंट छूट रहा'
    ]
  },
  domestic_helper: {
    category: 'domestic_helper',
    issueTitle: 'Certified Cooperative Home Assistance & Culinary Support',
    defaultDuration: 120,
    requiredTools: ['Hygiene Apron', 'Sanitized Gloves', 'Kitchen Prep Kit'],
    baseRate: 320,
    severity: 'Low',
    roleKeywords: [
      'helper', 'maid', 'cook', 'cooker', 'bai', 'kamwali', 'कामवाली', 'बाई', 'रसोइया', 'खानसामा',
      'domestic helper', 'home assistant', 'rasoiya', 'khansama'
    ],
    symptomKeywords: [
      'cooking', 'खाना', 'cook', 'khana', 'rasoi', 'रसोई', 'dishwashing', 'बर्तन', 'bartan',
      'housekeeping', 'household chores', 'झाड़ू पोछा खाना', 'chulha', 'meal prep'
    ]
  }
};

export const diagnoseProblem = (rawInput = '') => {
  const query = rawInput.toLowerCase().trim();

  let bestCategory = null;
  let highestScore = 0;

  // Score each category using intelligent NLP token match
  for (const [key, def] of Object.entries(CATEGORY_DEFINITIONS)) {
    let score = 0;

    // Direct role keyword match carries highest weight (10 pts)
    for (const rk of def.roleKeywords) {
      if (query.includes(rk.toLowerCase())) {
        score += 10;
        break; // Count once per category
      }
    }

    // Symptom keyword match carries supporting weight (3 pts each)
    for (const sk of def.symptomKeywords) {
      if (query.includes(sk.toLowerCase())) {
        score += 3;
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestCategory = def;
    }
  }

  // Fallback if no keywords matched
  if (!bestCategory || highestScore === 0) {
    if (query.includes('elect') || query.includes('bijli') || query.includes('wire') || query.includes('light') || query.includes('fan') || query.includes('current')) {
      bestCategory = CATEGORY_DEFINITIONS.electrician;
    } else if (query.includes('plumb') || query.includes('pipe') || query.includes('water') || query.includes('leak') || query.includes('pani') || query.includes('tap') || query.includes('nal')) {
      bestCategory = CATEGORY_DEFINITIONS.plumber;
    } else if (query.includes('carpent') || query.includes('wood') || query.includes('door') || query.includes('lock') || query.includes('furniture') || query.includes('darwaza')) {
      bestCategory = CATEGORY_DEFINITIONS.carpenter;
    } else if (query.includes('clean') || query.includes('safai') || query.includes('wash') || query.includes('dust')) {
      bestCategory = CATEGORY_DEFINITIONS.cleaner;
    } else if (query.includes('paint') || query.includes('rang') || query.includes('wall') || query.includes('putty')) {
      bestCategory = CATEGORY_DEFINITIONS.painter;
    } else if (query.includes('ac') || query.includes('cool') || query.includes('fridge') || query.includes('appliance')) {
      bestCategory = CATEGORY_DEFINITIONS.technician;
    } else {
      bestCategory = CATEGORY_DEFINITIONS.carpenter;
    }
  }

  const category = bestCategory.category;
  const issueTitle = bestCategory.issueTitle;
  const estimatedDurationMins = bestCategory.defaultDuration;
  const requiredTools = bestCategory.requiredTools;
  const baseCoopRate = bestCategory.baseRate;
  let severity = bestCategory.severity;
  let hazardWarning = null;

  // Hazard Analysis
  if (category === 'electrician' && (query.includes('spark') || query.includes('burning') || query.includes('smoke') || query.includes('जलने') || query.includes('चिंगारी') || query.includes('shock') || query.includes('आग'))) {
    severity = 'Critical';
    hazardWarning = '⚠️ CRITICAL ELECTRICAL HAZARD: High risk of electrical fire or shock. Switch off your main distribution board (MCB) immediately before touching any fixtures.';
  } else if (category === 'plumber' && (query.includes('burst') || query.includes('flooding') || query.includes('heavy') || query.includes('टूट') || query.includes('बाढ़'))) {
    severity = 'High';
    hazardWarning = '⚠️ WATER INUNDATION RISK: Locate and close your home’s overhead tank control valve to prevent flooring water damage.';
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
