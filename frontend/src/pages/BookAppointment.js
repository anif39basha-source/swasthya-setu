import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from '../services/api';
import useStore from '../store/useStore';
import translations from '../translations';

// ============================================================
// BOOK APPOINTMENT TRANSLATIONS
// ============================================================

const appointmentTranslations = {
  en: {
    bookAppointment: 'Book Appointment',
    scheduleVisit: 'Schedule a visit at a nearby healthcare facility',

    facility: 'Facility',
    department: 'Department',
    doctor: 'Doctor',
    dateTime: 'Date/Time',
    confirm: 'Confirm',

    selectHealthcareFacility: 'Select Healthcare Facility',
    loadingHealthcareFacilities: 'Loading healthcare facilities...',
    noFacilitiesAvailable: 'No facilities available',
    tryAgain: 'Try Again',
    healthcareFacility: 'Healthcare Facility',

    selectDepartment: 'Select Department',

    selectDoctor: 'Select Doctor',
    doctorSelectionOptional: 'Doctor selection is optional.',
    loadingDoctors: 'Loading doctors...',
    skipAnyDoctor: 'Skip — Any available doctor',
    noDoctorsListed: 'No doctors listed',
    continueAnyDoctor:
      'You can continue and request any available doctor.',
    continueWithoutDoctor: 'Continue Without Doctor',

    selectDateTime: 'Select Date & Time',
    appointmentDate: 'Appointment Date',
    appointmentTime: 'Appointment Time',

    notes: 'Notes',
    optional: 'Optional',
    notesPlaceholder: 'Mention any important concerns...',

    confirmAppointment: 'Confirm Appointment',
    facilityLabel: 'Facility',
    notSelected: 'Not selected',
    departmentLabel: 'Department',
    doctorLabel: 'Doctor',
    anyAvailableDoctor: 'Any Available Doctor',
    date: 'Date',
    time: 'Time',

    back: 'Back',
    next: 'Next',
    booking: 'Booking...',

    pleaseCompleteRequired:
      'Please complete the required information before continuing.',
    patientProfileNotFound:
      'Patient profile was not found. Please complete your profile first.',
    unableToLoadPatient:
      'Unable to load your patient profile.',
    noHealthcareFacilities:
      'No healthcare facilities are currently available.',
    unableToLoadFacilities:
      'Unable to load healthcare facilities. Please try again.',
    pleaseSelectFacility:
      'Please select a healthcare facility.',
    pleaseSelectDepartment:
      'Please select a department.',
    pleaseSelectDateTime:
      'Please select both date and time.',
    patientProfileUnavailable:
      'Patient profile is not available. Please complete your patient profile first.',
    unableToBook:
      'Unable to book appointment. Please try again.',
    failedToBook:
      'Failed to book appointment. Please try again.',
    appointmentBooked:
      'Appointment booked successfully!',

    generalMedicine: 'General Medicine',
    pediatrics: 'Pediatrics',
    gynecology: 'Gynecology',
    cardiology: 'Cardiology',
    orthopedics: 'Orthopedics',
    ent: 'ENT',
    dermatology: 'Dermatology',
    dental: 'Dental'
  },

  hi: {
    bookAppointment: 'अपॉइंटमेंट बुक करें',
    scheduleVisit: 'नजदीकी स्वास्थ्य केंद्र में अपनी भेंट निर्धारित करें',

    facility: 'स्वास्थ्य केंद्र',
    department: 'विभाग',
    doctor: 'डॉक्टर',
    dateTime: 'दिनांक/समय',
    confirm: 'पुष्टि करें',

    selectHealthcareFacility: 'स्वास्थ्य केंद्र चुनें',
    loadingHealthcareFacilities: 'स्वास्थ्य केंद्र लोड हो रहे हैं...',
    noFacilitiesAvailable: 'कोई स्वास्थ्य केंद्र उपलब्ध नहीं है',
    tryAgain: 'फिर से प्रयास करें',
    healthcareFacility: 'स्वास्थ्य केंद्र',

    selectDepartment: 'विभाग चुनें',

    selectDoctor: 'डॉक्टर चुनें',
    doctorSelectionOptional: 'डॉक्टर चुनना वैकल्पिक है।',
    loadingDoctors: 'डॉक्टरों की सूची लोड हो रही है...',
    skipAnyDoctor: 'छोड़ें — कोई भी उपलब्ध डॉक्टर',
    noDoctorsListed: 'कोई डॉक्टर सूचीबद्ध नहीं है',
    continueAnyDoctor:
      'आप आगे बढ़कर किसी भी उपलब्ध डॉक्टर का अनुरोध कर सकते हैं।',
    continueWithoutDoctor: 'डॉक्टर के बिना जारी रखें',

    selectDateTime: 'दिनांक और समय चुनें',
    appointmentDate: 'अपॉइंटमेंट की दिनांक',
    appointmentTime: 'अपॉइंटमेंट का समय',

    notes: 'टिप्पणियां',
    optional: 'वैकल्पिक',
    notesPlaceholder: 'कोई महत्वपूर्ण समस्या या जानकारी लिखें...',

    confirmAppointment: 'अपॉइंटमेंट की पुष्टि करें',
    facilityLabel: 'स्वास्थ्य केंद्र',
    notSelected: 'चयनित नहीं',
    departmentLabel: 'विभाग',
    doctorLabel: 'डॉक्टर',
    anyAvailableDoctor: 'कोई भी उपलब्ध डॉक्टर',
    date: 'दिनांक',
    time: 'समय',

    back: 'पीछे',
    next: 'आगे',
    booking: 'बुक हो रहा है...',

    pleaseCompleteRequired:
      'कृपया आगे बढ़ने से पहले आवश्यक जानकारी पूरी करें।',
    patientProfileNotFound:
      'मरीज की प्रोफ़ाइल नहीं मिली। कृपया पहले अपनी प्रोफ़ाइल पूरी करें।',
    unableToLoadPatient:
      'आपकी मरीज प्रोफ़ाइल लोड नहीं हो सकी।',
    noHealthcareFacilities:
      'वर्तमान में कोई स्वास्थ्य केंद्र उपलब्ध नहीं है।',
    unableToLoadFacilities:
      'स्वास्थ्य केंद्र लोड नहीं हो सके। कृपया फिर से प्रयास करें।',
    pleaseSelectFacility:
      'कृपया स्वास्थ्य केंद्र चुनें।',
    pleaseSelectDepartment:
      'कृपया विभाग चुनें।',
    pleaseSelectDateTime:
      'कृपया दिनांक और समय दोनों चुनें।',
    patientProfileUnavailable:
      'मरीज की प्रोफ़ाइल उपलब्ध नहीं है। कृपया पहले अपनी प्रोफ़ाइल पूरी करें।',
    unableToBook:
      'अपॉइंटमेंट बुक नहीं हो सकी। कृपया फिर से प्रयास करें।',
    failedToBook:
      'अपॉइंटमेंट बुक करने में समस्या हुई। कृपया फिर से प्रयास करें।',
    appointmentBooked:
      'अपॉइंटमेंट सफलतापूर्वक बुक हो गई!',

    generalMedicine: 'सामान्य चिकित्सा',
    pediatrics: 'बाल चिकित्सा',
    gynecology: 'स्त्री रोग',
    cardiology: 'हृदय रोग',
    orthopedics: 'हड्डी रोग',
    ent: 'कान, नाक और गला',
    dermatology: 'त्वचा रोग',
    dental: 'दंत चिकित्सा'
  },

  kn: {
    bookAppointment: 'ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಬುಕ್ ಮಾಡಿ',
    scheduleVisit: 'ಹತ್ತಿರದ ಆರೋಗ್ಯ ಕೇಂದ್ರದಲ್ಲಿ ನಿಮ್ಮ ಭೇಟಿಯನ್ನು ನಿಗದಿಪಡಿಸಿ',

    facility: 'ಆರೋಗ್ಯ ಕೇಂದ್ರ',
    department: 'ವಿಭಾಗ',
    doctor: 'ವೈದ್ಯರು',
    dateTime: 'ದಿನಾಂಕ/ಸಮಯ',
    confirm: 'ದೃಢೀಕರಿಸಿ',

    selectHealthcareFacility: 'ಆರೋಗ್ಯ ಕೇಂದ್ರವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    loadingHealthcareFacilities: 'ಆರೋಗ್ಯ ಕೇಂದ್ರಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...',
    noFacilitiesAvailable: 'ಯಾವುದೇ ಆರೋಗ್ಯ ಕೇಂದ್ರಗಳು ಲಭ್ಯವಿಲ್ಲ',
    tryAgain: 'ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ',
    healthcareFacility: 'ಆರೋಗ್ಯ ಕೇಂದ್ರ',

    selectDepartment: 'ವಿಭಾಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ',

    selectDoctor: 'ವೈದ್ಯರನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    doctorSelectionOptional: 'ವೈದ್ಯರನ್ನು ಆಯ್ಕೆ ಮಾಡುವುದು ಐಚ್ಛಿಕವಾಗಿದೆ.',
    loadingDoctors: 'ವೈದ್ಯರ ಪಟ್ಟಿಯನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...',
    skipAnyDoctor: 'ಬಿಟ್ಟುಬಿಡಿ — ಯಾವುದೇ ಲಭ್ಯವಿರುವ ವೈದ್ಯರು',
    noDoctorsListed: 'ಯಾವುದೇ ವೈದ್ಯರು ಪಟ್ಟಿಯಲ್ಲಿಲ್ಲ',
    continueAnyDoctor:
      'ನೀವು ಮುಂದುವರಿದು ಯಾವುದೇ ಲಭ್ಯವಿರುವ ವೈದ್ಯರನ್ನು ವಿನಂತಿಸಬಹುದು.',
    continueWithoutDoctor: 'ವೈದ್ಯರಿಲ್ಲದೆ ಮುಂದುವರಿಸಿ',

    selectDateTime: 'ದಿನಾಂಕ ಮತ್ತು ಸಮಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    appointmentDate: 'ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ದಿನಾಂಕ',
    appointmentTime: 'ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಸಮಯ',

    notes: 'ಟಿಪ್ಪಣಿಗಳು',
    optional: 'ಐಚ್ಛಿಕ',
    notesPlaceholder: 'ಯಾವುದೇ ಪ್ರಮುಖ ಸಮಸ್ಯೆಗಳು ಅಥವಾ ಮಾಹಿತಿಯನ್ನು ನಮೂದಿಸಿ...',

    confirmAppointment: 'ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ದೃಢೀಕರಿಸಿ',
    facilityLabel: 'ಆರೋಗ್ಯ ಕೇಂದ್ರ',
    notSelected: 'ಆಯ್ಕೆ ಮಾಡಲಾಗಿಲ್ಲ',
    departmentLabel: 'ವಿಭಾಗ',
    doctorLabel: 'ವೈದ್ಯರು',
    anyAvailableDoctor: 'ಯಾವುದೇ ಲಭ್ಯವಿರುವ ವೈದ್ಯರು',
    date: 'ದಿನಾಂಕ',
    time: 'ಸಮಯ',

    back: 'ಹಿಂದೆ',
    next: 'ಮುಂದೆ',
    booking: 'ಬುಕ್ ಮಾಡಲಾಗುತ್ತಿದೆ...',

    pleaseCompleteRequired:
      'ಮುಂದುವರಿಯುವ ಮೊದಲು ಅಗತ್ಯ ಮಾಹಿತಿಯನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ.',
    patientProfileNotFound:
      'ರೋಗಿಯ ಪ್ರೊಫೈಲ್ ಕಂಡುಬಂದಿಲ್ಲ. ದಯವಿಟ್ಟು ಮೊದಲು ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಪೂರ್ಣಗೊಳಿಸಿ.',
    unableToLoadPatient:
      'ನಿಮ್ಮ ರೋಗಿಯ ಪ್ರೊಫೈಲ್ ಲೋಡ್ ಮಾಡಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.',
    noHealthcareFacilities:
      'ಪ್ರಸ್ತುತ ಯಾವುದೇ ಆರೋಗ್ಯ ಕೇಂದ್ರಗಳು ಲಭ್ಯವಿಲ್ಲ.',
    unableToLoadFacilities:
      'ಆರೋಗ್ಯ ಕೇಂದ್ರಗಳನ್ನು ಲೋಡ್ ಮಾಡಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
    pleaseSelectFacility:
      'ದಯವಿಟ್ಟು ಆರೋಗ್ಯ ಕೇಂದ್ರವನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
    pleaseSelectDepartment:
      'ದಯವಿಟ್ಟು ವಿಭಾಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
    pleaseSelectDateTime:
      'ದಯವಿಟ್ಟು ದಿನಾಂಕ ಮತ್ತು ಸಮಯ ಎರಡನ್ನೂ ಆಯ್ಕೆಮಾಡಿ.',
    patientProfileUnavailable:
      'ರೋಗಿಯ ಪ್ರೊಫೈಲ್ ಲಭ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು ಮೊದಲು ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಪೂರ್ಣಗೊಳಿಸಿ.',
    unableToBook:
      'ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಬುಕ್ ಮಾಡಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
    failedToBook:
      'ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಬುಕ್ ಮಾಡುವಲ್ಲಿ ಸಮಸ್ಯೆ ಉಂಟಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
    appointmentBooked:
      'ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಯಶಸ್ವಿಯಾಗಿ ಬುಕ್ ಮಾಡಲಾಗಿದೆ!',

    generalMedicine: 'ಸಾಮಾನ್ಯ ವೈದ್ಯಕೀಯ',
    pediatrics: 'ಮಕ್ಕಳ ವೈದ್ಯಕೀಯ',
    gynecology: 'ಸ್ತ್ರೀರೋಗ ಶಾಸ್ತ್ರ',
    cardiology: 'ಹೃದ್ರೋಗ',
    orthopedics: 'ಮೂಳೆ ವೈದ್ಯಕೀಯ',
    ent: 'ಕಿವಿ, ಮೂಗು ಮತ್ತು ಗಂಟಲು',
    dermatology: 'ಚರ್ಮರೋಗ',
    dental: 'ದಂತ ವೈದ್ಯಕೀಯ'
  }
};

// ============================================================
// COMPONENT
// ============================================================

const BookAppointment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { user, selectedLanguage } = useStore(
    (state) => state
  );

  const language = selectedLanguage || 'en';

  const t = {
    ...(translations[language] || translations.en),
    ...(appointmentTranslations[language] ||
      appointmentTranslations.en)
  };

  const initialFacility = searchParams.get('facility');

  const [step, setStep] = useState(1);
  const [facilities, setFacilities] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [loadingFacilities, setLoadingFacilities] = useState(true);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loading, setLoading] = useState(false);

  const [patientId, setPatientId] = useState(null);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    facility_id: initialFacility || '',
    department: '',
    doctor_id: '',
    appointment_date: '',
    appointment_time: '',
    patient_name: user?.name || '',
    patient_phone: user?.phone || '',
    notes: ''
  });

  // ============================================================
  // TODAY'S DATE
  // ============================================================

  const today = new Date()
    .toISOString()
    .split('T')[0];

  // ============================================================
  // LOAD DATA
  // ============================================================

  useEffect(() => {
    loadFacilities();
    loadPatient();
  }, []);

  useEffect(() => {
    if (formData.facility_id) {
      loadDoctors(formData.facility_id);
    } else {
      setDoctors([]);
    }
  }, [formData.facility_id]);

  // ============================================================
  // LOAD PATIENT
  // ============================================================

  const loadPatient = async () => {
    try {
      const response = await axios.get(
        '/users/me/patient'
      );

      const id =
        response.data?.data?.id || null;

      setPatientId(id);

      if (!id) {
        setError(
          t.patientProfileNotFound
        );
      }
    } catch (err) {
      console.error(
        'Failed to load patient:',
        err
      );

      setError(
        t.unableToLoadPatient
      );
    }
  };

  // ============================================================
  // LOAD FACILITIES
  // ============================================================

  const loadFacilities = async () => {
    setLoadingFacilities(true);
    setError('');

    try {
      const response = await axios.get(
        '/facilities'
      );

      const data =
        response.data?.data || [];

      setFacilities(data);

      if (data.length === 0) {
        setError(
          t.noHealthcareFacilities
        );
      }
    } catch (err) {
      console.error(
        'Failed to load facilities:',
        err
      );

      setError(
        t.unableToLoadFacilities
      );
    } finally {
      setLoadingFacilities(false);
    }
  };

  // ============================================================
  // LOAD DOCTORS
  // ============================================================

  const loadDoctors = async (facilityId) => {
    setLoadingDoctors(true);

    try {
      const response = await axios.get(
        `/doctors?facility_id=${encodeURIComponent(
          facilityId
        )}`
      );

      setDoctors(
        response.data?.data || []
      );
    } catch (err) {
      console.error(
        'Failed to load doctors:',
        err
      );

      setDoctors([]);
    } finally {
      setLoadingDoctors(false);
    }
  };

  // ============================================================
  // UPDATE FORM
  // ============================================================

  const updateForm = (
    field,
    value
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));

    setError('');
  };

  // ============================================================
  // NAVIGATION
  // ============================================================

  const handleNext = () => {
    if (!isStepValid()) {
      setError(
        t.pleaseCompleteRequired
      );
      return;
    }

    setError('');

    if (step < 5) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setError('');

    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  // ============================================================
  // VALIDATION
  // ============================================================

  const isStepValid = () => {
    switch (step) {
      case 1:
        return !!formData.facility_id;

      case 2:
        return !!formData.department;

      case 3:
        return true;

      case 4:
        return (
          !!formData.appointment_date &&
          !!formData.appointment_time
        );

      case 5:
        return true;

      default:
        return false;
    }
  };

  // ============================================================
  // BOOK APPOINTMENT
  // ============================================================

  const handleSubmit = async () => {
    setError('');

    if (!patientId) {
      setError(
        t.patientProfileUnavailable
      );
      return;
    }

    if (!formData.facility_id) {
      setError(
        t.pleaseSelectFacility
      );
      return;
    }

    if (!formData.department) {
      setError(
        t.pleaseSelectDepartment
      );
      return;
    }

    if (
      !formData.appointment_date ||
      !formData.appointment_time
    ) {
      setError(
        t.pleaseSelectDateTime
      );
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        '/appointments',
        {
          patient_id: patientId,
          facility_id:
            formData.facility_id,
          doctor_id:
            formData.doctor_id || null,
          department:
            formData.department,
          appointment_date:
            formData.appointment_date,
          appointment_time:
            formData.appointment_time,
          notes:
            formData.notes.trim()
        }
      );

      if (response.data?.success) {
        alert(
          `✅ ${t.appointmentBooked}`
        );

        navigate('/appointments');
      } else {
        setError(
          response.data?.message ||
            t.unableToBook
        );
      }
    } catch (err) {
      console.error(
        'Booking failed:',
        err
      );

      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        t.failedToBook;

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // HELPERS
  // ============================================================

  const selectedFacility =
    facilities.find(
      (facility) =>
        facility.id ===
        formData.facility_id
    );

  const selectedDoctor =
    doctors.find(
      (doctor) =>
        doctor.id ===
        formData.doctor_id
    );

  const formatFacilityType = (type) => {
    if (!type) {
      return t.healthcareFacility;
    }

    const value = String(type)
      .replace(/_/g, ' ')
      .toLowerCase();

    const typeTranslations = {
      phc: {
        en: 'PHC',
        hi: 'PHC',
        kn: 'PHC'
      },
      chc: {
        en: 'CHC',
        hi: 'CHC',
        kn: 'CHC'
      },
      hospital: {
        en: 'Hospital',
        hi: 'अस्पताल',
        kn: 'ಆಸ್ಪತ್ರೆ'
      },
      district_hospital: {
        en: 'District Hospital',
        hi: 'जिला अस्पताल',
        kn: 'ಜಿಲ್ಲಾ ಆಸ್ಪತ್ರೆ'
      }
    };

    const key = value.replace(/ /g, '_');

    if (typeTranslations[key]) {
      return (
        typeTranslations[key][language] ||
        typeTranslations[key].en
      );
    }

    return value
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };

  // ============================================================
  // DEPARTMENTS
  // ============================================================

  const departments = [
    {
      value: 'General Medicine',
      label: t.generalMedicine
    },
    {
      value: 'Pediatrics',
      label: t.pediatrics
    },
    {
      value: 'Gynecology',
      label: t.gynecology
    },
    {
      value: 'Cardiology',
      label: t.cardiology
    },
    {
      value: 'Orthopedics',
      label: t.orthopedics
    },
    {
      value: 'ENT',
      label: t.ent
    },
    {
      value: 'Dermatology',
      label: t.dermatology
    },
    {
      value: 'Dental',
      label: t.dental
    }
  ];

  // ============================================================
  // TIME SLOTS
  // ============================================================

  const timeSlots = [
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00'
  ];

  // ============================================================
  // DOCTOR DISPLAY
  // ============================================================

  const getDoctorName = (name) => {
    if (!name) {
      return t.anyAvailableDoctor;
    }

    const cleanName = String(name).trim();

    if (
      cleanName.toLowerCase().startsWith('dr.')
    ) {
      return cleanName;
    }

    return `${t.doctor === 'Doctor' ? 'Dr.' : t.doctor} ${cleanName}`;
  };

  // ============================================================
  // DATE FORMAT
  // ============================================================

  const formatDate = (date) => {
    if (!date) return '';

    const locale =
      language === 'hi'
        ? 'hi-IN'
        : language === 'kn'
        ? 'kn-IN'
        : 'en-IN';

    return new Date(date).toLocaleDateString(
      locale,
      {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }
    );
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="max-w-3xl mx-auto space-y-4">

      {/* ======================================================
          HEADER
          ====================================================== */}

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">

        <h1 className="text-2xl font-bold text-gray-800">
          📅 {t.bookAppointment}
        </h1>

        <p className="text-gray-500 mt-1 mb-6">
          {t.scheduleVisit}
        </p>

        {/* ERROR */}

        {error && (
          <div className="mb-5 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* ====================================================
            PROGRESS
            ==================================================== */}

        <div className="flex justify-between mb-8">

          {[
            t.facility,
            t.department,
            t.doctor,
            t.dateTime,
            t.confirm
          ].map((label, index) => {

            const number = index + 1;

            return (
              <div
                key={number}
                className="flex flex-col items-center flex-1"
              >

                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${
                    number <= step
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {number}
                </div>

                <div className="text-xs mt-1 text-gray-500 text-center">
                  {label}
                </div>

              </div>
            );
          })}

        </div>

        {/* ====================================================
            STEP 1 — FACILITY
            ==================================================== */}

        {step === 1 && (
          <div>

            <h2 className="font-bold text-gray-800 mb-4">
              🏥 {t.selectHealthcareFacility}
            </h2>

            {loadingFacilities ? (

              <div className="text-center py-10">

                <div className="text-4xl animate-pulse">
                  🏥
                </div>

                <p className="text-gray-500 mt-3">
                  {t.loadingHealthcareFacilities}
                </p>

              </div>

            ) : facilities.length === 0 ? (

              <div className="text-center py-10 bg-gray-50 rounded-lg">

                <div className="text-4xl">
                  🏥
                </div>

                <p className="font-medium text-gray-700 mt-3">
                  {t.noFacilitiesAvailable}
                </p>

                <button
                  onClick={loadFacilities}
                  className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg"
                >
                  🔄 {t.tryAgain}
                </button>

              </div>

            ) : (

              <div className="space-y-3">

                {facilities.map(
                  (facility) => (

                    <label
                      key={facility.id}
                      className={`block p-4 border rounded-xl cursor-pointer transition ${
                        formData.facility_id ===
                        facility.id
                          ? 'border-primary-500 bg-primary-50 shadow-sm'
                          : 'border-gray-200 hover:border-primary-300'
                      }`}
                    >

                      <div className="flex items-start">

                        <input
                          type="radio"
                          name="facility"
                          value={facility.id}
                          checked={
                            formData.facility_id ===
                            facility.id
                          }
                          onChange={(e) =>
                            updateForm(
                              'facility_id',
                              e.target.value
                            )
                          }
                          className="mt-1 mr-3"
                        />

                        <div className="flex-1">

                          <div className="font-semibold text-gray-800">
                            {facility.name}
                          </div>

                          <div className="text-sm text-primary-600 mt-1">
                            {formatFacilityType(
                              facility.type
                            )}
                          </div>

                          {facility.address && (
                            <div className="text-sm text-gray-500 mt-1">
                              📍 {facility.address}
                            </div>
                          )}

                          {facility.phone && (
                            <div className="text-sm text-gray-500 mt-1">
                              📞 {facility.phone}
                            </div>
                          )}

                        </div>

                      </div>

                    </label>

                  )
                )}

              </div>

            )}

          </div>
        )}

        {/* ====================================================
            STEP 2 — DEPARTMENT
            ==================================================== */}

        {step === 2 && (
          <div>

            <h2 className="font-bold text-gray-800 mb-4">
              🩺 {t.selectDepartment}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

              {departments.map(
                (dept) => (

                  <label
                    key={dept.value}
                    className={`p-4 border rounded-xl cursor-pointer transition ${
                      formData.department ===
                      dept.value
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                  >

                    <input
                      type="radio"
                      name="department"
                      value={dept.value}
                      checked={
                        formData.department ===
                        dept.value
                      }
                      onChange={(e) =>
                        updateForm(
                          'department',
                          e.target.value
                        )
                      }
                      className="mr-2"
                    />

                    <span className="text-gray-800 font-medium">
                      {dept.label}
                    </span>

                  </label>

                )
              )}

            </div>

          </div>
        )}

        {/* ====================================================
            STEP 3 — DOCTOR
            ==================================================== */}

        {step === 3 && (
          <div>

            <h2 className="font-bold text-gray-800 mb-2">
              👨‍⚕️ {t.selectDoctor}
            </h2>

            <p className="text-sm text-gray-500 mb-5">
              {t.doctorSelectionOptional}
            </p>

            {loadingDoctors ? (

              <div className="text-center py-8">

                <div className="text-3xl animate-pulse">
                  👨‍⚕️
                </div>

                <p className="text-gray-500 mt-2">
                  {t.loadingDoctors}
                </p>

              </div>

            ) : doctors.length > 0 ? (

              <div className="space-y-3">

                {doctors.map(
                  (doctor) => (

                    <label
                      key={doctor.id}
                      className={`block p-4 border rounded-xl cursor-pointer ${
                        formData.doctor_id ===
                        doctor.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-primary-300'
                      }`}
                    >

                      <div className="flex items-start">

                        <input
                          type="radio"
                          name="doctor"
                          value={doctor.id}
                          checked={
                            formData.doctor_id ===
                            doctor.id
                          }
                          onChange={(e) =>
                            updateForm(
                              'doctor_id',
                              e.target.value
                            )
                          }
                          className="mt-1 mr-3"
                        />

                        <div>

                          <div className="font-semibold text-gray-800">
                            {getDoctorName(
                              doctor.name
                            )}
                          </div>

                          <div className="text-sm text-gray-500 mt-1">
                            {doctor.department ||
                              t.generalMedicine}

                            {doctor.qualification
                              ? ` • ${doctor.qualification}`
                              : ''}
                          </div>

                        </div>

                      </div>

                    </label>

                  )
                )}

                <button
                  type="button"
                  onClick={() =>
                    updateForm(
                      'doctor_id',
                      ''
                    )
                  }
                  className="text-sm text-primary-600 hover:underline"
                >
                  {t.skipAnyDoctor}
                </button>

              </div>

            ) : (

              <div className="bg-gray-50 rounded-lg p-6 text-center">

                <div className="text-3xl">
                  👨‍⚕️
                </div>

                <p className="font-medium text-gray-700 mt-2">
                  {t.noDoctorsListed}
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  {t.continueAnyDoctor}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    updateForm(
                      'doctor_id',
                      ''
                    )
                  }
                  className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg"
                >
                  {t.continueWithoutDoctor}
                </button>

              </div>

            )}

          </div>
        )}

        {/* ====================================================
            STEP 4 — DATE & TIME
            ==================================================== */}

        {step === 4 && (
          <div>

            <h2 className="font-bold text-gray-800 mb-5">
              🕐 {t.selectDateTime}
            </h2>

            <div className="space-y-5">

              {/* DATE */}

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.appointmentDate}
                </label>

                <input
                  type="date"
                  min={today}
                  value={
                    formData.appointment_date
                  }
                  onChange={(e) =>
                    updateForm(
                      'appointment_date',
                      e.target.value
                    )
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />

              </div>

              {/* TIME */}

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.appointmentTime}
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">

                  {timeSlots.map(
                    (time) => {

                      const value =
                        `${time}:00`;

                      return (
                        <button
                          key={time}
                          type="button"
                          onClick={() =>
                            updateForm(
                              'appointment_time',
                              value
                            )
                          }
                          className={`py-3 px-3 border rounded-lg transition ${
                            formData.appointment_time ===
                            value
                              ? 'border-primary-500 bg-primary-50 text-primary-700 font-semibold'
                              : 'border-gray-200 hover:border-primary-300'
                          }`}
                        >
                          🕐 {time}
                        </button>
                      );

                    }
                  )}

                </div>

              </div>

              {/* NOTES */}

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.notes}{' '}
                  <span className="text-gray-400">
                    ({t.optional})
                  </span>
                </label>

                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    updateForm(
                      'notes',
                      e.target.value
                    )
                  }
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  placeholder={
                    t.notesPlaceholder
                  }
                />

              </div>

            </div>

          </div>
        )}

        {/* ====================================================
            STEP 5 — CONFIRM
            ==================================================== */}

        {step === 5 && (
          <div>

            <h2 className="font-bold text-gray-800 mb-5">
              ✅ {t.confirmAppointment}
            </h2>

            <div className="bg-gray-50 rounded-xl p-5 space-y-4">

              {/* FACILITY */}

              <div>

                <div className="text-sm text-gray-500">
                  {t.facilityLabel}
                </div>

                <div className="font-semibold text-gray-800">
                  {selectedFacility?.name ||
                    t.notSelected}
                </div>

                {selectedFacility?.address && (
                  <div className="text-sm text-gray-500">
                    📍 {selectedFacility.address}
                  </div>
                )}

              </div>

              {/* DEPARTMENT */}

              <div>

                <div className="text-sm text-gray-500">
                  {t.departmentLabel}
                </div>

                <div className="font-semibold text-gray-800">

                  {
                    departments.find(
                      (dept) =>
                        dept.value ===
                        formData.department
                    )?.label ||
                      formData.department
                  }

                </div>

              </div>

              {/* DOCTOR */}

              <div>

                <div className="text-sm text-gray-500">
                  {t.doctorLabel}
                </div>

                <div className="font-semibold text-gray-800">

                  {selectedDoctor
                    ? getDoctorName(
                        selectedDoctor.name
                      )
                    : t.anyAvailableDoctor}

                </div>

              </div>

              {/* DATE */}

              <div>

                <div className="text-sm text-gray-500">
                  {t.date}
                </div>

                <div className="font-semibold text-gray-800">
                  📅{' '}
                  {formatDate(
                    formData.appointment_date
                  )}
                </div>

              </div>

              {/* TIME */}

              <div>

                <div className="text-sm text-gray-500">
                  {t.time}
                </div>

                <div className="font-semibold text-gray-800">
                  🕐 {formData.appointment_time}
                </div>

              </div>

              {/* NOTES */}

              {formData.notes && (
                <div>

                  <div className="text-sm text-gray-500">
                    {t.notes}
                  </div>

                  <div className="text-gray-800">
                    {formData.notes}
                  </div>

                </div>
              )}

            </div>

          </div>
        )}

        {/* ====================================================
            NAVIGATION
            ==================================================== */}

        <div className="flex justify-between items-center mt-8 pt-5 border-t border-gray-100">

          {/* BACK */}

          <button
            type="button"
            onClick={handleBack}
            disabled={
              step === 1 || loading
            }
            className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 disabled:opacity-40"
          >
            ← {t.back}
          </button>

          {/* NEXT */}

          {step < 5 ? (

            <button
              type="button"
              onClick={handleNext}
              disabled={
                !isStepValid() ||
                loading
              }
              className="px-6 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-40"
            >
              {t.next} →
            </button>

          ) : (

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loading
                ? `🔄 ${t.booking}`
                : `✅ ${t.confirmAppointment}`}
            </button>

          )}

        </div>

      </div>
    </div>
  );
};

export default BookAppointment;