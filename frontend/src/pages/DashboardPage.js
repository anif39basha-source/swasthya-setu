import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../services/api';
import useStore from '../store/useStore';
import translations from '../translations';

// ============================================================
// DASHBOARD-SPECIFIC TRANSLATIONS
// ============================================================

const dashboardTranslations = {
  en: {
    welcomeToSwasthyaSetu: 'Welcome to SwasthyaSetu',
    hello: 'Hello',
    findHealthcareNearYou: 'find healthcare services near you',

    nearbyPHCs: 'Nearby PHCs',
    nearbyCHCs: 'Nearby CHCs',
    doctorsAvailable: 'Doctors Available',
    emergencyFacilities: 'Emergency Facilities',

    quickActions: 'Quick Actions',

    findHealthcare: 'Find Healthcare',
    phcsChcsHospitals: 'PHCs, CHCs, Hospitals',

    healthAssistant: 'Health Assistant',
    aiGuidance: 'AI guidance',

    bookAppointment: 'Book Appointment',
    scheduleVisit: 'Schedule visit',

    checkMedicine: 'Check Medicine',
    availabilitySearch: 'Availability search',

    emergency: 'Emergency',
    immediateHelp: 'Immediate help',

    myReferrals: 'My Referrals',
    trackReferrals: 'Track referrals',

    myAppointments: 'My Appointments',
    viewHistory: 'View history',

    settings: 'Settings',
    preferences: 'Preferences',

    nearbyHealthcareFacilities: 'Nearby Healthcare Facilities',
    viewAll: 'View All',
    open: 'Open',
    closed: 'Closed',
    noFacilitiesFound: 'No facilities found nearby',

    upcomingAppointments: 'Upcoming Appointments',
    noUpcomingAppointments: 'No upcoming appointments',
    bookNow: 'Book Now',

    recentReferrals: 'Recent Referrals',
    noReferralsYet: 'No referrals yet',

    importantHealthAnnouncements: 'Important Health Announcements',

    vaccinationAnnouncement:
      'Free vaccination camps every Wednesday at PHCs',

    maternalCareAnnouncement:
      'Maternal care services available 24/7 at District Hospital',

    tbScreeningAnnouncement:
      'TB screening drive continues this month - visit nearest facility',

    at: 'at',
    kmAway: 'km away',
    doctor: 'Dr.',
    to: 'to',
    pending: 'Pending',
    completed: 'Completed',
    accepted: 'Accepted',
    referred: 'Referred'
  },

  hi: {
    welcomeToSwasthyaSetu: 'स्वास्थ्यसेतु में आपका स्वागत है',
    hello: 'नमस्ते',
    findHealthcareNearYou: 'अपने आसपास स्वास्थ्य सेवाएं खोजें',

    nearbyPHCs: 'नजदीकी PHC',
    nearbyCHCs: 'नजदीकी CHC',
    doctorsAvailable: 'उपलब्ध डॉक्टर',
    emergencyFacilities: 'आपातकालीन सुविधाएं',

    quickActions: 'त्वरित कार्य',

    findHealthcare: 'स्वास्थ्य सेवा खोजें',
    phcsChcsHospitals: 'PHC, CHC, अस्पताल',

    healthAssistant: 'स्वास्थ्य सहायक',
    aiGuidance: 'AI मार्गदर्शन',

    bookAppointment: 'अपॉइंटमेंट बुक करें',
    scheduleVisit: 'भेंट निर्धारित करें',

    checkMedicine: 'दवा खोजें',
    availabilitySearch: 'दवा की उपलब्धता खोजें',

    emergency: 'आपातकाल',
    immediateHelp: 'तुरंत सहायता',

    myReferrals: 'मेरे रेफरल',
    trackReferrals: 'रेफरल ट्रैक करें',

    myAppointments: 'मेरी अपॉइंटमेंट',
    viewHistory: 'इतिहास देखें',

    settings: 'सेटिंग्स',
    preferences: 'प्राथमिकताएं',

    nearbyHealthcareFacilities: 'नजदीकी स्वास्थ्य सुविधाएं',
    viewAll: 'सभी देखें',
    open: 'खुला है',
    closed: 'बंद है',
    noFacilitiesFound: 'आसपास कोई स्वास्थ्य सुविधा नहीं मिली',

    upcomingAppointments: 'आगामी अपॉइंटमेंट',
    noUpcomingAppointments: 'कोई आगामी अपॉइंटमेंट नहीं है',
    bookNow: 'अभी बुक करें',

    recentReferrals: 'हाल के रेफरल',
    noReferralsYet: 'अभी कोई रेफरल नहीं है',

    importantHealthAnnouncements: 'महत्वपूर्ण स्वास्थ्य घोषणाएं',

    vaccinationAnnouncement:
      'हर बुधवार PHC में निःशुल्क टीकाकरण शिविर आयोजित किए जाते हैं',

    maternalCareAnnouncement:
      'जिला अस्पताल में मातृ देखभाल सेवाएं 24/7 उपलब्ध हैं',

    tbScreeningAnnouncement:
      'इस महीने TB स्क्रीनिंग अभियान जारी है - नजदीकी स्वास्थ्य केंद्र पर जाएं',

    at: 'समय',
    kmAway: 'किमी दूर',
    doctor: 'डॉ.',
    to: 'से',
    pending: 'लंबित',
    completed: 'पूर्ण',
    accepted: 'स्वीकृत',
    referred: 'रेफर किया गया'
  },

  kn: {
    welcomeToSwasthyaSetu: 'ಸ್ವಾಸ್ಥ್ಯಸೇತುಗೆ ಸ್ವಾಗತ',
    hello: 'ನಮಸ್ಕಾರ',
    findHealthcareNearYou: 'ನಿಮ್ಮ ಹತ್ತಿರದ ಆರೋಗ್ಯ ಸೇವೆಗಳನ್ನು ಹುಡುಕಿ',

    nearbyPHCs: 'ಹತ್ತಿರದ PHCಗಳು',
    nearbyCHCs: 'ಹತ್ತಿರದ CHCಗಳು',
    doctorsAvailable: 'ಲಭ್ಯವಿರುವ ವೈದ್ಯರು',
    emergencyFacilities: 'ತುರ್ತು ಚಿಕಿತ್ಸಾ ಸೌಲಭ್ಯಗಳು',

    quickActions: 'ತ್ವರಿತ ಕಾರ್ಯಗಳು',

    findHealthcare: 'ಆರೋಗ್ಯ ಸೇವೆ ಹುಡುಕಿ',
    phcsChcsHospitals: 'PHC, CHC, ಆಸ್ಪತ್ರೆಗಳು',

    healthAssistant: 'ಆರೋಗ್ಯ ಸಹಾಯಕ',
    aiGuidance: 'AI ಮಾರ್ಗದರ್ಶನ',

    bookAppointment: 'ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಬುಕ್ ಮಾಡಿ',
    scheduleVisit: 'ಭೇಟಿಯನ್ನು ನಿಗದಿಪಡಿಸಿ',

    checkMedicine: 'ಔಷಧಿ ಹುಡುಕಿ',
    availabilitySearch: 'ಔಷಧಿ ಲಭ್ಯತೆ ಹುಡುಕಿ',

    emergency: 'ತುರ್ತು ಪರಿಸ್ಥಿತಿ',
    immediateHelp: 'ತಕ್ಷಣದ ಸಹಾಯ',

    myReferrals: 'ನನ್ನ ರೆಫರಲ್‌ಗಳು',
    trackReferrals: 'ರೆಫರಲ್‌ಗಳನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ',

    myAppointments: 'ನನ್ನ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್‌ಗಳು',
    viewHistory: 'ಇತಿಹಾಸ ವೀಕ್ಷಿಸಿ',

    settings: 'ಸೆಟ್ಟಿಂಗ್ಸ್',
    preferences: 'ಆದ್ಯತೆಗಳು',

    nearbyHealthcareFacilities: 'ಹತ್ತಿರದ ಆರೋಗ್ಯ ಸೌಲಭ್ಯಗಳು',
    viewAll: 'ಎಲ್ಲವನ್ನೂ ನೋಡಿ',
    open: 'ತೆರೆದಿದೆ',
    closed: 'ಮುಚ್ಚಲಾಗಿದೆ',
    noFacilitiesFound: 'ಹತ್ತಿರ ಯಾವುದೇ ಆರೋಗ್ಯ ಸೌಲಭ್ಯಗಳು ಕಂಡುಬಂದಿಲ್ಲ',

    upcomingAppointments: 'ಮುಂಬರುವ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್‌ಗಳು',
    noUpcomingAppointments: 'ಯಾವುದೇ ಮುಂಬರುವ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್‌ಗಳಿಲ್ಲ',
    bookNow: 'ಈಗ ಬುಕ್ ಮಾಡಿ',

    recentReferrals: 'ಇತ್ತೀಚಿನ ರೆಫರಲ್‌ಗಳು',
    noReferralsYet: 'ಇನ್ನೂ ಯಾವುದೇ ರೆಫರಲ್‌ಗಳಿಲ್ಲ',

    importantHealthAnnouncements: 'ಪ್ರಮುಖ ಆರೋಗ್ಯ ಪ್ರಕಟಣೆಗಳು',

    vaccinationAnnouncement:
      'ಪ್ರತಿ ಬುಧವಾರ PHCಗಳಲ್ಲಿ ಉಚಿತ ಲಸಿಕಾ ಶಿಬಿರಗಳನ್ನು ಆಯೋಜಿಸಲಾಗುತ್ತದೆ',

    maternalCareAnnouncement:
      'ಜಿಲ್ಲಾ ಆಸ್ಪತ್ರೆಯಲ್ಲಿ 24/7 ತಾಯಂದಿರ ಆರೈಕೆ ಸೇವೆಗಳು ಲಭ್ಯವಿವೆ',

    tbScreeningAnnouncement:
      'ಈ ತಿಂಗಳು TB ತಪಾಸಣಾ ಅಭಿಯಾನ ಮುಂದುವರಿಯುತ್ತಿದೆ - ಹತ್ತಿರದ ಆರೋಗ್ಯ ಕೇಂದ್ರಕ್ಕೆ ಭೇಟಿ ನೀಡಿ',

    at: 'ಸಮಯ',
    kmAway: 'ಕಿಮೀ ದೂರ',
    doctor: 'ಡಾ.',
    to: 'ಗೆ',
    pending: 'ಬಾಕಿಯಿದೆ',
    completed: 'ಪೂರ್ಣಗೊಂಡಿದೆ',
    accepted: 'ಸ್ವೀಕರಿಸಲಾಗಿದೆ',
    referred: 'ರೆಫರ್ ಮಾಡಲಾಗಿದೆ'
  }
};

const DashboardPage = () => {
  const { user, selectedLanguage } = useStore((state) => state);

  const [nearbyFacilities, setNearbyFacilities] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [recentReferrals, setRecentReferrals] = useState([]);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    nearbyPHC: 0,
    nearbyCHC: 0,
    doctorsAvailable: 0,
    emergencies: 0
  });

  // ============================================================
  // LANGUAGE
  // ============================================================

  const language = selectedLanguage || 'en';

  const t = {
    ...(translations[language] || translations.en),
    ...(dashboardTranslations[language] || dashboardTranslations.en)
  };

  // ============================================================
  // LOAD DASHBOARD
  // ============================================================

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Default Bengaluru location
      let lat = 12.9716;
      let lng = 77.5946;

      // Try browser location
      try {
        const pos = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            resolve,
            reject,
            { timeout: 5000 }
          );
        });

        lat = pos.coords.latitude;
        lng = pos.coords.longitude;
      } catch (e) {
        // Use Bengaluru default location
      }

      // ========================================================
      // FACILITIES
      // ========================================================

      const facilitiesRes = await axios.get(
        `/facilities/nearby?lat=${lat}&lng=${lng}`
      );

      const facilities = facilitiesRes.data.data || [];

      setNearbyFacilities(facilities.slice(0, 3));

      // ========================================================
      // STATS
      // ========================================================

      setStats({
        nearbyPHC: facilities.filter(
          (f) => f.type === 'PHC'
        ).length,

        nearbyCHC: facilities.filter(
          (f) => f.type === 'CHC'
        ).length,

        doctorsAvailable: facilities.reduce(
          (sum, f) =>
            sum + parseInt(f.available_doctors || 0),
          0
        ),

        emergencies: facilities.filter(
          (f) => f.emergency_available
        ).length
      });

      // ========================================================
      // APPOINTMENTS
      // ========================================================

      try {
        const apptRes = await axios.get(
          '/appointments/upcoming'
        );

        setUpcomingAppointments(
          apptRes.data.data?.slice(0, 3) || []
        );
      } catch (e) {
        setUpcomingAppointments([]);
      }

      // ========================================================
      // REFERRALS
      // ========================================================

      try {
        const refRes = await axios.get('/referrals');

        setRecentReferrals(
          refRes.data.data?.slice(0, 3) || []
        );
      } catch (e) {
        setRecentReferrals([]);
      }

    } catch (error) {
      console.error(
        'Failed to load dashboard:',
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // QUICK ACTIONS
  // ============================================================

  const mainActions = [
    {
      icon: '🏥',
      title: t.findHealthcare || 'Find Healthcare',
      subtitle:
        t.phcsChcsHospitals ||
        'PHCs, CHCs, Hospitals',
      link: '/healthcare',
      color: 'bg-blue-500'
    },
    {
      icon: '🤖',
      title: t.healthAssistant || 'Health Assistant',
      subtitle:
        t.aiGuidance || 'AI guidance',
      link: '/ai-assistant',
      color: 'bg-purple-500'
    },
    {
      icon: '📅',
      title:
        t.bookAppointment ||
        'Book Appointment',
      subtitle:
        t.scheduleVisit ||
        'Schedule visit',
      link: '/book-appointment',
      color: 'bg-green-500'
    },
    {
      icon: '💊',
      title:
        t.checkMedicine ||
        'Check Medicine',
      subtitle:
        t.availabilitySearch ||
        'Availability search',
      link: '/medicine',
      color: 'bg-orange-500'
    },
    {
      icon: '🚑',
      title: t.emergency || 'Emergency',
      subtitle:
        t.immediateHelp ||
        'Immediate help',
      link: '/emergency',
      color: 'bg-red-500'
    },
    {
      icon: '📋',
      title:
        t.myReferrals ||
        'My Referrals',
      subtitle:
        t.trackReferrals ||
        'Track referrals',
      link: '/referrals',
      color: 'bg-indigo-500'
    },
    {
      icon: '📜',
      title:
        t.myAppointments ||
        'My Appointments',
      subtitle:
        t.viewHistory ||
        'View history',
      link: '/appointments',
      color: 'bg-teal-500'
    },
    {
      icon: '⚙️',
      title: t.settings || 'Settings',
      subtitle:
        t.preferences ||
        'Preferences',
      link: '/settings',
      color: 'bg-gray-500'
    }
  ];

  // ============================================================
  // REFERRAL STATUS TRANSLATION
  // ============================================================

  const getReferralStatus = (status) => {
    const value = String(status || '').toLowerCase();

    if (value === 'completed') {
      return t.completed || 'Completed';
    }

    if (value === 'accepted') {
      return t.accepted || 'Accepted';
    }

    if (value === 'pending') {
      return t.pending || 'Pending';
    }

    if (value === 'referred') {
      return t.referred || 'Referred';
    }

    return status;
  };

  return (
    <div className="space-y-6">

      {/* ========================================================
          WELCOME BANNER
          ======================================================== */}

      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 text-white">

        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          {t.welcomeToSwasthyaSetu ||
            'Welcome to SwasthyaSetu'}
        </h1>

        <p className="text-primary-100">
          {t.hello || 'Hello'}{' '}
          {user?.name || 'User'}
          {', '}
          {t.findHealthcareNearYou ||
            'find healthcare services near you'}
        </p>

      </div>


      {/* ========================================================
          QUICK STATS
          ======================================================== */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        {/* PHC */}

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">

          <div className="text-2xl mb-1">
            🏥
          </div>

          <div className="text-2xl font-bold text-gray-800">
            {stats.nearbyPHC}
          </div>

          <div className="text-sm text-gray-500">
            {t.nearbyPHCs || 'Nearby PHCs'}
          </div>

        </div>


        {/* CHC */}

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">

          <div className="text-2xl mb-1">
            🏨
          </div>

          <div className="text-2xl font-bold text-gray-800">
            {stats.nearbyCHC}
          </div>

          <div className="text-sm text-gray-500">
            {t.nearbyCHCs || 'Nearby CHCs'}
          </div>

        </div>


        {/* DOCTORS */}

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">

          <div className="text-2xl mb-1">
            👨‍⚕️
          </div>

          <div className="text-2xl font-bold text-gray-800">
            {stats.doctorsAvailable}
          </div>

          <div className="text-sm text-gray-500">
            {t.doctorsAvailable ||
              'Doctors Available'}
          </div>

        </div>


        {/* EMERGENCY */}

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">

          <div className="text-2xl mb-1">
            🚨
          </div>

          <div className="text-2xl font-bold text-gray-800">
            {stats.emergencies}
          </div>

          <div className="text-sm text-gray-500">
            {t.emergencyFacilities ||
              'Emergency Facilities'}
          </div>

        </div>

      </div>


      {/* ========================================================
          QUICK ACTIONS
          ======================================================== */}

      <div>

        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {t.quickActions || 'Quick Actions'}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          {mainActions.map((action, idx) => (

            <Link
              key={idx}
              to={action.link}
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md hover:border-primary-300 transition-all text-center group"
            >

              <div
                className={`w-14 h-14 ${action.color} rounded-full flex items-center justify-center mx-auto mb-3 text-2xl group-hover:scale-110 transition-transform`}
              >
                {action.icon}
              </div>

              <h3 className="font-semibold text-gray-800 text-sm">
                {action.title}
              </h3>

              <p className="text-xs text-gray-500 mt-1">
                {action.subtitle}
              </p>

            </Link>

          ))}

        </div>

      </div>


      {/* ========================================================
          NEARBY FACILITIES
          ======================================================== */}

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">

        <div className="flex items-center justify-between mb-4">

          <h2 className="text-xl font-bold text-gray-800">
            {t.nearbyHealthcareFacilities ||
              'Nearby Healthcare Facilities'}
          </h2>

          <Link
            to="/healthcare"
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            {t.viewAll || 'View All'} →
          </Link>

        </div>


        {loading ? (

          <div className="space-y-3">

            {[1, 2, 3].map((i) => (

              <div
                key={i}
                className="h-16 bg-gray-100 rounded-lg skeleton"
              />

            ))}

          </div>

        ) : nearbyFacilities.length > 0 ? (

          <div className="space-y-3">

            {nearbyFacilities.map((facility) => (

              <Link
                key={facility.id}
                to={`/facility/${facility.id}`}
                className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >

                <div className="flex items-center space-x-3">

                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">

                    <span className="text-primary-600">
                      🏥
                    </span>

                  </div>

                  <div>

                    <h3 className="font-medium text-gray-800">
                      {facility.name}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {facility.type} •{' '}
                      {facility.distance}{' '}
                      {t.kmAway || 'km away'}
                    </p>

                  </div>

                </div>


                <span
                  className={`status-badge ${
                    facility.emergency_available
                      ? 'status-open'
                      : 'status-closed'
                  }`}
                >
                  {facility.emergency_available
                    ? t.open || 'Open'
                    : t.closed || 'Closed'}
                </span>

              </Link>

            ))}

          </div>

        ) : (

          <div className="text-center py-8 text-gray-500">

            <div className="text-4xl mb-2">
              🏥
            </div>

            <p>
              {t.noFacilitiesFound ||
                'No facilities found nearby'}
            </p>

          </div>

        )}

      </div>


      {/* ========================================================
          APPOINTMENTS + REFERRALS
          ======================================================== */}

      <div className="grid md:grid-cols-2 gap-6">

        {/* ======================================================
            UPCOMING APPOINTMENTS
            ====================================================== */}

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">

          <h2 className="text-lg font-bold text-gray-800 mb-4">
            📅{' '}
            {t.upcomingAppointments ||
              'Upcoming Appointments'}
          </h2>


          {upcomingAppointments.length > 0 ? (

            <div className="space-y-3">

              {upcomingAppointments.map((apt) => (

                <div
                  key={apt.id}
                  className="p-3 bg-blue-50 rounded-lg"
                >

                  <h3 className="font-medium text-gray-800">
                    {apt.facility_name}
                  </h3>

                  <p className="text-sm text-gray-600">

                    {new Date(
                      apt.appointment_date
                    ).toLocaleDateString(
                      language === 'hi'
                        ? 'hi-IN'
                        : language === 'kn'
                        ? 'kn-IN'
                        : 'en-IN'
                    )}

                    {' '}

                    {t.at || 'at'}

                    {' '}

                    {apt.appointment_time}

                  </p>

                  <p className="text-xs text-gray-500">

                    {t.doctor || 'Dr.'}{' '}

                    {apt.doctor_name || 'TBD'}

                  </p>

                </div>

              ))}

            </div>

          ) : (

            <div className="text-center py-6 text-gray-500">

              <div className="text-3xl mb-2">
                📅
              </div>

              <p>
                {t.noUpcomingAppointments ||
                  'No upcoming appointments'}
              </p>

              <Link
                to="/book-appointment"
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                {t.bookNow || 'Book Now'}
              </Link>

            </div>

          )}

        </div>


        {/* ======================================================
            REFERRALS
            ====================================================== */}

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">

          <h2 className="text-lg font-bold text-gray-800 mb-4">
            📋{' '}
            {t.recentReferrals ||
              'Recent Referrals'}
          </h2>


          {recentReferrals.length > 0 ? (

            <div className="space-y-3">

              {recentReferrals.map((ref) => (

                <div
                  key={ref.id}
                  className="p-3 bg-indigo-50 rounded-lg"
                >

                  <h3 className="font-medium text-gray-800">

                    {ref.from_facility_name}

                    {' → '}

                    {ref.to_facility_name ||
                      t.pending ||
                      'Pending'}

                  </h3>

                  <p className="text-sm text-gray-600">
                    {ref.reason}
                  </p>

                  <span
                    className={`status-badge mt-1 ${
                      ref.status === 'completed'
                        ? 'status-open'
                        : ref.status === 'accepted'
                        ? 'status-limited'
                        : 'status-closed'
                    }`}
                  >
                    {getReferralStatus(ref.status)}
                  </span>

                </div>

              ))}

            </div>

          ) : (

            <div className="text-center py-6 text-gray-500">

              <div className="text-3xl mb-2">
                📋
              </div>

              <p>
                {t.noReferralsYet ||
                  'No referrals yet'}
              </p>

            </div>

          )}

        </div>

      </div>


      {/* ========================================================
          HEALTH ANNOUNCEMENTS
          ======================================================== */}

      <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">

        <h2 className="text-lg font-bold text-yellow-800 mb-3">
          📢{' '}
          {t.importantHealthAnnouncements ||
            'Important Health Announcements'}
        </h2>

        <ul className="space-y-2 text-sm text-yellow-900">

          <li className="flex items-start space-x-2">

            <span>•</span>

            <span>
              {t.vaccinationAnnouncement ||
                'Free vaccination camps every Wednesday at PHCs'}
            </span>

          </li>

          <li className="flex items-start space-x-2">

            <span>•</span>

            <span>
              {t.maternalCareAnnouncement ||
                'Maternal care services available 24/7 at District Hospital'}
            </span>

          </li>

          <li className="flex items-start space-x-2">

            <span>•</span>

            <span>
              {t.tbScreeningAnnouncement ||
                'TB screening drive continues this month - visit nearest facility'}
            </span>

          </li>

        </ul>

      </div>

    </div>
  );
};

export default DashboardPage;