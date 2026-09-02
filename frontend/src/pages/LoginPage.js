import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import toast from 'react-hot-toast';

const translations = {
  en: {
    title: 'SwasthyaSetu',
    subtitle: 'Rural Healthcare Access Platform',
    signIn: 'Sign In',
    phone: 'Phone Number',
    phonePlaceholder: 'Enter phone number',
    password: 'Password',
    passwordPlaceholder: 'Enter password',
    signingIn: 'Signing in...',
    loginSuccess: 'Login successful!',
    loginFailed: 'Login failed',
    noAccount: "Don't have an account?",
    register: 'Register',
    language: 'Language'
  },

  hi: {
    title: 'स्वास्थ्यसेतु',
    subtitle: 'ग्रामीण स्वास्थ्य सेवा मंच',
    signIn: 'साइन इन करें',
    phone: 'फ़ोन नंबर',
    phonePlaceholder: 'फ़ोन नंबर दर्ज करें',
    password: 'पासवर्ड',
    passwordPlaceholder: 'पासवर्ड दर्ज करें',
    signingIn: 'साइन इन हो रहा है...',
    loginSuccess: 'लॉगिन सफल हुआ!',
    loginFailed: 'लॉगिन विफल हुआ',
    noAccount: 'क्या आपका खाता नहीं है?',
    register: 'रजिस्टर करें',
    language: 'भाषा'
  },

  kn: {
    title: 'ಸ್ವಾಸ್ಥ್ಯಸೇತು',
    subtitle: 'ಗ್ರಾಮೀಣ ಆರೋಗ್ಯ ಸೇವಾ ವೇದಿಕೆ',
    signIn: 'ಸೈನ್ ಇನ್',
    phone: 'ಫೋನ್ ಸಂಖ್ಯೆ',
    phonePlaceholder: 'ಫೋನ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ',
    password: 'ಪಾಸ್‌ವರ್ಡ್',
    passwordPlaceholder: 'ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ',
    signingIn: 'ಸೈನ್ ಇನ್ ಆಗುತ್ತಿದೆ...',
    loginSuccess: 'ಲಾಗಿನ್ ಯಶಸ್ವಿಯಾಗಿದೆ!',
    loginFailed: 'ಲಾಗಿನ್ ವಿಫಲವಾಗಿದೆ',
    noAccount: 'ಖಾತೆ ಇಲ್ಲವೇ?',
    register: 'ನೋಂದಣಿ ಮಾಡಿ',
    language: 'ಭಾಷೆ'
  }
};

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, setLanguage: setStoreLanguage } = useStore();

  const [formData, setFormData] = useState({
    phone: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);

  // Get previously selected language
  const [language, setLanguage] = useState(
    localStorage.getItem('language') || 'en'
  );

  const t = translations[language];

 const handleLanguageChange = (e) => {
  const selectedLanguage = e.target.value;

  setLanguage(selectedLanguage);
  setStoreLanguage(selectedLanguage);
};
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const result = await login(
        formData.phone,
        formData.password
      );

      if (result.success) {
        toast.success(t.loginSuccess);
        navigate('/');
      } else {
        toast.error(result.error || t.loginFailed);
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(t.loginFailed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">

      <div className="max-w-md w-full">

        {/* Header */}
        <div className="text-center mb-6">

          <h1 className="text-3xl font-bold text-gray-900">
            {t.title}
          </h1>

          <p className="text-gray-600 mt-1">
            {t.subtitle}
          </p>

        </div>


        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">

          {/* Language */}
          <div className="flex justify-end mb-5">

            <div className="flex items-center gap-2">

              <span className="text-sm text-gray-500">
                {t.language}:
              </span>

              <select
                value={language}
                onChange={handleLanguageChange}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
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


          {/* Title */}
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            {t.signIn}
          </h2>


          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            {/* Phone */}
            <div>

              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.phone}
              </label>

              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    phone: e.target.value
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder={t.phonePlaceholder}
                required
              />

            </div>


            {/* Password */}
            <div>

              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.password}
              </label>

              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    password: e.target.value
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder={t.passwordPlaceholder}
                required
              />

            </div>


            {/* Sign In */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-500 text-white py-3 rounded-lg font-medium hover:bg-primary-600 disabled:opacity-50"
            >
              {loading
                ? t.signingIn
                : t.signIn}
            </button>

          </form>


          {/* Register */}
          <div className="mt-6 text-center">

            <p className="text-sm text-gray-500">

              {t.noAccount}{' '}

              <Link
                to="/register"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                {t.register}
              </Link>

            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default LoginPage;