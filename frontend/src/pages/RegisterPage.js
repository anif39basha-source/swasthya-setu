import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import toast from 'react-hot-toast';

const translations = {
  en: {
    title: 'SwasthyaSetu',
    heading: 'Create your account',
    subtitle: 'Access healthcare services from one platform',
    language: 'Language',

    fullName: 'Full Name',
    namePlaceholder: 'Enter your full name',

    phone: 'Phone Number',
    phonePlaceholder: 'Enter your phone number',

    email: 'Email',
    optional: 'Optional',
    emailPlaceholder: 'Enter your email',

    password: 'Password',
    passwordPlaceholder: 'Minimum 6 characters',

    confirmPassword: 'Confirm Password',
    confirmPasswordPlaceholder: 'Enter your password again',

    accountType: 'Account Type',
    citizen: 'Citizen / Patient',
    healthWorker: 'Health Worker / ASHA',

    createAccount: 'Create Account',
    creatingAccount: 'Creating account...',

    alreadyAccount: 'Already have an account?',
    signIn: 'Sign in',

    backHome: '← Back to home',

    enterName: 'Please enter your name',
    enterPhone: 'Please enter your phone number',
    passwordLength: 'Password must be at least 6 characters',
    passwordMismatch: 'Passwords do not match',

    registrationSuccess: 'Registration successful!',
    registrationFailed: 'Registration failed'
  },

  hi: {
    title: 'स्वास्थ्यसेतु',
    heading: 'अपना खाता बनाएं',
    subtitle: 'एक ही प्लेटफॉर्म से स्वास्थ्य सेवाओं तक पहुंचें',
    language: 'भाषा',

    fullName: 'पूरा नाम',
    namePlaceholder: 'अपना पूरा नाम दर्ज करें',

    phone: 'फ़ोन नंबर',
    phonePlaceholder: 'अपना फ़ोन नंबर दर्ज करें',

    email: 'ईमेल',
    optional: 'वैकल्पिक',
    emailPlaceholder: 'अपना ईमेल दर्ज करें',

    password: 'पासवर्ड',
    passwordPlaceholder: 'कम से कम 6 अक्षर',

    confirmPassword: 'पासवर्ड की पुष्टि करें',
    confirmPasswordPlaceholder: 'अपना पासवर्ड दोबारा दर्ज करें',

    accountType: 'खाता प्रकार',
    citizen: 'नागरिक / रोगी',
    healthWorker: 'स्वास्थ्य कार्यकर्ता / आशा',

    createAccount: 'खाता बनाएं',
    creatingAccount: 'खाता बनाया जा रहा है...',

    alreadyAccount: 'क्या आपका पहले से खाता है?',
    signIn: 'साइन इन करें',

    backHome: '← होम पर वापस जाएं',

    enterName: 'कृपया अपना नाम दर्ज करें',
    enterPhone: 'कृपया अपना फ़ोन नंबर दर्ज करें',
    passwordLength: 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए',
    passwordMismatch: 'पासवर्ड मेल नहीं खाते',

    registrationSuccess: 'पंजीकरण सफल हुआ!',
    registrationFailed: 'पंजीकरण विफल हुआ'
  },

  kn: {
    title: 'ಸ್ವಾಸ್ಥ್ಯಸೇತು',
    heading: 'ನಿಮ್ಮ ಖಾತೆಯನ್ನು ರಚಿಸಿ',
    subtitle: 'ಒಂದೇ ವೇದಿಕೆಯಿಂದ ಆರೋಗ್ಯ ಸೇವೆಗಳನ್ನು ಪಡೆಯಿರಿ',
    language: 'ಭಾಷೆ',

    fullName: 'ಪೂರ್ಣ ಹೆಸರು',
    namePlaceholder: 'ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರನ್ನು ನಮೂದಿಸಿ',

    phone: 'ಫೋನ್ ಸಂಖ್ಯೆ',
    phonePlaceholder: 'ನಿಮ್ಮ ಫೋನ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ',

    email: 'ಇಮೇಲ್',
    optional: 'ಐಚ್ಛಿಕ',
    emailPlaceholder: 'ನಿಮ್ಮ ಇಮೇಲ್ ನಮೂದಿಸಿ',

    password: 'ಪಾಸ್‌ವರ್ಡ್',
    passwordPlaceholder: 'ಕನಿಷ್ಠ 6 ಅಕ್ಷರಗಳು',

    confirmPassword: 'ಪಾಸ್‌ವರ್ಡ್ ದೃಢೀಕರಿಸಿ',
    confirmPasswordPlaceholder: 'ನಿಮ್ಮ ಪಾಸ್‌ವರ್ಡ್ ಅನ್ನು ಮತ್ತೆ ನಮೂದಿಸಿ',

    accountType: 'ಖಾತೆಯ ಪ್ರಕಾರ',
    citizen: 'ನಾಗರಿಕ / ರೋಗಿ',
    healthWorker: 'ಆರೋಗ್ಯ ಕಾರ್ಯಕರ್ತ / ಆಶಾ',

    createAccount: 'ಖಾತೆ ರಚಿಸಿ',
    creatingAccount: 'ಖಾತೆ ರಚಿಸಲಾಗುತ್ತಿದೆ...',

    alreadyAccount: 'ಈಗಾಗಲೇ ಖಾತೆ ಇದೆಯೇ?',
    signIn: 'ಸೈನ್ ಇನ್',

    backHome: '← ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ',

    enterName: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಹೆಸರನ್ನು ನಮೂದಿಸಿ',
    enterPhone: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಫೋನ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ',
    passwordLength: 'ಪಾಸ್‌ವರ್ಡ್ ಕನಿಷ್ಠ 6 ಅಕ್ಷರಗಳಿರಬೇಕು',
    passwordMismatch: 'ಪಾಸ್‌ವರ್ಡ್‌ಗಳು ಹೊಂದಿಕೆಯಾಗುತ್ತಿಲ್ಲ',

    registrationSuccess: 'ನೋಂದಣಿ ಯಶಸ್ವಿಯಾಗಿದೆ!',
    registrationFailed: 'ನೋಂದಣಿ ವಿಫಲವಾಗಿದೆ'
  }
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useStore();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'citizen'
  });

  const [loading, setLoading] = useState(false);

  // Use the language selected on Login/Home page
  const [language, setLanguage] = useState(
    localStorage.getItem('language') || 'en'
  );

  const t = translations[language];

  const updateField = (field, value) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value
    }));
  };

  const handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;

    setLanguage(selectedLanguage);

    localStorage.setItem(
      'language',
      selectedLanguage
    );
  };

  const getErrorMessage = (error) => {
    if (!error) {
      return t.registrationFailed;
    }

    if (typeof error === 'string') {
      return error;
    }

    if (Array.isArray(error)) {
      return error
        .map((item) => {
          if (typeof item === 'string') {
            return item;
          }

          if (item?.msg) {
            return item.msg;
          }

          if (item?.message) {
            return item.message;
          }

          return JSON.stringify(item);
        })
        .join(', ');
    }

    if (typeof error === 'object') {
      if (typeof error.message === 'string') {
        return error.message;
      }

      if (typeof error.msg === 'string') {
        return error.msg;
      }

      if (error.detail) {
        if (typeof error.detail === 'string') {
          return error.detail;
        }

        if (Array.isArray(error.detail)) {
          return error.detail
            .map((item) => item?.msg || String(item))
            .join(', ');
        }

        if (typeof error.detail === 'object') {
          return JSON.stringify(error.detail);
        }
      }

      try {
        return JSON.stringify(error);
      } catch {
        return t.registrationFailed;
      }
    }

    return String(error);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast.error(t.enterName);
      return;
    }

    if (!formData.phone.trim()) {
      toast.error(t.enterPhone);
      return;
    }

    if (formData.password.length < 6) {
      toast.error(t.passwordLength);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error(t.passwordMismatch);
      return;
    }

    setLoading(true);

    try {
      const result = await register({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || null,
        password: formData.password,
        role: formData.role,

        // Send selected language to backend
        language: language
      });

      if (result?.success) {
        toast.success(t.registrationSuccess);

        navigate('/', {
          replace: true
        });
      } else {
        const message = getErrorMessage(
          result?.error
        );

        console.error(
          'Registration failed:',
          result?.error
        );

        toast.error(message);
      }
    } catch (error) {
      console.error(
        'Unexpected registration error:',
        error
      );

      toast.error(
        getErrorMessage(error)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">

      <div className="w-full max-w-md">

        {/* ================= HEADER ================= */}
        <div className="text-center mb-6">

          {/* Brand */}
          <Link
            to="/"
            className="inline-flex items-center justify-center mb-4"
          >
            <span className="text-3xl font-bold text-gray-900">
              {t.title}
            </span>
          </Link>

          {/* Language Selector */}
          <div className="flex justify-center mb-5">

            <div className="flex items-center gap-2">

              <span className="text-sm text-gray-500">
                {t.language}:
              </span>

              <select
                value={language}
                onChange={handleLanguageChange}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="en">
                  English
                </option>

                <option value="hi">
                  हिन्दी
                </option>

                <option value="kn">
                  ಕನ್ನಡ
                </option>
              </select>

            </div>

          </div>

          {/* Heading */}
          <h1 className="text-2xl font-bold text-gray-900">
            {t.heading}
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            {t.subtitle}
          </p>

        </div>


        {/* ================= REGISTRATION CARD ================= */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            {/* Full Name */}
            <div>

              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                {t.fullName}
              </label>

              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(event) =>
                  updateField(
                    'name',
                    event.target.value
                  )
                }
                placeholder={t.namePlaceholder}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />

            </div>


            {/* Phone */}
            <div>

              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                {t.phone}
              </label>

              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(event) =>
                  updateField(
                    'phone',
                    event.target.value
                  )
                }
                placeholder={t.phonePlaceholder}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />

            </div>


            {/* Email */}
            <div>

              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                {t.email}

                <span className="text-gray-400 font-normal">
                  {' '}({t.optional})
                </span>
              </label>

              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(event) =>
                  updateField(
                    'email',
                    event.target.value
                  )
                }
                placeholder={t.emailPlaceholder}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />

            </div>


            {/* Password */}
            <div>

              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                {t.password}
              </label>

              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(event) =>
                  updateField(
                    'password',
                    event.target.value
                  )
                }
                placeholder={t.passwordPlaceholder}
                minLength={6}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />

            </div>


            {/* Confirm Password */}
            <div>

              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                {t.confirmPassword}
              </label>

              <input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(event) =>
                  updateField(
                    'confirmPassword',
                    event.target.value
                  )
                }
                placeholder={
                  t.confirmPasswordPlaceholder
                }
                minLength={6}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />

            </div>


            {/* Account Type */}
            <div>

              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                {t.accountType}
              </label>

              <select
                id="role"
                value={formData.role}
                onChange={(event) =>
                  updateField(
                    'role',
                    event.target.value
                  )
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >

                <option value="citizen">
                  {t.citizen}
                </option>

                <option value="health_worker">
                  {t.healthWorker}
                </option>

              </select>

            </div>


            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
            >
              {loading
                ? t.creatingAccount
                : t.createAccount}
            </button>

          </form>


          {/* Login */}
          <div className="mt-6 pt-5 border-t border-gray-100 text-center">

            <p className="text-sm text-gray-500">

              {t.alreadyAccount}{' '}

              <Link
                to="/login"
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                {t.signIn}
              </Link>

            </p>

          </div>

        </div>


        {/* Back Home */}
        <div className="text-center mt-5">

          <Link
            to="/"
            className="text-sm text-gray-500 hover:text-blue-600"
          >
            {t.backHome}
          </Link>

        </div>

      </div>

    </div>
  );
};

export default RegisterPage;