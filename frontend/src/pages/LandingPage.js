import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/swasthya-logo.png';

const translations = {
  en: {
    healthcareForEveryone: 'Healthcare for Everyone',
    login: 'Login',
    getStarted: 'Get Started',

    badge: 'Simple. Accessible. Connected Healthcare.',
    betterHealthcare: 'Better Healthcare,',
    closerToYou: 'Closer to You',
    heroDescription:
      'Find nearby government healthcare facilities, check available services, access medicines, book appointments and manage your healthcare — all from one simple platform.',
    findHealthcare: 'Find Healthcare',
    createAccount: 'Create Account',

    ourServices: 'Our Services',
    everythingYouNeed: 'Everything You Need for Healthcare',
    servicesDescription:
      'Access important healthcare services from one convenient platform.',

    findHealthcareTitle: 'Find Healthcare',
    findHealthcareDescription:
      'Find nearby PHCs, CHCs and hospitals with facility and availability information.',
    findFacility: 'Find a facility →',

    healthAssistant: 'Health Assistant',
    healthAssistantDescription:
      'Get general health guidance and understand which level of care may be appropriate.',
    talkAssistant: 'Talk to Assistant →',

    appointments: 'Book Appointments',
    appointmentsDescription:
      'Book and manage appointments with healthcare professionals at government facilities.',
    bookAppointment: 'Book an appointment →',

    medicine: 'Medicine Availability',
    medicineDescription:
      'Search medicines and check their availability through the healthcare platform.',

    referrals: 'Referrals',
    referralsDescription:
      'Manage healthcare referrals and help patients move between appropriate levels of care.',

    emergency: 'Emergency Support',
    emergencyDescription:
      'Quickly locate nearby healthcare facilities when urgent medical assistance is needed.',
    emergencyLink: 'Emergency →',

    simpleProcess: 'Simple Process',
    howWorks: 'How SwasthyaSetu Works',

    step1Title: 'Create an Account',
    step1Description:
      'Register as a citizen and securely access healthcare services.',

    step2Title: 'Find the Right Service',
    step2Description:
      'Search facilities, medicines, appointments and healthcare information.',

    step3Title: 'Get Healthcare',
    step3Description:
      'Connect with healthcare workers and facilities when you need them.',

    facilities: 'Healthcare Facilities',
    patients: 'Patients Served',
    appointmentsStat: 'Appointments',

    ready: 'Ready to access better healthcare?',
    readyDescription:
      'Create your account and start using SwasthyaSetu today.',

    footerDescription:
      'Connecting communities to better healthcare.'
  },

  hi: {
    healthcareForEveryone: 'सभी के लिए स्वास्थ्य सेवा',
    login: 'लॉगिन',
    getStarted: 'शुरू करें',

    badge: 'सरल। सुलभ। जुड़ी हुई स्वास्थ्य सेवा।',
    betterHealthcare: 'बेहतर स्वास्थ्य सेवा,',
    closerToYou: 'आपके करीब',
    heroDescription:
      'अपने नजदीकी सरकारी स्वास्थ्य केंद्र खोजें, उपलब्ध सेवाओं की जांच करें, दवाइयों की उपलब्धता देखें, अपॉइंटमेंट बुक करें और अपनी स्वास्थ्य सेवाओं को एक ही सरल प्लेटफॉर्म से प्रबंधित करें।',
    findHealthcare: 'स्वास्थ्य सेवा खोजें',
    createAccount: 'खाता बनाएं',

    ourServices: 'हमारी सेवाएं',
    everythingYouNeed: 'स्वास्थ्य सेवा के लिए आपको जो चाहिए',
    servicesDescription:
      'एक सुविधाजनक प्लेटफॉर्म से महत्वपूर्ण स्वास्थ्य सेवाओं का उपयोग करें।',

    findHealthcareTitle: 'स्वास्थ्य सेवा खोजें',
    findHealthcareDescription:
      'नजदीकी PHC, CHC और अस्पतालों की जानकारी तथा उपलब्धता देखें।',
    findFacility: 'स्वास्थ्य केंद्र खोजें →',

    healthAssistant: 'स्वास्थ्य सहायक',
    healthAssistantDescription:
      'सामान्य स्वास्थ्य मार्गदर्शन प्राप्त करें और समझें कि आपके लिए किस स्तर की देखभाल उपयुक्त हो सकती है।',
    talkAssistant: 'सहायक से बात करें →',

    appointments: 'अपॉइंटमेंट बुक करें',
    appointmentsDescription:
      'सरकारी स्वास्थ्य केंद्रों में स्वास्थ्य पेशेवरों के साथ अपॉइंटमेंट बुक और प्रबंधित करें।',
    bookAppointment: 'अपॉइंटमेंट बुक करें →',

    medicine: 'दवा उपलब्धता',
    medicineDescription:
      'दवाइयां खोजें और स्वास्थ्य प्लेटफॉर्म के माध्यम से उनकी उपलब्धता जांचें।',

    referrals: 'रेफरल',
    referralsDescription:
      'स्वास्थ्य रेफरल प्रबंधित करें और मरीजों को उचित स्तर की देखभाल तक पहुंचने में सहायता करें।',

    emergency: 'आपातकालीन सहायता',
    emergencyDescription:
      'तत्काल चिकित्सा सहायता की आवश्यकता होने पर नजदीकी स्वास्थ्य केंद्रों को जल्दी खोजें।',
    emergencyLink: 'आपातकाल →',

    simpleProcess: 'सरल प्रक्रिया',
    howWorks: 'SwasthyaSetu कैसे काम करता है',

    step1Title: 'खाता बनाएं',
    step1Description:
      'एक नागरिक के रूप में पंजीकरण करें और सुरक्षित रूप से स्वास्थ्य सेवाओं का उपयोग करें।',

    step2Title: 'सही सेवा खोजें',
    step2Description:
      'स्वास्थ्य केंद्र, दवाइयां, अपॉइंटमेंट और स्वास्थ्य संबंधी जानकारी खोजें।',

    step3Title: 'स्वास्थ्य सेवा प्राप्त करें',
    step3Description:
      'जरूरत पड़ने पर स्वास्थ्य कर्मचारियों और स्वास्थ्य केंद्रों से जुड़ें।',

    facilities: 'स्वास्थ्य केंद्र',
    patients: 'सेवा प्राप्त मरीज',
    appointmentsStat: 'अपॉइंटमेंट',

    ready: 'बेहतर स्वास्थ्य सेवा के लिए तैयार हैं?',
    readyDescription:
      'अपना खाता बनाएं और आज ही SwasthyaSetu का उपयोग शुरू करें।',

    footerDescription:
      'समुदायों को बेहतर स्वास्थ्य सेवा से जोड़ना।'
  },

  kn: {
    healthcareForEveryone: 'ಎಲ್ಲರಿಗೂ ಆರೋಗ್ಯ ಸೇವೆ',
    login: 'ಲಾಗಿನ್',
    getStarted: 'ಪ್ರಾರಂಭಿಸಿ',

    badge: 'ಸರಳ. ಸುಲಭ. ಸಂಪರ್ಕಿತ ಆರೋಗ್ಯ ಸೇವೆ.',
    betterHealthcare: 'ಉತ್ತಮ ಆರೋಗ್ಯ ಸೇವೆ,',
    closerToYou: 'ನಿಮ್ಮ ಹತ್ತಿರ',
    heroDescription:
      'ನಿಮ್ಮ ಹತ್ತಿರದ ಸರ್ಕಾರಿ ಆರೋಗ್ಯ ಕೇಂದ್ರಗಳನ್ನು ಹುಡುಕಿ, ಲಭ್ಯವಿರುವ ಸೇವೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ, ಔಷಧಿಗಳ ಲಭ್ಯತೆಯನ್ನು ನೋಡಿ, ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಬುಕ್ ಮಾಡಿ ಮತ್ತು ನಿಮ್ಮ ಆರೋಗ್ಯ ಸೇವೆಗಳನ್ನು ಒಂದೇ ಸರಳ ವೇದಿಕೆಯಲ್ಲಿ ನಿರ್ವಹಿಸಿ.',
    findHealthcare: 'ಆರೋಗ್ಯ ಸೇವೆ ಹುಡುಕಿ',
    createAccount: 'ಖಾತೆ ರಚಿಸಿ',

    ourServices: 'ನಮ್ಮ ಸೇವೆಗಳು',
    everythingYouNeed: 'ಆರೋಗ್ಯ ಸೇವೆಗೆ ಬೇಕಾದ ಎಲ್ಲವೂ',
    servicesDescription:
      'ಒಂದೇ ಅನುಕೂಲಕರ ವೇದಿಕೆಯಿಂದ ಪ್ರಮುಖ ಆರೋಗ್ಯ ಸೇವೆಗಳನ್ನು ಪಡೆಯಿರಿ.',

    findHealthcareTitle: 'ಆರೋಗ್ಯ ಸೇವೆ ಹುಡುಕಿ',
    findHealthcareDescription:
      'ಹತ್ತಿರದ PHC, CHC ಮತ್ತು ಆಸ್ಪತ್ರೆಗಳ ಮಾಹಿತಿ ಹಾಗೂ ಲಭ್ಯತೆಯನ್ನು ಪರಿಶೀಲಿಸಿ.',
    findFacility: 'ಆರೋಗ್ಯ ಕೇಂದ್ರ ಹುಡುಕಿ →',

    healthAssistant: 'ಆರೋಗ್ಯ ಸಹಾಯಕ',
    healthAssistantDescription:
      'ಸಾಮಾನ್ಯ ಆರೋಗ್ಯ ಮಾರ್ಗದರ್ಶನ ಪಡೆಯಿರಿ ಮತ್ತು ನಿಮಗೆ ಯಾವ ಮಟ್ಟದ ಆರೈಕೆ ಸೂಕ್ತ ಎಂಬುದನ್ನು ತಿಳಿಯಿರಿ.',
    talkAssistant: 'ಸಹಾಯಕರೊಂದಿಗೆ ಮಾತನಾಡಿ →',

    appointments: 'ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಬುಕ್ ಮಾಡಿ',
    appointmentsDescription:
      'ಸರ್ಕಾರಿ ಆರೋಗ್ಯ ಕೇಂದ್ರಗಳ ಆರೋಗ್ಯ ವೃತ್ತಿಪರರೊಂದಿಗೆ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಬುಕ್ ಮಾಡಿ ಮತ್ತು ನಿರ್ವಹಿಸಿ.',
    bookAppointment: 'ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಬುಕ್ ಮಾಡಿ →',

    medicine: 'ಔಷಧಿ ಲಭ್ಯತೆ',
    medicineDescription:
      'ಔಷಧಿಗಳನ್ನು ಹುಡುಕಿ ಮತ್ತು ಆರೋಗ್ಯ ವೇದಿಕೆಯ ಮೂಲಕ ಅವುಗಳ ಲಭ್ಯತೆಯನ್ನು ಪರಿಶೀಲಿಸಿ.',

    referrals: 'ರೆಫರಲ್‌ಗಳು',
    referralsDescription:
      'ಆರೋಗ್ಯ ರೆಫರಲ್‌ಗಳನ್ನು ನಿರ್ವಹಿಸಿ ಮತ್ತು ರೋಗಿಗಳಿಗೆ ಸೂಕ್ತ ಮಟ್ಟದ ಆರೈಕೆಯನ್ನು ಪಡೆಯಲು ಸಹಾಯ ಮಾಡಿ.',

    emergency: 'ತುರ್ತು ಸಹಾಯ',
    emergencyDescription:
      'ತುರ್ತು ವೈದ್ಯಕೀಯ ಸಹಾಯ ಅಗತ್ಯವಿದ್ದಾಗ ಹತ್ತಿರದ ಆರೋಗ್ಯ ಕೇಂದ್ರಗಳನ್ನು ತ್ವರಿತವಾಗಿ ಹುಡುಕಿ.',
    emergencyLink: 'ತುರ್ತು ಸೇವೆ →',

    simpleProcess: 'ಸರಳ ಪ್ರಕ್ರಿಯೆ',
    howWorks: 'SwasthyaSetu ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ',

    step1Title: 'ಖಾತೆ ರಚಿಸಿ',
    step1Description:
      'ನಾಗರಿಕರಾಗಿ ನೋಂದಾಯಿಸಿ ಮತ್ತು ಸುರಕ್ಷಿತವಾಗಿ ಆರೋಗ್ಯ ಸೇವೆಗಳನ್ನು ಪಡೆಯಿರಿ.',

    step2Title: 'ಸರಿಯಾದ ಸೇವೆಯನ್ನು ಹುಡುಕಿ',
    step2Description:
      'ಆರೋಗ್ಯ ಕೇಂದ್ರಗಳು, ಔಷಧಿಗಳು, ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್‌ಗಳು ಮತ್ತು ಆರೋಗ್ಯ ಮಾಹಿತಿಯನ್ನು ಹುಡುಕಿ.',

    step3Title: 'ಆರೋಗ್ಯ ಸೇವೆ ಪಡೆಯಿರಿ',
    step3Description:
      'ಅಗತ್ಯವಿದ್ದಾಗ ಆರೋಗ್ಯ ಕಾರ್ಯಕರ್ತರು ಮತ್ತು ಆರೋಗ್ಯ ಕೇಂದ್ರಗಳೊಂದಿಗೆ ಸಂಪರ್ಕ ಸಾಧಿಸಿ.',

    facilities: 'ಆರೋಗ್ಯ ಕೇಂದ್ರಗಳು',
    patients: 'ಸೇವೆ ಪಡೆದ ರೋಗಿಗಳು',
    appointmentsStat: 'ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್‌ಗಳು',

    ready: 'ಉತ್ತಮ ಆರೋಗ್ಯ ಸೇವೆ ಪಡೆಯಲು ಸಿದ್ಧರಿದ್ದೀರಾ?',
    readyDescription:
      'ನಿಮ್ಮ ಖಾತೆಯನ್ನು ರಚಿಸಿ ಮತ್ತು ಇಂದೇ SwasthyaSetu ಬಳಸಲು ಪ್ರಾರಂಭಿಸಿ.',

    footerDescription:
      'ಸಮುದಾಯಗಳನ್ನು ಉತ್ತಮ ಆರೋಗ್ಯ ಸೇವೆಯೊಂದಿಗೆ ಸಂಪರ್ಕಿಸುವುದು.'
  }
};

const LandingPage = () => {
  const [language, setLanguage] = useState(
    localStorage.getItem('language') || 'en'
  );

  const t = translations[language];

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  return (
    <div className="min-h-screen bg-white text-gray-800">

      {/* ==================== NAVIGATION ==================== */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="h-16 flex items-center justify-between">

            {/* Logo / Brand */}
            <Link
              to="/"
              className="flex items-center gap-3 group"
            >
              <div className="landing-logo-wrapper">
                <img
                  src={logo}
                  alt="SwasthyaSetu"
                  className="landing-logo"
                />
              </div>

              <div>
                <h1 className="text-xl font-bold text-gray-900 leading-tight">
                  SwasthyaSetu
                </h1>

                <p className="text-xs text-gray-500">
                  {t.healthcareForEveryone}
                </p>
              </div>
            </Link>

            {/* Navigation */}
            <div className="flex items-center gap-2 sm:gap-3">

              {/* Language Buttons */}
              <div className="hidden sm:flex items-center gap-1">

                <button
                  onClick={() => changeLanguage('en')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    language === 'en'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  English
                </button>

                <button
                  onClick={() => changeLanguage('hi')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    language === 'hi'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  हिन्दी
                </button>

                <button
                  onClick={() => changeLanguage('kn')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    language === 'kn'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  ಕನ್ನಡ
                </button>

              </div>

              <Link
                to="/login"
                className="hidden sm:block px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition"
              >
                {t.login}
              </Link>

              <Link
                to="/register"
                className="px-4 sm:px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition shadow-sm"
              >
                {t.getStarted}
              </Link>

            </div>

          </div>
        </div>
      </header>


      {/* ==================== HERO ==================== */}
      <section className="bg-gradient-to-b from-blue-50 via-white to-white">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="py-16 sm:py-20 lg:py-24 text-center">

            {/* Animated Logo */}
            <div className="flex justify-center mb-6">

              <div className="hero-logo-container">

                <div className="hero-logo-glow"></div>

                <img
                  src={logo}
                  alt="SwasthyaSetu Healthcare"
                  className="hero-logo"
                />

              </div>

            </div>


            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">

              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>

              {t.badge}

            </div>


            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">

              {t.betterHealthcare}

              <span className="block text-blue-600 mt-2">
                {t.closerToYou}
              </span>

            </h1>


            {/* Description */}
            <p className="max-w-2xl mx-auto mt-6 text-lg text-gray-600 leading-relaxed">
              {t.heroDescription}
            </p>


            {/* Main Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">

              <Link
                to="/login"
                className="px-7 py-3.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-sm"
              >
                {t.findHealthcare}
              </Link>

              <Link
                to="/register"
                className="px-7 py-3.5 rounded-lg border border-gray-300 bg-white text-gray-700 font-semibold hover:bg-gray-50 transition"
              >
                {t.createAccount}
              </Link>

            </div>

          </div>

        </div>

      </section>


      {/* ==================== SERVICES ==================== */}
      <section className="py-16 bg-white">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-12">

            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
              {t.ourServices}
            </p>

            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              {t.everythingYouNeed}
            </h2>

            <p className="mt-3 text-gray-500 max-w-xl mx-auto">
              {t.servicesDescription}
            </p>

          </div>


          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">


            {/* Find Healthcare */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 hover:shadow-lg hover:border-blue-200 transition">

              <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-2xl">
                🏥
              </div>

              <h3 className="mt-5 text-lg font-semibold text-gray-900">
                {t.findHealthcareTitle}
              </h3>

              <p className="mt-2 text-gray-600 text-sm leading-relaxed">
                {t.findHealthcareDescription}
              </p>

              <Link
                to="/login"
                className="inline-block mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                {t.findFacility}
              </Link>

            </div>


            {/* AI Assistant */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 hover:shadow-lg hover:border-green-200 transition">

              <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center text-2xl">
                💬
              </div>

              <h3 className="mt-5 text-lg font-semibold text-gray-900">
                {t.healthAssistant}
              </h3>

              <p className="mt-2 text-gray-600 text-sm leading-relaxed">
                {t.healthAssistantDescription}
              </p>

              <Link
                to="/login"
                className="inline-block mt-4 text-sm font-semibold text-green-600 hover:text-green-700"
              >
                {t.talkAssistant}
              </Link>

            </div>


            {/* Appointments */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 hover:shadow-lg hover:border-blue-200 transition">

              <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-2xl">
                📅
              </div>

              <h3 className="mt-5 text-lg font-semibold text-gray-900">
                {t.appointments}
              </h3>

              <p className="mt-2 text-gray-600 text-sm leading-relaxed">
                {t.appointmentsDescription}
              </p>

              <Link
                to="/login"
                className="inline-block mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                {t.bookAppointment}
              </Link>

            </div>


            {/* Medicine */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 hover:shadow-lg hover:border-green-200 transition">

              <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center text-2xl">
                💊
              </div>

              <h3 className="mt-5 text-lg font-semibold text-gray-900">
                {t.medicine}
              </h3>

              <p className="mt-2 text-gray-600 text-sm leading-relaxed">
                {t.medicineDescription}
              </p>

            </div>


            {/* Referrals */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 hover:shadow-lg hover:border-blue-200 transition">

              <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-2xl">
                📄
              </div>

              <h3 className="mt-5 text-lg font-semibold text-gray-900">
                {t.referrals}
              </h3>

              <p className="mt-2 text-gray-600 text-sm leading-relaxed">
                {t.referralsDescription}
              </p>

            </div>


            {/* Emergency */}
            <div className="rounded-xl border border-red-100 bg-red-50 p-6 hover:shadow-lg transition">

              <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center text-2xl">
                🚨
              </div>

              <h3 className="mt-5 text-lg font-semibold text-gray-900">
                {t.emergency}
              </h3>

              <p className="mt-2 text-gray-600 text-sm leading-relaxed">
                {t.emergencyDescription}
              </p>

              <Link
                to="/login"
                className="inline-block mt-4 text-sm font-semibold text-red-600"
              >
                {t.emergencyLink}
              </Link>

            </div>

          </div>

        </div>

      </section>


      {/* ==================== HOW IT WORKS ==================== */}
      <section className="py-16 bg-gray-50 border-y border-gray-100">

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-12">

            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
              {t.simpleProcess}
            </p>

            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              {t.howWorks}
            </h2>

          </div>


          <div className="grid md:grid-cols-3 gap-8">


            {/* Step 1 */}
            <div className="text-center">

              <div className="mx-auto w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl font-bold">
                1
              </div>

              <h3 className="mt-5 font-semibold text-gray-900">
                {t.step1Title}
              </h3>

              <p className="mt-2 text-sm text-gray-600">
                {t.step1Description}
              </p>

            </div>


            {/* Step 2 */}
            <div className="text-center">

              <div className="mx-auto w-14 h-14 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xl font-bold">
                2
              </div>

              <h3 className="mt-5 font-semibold text-gray-900">
                {t.step2Title}
              </h3>

              <p className="mt-2 text-sm text-gray-600">
                {t.step2Description}
              </p>

            </div>


            {/* Step 3 */}
            <div className="text-center">

              <div className="mx-auto w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl font-bold">
                3
              </div>

              <h3 className="mt-5 font-semibold text-gray-900">
                {t.step3Title}
              </h3>

              <p className="mt-2 text-sm text-gray-600">
                {t.step3Description}
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ==================== STATISTICS ==================== */}
      <section className="py-14 bg-white">

        <div className="max-w-5xl mx-auto px-4">

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

            <div className="text-center p-6 rounded-xl border border-gray-200 hover:shadow-md transition">

              <div className="text-3xl font-bold text-blue-600">
                50+
              </div>

              <p className="mt-2 text-gray-600">
                {t.facilities}
              </p>

            </div>


            <div className="text-center p-6 rounded-xl border border-gray-200 hover:shadow-md transition">

              <div className="text-3xl font-bold text-green-600">
                1000+
              </div>

              <p className="mt-2 text-gray-600">
                {t.patients}
              </p>

            </div>


            <div className="text-center p-6 rounded-xl border border-gray-200 hover:shadow-md transition">

              <div className="text-3xl font-bold text-blue-600">
                200+
              </div>

              <p className="mt-2 text-gray-600">
                {t.appointmentsStat}
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ==================== CTA ==================== */}
      <section className="py-16 bg-blue-600">

        <div className="max-w-4xl mx-auto px-4 text-center">

          <h2 className="text-3xl font-bold text-white">
            {t.ready}
          </h2>

          <p className="mt-3 text-blue-100">
            {t.readyDescription}
          </p>

          <div className="mt-7">

            <Link
              to="/register"
              className="inline-block px-7 py-3.5 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              {t.createAccount}
            </Link>

          </div>

        </div>

      </section>


      {/* ==================== FOOTER ==================== */}
      <footer className="bg-white border-t border-gray-200">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">

            <div className="flex items-center gap-3">

              <img
                src={logo}
                alt="SwasthyaSetu"
                className="w-10 h-10 object-contain"
              />

              <div>

                <p className="font-semibold text-gray-900">
                  SwasthyaSetu
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  {t.footerDescription}
                </p>

              </div>

            </div>

            <div className="text-sm text-gray-500">
              © {new Date().getFullYear()} SwasthyaSetu
            </div>

          </div>

        </div>

      </footer>


      {/* ==================== LOGO ANIMATION ==================== */}
      <style>{`

        .landing-logo-wrapper {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          background: #eff6ff;
          overflow: hidden;
          transition: transform 0.3s ease;
        }

        .landing-logo-wrapper:hover {
          transform: scale(1.08);
        }

        .landing-logo {
          width: 42px;
          height: 42px;
          object-fit: contain;
        }

        .hero-logo-container {
          position: relative;
          width: 170px;
          height: 170px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hero-logo {
          position: relative;
          z-index: 2;
          width: 150px;
          height: 150px;
          object-fit: contain;
          animation: logoFloat 4s ease-in-out infinite;
          filter: drop-shadow(0 12px 20px rgba(37, 99, 235, 0.15));
        }

        .hero-logo-glow {
          position: absolute;
          width: 125px;
          height: 125px;
          border-radius: 50%;
          background: rgba(37, 99, 235, 0.08);
          animation: logoGlow 3s ease-in-out infinite;
        }

        @keyframes logoFloat {

          0% {
            transform: translateY(0px);
          }

          50% {
            transform: translateY(-8px);
          }

          100% {
            transform: translateY(0px);
          }

        }

        @keyframes logoGlow {

          0% {
            transform: scale(0.9);
            opacity: 0.4;
          }

          50% {
            transform: scale(1.15);
            opacity: 0.8;
          }

          100% {
            transform: scale(0.9);
            opacity: 0.4;
          }

        }

        @media (prefers-reduced-motion: reduce) {

          .hero-logo,
          .hero-logo-glow {
            animation: none;
          }

        }

        @media (max-width: 640px) {

          .hero-logo-container {
            width: 130px;
            height: 130px;
          }

          .hero-logo {
            width: 115px;
            height: 115px;
          }

          .hero-logo-glow {
            width: 100px;
            height: 100px;
          }

        }

      `}</style>

    </div>
  );
};

export default LandingPage;