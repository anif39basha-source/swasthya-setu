import React, { useEffect, useState } from 'react';
import axios from '../services/api';
import toast from 'react-hot-toast';

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [facilities, setFacilities] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState('');
  const [facilityFilter, setFacilityFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);

  const [form, setForm] = useState({
    name: '',
    facility_id: '',
    department: '',
    qualification: '',
    phone: '',
    is_available: true
  });

  // ============================================================
  // LOAD DATA
  // ============================================================

  useEffect(() => {
    loadDoctors();
    loadFacilities();
  }, []);

  const loadDoctors = async () => {
    try {
      setLoading(true);

      const response = await axios.get('/doctors');

      setDoctors(response.data.data || []);
    } catch (error) {
      console.error('Failed to load doctors:', error);

      toast.error(
        error.response?.data?.message ||
        'Failed to load doctors'
      );
    } finally {
      setLoading(false);
    }
  };

  const loadFacilities = async () => {
    try {
      const response = await axios.get('/facilities');

      setFacilities(response.data.data || []);
    } catch (error) {
      console.error('Failed to load facilities:', error);
    }
  };

  // ============================================================
  // FILTER
  // ============================================================

  const filteredDoctors = doctors.filter((doctor) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      !search ||
      doctor.name?.toLowerCase().includes(searchText) ||
      doctor.department?.toLowerCase().includes(searchText) ||
      doctor.qualification?.toLowerCase().includes(searchText);

    const matchesFacility =
      !facilityFilter ||
      String(doctor.facility_id) === String(facilityFilter);

    const matchesDepartment =
      !departmentFilter ||
      doctor.department === departmentFilter;

    return (
      matchesSearch &&
      matchesFacility &&
      matchesDepartment
    );
  });

  const departments = [
    ...new Set(
      doctors
        .map((doctor) => doctor.department)
        .filter(Boolean)
    )
  ].sort();

  // ============================================================
  // FORM
  // ============================================================

  const openAddModal = () => {
    setEditingDoctor(null);

    setForm({
      name: '',
      facility_id: facilities[0]?.id || '',
      department: '',
      qualification: '',
      phone: '',
      is_available: true
    });

    setShowModal(true);
  };

  const openEditModal = (doctor) => {
    setEditingDoctor(doctor);

    setForm({
      name: doctor.name || '',
      facility_id: doctor.facility_id || '',
      department: doctor.department || '',
      qualification: doctor.qualification || '',
      phone: doctor.phone || '',
      is_available: doctor.is_available !== false
    });

    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingDoctor(null);
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // ============================================================
  // SAVE DOCTOR
  // ============================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      toast.error('Doctor name is required');
      return;
    }

    if (!form.facility_id) {
      toast.error('Please select a facility');
      return;
    }

    if (!form.department.trim()) {
      toast.error('Department is required');
      return;
    }

    try {
      setSaving(true);

      if (editingDoctor) {
        await axios.put(
          `/doctors/${editingDoctor.id}`,
          form
        );

        toast.success('Doctor updated successfully');
      } else {
        await axios.post('/doctors', form);

        toast.success('Doctor added successfully');
      }

      closeModal();
      await loadDoctors();
    } catch (error) {
      console.error('Failed to save doctor:', error);

      toast.error(
        error.response?.data?.message ||
        'Failed to save doctor'
      );
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // DEACTIVATE DOCTOR
  // ============================================================

  const deactivateDoctor = async (doctor) => {
    const confirmed = window.confirm(
      `Are you sure you want to deactivate ${doctor.name}?`
    );

    if (!confirmed) return;

    try {
      await axios.delete(`/doctors/${doctor.id}`);

      toast.success('Doctor deactivated');

      await loadDoctors();
    } catch (error) {
      console.error(
        'Failed to deactivate doctor:',
        error
      );

      toast.error(
        error.response?.data?.message ||
        'Failed to deactivate doctor'
      );
    }
  };

  // ============================================================
  // STATS
  // ============================================================

  const totalDoctors = doctors.length;

  const availableDoctors = doctors.filter(
    (doctor) => doctor.is_available !== false
  ).length;

  const unavailableDoctors =
    totalDoctors - availableDoctors;

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="space-y-6">

        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 text-white">
          <div className="animate-pulse">
            <div className="h-7 bg-white/20 rounded w-56 mb-3"></div>
            <div className="h-4 bg-white/20 rounded w-80"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="bg-white rounded-xl p-5 border border-gray-200 animate-pulse"
            >
              <div className="h-5 bg-gray-200 rounded w-24 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
          <div className="text-4xl mb-3 animate-pulse">
            👨‍⚕️
          </div>
          <p className="text-gray-500">
            Loading doctors...
          </p>
        </div>

      </div>
    );
  }

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <div className="space-y-6">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-2xl p-6 text-white shadow-lg">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>

            <div className="flex items-center gap-3">

              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
                👨‍⚕️
              </div>

              <div>

                <h1 className="text-2xl md:text-3xl font-bold">
                  Doctor Management
                </h1>

                <p className="text-green-100 text-sm">
                  Manage doctors and their availability
                </p>

              </div>

            </div>

          </div>

          <button
            onClick={openAddModal}
            className="px-5 py-3 bg-white text-green-700 rounded-xl font-semibold hover:bg-green-50 transition shadow-sm"
          >
            + Add Doctor
          </button>

        </div>

      </div>


      {/* ======================================================
          STATS
      ====================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <DoctorStat
          icon="👨‍⚕️"
          value={totalDoctors}
          label="Total Doctors"
          color="blue"
        />

        <DoctorStat
          icon="✅"
          value={availableDoctors}
          label="Available Doctors"
          color="green"
        />

        <DoctorStat
          icon="⏸️"
          value={unavailableDoctors}
          label="Unavailable"
          color="orange"
        />

      </div>


      {/* ======================================================
          FILTERS
      ====================================================== */}

      <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">

        <div className="flex flex-col lg:flex-row gap-3">

          {/* Search */}

          <div className="flex-1 relative">

            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </span>

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search doctor, department or qualification..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            />

          </div>


          {/* Facility */}

          <select
            value={facilityFilter}
            onChange={(event) =>
              setFacilityFilter(event.target.value)
            }
            className="px-4 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-green-500 outline-none"
          >

            <option value="">
              All Facilities
            </option>

            {facilities.map((facility) => (
              <option
                key={facility.id}
                value={facility.id}
              >
                {facility.name}
              </option>
            ))}

          </select>


          {/* Department */}

          <select
            value={departmentFilter}
            onChange={(event) =>
              setDepartmentFilter(event.target.value)
            }
            className="px-4 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-green-500 outline-none"
          >

            <option value="">
              All Departments
            </option>

            {departments.map((department) => (
              <option
                key={department}
                value={department}
              >
                {department}
              </option>
            ))}

          </select>

        </div>

      </div>


      {/* ======================================================
          DOCTOR TABLE
      ====================================================== */}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">

          <div>

            <h2 className="text-lg font-bold text-gray-800">
              Doctors
            </h2>

            <p className="text-sm text-gray-500">
              Showing {filteredDoctors.length} doctor
              {filteredDoctors.length !== 1 ? 's' : ''}
            </p>

          </div>

          <button
            onClick={loadDoctors}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            🔄 Refresh
          </button>

        </div>


        {filteredDoctors.length === 0 ? (

          <div className="py-16 text-center">

            <div className="text-5xl mb-3">
              👨‍⚕️
            </div>

            <h3 className="font-semibold text-gray-700">
              No doctors found
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Try changing your search or filters.
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-50">

                <tr>

                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                    Doctor
                  </th>

                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                    Department
                  </th>

                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                    Facility
                  </th>

                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                    Phone
                  </th>

                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                    Status
                  </th>

                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-gray-100">

                {filteredDoctors.map((doctor) => (

                  <tr
                    key={doctor.id}
                    className="hover:bg-gray-50 transition"
                  >

                    {/* Doctor */}

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <div className="w-11 h-11 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold">
                          {doctor.name
                            ?.charAt(0)
                            ?.toUpperCase() || 'D'}
                        </div>

                        <div>

                          <p className="font-semibold text-gray-800">
                            {doctor.name}
                          </p>

                          <p className="text-xs text-gray-500">
                            {doctor.qualification ||
                              'Qualification not specified'}
                          </p>

                        </div>

                      </div>

                    </td>


                    {/* Department */}

                    <td className="px-5 py-4">

                      <span className="text-sm text-gray-700">
                        {doctor.department ||
                          'Not specified'}
                      </span>

                    </td>


                    {/* Facility */}

                    <td className="px-5 py-4">

                      <div>

                        <p className="text-sm font-medium text-gray-700">
                          {doctor.facility_name ||
                            'Unknown facility'}
                        </p>

                        {doctor.facility_type && (
                          <p className="text-xs text-gray-400 mt-1">
                            {doctor.facility_type}
                          </p>
                        )}

                      </div>

                    </td>


                    {/* Phone */}

                    <td className="px-5 py-4">

                      <span className="text-sm text-gray-600">
                        {doctor.phone || '—'}
                      </span>

                    </td>


                    {/* Status */}

                    <td className="px-5 py-4">

                      {doctor.is_available !== false ? (

                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">

                          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>

                          Available

                        </span>

                      ) : (

                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold">

                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>

                          Unavailable

                        </span>

                      )}

                    </td>


                    {/* Actions */}

                    <td className="px-5 py-4">

                      <div className="flex items-center justify-end gap-2">

                        <button
                          onClick={() =>
                            openEditModal(doctor)
                          }
                          className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                        >
                          Edit
                        </button>

                        {doctor.is_available !== false && (

                          <button
                            onClick={() =>
                              deactivateDoctor(doctor)
                            }
                            className="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
                          >
                            Deactivate
                          </button>

                        )}

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>


      {/* ======================================================
          MODAL
      ====================================================== */}

      {showModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">

          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

            {/* Modal Header */}

            <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">

              <div>

                <h2 className="text-xl font-bold text-gray-800">

                  {editingDoctor
                    ? 'Edit Doctor'
                    : 'Add New Doctor'}

                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Enter doctor information below
                </p>

              </div>

              <button
                onClick={closeModal}
                className="w-9 h-9 rounded-lg hover:bg-gray-100 text-gray-500 text-xl"
              >
                ×
              </button>

            </div>


            {/* Form */}

            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-5"
            >

              {/* Name */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Doctor Name *
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Dr. Arun Kumar"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                />

              </div>


              {/* Facility */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Facility *
                </label>

                <select
                  name="facility_id"
                  value={form.facility_id}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-green-500 outline-none"
                >

                  <option value="">
                    Select facility
                  </option>

                  {facilities.map((facility) => (
                    <option
                      key={facility.id}
                      value={facility.id}
                    >
                      {facility.name}
                    </option>
                  ))}

                </select>

              </div>


              {/* Department */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Department *
                </label>

                <input
                  type="text"
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  placeholder="e.g. General Medicine"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                />

              </div>


              {/* Qualification */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Qualification
                </label>

                <input
                  type="text"
                  name="qualification"
                  value={form.qualification}
                  onChange={handleChange}
                  placeholder="e.g. MBBS, MD"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                />

              </div>


              {/* Phone */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Doctor contact number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                />

              </div>


              {/* Availability */}

              <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer">

                <input
                  type="checkbox"
                  name="is_available"
                  checked={form.is_available}
                  onChange={handleChange}
                  className="w-5 h-5 accent-green-600"
                />

                <div>

                  <p className="font-semibold text-gray-700">
                    Doctor is available
                  </p>

                  <p className="text-xs text-gray-500">
                    Available doctors can be shown to patients.
                  </p>

                </div>

              </label>


              {/* Buttons */}

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-200">

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="px-5 py-2.5 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50"
                >

                  {saving
                    ? 'Saving...'
                    : editingDoctor
                    ? 'Update Doctor'
                    : 'Add Doctor'}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};


// ============================================================
// STAT CARD
// ============================================================

const DoctorStat = ({
  icon,
  value,
  label,
  color
}) => {

  const styles = {
    blue: {
      bg: 'bg-blue-50',
      icon: 'bg-blue-100',
      text: 'text-blue-600'
    },
    green: {
      bg: 'bg-green-50',
      icon: 'bg-green-100',
      text: 'text-green-600'
    },
    orange: {
      bg: 'bg-orange-50',
      icon: 'bg-orange-100',
      text: 'text-orange-600'
    }
  };

  const style = styles[color] || styles.blue;

  return (
    <div
      className={`${style.bg} rounded-xl p-5 border border-gray-100 hover:shadow-md transition`}
    >

      <div
        className={`w-11 h-11 ${style.icon} rounded-xl flex items-center justify-center text-xl mb-3`}
      >
        {icon}
      </div>

      <p className="text-2xl font-bold text-gray-800">
        {value}
      </p>

      <p className={`text-sm font-medium ${style.text} mt-1`}>
        {label}
      </p>

    </div>
  );
};


export default AdminDoctors;