import api from '../../services/api'
import { useState, useRef, useEffect } from 'react';
import { X, MapPin, Grid3x3, Hash, DollarSign, Clock } from 'lucide-react';
import './CreateLotModal.css';

const CreateLotModal = ({ onClose, onLotCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    locationDetails: null,
    sections: 4,
    slotsPerSection: 20,
    hourlyRate: 50,
    is24_7: true,
    openTime: '08:00',
    closeTime: '18:00'
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const locationInputRef = useRef(null);
  const autocompleteRef = useRef(null);

  /**
   * Initialize Google Places Autocomplete
   */
  useEffect(() => {
    if (!window.google) {
      console.warn('Google Maps not loaded. Using placeholder.');
      return;
    }

    // Initialize autocomplete
    const autocomplete = new window.google.maps.places.Autocomplete(
      locationInputRef.current,
      {
        types: ['address'],
        componentRestrictions: { country: 'ke' } // Kenya only
      }
    );

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      
      if (place.geometry) {
        setFormData(prev => ({
          ...prev,
          location: place.formatted_address || place.name,
          locationDetails: {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            placeId: place.place_id
          }
        }));
        
        // Clear error
        if (errors.location) {
          setErrors(prev => ({ ...prev, location: '' }));
        }
      }
    });

    autocompleteRef.current = autocomplete;
  }, []);

  /**
   * Handle input change
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  /**
   * Handle manual location input (when Google Maps not available)
   */
  const handleLocationChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      location: value
    }));
    
    if (errors.location) {
      setErrors(prev => ({ ...prev, location: '' }));
    }
  };

  /**
   * Validate form
   */
  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Parking lot name is required';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (formData.sections < 1 || formData.sections > 26) {
      newErrors.sections = 'Sections must be between 1 and 26';
    }
    
    if (formData.slotsPerSection < 1 || formData.slotsPerSection > 100) {
      newErrors.slotsPerSection = 'Slots per section must be between 1 and 100';
    }
    
    if (formData.hourlyRate < 10) {
      newErrors.hourlyRate = 'Hourly rate must be at least KES 10';
    }
    
    if (!formData.is24_7) {
      if (!formData.openTime) {
        newErrors.openTime = 'Opening time is required';
      }
      if (!formData.closeTime) {
        newErrors.closeTime = 'Closing time is required';
      }
      if (formData.openTime && formData.closeTime && formData.openTime >= formData.closeTime) {
        newErrors.closeTime = 'Closing time must be after opening time';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submit
   */
  /**
   * Handle form submit - DYNAMIC
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // 1. Prepare payload for the Parking Lot
      const lotPayload = {
        name: formData.name,
        location: formData.location,
        total_capacity: parseInt(formData.sections) * parseInt(formData.slotsPerSection),
        hourly_rate: parseFloat(formData.hourlyRate),
        is_24_7: formData.is24_7,
        open_time: formData.is24_7 ? null : formData.openTime,
        close_time: formData.is24_7 ? null : formData.closeTime,
        latitude: formData.locationDetails?.lat || null,
        longitude: formData.locationDetails?.lng || null,
        is_active: true
      };

      // 2. Create the Parking Lot in Django
      const lotResponse = await api.post('/parking-lots/', lotPayload);
      const createdLot = lotResponse.data;

      // 3. Automated Slot Generation
      // Loop through sections and slots to create them in the database
      const slotPromises = [];
      
      for (let i = 0; i < formData.sections; i++) {
        const sectionLabel = String.fromCharCode(65 + i); // Converts 0 to 'A', 1 to 'B', etc.
        
        for (let j = 1; j <= formData.slotsPerSection; j++) {
          const slotNumber = `${sectionLabel}${j.toString().padStart(2, '0')}`; // e.g., 'A01'
          
          slotPromises.push(
            api.post('/parking-slots/', {
              parking_lot: createdLot.id,
              slot_number: slotNumber,
              section: sectionLabel,
              status: 'available',
              is_ev_charging: false, // Defaulting to false, manager can edit later
              is_disabled_friendly: false
            })
          );
        }
      }

      // Wait for all slots to finish creating
      await Promise.all(slotPromises);

      // 4. Close modal and trigger parent refresh
      onLotCreated(createdLot);

    } catch (error) {
      console.error("Failed to create lot or slots:", error);
      
      // Check if Django sent back specific validation errors
      const errorMsg = error.response?.data?.message 
        || error.response?.data?.detail 
        || "Failed to create parking lot. Please try again.";
        
      setErrors(prev => ({ ...prev, submit: errorMsg }));
    } finally {
      setLoading(false);
    }
  };

  /**
   * Calculate total slots
   */
  const totalSlots = formData.sections * formData.slotsPerSection;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="create-lot-modal" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Create Parking Lot</h2>
            <p className="modal-subtitle">Add a new parking lot to your management</p>
          </div>
          <button onClick={onClose} className="modal-close" aria-label="Close">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="modal-form">
          
          {/* Lot Name */}
          <div className="form-group">
            <label className="form-label">
              Parking Lot Name <span className="required">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Main Campus Parking"
              className={`form-input ${errors.name ? 'error' : ''}`}
            />
            {errors.name && <p className="error-message">{errors.name}</p>}
          </div>

          {/* Location (Google Maps Autocomplete) */}
          <div className="form-group">
            <label className="form-label">
              <MapPin size={16} />
              Location <span className="required">*</span>
            </label>
            <input
              ref={locationInputRef}
              type="text"
              name="location"
              value={formData.location}
              onChange={handleLocationChange}
              placeholder="Search for address..."
              className={`form-input ${errors.location ? 'error' : ''}`}
            />
            <p className="form-hint">Start typing to search with Google Maps</p>
            {errors.location && <p className="error-message">{errors.location}</p>}
          </div>

          {/* Grid Configuration */}
          <div className="form-row">
            {/* Number of Sections */}
            <div className="form-group">
              <label className="form-label">
                <Grid3x3 size={16} />
                Number of Sections <span className="required">*</span>
              </label>
              <input
                type="number"
                name="sections"
                value={formData.sections}
                onChange={handleChange}
                min="1"
                max="26"
                className={`form-input ${errors.sections ? 'error' : ''}`}
              />
              <p className="form-hint">1-26 sections (A, B, C...)</p>
              {errors.sections && <p className="error-message">{errors.sections}</p>}
            </div>

            {/* Slots per Section */}
            <div className="form-group">
              <label className="form-label">
                <Hash size={16} />
                Slots per Section <span className="required">*</span>
              </label>
              <input
                type="number"
                name="slotsPerSection"
                value={formData.slotsPerSection}
                onChange={handleChange}
                min="1"
                max="100"
                className={`form-input ${errors.slotsPerSection ? 'error' : ''}`}
              />
              <p className="form-hint">1-100 slots per section</p>
              {errors.slotsPerSection && <p className="error-message">{errors.slotsPerSection}</p>}
            </div>
          </div>

          {/* Total Slots Preview */}
          <div className="total-slots-preview">
            <span className="preview-label">Total Slots:</span>
            <span className="preview-value">{totalSlots} slots</span>
          </div>

          {/* Hourly Rate */}
          <div className="form-group">
            <label className="form-label">
              <DollarSign size={16} />
              Price per Hour (KES) <span className="required">*</span>
            </label>
            <input
              type="number"
              name="hourlyRate"
              value={formData.hourlyRate}
              onChange={handleChange}
              min="10"
              step="10"
              className={`form-input ${errors.hourlyRate ? 'error' : ''}`}
            />
            {errors.hourlyRate && <p className="error-message">{errors.hourlyRate}</p>}
          </div>

          {/* Operating Hours */}
          <div className="form-group">
            <label className="form-label">
              <Clock size={16} />
              Operating Hours <span className="required">*</span>
            </label>
            
            {/* 24/7 Toggle */}
            <label className="toggle-option">
              <input
                type="radio"
                name="is24_7"
                checked={formData.is24_7}
                onChange={() => setFormData(prev => ({ ...prev, is24_7: true }))}
              />
              <span className="toggle-label">24/7 (Open All Day)</span>
            </label>

            <label className="toggle-option">
              <input
                type="radio"
                name="is24_7"
                checked={!formData.is24_7}
                onChange={() => setFormData(prev => ({ ...prev, is24_7: false }))}
              />
              <span className="toggle-label">Select Time Range</span>
            </label>

            {/* Custom Time Range */}
            {!formData.is24_7 && (
              <div className="time-range-inputs">
                <div className="time-input-group">
                  <label className="time-label">Opens at:</label>
                  <input
                    type="time"
                    name="openTime"
                    value={formData.openTime}
                    onChange={handleChange}
                    className={`time-input ${errors.openTime ? 'error' : ''}`}
                  />
                  {errors.openTime && <p className="error-message">{errors.openTime}</p>}
                </div>

                <div className="time-input-group">
                  <label className="time-label">Closes at:</label>
                  <input
                    type="time"
                    name="closeTime"
                    value={formData.closeTime}
                    onChange={handleChange}
                    className={`time-input ${errors.closeTime ? 'error' : ''}`}
                  />
                  {errors.closeTime && <p className="error-message">{errors.closeTime}</p>}
                </div>
              </div>
            )}
          </div>

          {/* Submit Error Banner */}
          {errors.submit && (
            <div style={{ color: '#ef4444', backgroundColor: '#fef2f2', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.875rem' }}>
              {errors.submit}
            </div>
          )}
          
          {/* Form Actions */}
          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn-cancel"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading-spinner-small"></span>
                  Creating...
                </>
              ) : (
                'Create Parking Lot'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateLotModal;