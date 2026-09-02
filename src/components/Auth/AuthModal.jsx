import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Modal } from '../Common/Modal';
import { 
  ShieldCheck, User, HardHat, Lock, Mail, AlertCircle, 
  Sparkles, LogIn, ArrowRight, Eye, EyeOff, Building2, Landmark, Crown, CheckCircle2, Phone, Check, X
} from 'lucide-react';
import { translateCategory, translateRole } from '../../utils/translateHelpers';
import {
  validatePhoneNumber,
  validatePassword,
  validateFullName,
  validateAadhaar,
  validateHourlyRate,
  validateEmail
} from '../../utils/validation';

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
  const { societies, addNotification } = useApp();
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

  // Worker Signup form state
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

  // Helper for live password analysis
  const custPassAnalysis = validatePassword(custPassword);
  const wrkPassAnalysis = validatePassword(wrkPassword);

  // Helper for live phone format
  const custPhoneAnalysis = validatePhoneNumber(custPhone);
  const wrkPhoneAnalysis = validatePhoneNumber(wrkPhone);

  // Helper for live Aadhaar format
  const wrkAadhaarAnalysis = validateAadhaar(wrkAadhaar);

  // 1-Tap Demo Role Login Triggers
  const demoAccounts = [
    { role: 'customer', label: translateRole('customer', t), input: 'customer@sahakar.in', pass: 'password123', icon: User, badgeColor: 'bg-emerald-500/10 text-emerald-700 border-emerald-300' },
    { role: 'worker', label: translateRole('worker', t), input: 'worker@sahakar.in', pass: 'password123', icon: HardHat, badgeColor: 'bg-amber-500/10 text-amber-700 border-amber-300' },
    { role: 'society_admin', label: translateRole('society_admin', t), input: 'society@sahakar.in', pass: 'admin123', icon: Building2, badgeColor: 'bg-blue-500/10 text-blue-700 border-blue-300' },
    { role: 'federation_admin', label: translateRole('federation_admin', t), input: 'federation@sahakar.in', pass: 'admin123', icon: Landmark, badgeColor: 'bg-indigo-500/10 text-indigo-700 border-indigo-300' },
    { role: 'super_admin', label: translateRole('super_admin', t), input: 'admin@sahakar.in', pass: 'admin123', icon: Crown, badgeColor: 'bg-purple-500/10 text-purple-700 border-purple-300' },
  ];

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

    // Front-end strict checks before dispatch
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
        name: custName,
        phone: custPhone,
        email: custEmail,
        password: custPassword
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

    // Front-end strict checks
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
        name: wrkName,
        phone: wrkPhone,
        email: wrkEmail,
        password: wrkPassword,
        aadhaarNo: wrkAadhaar,
        societyId: wrkSocietyId,
        category: wrkCategory,
        hourlyRate: Number(wrkRate)
      });

      if (res.success) {
        addNotification('Worker Account Registered & Aadhaar Verified!', 'success');
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

  // Password Checklist Component
  const PasswordChecklist = ({ analysis }) => {
    const { checks } = analysis;
    return (
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-[11px]">
        <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
          <span>Password Security Requirements</span>
          <span className={analysis.isValid ? 'text-emerald-600 font-extrabold' : 'text-amber-600 font-extrabold'}>
            {analysis.score}/5 Passed
          </span>
        </div>

        {/* Strength Progress Bar */}
        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden flex">
          <div
            className={`h-full transition-all duration-300 ${
              analysis.score <= 2 ? 'bg-red-500' : analysis.score <= 4 ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${(analysis.score / 5) * 100}%` }}
          ></div>
        </div>

        <div className="grid grid-cols-2 gap-1 pt-1 text-[10px]">
          <div className={`flex items-center gap-1 font-medium ${checks.minLength ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
            {checks.minLength ? <Check className="w-3 h-3 text-emerald-600" /> : <span className="w-3 h-3 text-slate-400 font-bold text-center">•</span>}
            <span>8+ Characters</span>
          </div>
          <div className={`flex items-center gap-1 font-medium ${checks.hasUpper ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
            {checks.hasUpper ? <Check className="w-3 h-3 text-emerald-600" /> : <span className="w-3 h-3 text-slate-400 font-bold text-center">•</span>}
            <span>1 Uppercase (A-Z)</span>
          </div>
          <div className={`flex items-center gap-1 font-medium ${checks.hasLower ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
            {checks.hasLower ? <Check className="w-3 h-3 text-emerald-600" /> : <span className="w-3 h-3 text-slate-400 font-bold text-center">•</span>}
            <span>1 Lowercase (a-z)</span>
          </div>
          <div className={`flex items-center gap-1 font-medium ${checks.hasNumber ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
            {checks.hasNumber ? <Check className="w-3 h-3 text-emerald-600" /> : <span className="w-3 h-3 text-slate-400 font-bold text-center">•</span>}
            <span>1 Number (0-9)</span>
          </div>
          <div className={`col-span-2 flex items-center gap-1 font-medium ${checks.hasSpecial ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
            {checks.hasSpecial ? <Check className="w-3 h-3 text-emerald-600" /> : <span className="w-3 h-3 text-slate-400 font-bold text-center">•</span>}
            <span>1 Special Character (!@#$%^&*)</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Modal
      isOpen={isAuthModalOpen}
      onClose={() => setIsAuthModalOpen(false)}
      title={t('authPortalTitle') || 'SahakarSeva Authentication Portal'}
    >
      <div className="space-y-5 font-sans">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 text-xs font-extrabold bg-slate-50 p-1 rounded-xl">
          <button
            onClick={() => { setAuthModalTab('login'); setErrorMsg(''); setIsAlreadyRegistered(false); }}
            className={`flex-1 py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              authModalTab === 'login'
                ? 'bg-white text-teal-800 shadow-sm border border-slate-200'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Lock className="w-3.5 h-3.5" /> {t('signInTab') || 'Sign In'}
          </button>

          <button
            onClick={() => { setAuthModalTab('register_customer'); setErrorMsg(''); setIsAlreadyRegistered(false); }}
            className={`flex-1 py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              authModalTab === 'register_customer'
                ? 'bg-white text-teal-800 shadow-sm border border-slate-200'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5" /> {t('custRegisterTab') || 'Customer Register'}
          </button>

          <button
            onClick={() => { setAuthModalTab('register_worker'); setErrorMsg(''); setIsAlreadyRegistered(false); }}
            className={`flex-1 py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              authModalTab === 'register_worker'
                ? 'bg-white text-teal-800 shadow-sm border border-slate-200'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <HardHat className="w-3.5 h-3.5" /> {t('workerKycTab') || 'Worker KYC'}
          </button>
        </div>

        {/* Error / Already Registered Alert Banner */}
        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-900 text-xs font-bold rounded-xl flex items-center justify-between gap-2 shadow-sm">
            <div className="flex items-center gap-2 min-w-0">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span className="truncate">{errorMsg}</span>
            </div>
            {isAlreadyRegistered && (
              <button
                type="button"
                onClick={() => handleSwitchToLoginWithCreds(custEmail || custPhone || wrkEmail || wrkPhone)}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors shrink-0 flex items-center gap-1"
              >
                <span>{t('signInTab') || 'Log In'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {/* TAB 1: LOGIN */}
        {authModalTab === 'login' && (
          <div className="space-y-4">

            {/* 1-Tap Demo Role Triggers */}
            <div className="p-3 bg-slate-900 text-white rounded-2xl space-y-2 border border-slate-800 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-black tracking-wider text-teal-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-teal-400" /> {t('quickTestLogins') || '1-Tap Quick Test Logins'}
                </span>
                <span className="text-[9px] text-slate-400">{t('selectRoleToSignIn') || 'Select any role to sign in instantly'}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-1">
                {demoAccounts.map((acc) => {
                  const Icon = acc.icon;
                  return (
                    <button
                      key={acc.role}
                      type="button"
                      onClick={() => handleDemoLogin(acc.input, acc.pass)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 border border-slate-700 text-left transition-all flex items-center gap-2 group"
                    >
                      <div className="p-1.5 rounded-lg bg-teal-500/20 text-teal-400 group-hover:bg-teal-500 group-hover:text-slate-950 transition-colors">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-extrabold text-[11px] text-white leading-tight truncate">{acc.label}</p>
                        <p className="text-[9px] text-slate-400 truncate">{acc.input.split('@')[0]}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-3.5 pt-1">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1">
                  {t('phoneOrEmail') || 'Phone Number or Email'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={loginInput}
                    onChange={(e) => setLoginInput(e.target.value)}
                    required
                    placeholder="e.g. 9701392418 or customer@sahakar.in"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none text-xs font-semibold text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1">
                  {t('passwordLabel') || 'Password'}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    placeholder={t('enterPasswordPlaceholder') || 'Enter your password'}
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none text-xs font-semibold text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-700"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white rounded-xl font-extrabold text-xs shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>{isSubmitting ? (t('authenticatingText') || 'Authenticating...') : (t('signInBtnText') || 'Sign In to Account')}</span>
              </button>
            </form>

          </div>
        )}

        {/* TAB 2: CUSTOMER SIGNUP */}
        {authModalTab === 'register_customer' && (
          <form onSubmit={handleCustRegisterSubmit} className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1">
                  {t('fullNameLabel') || 'Full Name'}
                </label>
                <input
                  type="text"
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  required
                  placeholder="Ashuthosh Kumar"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-extrabold text-slate-700 uppercase">
                    {t('phoneNumberLabel') || 'Mobile Number'}
                  </label>
                  {custPhone && (
                    <span className={`text-[10px] font-bold ${custPhoneAnalysis.isValid ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {custPhoneAnalysis.isValid ? '✓ Valid Mobile' : '10 Digits'}
                    </span>
                  )}
                </div>
                <input
                  type="tel"
                  value={custPhone}
                  onChange={(e) => setCustPhone(e.target.value)}
                  required
                  maxLength={14}
                  placeholder="e.g. 9701392418"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1">
                {t('emailAddressLabel') || 'Email Address (Optional)'}
              </label>
              <input
                type="email"
                value={custEmail}
                onChange={(e) => setCustEmail(e.target.value)}
                placeholder="customer@sahakar.in"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1">
                {t('passwordLabel') || 'Password'}
              </label>
              <div className="relative">
                <input
                  type={showCustPassword ? 'text' : 'password'}
                  value={custPassword}
                  onChange={(e) => setCustPassword(e.target.value)}
                  required
                  placeholder={t('chooseSecurePassword') || 'Choose a secure password (e.g. Secure@123)'}
                  className="w-full px-3 pr-10 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowCustPassword(!showCustPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-700"
                >
                  {showCustPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Live Password Checklist */}
            {custPassword.length > 0 && (
              <PasswordChecklist analysis={custPassAnalysis} />
            )}

            <button
              type="submit"
              disabled={isSubmitting || (custPassword.length > 0 && !custPassAnalysis.isValid)}
              className={`w-full py-3 rounded-xl font-extrabold text-xs shadow-lg transition-all flex items-center justify-center gap-2 ${
                custPassAnalysis.isValid && custPhoneAnalysis.isValid
                  ? 'bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Creating Account...' : (t('registerCustomerBtn') || 'Register Customer Account')}</span>
            </button>
          </form>
        )}

        {/* TAB 3: WORKER SIGNUP & AADHAAR KYC */}
        {authModalTab === 'register_worker' && (
          <form onSubmit={handleWorkerRegisterSubmit} className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1">
                  {t('workerNameLabel') || 'Worker Name'}
                </label>
                <input
                  type="text"
                  value={wrkName}
                  onChange={(e) => setWrkName(e.target.value)}
                  required
                  placeholder="Ramesh Sharma"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-extrabold text-slate-700 uppercase">
                    {t('phoneNumberLabel') || 'Mobile Number'}
                  </label>
                  {wrkPhone && (
                    <span className={`text-[10px] font-bold ${wrkPhoneAnalysis.isValid ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {wrkPhoneAnalysis.isValid ? '✓ Valid' : '10 Digits'}
                    </span>
                  )}
                </div>
                <input
                  type="tel"
                  value={wrkPhone}
                  onChange={(e) => setWrkPhone(e.target.value)}
                  required
                  maxLength={14}
                  placeholder="e.g. 9876543210"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-extrabold text-slate-700 uppercase">
                    {t('aadhaarNoLabel') || 'Aadhaar (12 Digits)'}
                  </label>
                  {wrkAadhaar && (
                    <span className={`text-[10px] font-bold ${wrkAadhaarAnalysis.isValid ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {wrkAadhaarAnalysis.isValid ? '✓ Valid' : '12 Digits'}
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  value={wrkAadhaar}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 12);
                    // auto format in blocks of 4
                    const formatted = val.replace(/(\d{4})(?=\d)/g, '$1-');
                    setWrkAadhaar(formatted);
                  }}
                  required
                  placeholder="8829-1029-4411"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1">
                  {t('coopSocietyLabel') || 'Cooperative Society'}
                </label>
                <select
                  value={wrkSocietyId}
                  onChange={(e) => setWrkSocietyId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white"
                >
                  {(societies && societies.length > 0 ? societies : []).map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1">
                  {t('skillCategoryLabel') || 'Skill Category'}
                </label>
                <select
                  value={wrkCategory}
                  onChange={(e) => setWrkCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white"
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

              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1">
                  {t('hourlyRateLabel') || 'Hourly Rate (Min ₹300)'}
                </label>
                <input
                  type="number"
                  value={wrkRate}
                  onChange={(e) => setWrkRate(e.target.value)}
                  required
                  min={300}
                  max={5000}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1">
                {t('passwordLabel') || 'Password'}
              </label>
              <div className="relative">
                <input
                  type={showWrkPassword ? 'text' : 'password'}
                  value={wrkPassword}
                  onChange={(e) => setWrkPassword(e.target.value)}
                  required
                  placeholder={t('chooseSecurePassword') || 'Choose a password (e.g. Worker@2026)'}
                  className="w-full px-3 pr-10 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowWrkPassword(!showWrkPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-700"
                >
                  {showWrkPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Live Password Checklist for Worker */}
            {wrkPassword.length > 0 && (
              <PasswordChecklist analysis={wrkPassAnalysis} />
            )}

            <button
              type="submit"
              disabled={isSubmitting || (wrkPassword.length > 0 && !wrkPassAnalysis.isValid)}
              className={`w-full py-3 rounded-xl font-extrabold text-xs shadow-lg transition-all flex items-center justify-center gap-2 ${
                wrkPassAnalysis.isValid && wrkPhoneAnalysis.isValid && wrkAadhaarAnalysis.isValid
                  ? 'bg-amber-600 hover:bg-amber-700 active:scale-95 text-white'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isSubmitting ? 'Verifying Aadhaar KYC...' : (t('registerWorkerBtn') || 'Register Worker & Link to Cooperative')}</span>
            </button>
          </form>
        )}
      </div>
    </Modal>
  );
};

