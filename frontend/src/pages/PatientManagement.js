import React, { useEffect, useMemo, useState } from 'react';
import axios from '../services/api';

const PatientManagement = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [genderFilter, setGenderFilter] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [saving, setSaving] = useState(false);

  const emptyPatient = {
    name: '',
    age: '',
    gender: 'male',
    phone: '',
    address: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    medical_history: ''
  };

  const [newPatient, setNewPatient] = useState(emptyPatient);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setLoading(true);

      const response = await axios.get('/health-worker/patients');

      setPatients(response.data.data || []);
    } catch (error) {
      console.error('Failed to load patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPatient = async (e) => {
    e.preventDefault();

    if (!newPatient.name.trim()) {
      alert('Please enter patient name.');
      return;
    }

    if (!newPatient.age || Number(newPatient.age) <= 0) {
      alert('Please enter a valid age.');
      return;
    }

    try {
      setSaving(true);

      await axios.post('/health-worker/patients', {
        ...newPatient,
        name: newPatient.name.trim(),
        age: parseInt(newPatient.age, 10)
      });

      alert('Patient registered successfully!');

      setNewPatient(emptyPatient);
      setShowAdd(false);

      await loadPatients();
    } catch (error) {
      console.error('Failed to register patient:', error);

      alert(
        'Failed to register patient: ' +
        (error.response?.data?.message || 'Unknown error')
      );
    } finally {
      setSaving(false);
    }
  };

  const filteredPatients = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return patients.filter(patient => {
      const matchesSearch =
        !searchValue ||
        patient.name?.toLowerCase().includes(searchValue) ||
        patient.phone?.toLowerCase().includes(searchValue) ||
        patient.district?.toLowerCase().includes(searchValue) ||
        patient.location_name?.toLowerCase().includes(searchValue);

      const matchesGender =
        genderFilter === 'all' ||
        patient.gender?.toLowerCase() === genderFilter;

      return matchesSearch && matchesGender;
    });
  }, [patients, search, genderFilter]);

  const totalPatients = patients.length;

  const malePatients = patients.filter(
    p => p.gender?.toLowerCase() === 'male'
  ).length;

  const femalePatients = patients.filter(
    p => p.gender?.toLowerCase() === 'female'
  ).length;

  const pendingAppointments = patients.reduce(
    (total, patient) =>
      total + Number(patient.pending_appointments || 0),
    0
  );

  const pendingReferrals = patients.reduce(
    (total, patient) =>
      total + Number(patient.pending_referrals || 0),
    0
  );

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

          <div>
            <p className="text-sm text-primary-600 font-semibold">
              HEALTH WORKER PORTAL
            </p>

            <h1 className="text-2xl font-bold text-gray-800 mt-1">
              👥 Patient Management
            </h1>

            <p className="text-gray-500 mt-1">
              View and manage patients assigned to your healthcare service.
            </p>
          </div>

          <div className="flex gap-2">

            <button
              onClick={loadPatients}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50"
            >
              🔄 Refresh
            </button>

            <button
              onClick={() => setShowAdd(!showAdd)}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600"
            >
              {showAdd ? '✕ Close' : '+ Add Patient'}
            </button>

          </div>

        </div>

        {/* Search */}
        <div className="mt-6 flex flex-col md:flex-row gap-3">

          <div className="relative flex-1">

            <span className="absolute left-3 top-1/2 -translate-y-1/2">
              🔍
            </span>

            <input
              type="text"
              placeholder="Search by patient name, phone or location..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />

          </div>

          <select
            value={genderFilter}
            onChange={e => setGenderFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700"
          >
            <option value="all">All Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

        </div>

      </div>


      {/* Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">
                Total Patients
              </p>

              <p className="text-3xl font-bold text-gray-800 mt-1">
                {totalPatients}
              </p>
            </div>

            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-2xl">
              👥
            </div>
          </div>
        </div>


        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">
                Male Patients
              </p>

              <p className="text-3xl font-bold text-gray-800 mt-1">
                {malePatients}
              </p>
            </div>

            <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-2xl">
              👨
            </div>
          </div>
        </div>


        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">
                Female Patients
              </p>

              <p className="text-3xl font-bold text-gray-800 mt-1">
                {femalePatients}
              </p>
            </div>

            <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center text-2xl">
              👩
            </div>
          </div>
        </div>


        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">
                Pending Cases
              </p>

              <p className="text-3xl font-bold text-gray-800 mt-1">
                {pendingAppointments + pendingReferrals}
              </p>
            </div>

            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-2xl">
              ⏳
            </div>
          </div>
        </div>

      </div>


      {/* Add Patient */}
      {showAdd && (

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">

          <div className="mb-5">
            <h2 className="text-xl font-bold text-gray-800">
              ➕ Register New Patient
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Enter the patient's basic information below.
            </p>
          </div>

          <form onSubmit={handleAddPatient}>

            <div className="grid md:grid-cols-2 gap-4">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>

                <input
                  type="text"
                  value={newPatient.name}
                  onChange={e =>
                    setNewPatient({
                      ...newPatient,
                      name: e.target.value
                    })
                  }
                  placeholder="Patient full name"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                  required
                />
              </div>


              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age *
                </label>

                <input
                  type="number"
                  min="0"
                  max="120"
                  value={newPatient.age}
                  onChange={e =>
                    setNewPatient({
                      ...newPatient,
                      age: e.target.value
                    })
                  }
                  placeholder="Age"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                  required
                />
              </div>


              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>

                <select
                  value={newPatient.gender}
                  onChange={e =>
                    setNewPatient({
                      ...newPatient,
                      gender: e.target.value
                    })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>


              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone *
                </label>

                <input
                  type="tel"
                  value={newPatient.phone}
                  onChange={e =>
                    setNewPatient({
                      ...newPatient,
                      phone: e.target.value
                    })
                  }
                  placeholder="Phone number"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                  required
                />
              </div>


              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>

                <input
                  type="text"
                  value={newPatient.address}
                  onChange={e =>
                    setNewPatient({
                      ...newPatient,
                      address: e.target.value
                    })
                  }
                  placeholder="Patient address"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                />
              </div>


              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Emergency Contact Name
                </label>

                <input
                  type="text"
                  value={newPatient.emergency_contact_name}
                  onChange={e =>
                    setNewPatient({
                      ...newPatient,
                      emergency_contact_name: e.target.value
                    })
                  }
                  placeholder="Emergency contact"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                />
              </div>


              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Emergency Contact Phone
                </label>

                <input
                  type="tel"
                  value={newPatient.emergency_contact_phone}
                  onChange={e =>
                    setNewPatient({
                      ...newPatient,
                      emergency_contact_phone: e.target.value
                    })
                  }
                  placeholder="Emergency phone"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                />
              </div>

            </div>


            <div className="mt-4">

              <label className="block text-sm font-medium text-gray-700 mb-1">
                Medical History
              </label>

              <textarea
                value={newPatient.medical_history}
                onChange={e =>
                  setNewPatient({
                    ...newPatient,
                    medical_history: e.target.value
                  })
                }
                placeholder="Brief medical history, allergies or important notes..."
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
              />

            </div>


            <div className="flex justify-end gap-3 mt-5">

              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 disabled:opacity-50"
              >
                {saving
                  ? '🔄 Registering...'
                  : '✓ Register Patient'}
              </button>

            </div>

          </form>

        </div>

      )}


      {/* Patient List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

        <div className="p-5 border-b border-gray-200 flex items-center justify-between">

          <div>
            <h2 className="text-lg font-bold text-gray-800">
              Patient List
            </h2>

            <p className="text-sm text-gray-500">
              Showing {filteredPatients.length} of {patients.length} patients
            </p>
          </div>

        </div>


        {loading ? (

          <div className="p-10 text-center">

            <div className="animate-spin text-4xl mb-3">
              🔄
            </div>

            <p className="text-gray-500">
              Loading patients...
            </p>

          </div>

        ) : filteredPatients.length > 0 ? (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-50">

                <tr>

                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Patient
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Age / Gender
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Phone
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Location
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Activity
                  </th>

                  <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase">
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredPatients.map(patient => (

                  <tr
                    key={patient.id}
                    className="border-t border-gray-100 hover:bg-gray-50"
                  >

                    {/* Patient */}
                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold">
                          {patient.name?.charAt(0)?.toUpperCase() || 'P'}
                        </div>

                        <div>

                          <p className="font-semibold text-gray-800">
                            {patient.name || 'Unknown Patient'}
                          </p>

                          <p className="text-xs text-gray-400">
                            ID: {patient.id?.slice(0, 8) || 'N/A'}
                          </p>

                        </div>

                      </div>

                    </td>


                    {/* Age */}
                    <td className="px-5 py-4 text-sm text-gray-600">

                      {patient.age
                        ? `${patient.age} years`
                        : 'N/A'}

                      <div className="text-xs text-gray-400 capitalize mt-1">
                        {patient.gender || 'N/A'}
                      </div>

                    </td>


                    {/* Phone */}
                    <td className="px-5 py-4 text-sm text-gray-600">
                      {patient.phone || 'N/A'}
                    </td>


                    {/* Location */}
                    <td className="px-5 py-4 text-sm text-gray-600">
                      {patient.location_name ||
                        patient.district ||
                        patient.address ||
                        'N/A'}
                    </td>


                    {/* Activity */}
                    <td className="px-5 py-4">

                      <div className="flex flex-wrap gap-1">

                        {Number(patient.pending_appointments || 0) > 0 && (
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                            📅 {patient.pending_appointments}
                          </span>
                        )}

                        {Number(patient.pending_referrals || 0) > 0 && (
                          <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                            📋 {patient.pending_referrals}
                          </span>
                        )}

                        {!patient.pending_appointments &&
                          !patient.pending_referrals && (
                            <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                              ✓ No pending
                            </span>
                          )}

                      </div>

                    </td>


                    {/* Action */}
                    <td className="px-5 py-4 text-right">

                      <button
                        onClick={() => setSelectedPatient(patient)}
                        className="px-3 py-1.5 text-sm text-primary-600 border border-primary-200 rounded-lg hover:bg-primary-50"
                      >
                        View
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        ) : (

          <div className="p-10 text-center">

            <div className="text-5xl mb-3">
              👥
            </div>

            <h3 className="font-semibold text-gray-800">
              No patients found
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Try changing your search or add a new patient.
            </p>

          </div>

        )}

      </div>


      {/* Patient Details Modal */}
      {selectedPatient && (

        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">

          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">

            <div className="p-6 border-b border-gray-200 flex justify-between items-start">

              <div className="flex items-center gap-3">

                <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xl font-bold">
                  {selectedPatient.name?.charAt(0)?.toUpperCase() || 'P'}
                </div>

                <div>

                  <h2 className="text-xl font-bold text-gray-800">
                    {selectedPatient.name}
                  </h2>

                  <p className="text-sm text-gray-500">
                    Patient Details
                  </p>

                </div>

              </div>

              <button
                onClick={() => setSelectedPatient(null)}
                className="text-gray-400 hover:text-gray-700 text-xl"
              >
                ✕
              </button>

            </div>


            <div className="p-6 space-y-4">

              <div className="grid grid-cols-2 gap-3">

                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">
                    Age
                  </p>

                  <p className="font-semibold text-gray-800">
                    {selectedPatient.age || 'N/A'}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">
                    Gender
                  </p>

                  <p className="font-semibold text-gray-800 capitalize">
                    {selectedPatient.gender || 'N/A'}
                  </p>
                </div>

              </div>


              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">
                  Phone
                </p>

                <p className="font-semibold text-gray-800">
                  {selectedPatient.phone || 'N/A'}
                </p>
              </div>


              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">
                  Address
                </p>

                <p className="font-semibold text-gray-800">
                  {selectedPatient.address ||
                    selectedPatient.location_name ||
                    selectedPatient.district ||
                    'N/A'}
                </p>
              </div>


              <div className="grid grid-cols-2 gap-3">

                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs text-blue-600">
                    Pending Appointments
                  </p>

                  <p className="text-xl font-bold text-blue-700">
                    {selectedPatient.pending_appointments || 0}
                  </p>
                </div>

                <div className="bg-purple-50 rounded-lg p-3">
                  <p className="text-xs text-purple-600">
                    Pending Referrals
                  </p>

                  <p className="text-xl font-bold text-purple-700">
                    {selectedPatient.pending_referrals || 0}
                  </p>
                </div>

              </div>


              {selectedPatient.emergency_contact_name && (

                <div className="bg-red-50 rounded-lg p-3">

                  <p className="text-xs text-red-600">
                    Emergency Contact
                  </p>

                  <p className="font-semibold text-gray-800">
                    {selectedPatient.emergency_contact_name}
                  </p>

                  {selectedPatient.emergency_contact_phone && (
                    <p className="text-sm text-gray-600">
                      {selectedPatient.emergency_contact_phone}
                    </p>
                  )}

                </div>

              )}


              {selectedPatient.medical_history && (

                <div className="bg-yellow-50 rounded-lg p-3">

                  <p className="text-xs text-yellow-700">
                    Medical History
                  </p>

                  <p className="text-sm text-gray-700 mt-1">
                    {selectedPatient.medical_history}
                  </p>

                </div>

              )}

            </div>


            <div className="p-6 border-t border-gray-200 flex justify-end">

              <button
                onClick={() => setSelectedPatient(null)}
                className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200"
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default PatientManagement;