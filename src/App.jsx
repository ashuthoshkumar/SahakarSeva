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
  const { isAuthenticated, user } = useAuth();

  // Sync role view with logged in user role
  useEffect(() => {
    if (user && user.role) {
      setCurrentRole(user.role);
    }
  }, [user, setCurrentRole]);

  // Account tab
  if (activeTab === 'account' && isAuthenticated) {
    return <AccountPage />;
  }

  // Bookings tab
  if (activeTab === 'bookings' && isAuthenticated) {
    return <BookingsPage />;
  }

  // If user is on landing / home tab when not logged in
  if (!isAuthenticated && activeTab === 'home') {
    return <LandingPage setActiveTab={setActiveTab} />;
  }

  // If not authenticated and on another tab, show landing
  if (!isAuthenticated) {
    return <LandingPage setActiveTab={setActiveTab} />;
  }

  const activeRole = user?.role || currentRole;

  // Once authenticated or browsing dashboards
  return (
    <div className="space-y-6">
      {activeRole === 'customer' && <CustomerDashboard />}
      {activeRole === 'worker' && <WorkerDashboard />}
      <React.Suspense fallback={
        <div className="flex items-center justify-center py-20 text-slate-400">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        </div>
      }>
        {activeRole === 'society_admin' && <SocietyDashboard />}
        {activeRole === 'federation_admin' && <FederationDashboard />}
        {activeRole === 'super_admin' && <SuperAdminDashboard />}
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
