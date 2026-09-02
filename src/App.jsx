import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MobileHeader, MobileBottomNav } from './components/Navigation/MobileNav';
import { AccountPage } from './components/Navigation/AccountPage';
import { BookingsPage } from './components/Navigation/BookingsPage';
import { CheckCircle2, Info, XCircle } from 'lucide-react';
import { LandingPage } from './components/Landing/LandingPage';
import { CustomerDashboard } from './components/Customer/CustomerDashboard';
import { WorkerDashboard } from './components/Worker/WorkerDashboard';
import { SocietyDashboard } from './components/SocietyAdmin/SocietyDashboard';
import { FederationDashboard } from './components/FederationAdmin/FederationDashboard';
import { SuperAdminDashboard } from './components/SuperAdmin/SuperAdminDashboard';
import { BookingModal } from './components/Customer/BookingModal';
import { EmergencyBooking } from './components/Customer/EmergencyBooking';
import { PaymentModal } from './components/Payment/PaymentModal';
import { InvoiceModal } from './components/Payment/InvoiceModal';
import { AuthModal } from './components/Auth/AuthModal';
import { RatingModal } from './components/Customer/RatingModal';
import { LanguageSelectModal } from './components/Common/LanguageSelectModal';

const MainContent = ({ activeTab }) => {
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
    return <LandingPage />;
  }

  // If not authenticated and on another tab, show landing
  if (!isAuthenticated) {
    return <LandingPage />;
  }

  const activeRole = user?.role || currentRole;

  // Once authenticated or browsing dashboards
  return (
    <div className="space-y-4 pb-4">
      {activeRole === 'customer' && <CustomerDashboard />}
      {activeRole === 'worker' && <WorkerDashboard />}
      {activeRole === 'society_admin' && <SocietyDashboard />}
      {activeRole === 'federation_admin' && <FederationDashboard />}
      {activeRole === 'super_admin' && <SuperAdminDashboard />}
    </div>
  );
};

// Floating Toast Notification Renderer
const ToastNotifications = () => {
  const { notifications } = useApp();
  if (!notifications || notifications.length === 0) return null;

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 w-[90%] max-w-sm pointer-events-none">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`p-3 rounded-2xl shadow-xl border flex items-center gap-2.5 backdrop-blur-md animate-fadeIn pointer-events-auto ${
            n.type === 'success'
              ? 'bg-emerald-50/95 text-emerald-900 border-emerald-300'
              : n.type === 'error'
              ? 'bg-red-50/95 text-red-900 border-red-300'
              : 'bg-slate-50/95 text-slate-900 border-slate-300'
          }`}
        >
          {n.type === 'success' ? (
            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
          ) : n.type === 'error' ? (
            <XCircle className="w-4.5 h-4.5 text-red-600 shrink-0" />
          ) : (
            <Info className="w-4.5 h-4.5 text-blue-600 shrink-0" />
          )}
          <span className="text-[11px] font-bold leading-snug">{n.message}</span>
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
          {/* NATIVE MOBILE PHONE APP SHELL CONTAINER */}
          <div className="min-h-screen bg-slate-100 font-sans">
            
            {/* MOBILE DEVICE CONTAINER - full width on phone, centered on desktop */}
            <div className="w-full max-w-md mx-auto min-h-screen bg-slate-50 shadow-2xl flex flex-col relative overflow-hidden text-slate-800">
              
              {/* TOP MOBILE APP BAR */}
              <MobileHeader setActiveTab={setActiveTab} />

              {/* SCROLLABLE MOBILE CONTENT AREA */}
              <main className="flex-1 overflow-y-auto px-3.5 py-3 pb-20">
                <MainContent activeTab={activeTab} />
              </main>

              {/* FIXED BOTTOM MOBILE TAB NAVIGATION */}
              <MobileBottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

              {/* FLOATING TOAST NOTIFICATIONS */}
              <ToastNotifications />

              {/* GLOBAL MODALS */}
              <BookingModal />
              <EmergencyBooking />
              <PaymentModal />
              <InvoiceModal />
              <AuthModal />
              <RatingModal />
              <LanguageSelectModal />
              
            </div>

          </div>
        </AppProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
