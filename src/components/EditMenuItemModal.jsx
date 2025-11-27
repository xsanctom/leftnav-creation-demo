import React, { useState, useEffect, useRef } from 'react';
import { useMenu } from '../context/MenuContext';
import TimePickerInput from './TimePickerInput';
import DatePickerInput from './DatePickerInput';
import MultiSelectDropdown from './MultiSelectDropdown';
import StarRatingSelector from './StarRatingSelector';
import { 
  calculateEarliestBooking, 
  calculateLatestBooking, 
  getFurthestPreviewText, 
  getClosestPreviewText 
} from '../utils/bookingCalculations';
import './EditMenuItemModal.css';

const DAYS = ['M', 'Tu', 'W', 'Th', 'F', 'Sa', 'Su'];
const DAY_LABELS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MEALS = ['Breakfast', 'Lunch', 'Tea', 'Dinner', 'Late'];
const CATEGORIES = ['Courses', 'Appetizers', 'Main Courses', 'Desserts', 'Beverages', 'Specials'];

// Booking rules constants
const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
  { value: 'zh', label: 'Chinese' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'ru', label: 'Russian' },
  { value: 'ar', label: 'Arabic' },
  { value: 'th', label: 'Thai' },
];

const ORDER_OPTIONS = [
  { value: 0, label: '0' },
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  { value: 5, label: '5' },
  { value: 6, label: '6' },
  { value: 7, label: '7' },
  { value: 8, label: '8' },
  { value: 9, label: '9' },
  { value: 10, label: '10+' },
];

const MAX_ORDER_OPTIONS = [
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  { value: 5, label: '5' },
  { value: 6, label: '6' },
  { value: 7, label: '7' },
  { value: 8, label: '8' },
  { value: 9, label: '9' },
  { value: 10, label: '10' },
  { value: 15, label: '15' },
  { value: 20, label: '20+' },
  { value: null, label: 'Unlimited' },
];

const TIME_UNITS = [
  { value: 'days', label: 'days' },
  { value: 'hours', label: 'hours' },
];

const TIME_UNITS_EXTENDED = [
  { value: 'days', label: 'days' },
  { value: 'hours', label: 'hours' },
  { value: 'months', label: 'months' },
];

const DURATION_OPTIONS = [
  { value: null, label: 'Use Venue Default' },
  { value: '30m', label: '30m' },
  { value: '45m', label: '45m' },
  { value: '1hr', label: '1hr' },
  { value: '1hr 15m', label: '1hr 15m' },
  { value: '1hr 30m', label: '1hr 30m' },
  { value: '1hr 45m', label: '1hr 45m' },
  { value: '2hr', label: '2hr' },
  { value: '2hr 15m', label: '2hr 15m' },
  { value: '2hr 30m', label: '2hr 30m' },
  { value: '2hr 45m', label: '2hr 45m' },
  { value: '3hr', label: '3hr' },
  { value: '3hr 15m', label: '3hr 15m' },
  { value: '3hr 30m', label: '3hr 30m' },
  { value: '3hr 45m', label: '3hr 45m' },
  { value: '4hr', label: '4hr' },
  { value: '4hr 30m', label: '4hr 30m' },
  { value: '5hr', label: '5hr' },
  { value: '5hr 30m', label: '5hr 30m' },
  { value: '6hr', label: '6hr' },
  { value: '6hr 30m', label: '6hr 30m' },
  { value: '7hr', label: '7hr' },
  { value: '7hr 30m', label: '7hr 30m' },
  { value: '8hr', label: '8hr' },
  { value: '9hr', label: '9hr' },
  { value: '10hr', label: '10hr' },
  { value: '11hr', label: '11hr' },
  { value: '12hr', label: '12hr' },
  { value: '13hr', label: '13hr' },
  { value: '14hr', label: '14hr' },
  { value: '15hr', label: '15hr' },
  { value: '16hr', label: '16hr' },
];

const PAYMENT_TYPE_OPTIONS = [
  { value: 'useVenueDefault', label: 'Use Venue Default' },
  { value: 'prepayRequired', label: 'Prepay Required' },
  { value: 'authRequired', label: 'Auth Required' },
  { value: 'prepayOptional', label: 'Prepay Optional' },
  { value: 'authOptional', label: 'Auth Optional' },
  { value: 'notAllowed', label: 'Not Allowed' },
];

const PAYMENT_REQUIRED_INTERNATIONAL_OPTIONS = [
  { value: 'useVenueDefault', label: 'Use Venue Default' },
  { value: 'enabled', label: 'Enabled' },
  { value: 'disabled', label: 'Disabled' },
];

const REQUIRE_PAYMENT_FOR_GROUPS_OPTIONS = [
  { value: '', label: '-' },
  { value: '1', label: '1 Person' },
  { value: '2', label: '2 People' },
  { value: '3', label: '3 People' },
  { value: '4', label: '4 People' },
  { value: '5', label: '5 People' },
  { value: '6', label: '6 People' },
  { value: '7', label: '7 People' },
  { value: '8', label: '8 People' },
  { value: '9', label: '9 People' },
  { value: '10', label: '10 People' },
  { value: '11', label: '11 People' },
  { value: '12', label: '12 People' },
  { value: '13', label: '13 People' },
  { value: '14', label: '14 People' },
  { value: '15', label: '15 People' },
  { value: '16', label: '16 People' },
  { value: '17', label: '17 People' },
  { value: '18', label: '18 People' },
  { value: '19', label: '19 People' },
  { value: '20', label: '20 People' },
  { value: '21', label: '21 People' },
  { value: '22', label: '22 People' },
  { value: '23', label: '23 People' },
  { value: '24', label: '24 People' },
  { value: '25', label: '25 People' },
];

const CANCEL_FEE_RULE_TYPES = [
  { value: 'percent', label: 'Percent (%)' },
  { value: 'amountPerGroup', label: 'Amount per Group' },
  { value: 'amountPerPax', label: 'Amount per Pax' },
];

const ADVANCE_TIME_OPTIONS = [
  { value: '', label: 'Base Setting' },
  { value: '15m', label: '15m' },
  { value: '30m', label: '30m' },
  { value: '45m', label: '45m' },
  { value: '1hr', label: '1hr' },
  { value: '2hr', label: '2hr' },
  { value: '3hr', label: '3hr' },
  { value: '4hr', label: '4hr' },
  { value: '5hr', label: '5hr' },
  { value: '6hr', label: '6hr' },
  { value: '7hr', label: '7hr' },
  { value: '8hr', label: '8hr' },
  { value: '9hr', label: '9hr' },
  { value: '10hr', label: '10hr' },
  { value: '11hr', label: '11hr' },
  { value: '12hr', label: '12hr' },
  { value: '18hr', label: '18hr' },
  { value: '1 day', label: '1 day' },
  { value: '1 day 12hr', label: '1 day 12hr' },
  { value: '2 days', label: '2 days' },
  { value: '3 days', label: '3 days' },
  { value: '4 days', label: '4 days' },
  { value: '5 days', label: '5 days' },
  { value: '6 days', label: '6 days' },
  { value: '7 days', label: '7 days' },
  { value: '8 days', label: '8 days' },
  { value: '9 days', label: '9 days' },
  { value: '10 days', label: '10 days' },
  { value: '11 days', label: '11 days' },
  { value: '12 days', label: '12 days' },
  { value: '13 days', label: '13 days' },
  { value: '14 days', label: '14 days' },
  { value: '15 days', label: '15 days' },
  { value: '16 days', label: '16 days' },
  { value: '17 days', label: '17 days' },
  { value: '18 days', label: '18 days' },
  { value: '19 days', label: '19 days' },
  { value: '20 days', label: '20 days' },
  { value: '21 days', label: '21 days' },
  { value: '25 days', label: '25 days' },
  { value: '1 month', label: '1 month' },
  { value: '1 month 5 days', label: '1 month 5 days' },
  { value: '1 month 10 days', label: '1 month 10 days' },
  { value: '1 month 15 days', label: '1 month 15 days' },
  { value: '1 month 20 days', label: '1 month 20 days' },
  { value: '1 month 25 days', label: '1 month 25 days' },
  { value: '2 months', label: '2 months' },
  { value: '2 months 15 days', label: '2 months 15 days' },
  { value: '3 months', label: '3 months' },
  { value: '4 months', label: '4 months' },
  { value: '5 months', label: '5 months' },
  { value: '6 months', label: '6 months' },
  { value: '9 months', label: '9 months' },
  { value: '1 year', label: '1 year' },
];

function EditMenuItemModal({ isOpen, onClose, itemId = null }) {
  const { state, addMenuItems, updateMenuItem } = useMenu();
  const [activeTab, setActiveTab] = useState('basic');
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [showTaxOptions, setShowTaxOptions] = useState(false);
  const [advancedExpanded, setAdvancedExpanded] = useState(false);
  const [socialDropdownOpen, setSocialDropdownOpen] = useState(false);
  const socialDropdownRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    image: null,
    imagePreview: null,
    tagline: '',
    description: '',
    internalShortName: '',
    finePrint: '',
    howToRedeem: '',
    onlineCategory: 'Courses',
    internalCategory: 'Courses',
    webId: '',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    meals: [],
    price: '',
    originalPrice: '',
    showDiscount: false,
    taxIncluded: true,
    status: 'Online',
    bookingRules: {
      duration: { value: null, extendToMealPeriod: false },
      quantityLimit: null,
      orderRules: { minOrder: 0, maxOrder: null, oneOrderPerPerson: false },
      showDates: [],
      showStartTime: null,
      validPeriod: {
        dateRanges: [],
        startTime: null,
        endTime: null,
      },
      furthestBooking: {
        mode: 'daily',      // 'daily' or 'monthly'
        number: 2,
        unit: 'months'      // 'days' or 'months'
      },
      closestBooking: {
        mode: 'advance',    // 'same-day' or 'advance'
        timeIncrement: 15,  // minutes for same-day mode
        days: 1             // for advance mode
      },
      turnovers: [],
      enabledLanguages: [],
      tableTiers: [],
    },
    payments: {
      paymentType: 'useVenueDefault',
      paymentRequiredForInternational: 'useVenueDefault',
      requirePaymentForGroups: '',
      partialPayment: {
        amount: '',
        percent: '',
        tableFee: '',
        coverFee: '',
      },
      cancelFees: [],
      bookingFee: '',
    },
  });

  const [showInternalShortName, setShowInternalShortName] = useState(false);
  const [showFinePrint, setShowFinePrint] = useState(false);
  const [showHowToRedeem, setShowHowToRedeem] = useState(false);

  // Migrate old booking rules structure to new structure
  const migrateBookingRules = (bookingRules) => {
    if (!bookingRules) {
      return {
        furthestBooking: {
          mode: 'daily',
          number: 2,
          unit: 'months'
        },
        closestBooking: {
          mode: 'advance',
          timeIncrement: 15,
          days: 1
        }
      };
    }

    // Migrate furthestBooking
    const furthestBooking = bookingRules.furthestBooking || {};
    const migratedFurthest = {
      mode: furthestBooking.mode || 'daily',
      number: furthestBooking.number || furthestBooking.value || 2,
      unit: furthestBooking.unit || 'months'
    };

    // Migrate closestBooking
    const closestBooking = bookingRules.closestBooking || {};
    const migratedClosest = {
      mode: closestBooking.mode || 'advance',
      timeIncrement: closestBooking.timeIncrement || 15,
      days: closestBooking.days || closestBooking.value || 1
    };

    return {
      ...bookingRules,
      furthestBooking: migratedFurthest,
      closestBooking: migratedClosest
    };
  };

  // Load item data if editing
  useEffect(() => {
    if (itemId) {
      const item = state.menuItems.find(i => i.id === itemId);
      if (item) {
        setFormData({
          name: item.name || '',
          image: null,
          imagePreview: item.image || null,
          tagline: item.tagline || '',
          description: item.description || '',
          internalShortName: item.internalShortName || '',
          finePrint: item.finePrint || '',
          howToRedeem: item.howToRedeem || '',
          onlineCategory: item.category || 'Courses',
          internalCategory: item.internalCategory || 'Courses',
          webId: item.webId || '',
          days: Array.isArray(item.days) ? item.days : [],
          meals: Array.isArray(item.meals) ? item.meals : [],
          price: item.price || '',
          originalPrice: item.originalPrice || '',
          showDiscount: item.showDiscount || false,
          taxIncluded: item.taxIncluded !== false,
          status: item.status || 'Online',
          bookingRules: migrateBookingRules(item.bookingRules),
          payments: item.payments || {
            paymentType: 'useVenueDefault',
            paymentRequiredForInternational: 'useVenueDefault',
            requirePaymentForGroups: '',
            partialPayment: {
              amount: '',
              percent: '',
              tableFee: '',
              coverFee: '',
            },
            cancelFees: [],
            bookingFee: '',
          },
        });
        setShowInternalShortName(!!item.internalShortName);
        setShowFinePrint(!!item.finePrint);
        setShowHowToRedeem(!!item.howToRedeem);
      }
    }
  }, [itemId, state.menuItems]);

  // Click outside handler for social dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (socialDropdownRef.current && !socialDropdownRef.current.contains(event.target)) {
        setSocialDropdownOpen(false);
      }
    };

    if (socialDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [socialDropdownOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBookingRulesChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      bookingRules: {
        ...prev.bookingRules,
        [section]: {
          ...prev.bookingRules[section],
          [field]: value,
        },
      },
    }));
  };

  const handleBookingRulesArrayChange = (section, value) => {
    setFormData(prev => ({
      ...prev,
      bookingRules: {
        ...prev.bookingRules,
        [section]: value,
      },
    }));
  };

  // Dynamic row management functions
  const addShowDateRange = () => {
    const newRange = { startDate: '', endDate: '' };
    setFormData(prev => ({
      ...prev,
      bookingRules: {
        ...prev.bookingRules,
        showDates: [...prev.bookingRules.showDates, newRange],
      },
    }));
  };

  const removeShowDateRange = (index) => {
    setFormData(prev => ({
      ...prev,
      bookingRules: {
        ...prev.bookingRules,
        showDates: prev.bookingRules.showDates.filter((_, i) => i !== index),
      },
    }));
  };

  const updateShowDateRange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      bookingRules: {
        ...prev.bookingRules,
        showDates: prev.bookingRules.showDates.map((range, i) => 
          i === index ? { ...range, [field]: value } : range
        ),
      },
    }));
  };

  const addValidPeriodRange = () => {
    const newRange = { startDate: '', endDate: '' };
    setFormData(prev => ({
      ...prev,
      bookingRules: {
        ...prev.bookingRules,
        validPeriod: {
          ...prev.bookingRules.validPeriod,
          dateRanges: [...prev.bookingRules.validPeriod.dateRanges, newRange],
        },
      },
    }));
  };

  const removeValidPeriodRange = (index) => {
    setFormData(prev => ({
      ...prev,
      bookingRules: {
        ...prev.bookingRules,
        validPeriod: {
          ...prev.bookingRules.validPeriod,
          dateRanges: prev.bookingRules.validPeriod.dateRanges.filter((_, i) => i !== index),
        },
      },
    }));
  };

  const updateValidPeriodRange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      bookingRules: {
        ...prev.bookingRules,
        validPeriod: {
          ...prev.bookingRules.validPeriod,
          dateRanges: prev.bookingRules.validPeriod.dateRanges.map((range, i) => 
            i === index ? { ...range, [field]: value } : range
          ),
        },
      },
    }));
  };

  const addTurnover = () => {
    const newTurnover = { startTime: '', latestStart: '', endTime: '' };
    setFormData(prev => ({
      ...prev,
      bookingRules: {
        ...prev.bookingRules,
        turnovers: [...prev.bookingRules.turnovers, newTurnover],
      },
    }));
  };

  const removeTurnover = (index) => {
    setFormData(prev => ({
      ...prev,
      bookingRules: {
        ...prev.bookingRules,
        turnovers: prev.bookingRules.turnovers.filter((_, i) => i !== index),
      },
    }));
  };

  const updateTurnover = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      bookingRules: {
        ...prev.bookingRules,
        turnovers: prev.bookingRules.turnovers.map((turnover, i) => 
          i === index ? { ...turnover, [field]: value } : turnover
        ),
      },
    }));
  };

  // Payment handlers
  const handlePaymentChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      payments: {
        ...prev.payments,
        [field]: value,
      },
    }));
  };

  const handlePartialPaymentChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      payments: {
        ...prev.payments,
        partialPayment: {
          ...prev.payments.partialPayment,
          [field]: value,
        },
      },
    }));
  };

  const addCancelFee = () => {
    const newCancelFee = { advancedTime: '', ruleType: '', percent: '' };
    setFormData(prev => ({
      ...prev,
      payments: {
        ...prev.payments,
        cancelFees: [...prev.payments.cancelFees, newCancelFee],
      },
    }));
  };

  const removeCancelFee = (index) => {
    setFormData(prev => ({
      ...prev,
      payments: {
        ...prev.payments,
        cancelFees: prev.payments.cancelFees.filter((_, i) => i !== index),
      },
    }));
  };

  const updateCancelFee = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      payments: {
        ...prev.payments,
        cancelFees: prev.payments.cancelFees.map((fee, i) => 
          i === index ? { ...fee, [field]: value } : fee
        ),
      },
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: file,
          imagePreview: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleDay = (index) => {
    const dayLabel = DAY_LABELS[index];
    setFormData(prev => ({
      ...prev,
      days: prev.days.includes(dayLabel)
        ? prev.days.filter(d => d !== dayLabel)
        : [...prev.days, dayLabel],
    }));
  };

  const toggleMeal = (meal) => {
    setFormData(prev => ({
      ...prev,
      meals: prev.meals.includes(meal)
        ? prev.meals.filter(m => m !== meal)
        : [...prev.meals, meal],
    }));
  };

  const selectAllDays = () => {
    setFormData(prev => ({ ...prev, days: [...DAY_LABELS] }));
  };

  const clearAllDays = () => {
    setFormData(prev => ({ ...prev, days: [] }));
  };

  const selectAllMeals = () => {
    setFormData(prev => ({ ...prev, meals: [...MEALS] }));
  };

  const clearAllMeals = () => {
    setFormData(prev => ({ ...prev, meals: [] }));
  };

  const validateBookingRules = () => {
    const { orderRules, closestBooking, furthestBooking } = formData.bookingRules;
    
    // Validate order rules
    if (orderRules.minOrder > orderRules.maxOrder && orderRules.maxOrder !== null) {
      alert('Minimum order cannot exceed maximum order');
      return false;
    }
    
    // Validate booking windows
    if (closestBooking.days && furthestBooking.number) {
      if (closestBooking.mode === 'advance' && furthestBooking.mode === 'daily' && furthestBooking.unit === 'days') {
        if (closestBooking.days > furthestBooking.number) {
          alert('Closest booking time cannot be greater than furthest booking time');
          return false;
        }
      }
    }
    
    // Validate date ranges
    for (const range of formData.bookingRules.showDates) {
      if (range.startDate && range.endDate && range.startDate > range.endDate) {
        alert('Start date must be before end date in Show Dates');
        return false;
      }
    }
    
    for (const range of formData.bookingRules.validPeriod.dateRanges || []) {
      if (range.startDate && range.endDate && range.startDate > range.endDate) {
        alert('Start date must be before end date in Valid Period');
        return false;
      }
    }
    
    // Validate validPeriod time range
    if (formData.bookingRules.validPeriod.startTime && formData.bookingRules.validPeriod.endTime) {
      if (formData.bookingRules.validPeriod.startTime > formData.bookingRules.validPeriod.endTime) {
        alert('Start time must be before end time in Valid Period');
        return false;
      }
    }
    
    // Validate turnovers
    for (const turnover of formData.bookingRules.turnovers) {
      if (turnover.startTime && turnover.latestStart && turnover.startTime > turnover.latestStart) {
        alert('Start time must be before latest start time in turnovers');
        return false;
      }
      if (turnover.startTime && turnover.endTime && turnover.startTime > turnover.endTime) {
        alert('Start time must be before end time in turnovers');
        return false;
      }
    }
    
    return true;
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert('Please enter an item name');
      return;
    }
    
    if (!validateBookingRules()) {
      return;
    }

    const itemData = {
      name: formData.name,
      image: formData.imagePreview,
      tagline: formData.tagline,
      description: formData.description,
      internalShortName: formData.internalShortName,
      finePrint: formData.finePrint,
      howToRedeem: formData.howToRedeem,
      category: formData.onlineCategory,
      internalCategory: formData.internalCategory,
      webId: formData.webId,
      days: formData.days,
      meals: formData.meals,
      price: parseFloat(formData.price) || 0,
      originalPrice: parseFloat(formData.originalPrice) || 0,
      showDiscount: formData.showDiscount,
      taxIncluded: formData.taxIncluded,
      status: formData.status,
      bookingRules: formData.bookingRules,
      payments: formData.payments,
    };

    if (itemId) {
      updateMenuItem(itemId, itemData);
    } else {
      addMenuItems([itemData]);
    }

    onClose();
  };

  const calculateDiscount = () => {
    const price = parseFloat(formData.price) || 0;
    const originalPrice = parseFloat(formData.originalPrice) || 0;
    if (originalPrice > price && price > 0) {
      return Math.round(((originalPrice - price) / originalPrice) * 100);
    }
    return 0;
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/menu/${formData.webId || 'item-id'}`;
    navigator.clipboard.writeText(link).then(() => {
      alert('Link copied to clipboard!');
    });
  };

  const handleCopySocialLink = (platform) => {
    const baseLink = `${window.location.origin}/menu/${formData.webId || 'item-id'}`;
    const utmLink = `${baseLink}?utm_source=${platform}&utm_medium=social`;
    navigator.clipboard.writeText(utmLink).then(() => {
      alert(`Link with ${platform} UTM tag copied to clipboard!`);
      setSocialDropdownOpen(false);
    });
  };

  const toggleSocialDropdown = () => {
    setSocialDropdownOpen(!socialDropdownOpen);
  };

  if (!isOpen) return null;

  return (
    <div className="edit-modal-overlay" onClick={onClose}>
      <div className="edit-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="edit-modal-header">
          <div className="edit-modal-header-left">
            <button className="edit-modal-close" onClick={onClose}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <h2 className="edit-modal-title">{itemId ? 'Edit Menu Item' : 'New Menu Item'}</h2>
          </div>
          <button type="button" className="button primary" onClick={handleSave}>
            Save
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="edit-modal-tabs">
          <button
            className={`edit-tab ${activeTab === 'basic' ? 'active' : ''}`}
            onClick={() => setActiveTab('basic')}
          >
            Basic
          </button>
          <button
            className={`edit-tab ${activeTab === 'booking-rules' ? 'active' : ''}`}
            onClick={() => setActiveTab('booking-rules')}
          >
            Booking Rules
          </button>
          <button
            className={`edit-tab ${activeTab === 'payments' ? 'active' : ''}`}
            onClick={() => setActiveTab('payments')}
          >
            Payments
          </button>
        </div>

        {/* Body - Two Column Layout */}
        <div className="edit-modal-body-wrapper">
          {/* Left Column: Form Content */}
          <div className="edit-modal-body">
            {activeTab === 'basic' && (
              <>
          {/* SECTION 1: Basic Details */}
          <div className="menu-item-form-panel">
            <div className="section-header">
              <div className="section-header-content">
                <h3 className="section-title">Basic Details</h3>
                <p className="section-description">General information about your menu item</p>
              </div>
              <div className="status-dropdown-wrapper">
                <button
                  className="status-dropdown-button"
                  onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                  style={{
                    background: formData.status === 'Online' ? 'var(--success-surface)' : 
                               formData.status === 'Hidden' ? 'var(--warning-surface)' :
                               formData.status === 'Manager Only' ? 'var(--info-surface)' : 'var(--neutral-surface)',
                    color: formData.status === 'Online' ? 'var(--success-text)' : 
                           formData.status === 'Hidden' ? 'var(--warning-text)' :
                           formData.status === 'Manager Only' ? 'var(--info-text)' : 'var(--neutral-text)',
                  }}
                >
                  {formData.status}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>

                {statusDropdownOpen && (
                  <div className="edit-status-dropdown">
                    {['Online', 'Hidden', 'Manager Only', 'Disabled'].map(s => (
                      <button
                        key={s}
                        className="edit-status-option"
                        onClick={() => {
                          handleInputChange('status', s);
                          setStatusDropdownOpen(false);
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="menu-item-form-content">
              {/* Name */}
              <div className="form-field">
                <div className="form-label-group">
                  <label className="form-label">Name</label>
                </div>
                <div className="edit-input-with-lang">
                  <input
                    type="text"
                    className="edit-input"
                    placeholder="e.g. Caesar Salad"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                  <button className="lang-button">EN</button>
                </div>
              </div>

              {/* Image */}
              <div className="form-field">
                <div className="form-label-group">
                  <label className="form-label">Image</label>
                  <div className="form-help-text">Recommended size: 1920 x 1080</div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                  id="edit-image-upload"
                />
                {formData.imagePreview ? (
                  <div className="edit-image-preview-container">
                    <img src={formData.imagePreview} alt="Preview" className="edit-image-preview" />
                    <button 
                      type="button" 
                      className="edit-image-delete-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        handleInputChange('image', null);
                        handleInputChange('imagePreview', null);
                        const fileInput = document.getElementById('edit-image-upload');
                        if (fileInput) fileInput.value = '';
                      }}
                      title="Delete image"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                ) : (
                  <label htmlFor="edit-image-upload" className="edit-upload-button">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    <p>Drop file or click to upload</p>
                  </label>
                )}
              </div>

              {/* Tagline */}
              <div className="edit-field">
                <div className="form-label-group">
                  <label className="form-label">Tagline <span className="edit-optional">(Optional)</span></label>
                  <p className="form-help-text">A quick preview of the item, appears below the name.</p>
                </div>
                <div className="edit-input-with-lang">
                  <input
                    type="text"
                    className="edit-input"
                    placeholder="e.g. Crisp romaine with parmesan and croutons"
                    value={formData.tagline}
                    onChange={(e) => handleInputChange('tagline', e.target.value)}
                  />
                  <button className="lang-button">EN</button>
                </div>
              </div>

              {/* Description */}
              <div className="edit-field">
                <div className="form-label-group">
                  <label className="form-label">Description <span className="edit-optional">(Optional)</span></label>
                  <p className="form-help-text">A more detailed description of the item.</p>
                </div>
                <div className="edit-input-with-lang">
                  <textarea
                    className="edit-textarea"
                    rows="4"
                    placeholder="e.g. Fresh romaine lettuce tossed with creamy Caesar dressing, garlic croutons, and shaved Parmesan cheese"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                  />
                  <button className="lang-button lang-button-textarea">EN</button>
                </div>
              </div>

              {/* Expandable fields */}
              <div className="edit-expandable-actions">
                {!showInternalShortName && (
                  <button className="edit-inline-button" onClick={() => setShowInternalShortName(true)}>
                    + Internal Short Name
                  </button>
                )}
                {!showFinePrint && (
                  <button className="edit-inline-button" onClick={() => setShowFinePrint(true)}>
                    + Fine Print
                  </button>
                )}
                {!showHowToRedeem && (
                  <button className="edit-inline-button" onClick={() => setShowHowToRedeem(true)}>
                    + How to Redeem
                  </button>
                )}
              </div>

              {showInternalShortName && (
                <div className="edit-field">
                  <label className="form-label">Internal Short Name</label>
                  <input
                    type="text"
                    className="edit-input"
                    value={formData.internalShortName}
                    onChange={(e) => handleInputChange('internalShortName', e.target.value)}
                  />
                </div>
              )}

              {showFinePrint && (
                <div className="edit-field">
                  <label className="form-label">Fine Print</label>
                  <div className="edit-input-with-lang">
                    <textarea
                      className="edit-textarea"
                      rows="3"
                      value={formData.finePrint}
                      onChange={(e) => handleInputChange('finePrint', e.target.value)}
                    />
                    <button className="lang-button lang-button-textarea">EN</button>
                  </div>
                </div>
              )}

              {showHowToRedeem && (
                <div className="edit-field">
                  <label className="form-label">How to Redeem</label>
                  <div className="edit-input-with-lang">
                    <textarea
                      className="edit-textarea"
                      rows="3"
                      value={formData.howToRedeem}
                      onChange={(e) => handleInputChange('howToRedeem', e.target.value)}
                    />
                    <button className="lang-button lang-button-textarea">EN</button>
                  </div>
                </div>
              )}

              {/* Divider before categories */}
              <div className="form-divider"></div>

              {/* Categories */}
              <div className="edit-field-row">
                <div className="edit-field">
                  <div className="form-label-group">
                    <label className="form-label">Online Category</label>
                    <p className="edit-sublabel">Guest-facing category</p>
                  </div>
                  <select
                    className="edit-select"
                    value={formData.onlineCategory}
                    onChange={(e) => handleInputChange('onlineCategory', e.target.value)}
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="edit-field">
                  <div className="form-label-group">
                    <label className="form-label">Internal Category</label>
                    <p className="edit-sublabel">Staff-facing category</p>
                  </div>
                  <select
                    className="edit-select"
                    value={formData.internalCategory}
                    onChange={(e) => handleInputChange('internalCategory', e.target.value)}
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-divider"></div>

              {/* Web ID */}
              <div className="form-field">
                <div className="form-label-group">
                  <label className="form-label">Web ID <span className="optional-label">(Optional)</span></label>
                  <div className="form-help-text">Will appear in the URL for your menu item</div>
                </div>
                <input
                  type="text"
                  className="edit-input"
                  placeholder="caesar-salad"
                  value={formData.webId}
                  onChange={(e) => handleInputChange('webId', e.target.value)}
                  disabled
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: Availability */}
          <div className="menu-item-form-panel">
            <div className="section-header">
              <div className="section-header-content">
                <h3 className="section-title">Availability</h3>
                <p className="section-description">Set when this menu item be available to order</p>
              </div>
            </div>

            <div className="menu-item-form-content">
              {/* Days */}
              <div className="edit-field">
                <div className="edit-field-header">
                  <label className="form-label">Days</label>
                  <div className="edit-quick-actions">
                    <button className="edit-text-action-small" onClick={selectAllDays}>Select All</button>
                    <span className="edit-separator">|</span>
                    <button className="edit-text-action-small" onClick={clearAllDays}>None</button>
                  </div>
                </div>
                <div className="edit-toggle-group">
                  {DAYS.map((day, index) => (
                    <button
                      key={day}
                      className={`edit-toggle-button ${formData.days.includes(DAY_LABELS[index]) ? 'active' : ''}`}
                      onClick={() => toggleDay(index)}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-divider"></div>

              {/* Meals */}
              <div className="edit-field">
                <div className="edit-field-header">
                  <label className="form-label">Meal Periods</label>
                  <div className="edit-quick-actions">
                    <button className="edit-text-action-small" onClick={selectAllMeals}>Select All</button>
                    <span className="edit-separator">|</span>
                    <button className="edit-text-action-small" onClick={clearAllMeals}>None</button>
                  </div>
                </div>
                <div className="edit-toggle-group">
                  {MEALS.map(meal => (
                    <button
                      key={meal}
                      className={`edit-toggle-button ${formData.meals.includes(meal) ? 'active' : ''}`}
                      onClick={() => toggleMeal(meal)}
                    >
                      {meal}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: Price & Tax */}
          <div className="menu-item-form-panel">
            <div className="section-header">
              <div className="section-header-content">
                <h3 className="section-title">Price & Tax</h3>
                <p className="section-description">Set the price and tax information for this item</p>
              </div>
            </div>

            <div className="menu-item-form-content">
              <div className="edit-field">
                <label className="form-label">Price</label>
                <div className="edit-currency-input">
                  <span className="edit-currency-prefix">JPY</span>
                  <input
                    type="number"
                    className="edit-input edit-input-currency"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    step="0.01"
                  />
                </div>
              </div>

              <div className="edit-field">
                <label className="form-label">Original Price <span className="edit-optional">(Optional)</span></label>
                <p className="form-help-text">Enter a higher amount to show a price markdown.</p>
                <div className="edit-currency-input">
                  <span className="edit-currency-prefix">JPY</span>
                  <input
                    type="number"
                    className="edit-input edit-input-currency"
                    value={formData.originalPrice}
                    onChange={(e) => handleInputChange('originalPrice', e.target.value)}
                    step="0.01"
                  />
                </div>
              </div>

              <div className="edit-checkbox">
                <input
                  type="checkbox"
                  id="showDiscount"
                  checked={formData.showDiscount}
                  onChange={(e) => handleInputChange('showDiscount', e.target.checked)}
                />
                <label htmlFor="showDiscount">Show discount on booking form</label>
              </div>

              <button className="edit-text-action" onClick={() => setShowTaxOptions(!showTaxOptions)}>
                {showTaxOptions ? 'Hide tax options' : 'Show tax options'}
              </button>

              {showTaxOptions && (
                <div className="edit-field" style={{ marginTop: '12px' }}>
                  <div className="edit-checkbox">
                    <input
                      type="checkbox"
                      id="taxIncluded"
                      checked={formData.taxIncluded}
                      onChange={(e) => handleInputChange('taxIncluded', e.target.checked)}
                    />
                    <label htmlFor="taxIncluded">Tax included in price</label>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SECTION 4: Questions */}
          <div className="menu-item-form-panel">
            <div className="section-header">
              <div className="section-header-content">
                <h3 className="section-title">Questions</h3>
                <p className="section-description">Important things to ask guests who order this item.</p>
              </div>
            </div>

            <div className="menu-item-form-content">
              <div className="edit-ghost-buttons">
                <button className="edit-ghost-button">+ Question 1</button>
                <button className="edit-ghost-button">+ Question 2</button>
              </div>
            </div>
          </div>

          {/* SECTION 5: Advanced Settings */}
          <div className="menu-item-form-panel">
            <button
              className="section-header section-header-collapsible"
              onClick={() => setAdvancedExpanded(!advancedExpanded)}
            >
              <div className="section-header-content">
                <h3 className="section-title">Advanced Settings</h3>
              </div>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{ transform: advancedExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>

            {advancedExpanded && (
              <div className="menu-item-form-content">
                <p className="edit-help-text">Advanced options coming soon...</p>
              </div>
            )}
          </div>
            </>
          )}

          {/* Booking Rules Tab */}
          {activeTab === 'booking-rules' && (
            <>
              {/* Banner */}
              <div className="booking-rules-banner">
                <div className="booking-rules-banner-content">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 6v6l4 2"></path>
                  </svg>
                  <span>Venue rules apply by default. Adjust settings below to create item-specific rules.</span>
                </div>
              </div>

              {/* Section 1: Duration & Meal Period */}
              <div className="menu-item-form-panel">
                <div className="section-header">
                  <div className="section-header-content">
                    <h3 className="section-title">Duration & Meal Period</h3>
                    <p className="section-description">Set booking duration for this item</p>
                  </div>
                </div>

                <div className="menu-item-form-content">
                  {/* Duration */}
                  <div className="form-field">
                    <label className="form-label">Duration</label>
                    <p className="form-help-text">Set a booking duration specific to this item. This will override default venue settings.</p>
                    <select
                      className="edit-select"
                      value={formData.bookingRules.duration.value || ''}
                      onChange={(e) => handleBookingRulesChange('duration', 'value', e.target.value || null)}
                    >
                      {DURATION_OPTIONS.map((option) => (
                        <option key={option.value || 'default'} value={option.value || ''}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-divider"></div>

                  {/* Single Seating Per Meal Period */}
                  <div className="form-field">
                    <div className="meal-period-container">
                      <div className="edit-checkbox">
                        <input
                          type="checkbox"
                          id="extendToMealPeriod"
                          checked={formData.bookingRules.duration.extendToMealPeriod}
                          onChange={(e) => handleBookingRulesChange('duration', 'extendToMealPeriod', e.target.checked)}
                        />
                        <label htmlFor="extendToMealPeriod" className="meal-period-label">Single seating per meal period</label>
                      </div>
                      <p className="form-help-text meal-period-description">When enabled, bookings that include this item will extend to the end of the meal period.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Order & Quantity Management */}
              <div className="menu-item-form-panel">
                <div className="section-header">
                  <div className="section-header-content">
                    <h3 className="section-title">Order & Quantity Management</h3>
                    <p className="section-description">Set order limits and quantity constraints</p>
                  </div>
                </div>

                <div className="menu-item-form-content">
                  {/* Quantity Limit */}
                  <div className="form-field">
                    <label className="form-label">Quantity Limit</label>
                    <p className="form-help-text">Set a limited inventory for this item per day.</p>
                    <input
                      type="number"
                      className="edit-input"
                      placeholder="No limit"
                      value={formData.bookingRules.quantityLimit || ''}
                      onChange={(e) => handleBookingRulesChange('quantityLimit', null, e.target.value ? parseInt(e.target.value) : null)}
                      min="1"
                    />
                  </div>

                  <div className="form-divider"></div>

                  {/* Order Rules */}
                    <div className="form-field">
                      <label className="form-label">Order Rules</label>
                      <p className="form-help-text">Set a minimum/maximum quantity of this item allowed per booking.</p>
                      <div className="edit-field-row flush-row">
                      <div className="edit-field">
                        <label className="edit-sublabel">Min order</label>
                        <select
                          className="edit-select"
                          value={formData.bookingRules.orderRules.minOrder}
                          onChange={(e) => handleBookingRulesChange('orderRules', 'minOrder', parseInt(e.target.value))}
                        >
                          {ORDER_OPTIONS.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="edit-field">
                        <label className="edit-sublabel">Max order</label>
                        <select
                          className="edit-select"
                          value={formData.bookingRules.orderRules.maxOrder || ''}
                          onChange={(e) => handleBookingRulesChange('orderRules', 'maxOrder', e.target.value ? parseInt(e.target.value) : null)}
                        >
                          {MAX_ORDER_OPTIONS.map(option => (
                            <option key={option.value || 'unlimited'} value={option.value || ''}>{option.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="form-divider"></div>

                  {/* One Order Per Person */}
                  <div className="form-field">
                    <div className="meal-period-container">
                      <div className="edit-checkbox">
                        <input
                          type="checkbox"
                          id="oneOrderPerPerson"
                          checked={formData.bookingRules.orderRules.oneOrderPerPerson}
                          onChange={(e) => handleBookingRulesChange('orderRules', 'oneOrderPerPerson', e.target.checked)}
                        />
                        <label htmlFor="oneOrderPerPerson" className="meal-period-label">One order per person required</label>
                      </div>
                      <p className="form-help-text meal-period-description">Requires the quantity ordered to match the number of guests in the booking.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Booking Window Configuration */}
              <div className="menu-item-form-panel">
                <div className="section-header">
                  <div className="section-header-content">
                    <h3 className="section-title">Booking Window Configuration</h3>
                    <p className="section-description">Control how close and far in advance guests can make bookings</p>
                  </div>
                </div>

                <div className="menu-item-form-content">
                  {/* Furthest Booking Section */}
                  <div className="config-section">
                    <div className="config-section-header">
                      <label className="form-label">Furthest Booking</label>
                      <p className="form-help-text">How far ahead can guests book?</p>
                    </div>
                    
                    {/* Radio Button Options */}
                    <div className="radio-options">
                      <label className={`radio-option ${formData.bookingRules.furthestBooking.mode === 'daily' ? 'active' : ''}`}>
                        <input 
                          type="radio" 
                          name="furthest-type" 
                          value="daily" 
                          checked={formData.bookingRules.furthestBooking.mode === 'daily'}
                          onChange={(e) => handleBookingRulesChange('furthestBooking', 'mode', e.target.value)}
                        />
                        <div className="radio-content">
                          <span className="radio-label">Update Daily</span>
                          <span className="radio-description">New days become available each day.</span>
                        </div>
                      </label>
                      <label className={`radio-option ${formData.bookingRules.furthestBooking.mode === 'monthly' ? 'active' : ''}`}>
                        <input 
                          type="radio" 
                          name="furthest-type" 
                          value="monthly"
                          checked={formData.bookingRules.furthestBooking.mode === 'monthly'}
                          onChange={(e) => handleBookingRulesChange('furthestBooking', 'mode', e.target.value)}
                        />
                        <div className="radio-content">
                          <span className="radio-label">Update Monthly</span>
                          <span className="radio-description">Full months unlock on the 1st of each month.</span>
                        </div>
                      </label>
                    </div>

                    {/* Input Row - Daily mode with select */}
                    {formData.bookingRules.furthestBooking.mode === 'daily' && (
                      <div className="edit-field-row flush-row">
                        <div className="edit-field">
                          <input
                            type="number"
                            className="edit-input"
                            min="1"
                            max="999"
                            value={formData.bookingRules.furthestBooking.number || ''}
                            onChange={(e) => handleBookingRulesChange('furthestBooking', 'number', parseInt(e.target.value) || 1)}
                            placeholder="2"
                          />
                        </div>
                        <div className="edit-field">
                          <select
                            className="edit-select"
                            value={formData.bookingRules.furthestBooking.unit}
                            onChange={(e) => handleBookingRulesChange('furthestBooking', 'unit', e.target.value)}
                          >
                            <option value="months">Months</option>
                            <option value="days">Days</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {/* Input Row - Monthly mode with label */}
                    {formData.bookingRules.furthestBooking.mode === 'monthly' && (
                      <div className="edit-field-row flush-row">
                        <div className="edit-field">
                          <input
                            type="number"
                            className="edit-input"
                            min="1"
                            max="999"
                            value={formData.bookingRules.furthestBooking.number || ''}
                            onChange={(e) => handleBookingRulesChange('furthestBooking', 'number', parseInt(e.target.value) || 1)}
                            placeholder="2"
                          />
                        </div>
                        <div className="edit-field">
                          <span className="input-label">Months</span>
                        </div>
                      </div>
                    )}

                    {/* Preview */}
                    <div 
                      className="preview-box"
                      dangerouslySetInnerHTML={{
                        __html: getFurthestPreviewText(calculateLatestBooking(formData.bookingRules.furthestBooking), formData.bookingRules.furthestBooking)
                      }}
                    />
                  </div>

                  {/* Closest Booking Section */}
                  <div className="config-section">
                    <div className="config-section-header">
                      <label className="form-label">Closest Booking</label>
                      <p className="form-help-text">What's the minimum advance notice required?</p>
                    </div>
                    
                    {/* Radio Button Options */}
                    <div className="radio-options">
                      <label className={`radio-option ${formData.bookingRules.closestBooking.mode === 'same-day' ? 'active' : ''}`}>
                        <input 
                          type="radio" 
                          name="closest-type" 
                          value="same-day"
                          checked={formData.bookingRules.closestBooking.mode === 'same-day'}
                          onChange={(e) => handleBookingRulesChange('closestBooking', 'mode', e.target.value)}
                        />
                        <div className="radio-content">
                          <span className="radio-label">Same-Day Booking</span>
                          <span className="radio-description">Accept bookings with short notice.</span>
                        </div>
                      </label>
                      <label className={`radio-option ${formData.bookingRules.closestBooking.mode === 'advance' ? 'active' : ''}`}>
                        <input 
                          type="radio" 
                          name="closest-type" 
                          value="advance"
                          checked={formData.bookingRules.closestBooking.mode === 'advance'}
                          onChange={(e) => handleBookingRulesChange('closestBooking', 'mode', e.target.value)}
                        />
                        <div className="radio-content">
                          <span className="radio-label">Advance Booking</span>
                          <span className="radio-description">Require booking days in advance.</span>
                        </div>
                      </label>
                    </div>

                    {/* Time Increment Selector (for Same-Day mode) */}
                    {formData.bookingRules.closestBooking.mode === 'same-day' && (
                      <div className="edit-field-row">
                        <div className="edit-field">
                          <select
                            className="edit-select"
                            value={formData.bookingRules.closestBooking.timeIncrement}
                            onChange={(e) => handleBookingRulesChange('closestBooking', 'timeIncrement', parseInt(e.target.value))}
                          >
                            <option value="15">15 minutes</option>
                            <option value="30">30 minutes</option>
                            <option value="45">45 minutes</option>
                            <option value="60">1 hour</option>
                            <option value="120">2 hours</option>
                            <option value="180">3 hours</option>
                            <option value="240">4 hours</option>
                            <option value="300">5 hours</option>
                            <option value="360">6 hours</option>
                            <option value="420">7 hours</option>
                            <option value="480">8 hours</option>
                            <option value="540">9 hours</option>
                            <option value="600">10 hours</option>
                            <option value="660">11 hours</option>
                            <option value="720">12 hours</option>
                            <option value="1080">18 hours</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {/* Days Input (for Advance mode) */}
                    {formData.bookingRules.closestBooking.mode === 'advance' && (
                      <div className="edit-field-row flush-row">
                        <div className="edit-field">
                          <input
                            type="number"
                            className="edit-input"
                            min="1"
                            max="999"
                            value={formData.bookingRules.closestBooking.days || ''}
                            onChange={(e) => handleBookingRulesChange('closestBooking', 'days', parseInt(e.target.value) || 1)}
                            placeholder="1"
                          />
                        </div>
                        <div className="edit-field">
                          <span className="input-label">Days</span>
                        </div>
                      </div>
                    )}

                    {/* Preview */}
                    <div 
                      className="preview-box"
                      dangerouslySetInnerHTML={{
                        __html: getClosestPreviewText(calculateEarliestBooking(formData.bookingRules.closestBooking), formData.bookingRules.closestBooking)
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Availability Windows */}
              <div className="menu-item-form-panel">
                <div className="section-header">
                  <div className="section-header-content">
                    <h3 className="section-title">Availability Windows</h3>
                    <p className="section-description">Control when items appear and can be booked</p>
                  </div>
                </div>

                <div className="menu-item-form-content">
                  {/* Show Dates + Show Start Time Container */}
                  <div className="availability-container">
                    <div className="form-field">
                      <div className="form-label-group">
                        <label className="form-label">Show Dates (Visibility)</label>
                        <p className="form-help-text">Controls when item appears on booking form. If not configured, item is always visible.</p>
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {formData.bookingRules.showDates.map((range, index) => (
                          <div key={index} className="edit-field-row flush-row">
                            <div className="edit-field">
                              <DatePickerInput
                                value={range.startDate}
                                onChange={(value) => updateShowDateRange(index, 'startDate', value)}
                                placeholder="Start date"
                              />
                            </div>
                            <div className="edit-field">
                              <DatePickerInput
                                value={range.endDate}
                                onChange={(value) => updateShowDateRange(index, 'endDate', value)}
                                placeholder="End date"
                              />
                            </div>
                            <div className="edit-field" style={{ flex: '0 0 auto', width: '40px' }}>
                              <button
                                className="booking-rules-delete-btn"
                                onClick={() => removeShowDateRange(index)}
                                type="button"
                                title="Delete date range"
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <polyline points="3 6 5 6 21 6"></polyline>
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))}
                        
                        <button className="edit-inline-button" onClick={addShowDateRange}>
                          + Add dates
                        </button>
                      </div>
                    </div>

                    {formData.bookingRules.showDates.length > 0 && (
                      <>
                        <div className="form-divider"></div>

                        <div className="form-field">
                          <label className="form-label">Show Start Time</label>
                          <p className="form-help-text">Controls when item appears on booking form</p>
                          <TimePickerInput
                            value={formData.bookingRules.showStartTime}
                            onChange={(value) => handleBookingRulesChange('showStartTime', null, value)}
                            placeholder="09:00"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Valid Period Container */}
                  <div className="availability-container">
                    <div className="form-field">
                      <div className="form-label-group">
                        <label className="form-label">Valid Dates (Purchasability)</label>
                        <p className="form-help-text">Controls when item can actually be booked. If not configured, item is always purchasable when visible.</p>
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {formData.bookingRules.validPeriod.dateRanges.map((range, index) => (
                          <div key={index} className="edit-field-row flush-row">
                            <div className="edit-field">
                              <DatePickerInput
                                value={range.startDate}
                                onChange={(value) => updateValidPeriodRange(index, 'startDate', value)}
                                placeholder="Start date"
                              />
                            </div>
                            <div className="edit-field">
                              <DatePickerInput
                                value={range.endDate}
                                onChange={(value) => updateValidPeriodRange(index, 'endDate', value)}
                                placeholder="End date"
                              />
                            </div>
                            <div className="edit-field" style={{ flex: '0 0 auto', width: '40px' }}>
                              <button
                                className="booking-rules-delete-btn"
                                onClick={() => removeValidPeriodRange(index)}
                                type="button"
                                title="Delete date range"
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <polyline points="3 6 5 6 21 6"></polyline>
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))}
                        
                        <button className="edit-inline-button" onClick={addValidPeriodRange}>
                          + Add dates
                        </button>
                      </div>
                    </div>

                    {formData.bookingRules.validPeriod.dateRanges.length > 0 && (
                      <>
                        <div className="form-divider"></div>

                        <div className="form-field">
                          <label className="form-label">Valid Times</label>
                          <p className="form-help-text">Time range that applies to all date ranges above</p>
                          <div className="edit-field-row flush-row">
                            <div className="edit-field">
                              <TimePickerInput
                                value={formData.bookingRules.validPeriod.startTime}
                                onChange={(value) => setFormData(prev => ({
                                  ...prev,
                                  bookingRules: {
                                    ...prev.bookingRules,
                                    validPeriod: {
                                      ...prev.bookingRules.validPeriod,
                                      startTime: value,
                                    },
                                  },
                                }))}
                                placeholder="Start time"
                              />
                            </div>
                            <div className="edit-field">
                              <TimePickerInput
                                value={formData.bookingRules.validPeriod.endTime}
                                onChange={(value) => setFormData(prev => ({
                                  ...prev,
                                  bookingRules: {
                                    ...prev.bookingRules,
                                    validPeriod: {
                                      ...prev.bookingRules.validPeriod,
                                      endTime: value,
                                    },
                                  },
                                }))}
                                placeholder="End time"
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>


              {/* Section 5: Turnover Scheduling */}
              <div className="menu-item-form-panel">
                <div className="section-header">
                  <div className="section-header-content">
                    <h3 className="section-title">Turnover Scheduling</h3>
                    <p className="section-description">Set fixed seating times for this menu item</p>
                  </div>
                </div>

                <div className="menu-item-form-content">
                  <div className="form-field">
                    <div className="form-label-group">
                      <label className="form-label">Turnovers</label>
                      <p className="form-help-text">Fixed seating times for this menu item</p>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {formData.bookingRules.turnovers.map((turnover, index) => (
                        <div key={index} className="booking-rules-row">
                          <div className="edit-field-row">
                            <div className="edit-field">
                              <label className="edit-sublabel">Start time (required)</label>
                              <TimePickerInput
                                value={turnover.startTime}
                                onChange={(value) => updateTurnover(index, 'startTime', value)}
                                placeholder="09:00"
                              />
                            </div>
                            <div className="edit-field">
                              <label className="edit-sublabel">Latest start (optional)</label>
                              <TimePickerInput
                                value={turnover.latestStart}
                                onChange={(value) => updateTurnover(index, 'latestStart', value)}
                                placeholder="09:30"
                              />
                            </div>
                            <div className="edit-field">
                              <label className="edit-sublabel">End time (optional)</label>
                              <TimePickerInput
                                value={turnover.endTime}
                                onChange={(value) => updateTurnover(index, 'endTime', value)}
                                placeholder="11:00"
                              />
                            </div>
                            <div className="edit-field" style={{ flex: '0 0 auto', width: '40px', alignSelf: 'flex-end' }}>
                              <button
                                className="booking-rules-delete-btn"
                                onClick={() => removeTurnover(index)}
                                type="button"
                                title="Delete turnover"
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <polyline points="3 6 5 6 21 6"></polyline>
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      <button className="edit-inline-button" onClick={addTurnover}>
                        + Add turnover
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 6: Targeting Rules */}
              <div className="menu-item-form-panel">
                <div className="section-header">
                  <div className="section-header-content">
                    <h3 className="section-title">Targeting Rules</h3>
                    <p className="section-description">Control which guests can see and book this item</p>
                  </div>
                </div>

                <div className="menu-item-form-content">
                  {/* Enabled Languages */}
                  <div className="form-field">
                    <div className="form-label-group">
                      <label className="form-label">Enabled Languages</label>
                      <p className="form-help-text">Item only shown to guests using selected languages</p>
                    </div>
                    <div style={{ marginTop: '8px' }}>
                      <MultiSelectDropdown
                        options={LANGUAGES}
                        value={formData.bookingRules.enabledLanguages}
                        onChange={(value) => handleBookingRulesArrayChange('enabledLanguages', value)}
                        placeholder="Select languages"
                        searchable={true}
                        showSelectAll={true}
                      />
                    </div>
                  </div>

                  <div className="form-divider"></div>

                  {/* Table Tiers */}
                  <div className="form-field">
                    <label className="form-label">Table Tiers</label>
                    <p className="form-help-text">Item available only for specific table quality tiers</p>
                    <StarRatingSelector
                      value={formData.bookingRules.tableTiers}
                      onChange={(value) => handleBookingRulesArrayChange('tableTiers', value)}
                      maxStars={5}
                      multiple={true}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <>
              {/* Payment Type Section */}
              <div className="menu-item-form-panel">
                <div className="section-header">
                  <div className="section-header-content">
                    <h3 className="section-title">Payment Type</h3>
                    <p className="section-description">Select how payment should be handled for this item</p>
                  </div>
                </div>

                <div className="menu-item-form-content">
                  <div className="form-field">
                    <label className="form-label">Payment Type</label>
                    <select
                      className="edit-select"
                      value={formData.payments.paymentType}
                      onChange={(e) => handlePaymentChange('paymentType', e.target.value)}
                    >
                      {PAYMENT_TYPE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Conditional fields for Prepay Optional or Auth Optional */}
                  {(formData.payments.paymentType === 'prepayOptional' || formData.payments.paymentType === 'authOptional') && (
                    <>
                      <div className="form-divider"></div>

                      {/* Payment Required for International Guests */}
                      <div className="form-field">
                        <label className="form-label">Payment Required for International Guests</label>
                        <div className="payment-type-buttons">
                          {PAYMENT_REQUIRED_INTERNATIONAL_OPTIONS.map((option) => (
                            <button
                              key={option.value}
                              type="button"
                              className={`payment-type-button ${formData.payments.paymentRequiredForInternational === option.value ? 'active' : ''}`}
                              onClick={() => handlePaymentChange('paymentRequiredForInternational', option.value)}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="form-divider"></div>

                      {/* Require Payment for Groups */}
                      <div className="form-field">
                        <label className="form-label">Require Payment for Groups</label>
                        <select
                          className="edit-select"
                          value={formData.payments.requirePaymentForGroups}
                          onChange={(e) => handlePaymentChange('requirePaymentForGroups', e.target.value)}
                        >
                          {REQUIRE_PAYMENT_FOR_GROUPS_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Partial Payment Section */}
              <div className="menu-item-form-panel">
                <div className="section-header">
                  <div className="section-header-content">
                    <h3 className="section-title">Partial Payment</h3>
                    <p className="section-description">Configure partial payment options</p>
                  </div>
                </div>

                <div className="menu-item-form-content">
                  {/* Partial Amount */}
                  <div className="form-field">
                    <label className="form-label">Partial Amount</label>
                    <div className="edit-currency-input">
                      <span className="edit-currency-prefix">¥</span>
                      <input
                        type="number"
                        className="edit-input edit-input-currency"
                        value={formData.payments.partialPayment.amount}
                        onChange={(e) => handlePartialPaymentChange('amount', e.target.value)}
                        placeholder="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div className="form-divider"></div>

                  {/* Partial Percent */}
                  <div className="form-field">
                    <label className="form-label">Partial Percent (%)</label>
                    <div className="edit-percent-input">
                      <input
                        type="number"
                        className="edit-input edit-input-percent"
                        value={formData.payments.partialPayment.percent}
                        onChange={(e) => handlePartialPaymentChange('percent', e.target.value)}
                        placeholder="0"
                        step="0.01"
                        min="0"
                        max="100"
                      />
                      <span className="edit-percent-suffix">%</span>
                    </div>
                  </div>

                  <div className="form-divider"></div>

                  {/* Table Fee */}
                  <div className="form-field">
                    <label className="form-label">Table Fee (per Group)</label>
                    <div className="edit-currency-input">
                      <span className="edit-currency-prefix">¥</span>
                      <input
                        type="number"
                        className="edit-input edit-input-currency"
                        value={formData.payments.partialPayment.tableFee}
                        onChange={(e) => handlePartialPaymentChange('tableFee', e.target.value)}
                        placeholder="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div className="form-divider"></div>

                  {/* Cover Fee */}
                  <div className="form-field">
                    <label className="form-label">Cover Fee (per Pax)</label>
                    <div className="edit-currency-input">
                      <span className="edit-currency-prefix">¥</span>
                      <input
                        type="number"
                        className="edit-input edit-input-currency"
                        value={formData.payments.partialPayment.coverFee}
                        onChange={(e) => handlePartialPaymentChange('coverFee', e.target.value)}
                        placeholder="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Cancel Fees Section */}
              <div className="menu-item-form-panel">
                <div className="section-header">
                  <div className="section-header-content">
                    <h3 className="section-title">Cancel Fees</h3>
                    <p className="section-description">Configure cancellation fee rules</p>
                  </div>
                </div>

                <div className="menu-item-form-content">
                  <div className="form-field">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {formData.payments.cancelFees.map((fee, index) => (
                        <div key={index} className="edit-field-row flush-row">
                          <div className="edit-field">
                            <label className="edit-sublabel">Advanced Time</label>
                            <select
                              className="edit-select"
                              value={fee.advancedTime}
                              onChange={(e) => updateCancelFee(index, 'advancedTime', e.target.value)}
                            >
                              {ADVANCE_TIME_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="edit-field">
                            <label className="edit-sublabel">Rule Type</label>
                            <select
                              className="edit-select"
                              value={fee.ruleType}
                              onChange={(e) => updateCancelFee(index, 'ruleType', e.target.value)}
                            >
                              <option value="">Select rule type</option>
                              {CANCEL_FEE_RULE_TYPES.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="edit-field">
                            <label className="edit-sublabel">%</label>
                            <div className="edit-percent-input">
                              <input
                                type="number"
                                className="edit-input edit-input-percent"
                                value={fee.percent}
                                onChange={(e) => updateCancelFee(index, 'percent', e.target.value)}
                                placeholder="0"
                                step="0.01"
                                min="0"
                                max="100"
                              />
                              <span className="edit-percent-suffix">%</span>
                            </div>
                          </div>
                          <div className="edit-field" style={{ flex: '0 0 auto', width: '40px', alignSelf: 'flex-end' }}>
                            <button
                              className="booking-rules-delete-btn"
                              onClick={() => removeCancelFee(index)}
                              type="button"
                              title="Delete cancel fee"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                      
                      <button className="edit-inline-button" onClick={addCancelFee}>
                        + Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Fee Section */}
              <div className="menu-item-form-panel">
                <div className="section-header">
                  <div className="section-header-content">
                    <h3 className="section-title">Booking Fee</h3>
                    <p className="section-description">Set booking fee amount per person</p>
                  </div>
                </div>

                <div className="menu-item-form-content">
                  <div className="form-field">
                    <label className="form-label">Booking Fee Amt per Pax</label>
                    <div className="edit-currency-input">
                      <span className="edit-currency-prefix">¥</span>
                      <input
                        type="number"
                        className="edit-input edit-input-currency"
                        value={formData.payments.bookingFee}
                        onChange={(e) => handlePaymentChange('bookingFee', e.target.value)}
                        placeholder="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

          {/* Right Column: Preview */}
          <div className="edit-modal-preview">
            {/* Preview Card */}
            <div className="preview-card">
              <div className="preview-card-badge">PREVIEW</div>
              {formData.imagePreview ? (
                <div className="preview-card-image">
                  <img src={formData.imagePreview} alt={formData.name || 'Menu item'} />
                </div>
              ) : (
                <div className="preview-card-image preview-card-image-placeholder">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                </div>
              )}

              <div className="preview-card-content">
                <h3 className="preview-card-title">
                  {formData.name || 'Menu Item Name'}
                </h3>
                
                {formData.tagline && (
                  <p className="preview-card-tagline">{formData.tagline}</p>
                )}

                <div className="preview-card-price">
                  <span className="preview-price-current">
                    ¥{parseFloat(formData.price) || 0}
                  </span>
                  
                  {formData.originalPrice && parseFloat(formData.originalPrice) > parseFloat(formData.price) && (
                    <>
                      <span className="preview-price-original">
                        ¥{parseFloat(formData.originalPrice)}
                      </span>
                      {calculateDiscount() > 0 && (
                        <span className="preview-discount-badge">
                          {calculateDiscount()}% off
                        </span>
                      )}
                    </>
                  )}

                  {formData.taxIncluded && (
                    <span className="preview-tax-info">Tax incl.</span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="preview-actions">
              <label className="preview-actions-label">Link to Booking Form</label>
              <div className="preview-actions-link">
                https://app.tablecheck.com/a24/reserve?menu_items[]=6502990c2bbae202d14beab3
              </div>
              <button className="preview-action-button" onClick={handleCopyLink}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                Copy link
              </button>
              
              <div className="social-share-dropdown" ref={socialDropdownRef}>
                <button className="preview-action-button" onClick={toggleSocialDropdown}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="18" cy="5" r="3"></circle>
                    <circle cx="6" cy="12" r="3"></circle>
                    <circle cx="18" cy="19" r="3"></circle>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                  </svg>
                  Copy with social tag
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                
                {socialDropdownOpen && (
                  <div className="social-share-options">
                    <button className="social-option" onClick={() => handleCopySocialLink('facebook')}>
                      Facebook
                    </button>
                    <button className="social-option" onClick={() => handleCopySocialLink('twitter')}>
                      Twitter
                    </button>
                    <button className="social-option" onClick={() => handleCopySocialLink('instagram')}>
                      Instagram
                    </button>
                    <button className="social-option" onClick={() => handleCopySocialLink('linkedin')}>
                      LinkedIn
                    </button>
                    <button className="social-option" onClick={() => handleCopySocialLink('tiktok')}>
                      TikTok
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditMenuItemModal;

