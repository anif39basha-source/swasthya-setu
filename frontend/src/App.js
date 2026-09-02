import React, { useEffect } from 'react';
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  Link
} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import './App.css';
import useStore from './store/useStore';

import logo from './assets/swasthya-logo.png';

// ============================================================
// PUBLIC / CITIZEN PAGES
// ============================================================

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import HealthcareFinder from './pages/HealthcareFinder';
import FacilityDetails from './pages/FacilityDetails';
import MedicineAvailability from './pages/MedicineAvailability';
import AIAssistant from './pages/AIAssistant';
import BookAppointment from './pages/BookAppointment';
import MyAppointments from './pages/MyAppointments';
import MyReferrals from './pages/MyReferrals';
import EmergencyModule from './pages/EmergencyModule';
import SettingsPage from './pages/SettingsPage';
import NotFound from './pages/NotFound';

// ============================================================
// HEALTH WORKER
// ============================================================

import HealthWorkerDashboard from './pages/HealthWorkerDashboard';
import HealthWorkerAppointments from './pages/HealthWorkerAppointments';
import PatientManagement from './pages/PatientManagement';

// ============================================================
// ADMIN
// ============================================================

import AdminDashboard from './pages/AdminDashboard';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminUsers from './pages/AdminUsers';
import AdminFacilities from './pages/AdminFacilities';
import AdminDoctors from './pages/AdminDoctors';
import AdminMedicines from './pages/AdminMedicines';

// ============================================================
// COMPONENTS
// ============================================================

import OfflineIndicator from './components/OfflineIndicator';

import translations from './translations';


function App() {

  const {
    isAuthenticated,
    user,
    logout,
    fetchDashboardStats,
    setOnline,
    isOnline,
    selectedLanguage,
    setLanguage
  } = useStore();


  // ============================================================
  // TRANSLATIONS
  // ============================================================

  const t =
    translations[selectedLanguage] ||
    translations.en;


  // ============================================================
  // RESTORE LOGIN AFTER PAGE REFRESH
  // ============================================================

  useEffect(() => {

    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {

      try {

        const parsedUser = JSON.parse(userStr);

       useStore
  .getState()
  .setAuth(parsedUser, token);

      } catch (error) {

        console.error(
          'Failed to restore login:',
          error
        );

        logout();
      }
    }

  }, [logout, fetchDashboardStats]);


  // ============================================================
  // INTERNET CONNECTION MONITORING
  // ============================================================

  useEffect(() => {

    const handleOnline = () => {
      setOnline(true);
    };

    const handleOffline = () => {
      setOnline(false);
    };


    window.addEventListener(
      'online',
      handleOnline
    );

    window.addEventListener(
      'offline',
      handleOffline
    );


    return () => {

      window.removeEventListener(
        'online',
        handleOnline
      );

      window.removeEventListener(
        'offline',
        handleOffline
      );

    };

  }, [setOnline]);


  // ============================================================
  // PUBLIC PAGES
  // ============================================================

  if (!isAuthenticated) {

    return (
      <>
        <Toaster position="top-right" />

        <Routes>

          <Route
            path="/"
            element={<LandingPage />}
          />

          <Route
            path="/login"
            element={<LoginPage />}
          />

          <Route
            path="/register"
            element={<RegisterPage />}
          />

          <Route
            path="*"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />

        </Routes>
      </>
    );
  }


  // ============================================================
  // LOGGED-IN APPLICATION
  // ============================================================

  return (

    <div className="app-shell">

      <Toaster position="top-right" />

      <OfflineIndicator />


      {/* ========================================================
          SIDEBAR
          ======================================================== */}

      <aside className="app-sidebar">


        {/* ======================================================
            LOGO
            ====================================================== */}

        <Link
          to="/"
          className="sidebar-brand"
        >

          <img
            src={logo}
            alt="SwasthyaSetu"
            className="sidebar-logo"
          />

          <div>

            <div className="sidebar-brand-name">
              SwasthyaSetu
            </div>

            <div className="sidebar-brand-tagline">
              Healthcare for Everyone
            </div>

          </div>

        </Link>


        {/* ======================================================
            USER
            ====================================================== */}

        <div className="sidebar-user">

          <div className="user-avatar">

            {user?.name
              ?.charAt(0)
              ?.toUpperCase() || 'U'}

          </div>


          <div className="user-info">

            <strong>
              {user?.name || 'User'}
            </strong>

            <span>

              {user?.role === 'health_worker'
                ? 'Health Worker'
                : user?.role === 'admin'
                ? 'Administrator'
                : 'Citizen'}

            </span>

          </div>

        </div>


        {/* ======================================================
            NAVIGATION
            ====================================================== */}

        <nav className="sidebar-nav">

          <div className="nav-section-title">
            MAIN
          </div>


          {/* ====================================================
              CITIZEN NAVIGATION
              ==================================================== */}

          {user?.role === 'citizen' && (
            <>

              <NavLink
                to="/"
                exact
                icon="⌂"
              >
                {t.dashboard}
              </NavLink>


              <NavLink
                to="/healthcare"
                icon="🏥"
              >
                {t.findHealthcare}
              </NavLink>


              <NavLink
                to="/medicine"
                icon="💊"
              >
                {t.medicine}
              </NavLink>


              <NavLink
                to="/ai-assistant"
                icon="✦"
              >
                {t.healthAssistant}
              </NavLink>


              <NavLink
                to="/appointments"
                icon="📅"
              >
                {t.appointments}
              </NavLink>


              <NavLink
                to="/referrals"
                icon="📄"
              >
                {t.referrals}
              </NavLink>


              <NavLink
                to="/emergency"
                icon="🚨"
                emergency
              >
                {t.emergency}
              </NavLink>

            </>
          )}


          {/* ====================================================
              HEALTH WORKER NAVIGATION
              ==================================================== */}

          {user?.role === 'health_worker' && (
            <>

              <NavLink
                to="/health-worker/dashboard"
                icon="⌂"
              >
                {t.dashboard}
              </NavLink>


              <NavLink
                to="/health-worker/patients"
                icon="👥"
              >
                {t.patients}
              </NavLink>


              <NavLink
                to="/health-worker/appointments"
                icon="📅"
              >
                {t.appointments}
              </NavLink>


              <NavLink
                to="/health-worker/referrals"
                icon="📄"
              >
                {t.referrals}
              </NavLink>

            </>
          )}


          {/* ====================================================
              ADMIN NAVIGATION
              ==================================================== */}

          {user?.role === 'admin' && (
            <>

              <NavLink
                to="/admin/dashboard"
                exact
                icon="⌂"
              >
                Dashboard
              </NavLink>


              <NavLink
                to="/admin/analytics"
                icon="📊"
              >
                Analytics
              </NavLink>


              <NavLink
                to="/admin/facilities"
                icon="🏥"
              >
                Facilities
              </NavLink>


              <NavLink
                to="/admin/doctors"
                icon="👨‍⚕️"
              >
                Doctors
              </NavLink>


              <NavLink
                to="/admin/users"
                icon="👥"
              >
                Users
              </NavLink>


              <NavLink
                to="/admin/medicines"
                icon="💊"
              >
                Medicine Inventory
              </NavLink>

            </>
          )}


          {/* ====================================================
              ACCOUNT
              ==================================================== */}

          <div className="nav-section-title settings-title">
            ACCOUNT
          </div>


          <NavLink
            to="/settings"
            icon="⚙"
          >
            {t.settings}
          </NavLink>

        </nav>


        {/* ======================================================
            SIDEBAR BOTTOM
            ====================================================== */}

        <div className="sidebar-bottom">


          {/* Connection */}

          <div className="connection-status">

            <span
              className={
                isOnline
                  ? 'connection-dot online'
                  : 'connection-dot offline'
              }
            />

            {isOnline
              ? t.online || 'Online'
              : t.offline || 'Offline'}

          </div>


          {/* Logout */}

          <button
            onClick={logout}
            className="logout-button"
          >

            <span>
              ↪
            </span>

            {t.logout}

          </button>

        </div>

      </aside>


      {/* ========================================================
          MAIN APPLICATION
          ======================================================== */}

      <div className="app-main">


        {/* ======================================================
            TOP HEADER
            ====================================================== */}

        <header className="app-header">

          <div>

            <div className="header-welcome">

              {t.welcome || 'Welcome back'}
              {', '}

              {user?.name
                ?.split(' ')[0] || 'User'}

            </div>


            <div className="header-subtitle">

              {t.healthcareTagline ||
                'Your healthcare, all in one place.'}

            </div>

          </div>


          {/* ====================================================
              HEADER ACTIONS
              ==================================================== */}

          <div className="header-actions">


            {/* English */}

            <button
              className={`language-button ${
                selectedLanguage === 'en'
                  ? 'language-active'
                  : ''
              }`}
              onClick={() =>
                setLanguage('en')
              }
            >
              English
            </button>


            {/* Hindi */}

            <button
              className={`language-button ${
                selectedLanguage === 'hi'
                  ? 'language-active'
                  : ''
              }`}
              onClick={() =>
                setLanguage('hi')
              }
            >
              हिन्दी
            </button>


            {/* Kannada */}

            <button
              className={`language-button ${
                selectedLanguage === 'kn'
                  ? 'language-active'
                  : ''
              }`}
              onClick={() =>
                setLanguage('kn')
              }
            >
              ಕನ್ನಡ
            </button>


            {/* Avatar */}

            <div className="header-avatar">

              {user?.name
                ?.charAt(0)
                ?.toUpperCase() || 'U'}

            </div>

          </div>

        </header>


        {/* ======================================================
            PAGE CONTENT
            ====================================================== */}

        <main className="app-content">

          <Routes>


            {/* ==================================================
                ROOT
                ================================================== */}

            <Route
              path="/"
              element={

                user?.role === 'health_worker' ? (

                  <Navigate
                    to="/health-worker/dashboard"
                    replace
                  />

                ) : user?.role === 'admin' ? (

                  <Navigate
                    to="/admin/dashboard"
                    replace
                  />

                ) : (

                  <DashboardPage />

                )

              }
            />


            {/* ==================================================
                CITIZEN ROUTES
                ================================================== */}

            <Route
              path="/healthcare"
              element={<HealthcareFinder />}
            />

            <Route
              path="/facility/:id"
              element={<FacilityDetails />}
            />

            <Route
              path="/medicine"
              element={<MedicineAvailability />}
            />

            <Route
              path="/ai-assistant"
              element={<AIAssistant />}
            />

            <Route
              path="/appointments"
              element={<MyAppointments />}
            />

            <Route
              path="/book-appointment"
              element={<BookAppointment />}
            />

            <Route
              path="/referrals"
              element={<MyReferrals />}
            />

            <Route
              path="/emergency"
              element={<EmergencyModule />}
            />


            {/* ==================================================
                HEALTH WORKER ROUTES
                ================================================== */}

            <Route
              path="/health-worker/dashboard"
              element={<HealthWorkerDashboard />}
            />

            <Route
              path="/health-worker/patients"
              element={<PatientManagement />}
            />

            <Route
              path="/health-worker/appointments"
              element={<HealthWorkerAppointments />}
            />

            <Route
              path="/health-worker/referrals"
              element={<MyReferrals />}
            />


            {/* ==================================================
                ADMIN ROUTES
                ================================================== */}

            {/* Dashboard */}

            <Route
              path="/admin/dashboard"
              element={<AdminDashboard />}
            />


            {/* Analytics */}

            <Route
              path="/admin/analytics"
              element={<AdminAnalytics />}
            />


            {/* Facilities */}

            <Route
              path="/admin/facilities"
              element={<AdminFacilities />}
            />


            {/* Doctors */}

            <Route
              path="/admin/doctors"
              element={<AdminDoctors />}
            />


            {/* Users */}

            <Route
              path="/admin/users"
              element={<AdminUsers />}
            />


            {/* Medicine Inventory */}

            <Route
              path="/admin/medicines"
              element={<AdminMedicines />}
            />


            {/* ==================================================
                SETTINGS
                ================================================== */}

            <Route
              path="/settings"
              element={<SettingsPage />}
            />


            {/* ==================================================
                404
                ================================================== */}

            <Route
              path="*"
              element={<NotFound />}
            />

          </Routes>

        </main>

      </div>

    </div>
  );
}


// ============================================================
// NAVIGATION COMPONENT
// ============================================================

function NavLink({
  children,
  to,
  icon,
  exact = false,
  emergency = false
}) {

  const { pathname } = useLocation();


  const active = exact
    ? pathname === to
    : pathname.startsWith(to);


  return (

    <Link
      to={to}
      className={`
        app-nav-link
        ${active
          ? 'app-nav-link-active'
          : ''}
        ${emergency
          ? 'app-nav-link-emergency'
          : ''}
      `}
    >

      <span className="nav-icon">
        {icon}
      </span>


      <span>
        {children}
      </span>

    </Link>

  );
}


export default App;