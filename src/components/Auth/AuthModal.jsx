import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  ShieldCheck, User, HardHat, Lock, Mail, AlertCircle, 
  Sparkles, LogIn, ArrowRight, ArrowLeft, Eye, EyeOff, 
  CheckCircle2, Phone, X, ChevronRight
} from 'lucide-react';
import { translateCategory } from '../../utils/translateHelpers';
import {
  validatePhoneNumber,
  validatePassword,
  validateFullName,
  validateAadhaar,
  validateHourlyRate,
  validateEmail
} from '../../utils/validation';

// --- Password strength bar (defined outside AuthModal to prevent re-renders) ---
const StrengthBar = ({ analysis }) => {
  if (!analysis) return null;
  const pct = (analysis.score / 5) * 100;
  const color = analysis.score <= 2 ? 'bg-red-500' : analysis.score <= 4 ? 'bg-amber-500' : 'bg-emerald-500';
  const label = analysis.score <= 2 ? 'Weak' : analysis.score <= 4 ? 'Medium' : 'Strong';
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500">Password strength</span>
        <span className={`text-xs font-bold ${analysis.score <= 2 ? 'text-red-600' : analysis.score <= 4 ? 'text-amber-600' : 'text-emerald-600'}`}>
          {label} ({analysis.score}/5)
        </span>
      </div>
      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
        <div className={`h-full transition-all duration-300 rounded-full ${color}`} style={{ width: `${pct}%` }}></div>
      </div>
    </div>
  );
};

// --- Shared input component (defined outside AuthModal to prevent keyboard dismiss on re-render) ---
const FormInput = ({ label, icon: Icon, type = 'text', value, onChange, placeholder, required = true, badge, maxLength, showToggle, isPassword, onToggle, showPassword }) => (
  <div className="space-y-1.5">
    <div className="flex items-center justify-between">
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      {badge}
    </div>
    <div className="relative">
      {Icon && <Icon className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />}
      <input
        type={isPassword ? (showPassword ? 'text' : 'password') : type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`w-full ${Icon ? 'pl-10' : 'pl-4'} ${showToggle ? 'pr-12' : 'pr-4'} py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none text-sm font-medium text-slate-900 bg-white transition-all placeholder:text-slate-400`}
      />
      {showToggle && (
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1"
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      )}
    </div>
  </div>
);

export const AuthModal = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    authModalTab, 
    setAuthModalTab, 
    login, 
    registerCustomer, 
    registerWorker 
  } = useAuth();
  const { societies, addNotification, userCoords, addRegisteredWorker, fetchWorkers } = useApp();
  const { t } = useLanguage();

  // Login form state
  const [loginInput, setLoginInput] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Customer Signup form state
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custPassword, setCustPassword] = useState('');
  const [showCustPassword, setShowCustPassword] = useState(false);

  // Worker Signup form state — with stepper
  const [wrkStep, setWrkStep] = useState(1);
  const [wrkName, setWrkName] = useState('');
  const [wrkPhone, setWrkPhone] = useState('');
  const [wrkEmail, setWrkEmail] = useState('');
  const [wrkPassword, setWrkPassword] = useState('');
  const [showWrkPassword, setShowWrkPassword] = useState(false);
  const [wrkAadhaar, setWrkAadhaar] = useState('');
  const [wrkSocietyId, setWrkSocietyId] = useState('soc_delhi_1');
  const [wrkCategory, setWrkCategory] = useState('electrician');
  const [wrkRate, setWrkRate] = useState(350);

  const [errorMsg, setErrorMsg] = useState('');
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validators
  const custPassAnalysis = validatePassword(custPassword);
  const wrkPassAnalysis = validatePassword(wrkPassword);
  const custPhoneAnalysis = validatePhoneNumber(custPhone);
  const wrkPhoneAnalysis = validatePhoneNumber(wrkPhone);
  const wrkAadhaarAnalysis = validateAadhaar(wrkAadhaar);

  if (!isAuthModalOpen) return null;

  // --- Handlers ---
  const handleDemoLogin = async (input, pass) => {
    setLoginInput(input);
    setLoginPassword(pass);
    setErrorMsg('');
    setIsAlreadyRegistered(false);
    setIsSubmitting(true);
    try {
      const res = await login(input, pass);
      if (res.success) {
        addNotification(res.message, 'success');
      } else {
        setErrorMsg(res.error);
      }
    } catch (err) {
      setErrorMsg('Login error: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSwitchToLoginWithCreds = (prefInput = '') => {
    if (prefInput) setLoginInput(prefInput);
    setAuthModalTab('login');
    setErrorMsg('');
    setIsAlreadyRegistered(false);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsAlreadyRegistered(false);
    setIsSubmitting(true);
    try {
      const res = await login(loginInput, loginPassword);
      if (res.success) {
        addNotification(res.message, 'success');
      } else {
        setErrorMsg(res.error);
      }
    } catch (err) {
      setErrorMsg('Login failed: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCustRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsAlreadyRegistered(false);

    const nameCheck = validateFullName(custName);
    if (!nameCheck.isValid) { setErrorMsg(nameCheck.error); return; }
    const phoneCheck = validatePhoneNumber(custPhone);
    if (!phoneCheck.isValid) { setErrorMsg(phoneCheck.error); return; }
    const passCheck = validatePassword(custPassword);
    if (!passCheck.isValid) { setErrorMsg(passCheck.error); return; }
    if (custEmail) {
      const emailCheck = validateEmail(custEmail);
      if (!emailCheck.isValid) { setErrorMsg(emailCheck.error); return; }
    }

    setIsSubmitting(true);
    try {
      const res = await registerCustomer({
        name: custName, phone: custPhone, email: custEmail, password: custPassword
      });
      if (res.success) {
        addNotification('Customer Account Created Successfully!', 'success');
      } else {
        setErrorMsg(res.error);
        if (res.alreadyRegistered || (res.error && res.error.toLowerCase().includes('already'))) {
          setIsAlreadyRegistered(true);
        }
      }
    } catch (err) {
      setErrorMsg('Registration failed: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWorkerRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsAlreadyRegistered(false);

    const nameCheck = validateFullName(wrkName);
    if (!nameCheck.isValid) { setErrorMsg(nameCheck.error); return; }
    const phoneCheck = validatePhoneNumber(wrkPhone);
    if (!phoneCheck.isValid) { setErrorMsg(phoneCheck.error); return; }
    const aadhaarCheck = validateAadhaar(wrkAadhaar);
    if (!aadhaarCheck.isValid) { setErrorMsg(aadhaarCheck.error); return; }
    const rateCheck = validateHourlyRate(wrkRate);
    if (!rateCheck.isValid) { setErrorMsg(rateCheck.error); return; }
    const passCheck = validatePassword(wrkPassword);
    if (!passCheck.isValid) { setErrorMsg(passCheck.error); return; }
    if (wrkEmail) {
      const emailCheck = validateEmail(wrkEmail);
      if (!emailCheck.isValid) { setErrorMsg(emailCheck.error); return; }
    }

    setIsSubmitting(true);
    try {
      const res = await registerWorker({
        name: wrkName, phone: wrkPhone, email: wrkEmail, password: wrkPassword,
        aadhaarNo: wrkAadhaar, societyId: wrkSocietyId, category: wrkCategory,
        hourlyRate: Number(wrkRate),
        lat: userCoords ? userCoords[0] : 28.6139,
        lng: userCoords ? userCoords[1] : 77.2090
      });
      if (res.success) {
        if (res.worker && addRegisteredWorker) addRegisteredWorker(res.worker);
        if (fetchWorkers) fetchWorkers();
        addNotification('Worker Account Registered & Verified!', 'success');
      } else {
        setErrorMsg(res.error);
        if (res.alreadyRegistered || (res.error && res.error.toLowerCase().includes('already'))) {
          setIsAlreadyRegistered(true);
        }
      }
    } catch (err) {
      setErrorMsg('Worker registration failed: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };


  // --- Tab switching ---
  const switchTab = (tab) => {
    setAuthModalTab(tab);
    setErrorMsg('');
    setIsAlreadyRegistered(false);
    if (tab === 'register_worker') setWrkStep(1);
  };

  // Worker step validation
  const isWrkStep1Valid = wrkName.trim().length >= 2 && wrkPhoneAnalysis.isValid;
  const isWrkStep2Valid = wrkAadhaarAnalysis.isValid && wrkSocietyId;
  const isWrkStep3Valid = wrkCategory && wrkRate >= 300 && wrkPassAnalysis.isValid;

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col animate-fadeIn">
      
      {/* Clean Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-500 flex items-center justify-center text-white text-sm font-black shadow-sm">
            🤝
          </div>
          <div>
            <h1 className="text-sm font-black text-slate-900 leading-none">SahakarSeva</h1>
            <p className="text-[11px] text-slate-500 font-medium">{t('cooperativeGigWorkforce') || 'Cooperative Workforce'}</p>
          </div>
        </div>
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-md mx-auto px-5 py-5 space-y-5">

          {/* Tab Switcher — Clean Pill Design */}
          <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
            <button
              onClick={() => switchTab('login')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
                authModalTab === 'login'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <LogIn className="w-4 h-4" /> Sign In
            </button>
            <button
              onClick={() => switchTab('register_customer')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
                authModalTab === 'register_customer'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <User className="w-4 h-4" /> Customer
            </button>
            <button
              onClick={() => switchTab('register_worker')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
                authModalTab === 'register_worker'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <HardHat className="w-4 h-4" /> Worker
            </button>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 text-sm font-medium rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                <span className="text-sm">{errorMsg}</span>
              </div>
              {isAlreadyRegistered && (
                <button
                  type="button"
                  onClick={() => handleSwitchToLoginWithCreds(custEmail || custPhone || wrkEmail || wrkPhone)}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors shrink-0"
                >
                  Log In →
                </button>
              )}
            </div>
          )}

          {/* ═══════════ TAB 1: SIGN IN ═══════════ */}
          {authModalTab === 'login' && (
            <div className="space-y-5">

              {/* Quick Demo Logins */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-teal-600" />
                  <span className="text-sm font-bold text-slate-700">Quick Demo Access</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('customer@sahakar.in', 'password123')}
                    className="py-2.5 px-3 rounded-xl bg-white border border-slate-200 hover:border-teal-400 hover:bg-teal-50 transition-all text-sm font-bold text-slate-700 flex items-center gap-2 active:scale-95"
                  >
                    <User className="w-4 h-4 text-emerald-600" /> Customer
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('worker@sahakar.in', 'password123')}
                    className="py-2.5 px-3 rounded-xl bg-white border border-slate-200 hover:border-amber-400 hover:bg-amber-50 transition-all text-sm font-bold text-slate-700 flex items-center gap-2 active:scale-95"
                  >
                    <HardHat className="w-4 h-4 text-amber-600" /> Worker
                  </button>
                </div>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-slate-200"></div>
                <span className="text-xs font-semibold text-slate-400 uppercase">or sign in manually</span>
                <div className="flex-1 h-px bg-slate-200"></div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <FormInput
                  label="Phone or Email"
                  icon={Mail}
                  value={loginInput}
                  onChange={(e) => setLoginInput(e.target.value)}
                  placeholder="e.g. 9701392418 or name@email.com"
                />

                <FormInput
                  label="Password"
                  icon={Lock}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter your password"
                  isPassword
                  showToggle
                  showPassword={showLoginPassword}
                  onToggle={() => setShowLoginPassword(!showLoginPassword)}
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 active:scale-[0.98] text-white rounded-xl font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{isSubmitting ? 'Signing in...' : 'Sign In'}</span>
                </button>
              </form>

              {/* Switch to Register */}
              <p className="text-center text-sm text-slate-500">
                Don't have an account?{' '}
                <button onClick={() => switchTab('register_customer')} className="text-teal-700 font-bold hover:underline">
                  Create one
                </button>
              </p>
            </div>
          )}

          {/* ═══════════ TAB 2: CUSTOMER REGISTER ═══════════ */}
          {authModalTab === 'register_customer' && (
            <div className="space-y-5">
              <div className="space-y-1">
                <h2 className="text-lg font-black text-slate-900">Create Customer Account</h2>
                <p className="text-sm text-slate-500">Book verified service workers at fair prices</p>
              </div>

              <form onSubmit={handleCustRegisterSubmit} className="space-y-4">
                <FormInput
                  label="Full Name"
                  icon={User}
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  placeholder="e.g. Ashuthosh Kumar"
                />

                <FormInput
                  label="Mobile Number"
                  icon={Phone}
                  type="tel"
                  value={custPhone}
                  onChange={(e) => setCustPhone(e.target.value)}
                  placeholder="e.g. 9701392418"
                  maxLength={14}
                  badge={custPhone && (
                    <span className={`text-xs font-bold ${custPhoneAnalysis.isValid ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {custPhoneAnalysis.isValid ? '✓ Valid' : '10 digits required'}
                    </span>
                  )}
                />

                <FormInput
                  label="Email (Optional)"
                  icon={Mail}
                  type="email"
                  value={custEmail}
                  onChange={(e) => setCustEmail(e.target.value)}
                  placeholder="e.g. name@email.com"
                  required={false}
                />

                <FormInput
                  label="Create Password"
                  icon={Lock}
                  value={custPassword}
                  onChange={(e) => setCustPassword(e.target.value)}
                  placeholder="Min 8 characters with uppercase & number"
                  isPassword
                  showToggle
                  showPassword={showCustPassword}
                  onToggle={() => setShowCustPassword(!showCustPassword)}
                />

                {custPassword.length > 0 && <StrengthBar analysis={custPassAnalysis} />}

                <button
                  type="submit"
                  disabled={isSubmitting || (custPassword.length > 0 && !custPassAnalysis.isValid)}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 ${
                    custPassAnalysis.isValid && custPhoneAnalysis.isValid
                      ? 'bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isSubmitting ? 'Creating Account...' : 'Create Account'}</span>
                </button>
              </form>

              <p className="text-center text-sm text-slate-500">
                Already have an account?{' '}
                <button onClick={() => switchTab('login')} className="text-teal-700 font-bold hover:underline">
                  Sign In
                </button>
              </p>
            </div>
          )}

          {/* ═══════════ TAB 3: WORKER REGISTER (3-STEP) ═══════════ */}
          {authModalTab === 'register_worker' && (
            <div className="space-y-5">
              
              {/* Step Progress */}
              <div className="space-y-2">
                <h2 className="text-lg font-black text-slate-900">Worker Registration</h2>
                <div className="flex items-center gap-2">
                  {[1, 2, 3].map((s) => (
                    <React.Fragment key={s}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                        wrkStep === s
                          ? 'bg-teal-600 text-white shadow-md'
                          : wrkStep > s
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 text-slate-400'
                      }`}>
                        {wrkStep > s ? <CheckCircle2 className="w-4 h-4" /> : s}
                      </div>
                      {s < 3 && (
                        <div className={`flex-1 h-0.5 rounded-full ${wrkStep > s ? 'bg-emerald-400' : 'bg-slate-200'}`}></div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
                <p className="text-sm text-slate-500">
                  {wrkStep === 1 && 'Step 1: Personal Information'}
                  {wrkStep === 2 && 'Step 2: Aadhaar KYC & Society'}
                  {wrkStep === 3 && 'Step 3: Skills & Password'}
                </p>
              </div>

              <form onSubmit={handleWorkerRegisterSubmit} className="space-y-4">

                {/* STEP 1: Personal Info */}
                {wrkStep === 1 && (
                  <>
                    <FormInput
                      label="Full Name"
                      icon={User}
                      value={wrkName}
                      onChange={(e) => setWrkName(e.target.value)}
                      placeholder="e.g. Ramesh Sharma"
                    />
                    <FormInput
                      label="Mobile Number"
                      icon={Phone}
                      type="tel"
                      value={wrkPhone}
                      onChange={(e) => setWrkPhone(e.target.value)}
                      placeholder="e.g. 9876543210"
                      maxLength={14}
                      badge={wrkPhone && (
                        <span className={`text-xs font-bold ${wrkPhoneAnalysis.isValid ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {wrkPhoneAnalysis.isValid ? '✓ Valid' : '10 digits required'}
                        </span>
                      )}
                    />
                    <FormInput
                      label="Email (Optional)"
                      icon={Mail}
                      type="email"
                      value={wrkEmail}
                      onChange={(e) => setWrkEmail(e.target.value)}
                      placeholder="e.g. name@email.com"
                      required={false}
                    />
                    <button
                      type="button"
                      disabled={!isWrkStep1Valid}
                      onClick={() => { setErrorMsg(''); setWrkStep(2); }}
                      className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                        isWrkStep1Valid
                          ? 'bg-teal-600 hover:bg-teal-700 active:scale-[0.98] text-white shadow-lg'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <span>Next: KYC Verification</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </>
                )}

                {/* STEP 2: KYC & Society */}
                {wrkStep === 2 && (
                  <>
                    <FormInput
                      label="Aadhaar Number (12 digits)"
                      icon={ShieldCheck}
                      value={wrkAadhaar}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 12);
                        const formatted = val.replace(/(\d{4})(?=\d)/g, '$1-');
                        setWrkAadhaar(formatted);
                      }}
                      placeholder="e.g. 8829-1029-4411"
                      badge={wrkAadhaar && (
                        <span className={`text-xs font-bold ${wrkAadhaarAnalysis.isValid ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {wrkAadhaarAnalysis.isValid ? '✓ Verified Format' : '12 digits needed'}
                        </span>
                      )}
                    />

                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-700">Cooperative Society</label>
                      <select
                        value={wrkSocietyId}
                        onChange={(e) => setWrkSocietyId(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white"
                      >
                        {(societies && societies.length > 0 ? societies : []).map((s) => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setWrkStep(1)}
                        className="flex-1 py-3 rounded-xl font-bold text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all flex items-center justify-center gap-2"
                      >
                        <ArrowLeft className="w-4 h-4" /> Back
                      </button>
                      <button
                        type="button"
                        disabled={!isWrkStep2Valid}
                        onClick={() => { setErrorMsg(''); setWrkStep(3); }}
                        className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                          isWrkStep2Valid
                            ? 'bg-teal-600 hover:bg-teal-700 active:scale-[0.98] text-white shadow-lg'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        <span>Next: Skills</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )}

                {/* STEP 3: Skills & Password */}
                {wrkStep === 3 && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-700">Skill Category</label>
                      <select
                        value={wrkCategory}
                        onChange={(e) => setWrkCategory(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white"
                      >
                        <option value="electrician">{translateCategory('electrician', t)}</option>
                        <option value="plumber">{translateCategory('plumber', t)}</option>
                        <option value="carpenter">{translateCategory('carpenter', t)}</option>
                        <option value="painter">{translateCategory('painter', t)}</option>
                        <option value="domestic_helper">{translateCategory('domestic_helper', t)}</option>
                        <option value="caregiver">{translateCategory('caregiver', t)}</option>
                        <option value="technician">{translateCategory('technician', t)}</option>
                      </select>
                    </div>

                    <FormInput
                      label="Hourly Rate (Min ₹300)"
                      type="number"
                      value={wrkRate}
                      onChange={(e) => setWrkRate(e.target.value)}
                      placeholder="e.g. 350"
                    />

                    <FormInput
                      label="Create Password"
                      icon={Lock}
                      value={wrkPassword}
                      onChange={(e) => setWrkPassword(e.target.value)}
                      placeholder="Min 8 characters"
                      isPassword
                      showToggle
                      showPassword={showWrkPassword}
                      onToggle={() => setShowWrkPassword(!showWrkPassword)}
                    />

                    {wrkPassword.length > 0 && <StrengthBar analysis={wrkPassAnalysis} />}

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setWrkStep(2)}
                        className="py-3 px-5 rounded-xl font-bold text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all flex items-center justify-center gap-2"
                      >
                        <ArrowLeft className="w-4 h-4" /> Back
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting || !isWrkStep3Valid}
                        className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                          isWrkStep3Valid
                            ? 'bg-amber-600 hover:bg-amber-700 active:scale-[0.98] text-white shadow-lg'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>{isSubmitting ? 'Registering...' : 'Register Worker'}</span>
                      </button>
                    </div>
                  </>
                )}
              </form>

              <p className="text-center text-sm text-slate-500">
                Already registered?{' '}
                <button onClick={() => switchTab('login')} className="text-teal-700 font-bold hover:underline">
                  Sign In
                </button>
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
