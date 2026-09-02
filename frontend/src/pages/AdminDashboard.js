import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../services/api';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [analytics, setAnalytics] = useState({
    patientsByDistrict: [],
    appointmentsPerDay: [],
    facilityUtilization: [],
    medicineStock: [],
    referralsByPriority: []
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setError('');

      const [dashboardResponse, analyticsResponse] =
        await Promise.all([
          axios.get('/admin/dashboard'),
          axios.get('/admin/analytics')
        ]);

      setStats(
        dashboardResponse.data.data || {}
      );

      setAnalytics(
        analyticsResponse.data.data || {
          patientsByDistrict: [],
          appointmentsPerDay: [],
          facilityUtilization: [],
          medicineStock: [],
          referralsByPriority: []
        }
      );

    } catch (error) {
      console.error(
        'Failed to load admin dashboard:',
        error
      );

      setError(
        error.response?.data?.message ||
        'Unable to load admin dashboard data.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await loadDashboard();
    } finally {
      setRefreshing(false);
    }
  };

  // --------------------------------------------------
  // Facility chart
  // --------------------------------------------------

  const facilityChartData =
    (analytics.facilityUtilization || []).map(
      item => ({
        name:
          item.type === 'DISTRICT_HOSPITAL'
            ? 'District Hospital'
            : item.type || 'Other',

        value: Number(item.count || 0)
      })
    );

  // --------------------------------------------------
  // Appointment chart
  // --------------------------------------------------

  const appointmentChartData =
    (analytics.appointmentsPerDay || []).map(
      item => ({
        date: item.date,
        appointments: Number(item.count || 0)
      })
    );

  // --------------------------------------------------
  // District chart
  // --------------------------------------------------

  const districtChartData =
    (analytics.patientsByDistrict || [])
      .slice(0, 8)
      .map(item => ({
        district:
          item.district || 'Unknown',

        patients:
          Number(item.count || 0)
      }));

  // --------------------------------------------------
  // Medicine chart
  // --------------------------------------------------

  const medicineChartData =
    (analytics.medicineStock || []).map(
      item => ({
        name:
          item.status === 'available'
            ? 'Available'
            : item.status === 'low_stock'
            ? 'Low Stock'
            : item.status === 'out_of_stock'
            ? 'Out of Stock'
            : item.status,

        value: Number(item.count || 0)
      })
    );

  // --------------------------------------------------
  // Referrals chart
  // --------------------------------------------------

  const referralChartData =
    (analytics.referralsByPriority || []).map(
      item => ({
        name:
          item.priority
            ? item.priority.charAt(0).toUpperCase() +
              item.priority.slice(1)
            : 'Unknown',

        value: Number(item.count || 0)
      })
    );

  // --------------------------------------------------
  // Colors
  // --------------------------------------------------

  const chartColors = [
    '#3b82f6',
    '#22c55e',
    '#f59e0b',
    '#ef4444',
    '#8b5cf6'
  ];

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="space-y-6">

        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white">
          <div className="animate-pulse">
            <div className="h-7 bg-white/20 rounded w-64 mb-3"></div>
            <div className="h-4 bg-white/20 rounded w-80"></div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(
            item => (
              <div
                key={item}
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 animate-pulse"
              >
                <div className="h-8 bg-gray-200 rounded w-10 mb-3"></div>
                <div className="h-7 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-28"></div>
              </div>
            )
          )}
        </div>

        <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
          <div className="animate-spin text-4xl mb-3">
            🔄
          </div>
          <p className="text-gray-500">
            Loading admin dashboard...
          </p>
        </div>

      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-2xl p-6 text-white shadow-lg">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>
            <div className="flex items-center gap-3 mb-2">

              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
                🛡️
              </div>

              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  Admin Dashboard
                </h1>

                <p className="text-purple-100 text-sm">
                  SwasthyaSetu platform management & analytics
                </p>
              </div>

            </div>

            <div className="flex items-center gap-2 text-sm text-purple-100 mt-3">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              System connected to live database
            </div>
          </div>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-4 py-2.5 bg-white/15 hover:bg-white/25 border border-white/20 rounded-lg font-medium text-sm transition"
          >
            {refreshing
              ? '🔄 Refreshing...'
              : '🔄 Refresh Data'}
          </button>

        </div>

      </div>


      {/* ==================================================
          ERROR
      ================================================== */}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">

          <div className="flex items-center gap-3">

            <span className="text-2xl">
              ⚠️
            </span>

            <div>
              <p className="font-semibold text-red-800">
                Dashboard data could not be loaded
              </p>

              <p className="text-sm text-red-600 mt-1">
                {error}
              </p>
            </div>

          </div>

        </div>
      )}


      {/* ==================================================
          STATISTICS
      ================================================== */}

      <div>

        <div className="flex items-center justify-between mb-4">

          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Platform Overview
            </h2>

            <p className="text-sm text-gray-500">
              Current system statistics
            </p>
          </div>

        </div>


        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          {/* Facilities */}

          <StatCard
            icon="🏥"
            value={stats.totalFacilities}
            label="Active Facilities"
            bg="bg-blue-50"
            iconBg="bg-blue-100"
            text="text-blue-600"
          />

          {/* Doctors */}

          <StatCard
            icon="👨‍⚕️"
            value={stats.totalDoctors}
            label="Active Doctors"
            bg="bg-green-50"
            iconBg="bg-green-100"
            text="text-green-600"
          />

          {/* Patients */}

          <StatCard
            icon="👥"
            value={stats.totalPatients}
            label="Total Patients"
            bg="bg-purple-50"
            iconBg="bg-purple-100"
            text="text-purple-600"
          />

          {/* Health Workers */}

          <StatCard
            icon="👷"
            value={stats.totalHealthWorkers}
            label="Health Workers"
            bg="bg-orange-50"
            iconBg="bg-orange-100"
            text="text-orange-600"
          />

          {/* Appointments */}

          <StatCard
            icon="📅"
            value={stats.todayAppointments}
            label="Today's Appointments"
            bg="bg-cyan-50"
            iconBg="bg-cyan-100"
            text="text-cyan-600"
          />

          {/* Referrals */}

          <StatCard
            icon="🔗"
            value={stats.totalReferrals}
            label="Total Referrals"
            bg="bg-indigo-50"
            iconBg="bg-indigo-100"
            text="text-indigo-600"
          />

          {/* Pending */}

          <StatCard
            icon="⏳"
            value={stats.pendingReferrals}
            label="Pending Referrals"
            bg="bg-yellow-50"
            iconBg="bg-yellow-100"
            text="text-yellow-600"
          />

          {/* Medicines */}

          <StatCard
            icon="💊"
            value={stats.availableMedicines}
            label="Available Medicines"
            bg="bg-emerald-50"
            iconBg="bg-emerald-100"
            text="text-emerald-600"
          />

        </div>

      </div>


      {/* ==================================================
          QUICK ACTIONS
      ================================================== */}

      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">

        <div className="flex items-center justify-between mb-4">

          <div>
            <h2 className="text-lg font-bold text-gray-800">
              Quick Management
            </h2>

            <p className="text-sm text-gray-500">
              Access important administration sections
            </p>
          </div>

        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">

          <AdminLink
            to="/admin/facilities"
            icon="🏥"
            title="Facilities"
            color="bg-blue-500"
          />

          <AdminLink
            to="/admin/doctors"
            icon="👨‍⚕️"
            title="Doctors"
            color="bg-green-500"
          />

          <AdminLink
            to="/admin/users"
            icon="👥"
            title="Users"
            color="bg-purple-500"
          />

          <AdminLink
            to="/admin/medicines"
            icon="💊"
            title="Medicines"
            color="bg-orange-500"
          />

          <AdminLink
            to="/admin/analytics"
            icon="📊"
            title="Analytics"
            color="bg-indigo-500"
          />

        </div>

      </div>


      {/* ==================================================
          APPOINTMENTS + FACILITIES
      ================================================== */}

      <div className="grid lg:grid-cols-2 gap-6">

        {/* Appointment Chart */}

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">

          <div className="mb-5">

            <h2 className="text-lg font-bold text-gray-800">
              📅 Appointment Activity
            </h2>

            <p className="text-sm text-gray-500">
              Appointments during the last 7 days
            </p>

          </div>

          <div className="h-64">

            {appointmentChartData.length > 0 ? (

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <BarChart
                  data={appointmentChartData}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11 }}
                  />

                  <YAxis
                    allowDecimals={false}
                  />

                  <Tooltip />

                  <Bar
                    dataKey="appointments"
                    fill="#6366f1"
                    radius={[6, 6, 0, 0]}
                  />

                </BarChart>

              </ResponsiveContainer>

            ) : (

              <EmptyChart message="No appointment data available" />

            )}

          </div>

        </div>


        {/* Facility Utilization */}

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">

          <div className="mb-3">

            <h2 className="text-lg font-bold text-gray-800">
              🏥 Facility Utilization
            </h2>

            <p className="text-sm text-gray-500">
              Appointments by facility type
            </p>

          </div>

          <div className="h-64">

            {facilityChartData.length > 0 ? (

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <PieChart>

                  <Pie
                    data={facilityChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={85}
                    dataKey="value"
                    label
                  >

                    {facilityChartData.map(
                      (entry, index) => (
                        <Cell
                          key={`facility-${index}`}
                          fill={
                            chartColors[
                              index %
                              chartColors.length
                            ]
                          }
                        />
                      )
                    )}

                  </Pie>

                  <Tooltip />

                  <Legend />

                </PieChart>

              </ResponsiveContainer>

            ) : (

              <EmptyChart message="No facility utilization data available" />

            )}

          </div>

        </div>

      </div>


      {/* ==================================================
          DISTRICT + MEDICINE
      ================================================== */}

      <div className="grid lg:grid-cols-2 gap-6">

        {/* Patients by District */}

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">

          <div className="mb-5">

            <h2 className="text-lg font-bold text-gray-800">
              📍 Patients by District
            </h2>

            <p className="text-sm text-gray-500">
              Distribution of registered patients
            </p>

          </div>

          <div className="h-64">

            {districtChartData.length > 0 ? (

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <BarChart
                  data={districtChartData}
                  layout="vertical"
                  margin={{
                    left: 20,
                    right: 20
                  }}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    type="number"
                    allowDecimals={false}
                  />

                  <YAxis
                    type="category"
                    dataKey="district"
                    width={90}
                    tick={{ fontSize: 11 }}
                  />

                  <Tooltip />

                  <Bar
                    dataKey="patients"
                    fill="#8b5cf6"
                    radius={[0, 6, 6, 0]}
                  />

                </BarChart>

              </ResponsiveContainer>

            ) : (

              <EmptyChart message="No district data available" />

            )}

          </div>

        </div>


        {/* Medicine Stock */}

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">

          <div className="mb-3">

            <h2 className="text-lg font-bold text-gray-800">
              💊 Medicine Inventory
            </h2>

            <p className="text-sm text-gray-500">
              Current medicine stock status
            </p>

          </div>

          <div className="h-64">

            {medicineChartData.length > 0 ? (

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <PieChart>

                  <Pie
                    data={medicineChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={85}
                    dataKey="value"
                    label
                  >

                    {medicineChartData.map(
                      (entry, index) => (
                        <Cell
                          key={`medicine-${index}`}
                          fill={
                            chartColors[
                              index %
                              chartColors.length
                            ]
                          }
                        />
                      )
                    )}

                  </Pie>

                  <Tooltip />

                  <Legend />

                </PieChart>

              </ResponsiveContainer>

            ) : (

              <EmptyChart message="No medicine inventory data available" />

            )}

          </div>

        </div>

      </div>


      {/* ==================================================
          REFERRAL PRIORITY
      ================================================== */}

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">

        <div className="mb-5">

          <h2 className="text-lg font-bold text-gray-800">
            🔗 Referral Priority
          </h2>

          <p className="text-sm text-gray-500">
            Referrals created during the last 30 days
          </p>

        </div>

        {referralChartData.length > 0 ? (

          <div className="grid md:grid-cols-3 gap-4">

            {referralChartData.map(
              (item, index) => (

                <div
                  key={index}
                  className="bg-gray-50 rounded-xl p-4 border border-gray-100"
                >

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-sm text-gray-500">
                        {item.name}
                      </p>

                      <p className="text-2xl font-bold text-gray-800 mt-1">
                        {item.value}
                      </p>

                    </div>

                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-indigo-100 text-indigo-600">
                      {item.name === 'Emergency'
                        ? '🚨'
                        : item.name === 'Urgent'
                        ? '⚠️'
                        : '📋'}
                    </div>

                  </div>

                </div>

              )
            )}

          </div>

        ) : (

          <div className="text-center py-8 text-gray-500">
            No referral data available
          </div>

        )}

      </div>


      {/* ==================================================
          FOOTER STATUS
      ================================================== */}

      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-5 border border-green-100">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              ✓
            </div>

            <div>

              <p className="font-semibold text-gray-800">
                SwasthyaSetu System Status
              </p>

              <p className="text-sm text-gray-500">
                Admin dashboard is connected to the backend database.
              </p>

            </div>

          </div>

          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Operational
          </span>

        </div>

      </div>

    </div>
  );
};


// ============================================================
// STAT CARD
// ============================================================

const StatCard = ({
  icon,
  value,
  label,
  bg,
  iconBg,
  text
}) => {

  return (
    <div
      className={`${bg} rounded-xl p-4 border border-gray-100 hover:shadow-md transition-shadow`}
    >

      <div
        className={`w-11 h-11 ${iconBg} rounded-xl flex items-center justify-center text-xl mb-3`}
      >
        {icon}
      </div>

      <div className="text-2xl font-bold text-gray-800">
        {value ?? 0}
      </div>

      <div className={`text-sm font-medium ${text} mt-1`}>
        {label}
      </div>

    </div>
  );
};


// ============================================================
// ADMIN LINK
// ============================================================

const AdminLink = ({
  to,
  icon,
  title,
  color
}) => {

  return (
    <Link
      to={to}
      className={`${color} text-white rounded-xl p-4 text-center font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all`}
    >

      <div className="text-2xl mb-1">
        {icon}
      </div>

      <div className="text-sm">
        {title}
      </div>

    </Link>
  );
};


// ============================================================
// EMPTY CHART
// ============================================================

const EmptyChart = ({ message }) => {

  return (
    <div className="h-full flex flex-col items-center justify-center text-gray-400">

      <div className="text-4xl mb-2">
        📊
      </div>

      <p className="text-sm">
        {message}
      </p>

    </div>
  );
};


export default AdminDashboard;