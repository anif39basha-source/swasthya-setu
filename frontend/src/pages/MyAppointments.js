import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../services/api';
import useStore from '../store/useStore';
import translations from '../translations';

// ============================================================
// MY APPOINTMENTS TRANSLATIONS
// ============================================================

const appointmentTranslations = {
  en: {
    myAppointments: 'My Appointments',
    viewManageAppointments:
      'View your upcoming and past appointments',

    refresh: 'Refresh',
    loadingAppointments: 'Loading your appointments...',

    upcoming: 'Upcoming',
    past: 'Past',
    all: 'All',

    appointment: 'Appointment',
    appointmentId: 'Appointment ID',

    facility: 'Healthcare Facility',
    doctor: 'Doctor',
    department: 'Department',
    date: 'Date',
    time: 'Time',
    notes: 'Notes',

    pending: 'Pending',
    confirmed: 'Confirmed',
    completed: 'Completed',
    cancelled: 'Cancelled',
    unknown: 'Unknown',

    noAppointments: 'No appointments found',
    noAppointmentsMessage:
      'You do not have any appointments yet.',
    bookAppointment: 'Book Appointment',

    noUpcoming:
      'You do not have any upcoming appointments.',
    noPast:
      'You do not have any past appointments.',

    anyAvailableDoctor: 'Any Available Doctor',
    generalMedicine: 'General Medicine',

    at: 'at',

    failedToLoad:
      'Unable to load your appointments. Please try again.',
    tryAgain: 'Try Again'
  },

  hi: {
    myAppointments: 'मेरी अपॉइंटमेंट',
    viewManageAppointments:
      'अपनी आगामी और पिछली अपॉइंटमेंट देखें',

    refresh: 'रिफ्रेश करें',
    loadingAppointments: 'आपकी अपॉइंटमेंट लोड हो रही हैं...',

    upcoming: 'आगामी',
    past: 'पिछली',
    all: 'सभी',

    appointment: 'अपॉइंटमेंट',
    appointmentId: 'अपॉइंटमेंट आईडी',

    facility: 'स्वास्थ्य केंद्र',
    doctor: 'डॉक्टर',
    department: 'विभाग',
    date: 'दिनांक',
    time: 'समय',
    notes: 'टिप्पणियां',

    pending: 'लंबित',
    confirmed: 'पुष्ट',
    completed: 'पूर्ण',
    cancelled: 'रद्द',
    unknown: 'अज्ञात',

    noAppointments: 'कोई अपॉइंटमेंट नहीं मिली',
    noAppointmentsMessage:
      'आपकी अभी तक कोई अपॉइंटमेंट नहीं है।',
    bookAppointment: 'अपॉइंटमेंट बुक करें',

    noUpcoming:
      'आपकी कोई आगामी अपॉइंटमेंट नहीं है।',
    noPast:
      'आपकी कोई पिछली अपॉइंटमेंट नहीं है।',

    anyAvailableDoctor: 'कोई भी उपलब्ध डॉक्टर',
    generalMedicine: 'सामान्य चिकित्सा',

    at: 'समय',

    failedToLoad:
      'आपकी अपॉइंटमेंट लोड नहीं हो सकीं। कृपया फिर से प्रयास करें।',
    tryAgain: 'फिर से प्रयास करें'
  },

  kn: {
    myAppointments: 'ನನ್ನ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್‌ಗಳು',
    viewManageAppointments:
      'ನಿಮ್ಮ ಮುಂಬರುವ ಮತ್ತು ಹಿಂದಿನ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್‌ಗಳನ್ನು ವೀಕ್ಷಿಸಿ',

    refresh: 'ರಿಫ್ರೆಶ್',
    loadingAppointments:
      'ನಿಮ್ಮ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್‌ಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...',

    upcoming: 'ಮುಂಬರುವ',
    past: 'ಹಿಂದಿನ',
    all: 'ಎಲ್ಲಾ',

    appointment: 'ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್',
    appointmentId: 'ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಐಡಿ',

    facility: 'ಆರೋಗ್ಯ ಕೇಂದ್ರ',
    doctor: 'ವೈದ್ಯರು',
    department: 'ವಿಭಾಗ',
    date: 'ದಿನಾಂಕ',
    time: 'ಸಮಯ',
    notes: 'ಟಿಪ್ಪಣಿಗಳು',

    pending: 'ಬಾಕಿಯಿದೆ',
    confirmed: 'ದೃಢೀಕರಿಸಲಾಗಿದೆ',
    completed: 'ಪೂರ್ಣಗೊಂಡಿದೆ',
    cancelled: 'ರದ್ದುಗೊಳಿಸಲಾಗಿದೆ',
    unknown: 'ಅಜ್ಞಾತ',

    noAppointments: 'ಯಾವುದೇ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್‌ಗಳು ಕಂಡುಬಂದಿಲ್ಲ',
    noAppointmentsMessage:
      'ನೀವು ಇನ್ನೂ ಯಾವುದೇ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಹೊಂದಿಲ್ಲ.',
    bookAppointment: 'ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಬುಕ್ ಮಾಡಿ',

    noUpcoming:
      'ನಿಮಗೆ ಯಾವುದೇ ಮುಂಬರುವ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್‌ಗಳಿಲ್ಲ.',
    noPast:
      'ನಿಮಗೆ ಯಾವುದೇ ಹಿಂದಿನ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್‌ಗಳಿಲ್ಲ.',

    anyAvailableDoctor: 'ಯಾವುದೇ ಲಭ್ಯವಿರುವ ವೈದ್ಯರು',
    generalMedicine: 'ಸಾಮಾನ್ಯ ವೈದ್ಯಕೀಯ',

    at: 'ಸಮಯ',

    failedToLoad:
      'ನಿಮ್ಮ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್‌ಗಳನ್ನು ಲೋಡ್ ಮಾಡಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
    tryAgain: 'ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ'
  }
};

// ============================================================
// COMPONENT
// ============================================================

const MyAppointments = () => {
  const { selectedLanguage } = useStore(
    (state) => state
  );

  const language = selectedLanguage || 'en';

  const t = {
    ...(translations[language] || translations.en),
    ...(appointmentTranslations[language] ||
      appointmentTranslations.en)
  };

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  // ============================================================
  // LOAD APPOINTMENTS
  // ============================================================

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      setError('');

    const response = await axios.get('/appointments/citizen');

      setAppointments(
        response.data?.data || []
      );
    } catch (err) {
      console.error(
        'Failed to load appointments:',
        err
      );

      setAppointments([]);
      setError(t.failedToLoad);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // STATUS
  // ============================================================

  const getStatusClass = (status) => {
    switch (
      String(status || '').toLowerCase()
    ) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';

      case 'confirmed':
        return 'bg-green-100 text-green-800';

      case 'completed':
        return 'bg-blue-100 text-blue-800';

      case 'cancelled':
        return 'bg-red-100 text-red-800';

      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status) => {
    switch (
      String(status || '').toLowerCase()
    ) {
      case 'pending':
        return t.pending;

      case 'confirmed':
        return t.confirmed;

      case 'completed':
        return t.completed;

      case 'cancelled':
        return t.cancelled;

      default:
        return t.unknown;
    }
  };

  // ============================================================
  // DATE
  // ============================================================

  const formatDate = (date) => {
    if (!date) return '-';

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

  // ============================================================
  // DOCTOR NAME
  // ============================================================

  const getDoctorName = (name) => {
    if (!name) {
      return t.anyAvailableDoctor;
    }

    const cleanName = String(name).trim();

    // Prevent "Dr. Dr. Arun Kumar"
    if (
      cleanName.toLowerCase().startsWith('dr.')
    ) {
      return cleanName;
    }

    return `Dr. ${cleanName}`;
  };

  // ============================================================
  // FILTER
  // ============================================================

  const filteredAppointments =
    appointments.filter((appointment) => {

      if (filter === 'all') {
        return true;
      }

      if (filter === 'upcoming') {
        return [
          'pending',
          'confirmed'
        ].includes(
          String(
            appointment.status || ''
          ).toLowerCase()
        );
      }

      if (filter === 'past') {
        return [
          'completed',
          'cancelled'
        ].includes(
          String(
            appointment.status || ''
          ).toLowerCase()
        );
      }

      return true;
    });

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="space-y-5">

      {/* ======================================================
          HEADER
          ====================================================== */}

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>

            <h1 className="text-2xl font-bold text-gray-800">
              📅 {t.myAppointments}
            </h1>

            <p className="text-gray-500 mt-1">
              {t.viewManageAppointments}
            </p>

          </div>

          <button
            onClick={loadAppointments}
            disabled={loading}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 disabled:opacity-50"
          >
            🔄 {t.refresh}
          </button>

        </div>

        {/* FILTERS */}

        <div className="flex flex-wrap gap-2 mt-6">

          {[
            {
              value: 'all',
              label: t.all
            },
            {
              value: 'upcoming',
              label: t.upcoming
            },
            {
              value: 'past',
              label: t.past
            }
          ].map((item) => (

            <button
              key={item.value}
              onClick={() =>
                setFilter(item.value)
              }
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                filter === item.value
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {item.label}
            </button>

          ))}

        </div>

      </div>

      {/* ======================================================
          ERROR
          ====================================================== */}

      {error && (

        <div className="bg-red-50 border border-red-200 rounded-xl p-5">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

            <p className="text-red-700 text-sm">
              ⚠️ {error}
            </p>

            <button
              onClick={loadAppointments}
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
            >
              {t.tryAgain}
            </button>

          </div>

        </div>

      )}

      {/* ======================================================
          LOADING
          ====================================================== */}

      {loading && (

        <div className="bg-white rounded-xl p-10 text-center border border-gray-200">

          <div className="animate-spin text-4xl mb-3">
            🔄
          </div>

          <p className="text-gray-500">
            {t.loadingAppointments}
          </p>

        </div>

      )}

      {/* ======================================================
          APPOINTMENTS
          ====================================================== */}

      {!loading &&
        filteredAppointments.length > 0 && (

          <div className="space-y-4">

            {filteredAppointments.map(
              (appointment) => (

                <div
                  key={appointment.id}
                  className="bg-white rounded-xl p-5 shadow-sm border border-gray-200"
                >

                  {/* TOP */}

                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">

                    <div className="flex items-start gap-4">

                      {/* ICON */}

                      <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">

                        <span className="text-2xl">
                          📅
                        </span>

                      </div>

                      {/* DETAILS */}

                      <div className="min-w-0">

                        <h2 className="font-bold text-lg text-gray-800">
                          {appointment.facility_name ||
                            t.facility}
                        </h2>

                        <p className="text-sm text-gray-500 mt-2">
                          👨‍⚕️{' '}
                          {getDoctorName(
                            appointment.doctor_name
                          )}
                        </p>

                        <p className="text-sm text-gray-500 mt-1">
                          🩺{' '}
                          {appointment.department ||
                            t.generalMedicine}
                        </p>

                        <p className="text-sm text-gray-500 mt-1">
                          📅{' '}
                          {formatDate(
                            appointment.appointment_date
                          )}
                          {' '}
                          {t.at}
                          {' '}
                          {appointment.appointment_time ||
                            '-'}
                        </p>

                      </div>

                    </div>

                    {/* STATUS */}

                    <span
                      className={`inline-flex self-start px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                        appointment.status
                      )}`}
                    >
                      {getStatusText(
                        appointment.status
                      )}
                    </span>

                  </div>

                  {/* APPOINTMENT ID */}

                  <div className="mt-4 pt-4 border-t border-gray-100">

                    <p className="text-xs text-gray-400">

                      {t.appointmentId}:

                      <span className="ml-1 font-medium text-gray-600">

                        {appointment.appointment_id ||
                          appointment.id}

                      </span>

                    </p>

                  </div>

                  {/* NOTES */}

                  {appointment.notes && (

                    <div className="mt-3">

                      <p className="text-xs text-gray-400">
                        {t.notes}
                      </p>

                      <p className="text-sm text-gray-700 mt-1">
                        {appointment.notes}
                      </p>

                    </div>

                  )}

                </div>

              )
            )}

          </div>

        )}

      {/* ======================================================
          EMPTY
          ====================================================== */}

      {!loading &&
        filteredAppointments.length === 0 && (

          <div className="bg-white rounded-xl p-10 text-center border border-gray-200">

            <div className="text-5xl mb-4">
              📅
            </div>

            <h2 className="text-lg font-semibold text-gray-800">
              {filter === 'upcoming'
                ? t.noUpcoming
                : filter === 'past'
                ? t.noPast
                : t.noAppointments}
            </h2>

            <p className="text-gray-500 text-sm mt-2">
              {filter === 'all' &&
                t.noAppointmentsMessage}
            </p>

            {filter === 'all' && (

             <Link
  to="/book-appointment"
  className="inline-block mt-4 px-5 py-2.5 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600"
>
  📅 {t.bookAppointment}
</Link>

            )}

          </div>

        )}

    </div>
  );
};

export default MyAppointments;