import React from 'react';
import useStore from '../store/useStore';

const SettingsPage = () => {
  const { user, selectedLanguage, setLanguage } = useStore();

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">

        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          ⚙️ Settings
        </h1>

        {/* Profile */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Profile
          </h2>

          <div className="bg-gray-50 rounded-lg p-4 space-y-2">

            <div className="flex justify-between">
              <span className="text-gray-500">
                Name
              </span>

              <span className="font-medium">
                {user?.name || 'N/A'}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">
                Phone
              </span>

              <span className="font-medium">
                {user?.phone || 'N/A'}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">
                Role
              </span>

              <span className="font-medium capitalize">
                {user?.role?.replace('_', ' ') || 'N/A'}
              </span>
            </div>

          </div>
        </div>

        {/* Language */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Language
          </h2>

          <div className="flex space-x-3">
            {[
              { code: 'en', label: 'English' },
              { code: 'hi', label: 'हिन्दी' },
              { code: 'kn', label: 'ಕನ್ನಡ' }
            ].map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`px-4 py-2 rounded-lg border ${
                  selectedLanguage === lang.code
                    ? 'bg-primary-500 text-white border-primary-500'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Offline Mode */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Offline Mode
          </h2>

          <p className="text-sm text-gray-500 mb-3">
            SwasthyaSetu supports offline access. Your data will be cached
            automatically and synced when you're back online.
          </p>

          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <p className="text-sm text-blue-800">
              ✅ Service Worker Active - App can work offline
            </p>
          </div>
        </div>

        {/* About */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            About
          </h2>

          <p className="text-sm text-gray-500">
            SwasthyaSetu - Rural Healthcare Access Platform
            <br />
            Version 1.0.0
          </p>
        </div>

      </div>
    </div>
  );
};

export default SettingsPage;