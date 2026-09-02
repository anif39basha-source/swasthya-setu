import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../services/api';
import LeafletMap from '../components/LeafletMap';
import useStore from '../store/useStore';
import translations from '../translations';

const HealthcareFinder = () => {
  const { selectedLanguage } = useStore();
  const t = translations[selectedLanguage] || translations.en;

  const [facilities, setFacilities] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [viewMode, setViewMode] = useState('list');
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFacilities();
    getUserLocation();
  }, []);

  useEffect(() => {
    filterFacilities();
  }, [facilities, search, typeFilter]);

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setUserLocation(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
      },
      () => setUserLocation(null),
      { timeout: 5000 }
    );
  };

  const loadFacilities = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (typeFilter) {
        params.append('type', typeFilter);
      }

      const response = await axios.get(`/facilities?${params}`);

      setFacilities(response.data.data || []);
    } catch (error) {
      console.error('Failed to load facilities:', error);
      setFacilities([]);
    } finally {
      setLoading(false);
    }
  };

  const filterFacilities = () => {
    let filteredList = facilities;

    if (search) {
      filteredList = filteredList.filter((f) =>
        (f.name || '')
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    if (typeFilter) {
      filteredList = filteredList.filter(
        (f) => f.type === typeFilter
      );
    }

    setFiltered(filteredList);
  };

  const calculateDistance = (
    lat1,
    lng1,
    lat2,
    lng2
  ) => {
    const R = 6371;

    const dLat =
      ((lat2 - lat1) * Math.PI) / 180;

    const dLon =
      ((lng2 - lng1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;

    return (
      R *
      2 *
      Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
      )
    );
  };

  const facilitiesWithDistance = filtered
    .map((f) => {
      if (
        userLocation &&
        f.latitude !== undefined &&
        f.longitude !== undefined
      ) {
        return {
          ...f,
          distance: calculateDistance(
            userLocation.lat,
            userLocation.lng,
            parseFloat(f.latitude),
            parseFloat(f.longitude)
          )
        };
      }

      return f;
    })
    .sort(
      (a, b) =>
        (a.distance || 0) -
        (b.distance || 0)
    );

  const statusColor = (facility) => {
    if (facility.emergency_available) {
      return 'status-open';
    }

    return 'status-limited';
  };

  const typeIcon = (type) => {
    switch (type) {
      case 'PHC':
        return '🏥';

      case 'CHC':
        return '🏨';

      case 'DISTRICT_HOSPITAL':
        return '🚑';

      default:
        return '🏥';
    }
  };

  const getFacilityTypeName = (type) => {
    switch (type) {
      case 'PHC':
        return 'PHC';

      case 'CHC':
        return 'CHC';

      case 'DISTRICT_HOSPITAL':
        return selectedLanguage === 'hi'
          ? 'जिला अस्पताल'
          : selectedLanguage === 'kn'
          ? 'ಜಿಲ್ಲಾ ಆಸ್ಪತ್ರೆ'
          : 'District Hospital';

      default:
        return type || '';
    }
  };

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">

        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          🏥 {t.findHealthcare}
        </h1>

        <div className="flex flex-col md:flex-row gap-3">

          <input
            type="text"
            placeholder={
              selectedLanguage === 'hi'
                ? 'स्वास्थ्य सुविधाएँ खोजें...'
                : selectedLanguage === 'kn'
                ? 'ಆರೋಗ್ಯ ಸೌಲಭ್ಯಗಳನ್ನು ಹುಡುಕಿ...'
                : 'Search facilities...'
            }
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />

          <select
            value={typeFilter}
            onChange={(e) =>
              setTypeFilter(e.target.value)
            }
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white"
          >
            <option value="">
              {selectedLanguage === 'hi'
                ? 'सभी प्रकार'
                : selectedLanguage === 'kn'
                ? 'ಎಲ್ಲಾ ವಿಧಗಳು'
                : 'All Types'}
            </option>

            <option value="PHC">
              PHC
            </option>

            <option value="CHC">
              CHC
            </option>

            <option value="DISTRICT_HOSPITAL">
              {selectedLanguage === 'hi'
                ? 'जिला अस्पताल'
                : selectedLanguage === 'kn'
                ? 'ಜಿಲ್ಲಾ ಆಸ್ಪತ್ರೆ'
                : 'District Hospital'}
            </option>
          </select>

        </div>
      </div>


      {/* Toggle View */}
      <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-200">

        <div className="flex space-x-2">

          <button
            onClick={() =>
              setViewMode('list')
            }
            className={`flex-1 py-2 rounded-lg ${
              viewMode === 'list'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            📋{' '}
            {selectedLanguage === 'hi'
              ? 'सूची'
              : selectedLanguage === 'kn'
              ? 'ಪಟ್ಟಿ'
              : 'List'}
          </button>

          <button
            onClick={() =>
              setViewMode('map')
            }
            className={`flex-1 py-2 rounded-lg ${
              viewMode === 'map'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            🗺️{' '}
            {selectedLanguage === 'hi'
              ? 'मानचित्र'
              : selectedLanguage === 'kn'
              ? 'ನಕ್ಷೆ'
              : 'Map'}
          </button>

        </div>
      </div>


      {/* Map View */}
      {viewMode === 'map' && (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">

          <div className="map-container">

            <LeafletMap
              facilities={facilitiesWithDistance}
              userLocation={userLocation}
              height="500px"
            />

          </div>
        </div>
      )}


      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-3">

          {loading ? (

            <div className="bg-white rounded-xl p-8 text-center">

              <div className="animate-spin text-4xl mb-2">
                🔄
              </div>

              <p className="text-gray-500">
                {selectedLanguage === 'hi'
                  ? 'स्वास्थ्य सुविधाएँ लोड हो रही हैं...'
                  : selectedLanguage === 'kn'
                  ? 'ಆರೋಗ್ಯ ಸೌಲಭ್ಯಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...'
                  : 'Loading facilities...'}
              </p>

            </div>

          ) : facilitiesWithDistance.length > 0 ? (

            facilitiesWithDistance.map(
              (facility) => (

                <div
                  key={facility.id}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >

                  {/* Facility Header */}
                  <div className="flex items-start justify-between mb-3">

                    <div className="flex items-center space-x-3">

                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-2xl">
                        {typeIcon(facility.type)}
                      </div>

                      <div>

                        <h3 className="font-bold text-gray-800">
                          {facility.name}
                        </h3>

                        <p className="text-sm text-gray-500">
                          {getFacilityTypeName(
                            facility.type
                          )}
                        </p>

                      </div>
                    </div>

                    <span
                      className={`status-badge ${statusColor(
                        facility
                      )}`}
                    >
                      {facility.emergency_available
                        ? t.open
                        : selectedLanguage === 'hi'
                        ? 'सीमित'
                        : selectedLanguage === 'kn'
                        ? 'ಸೀಮಿತ'
                        : 'Limited'}
                    </span>

                  </div>


                  {/* Details */}
                  <div className="grid grid-cols-2 gap-2 mb-3 text-sm">

                    <div>

                      <span className="text-gray-500">
                        {selectedLanguage === 'hi'
                          ? 'दूरी:'
                          : selectedLanguage === 'kn'
                          ? 'ದೂರ:'
                          : 'Distance:'}
                      </span>

                      <span className="ml-1 font-medium">
                        {facility.distance
                          ? `${facility.distance.toFixed(
                              1
                            )} km`
                          : 'N/A'}
                      </span>

                    </div>

                    <div>

                      <span className="text-gray-500">
                        {selectedLanguage === 'hi'
                          ? 'पता:'
                          : selectedLanguage === 'kn'
                          ? 'ವಿಳಾಸ:'
                          : 'Address:'}
                      </span>

                      <span className="ml-1 font-medium">
                        {facility.address ||
                          'N/A'}
                      </span>

                    </div>

                  </div>


                  {/* Buttons */}
                  <div className="flex flex-col md:flex-row gap-2">

                    <Link
                      to={`/facility/${facility.id}`}
                      className="flex-1 text-center bg-primary-50 text-primary-700 py-2 rounded-lg text-sm font-medium hover:bg-primary-100 transition-colors"
                    >
                      {selectedLanguage === 'hi'
                        ? 'विवरण देखें'
                        : selectedLanguage === 'kn'
                        ? 'ವಿವರಗಳನ್ನು ವೀಕ್ಷಿಸಿ'
                        : 'View Details'}
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        if (
                          facility.latitude &&
                          facility.longitude
                        ) {
                          window.open(
                            `https://www.google.com/maps/dir/?api=1&destination=${facility.latitude},${facility.longitude}`,
                            '_blank'
                          );
                        }
                      }}
                      className="flex-1 bg-green-50 text-green-700 py-2 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors"
                    >
                      📍{' '}
                      {selectedLanguage === 'hi'
                        ? 'दिशा-निर्देश'
                        : selectedLanguage === 'kn'
                        ? 'ದಿಕ್ಕುಗಳನ್ನು ಪಡೆಯಿರಿ'
                        : 'Get Directions'}
                    </button>

                    <Link
                      to={`/book-appointment?facility=${facility.id}`}
                      className="flex-1 text-center bg-blue-50 text-blue-700 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                    >
                      📅{' '}
                      {t.bookAppointment}
                    </Link>

                  </div>

                </div>

              )
            )

          ) : (

            <div className="bg-white rounded-xl p-8 text-center border border-gray-200">

              <div className="text-4xl mb-2">
                🔍
              </div>

              <p className="text-gray-500">
                {selectedLanguage === 'hi'
                  ? 'आपकी खोज के अनुसार कोई स्वास्थ्य सुविधा नहीं मिली'
                  : selectedLanguage === 'kn'
                  ? 'ನಿಮ್ಮ ಹುಡುಕಾಟಕ್ಕೆ ಹೊಂದುವ ಯಾವುದೇ ಆರೋಗ್ಯ ಸೌಲಭ್ಯಗಳು ಕಂಡುಬಂದಿಲ್ಲ'
                  : 'No facilities found matching your criteria'}
              </p>

            </div>

          )}

        </div>
      )}

    </div>
  );
};

export default HealthcareFinder;