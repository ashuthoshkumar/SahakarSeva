import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WebNavbar } from './components/Navigation/WebNavbar';
import { WebFooter } from './components/Navigation/WebFooter';
import { AccountPage } from './components/Navigation/AccountPage';
import { BookingsPage } from './components/Navigation/BookingsPage';
import { CheckCircle2, Info, XCircle } from 'lucide-react';
import { LandingPage } from './components/Landing/LandingPage';
import { CustomerDashboard } from './components/Customer/CustomerDashboard';
import { WorkerDashboard } from './components/Worker/WorkerDashboard';

// Code-split admin dashboards for optimal initial bundle performance
const SocietyDashboard = React.lazy(() => import('./components/SocietyAdmin/SocietyDashboard').then(m => ({ default: m.SocietyDashboard })));
const FederationDashboard = React.lazy(() => import('./components/FederationAdmin/FederationDashboard').then(m => ({ default: m.FederationDashboard })));
const SuperAdminDashboard = React.lazy(() => import('./components/SuperAdmin/SuperAdminDashboard').then(m => ({ default: m.SuperAdminDashboard })));
import { BookingModal } from './components/Customer/BookingModal';
import { EmergencyBooking } from './components/Customer/EmergencyBooking';
import { PaymentModal } from './components/Payment/PaymentModal';
import { InvoiceModal } from './components/Payment/InvoiceModal';
import { AuthModal } from './components/Auth/AuthModal';
import { RatingModal } from './components/Customer/RatingModal';
import { LanguageSelectModal } from './components/Common/LanguageSelectModal';

const MainContent = ({ activeTab, setActiveTab }) => {
  const { currentRole, setCurrentRole } = useApp();
  const { isAuthenticated, user, openAuthModal } = useAuth();

  // Sync role view with logged in user role initially
  useEffect(() => {
    if (user && user.role) {
      setCurrentRole(user.role);
    }
  }, [user]);

  // Account tab
  if (activeTab === 'account' && isAuthenticated) {
    return <AccountPage />;
  }

  // Bookings tab
  if (activeTab === 'bookings' && isAuthenticated) {
    return <BookingsPage />;
  }

  // Active role to display: prioritize user's manual selection from View Portals, then user account role
  const activeRole = currentRole || (isAuthenticated ? (user?.role || 'customer') : null);

  // If not authenticated and no portal was chosen from View Portals, show Landing Page
  if (!isAuthenticated && !activeRole) {
    return <LandingPage setActiveTab={setActiveTab} />;
  }

  const effectiveRole = activeRole || 'customer';

  // Once authenticated or browsing dashboards via View Portals
  return (
    <div className="space-y-6">
      {/* If not authenticated but exploring a portal */}
      {!isAuthenticated && activeRole && (
        <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 border border-teal-500/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-white shadow-lg">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse"></span>
            <div>
              <p className="font-bold text-teal-300">
                Viewing {effectiveRole.replace('_', ' ').toUpperCase()} Portal
              </p>
              <p className="text-[11px] text-slate-300">
                You are currently exploring this cooperative role dashboard.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => openAuthModal('login')}
              className="px-3 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl font-bold transition-all shadow"
            >
              Sign In to This Role
            </button>
            <button
              onClick={() => {
                setCurrentRole(null);
                setActiveTab('home');
              }}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white rounded-xl font-medium transition-all"
            >
              Back to Landing
            </button>
          </div>
        </div>
      )}

      {/* If authenticated worker or customer switched to preview another portal */}
      {isAuthenticated && user && user.role !== effectiveRole && (
        <div className="bg-teal-500/10 border border-teal-500/30 rounded-2xl p-3 px-4 flex items-center justify-between text-xs text-teal-900">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
            <span>
              Previewing <strong>{effectiveRole.replace('_', ' ').toUpperCase()}</strong> Dashboard (Your registered account: <strong>{user.role}</strong>).
            </span>
          </div>
          <button
            onClick={() => setCurrentRole(user.role)}
            className="px-2.5 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold transition-all text-[11px]"
          >
            Return to My {user.role.toUpperCase()} Portal
          </button>
        </div>
      )}

      {effectiveRole === 'customer' && <CustomerDashboard />}
      {effectiveRole === 'worker' && <WorkerDashboard />}
      <React.Suspense fallback={
        <div className="flex items-center justify-center py-20 text-slate-400">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        </div>
      }>
        {effectiveRole === 'society_admin' && <SocietyDashboard />}
        {effectiveRole === 'federation_admin' && <FederationDashboard />}
        {effectiveRole === 'super_admin' && <SuperAdminDashboard />}
      </React.Suspense>
    </div>
  );
};

// Floating Toast Notification Renderer
const ToastNotifications = () => {
  const { notifications } = useApp();
  if (!notifications || notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 sm:right-6 z-[100] flex flex-col gap-2.5 w-[90%] max-w-sm pointer-events-none">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`p-3.5 rounded-2xl shadow-2xl border flex items-center gap-3 backdrop-blur-xl animate-fadeIn pointer-events-auto ${
            n.type === 'success'
              ? 'bg-emerald-50/95 text-emerald-900 border-emerald-300'
              : n.type === 'error'
              ? 'bg-red-50/95 text-red-900 border-red-300'
              : 'bg-slate-50/95 text-slate-900 border-slate-300'
          }`}
        >
          {n.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : n.type === 'error' ? (
            <XCircle className="w-5 h-5 text-red-600 shrink-0" />
          ) : (
            <Info className="w-5 h-5 text-blue-600 shrink-0" />
          )}
          <span className="text-xs font-bold leading-snug">{n.message}</span>
        </div>
      ))}
    </div>
  );
};

export function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <LanguageProvider>
      <AuthProvider>
        <AppProvider>
          {/* MODERN FULL-WIDTH WEB APPLICATION CONTAINER */}
          <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col antialiased selection:bg-teal-500 selection:text-white">
            
            {/* STICKY TOP WEB NAVBAR */}
            <WebNavbar activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* SPACIOUS DESKTOP MAIN WORKSPACE */}
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
              <MainContent activeTab={activeTab} setActiveTab={setActiveTab} />
            </main>

            {/* COMPREHENSIVE WEB FOOTER */}
            <WebFooter setActiveTab={setActiveTab} />

            {/* FLOATING TOAST NOTIFICATIONS */}
            <ToastNotifications />

            {/* GLOBAL DESKTOP MODALS */}
            <BookingModal />
            <EmergencyBooking />
            <PaymentModal />
            <InvoiceModal />
            <AuthModal />
            <RatingModal />
            <LanguageSelectModal />
            
          </div>
        </AppProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
