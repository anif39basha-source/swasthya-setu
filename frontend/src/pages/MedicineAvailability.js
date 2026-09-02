import React, { useState, useEffect } from 'react';
import axios from '../services/api';
import useStore from '../store/useStore';

const MedicineAvailability = () => {
  const { selectedLanguage } = useStore();

  const [medicines, setMedicines] = useState([]);
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');

  const lang = selectedLanguage || 'en';

  const text = {
    en: {
      title: 'Medicine Availability',
      description:
        'Search for medicine availability across nearby healthcare facilities.',
      searchPlaceholder:
        'Search medicine (e.g., Paracetamol, ORS, Azithromycin)...',
      search: 'Search',
      searching: 'Searching...',
      all: 'All',
      available: 'Available',
      lowStock: 'Low Stock',
      out: 'Out of Stock',
      quickSearch: 'Quick Search - Common Medicines',
      loading: 'Searching for',
      resultsFor: 'Results for',
      facilities: 'facilities',
      noFilterResults:
        'No facilities match this stock filter.',
      noResults: 'No results found for',
      trySearching:
        'Try searching for Paracetamol, ORS, Amoxicillin or another medicine.',
      stock: 'Stock:',
      units: 'units',
      notAvailable: 'Not available',
      address: 'Address:',
      addressUnavailable: 'Address unavailable',
      distanceUnavailable: 'Distance unavailable',
      healthcareFacility: 'Healthcare Facility',
      healthcare: 'Healthcare facility'
    },

    hi: {
      title: 'दवाइयों की उपलब्धता',
      description:
        'आस-पास की स्वास्थ्य सुविधाओं में दवाइयों की उपलब्धता खोजें।',
      searchPlaceholder:
        'दवा खोजें (जैसे पैरासिटामोल, ORS, एज़िथ्रोमाइसिन)...',
      search: 'खोजें',
      searching: 'खोजा जा रहा है...',
      all: 'सभी',
      available: 'उपलब्ध',
      lowStock: 'कम स्टॉक',
      out: 'स्टॉक खत्म',
      quickSearch: 'त्वरित खोज - सामान्य दवाइयाँ',
      loading: 'खोजा जा रहा है',
      resultsFor: 'परिणाम',
      facilities: 'सुविधाएँ',
      noFilterResults:
        'इस स्टॉक फ़िल्टर से कोई सुविधा नहीं मिली।',
      noResults: 'के लिए कोई परिणाम नहीं मिला',
      trySearching:
        'पैरासिटामोल, ORS, एमोक्सिसिलिन या कोई अन्य दवा खोजें।',
      stock: 'स्टॉक:',
      units: 'इकाइयाँ',
      notAvailable: 'उपलब्ध नहीं',
      address: 'पता:',
      addressUnavailable: 'पता उपलब्ध नहीं',
      distanceUnavailable: 'दूरी उपलब्ध नहीं',
      healthcareFacility: 'स्वास्थ्य सुविधा',
      healthcare: 'स्वास्थ्य सुविधा'
    },

    kn: {
      title: 'ಔಷಧಿಗಳ ಲಭ್ಯತೆ',
      description:
        'ನಿಮ್ಮ ಹತ್ತಿರದ ಆರೋಗ್ಯ ಕೇಂದ್ರಗಳಲ್ಲಿ ಔಷಧಿಗಳ ಲಭ್ಯತೆಯನ್ನು ಹುಡುಕಿ.',
      searchPlaceholder:
        'ಔಷಧಿಯನ್ನು ಹುಡುಕಿ (ಉದಾ: ಪ್ಯಾರಾಸಿಟಮಾಲ್, ORS, ಅಜಿಥ್ರೋಮೈಸಿನ್)...',
      search: 'ಹುಡುಕಿ',
      searching: 'ಹುಡುಕಲಾಗುತ್ತಿದೆ...',
      all: 'ಎಲ್ಲಾ',
      available: 'ಲಭ್ಯವಿದೆ',
      lowStock: 'ಕಡಿಮೆ ಸ್ಟಾಕ್',
      out: 'ಸ್ಟಾಕ್ ಮುಗಿದಿದೆ',
      quickSearch: 'ತ್ವರಿತ ಹುಡುಕಾಟ - ಸಾಮಾನ್ಯ ಔಷಧಿಗಳು',
      loading: 'ಹುಡುಕಲಾಗುತ್ತಿದೆ',
      resultsFor: 'ಫಲಿತಾಂಶಗಳು',
      facilities: 'ಸೌಲಭ್ಯಗಳು',
      noFilterResults:
        'ಈ ಸ್ಟಾಕ್ ಫಿಲ್ಟರ್‌ಗೆ ಯಾವುದೇ ಸೌಲಭ್ಯಗಳು ಕಂಡುಬಂದಿಲ್ಲ.',
      noResults: 'ಗೆ ಯಾವುದೇ ಫಲಿತಾಂಶಗಳು ಕಂಡುಬಂದಿಲ್ಲ',
      trySearching:
        'ಪ್ಯಾರಾಸಿಟಮಾಲ್, ORS, ಅಮೋಕ್ಸಿಸಿಲಿನ್ ಅಥವಾ ಬೇರೆ ಔಷಧಿಯನ್ನು ಹುಡುಕಿ.',
      stock: 'ಸ್ಟಾಕ್:',
      units: 'ಘಟಕಗಳು',
      notAvailable: 'ಲಭ್ಯವಿಲ್ಲ',
      address: 'ವಿಳಾಸ:',
      addressUnavailable: 'ವಿಳಾಸ ಲಭ್ಯವಿಲ್ಲ',
      distanceUnavailable: 'ದೂರ ಲಭ್ಯವಿಲ್ಲ',
      healthcareFacility: 'ಆರೋಗ್ಯ ಸೌಲಭ್ಯ',
      healthcare: 'ಆರೋಗ್ಯ ಸೌಲಭ್ಯ'
    }
  };

  const t = text[lang] || text.en;

  useEffect(() => {
    loadMedicines();
  }, []);

  const loadMedicines = async () => {
    try {
      const response = await axios.get('/medicines');
      setMedicines(response.data.data || []);
    } catch (error) {
      console.error('Failed to load medicines:', error);
      setMedicines([]);
    }
  };

  const searchMedicine = async (medicineName) => {
    const medicine = String(
      typeof medicineName === 'string'
        ? medicineName
        : search || ''
    ).trim();

    if (!medicine) {
      setResults([]);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.get(
        `/medicines/search?name=${encodeURIComponent(medicine)}`
      );

      setResults(response.data.data || []);
      setSearch(medicine);
    } catch (error) {
      console.error('Medicine search failed:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredResults = results.filter((item) => {
    if (filter === 'available') {
      return item.status === 'available';
    }

    if (filter === 'low') {
      return item.status === 'low_stock';
    }

    if (filter === 'out') {
      return item.status === 'out_of_stock';
    }

    return true;
  });

  const statusColor = (status) => {
    switch (status) {
      case 'available':
        return 'status-open';

      case 'low_stock':
        return 'status-limited';

      case 'out_of_stock':
        return 'status-closed';

      default:
        return 'status-closed';
    }
  };

  const statusLabel = (status) => {
    switch (status) {
      case 'available':
        return `✅ ${t.available}`;

      case 'low_stock':
        return `⚠️ ${t.lowStock}`;

      case 'out_of_stock':
        return `❌ ${t.out}`;

      default:
        return status || 'Unknown';
    }
  };

  const commonMedicines = [
    'Paracetamol',
    'ORS',
    'Azithromycin',
    'Ceftriaxone',
    'Insulin',
    'Metformin',
    'Amoxicillin',
    'Ibuprofen'
  ];

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          💊 {t.title}
        </h1>

        <p className="text-gray-600 mb-5">
          {t.description}
        </p>

        {/* Search */}
        <div className="flex flex-col md:flex-row gap-3 mb-4">

          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                searchMedicine();
              }
            }}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />

          <button
            onClick={() => searchMedicine()}
            disabled={loading}
            className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
          >
            {loading
              ? `🔄 ${t.searching}`
              : `🔍 ${t.search}`}
          </button>

        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">

          {['all', 'available', 'low', 'out'].map((f) => (

            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full text-sm ${
                filter === f
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f === 'all'
                ? t.all
                : f === 'available'
                ? `✅ ${t.available}`
                : f === 'low'
                ? `⚠️ ${t.lowStock}`
                : `❌ ${t.out}`}
            </button>

          ))}

        </div>
      </div>


      {/* Quick Search */}
      {results.length === 0 && !loading && (

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">

          <h3 className="font-bold text-gray-800 mb-4">
            {t.quickSearch}
          </h3>

          <div className="flex flex-wrap gap-2">

            {commonMedicines.map((med) => (

              <button
                key={med}
                onClick={() => {
                  setSearch(med);
                  searchMedicine(med);
                }}
                className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 text-sm"
              >
                {med}
              </button>

            ))}

          </div>

        </div>
      )}


      {/* Loading */}
      {loading && (

        <div className="bg-white rounded-xl p-8 text-center border border-gray-200">

          <div className="animate-spin text-4xl mb-2">
            🔄
          </div>

          <p className="text-gray-500">
            {t.loading} {search}...
          </p>

        </div>

      )}


      {/* Results */}
      {!loading && results.length > 0 && (

        <div className="space-y-3">

          <h2 className="text-xl font-bold text-gray-800">
            {t.resultsFor} "{search}" ({filteredResults.length}{' '}
            {t.facilities})
          </h2>

          {filteredResults.length === 0 ? (

            <div className="bg-white rounded-xl p-8 text-center border border-gray-200">

              <div className="text-4xl mb-2">
                🔍
              </div>

              <p className="text-gray-500">
                {t.noFilterResults}
              </p>

            </div>

          ) : (

            filteredResults.map((item, idx) => (

              <div
                key={item.id || idx}
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-200"
              >

                <div className="flex items-start justify-between mb-3">

                  <div>

                    <h3 className="font-bold text-gray-800 text-lg">
                      {item.facility_name ||
                        t.healthcareFacility}
                    </h3>

                    <p className="text-sm text-gray-500">

                      {item.type
                        ? item.type.replace(
                            /_/g,
                            ' '
                          )
                        : t.healthcare}

                      {' • '}

                      {item.distance != null
                        ? `${Number(
                            item.distance
                          ).toFixed(1)} km`
                        : t.distanceUnavailable}

                    </p>

                  </div>

                  <span
                    className={`status-badge ${statusColor(
                      item.status
                    )}`}
                  >
                    {statusLabel(item.status)}
                  </span>

                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">

                  <div>

                    <span className="text-gray-500">
                      {t.stock}
                    </span>

                    <span className="ml-1 font-medium">
                      {item.quantity != null
                        ? `${item.quantity} ${t.units}`
                        : t.notAvailable}
                    </span>

                  </div>


                  <div>

                    <span className="text-gray-500">
                      {t.address}
                    </span>

                    <span className="ml-1 font-medium">
                      {item.address ||
                        t.addressUnavailable}
                    </span>

                  </div>

                </div>

              </div>

            ))

          )}

        </div>

      )}


      {/* No Search Results */}
      {!loading &&
        search.trim() &&
        results.length === 0 && (

          <div className="bg-white rounded-xl p-8 text-center border border-gray-200">

            <div className="text-4xl mb-2">
              🔍
            </div>

            <p className="text-gray-500">
              {t.noResults} "{search}"
            </p>

            <p className="text-sm text-gray-400 mt-2">
              {t.trySearching}
            </p>

          </div>

        )}

    </div>
  );
};

export default MedicineAvailability;