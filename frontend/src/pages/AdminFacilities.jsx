import React, { useEffect, useState } from 'react';
import axios from '../services/api';
import toast from 'react-hot-toast';

const initialForm = {
    name: '',
    type: 'primary_health_center',
    address: '',
    latitude: '',
    longitude: '',
    phone: '',
    email: '',
    opening_time: '09:00',
    closing_time: '17:00',
    emergency_available: false
};

const facilityTypes = [
    {
        value: 'primary_health_center',
        label: 'Primary Health Center'
    },
    {
        value: 'community_health_center',
        label: 'Community Health Center'
    },
    {
        value: 'district_hospital',
        label: 'District Hospital'
    },
    {
        value: 'government_hospital',
        label: 'Government Hospital'
    },
    {
        value: 'private_hospital',
        label: 'Private Hospital'
    },
    {
        value: 'clinic',
        label: 'Clinic'
    }
];

function AdminFacilities() {

    const [facilities, setFacilities] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState('');

    const [showModal, setShowModal] = useState(false);
    const [editingFacility, setEditingFacility] = useState(null);

    const [form, setForm] = useState(initialForm);

    const [saving, setSaving] = useState(false);


    // ========================================================
    // Load facilities
    // ========================================================

    const loadFacilities = async () => {

        try {

            setLoading(true);

            const response = await axios.get('/facilities');

            setFacilities(
                response.data?.data || []
            );

        } catch (error) {

            console.error(
                'Failed to load facilities:',
                error
            );

            toast.error(
                error.response?.data?.message ||
                'Failed to load facilities'
            );

        } finally {

            setLoading(false);
        }
    };


    // ========================================================
    // Initial load
    // ========================================================

    useEffect(() => {

        loadFacilities();

    }, []);


    // ========================================================
    // Form change
    // ========================================================

    const handleChange = (e) => {

        const {
            name,
            value,
            type,
            checked
        } = e.target;

        setForm(prev => ({
            ...prev,
            [name]:
                type === 'checkbox'
                    ? checked
                    : value
        }));
    };


    // ========================================================
    // Open Add modal
    // ========================================================

    const openAddModal = () => {

        setEditingFacility(null);

        setForm({
            ...initialForm
        });

        setShowModal(true);
    };


    // ========================================================
    // Open Edit modal
    // ========================================================

    const openEditModal = (facility) => {

        setEditingFacility(facility);

        setForm({
            name: facility.name || '',
            type:
                facility.type ||
                'primary_health_center',
            address: facility.address || '',
            latitude:
                facility.latitude ??
                '',
            longitude:
                facility.longitude ??
                '',
            phone:
                facility.phone ||
                '',
            email:
                facility.email ||
                '',
            opening_time:
                facility.opening_time ||
                '09:00',
            closing_time:
                facility.closing_time ||
                '17:00',
            emergency_available:
                Boolean(
                    facility.emergency_available
                )
        });

        setShowModal(true);
    };


    // ========================================================
    // Close modal
    // ========================================================

    const closeModal = () => {

        if (saving) return;

        setShowModal(false);

        setEditingFacility(null);

        setForm({
            ...initialForm
        });
    };


    // ========================================================
    // Save facility
    // ========================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!form.name.trim()) {

            toast.error(
                'Facility name is required'
            );

            return;
        }

        if (!form.address.trim()) {

            toast.error(
                'Address is required'
            );

            return;
        }

        if (
            form.latitude === '' ||
            form.longitude === ''
        ) {

            toast.error(
                'Latitude and longitude are required'
            );

            return;
        }


        const latitude =
            Number(form.latitude);

        const longitude =
            Number(form.longitude);


        if (
            Number.isNaN(latitude) ||
            latitude < -90 ||
            latitude > 90
        ) {

            toast.error(
                'Enter a valid latitude'
            );

            return;
        }


        if (
            Number.isNaN(longitude) ||
            longitude < -180 ||
            longitude > 180
        ) {

            toast.error(
                'Enter a valid longitude'
            );

            return;
        }


        try {

            setSaving(true);


            const payload = {

                name: form.name.trim(),

                type: form.type,

                address:
                    form.address.trim(),

                latitude,

                longitude,

                phone:
                    form.phone.trim() ||
                    null,

                email:
                    form.email.trim() ||
                    null,

                opening_time:
                    form.opening_time ||
                    null,

                closing_time:
                    form.closing_time ||
                    null,

                emergency_available:
                    Boolean(
                        form.emergency_available
                    )
            };


            if (editingFacility) {

                await axios.put(
                    `/facilities/${editingFacility.id}`,
                    payload
                );

                toast.success(
                    'Facility updated successfully'
                );

            } else {

                await axios.post(
                    '/facilities',
                    payload
                );

                toast.success(
                    'Facility added successfully'
                );
            }


            closeModal();

            await loadFacilities();

        } catch (error) {

            console.error(
                'Failed to save facility:',
                error
            );

            toast.error(
                error.response?.data?.message ||
                'Failed to save facility'
            );

        } finally {

            setSaving(false);
        }
    };


    // ========================================================
    // Toggle facility active/inactive
    // ========================================================

    const toggleFacility = async (facility) => {

        const newStatus =
            facility.is_active === false;


        const action =
            newStatus
                ? 'activate'
                : 'deactivate';


        const confirmed =
            window.confirm(
                `Are you sure you want to ${action} "${facility.name}"?`
            );


        if (!confirmed) return;


        try {

            await axios.put(
                `/facilities/${facility.id}`,
                {
                    is_active: newStatus
                }
            );


            toast.success(
                `Facility ${action}d successfully`
            );


            await loadFacilities();

        } catch (error) {

            console.error(
                'Failed to change facility status:',
                error
            );

            toast.error(
                error.response?.data?.message ||
                'Failed to update facility status'
            );
        }
    };


    // ========================================================
    // Soft delete / deactivate
    // ========================================================

    const deactivateFacility = async (facility) => {

        const confirmed =
            window.confirm(
                `Deactivate "${facility.name}"?`
            );

        if (!confirmed) return;


        try {

            await axios.delete(
                `/facilities/${facility.id}`
            );


            toast.success(
                'Facility deactivated'
            );


            await loadFacilities();

        } catch (error) {

            console.error(
                'Failed to deactivate facility:',
                error
            );

            toast.error(
                error.response?.data?.message ||
                'Failed to deactivate facility'
            );
        }
    };


    // ========================================================
    // Filter facilities
    // ========================================================

    const filteredFacilities =
        facilities.filter(facility => {

            const text = [

                facility.name,

                facility.type,

                facility.address,

                facility.phone,

                facility.email,

                facility.district,

                facility.state

            ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();


            return text.includes(
                search.toLowerCase()
            );
        });


    // ========================================================
    // Helpers
    // ========================================================

    const getTypeLabel = (type) => {

        const found =
            facilityTypes.find(
                item => item.value === type
            );

        if (found) {
            return found.label;
        }

        return type
            ?.replaceAll('_', ' ')
            ?.replace(/\b\w/g, char =>
                char.toUpperCase()
            ) || 'Facility';
    };


    const getTypeShort = (type) => {

        if (
            type ===
            'primary_health_center'
        ) {
            return 'PHC';
        }

        if (
            type ===
            'community_health_center'
        ) {
            return 'CHC';
        }

        if (
            type ===
            'district_hospital'
        ) {
            return 'DH';
        }

        return 'FAC';
    };


    // ========================================================
    // Render
    // ========================================================

    return (
        <div
            style={{
                padding: '28px',
                maxWidth: '1400px',
                margin: '0 auto',
                background: '#f8fafc',
                minHeight: '100vh'
            }}
        >

            {/* ==================================================
                HEADER
            ================================================== */}

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '20px',
                    marginBottom: '28px',
                    flexWrap: 'wrap'
                }}
            >

                <div>

                    <div
                        style={{
                            fontSize: '14px',
                            fontWeight: 700,
                            color: '#16a34a',
                            marginBottom: '6px'
                        }}
                    >
                        ADMINISTRATION
                    </div>

                    <h1
                        style={{
                            margin: 0,
                            fontSize: '30px',
                            color: '#0f172a',
                            fontWeight: 800
                        }}
                    >
                        Healthcare Facilities
                    </h1>

                    <p
                        style={{
                            margin:
                                '8px 0 0',
                            color: '#64748b',
                            fontSize: '15px'
                        }}
                    >
                        Manage hospitals, health
                        centers and clinics
                    </p>

                </div>


                <button
                    onClick={openAddModal}
                    style={{
                        border: 'none',
                        background: '#16a34a',
                        color: '#fff',
                        padding:
                            '12px 20px',
                        borderRadius: '10px',
                        fontWeight: 700,
                        fontSize: '14px',
                        cursor: 'pointer',
                        boxShadow:
                            '0 4px 12px rgba(22,163,74,0.20)'
                    }}
                >
                    + Add Facility
                </button>

            </div>


            {/* ==================================================
                SUMMARY CARDS
            ================================================== */}

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns:
                        'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '16px',
                    marginBottom: '22px'
                }}
            >

                <div style={cardStyle}>

                    <div
                        style={iconStyle}
                    >
                        🏥
                    </div>

                    <div>

                        <div
                            style={labelStyle}
                        >
                            Total Facilities
                        </div>

                        <div
                            style={numberStyle}
                        >
                            {facilities.length}
                        </div>

                    </div>

                </div>


                <div style={cardStyle}>

                    <div
                        style={iconStyle}
                    >
                        ✓
                    </div>

                    <div>

                        <div
                            style={labelStyle}
                        >
                            Active
                        </div>

                        <div
                            style={numberStyle}
                        >
                            {
                                facilities.filter(
                                    f =>
                                        f.is_active !==
                                        false
                                ).length
                            }
                        </div>

                    </div>

                </div>


                <div style={cardStyle}>

                    <div
                        style={iconStyle}
                    >
                        🚑
                    </div>

                    <div>

                        <div
                            style={labelStyle}
                        >
                            Emergency
                        </div>

                        <div
                            style={numberStyle}
                        >
                            {
                                facilities.filter(
                                    f =>
                                        Boolean(
                                            f.emergency_available
                                        )
                                ).length
                            }
                        </div>

                    </div>

                </div>


                <div style={cardStyle}>

                    <div
                        style={iconStyle}
                    >
                        👨‍⚕️
                    </div>

                    <div>

                        <div
                            style={labelStyle}
                        >
                            Available Doctors
                        </div>

                        <div
                            style={numberStyle}
                        >
                            {
                                facilities.reduce(
                                    (
                                        total,
                                        facility
                                    ) =>
                                        total +
                                        Number(
                                            facility.available_doctors ||
                                            0
                                        ),
                                    0
                                )
                            }
                        </div>

                    </div>

                </div>

            </div>


            {/* ==================================================
                SEARCH
            ================================================== */}

            <div
                style={{
                    background: '#fff',
                    border:
                        '1px solid #e2e8f0',
                    borderRadius: '14px',
                    padding: '16px',
                    marginBottom: '18px',
                    boxShadow:
                        '0 2px 8px rgba(15,23,42,0.04)'
                }}
            >

                <input
                    type="text"
                    placeholder="Search facilities by name, type, address..."
                    value={search}
                    onChange={e =>
                        setSearch(
                            e.target.value
                        )
                    }
                    style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        border:
                            '1px solid #cbd5e1',
                        borderRadius: '10px',
                        padding:
                            '12px 14px',
                        fontSize: '14px',
                        outline: 'none'
                    }}
                />

            </div>


            {/* ==================================================
                FACILITIES TABLE
            ================================================== */}

            <div
                style={{
                    background: '#fff',
                    border:
                        '1px solid #e2e8f0',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    boxShadow:
                        '0 2px 8px rgba(15,23,42,0.04)'
                }}
            >

                <div
                    style={{
                        padding: '18px 20px',
                        borderBottom:
                            '1px solid #e2e8f0',
                        display: 'flex',
                        justifyContent:
                            'space-between',
                        alignItems: 'center'
                    }}
                >

                    <div>

                        <h2
                            style={{
                                margin: 0,
                                fontSize: '18px',
                                color: '#0f172a'
                            }}
                        >
                            Facility List
                        </h2>

                        <p
                            style={{
                                margin:
                                    '4px 0 0',
                                color: '#64748b',
                                fontSize: '13px'
                            }}
                        >
                            {
                                filteredFacilities.length
                            } facilities found
                        </p>

                    </div>

                </div>


                {loading ? (

                    <div
                        style={{
                            padding: '60px 20px',
                            textAlign: 'center',
                            color: '#64748b'
                        }}
                    >
                        Loading facilities...
                    </div>

                ) : filteredFacilities.length === 0 ? (

                    <div
                        style={{
                            padding: '60px 20px',
                            textAlign: 'center'
                        }}
                    >

                        <div
                            style={{
                                fontSize: '42px',
                                marginBottom: '12px'
                            }}
                        >
                            🏥
                        </div>

                        <h3
                            style={{
                                margin:
                                    '0 0 6px',
                                color: '#0f172a'
                            }}
                        >
                            No facilities found
                        </h3>

                        <p
                            style={{
                                margin: 0,
                                color: '#64748b'
                            }}
                        >
                            Try changing your
                            search or add a new
                            facility.
                        </p>

                    </div>

                ) : (

                    <div
                        style={{
                            overflowX: 'auto'
                        }}
                    >

                        <table
                            style={{
                                width: '100%',
                                borderCollapse:
                                    'collapse',
                                minWidth:
                                    '900px'
                            }}
                        >

                            <thead>

                                <tr
                                    style={{
                                        background:
                                            '#f8fafc'
                                    }}
                                >

                                    <th
                                        style={thStyle}
                                    >
                                        Facility
                                    </th>

                                    <th
                                        style={thStyle}
                                    >
                                        Type
                                    </th>

                                    <th
                                        style={thStyle}
                                    >
                                        Contact
                                    </th>

                                    <th
                                        style={thStyle}
                                    >
                                        Doctors
                                    </th>

                                    <th
                                        style={thStyle}
                                    >
                                        Emergency
                                    </th>

                                    <th
                                        style={thStyle}
                                    >
                                        Status
                                    </th>

                                    <th
                                        style={{
                                            ...thStyle,
                                            textAlign:
                                                'right'
                                        }}
                                    >
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {filteredFacilities.map(
                                    facility => (

                                        <tr
                                            key={
                                                facility.id
                                            }
                                            style={{
                                                borderTop:
                                                    '1px solid #f1f5f9'
                                            }}
                                        >

                                            {/* Facility */}

                                            <td
                                                style={tdStyle}
                                            >

                                                <div
                                                    style={{
                                                        display:
                                                            'flex',
                                                        alignItems:
                                                            'center',
                                                        gap: '12px'
                                                    }}
                                                >

                                                    <div
                                                        style={{
                                                            width:
                                                                '42px',
                                                            height:
                                                                '42px',
                                                            borderRadius:
                                                                '10px',
                                                            background:
                                                                '#ecfdf5',
                                                            display:
                                                                'flex',
                                                            alignItems:
                                                                'center',
                                                            justifyContent:
                                                                'center',
                                                            fontWeight:
                                                                800,
                                                            color:
                                                                '#16a34a',
                                                            fontSize:
                                                                '12px'
                                                        }}
                                                    >
                                                        {
                                                            getTypeShort(
                                                                facility.type
                                                            )
                                                        }
                                                    </div>

                                                    <div>

                                                        <div
                                                            style={{
                                                                fontWeight:
                                                                    700,
                                                                color:
                                                                    '#0f172a',
                                                                marginBottom:
                                                                    '3px'
                                                            }}
                                                        >
                                                            {
                                                                facility.name
                                                            }
                                                        </div>

                                                        <div
                                                            style={{
                                                                color:
                                                                    '#64748b',
                                                                fontSize:
                                                                    '12px',
                                                                maxWidth:
                                                                    '260px'
                                                            }}
                                                        >
                                                            {
                                                                facility.address ||
                                                                'Address not available'
                                                            }
                                                        </div>

                                                    </div>

                                                </div>

                                            </td>


                                            {/* Type */}

                                            <td
                                                style={tdStyle}
                                            >

                                                <span
                                                    style={{
                                                        background:
                                                            '#eff6ff',
                                                        color:
                                                            '#2563eb',
                                                        padding:
                                                            '6px 9px',
                                                        borderRadius:
                                                            '7px',
                                                        fontSize:
                                                            '12px',
                                                        fontWeight:
                                                            700
                                                    }}
                                                >
                                                    {
                                                        getTypeLabel(
                                                            facility.type
                                                        )
                                                    }
                                                </span>

                                            </td>


                                            {/* Contact */}

                                            <td
                                                style={tdStyle}
                                            >

                                                <div
                                                    style={{
                                                        fontSize:
                                                            '13px',
                                                        color:
                                                            '#334155'
                                                    }}
                                                >
                                                    {
                                                        facility.phone ||
                                                        '—'
                                                    }
                                                </div>

                                                <div
                                                    style={{
                                                        fontSize:
                                                            '12px',
                                                        color:
                                                            '#64748b',
                                                        marginTop:
                                                            '3px'
                                                    }}
                                                >
                                                    {
                                                        facility.email ||
                                                        '—'
                                                    }
                                                </div>

                                            </td>


                                            {/* Doctors */}

                                            <td
                                                style={tdStyle}
                                            >

                                                <strong
                                                    style={{
                                                        color:
                                                            '#0f172a'
                                                    }}
                                                >
                                                    {
                                                        Number(
                                                            facility.available_doctors ||
                                                            0
                                                        )
                                                    }
                                                </strong>

                                                <span
                                                    style={{
                                                        color:
                                                            '#64748b',
                                                        fontSize:
                                                            '12px',
                                                        marginLeft:
                                                            '4px'
                                                    }}
                                                >
                                                    available
                                                </span>

                                            </td>


                                            {/* Emergency */}

                                            <td
                                                style={tdStyle}
                                            >

                                                {facility.emergency_available ? (

                                                    <span
                                                        style={{
                                                            background:
                                                                '#fef2f2',
                                                            color:
                                                                '#dc2626',
                                                            padding:
                                                                '6px 9px',
                                                            borderRadius:
                                                                '7px',
                                                            fontSize:
                                                                '12px',
                                                            fontWeight:
                                                                700
                                                        }}
                                                    >
                                                        Available
                                                    </span>

                                                ) : (

                                                    <span
                                                        style={{
                                                            color:
                                                                '#64748b',
                                                            fontSize:
                                                                '13px'
                                                        }}
                                                    >
                                                        No
                                                    </span>

                                                )}

                                            </td>


                                            {/* Status */}

                                            <td
                                                style={tdStyle}
                                            >

                                                {facility.is_active !== false ? (

                                                    <span
                                                        style={{
                                                            background:
                                                                '#dcfce7',
                                                            color:
                                                                '#15803d',
                                                            padding:
                                                                '6px 9px',
                                                            borderRadius:
                                                                '7px',
                                                            fontSize:
                                                                '12px',
                                                            fontWeight:
                                                                700
                                                        }}
                                                    >
                                                        Active
                                                    </span>

                                                ) : (

                                                    <span
                                                        style={{
                                                            background:
                                                                '#f1f5f9',
                                                            color:
                                                                '#64748b',
                                                            padding:
                                                                '6px 9px',
                                                            borderRadius:
                                                                '7px',
                                                            fontSize:
                                                                '12px',
                                                            fontWeight:
                                                                700
                                                        }}
                                                    >
                                                        Inactive
                                                    </span>

                                                )}

                                            </td>


                                            {/* Actions */}

                                            <td
                                                style={{
                                                    ...tdStyle,
                                                    textAlign:
                                                        'right'
                                                }}
                                            >

                                                <div
                                                    style={{
                                                        display:
                                                            'flex',
                                                        justifyContent:
                                                            'flex-end',
                                                        gap:
                                                            '7px'
                                                    }}
                                                >

                                                    <button
                                                        onClick={() =>
                                                            openEditModal(
                                                                facility
                                                            )
                                                        }
                                                        style={
                                                            actionButtonStyle
                                                        }
                                                    >
                                                        Edit
                                                    </button>


                                                    {facility.is_active !== false ? (

                                                        <button
                                                            onClick={() =>
                                                                deactivateFacility(
                                                                    facility
                                                                )
                                                            }
                                                            style={{
                                                                ...actionButtonStyle,
                                                                color:
                                                                    '#dc2626',
                                                                borderColor:
                                                                    '#fecaca'
                                                            }}
                                                        >
                                                            Deactivate
                                                        </button>

                                                    ) : (

                                                        <button
                                                            onClick={() =>
                                                                toggleFacility(
                                                                    facility
                                                                )
                                                            }
                                                            style={{
                                                                ...actionButtonStyle,
                                                                color:
                                                                    '#16a34a',
                                                                borderColor:
                                                                    '#bbf7d0'
                                                            }}
                                                        >
                                                            Activate
                                                        </button>

                                                    )}

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>


            {/* ==================================================
                ADD / EDIT MODAL
            ================================================== */}

            {showModal && (

                <div
                    onClick={closeModal}
                    style={{
                        position:
                            'fixed',
                        inset: 0,
                        background:
                            'rgba(15,23,42,0.55)',
                        display:
                            'flex',
                        alignItems:
                            'center',
                        justifyContent:
                            'center',
                        padding:
                            '20px',
                        zIndex: 1000
                    }}
                >

                    <div
                        onClick={e =>
                            e.stopPropagation()
                        }
                        style={{
                            background:
                                '#fff',
                            borderRadius:
                                '16px',
                            width:
                                '100%',
                            maxWidth:
                                '720px',
                            maxHeight:
                                '90vh',
                            overflowY:
                                'auto',
                            boxShadow:
                                '0 20px 60px rgba(0,0,0,0.20)'
                        }}
                    >

                        {/* Modal header */}

                        <div
                            style={{
                                padding:
                                    '20px 24px',
                                borderBottom:
                                    '1px solid #e2e8f0',
                                display:
                                    'flex',
                                justifyContent:
                                    'space-between',
                                alignItems:
                                    'center'
                            }}
                        >

                            <div>

                                <h2
                                    style={{
                                        margin: 0,
                                        fontSize:
                                            '20px',
                                        color:
                                            '#0f172a'
                                    }}
                                >
                                    {
                                        editingFacility
                                            ? 'Edit Facility'
                                            : 'Add New Facility'
                                    }
                                </h2>

                                <p
                                    style={{
                                        margin:
                                            '5px 0 0',
                                        color:
                                            '#64748b',
                                        fontSize:
                                            '13px'
                                    }}
                                >
                                    Enter facility
                                    details below
                                </p>

                            </div>


                            <button
                                onClick={closeModal}
                                disabled={saving}
                                style={{
                                    border:
                                        'none',
                                    background:
                                        '#f1f5f9',
                                    width:
                                        '34px',
                                    height:
                                        '34px',
                                    borderRadius:
                                        '8px',
                                    cursor:
                                        'pointer',
                                    fontSize:
                                        '18px'
                                }}
                            >
                                ×
                            </button>

                        </div>


                        {/* Form */}

                        <form
                            onSubmit={
                                handleSubmit
                            }
                        >

                            <div
                                style={{
                                    padding:
                                        '24px',
                                    display:
                                        'grid',
                                    gridTemplateColumns:
                                        '1fr 1fr',
                                    gap:
                                        '16px'
                                }}
                            >

                                {/* Name */}

                                <div
                                    style={{
                                        gridColumn:
                                            '1 / -1'
                                    }}
                                >

                                    <label
                                        style={
                                            fieldLabelStyle
                                        }
                                    >
                                        Facility Name *
                                    </label>

                                    <input
                                        name="name"
                                        value={
                                            form.name
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="e.g. Jayanagar Primary Health Center"
                                        style={
                                            inputStyle
                                        }
                                    />

                                </div>


                                {/* Type */}

                                <div>

                                    <label
                                        style={
                                            fieldLabelStyle
                                        }
                                    >
                                        Facility Type *
                                    </label>

                                    <select
                                        name="type"
                                        value={
                                            form.type
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        style={
                                            inputStyle
                                        }
                                    >

                                        {facilityTypes.map(
                                            type => (

                                                <option
                                                    key={
                                                        type.value
                                                    }
                                                    value={
                                                        type.value
                                                    }
                                                >
                                                    {
                                                        type.label
                                                    }
                                                </option>

                                            )
                                        )}

                                    </select>

                                </div>


                                {/* Phone */}

                                <div>

                                    <label
                                        style={
                                            fieldLabelStyle
                                        }
                                    >
                                        Phone
                                    </label>

                                    <input
                                        name="phone"
                                        value={
                                            form.phone
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Phone number"
                                        style={
                                            inputStyle
                                        }
                                    />

                                </div>


                                {/* Email */}

                                <div
                                    style={{
                                        gridColumn:
                                            '1 / -1'
                                    }}
                                >

                                    <label
                                        style={
                                            fieldLabelStyle
                                        }
                                    >
                                        Email
                                    </label>

                                    <input
                                        type="email"
                                        name="email"
                                        value={
                                            form.email
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="facility@example.com"
                                        style={
                                            inputStyle
                                        }
                                    />

                                </div>


                                {/* Address */}

                                <div
                                    style={{
                                        gridColumn:
                                            '1 / -1'
                                    }}
                                >

                                    <label
                                        style={
                                            fieldLabelStyle
                                        }
                                    >
                                        Address *
                                    </label>

                                    <textarea
                                        name="address"
                                        value={
                                            form.address
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Complete facility address"
                                        rows="3"
                                        style={{
                                            ...inputStyle,
                                            resize:
                                                'vertical'
                                        }}
                                    />

                                </div>


                                {/* Latitude */}

                                <div>

                                    <label
                                        style={
                                            fieldLabelStyle
                                        }
                                    >
                                        Latitude *
                                    </label>

                                    <input
                                        type="number"
                                        step="any"
                                        name="latitude"
                                        value={
                                            form.latitude
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="12.9716"
                                        style={
                                            inputStyle
                                        }
                                    />

                                </div>


                                {/* Longitude */}

                                <div>

                                    <label
                                        style={
                                            fieldLabelStyle
                                        }
                                    >
                                        Longitude *
                                    </label>

                                    <input
                                        type="number"
                                        step="any"
                                        name="longitude"
                                        value={
                                            form.longitude
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="77.5946"
                                        style={
                                            inputStyle
                                        }
                                    />

                                </div>


                                {/* Opening */}

                                <div>

                                    <label
                                        style={
                                            fieldLabelStyle
                                        }
                                    >
                                        Opening Time
                                    </label>

                                    <input
                                        type="time"
                                        name="opening_time"
                                        value={
                                            form.opening_time
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        style={
                                            inputStyle
                                        }
                                    />

                                </div>


                                {/* Closing */}

                                <div>

                                    <label
                                        style={
                                            fieldLabelStyle
                                        }
                                    >
                                        Closing Time
                                    </label>

                                    <input
                                        type="time"
                                        name="closing_time"
                                        value={
                                            form.closing_time
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        style={
                                            inputStyle
                                        }
                                    />

                                </div>


                                {/* Emergency */}

                                <label
                                    style={{
                                        gridColumn:
                                            '1 / -1',
                                        display:
                                            'flex',
                                        alignItems:
                                            'center',
                                        gap:
                                            '10px',
                                        padding:
                                            '12px',
                                        background:
                                            '#f8fafc',
                                        borderRadius:
                                            '10px',
                                        cursor:
                                            'pointer'
                                    }}
                                >

                                    <input
                                        type="checkbox"
                                        name="emergency_available"
                                        checked={
                                            form.emergency_available
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        style={{
                                            width:
                                                '18px',
                                            height:
                                                '18px'
                                        }}
                                    />

                                    <span
                                        style={{
                                            fontWeight:
                                                600,
                                            color:
                                                '#334155',
                                            fontSize:
                                                '14px'
                                        }}
                                    >
                                        Emergency services
                                        available
                                    </span>

                                </label>

                            </div>


                            {/* Modal footer */}

                            <div
                                style={{
                                    padding:
                                        '16px 24px',
                                    borderTop:
                                        '1px solid #e2e8f0',
                                    display:
                                        'flex',
                                    justifyContent:
                                        'flex-end',
                                    gap:
                                        '10px'
                                }}
                            >

                                <button
                                    type="button"
                                    onClick={
                                        closeModal
                                    }
                                    disabled={
                                        saving
                                    }
                                    style={{
                                        padding:
                                            '11px 18px',
                                        border:
                                            '1px solid #cbd5e1',
                                        background:
                                            '#fff',
                                        color:
                                            '#334155',
                                        borderRadius:
                                            '9px',
                                        fontWeight:
                                            600,
                                        cursor:
                                            'pointer'
                                    }}
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    disabled={
                                        saving
                                    }
                                    style={{
                                        padding:
                                            '11px 20px',
                                        border:
                                            'none',
                                        background:
                                            '#16a34a',
                                        color:
                                            '#fff',
                                        borderRadius:
                                            '9px',
                                        fontWeight:
                                            700,
                                        cursor:
                                            saving
                                                ? 'not-allowed'
                                                : 'pointer',
                                        opacity:
                                            saving
                                                ? 0.7
                                                : 1
                                    }}
                                >
                                    {saving
                                        ? 'Saving...'
                                        : editingFacility
                                            ? 'Update Facility'
                                            : 'Add Facility'}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}


// ============================================================
// Styles
// ============================================================

const cardStyle = {
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '14px',
    padding: '18px',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    boxShadow:
        '0 2px 8px rgba(15,23,42,0.04)'
};

const iconStyle = {
    width: '44px',
    height: '44px',
    borderRadius: '10px',
    background: '#f0fdf4',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px'
};

const labelStyle = {
    color: '#64748b',
    fontSize: '12px',
    fontWeight: 600,
    marginBottom: '4px'
};

const numberStyle = {
    color: '#0f172a',
    fontSize: '24px',
    fontWeight: 800
};

const thStyle = {
    padding: '13px 16px',
    textAlign: 'left',
    color: '#64748b',
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    fontWeight: 700
};

const tdStyle = {
    padding: '15px 16px',
    verticalAlign: 'middle',
    color: '#334155',
    fontSize: '13px'
};

const actionButtonStyle = {
    padding: '7px 10px',
    border: '1px solid #cbd5e1',
    background: '#fff',
    color: '#2563eb',
    borderRadius: '7px',
    fontSize: '12px',
    fontWeight: 700,
    cursor: 'pointer'
};

const fieldLabelStyle = {
    display: 'block',
    marginBottom: '7px',
    color: '#334155',
    fontSize: '13px',
    fontWeight: 700
};

const inputStyle = {
    width: '100%',
    boxSizing: 'border-box',
    padding: '11px 12px',
    border: '1px solid #cbd5e1',
    borderRadius: '9px',
    fontSize: '14px',
    color: '#0f172a',
    outline: 'none',
    background: '#fff'
};


export default AdminFacilities;