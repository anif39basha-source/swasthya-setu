import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../services/api';
import useStore from '../store/useStore';

const translations = {
  en: {
    portal: 'Healthcare Worker Portal',
    dashboard: 'Health Worker Dashboard',
    subtitle: 'Manage patients, appointments and referrals from one place.',
    refresh: 'Refresh',
    loading: 'Loading dashboard...',
    totalPatients: 'Total Patients',
    todayAppointments: "Today's Appointments",
    pendingReferrals: 'Pending Referrals',
    lowStock: 'Low Stock Alerts',
    quickActions: 'Quick Actions',
    patients: 'Patients',
    managePatients: 'Manage patients',
    appointments: 'Appointments',
    viewPatientVisits: 'View patient visits',
    referrals: 'Referrals',
    manageReferrals: 'Manage referrals',
    findFacility: 'Find Facility',
    locateHealthcare: 'Locate healthcare',
    recentPatients: 'Recent Patients',
    recentlyAssigned: 'Recently assigned patients',
    viewAll: 'View All →',
    pending: 'pending',
    noPatients: 'No patients assigned',
    upcomingAppointments: 'Upcoming Appointments',
    pendingConfirmed: 'Pending and confirmed visits',
    noAppointments: 'No upcoming appointments',
    newAppointments: 'New citizen appointments will appear here.',
    facility: 'Facility',
    generalMedicine: 'General Medicine',
    years: 'years',
    ageNA: 'Age N/A',
    genderNA: 'Gender N/A',
    patient: 'Patient',
    healthWorkerPortal: 'Health Worker Portal',
    information:
      'Use the dashboard to manage assigned patients, review appointments, process referrals and coordinate healthcare services.',
    id: 'ID:',
    na: 'N/A'
  },

  hi: {
    portal: 'स्वास्थ्य कार्यकर्ता पोर्टल',
    dashboard: 'स्वास्थ्य कार्यकर्ता डैशबोर्ड',
    subtitle: 'एक ही स्थान से मरीजों, अपॉइंटमेंट और रेफरल का प्रबंधन करें।',
    refresh: 'रिफ्रेश करें',
    loading: 'डैशबोर्ड लोड हो रहा है...',
    totalPatients: 'कुल मरीज',
    todayAppointments: 'आज की अपॉइंटमेंट',
    pendingReferrals: 'लंबित रेफरल',
    lowStock: 'कम स्टॉक अलर्ट',
    quickActions: 'त्वरित कार्य',
    patients: 'मरीज',
    managePatients: 'मरीजों का प्रबंधन करें',
    appointments: 'अपॉइंटमेंट',
    viewPatientVisits: 'मरीजों की विजिट देखें',
    referrals: 'रेफरल',
    manageReferrals: 'रेफरल का प्रबंधन करें',
    findFacility: 'स्वास्थ्य केंद्र खोजें',
    locateHealthcare: 'स्वास्थ्य सेवा खोजें',
    recentPatients: 'हाल के मरीज',
    recentlyAssigned: 'हाल ही में सौंपे गए मरीज',
    viewAll: 'सभी देखें →',
    pending: 'लंबित',
    noPatients: 'कोई मरीज assigned नहीं है',
    upcomingAppointments: 'आगामी अपॉइंटमेंट',
    pendingConfirmed: 'लंबित और पुष्ट विजिट',
    noAppointments: 'कोई आगामी अपॉइंटमेंट नहीं',
    newAppointments: 'नए नागरिकों की अपॉइंटमेंट यहां दिखाई देंगी।',
    facility: 'स्वास्थ्य केंद्र',
    generalMedicine: 'सामान्य चिकित्सा',
    years: 'वर्ष',
    ageNA: 'आयु उपलब्ध नहीं',
    genderNA: 'लिंग उपलब्ध नहीं',
    patient: 'मरीज',
    healthWorkerPortal: 'स्वास्थ्य कार्यकर्ता पोर्टल',
    information:
      'सौंपे गए मरीजों का प्रबंधन करने, अपॉइंटमेंट की समीक्षा करने, रेफरल प्रक्रिया करने और स्वास्थ्य सेवाओं का समन्वय करने के लिए डैशबोर्ड का उपयोग करें।',
    id: 'आईडी:',
    na: 'उपलब्ध नहीं'
  },

  kn: {
    portal: 'ಆರೋಗ್ಯ ಕಾರ್ಯಕರ್ತರ ಪೋರ್ಟಲ್',
    dashboard: 'ಆರೋಗ್ಯ ಕಾರ್ಯಕರ್ತರ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    subtitle:
      'ಒಂದೇ ಸ್ಥಳದಿಂದ ರೋಗಿಗಳು, ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್‌ಗಳು ಮತ್ತು ರೆಫರಲ್‌ಗಳನ್ನು ನಿರ್ವಹಿಸಿ.',
    refresh: 'ರಿಫ್ರೆಶ್',
    loading: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...',
    totalPatients: 'ಒಟ್ಟು ರೋಗಿಗಳು',
    todayAppointments: 'ಇಂದಿನ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್‌ಗಳು',
    pendingReferrals: 'ಬಾಕಿ ಇರುವ ರೆಫರಲ್‌ಗಳು',
    lowStock: 'ಕಡಿಮೆ ಸ್ಟಾಕ್ ಎಚ್ಚರಿಕೆಗಳು',
    quickActions: 'ತ್ವರಿತ ಕಾರ್ಯಗಳು',
    patients: 'ರೋಗಿಗಳು',
    managePatients: 'ರೋಗಿಗಳನ್ನು ನಿರ್ವಹಿಸಿ',
    appointments: 'ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್‌ಗಳು',
    viewPatientVisits: 'ರೋಗಿಗಳ ಭೇಟಿಗಳನ್ನು ವೀಕ್ಷಿಸಿ',
    referrals: 'ರೆಫರಲ್‌ಗಳು',
    manageReferrals: 'ರೆಫರಲ್‌ಗಳನ್ನು ನಿರ್ವಹಿಸಿ',
    findFacility: 'ಆರೋಗ್ಯ ಕೇಂದ್ರ ಹುಡುಕಿ',
    locateHealthcare: 'ಆರೋಗ್ಯ ಸೇವೆ ಹುಡುಕಿ',
    recentPatients: 'ಇತ್ತೀಚಿನ ರೋಗಿಗಳು',
    recentlyAssigned: 'ಇತ್ತೀಚೆಗೆ ನಿಯೋಜಿಸಲಾದ ರೋಗಿಗಳು',
    viewAll: 'ಎಲ್ಲವನ್ನೂ ವೀಕ್ಷಿಸಿ →',
    pending: 'ಬಾಕಿಯಿದೆ',
    noPatients: 'ಯಾವುದೇ ರೋಗಿಗಳನ್ನು ನಿಯೋಜಿಸಲಾಗಿಲ್ಲ',
    upcomingAppointments: 'ಮುಂಬರುವ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್‌ಗಳು',
    pendingConfirmed: 'ಬಾಕಿ ಇರುವ ಮತ್ತು ದೃಢೀಕರಿಸಿದ ಭೇಟಿಗಳು',
    noAppointments: 'ಯಾವುದೇ ಮುಂಬರುವ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್‌ಗಳಿಲ್ಲ',
    newAppointments:
      'ಹೊಸ ನಾಗರಿಕರ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್‌ಗಳು ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತವೆ.',
    facility: 'ಆರೋಗ್ಯ ಕೇಂದ್ರ',
    generalMedicine: 'ಸಾಮಾನ್ಯ ವೈದ್ಯಕೀಯ',
    years: 'ವರ್ಷಗಳು',
    ageNA: 'ವಯಸ್ಸು ಲಭ್ಯವಿಲ್ಲ',
    genderNA: 'ಲಿಂಗ ಲಭ್ಯವಿಲ್ಲ',
    patient: 'ರೋಗಿ',
    healthWorkerPortal: 'ಆರೋಗ್ಯ ಕಾರ್ಯಕರ್ತರ ಪೋರ್ಟಲ್',
    information:
      'ನಿಯೋಜಿಸಲಾದ ರೋಗಿಗಳನ್ನು ನಿರ್ವಹಿಸಲು, ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್‌ಗಳನ್ನು ಪರಿಶೀಲಿಸಲು, ರೆಫರಲ್‌ಗಳನ್ನು ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲು ಮತ್ತು ಆರೋಗ್ಯ ಸೇವೆಗಳನ್ನು ಸಮನ್ವಯಗೊಳಿಸಲು ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಬಳಸಿ.',
    id: 'ಐಡಿ:',
    na: 'ಲಭ್ಯವಿಲ್ಲ'
  }
};

const HealthWorkerDashboard = () => {
  const { selectedLanguage } = useStore();

  const language =
    selectedLanguage ||
    localStorage.getItem('language') ||
    'en';

  const t = translations[language] || translations.en;

  const [stats, setStats] = useState({
    total_patients: 0,
    total_appointments: 0,
    pending_referrals: 0,
    low_stock_alerts: 0
  });

  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const [dashRes, patientsRes, apptRes] =
        await Promise.all([
          axios.get('/health-worker/dashboard'),
          axios.get('/health-worker/patients'),
          axios.get('/appointments')
        ]);

      const dashboardData = dashRes.data.data || {};

      setStats({
        total_patients:
          dashboardData.total_patients || 0,
        total_appointments:
          dashboardData.total_appointments || 0,
        pending_referrals:
          dashboardData.pending_referrals || 0,
        low_stock_alerts:
          dashboardData.low_stock_alerts || 0
      });

      setPatients(
        patientsRes.data.data?.slice(0, 5) || []
      );

      setAppointments(
        apptRes.data.data
          ?.filter(
            appointment =>
              appointment.status === 'pending' ||
              appointment.status === 'confirmed'
          )
          .slice(0, 5) || []
      );
    } catch (error) {
      console.error(
        'Failed to load health worker dashboard:',
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = status => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700';

      case 'pending':
        return 'bg-yellow-100 text-yellow-700';

      case 'cancelled':
        return 'bg-red-100 text-red-700';

      case 'completed':
        return 'bg-blue-100 text-blue-700';

      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusText = status => {
    switch (status) {
      case 'confirmed':
        return language === 'hi'
          ? 'पुष्ट'
          : language === 'kn'
          ? 'ದೃಢೀಕರಿಸಲಾಗಿದೆ'
          : 'Confirmed';

      case 'pending':
        return t.pending;

      case 'cancelled':
        return language === 'hi'
          ? 'रद्द'
          : language === 'kn'
          ? 'ರದ್ದುಗೊಳಿಸಲಾಗಿದೆ'
          : 'Cancelled';

      case 'completed':
        return language === 'hi'
          ? 'पूर्ण'
          : language === 'kn'
          ? 'ಪೂರ್ಣಗೊಂಡಿದೆ'
          : 'Completed';

      default:
        return status || t.na;
    }
  };

  const formatDate = date => {
    if (!date) return t.na;

    const locale =
      language === 'hi'
        ? 'hi-IN'
        : language === 'kn'
        ? 'kn-IN'
        : 'en-IN';

    return new Date(date).toLocaleDateString(
      locale,
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    );
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-7 text-white shadow-sm">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>
            <p className="text-green-100 text-sm mb-1">
              {t.portal}
            </p>

            <h1 className="text-3xl font-bold">
              🏥 {t.dashboard}
            </h1>

            <p className="text-green-100 mt-2">
              {t.subtitle}
            </p>
          </div>

          <button
            onClick={loadDashboard}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium"
          >
            🔄 {t.refresh}
          </button>

        </div>

      </div>

      {/* Loading */}
      {loading && (
        <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
          <div className="animate-spin text-4xl mb-2">
            🔄
          </div>

          <p className="text-gray-500">
            {t.loading}
          </p>
        </div>
      )}

      {/* Statistics */}
      {!loading && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-gray-500">
                  {t.totalPatients}
                </p>

                <p className="text-3xl font-bold text-gray-800 mt-1">
                  {stats.total_patients}
                </p>
              </div>

              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-2xl">
                👥
              </div>

            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-gray-500">
                  {t.todayAppointments}
                </p>

                <p className="text-3xl font-bold text-gray-800 mt-1">
                  {stats.total_appointments}
                </p>
              </div>

              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-2xl">
                📅
              </div>

            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-gray-500">
                  {t.pendingReferrals}
                </p>

                <p className="text-3xl font-bold text-gray-800 mt-1">
                  {stats.pending_referrals}
                </p>
              </div>

              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-2xl">
                📋
              </div>

            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-gray-500">
                  {t.lowStock}
                </p>

                <p className="text-3xl font-bold text-gray-800 mt-1">
                  {stats.low_stock_alerts}
                </p>
              </div>

              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-2xl">
                ⚠️
              </div>

            </div>
          </div>

        </div>
      )}

      {/* Quick Actions */}
      <div>

        <h2 className="text-xl font-bold text-gray-800 mb-3">
          {t.quickActions}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          <Link
            to="/health-worker/patients"
            className="bg-blue-500 text-white rounded-xl p-5 text-center hover:bg-blue-600 transition shadow-sm"
          >
            <div className="text-3xl mb-2">
              👥
            </div>

            <div className="font-semibold">
              {t.patients}
            </div>

            <div className="text-xs text-blue-100 mt-1">
              {t.managePatients}
            </div>
          </Link>

          <Link
            to="/health-worker/appointments"
            className="bg-green-500 text-white rounded-xl p-5 text-center hover:bg-green-600 transition shadow-sm"
          >
            <div className="text-3xl mb-2">
              📅
            </div>

            <div className="font-semibold">
              {t.appointments}
            </div>

            <div className="text-xs text-green-100 mt-1">
              {t.viewPatientVisits}
            </div>
          </Link>

          <Link
            to="/health-worker/referrals"
            className="bg-purple-500 text-white rounded-xl p-5 text-center hover:bg-purple-600 transition shadow-sm"
          >
            <div className="text-3xl mb-2">
              📋
            </div>

            <div className="font-semibold">
              {t.referrals}
            </div>

            <div className="text-xs text-purple-100 mt-1">
              {t.manageReferrals}
            </div>
          </Link>

          <Link
            to="/healthcare"
            className="bg-orange-500 text-white rounded-xl p-5 text-center hover:bg-orange-600 transition shadow-sm"
          >
            <div className="text-3xl mb-2">
              🏥
            </div>

            <div className="font-semibold">
              {t.findFacility}
            </div>

            <div className="text-xs text-orange-100 mt-1">
              {t.locateHealthcare}
            </div>
          </Link>

        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Recent Patients */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">

          <div className="flex items-center justify-between mb-5">

            <div>
              <h2 className="text-lg font-bold text-gray-800">
                👥 {t.recentPatients}
              </h2>

              <p className="text-xs text-gray-500 mt-1">
                {t.recentlyAssigned}
              </p>
            </div>

            <Link
              to="/health-worker/patients"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              {t.viewAll}
            </Link>

          </div>

          {patients.length > 0 ? (

            <div className="space-y-3">

              {patients.map(patient => (

                <div
                  key={patient.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >

                  <div className="flex items-center gap-3">

                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                      {patient.name?.charAt(0)?.toUpperCase() || 'P'}
                    </div>

                    <div>

                      <h3 className="font-medium text-gray-800">
                        {patient.name || t.patient}
                      </h3>

                      <p className="text-xs text-gray-500">
                        {patient.age
                          ? `${patient.age} ${t.years}`
                          : t.ageNA}
                        {' • '}
                        {patient.gender || t.genderNA}
                      </p>

                    </div>

                  </div>

                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                    {patient.pending_appointments || 0}{' '}
                    {t.pending}
                  </span>

                </div>

              ))}

            </div>

          ) : (

            <div className="text-center py-8">

              <div className="text-4xl mb-2">
                👥
              </div>

              <p className="text-gray-500">
                {t.noPatients}
              </p>

            </div>

          )}

        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">

          <div className="flex items-center justify-between mb-5">

            <div>
              <h2 className="text-lg font-bold text-gray-800">
                📅 {t.upcomingAppointments}
              </h2>

              <p className="text-xs text-gray-500 mt-1">
                {t.pendingConfirmed}
              </p>
            </div>

            <Link
              to="/health-worker/appointments"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              {t.viewAll}
            </Link>

          </div>

          {appointments.length > 0 ? (

            <div className="space-y-3">

              {appointments.map(appointment => (

                <div
                  key={appointment.id}
                  className="p-4 bg-gray-50 rounded-lg"
                >

                  <div className="flex items-start justify-between gap-3">

                    <div>

                      <h3 className="font-semibold text-gray-800">
                        {appointment.patient_name || t.patient}
                      </h3>

                      <p className="text-xs text-gray-500 mt-1">
                        🏥 {appointment.facility_name || t.facility}
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        🩺 {appointment.department || t.generalMedicine}
                      </p>

                    </div>

                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(
                        appointment.status
                      )}`}
                    >
                      {getStatusText(appointment.status)}
                    </span>

                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-200">

                    <p className="text-xs text-gray-500">
                      📅 {formatDate(appointment.appointment_date)}
                      {' • '}
                      🕐 {appointment.appointment_time || t.na}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      {t.id}{' '}
                      {appointment.appointment_id ||
                        appointment.id}
                    </p>

                  </div>

                </div>

              ))}

            </div>

          ) : (

            <div className="text-center py-8">

              <div className="text-4xl mb-2">
                📅
              </div>

              <p className="text-gray-500">
                {t.noAppointments}
              </p>

              <p className="text-xs text-gray-400 mt-1">
                {t.newAppointments}
              </p>

            </div>

          )}

        </div>

      </div>

      {/* Information Banner */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-5">

        <div className="flex items-start gap-3">

          <div className="text-2xl">
            💡
          </div>

          <div>

            <h3 className="font-semibold text-green-800">
              {t.healthWorkerPortal}
            </h3>

            <p className="text-sm text-green-700 mt-1">
              {t.information}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default HealthWorkerDashboard;