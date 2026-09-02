// Centralized Multilingual Translation Helpers for SahakarSeva

export const translateNcctLevel = (levelStr, lang) => {
  if (!levelStr) return '';
  if (lang === 'en') return levelStr;

  const dict = {
    hi: {
      'Level 3 Master Craftsman': 'लेवल 3 मास्टर क्राफ्ट्समैन',
      'Level 2 Certified Nursing Assistant': 'लेवल 2 प्रमाणित नर्सिंग सहायक',
      'Level 2 Hydro Technician': 'लेवल 2 हाइड्रो तकनीशियन',
      'Level 3 Wood Craftsman': 'लेवल 3 वुड क्राफ्ट्समैन',
      'Level 2 Certified Craftsman': 'लेवल 2 प्रमाणित शिल्पकार',
      'Level 2 Sanitation Specialist': 'लेवल 2 स्वच्छता विशेषज्ञ',
      'Level 2 HVAC & Electronics': 'लेवल 2 एचवीएसी व इलेक्ट्रॉनिक्स',
      'Level 2 Certified Technician': 'लेवल 2 प्रमाणित तकनीशियन',
      'Level 3 Master Craftsman (NCCT Certified)': 'लेवल 3 मास्टर क्राफ्ट्समैन (NCCT प्रमाणित)',
      'Level 2 Certified Craftsman (NCCT Certified)': 'लेवल 2 प्रमाणित शिल्पकार (NCCT प्रमाणित)',
      'Master Craftsman': 'मास्टर क्राफ्ट्समैन',
      'Certified Craftsman': 'प्रमाणित शिल्पकार',
      'Pending Certification': 'प्रमाणन लंबित'
    },
    mr: {
      'Level 3 Master Craftsman': 'लेव्हल ३ मास्टर क्राफ्ट्समन',
      'Level 2 Certified Nursing Assistant': 'लेव्हल २ प्रमाणित परिचारिका',
      'Level 2 Hydro Technician': 'लेव्हल २ हायड्रो तंत्रज्ञ',
      'Level 3 Wood Craftsman': 'लेव्हल ३ सुतारकाम तज्ञ',
      'Level 2 Certified Craftsman': 'लेव्हल २ प्रमाणित कारागीर',
      'Level 2 Sanitation Specialist': 'लेव्हल २ स्वच्छता तज्ञ',
      'Level 2 HVAC & Electronics': 'लेव्हल २ एचव्हीएसी व इलेक्ट्रॉनिक्स',
      'Level 2 Certified Technician': 'लेव्हल २ प्रमाणित तंत्रज्ञ'
    },
    ta: {
      'Level 3 Master Craftsman': 'நிலை 3 மாஸ்டர் கைவினைஞர்',
      'Level 2 Certified Nursing Assistant': 'நிலை 2 சான்றளிக்கப்பட்ட செவிலியர்',
      'Level 2 Hydro Technician': 'நிலை 2 ஹைட்ரோ தொழில்நுட்ப வல்லுநர்',
      'Level 3 Wood Craftsman': 'நிலை 3 மர வேலைப்பாட்டாளர்',
      'Level 2 Certified Craftsman': 'நிலை 2 சான்றளிக்கப்பட்ட கைவினைஞர்'
    },
    te: {
      'Level 3 Master Craftsman': 'లెవెల్ 3 మాస్టర్ క్రాఫ్ట్స్‌మెన్',
      'Level 2 Certified Nursing Assistant': 'లెవెల్ 2 సర్టిఫైడ్ నర్సింగ్ అసిస్టెంట్',
      'Level 2 Hydro Technician': 'లెవెల్ 2 హైడ్రో టెక్నీషియన్',
      'Level 3 Wood Craftsman': 'లెవెల్ 3 వుడ్ క్రాఫ్ట్స్‌మెన్',
      'Level 2 Certified Craftsman': 'లెవెల్ 2 సర్టిఫైడ్ క్రాఫ్ట్స్‌మెన్'
    },
    kn: {
      'Level 3 Master Craftsman': 'ಲೆವೆಲ್ 3 ಮಾಸ್ಟರ್ ಕ್ರಾಫ್ಟ್ಸ್ ಮ್ಯಾನ್',
      'Level 2 Certified Nursing Assistant': 'ಲೆವೆಲ್ 2 ಪ್ರಮಾಣೀಕೃತ ಶುಶ್ರೂಷಕ',
      'Level 2 Hydro Technician': 'ಲೆವೆಲ್ 2 ಹೈಡ್ರೋ ತಂತ್ರಜ್ಞ',
      'Level 3 Wood Craftsman': 'ಲೆವೆಲ್ 3 ಮರದ ಕೆಲಸಗಾರ',
      'Level 2 Certified Craftsman': 'ಲೆವೆಲ್ 2 ಪ್ರಮಾಣೀಕೃತ ಕುಶಲಕರ್ಮಿ'
    },
    gu: {
      'Level 3 Master Craftsman': 'લેવલ 3 માસ્ટર ક્રાફ્ટસમેન',
      'Level 2 Certified Nursing Assistant': 'લેવલ 2 પ્રમાણિત નર્સિંગ આસિસ્ટન્ટ',
      'Level 2 Hydro Technician': 'લેવલ 2 હાઇડ્રો ટેકનિશિયન',
      'Level 3 Wood Craftsman': 'લેવલ 3 વુડ ક્રાફ્ટસમેન',
      'Level 2 Certified Craftsman': 'લેવલ 2 પ્રમાણિત કારીગર'
    },
    bn: {
      'Level 3 Master Craftsman': 'লেভেল ৩ মাস্টার ক্রাফটসম্যান',
      'Level 2 Certified Nursing Assistant': 'লেভেল ২ সার্টিফাইড নার্সিং সহকারী',
      'Level 2 Hydro Technician': 'লেভেল ২ হাইড্রো টেকনিশিয়ান',
      'Level 3 Wood Craftsman': 'লেভেল ৩ কাঠ মিস্ত্রি তক্ষক',
      'Level 2 Certified Craftsman': 'লেভেল ২ সার্টিফাইড কারিগর'
    }
  };

  return dict[lang]?.[levelStr] || dict['hi']?.[levelStr] || levelStr;
};

export const translateSkill = (skill, lang) => {
  if (!skill) return '';
  if (lang === 'en') return skill;

  const dict = {
    hi: {
      'MCB Wiring': 'एमसीबी वायरिंग',
      'Inverter Repair': 'इन्वर्टर मरम्मत',
      'Smart Switches': 'स्मार्ट स्विच',
      'Industrial Solar Panels': 'सोलर पैनल मरम्मत',
      'Elderly Care': 'बुजुर्गों की देखभाल',
      'Blood Pressure & Sugar Monitor': 'बीपी व शुगर जांच',
      'Physiotherapy Assist': 'फिजियोथेरेपी सहायता',
      'Post-Op Care': 'ऑपरेशन के बाद देखभाल',
      'High Pressure Leak Fix': 'लीक मरम्मत',
      'CPVC Fitting': 'सीपीवीसी फिटिंग',
      'Geyser Installation': 'गीज़र इंस्टॉलेशन',
      'Motor Pump Overhaul': 'मोटर पंप मरम्मत',
      'Modular Kitchen Repair': 'मॉड्यूलर किचन रिपेयर',
      'Custom Shelving': 'कस्टम अलमारी शेल्फ',
      'Door Frame Realignment': 'दरवाजा व ताला मरम्मत',
      'Furniture Polishing': 'फर्नीचर पॉलिश',
      'Nutritious Meal Prep': 'पौष्टिक भोजन तैयारी',
      'Utensil Washing Machine': 'बर्तन सफाई सहायता',
      'Floor Sanitization': 'फर्श सैनिटाइजेशन',
      'Laundry Care': 'कपड़ों की धुलाई',
      'Inverter AC Gas Refill': 'एसी गैस रिफिल',
      'PCB Washing Machine Fix': 'वाशिंग मशीन पीसीबी',
      'Double Door Fridge Repair': 'डबल डोर फ्रिज मरम्मत',
      'Electrician Specialist': 'इलेक्ट्रिशियन विशेषज्ञ',
      'Plumber Specialist': 'प्लंबर विशेषज्ञ',
      'Caregiver Specialist': 'देखभालकर्ता विशेषज्ञ',
      'Carpenter Specialist': 'बढ़ई विशेषज्ञ',
      'Domestic_helper Specialist': 'घरेलू सहायक विशेषज्ञ',
      'Technician Specialist': 'तकनीशियन विशेषज्ञ',
      'General Skilled Service': 'सामान्य कुशल सेवा'
    },
    mr: {
      'MCB Wiring': 'एमसीबी वायरिंग',
      'Inverter Repair': 'इन्व्हर्टर दुरुस्ती',
      'Smart Switches': 'स्मार्ट स्विचेस',
      'Elderly Care': 'ज्येष्ठांची काळजी',
      'Blood Pressure & Sugar Monitor': 'रक्तदाब तपासणी',
      'High Pressure Leak Fix': 'गळती दुरुस्ती',
      'CPVC Fitting': 'सीपीव्हीसी फिटिंग',
      'Geyser Installation': 'गिझर बसवणे',
      'Furniture Polishing': 'फर्निचर पॉलिश'
    },
    bn: {
      'MCB Wiring': 'এমসিবি ওয়ারিং',
      'Inverter Repair': 'ইনভার্টার মেরামত',
      'Smart Switches': 'স্মার্ট সুইচ',
      'Elderly Care': 'প্রবীণদের সেবা',
      'High Pressure Leak Fix': 'লিক মেরামত',
      'CPVC Fitting': 'সিপিভিসি ফিটিং',
      'Geyser Installation': 'গিজার ইনস্টলেশন'
    }
  };

  return dict[lang]?.[skill] || dict['hi']?.[skill] || skill;
};

export const translateWorkerName = (nameStr, lang) => {
  if (!nameStr) return '';
  if (lang === 'en') return nameStr;

  const localTagMap = {
    hi: '(स्थानीय)',
    mr: '(स्थानिक)',
    bn: '(স্থানীয়)',
    ta: '(உள்ளூர்)',
    te: '(స్థానిక)',
    kn: '(ಸ್ಥಾನಿಕ)',
    gu: '(સ્થાનિક)'
  };

  const tag = localTagMap[lang] || '(स्थानीय)';
  return nameStr.replace('(Local)', tag);
};

export const translateRole = (roleStr, t) => {
  if (!roleStr) return '';
  const roleLower = roleStr.toLowerCase().replace(' ', '_');
  if (roleLower === 'customer') return t('roleCustomer') || 'Customer';
  if (roleLower === 'worker') return t('roleWorker') || 'Worker';
  if (roleLower === 'society_admin') return t('roleSocietyAdmin') || 'Society Admin';
  if (roleLower === 'federation_admin') return t('roleFederationAdmin') || 'Federation Admin';
  if (roleLower === 'super_admin') return t('roleSuperAdmin') || 'Super Admin';
  return roleStr;
};

export const translateCategory = (catStr, t) => {
  if (!catStr) return '';
  const cleanCat = catStr.toLowerCase().replace(/ (specialist|\(emergency sos\))/i, '').trim();
  const key = `cat_${cleanCat}`;
  const translated = t(key);
  if (translated && translated !== key) {
    return catStr.toLowerCase().includes('emergency') ? `${translated} (आपातकालीन)` : translated;
  }
  return catStr;
};
