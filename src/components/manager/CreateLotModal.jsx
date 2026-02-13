/* Form to create a new parking lot */

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

  /* Initialize Google Places Autocomplete */
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

  /* Handle input change */
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

  /* Handle manual location input (when Google Maps not available) */
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

  /* Validate form */
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

  /* Handle form submit */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Generate section labels
      const sectionLabels = [];
      for (let i = 0; i < formData.sections; i++) {
        sectionLabels.push(String.fromCharCode(65 + i)); // A, B, C...
      }
      
      // Create lot object
      const newLot = {
        id: Date.now(),
        name: formData.name,
        location: formData.location,
        locationDetails: formData.locationDetails,
        sections: sectionLabels,
        slotsPerSection: parseInt(formData.slotsPerSection),
        totalSlots: parseInt(formData.sections) * parseInt(formData.slotsPerSection),
        hourlyRate: parseInt(formData.hourlyRate),
        is24_7: formData.is24_7,
        openTime: formData.is24_7 ? null : formData.openTime,
        closeTime: formData.is24_7 ? null : formData.closeTime,
        createdAt: new Date().toISOString()
      };
      
      // Call parent callback
      onLotCreated(newLot);
      
      setLoading(false);
    }, 1000);
  };

  /* Calculate total slots */
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