import React, { useEffect, useMemo, useState } from 'react';
import axios from '../services/api';
import toast from 'react-hot-toast';

const AdminMedicines = () => {
  const [inventory, setInventory] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [facilities, setFacilities] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [facilityFilter, setFacilityFilter] = useState('all');

  const [showAddMedicine, setShowAddMedicine] = useState(false);
  const [showInventoryForm, setShowInventoryForm] = useState(false);

  const [editingItem, setEditingItem] = useState(null);

  const [medicineForm, setMedicineForm] = useState({
    name: '',
    description: '',
    dosage_form: ''
  });

  const [inventoryForm, setInventoryForm] = useState({
    facility_id: '',
    medicine_id: '',
    quantity: '',
    min_stock_level: ''
  });

  // ============================================================
  // LOAD DATA
  // ============================================================

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const [
        medicinesResponse,
        facilitiesResponse
      ] = await Promise.all([
        axios.get('/medicines'),
        axios.get('/facilities')
      ]);

      const medicineData =
        medicinesResponse.data.data || [];

      const facilityData =
        facilitiesResponse.data.data || [];

      setMedicines(medicineData);
      setFacilities(facilityData);

      await loadInventory(facilityData);

    } catch (error) {
      console.error(
        'Failed to load medicine data:',
        error
      );

      toast.error(
        error.response?.data?.message ||
        'Failed to load medicine inventory'
      );

    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // LOAD INVENTORY
  // ============================================================

  const loadInventory = async (
    facilityList = facilities
  ) => {
    try {
      const results = await Promise.all(
        facilityList.map(async (facility) => {

          try {
            const response = await axios.get(
              `/medicines/facility/${facility.id}`
            );

            return (
              response.data.data || []
            ).map((item) => ({
              ...item,

              // IMPORTANT:
              // inventory_id comes from medicine_inventory.id
              inventory_id: item.inventory_id,

              // medicine_id comes from medicines.id
              medicine_id: item.medicine_id,

              facility_id: facility.id,

              facility_name: facility.name
            }));

          } catch (error) {

            console.error(
              `Failed to load inventory for ${facility.name}`,
              error
            );

            return [];
          }
        })
      );

      setInventory(
        results.flat()
      );

    } catch (error) {

      console.error(
        'Failed to load inventory:',
        error
      );
    }
  };

  // ============================================================
  // FILTERED INVENTORY
  // ============================================================

  const filteredInventory = useMemo(() => {

    const searchText =
      search.trim().toLowerCase();

    return inventory.filter((item) => {

      const matchesSearch =
        !searchText ||
        item.name
          ?.toLowerCase()
          .includes(searchText) ||
        item.facility_name
          ?.toLowerCase()
          .includes(searchText);

      const matchesStatus =
        statusFilter === 'all' ||
        item.status === statusFilter;

      const matchesFacility =
        facilityFilter === 'all' ||
        String(item.facility_id) ===
        String(facilityFilter);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesFacility
      );
    });

  }, [
    inventory,
    search,
    statusFilter,
    facilityFilter
  ]);

  // ============================================================
  // INVENTORY COUNTS
  // ============================================================

  const availableCount =
    inventory.filter(
      item => item.status === 'available'
    ).length;

  const lowStockCount =
    inventory.filter(
      item => item.status === 'low_stock'
    ).length;

  const outOfStockCount =
    inventory.filter(
      item => item.status === 'out_of_stock'
    ).length;

  const totalQuantity =
    inventory.reduce(
      (sum, item) =>
        sum + Number(item.quantity || 0),
      0
    );

  // ============================================================
  // STATUS HELPERS
  // ============================================================

  const getStatusLabel = (status) => {

    switch (status) {

      case 'available':
        return 'Available';

      case 'low_stock':
        return 'Low Stock';

      case 'out_of_stock':
        return 'Out of Stock';

      default:
        return status || 'Unknown';
    }
  };

  const getStatusStyle = (status) => {

    switch (status) {

      case 'available':
        return 'bg-green-100 text-green-700';

      case 'low_stock':
        return 'bg-yellow-100 text-yellow-700';

      case 'out_of_stock':
        return 'bg-red-100 text-red-700';

      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // ============================================================
  // ADD MEDICINE
  // ============================================================

  const handleMedicineChange = (event) => {

    const {
      name,
      value
    } = event.target;

    setMedicineForm((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const createMedicine = async (event) => {

    event.preventDefault();

    if (!medicineForm.name.trim()) {

      toast.error(
        'Medicine name is required'
      );

      return;
    }

    try {

      setSaving(true);

      const response =
        await axios.post(
          '/medicines',
          medicineForm
        );

      setMedicines((previous) => [
        ...previous,
        response.data.data
      ]);

      toast.success(
        'Medicine added successfully'
      );

      setMedicineForm({
        name: '',
        description: '',
        dosage_form: ''
      });

      setShowAddMedicine(false);

    } catch (error) {

      console.error(
        'Failed to create medicine:',
        error
      );

      toast.error(
        error.response?.data?.message ||
        'Failed to add medicine'
      );

    } finally {

      setSaving(false);
    }
  };

  // ============================================================
  // INVENTORY FORM
  // ============================================================

  const handleInventoryChange = (event) => {

    const {
      name,
      value
    } = event.target;

    setInventoryForm((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  // ============================================================
  // OPEN ADD INVENTORY
  // ============================================================

  const openInventoryForm = () => {

    setEditingItem(null);

    setInventoryForm({
      facility_id: '',
      medicine_id: '',
      quantity: '',
      min_stock_level: ''
    });

    setShowInventoryForm(true);
  };

  // ============================================================
  // OPEN EDIT INVENTORY
  // ============================================================

  const openEditForm = (item) => {

    console.log(
      'Editing inventory item:',
      item
    );

    setEditingItem(item);

    setInventoryForm({

      facility_id:
        item.facility_id,

      // IMPORTANT:
      // Use medicine_id, NOT inventory_id
      medicine_id:
        item.medicine_id,

      quantity:
        item.quantity,

      min_stock_level:
        item.min_stock_level ?? ''
    });

    setShowInventoryForm(true);
  };

  // ============================================================
  // SAVE INVENTORY
  // ============================================================

  const saveInventory = async (event) => {

    event.preventDefault();

    if (
      !inventoryForm.facility_id ||
      !inventoryForm.medicine_id ||
      inventoryForm.quantity === ''
    ) {

      toast.error(
        'Please fill all required fields'
      );

      return;
    }

    const quantity =
      Number(
        inventoryForm.quantity
      );

    const minStock =
      inventoryForm.min_stock_level === ''
        ? 20
        : Number(
            inventoryForm.min_stock_level
          );

    if (
      Number.isNaN(quantity) ||
      quantity < 0
    ) {

      toast.error(
        'Quantity must be 0 or greater'
      );

      return;
    }

    if (
      Number.isNaN(minStock) ||
      minStock < 0
    ) {

      toast.error(
        'Minimum stock level must be 0 or greater'
      );

      return;
    }

    try {

      setSaving(true);

      // ========================================================
      // UPDATE EXISTING INVENTORY
      // ========================================================

      if (editingItem) {

        // IMPORTANT:
        // Update using medicine_inventory.id
        const inventoryId =
          editingItem.inventory_id;

        if (!inventoryId) {

          toast.error(
            'Inventory ID is missing. Please refresh the page.'
          );

          return;
        }

        console.log(
          'Updating inventory ID:',
          inventoryId
        );

        await axios.put(
          `/medicines/inventory/${inventoryId}`,
          {
            quantity,
            min_stock_level: minStock
          }
        );

        toast.success(
          'Inventory updated successfully'
        );

      }

      // ========================================================
      // CREATE NEW INVENTORY
      // ========================================================

      else {

        await axios.post(
          '/medicines/inventory',
          {
            facility_id:
              inventoryForm.facility_id,

            medicine_id:
              inventoryForm.medicine_id,

            quantity,

            min_stock_level:
              minStock
          }
        );

        toast.success(
          'Inventory added successfully'
        );
      }

      // Close modal

      setShowInventoryForm(false);

      setEditingItem(null);

      // Reset form

      setInventoryForm({
        facility_id: '',
        medicine_id: '',
        quantity: '',
        min_stock_level: ''
      });

      // Reload inventory

      await loadInventory(
        facilities
      );

    } catch (error) {

      console.error(
        'Failed to save inventory:',
        error
      );

      toast.error(
        error.response?.data?.message ||
        'Failed to update inventory'
      );

    } finally {

      setSaving(false);
    }
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {

    return (
      <div className="space-y-6">

        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white">

          <div className="animate-pulse">

            <div className="h-7 bg-white/20 rounded w-64 mb-3"></div>

            <div className="h-4 bg-white/20 rounded w-80"></div>

          </div>

        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          {[1, 2, 3, 4].map(
            item => (

              <div
                key={item}
                className="bg-white rounded-xl p-5 border border-gray-200 animate-pulse"
              >

                <div className="h-10 w-10 bg-gray-200 rounded-xl mb-3"></div>

                <div className="h-7 w-16 bg-gray-200 rounded mb-2"></div>

                <div className="h-4 w-24 bg-gray-200 rounded"></div>

              </div>
            )
          )}

        </div>

        <div className="bg-white rounded-xl p-10 text-center border border-gray-200">

          <div className="text-4xl mb-3 animate-pulse">
            💊
          </div>

          <p className="text-gray-500">
            Loading medicine inventory...
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

      <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div className="flex items-center gap-3">

            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
              💊
            </div>

            <div>

              <h1 className="text-2xl md:text-3xl font-bold">
                Medicine Inventory
              </h1>

              <p className="text-orange-100 text-sm">
                Monitor medicine stock across healthcare facilities
              </p>

            </div>

          </div>

          <div className="flex gap-2">

            <button
              onClick={() =>
                setShowAddMedicine(true)
              }
              className="px-4 py-2.5 bg-white text-orange-600 rounded-xl font-semibold hover:bg-orange-50 transition"
            >
              + Medicine
            </button>

            <button
              onClick={openInventoryForm}
              className="px-4 py-2.5 bg-white/15 border border-white/20 rounded-xl font-semibold hover:bg-white/25 transition"
            >
              + Stock
            </button>

            <button
              onClick={loadData}
              className="px-4 py-2.5 bg-white/15 border border-white/20 rounded-xl font-semibold hover:bg-white/25 transition"
            >
              🔄
            </button>

          </div>

        </div>

      </div>


      {/* ======================================================
          LOW STOCK ALERT
      ====================================================== */}

      {(lowStockCount > 0 ||
        outOfStockCount > 0) && (

        <div className="bg-red-50 border border-red-200 rounded-xl p-5">

          <div className="flex items-start gap-4">

            <div className="w-11 h-11 rounded-xl bg-red-100 flex items-center justify-center text-xl">
              🚨
            </div>

            <div>

              <h2 className="font-bold text-red-800">
                Medicine Stock Alert
              </h2>

              <p className="text-sm text-red-700 mt-1">

                {lowStockCount > 0 &&
                  `${lowStockCount} low-stock item${
                    lowStockCount === 1
                      ? ''
                      : 's'
                  }`}

                {lowStockCount > 0 &&
                  outOfStockCount > 0 &&
                  ' and '}

                {outOfStockCount > 0 &&
                  `${outOfStockCount} out-of-stock item${
                    outOfStockCount === 1
                      ? ''
                      : 's'
                  }`}

                {' '}need attention.

              </p>

            </div>

          </div>

        </div>

      )}


      {/* ======================================================
          STATISTICS
      ====================================================== */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        <InventoryStat
          icon="📦"
          value={totalQuantity}
          label="Total Stock Units"
          color="blue"
        />

        <InventoryStat
          icon="✅"
          value={availableCount}
          label="Available Items"
          color="green"
        />

        <InventoryStat
          icon="⚠️"
          value={lowStockCount}
          label="Low Stock"
          color="yellow"
        />

        <InventoryStat
          icon="🚨"
          value={outOfStockCount}
          label="Out of Stock"
          color="red"
        />

      </div>


      {/* ======================================================
          FILTERS
      ====================================================== */}

      <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">

        <div className="grid md:grid-cols-3 gap-3">

          <div className="relative">

            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </span>

            <input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search medicine or facility..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
            />

          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value
              )
            }
            className="px-4 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-orange-500 outline-none"
          >

            <option value="all">
              All Stock Status
            </option>

            <option value="available">
              Available
            </option>

            <option value="low_stock">
              Low Stock
            </option>

            <option value="out_of_stock">
              Out of Stock
            </option>

          </select>

          <select
            value={facilityFilter}
            onChange={(event) =>
              setFacilityFilter(
                event.target.value
              )
            }
            className="px-4 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-orange-500 outline-none"
          >

            <option value="all">
              All Facilities
            </option>

            {facilities.map(
              facility => (

                <option
                  key={facility.id}
                  value={facility.id}
                >
                  {facility.name}
                </option>

              )
            )}

          </select>

        </div>

      </div>


      {/* ======================================================
          INVENTORY TABLE
      ====================================================== */}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

        <div className="px-5 py-4 border-b border-gray-200">

          <h2 className="text-lg font-bold text-gray-800">
            Stock Overview
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Showing {filteredInventory.length} inventory records
          </p>

        </div>


        {filteredInventory.length === 0 ? (

          <div className="py-16 text-center">

            <div className="text-5xl mb-3">
              💊
            </div>

            <h3 className="font-semibold text-gray-700">
              No inventory found
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
                    Medicine
                  </th>

                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                    Facility
                  </th>

                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                    Quantity
                  </th>

                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                    Minimum
                  </th>

                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                    Status
                  </th>

                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">
                    Action
                  </th>

                </tr>

              </thead>


              <tbody className="divide-y divide-gray-100">

                {filteredInventory.map(
                  (item, index) => (

                    <tr
                      key={
                        item.inventory_id ||
                        index
                      }
                      className="hover:bg-gray-50 transition"
                    >

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
                            💊
                          </div>

                          <div>

                            <p className="font-semibold text-gray-800">
                              {item.name}
                            </p>

                            <p className="text-xs text-gray-400">
                              {item.dosage_form ||
                                'Medicine'}
                            </p>

                          </div>

                        </div>

                      </td>


                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2">

                          <span>
                            🏥
                          </span>

                          <span className="text-sm text-gray-700">
                            {item.facility_name}
                          </span>

                        </div>

                      </td>


                      <td className="px-5 py-4">

                        <span className="text-lg font-bold text-gray-800">
                          {item.quantity ?? 0}
                        </span>

                      </td>


                      <td className="px-5 py-4">

                        <span className="text-sm text-gray-600">
                          {item.min_stock_level ?? 0}
                        </span>

                      </td>


                      <td className="px-5 py-4">

                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                            item.status
                          )}`}
                        >
                          {getStatusLabel(
                            item.status
                          )}
                        </span>

                      </td>


                      <td className="px-5 py-4 text-right">

                        <button
                          onClick={() =>
                            openEditForm(item)
                          }
                          className="px-3 py-1.5 bg-orange-50 text-orange-600 rounded-lg text-sm font-medium hover:bg-orange-100 transition"
                        >
                          Update Stock
                        </button>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>


      {/* ======================================================
          ADD MEDICINE MODAL
      ====================================================== */}

      {showAddMedicine && (

        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">

          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">

            <form
              onSubmit={createMedicine}
            >

              <div className="p-6 border-b border-gray-200">

                <div className="flex items-center justify-between">

                  <div>

                    <h2 className="text-xl font-bold text-gray-800">
                      Add New Medicine
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      Create a medicine record
                    </p>

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setShowAddMedicine(
                        false
                      )
                    }
                    className="text-gray-400 hover:text-gray-700 text-xl"
                  >
                    ✕
                  </button>

                </div>

              </div>


              <div className="p-6 space-y-4">

                <FormInput
                  label="Medicine Name"
                  name="name"
                  value={
                    medicineForm.name
                  }
                  onChange={
                    handleMedicineChange
                  }
                  placeholder="e.g. Paracetamol"
                  required
                />

                <FormInput
                  label="Description"
                  name="description"
                  value={
                    medicineForm.description
                  }
                  onChange={
                    handleMedicineChange
                  }
                  placeholder="e.g. Fever and pain relief"
                />

                <FormInput
                  label="Dosage Form"
                  name="dosage_form"
                  value={
                    medicineForm.dosage_form
                  }
                  onChange={
                    handleMedicineChange
                  }
                  placeholder="e.g. Tablet, Capsule, Injection"
                />

              </div>


              <div className="p-6 bg-gray-50 border-t border-gray-200 flex gap-3">

                <button
                  type="button"
                  onClick={() =>
                    setShowAddMedicine(
                      false
                    )
                  }
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 disabled:opacity-50"
                >
                  {saving
                    ? 'Adding...'
                    : 'Add Medicine'}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}


      {/* ======================================================
          INVENTORY MODAL
      ====================================================== */}

      {showInventoryForm && (

        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">

          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">

            <form
              onSubmit={saveInventory}
            >

              <div className="p-6 border-b border-gray-200">

                <div className="flex items-center justify-between">

                  <div>

                    <h2 className="text-xl font-bold text-gray-800">

                      {editingItem
                        ? 'Update Medicine Stock'
                        : 'Add Medicine Stock'}

                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      Inventory status is calculated automatically
                    </p>

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setShowInventoryForm(
                        false
                      )
                    }
                    className="text-gray-400 hover:text-gray-700 text-xl"
                  >
                    ✕
                  </button>

                </div>

              </div>


              <div className="p-6 space-y-4">

                {/* Facility */}

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Facility
                  </label>

                  <select
                    name="facility_id"
                    value={
                      inventoryForm.facility_id
                    }
                    onChange={
                      handleInventoryChange
                    }
                    disabled={
                      !!editingItem
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-orange-500 outline-none disabled:bg-gray-100"
                    required
                  >

                    <option value="">
                      Select facility
                    </option>

                    {facilities.map(
                      facility => (

                        <option
                          key={facility.id}
                          value={facility.id}
                        >
                          {facility.name}
                        </option>

                      )
                    )}

                  </select>

                </div>


                {/* Medicine */}

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Medicine
                  </label>

                  <select
                    name="medicine_id"
                    value={
                      inventoryForm.medicine_id
                    }
                    onChange={
                      handleInventoryChange
                    }
                    disabled={
                      !!editingItem
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-orange-500 outline-none disabled:bg-gray-100"
                    required
                  >

                    <option value="">
                      Select medicine
                    </option>

                    {medicines.map(
                      medicine => (

                        <option
                          key={medicine.id}
                          value={medicine.id}
                        >
                          {medicine.name}
                        </option>

                      )
                    )}

                  </select>

                </div>


                {/* Quantity */}

                <FormInput
                  label="Quantity"
                  name="quantity"
                  type="number"
                  min="0"
                  value={
                    inventoryForm.quantity
                  }
                  onChange={
                    handleInventoryChange
                  }
                  placeholder="Enter quantity"
                  required
                />


                {/* Minimum Stock */}

                <FormInput
                  label="Minimum Stock Level"
                  name="min_stock_level"
                  type="number"
                  min="0"
                  value={
                    inventoryForm.min_stock_level
                  }
                  onChange={
                    handleInventoryChange
                  }
                  placeholder="Default: 20"
                />


                {/* Status Preview */}

                {inventoryForm.quantity !== '' && (

                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">

                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      Status Preview
                    </p>

                    {Number(
                      inventoryForm.quantity
                    ) === 0 ? (

                      <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                        🚨 Out of Stock
                      </span>

                    ) : Number(
                        inventoryForm.quantity
                      ) <
                      Number(
                        inventoryForm.min_stock_level ||
                        20
                      ) ? (

                      <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                        ⚠️ Low Stock
                      </span>

                    ) : (

                      <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                        ✅ Available
                      </span>

                    )}

                  </div>

                )}

              </div>


              <div className="p-6 bg-gray-50 border-t border-gray-200 flex gap-3">

                <button
                  type="button"
                  onClick={() =>
                    setShowInventoryForm(
                      false
                    )
                  }
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 disabled:opacity-50"
                >
                  {saving
                    ? 'Saving...'
                    : editingItem
                    ? 'Update Stock'
                    : 'Add Stock'}
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

const InventoryStat = ({
  icon,
  value,
  label,
  color
}) => {

  const styles = {

    blue: {
      bg: 'bg-blue-50',
      icon: 'bg-blue-100'
    },

    green: {
      bg: 'bg-green-50',
      icon: 'bg-green-100'
    },

    yellow: {
      bg: 'bg-yellow-50',
      icon: 'bg-yellow-100'
    },

    red: {
      bg: 'bg-red-50',
      icon: 'bg-red-100'
    }

  };

  const style =
    styles[color] ||
    styles.blue;

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

      <p className="text-sm font-medium text-gray-600 mt-1">
        {label}
      </p>

    </div>
  );
};


// ============================================================
// FORM INPUT
// ============================================================

const FormInput = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
  min,
  required = false
}) => {

  return (

    <div>

      <label className="block text-sm font-semibold text-gray-700 mb-1">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        required={required}
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
      />

    </div>
  );
};


export default AdminMedicines;