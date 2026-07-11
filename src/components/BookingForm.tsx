import { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, Users, Briefcase, User, Phone, Mail, CheckCircle, ArrowRight, ArrowLeft, ArrowLeftRight, MapPin, BadgeCheck, ShieldCheck, Sparkles, Plane, Building2, Car } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { useJsApiLoader } from '@react-google-maps/api';

const UK_AIRPORTS = [
  "London Heathrow Airport (LHR)",
  "London Gatwick Airport (LGW)",
  "London Stansted Airport (STN)",
  "London Luton Airport (LTN)",
  "Manchester Airport (MAN)",
  "Birmingham Airport (BHX)",
  "Edinburgh Airport (EDI)",
  "Glasgow Airport (GLA)"
];

const GOOGLE_MAPS_API_KEY = "AIzaSyA5K1hhu7mkUGdGDzabqf6-N_ikSijuBas";

const BookingForm = () => {
  const today = new Date().toLocaleDateString('en-CA');
  const [step, setStep] = useState(1);
  const [isNavigating, setIsNavigating] = useState(false);
  const [formData, setFormData] = useState({
    tripType: 'one-way' as 'one-way' | 'return',
    pickup: null as any,
    dropoff: null as any,
    viaStop: null as any,
    viaStopEnabled: false,
    date: '',
    time: '',
    returnDate: '',
    returnTime: '',
    passengers: '1',
    luggage: '0',
    taxiCount: '1',
    vehicleId: 'saloon',
    name: '',
    email: '',
    phone: '',
    notes: '',
    bookingCategory: 'standard', // 'standard' | 'airport' | 'business'
    airportDirection: 'to_airport', // 'to_airport' | 'from_airport'
    selectedAirport: '',
    flightNumber: '',
    childSeats: '0',
    wheelchairAccessible: false,
    paymentMethod: 'cash',
    termsAccepted: false,
    companyName: '',
    accountReference: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [distance, setDistance] = useState<string | null>(null);
  const [price, setPrice] = useState<number>(25.00);
  const departureDateRef = useRef<HTMLInputElement>(null);
  const departureTimeRef = useRef<HTMLInputElement>(null);
  const returnDateRef = useRef<HTMLInputElement>(null);
  const returnTimeRef = useRef<HTMLInputElement>(null);

  const openNativePicker = (input: HTMLInputElement | null) => {
    if (!input) return;

    try {
      if (typeof input.showPicker === 'function') {
        input.showPicker();
      } else {
        input.focus();
        input.click();
      }
    } catch {
      input.focus();
    }
  };

  const placeSelectStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      borderRadius: '1rem',
      minHeight: '58px',
      padding: '0.2rem 0.25rem',
      border: state.isFocused ? '1px solid #facc15' : '1px solid rgba(255, 255, 255, 0.08)',
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
      boxShadow: 'none',
      '&:hover': { borderColor: '#facc15' },
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      padding: '0 0.75rem',
    }),
    input: (provided: any) => ({
      ...provided,
      margin: 0,
      padding: 0,
      color: '#ffffff',
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: '#ffffff',
      fontWeight: 600,
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: '#9ca3af',
    }),
    menu: (provided: any) => ({
      ...provided,
      zIndex: 9999,
      marginTop: '0.5rem',
      borderRadius: '1rem',
      backgroundColor: '#0f172a',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      overflow: 'hidden',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
    }),
    menuPortal: (provided: any) => ({
      ...provided,
      zIndex: 9999,
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      padding: '0.85rem 1rem',
      cursor: 'pointer',
      backgroundColor: state.isFocused ? '#1e293b' : state.isSelected ? '#facc15' : 'transparent',
      color: state.isSelected ? '#0d2847' : '#ffffff',
      '&:hover': {
        backgroundColor: '#1e293b',
        color: '#ffffff'
      }
    }),
  };

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ['places']
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwapLocations = () => {
    setFormData(prev => ({
      ...prev,
      pickup: prev.dropoff,
      dropoff: prev.pickup,
    }));
  };

  // Calculate Distance when both locations are set
  useEffect(() => {
    const hasPickup = formData.bookingCategory === 'airport' && formData.airportDirection === 'from_airport' ? formData.selectedAirport : formData.pickup;
    const hasDropoff = formData.bookingCategory === 'airport' && formData.airportDirection === 'to_airport' ? formData.selectedAirport : formData.dropoff;
    if (hasPickup && hasDropoff && window.google) {
      const service = new google.maps.DistanceMatrixService();
      service.getDistanceMatrix(
        {
          origins: [formData.bookingCategory === 'airport' && formData.airportDirection === 'from_airport' ? formData.selectedAirport : formData.pickup.label],
          destinations: [formData.bookingCategory === 'airport' && formData.airportDirection === 'to_airport' ? formData.selectedAirport : formData.dropoff.label],
          travelMode: google.maps.TravelMode.DRIVING,
          unitSystem: google.maps.UnitSystem.IMPERIAL,
        },
        (response, status) => {
          if (status === 'OK' && response && response.rows[0].elements[0].status === 'OK') {
            const distText = response.rows[0].elements[0].distance.text;
            const distValue = response.rows[0].elements[0].distance.value; // meters
            setDistance(distText);
            
            // Pricing Logic: £5 base + £1.80 per mile (or £1.40 for airports) + 20% commission
            const miles = distValue / 1609.34;
            const pricePerMile = formData.bookingCategory === 'airport' ? 1.40 : 1.80;
            const basePrice = 5 + (miles * pricePerMile);
            const taxiMultiplier = Math.max(Number(formData.taxiCount) || 1, 1);
            const tripMultiplier = formData.tripType === 'return' ? 2 : 1; // Removed 35% discount
            const viaStopMultiplier = formData.viaStop ? 1.15 : 1;
            const companyCommission = 1.20; // 20% company commission
            
            const calculatedPrice = basePrice * taxiMultiplier * tripMultiplier * viaStopMultiplier * companyCommission;
            setPrice(Math.max(calculatedPrice, 15)); // Minimum £15
          }
        }
      );
    }
  }, [formData.pickup, formData.dropoff, formData.tripType, formData.taxiCount, formData.viaStop, formData.bookingCategory, formData.selectedAirport, formData.airportDirection]);

  const goToStep = (direction: 1 | -1) => {
    if (isNavigating) {
      return;
    }

    setIsNavigating(true);
    setStep(prev => {
      const next = prev + direction;
      return Math.min(Math.max(next, 1), 3);
    });

    window.setTimeout(() => setIsNavigating(false), 250);
  };

  const nextStep = () => goToStep(1);
  const prevStep = () => goToStep(-1);

  const formatDateDisplay = (value: string) => {
    if (!value) return '';
    const [year, month, day] = value.split('-');
    if (!year || !month || !day) return value;
    return `${day}/${month}/${year}`;
  };

  const formatTimeDisplay = (value: string) => {
    if (!value) return '';
    const [hour, minute] = value.split(':');
    if (!hour || !minute) return value;
    return `${hour}:${minute}`;
  };

  const requiresReturnTripDetails = formData.tripType === 'return';
  const hasPickup = formData.bookingCategory === 'airport' && formData.airportDirection === 'from_airport' ? formData.selectedAirport : formData.pickup;
  const hasDropoff = formData.bookingCategory === 'airport' && formData.airportDirection === 'to_airport' ? formData.selectedAirport : formData.dropoff;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const submissionData = {
      ...formData,
      pickup: formData.bookingCategory === 'airport' 
        ? (formData.airportDirection === 'from_airport' ? formData.selectedAirport : (formData.pickup?.label || ''))
        : (formData.pickup?.label || ''),
      dropoff: formData.bookingCategory === 'airport'
        ? (formData.airportDirection === 'to_airport' ? formData.selectedAirport : (formData.dropoff?.label || ''))
        : (formData.dropoff?.label || ''),
      tripType: formData.tripType,
      viaStop: formData.viaStop?.label || '',
      estimatedPrice: price.toFixed(2),
      distance: distance
    };
    
    try {
      const response = await fetch('https://www.ehta.net/api/submit_booking.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();
      if (result.status === 'success') {
        setIsSubmitted(true);
      } else {
        alert('Error: ' + result.message);
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      alert('Unable to submit booking. Please try again or contact support.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel-glow rounded-3xl p-12 max-w-2xl mx-auto text-center border border-yellow-400/20 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/5 rounded-full blur-3xl" />
        <div className="flex justify-center mb-6">
          <div className="bg-yellow-400/10 p-6 rounded-full border border-yellow-400/20 text-yellow-400">
            <CheckCircle size={64} className="animate-pulse" />
          </div>
        </div>
        <h2 className="text-4xl font-condensed tracking-wider text-white mb-4">Booking Confirmed!</h2>
        <p className="text-gray-300 text-lg mb-8 leading-relaxed max-w-md mx-auto">
          Thank you, <span className="font-bold text-white">{formData.name}</span>. Your journey from <span className="font-bold text-yellow-400">{formData.pickup?.label || formData.selectedAirport}</span> to <span className="font-bold text-yellow-400">{formData.dropoff?.label || formData.selectedAirport}</span> has been received. 
        </p>
        <button 
          onClick={() => {
            setIsSubmitted(false);
            setStep(1);
            setFormData({
              tripType: 'one-way',
              pickup: null,
              dropoff: null,
              viaStop: null,
              viaStopEnabled: false,
              date: '',
              time: '',
              returnDate: '',
              returnTime: '',
              passengers: '1',
              luggage: '0',
              taxiCount: '1',
              vehicleId: 'saloon',
              name: '',
              email: '',
              phone: '',
              notes: '',
              bookingCategory: 'standard',
              airportDirection: 'to_airport',
              selectedAirport: '',
              flightNumber: '',
              childSeats: '0',
              wheelchairAccessible: false,
              paymentMethod: 'cash',
              termsAccepted: false,
              companyName: '',
              accountReference: ''
            });
            setDistance(null);
            setPrice(25.00);
          }}
          className="bg-yellow-400 hover:bg-yellow-500 text-gray-950 font-bold py-4 px-10 rounded-xl transition-all shadow-lg hover:shadow-xl font-condensed tracking-widest text-sm hover:scale-[1.02]"
        >
          BOOK ANOTHER TRIP
        </button>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
      
      {/* Form Wizard Card */}
      <div className="flex-grow bg-gray-900/30 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/5 flex flex-col">
        
        {/* Category Tab Buttons */}
        <div className="flex border-b border-white/5 bg-gray-950/60 rounded-t-3xl overflow-x-auto whitespace-nowrap scrollbar-none">
          <button
            type="button"
            onClick={() => { setFormData(prev => ({...prev, bookingCategory: 'standard'})); setStep(1); }}
            className={`shrink-0 sm:flex-1 py-5 sm:py-6 px-6 font-bold text-[10px] sm:text-xs uppercase tracking-widest flex items-center justify-center transition-all ${formData.bookingCategory === 'standard' ? 'bg-yellow-400 text-gray-950 shadow-inner' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <Car size={16} className="mr-2 shrink-0" /> Book a Car
          </button>
          <button
            type="button"
            onClick={() => { setFormData(prev => ({...prev, bookingCategory: 'airport'})); setStep(1); }}
            className={`shrink-0 sm:flex-1 py-5 sm:py-6 px-6 font-bold text-[10px] sm:text-xs uppercase tracking-widest flex items-center justify-center transition-all ${formData.bookingCategory === 'airport' ? 'bg-yellow-400 text-gray-950 shadow-inner' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <Plane size={16} className="mr-2 shrink-0" /> Airport Transfer
          </button>
          <button
            type="button"
            onClick={() => { setFormData(prev => ({...prev, bookingCategory: 'business'})); setStep(1); }}
            className={`shrink-0 sm:flex-1 py-5 sm:py-6 px-6 font-bold text-[10px] sm:text-xs uppercase tracking-widest flex items-center justify-center transition-all ${formData.bookingCategory === 'business' ? 'bg-yellow-400 text-gray-950 shadow-inner' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <Building2 size={16} className="mr-2 shrink-0" /> Corporate Account
          </button>
        </div>

        {/* Wizard Steps Header */}
        <div className="bg-gray-950/40 p-5 sm:p-8 pt-6 border-b border-white/5 text-left">
          <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
            <h2 className="text-lg sm:text-xl text-white font-condensed tracking-wider flex items-center">
              <span className="text-yellow-400 mr-2">EHTA</span> SECURE BOOKING
            </h2>
            
            {/* Step Progress Dots */}
            <div className="flex items-center space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center">
                  <div className={`h-2 rounded-full transition-all duration-500 ${step >= i ? 'w-8 sm:w-10 bg-yellow-400 shadow shadow-yellow-400/20' : 'w-2 bg-gray-800'}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Step Text Labels */}
          <div className="flex justify-between text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-gray-500">
            <span className={step >= 1 ? 'text-yellow-400' : ''}>
              <span className="sm:hidden">01. Route</span>
              <span className="hidden sm:inline">01. Route Details</span>
            </span>
            <span className={step >= 2 ? 'text-yellow-400' : ''}>
              <span className="sm:hidden">02. Options</span>
              <span className="hidden sm:inline">02. Journey Options</span>
            </span>
            <span className={step >= 3 ? 'text-yellow-400' : ''}>
              <span className="sm:hidden">03. Details</span>
              <span className="hidden sm:inline">03. Personal Details</span>
            </span>
          </div>
        </div>

        {/* Multi-step Form Content */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 md:p-10 flex-grow flex flex-col justify-between min-h-[480px]">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ x: 15, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -15, opacity: 0 }}
                className="space-y-6"
              >
                {/* Corporate Account Sub-panel */}
                {formData.bookingCategory === 'business' && (
                  <div className="text-left mb-6 p-6 bg-yellow-400/[0.02] rounded-2xl border border-yellow-400/10">
                    <h3 className="text-lg font-condensed text-white flex items-center mb-1">
                      <Building2 className="text-yellow-400 mr-2.5" size={18} /> CORPORATE ACCOUNT BOOKING
                    </h3>
                    <p className="text-xs text-gray-400 mb-5">Access pre-negotiated corporate rates and monthly invoicing options.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5 text-left">
                        <label className="text-[10px] font-black tracking-widest text-gray-400 uppercase">Company Name *</label>
                        <input
                          type="text"
                          required
                          value={formData.companyName}
                          onChange={(e) => setFormData(prev => ({...prev, companyName: e.target.value}))}
                          className="w-full px-4 py-3 bg-white/[0.03] border border-white/8 rounded-xl focus:border-yellow-400 outline-none text-white text-sm"
                          placeholder="e.g. Acme Corp Ltd"
                        />
                      </div>
                      <div className="space-y-1.5 text-left">
                        <label className="text-[10px] font-black tracking-widest text-gray-400 uppercase">Account Code (Optional)</label>
                        <input
                          type="text"
                          value={formData.accountReference}
                          onChange={(e) => setFormData(prev => ({...prev, accountReference: e.target.value}))}
                          className="w-full px-4 py-3 bg-white/[0.03] border border-white/8 rounded-xl focus:border-yellow-400 outline-none text-white text-sm"
                          placeholder="e.g. PO-987"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Airport Options Banner */}
                {formData.bookingCategory === 'airport' && (
                  <div className="text-left mb-6">
                    <div className="flex rounded-xl overflow-hidden border border-white/5 bg-gray-950/60 p-1">
                      <button 
                        type="button"
                        onClick={() => setFormData(prev => ({...prev, airportDirection: 'to_airport', selectedAirport: '', pickup: null, dropoff: null}))}
                        className={`flex-1 py-3 font-bold text-xs uppercase tracking-wider rounded-lg transition-all ${formData.airportDirection === 'to_airport' ? 'bg-yellow-400 text-gray-950 shadow' : 'text-gray-400 hover:text-white'}`}
                      >
                        → Journey to Airport
                      </button>
                      <button 
                        type="button"
                        onClick={() => setFormData(prev => ({...prev, airportDirection: 'from_airport', selectedAirport: '', pickup: null, dropoff: null}))}
                        className={`flex-1 py-3 font-bold text-xs uppercase tracking-wider rounded-lg transition-all ${formData.airportDirection === 'from_airport' ? 'bg-yellow-400 text-gray-950 shadow' : 'text-gray-400 hover:text-white'}`}
                      >
                        ← Pickup from Airport
                      </button>
                    </div>
                  </div>
                )}

                {/* Return Trip / One Way Toggle */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, tripType: 'one-way' }))}
                    className={`rounded-xl border px-2 sm:px-4 py-3.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all ${formData.tripType === 'one-way' ? 'border-yellow-400 bg-yellow-400/5 text-yellow-400' : 'border-white/5 bg-white/[0.02] text-gray-400 hover:border-white/15 hover:text-white'}`}
                  >
                    One Way
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, tripType: 'return' }))}
                    className={`rounded-xl border px-2 sm:px-4 py-3.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all relative ${formData.tripType === 'return' ? 'border-yellow-400 bg-yellow-400/5 text-yellow-400' : 'border-white/5 bg-white/[0.02] text-gray-400 hover:border-white/15 hover:text-white'}`}
                  >
                    Return Trip
                  </button>
                  <div className="col-span-2 rounded-xl bg-white/[0.02] border border-white/5 px-4 py-3 text-[10px] uppercase font-bold tracking-widest text-gray-400 flex items-center gap-2">
                    <BadgeCheck size={14} className="text-yellow-400 flex-shrink-0" /> Fixed Fare • No Surges
                  </div>
                </div>

                {/* Route Autocomplete Input Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                  
                  {/* Pickup Address */}
                  <div className="space-y-1.5 md:col-span-2">
                    <div className="flex items-center justify-between gap-3">
                      <label className="text-[10px] font-black tracking-widest text-gray-400 uppercase">
                        {formData.bookingCategory === 'airport' ? (formData.airportDirection === 'to_airport' ? 'Pickup Address' : 'Pickup Airport') : 'Pickup Location'}
                      </label>
                      {formData.bookingCategory === 'standard' && (
                        <button type="button" onClick={handleSwapLocations} className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-yellow-400/70 hover:text-yellow-400 transition-colors">
                          <ArrowLeftRight size={12} /> Swap Route
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      {(formData.bookingCategory === 'airport' && formData.airportDirection === 'from_airport') ? (
                        <div className="relative">
                          <Plane className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={18} />
                          <select
                            value={formData.selectedAirport}
                            onChange={(e) => setFormData(prev => ({...prev, selectedAirport: e.target.value}))}
                            className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/8 rounded-2xl focus:border-yellow-400 outline-none text-white font-semibold appearance-none text-sm"
                          >
                            <option value="" className="bg-gray-950 text-gray-400">Select UK Airport</option>
                            {UK_AIRPORTS.map(a => <option key={a} value={a} className="bg-gray-950 text-white">{a}</option>)}
                          </select>
                        </div>
                      ) : (
                        isLoaded ? (
                          <GooglePlacesAutocomplete
                            apiKey={GOOGLE_MAPS_API_KEY}
                            autocompletionRequest={{ componentRestrictions: { country: ['gb'] } }}
                            selectProps={{
                              value: formData.pickup,
                              onChange: (val) => setFormData(prev => ({ ...prev, pickup: val })),
                              placeholder: 'Enter pickup address...',
                              isClearable: true,
                              styles: placeSelectStyles,
                            }}
                          />
                        ) : <div className="h-[58px] bg-white/5 animate-pulse rounded-2xl" />
                      )}
                    </div>
                  </div>

                  {/* Drop-off Address */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[10px] font-black tracking-widest text-gray-400 uppercase">
                      {formData.bookingCategory === 'airport' ? (formData.airportDirection === 'to_airport' ? 'Destination Airport' : 'Drop-off Address') : 'Drop-off Location'}
                    </label>
                    <div className="relative">
                      {(formData.bookingCategory === 'airport' && formData.airportDirection === 'to_airport') ? (
                        <div className="relative">
                          <Plane className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={18} />
                          <select
                            value={formData.selectedAirport}
                            onChange={(e) => setFormData(prev => ({...prev, selectedAirport: e.target.value}))}
                            className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/8 rounded-2xl focus:border-yellow-400 outline-none text-white font-semibold appearance-none text-sm"
                          >
                            <option value="" className="bg-gray-950 text-gray-400">Select UK Airport</option>
                            {UK_AIRPORTS.map(a => <option key={a} value={a} className="bg-gray-950 text-white">{a}</option>)}
                          </select>
                        </div>
                      ) : (
                        isLoaded ? (
                          <GooglePlacesAutocomplete
                            apiKey={GOOGLE_MAPS_API_KEY}
                            autocompletionRequest={{ componentRestrictions: { country: ['gb'] } }}
                            selectProps={{
                              value: formData.dropoff,
                              onChange: (val) => setFormData(prev => ({ ...prev, dropoff: val })),
                              placeholder: 'Enter destination address...',
                              isClearable: true,
                              styles: placeSelectStyles,
                            }}
                          />
                        ) : <div className="h-[58px] bg-white/5 animate-pulse rounded-2xl" />
                      )}
                    </div>
                  </div>

                  {/* Optional Flight Number (Airport Only) */}
                  {formData.bookingCategory === 'airport' && (
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-[10px] font-black tracking-widest text-gray-400 uppercase">Flight Number (Optional)</label>
                      <div className="relative">
                        <Plane className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="text"
                          name="flightNumber"
                          placeholder="e.g. BA249"
                          value={formData.flightNumber}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/8 rounded-2xl focus:border-yellow-400 focus:bg-gray-950/40 transition-all outline-none text-white text-sm"
                        />
                      </div>
                    </div>
                  )}

                  {/* Via Stop */}
                  <div className="space-y-1.5 md:col-span-2">
                    <div className="flex items-center justify-between gap-3">
                      <label className="text-[10px] font-black tracking-widest text-gray-400 uppercase">Via Intermediate Stop</label>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, viaStopEnabled: !prev.viaStopEnabled, viaStop: prev.viaStopEnabled ? null : prev.viaStop }))}
                        className="text-[10px] font-bold uppercase tracking-wider text-yellow-400/80 hover:text-yellow-400 transition-colors"
                      >
                        {formData.viaStopEnabled ? 'Remove stop' : 'Add stop'}
                      </button>
                    </div>
                    {formData.viaStopEnabled ? (
                      <div className="relative">
                        {isLoaded ? (
                          <GooglePlacesAutocomplete
                            apiKey={GOOGLE_MAPS_API_KEY}
                            autocompletionRequest={{
                              componentRestrictions: { country: ['gb'] },
                            }}
                            selectProps={{
                              value: formData.viaStop,
                              onChange: (val) => setFormData(prev => ({ ...prev, viaStop: val })),
                              placeholder: 'Add a intermediate stop...',
                              isClearable: true,
                              blurInputOnSelect: false,
                              closeMenuOnSelect: true,
                              menuPortalTarget: document.body,
                              menuPosition: 'fixed',
                              menuShouldScrollIntoView: false,
                              styles: placeSelectStyles,
                            }}
                          />
                        ) : <div className="h-[58px] bg-white/5 animate-pulse rounded-2xl" />}
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-dashed border-white/5 bg-white/[0.01] px-4 py-4 text-xs text-gray-500 flex items-center gap-2 font-medium">
                        <MapPin size={14} className="text-yellow-400/50" /> Add extra pickup/dropoff points if needed.
                      </div>
                    )}
                  </div>

                  {/* Journey Date */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-black tracking-widest text-gray-400 uppercase">Departure Date</label>
                    <div className="relative cursor-pointer" onClick={() => openNativePicker(departureDateRef.current)}>
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <span className={`absolute left-12 right-10 top-1/2 -translate-y-1/2 text-sm font-medium pointer-events-none truncate ${formData.date ? 'text-white' : 'text-gray-500'}`}>
                        {formData.date ? formatDateDisplay(formData.date) : 'Select departure date'}
                      </span>
                      <input
                        ref={departureDateRef}
                        required
                        type="date"
                        name="date"
                        min={today}
                        value={formData.date}
                        onChange={handleChange}
                        className="w-full pl-12 pr-10 py-4 bg-white/[0.03] border border-white/8 rounded-2xl focus:border-yellow-400 focus:bg-gray-950/40 transition-all outline-none text-transparent caret-transparent text-sm native-value-hidden cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Return Trip Details */}
                  {requiresReturnTripDetails && (
                    <>
                      <div className="space-y-1.5 text-left">
                        <label className="text-[10px] font-black tracking-widest text-gray-400 uppercase">Return Date</label>
                        <div className="relative cursor-pointer" onClick={() => openNativePicker(returnDateRef.current)}>
                          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <span className={`absolute left-12 right-10 top-1/2 -translate-y-1/2 text-sm font-medium pointer-events-none truncate ${formData.returnDate ? 'text-white' : 'text-gray-500'}`}>
                            {formData.returnDate ? formatDateDisplay(formData.returnDate) : 'Select return date'}
                          </span>
                          <input
                            ref={returnDateRef}
                            required={requiresReturnTripDetails}
                            type="date"
                            name="returnDate"
                            min={formData.date || today}
                            value={formData.returnDate}
                            onChange={handleChange}
                            className="w-full pl-12 pr-10 py-4 bg-white/[0.03] border border-white/8 rounded-2xl focus:border-yellow-400 focus:bg-gray-950/40 transition-all outline-none text-transparent caret-transparent text-sm native-value-hidden cursor-pointer"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5 text-left">
                        <label className="text-[10px] font-black tracking-widest text-gray-400 uppercase">Return Time</label>
                        <div className="relative cursor-pointer" onClick={() => openNativePicker(returnTimeRef.current)}>
                          <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <span className={`absolute left-12 right-10 top-1/2 -translate-y-1/2 text-sm font-medium pointer-events-none truncate ${formData.returnTime ? 'text-white' : 'text-gray-500'}`}>
                            {formData.returnTime ? formatTimeDisplay(formData.returnTime) : 'Select return time'}
                          </span>
                          <input
                            ref={returnTimeRef}
                            required={requiresReturnTripDetails}
                            type="time"
                            name="returnTime"
                            value={formData.returnTime}
                            onChange={handleChange}
                            className="w-full pl-12 pr-10 py-4 bg-white/[0.03] border border-white/8 rounded-2xl focus:border-yellow-400 focus:bg-gray-950/40 transition-all outline-none text-transparent caret-transparent text-sm native-value-hidden cursor-pointer"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Journey Time */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-black tracking-widest text-gray-400 uppercase">Departure Time</label>
                    <div className="relative cursor-pointer" onClick={() => openNativePicker(departureTimeRef.current)}>
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <span className={`absolute left-12 right-10 top-1/2 -translate-y-1/2 text-sm font-medium pointer-events-none truncate ${formData.time ? 'text-white' : 'text-gray-500'}`}>
                        {formData.time ? formatTimeDisplay(formData.time) : 'Select departure time'}
                      </span>
                      <input
                        ref={departureTimeRef}
                        required
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        className="w-full pl-12 pr-10 py-4 bg-white/[0.03] border border-white/8 rounded-2xl focus:border-yellow-400 focus:bg-gray-950/40 transition-all outline-none text-transparent caret-transparent text-sm native-value-hidden cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Vehicle count */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-black tracking-widest text-gray-400 uppercase">Fleet Quantity</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">#</span>
                      <select
                        name="taxiCount"
                        value={formData.taxiCount}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/8 rounded-2xl focus:border-yellow-400 focus:bg-gray-950/40 transition-all outline-none appearance-none font-semibold text-white text-sm"
                      >
                        {[1, 2, 3, 4].map(n => <option key={n} value={n} className="bg-gray-950 text-white">{n} Vehicle{n > 1 ? 's' : ''}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ x: 15, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -15, opacity: 0 }}
                className="space-y-6 text-left"
              >
                <div className="border-b border-white/5 pb-4">
                  <h3 className="text-xl font-condensed tracking-wider text-white">JOURNEY OPTIONS</h3>
                  <p className="text-xs text-gray-400 mt-1">Provide information about passengers, luggage, and special requirements.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black tracking-widest text-gray-400 uppercase">Passengers</label>
                    <div className="relative">
                      <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <select
                        name="passengers"
                        value={formData.passengers}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/8 rounded-2xl focus:border-yellow-400 focus:bg-gray-950/40 outline-none appearance-none font-semibold text-white text-sm animate-none"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <option key={n} value={n} className="bg-gray-950 text-white">{n} Passenger{n > 1 ? 's' : ''}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black tracking-widest text-gray-400 uppercase">Luggage bags</label>
                    <div className="relative">
                      <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <select
                        name="luggage"
                        value={formData.luggage}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/8 rounded-2xl focus:border-yellow-400 focus:bg-gray-950/40 outline-none appearance-none font-semibold text-white text-sm"
                      >
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(n => <option key={n} value={n} className="bg-gray-950 text-white">{n} Bag{n > 1 ? 's' : ''}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black tracking-widest text-gray-400 uppercase">Child / Baby Seats</label>
                    <select
                      name="childSeats"
                      value={formData.childSeats}
                      onChange={handleChange}
                      className="w-full px-4 py-4 bg-white/[0.03] border border-white/8 rounded-2xl focus:border-yellow-400 focus:bg-gray-950/40 outline-none appearance-none font-semibold text-white text-sm"
                    >
                      {[0, 1, 2, 3].map(n => <option key={n} value={n} className="bg-gray-950 text-white">{n} Child Seat{n !== 1 ? 's' : ''}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black tracking-widest text-gray-400 uppercase">Accessibility Option</label>
                    <label className="flex items-center gap-3 w-full px-4 py-[15px] bg-white/[0.03] border border-white/8 rounded-2xl cursor-pointer hover:bg-white/[0.06] transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.wheelchairAccessible}
                        onChange={(e) => setFormData(prev => ({...prev, wheelchairAccessible: e.target.checked}))}
                        className="w-5 h-5 text-yellow-500 bg-gray-900 border-white/10 rounded focus:ring-yellow-400 focus:ring-offset-gray-950"
                      />
                      <span className="font-semibold text-sm text-gray-300">Wheelchair Accessible</span>
                    </label>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ x: 15, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -15, opacity: 0 }}
                className="space-y-6 text-left"
              >
                <div className="border-b border-white/5 pb-4">
                  <h3 className="text-xl font-condensed tracking-wider text-white">PERSONAL DETAILS</h3>
                  <p className="text-xs text-gray-400 mt-1">Please provide your contact information to finalize this booking quote.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black tracking-widest text-gray-400 uppercase">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        required
                        type="text"
                        name="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/8 rounded-2xl focus:border-yellow-400 focus:bg-gray-950/40 transition-all outline-none text-white text-sm"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black tracking-widest text-gray-400 uppercase">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        required
                        type="tel"
                        name="phone"
                        placeholder="e.g. 07700 900077"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/8 rounded-2xl focus:border-yellow-400 focus:bg-gray-950/40 transition-all outline-none text-white text-sm"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[10px] font-black tracking-widest text-gray-400 uppercase">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        required
                        type="email"
                        name="email"
                        placeholder="john.doe@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/8 rounded-2xl focus:border-yellow-400 focus:bg-gray-950/40 transition-all outline-none text-white text-sm"
                      />
                    </div>
                  </div>

                  {/* Payment */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[10px] font-black tracking-widest text-gray-400 uppercase">Payment Option</label>
                    <div className="relative">
                      <BadgeCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <select
                        name="paymentMethod"
                        value={formData.paymentMethod}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/8 rounded-2xl focus:border-yellow-400 focus:bg-gray-950/40 transition-all outline-none appearance-none font-semibold text-white text-sm"
                      >
                        <option value="cash" className="bg-gray-950 text-white">Cash to Driver</option>
                        {formData.bookingCategory === 'business' && <option value="invoice" className="bg-gray-950 text-white">Monthly Invoice (Corporate)</option>}
                      </select>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[10px] font-black tracking-widest text-gray-400 uppercase">Special Ride Notes</label>
                    <textarea
                      name="notes"
                      rows={3}
                      placeholder="Add specific instructions for pickup, landmarks, or flight details..."
                      value={formData.notes}
                      onChange={handleChange}
                      className="w-full px-5 py-4 bg-white/[0.03] border border-white/8 rounded-2xl focus:border-yellow-400 focus:bg-gray-950/40 transition-all outline-none resize-none text-white text-sm"
                    ></textarea>
                  </div>

                  {/* Terms */}
                  <div className="space-y-1.5 md:col-span-2 mt-2">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        required
                        checked={formData.termsAccepted}
                        onChange={(e) => setFormData(prev => ({...prev, termsAccepted: e.target.checked}))}
                        className="w-5 h-5 mt-0.5 text-yellow-500 bg-gray-900 border-white/10 rounded focus:ring-yellow-400 focus:ring-offset-gray-950 shrink-0"
                      />
                      <span className="text-xs text-gray-400 leading-normal">
                        I confirm that I agree to the <a href="/terms" target="_blank" className="text-yellow-400 font-bold hover:underline">Terms & Conditions</a> and consent to my submitted data being securely processed to organize this booking.
                      </span>
                    </label>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Forward/Back Control Action Buttons */}
          <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
            {step > 1 ? (
              <button 
                type="button" 
                onClick={prevStep} 
                className="flex items-center space-x-2 text-gray-400 hover:text-white font-condensed tracking-wider font-bold transition-colors text-sm"
              >
                <ArrowLeft size={16} />
                <span>GO BACK</span>
              </button>
            ) : <div />}

            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={isNavigating || (!hasPickup || !hasDropoff) || !formData.date || !formData.time || (requiresReturnTripDetails && (!formData.returnDate || !formData.returnTime)) || (formData.bookingCategory === 'business' && !formData.companyName)}
                className="bg-yellow-400 hover:bg-yellow-500 disabled:opacity-30 disabled:cursor-not-allowed text-gray-950 font-condensed tracking-widest font-black py-4 px-10 rounded-2xl transition-all shadow-lg flex items-center space-x-2 text-sm hover:scale-[1.02]"
              >
                <span>{step === 1 ? 'GET QUOTE' : 'CONTINUE'}</span>
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting || isNavigating || !formData.termsAccepted}
                className="bg-yellow-400 hover:bg-yellow-500 disabled:opacity-30 disabled:cursor-not-allowed text-gray-950 font-condensed tracking-widest font-black py-4 px-10 rounded-2xl transition-all shadow-lg flex items-center space-x-2 text-sm hover:scale-[1.02] pulse-glow-btn"
              >
                {isSubmitting ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-950 mr-2" /> : <CheckCircle size={16} className="mr-1" />}
                <span>{isSubmitting ? 'PROCESSING...' : 'CONFIRM BOOKING'}</span>
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Floating Summary Receipt Sidebar */}
      <div className="lg:w-80 w-full shrink-0">
        <div className="glass-panel rounded-3xl p-6 border border-white/5 sticky top-28 text-left overflow-hidden relative">
          {/* Subtle Glow Overlay */}
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-yellow-400/5 rounded-full blur-2xl" />
          
          <div className="flex items-center gap-2 mb-4 text-[10px] font-black uppercase tracking-widest text-yellow-400">
            <Sparkles size={12} className="animate-spin" style={{ animationDuration: '6s' }} /> Instant Quote Estimator
          </div>
          
          <h3 className="text-lg font-condensed text-white mb-6 tracking-wider border-b border-white/5 pb-4">RIDE DETAILS</h3>
          
          <div className="space-y-6">
            
            {/* Route Map Timeline */}
            <div>
              <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">JOURNEY TIMELINE</div>
              <div className="space-y-3 relative pl-4 border-l border-white/10 ml-1">
                
                {/* Pickup node */}
                <div className="relative">
                  <div className="absolute -left-[20.5px] top-1 bg-yellow-400 w-2 h-2 rounded-full border border-gray-900" />
                  <span className="text-[10px] text-gray-400 block font-semibold">PICKUP</span>
                  <p className="text-xs font-bold text-white line-clamp-2 leading-tight">
                    {formData.bookingCategory === 'airport' && formData.airportDirection === 'from_airport' 
                      ? formData.selectedAirport || 'Select Airport' 
                      : formData.pickup?.label || 'Address not set'}
                  </p>
                </div>

                {/* Via stop node if active */}
                {formData.viaStopEnabled && formData.viaStop && (
                  <div className="relative">
                    <div className="absolute -left-[20.5px] top-1 bg-yellow-500 w-2 h-2 rounded-full border border-gray-900" />
                    <span className="text-[10px] text-yellow-500 block font-semibold">VIA</span>
                    <p className="text-xs font-bold text-white line-clamp-2 leading-tight">
                      {formData.viaStop.label}
                    </p>
                  </div>
                )}

                {/* Dropoff node */}
                <div className="relative">
                  <div className="absolute -left-[20.5px] top-1 bg-red-500 w-2 h-2 rounded-full border border-gray-900" />
                  <span className="text-[10px] text-gray-400 block font-semibold">DESTINATION</span>
                  <p className="text-xs font-bold text-white line-clamp-2 leading-tight">
                    {formData.bookingCategory === 'airport' && formData.airportDirection === 'to_airport' 
                      ? formData.selectedAirport || 'Select Airport' 
                      : formData.dropoff?.label || 'Address not set'}
                  </p>
                </div>
              </div>
            </div>

            {/* DateTime Details */}
            <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
              <div>
                <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">DATE</div>
                <p className="text-xs font-bold text-white">{formData.date || '---'}</p>
              </div>
              <div>
                <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">TIME</div>
                <p className="text-xs font-bold text-white">{formData.time || '---'}</p>
              </div>
            </div>

            {/* Vehicle Selection details */}
            <div className="border-t border-white/5 pt-4">
              <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">RIDE CAPACITY</div>
              <div className="flex justify-between text-xs text-gray-400 leading-relaxed">
                <span>{formData.passengers} Passengers</span>
                <span>{formData.luggage} Bags</span>
              </div>
              {formData.tripType === 'return' && (
                <div className="bg-yellow-400/10 border border-yellow-400/20 p-2 rounded-lg text-[9px] font-bold text-yellow-400 uppercase tracking-wider text-center mt-3">
                  Return journey included
                </div>
              )}
            </div>

            {/* Price section */}
            <div className="pt-6 border-t border-white/10">
              
              {distance && <div className="text-[10px] text-gray-500 font-semibold mb-2">Distance: {distance}</div>}
              <p className="text-[9px] text-gray-500 text-center italic font-semibold border-t border-white/5 pt-2 mt-2">Fixed fare, no surges, all airport fees included</p>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 border-t border-white/5 pt-4">
              <div className="rounded-xl bg-white/[0.01] border border-white/5 p-2 flex items-center gap-1.5"><BadgeCheck size={12} className="text-yellow-400" /> Fixed price</div>
              <div className="rounded-xl bg-white/[0.01] border border-white/5 p-2 flex items-center gap-1.5"><CheckCircle size={12} className="text-yellow-400" /> Instant</div>
              <div className="rounded-xl bg-white/[0.01] border border-white/5 p-2 flex items-center gap-1.5"><Clock size={12} className="text-yellow-400" /> 24/7 Service</div>
              <div className="rounded-xl bg-white/[0.01] border border-white/5 p-2 flex items-center gap-1.5"><ShieldCheck size={12} className="text-yellow-400" /> Vetted</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default BookingForm;
