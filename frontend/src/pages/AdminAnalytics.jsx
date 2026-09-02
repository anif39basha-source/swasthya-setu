import React, { useEffect, useState } from 'react';
import axios from '../services/api';

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const COLORS = [
  '#6366f1',
  '#22c55e',
  '#f59e0b',
  '#ef4444',
  '#06b6d4',
  '#8b5cf6'
];

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    patientsByDistrict: [],
    appointmentsPerDay: [],
    facilityUtilization: [],
    medicineStock: [],
    referralsByPriority: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await axios.get('/admin/analytics');

      setAnalytics(
        response.data.data || {
          patientsByDistrict: [],
          appointmentsPerDay: [],
          facilityUtilization: [],
          medicineStock: [],
          referralsByPriority: []
        }
      );
    } catch (error) {
      console.error('Failed to load analytics:', error);

      setError(
        error.response?.data?.message ||
        'Unable to load analytics data.'
      );
    } finally {
      setLoading(false);
    }
  };

  const patientsByDistrict = (analytics.patientsByDistrict || []).map(
    item => ({
      district: item.district || 'Unknown',
      patients: Number(item.count || 0)
    })
  );

  const appointmentsPerDay = (analytics.appointmentsPerDay || []).map(
    item => ({
      date: item.date,
      appointments: Number(item.count || 0)
    })
  );

  const facilityUtilization = (analytics.facilityUtilization || []).map(
    item => ({
      name:
        item.type === 'DISTRICT_HOSPITAL'
          ? 'District Hospital'
          : item.type || 'Other',
      value: Number(item.count || 0)
    })
  );

  const medicineStock = (analytics.medicineStock || []).map(item => ({
    name:
      item.status === 'available'
        ? 'Available'
        : item.status === 'low_stock'
        ? 'Low Stock'
        : item.status === 'out_of_stock'
        ? 'Out of Stock'
        : item.status,
    value: Number(item.count || 0)
  }));

  const referralsByPriority = (analytics.referralsByPriority || []).map(
    item => ({
      name: item.priority
        ? item.priority.charAt(0).toUpperCase() +
          item.priority.slice(1)
        : 'Unknown',
      referrals: Number(item.count || 0)
    })
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
          <div className="animate-pulse">
            <div className="h-8 bg-white/20 rounded w-64 mb-3" />
            <div className="h-4 bg-white/20 rounded w-96" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(item => (
            <div
              key={item}
              className="bg-white rounded-2xl p-6 border border-gray-200 animate-pulse"
            >
              <div className="h-6 bg-gray-200 rounded w-48 mb-5" />
              <div className="h-64 bg-gray-100 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
                📊
              </div>

              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  Analytics
                </h1>

                <p className="text-indigo-100 text-sm">
                  Real-time SwasthyaSetu platform insights
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={loadAnalytics}
            className="px-4 py-2.5 bg-white/15 hover:bg-white/25 border border-white/20 rounded-lg text-sm font-medium transition"
          >
            🔄 Refresh Analytics
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
          ⚠️ {error}
        </div>
      )}

      {/* Appointments */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        <div className="mb-5">
          <h2 className="text-lg font-bold text-gray-800">
            📅 Appointment Trends
          </h2>

          <p className="text-sm text-gray-500">
            Appointment activity over the last 7 days
          </p>
        </div>

        <div className="h-72">
          {appointmentsPerDay.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={appointmentsPerDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />

                <Line
                  type="monotone"
                  dataKey="appointments"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <Empty message="No appointment data available" />
          )}
        </div>
      </div>

      {/* District + Facility */}
      <div className="grid lg:grid-cols-2 gap-6">

        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-gray-800">
              📍 Patients by District
            </h2>

            <p className="text-sm text-gray-500">
              Patient distribution across districts
            </p>
          </div>

          <div className="h-72">
            {patientsByDistrict.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={patientsByDistrict}>
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis
                    dataKey="district"
                    angle={-20}
                    textAnchor="end"
                    height={60}
                  />

                  <YAxis allowDecimals={false} />

                  <Tooltip />

                  <Bar
                    dataKey="patients"
                    fill="#8b5cf6"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Empty message="No district data available" />
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-gray-800">
              🏥 Facility Utilization
            </h2>

            <p className="text-sm text-gray-500">
              Appointments by facility type
            </p>
          </div>

          <div className="h-72">
            {facilityUtilization.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={facilityUtilization}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label
                  >
                    {facilityUtilization.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Empty message="No facility data available" />
            )}
          </div>
        </div>
      </div>

      {/* Medicines + Referrals */}
      <div className="grid lg:grid-cols-2 gap-6">

        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-gray-800">
              💊 Medicine Stock
            </h2>

            <p className="text-sm text-gray-500">
              Current inventory status
            </p>
          </div>

          <div className="h-72">
            {medicineStock.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={medicineStock}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label
                  >
                    {medicineStock.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Empty message="No medicine data available" />
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-gray-800">
              🔗 Referral Priority
            </h2>

            <p className="text-sm text-gray-500">
              Referrals created during the last 30 days
            </p>
          </div>

          <div className="h-72">
            {referralsByPriority.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={referralsByPriority}>
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="name" />

                  <YAxis allowDecimals={false} />

                  <Tooltip />

                  <Bar
                    dataKey="referrals"
                    fill="#f59e0b"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Empty message="No referral data available" />
            )}
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            ✓
          </div>

          <div>
            <p className="font-semibold text-green-800">
              Analytics Connected
            </p>

            <p className="text-sm text-green-700">
              Data is being loaded directly from the SwasthyaSetu backend.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

const Empty = ({ message }) => (
  <div className="h-full flex flex-col items-center justify-center text-gray-400">
    <div className="text-4xl mb-2">📊</div>
    <p className="text-sm">{message}</p>
  </div>
);

export default AdminAnalytics;