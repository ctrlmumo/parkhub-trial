import { useState } from 'react';
import { X, Building2, MapPin, DollarSign, Car, Clock, AlertCircle, Loader2 } from 'lucide-react';
import api from '../../services/api';
import Button from '../common/Button';
import './EditLotModal.css';

const EditLotModal = ({ lot, onClose, onLotUpdated }) => {
  const [formData, setFormData] = useState({
    name: lot.name || '',
    location: lot.location || '',
    total_capacity: lot.total_capacity || '',
    hourly_rate: lot.hourly_rate || '',
    is_24_7: lot.is_24_7 ?? true,
    open_time: lot.open_time || '08:00',
    close_time: lot.close_time || '20:00',
    is_active: lot.is_active ?? true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation
    if (!formData.name.trim()) {
      setError('Parking lot name is required.');
      setLoading(false);
      return;
    }
    if (!formData.location.trim()) {
      setError('Location is required.');
      setLoading(false);
      return;
    }
    if (!formData.total_capacity || parseInt(formData.total_capacity) < 1) {
      setError('Capacity must be at least 1.');
      setLoading(false);
      return;
    }
    if (!formData.hourly_rate || parseFloat(formData.hourly_rate) < 0) {
      setError('Hourly rate must be a positive number.');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        name: formData.name.trim(),
        location: formData.location.trim(),
        total_capacity: parseInt(formData.total_capacity),
        hourly_rate: parseFloat(formData.hourly_rate),
        is_24_7: formData.is_24_7,
        is_active: formData.is_active,
        open_time: formData.is_24_7 ? null : formData.open_time || null,
        close_time: formData.is_24_7 ? null : formData.close_time || null,
      };

      const response = await api.patch(`/parking-lots/${lot.id}/`, payload);
      onLotUpdated(response.data);

      onClose();
    } catch (err) {
      console.error('Failed to update lot:', err);
      setError(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        'Failed to update parking lot. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-lot-modal-overlay" onClick={onClose}>
      <div
        className="edit-lot-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="edit-lot-modal-header">
          <h2 className="edit-lot-modal-title">
            <Building2 size={22} />
            Edit Parking Lot
          </h2>
          <button className="edit-lot-modal-close" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="edit-lot-modal-body">

            {error && (
              <div className="edit-lot-error">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            {/* Basic Info */}
            <p className="edit-lot-section-label">Basic Information</p>

            <div className="edit-lot-field">
              <label className="edit-lot-label" htmlFor="edit-name">
                <Building2 size={15} />
                Parking Lot Name
              </label>
              <input
                id="edit-name"
                className="edit-lot-input"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Main Campus Parking"
                required
              />
            </div>

            <div className="edit-lot-field">
              <label className="edit-lot-label" htmlFor="edit-location">
                <MapPin size={15} />
                Location
              </label>
              <input
                id="edit-location"
                className="edit-lot-input"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. University Way, Nairobi"
                required
              />
            </div>

            <div className="edit-lot-row">
              <div className="edit-lot-field">
                <label className="edit-lot-label" htmlFor="edit-capacity">
                  <Car size={15} />
                  Total Capacity
                </label>
                <input
                  id="edit-capacity"
                  className="edit-lot-input"
                  name="total_capacity"
                  type="number"
                  min="1"
                  value={formData.total_capacity}
                  onChange={handleChange}
                  placeholder="e.g. 80"
                  required
                />
              </div>

              <div className="edit-lot-field">
                <label className="edit-lot-label" htmlFor="edit-rate">
                  <DollarSign size={15} />
                  Hourly Rate (KES)
                </label>
                <input
                  id="edit-rate"
                  className="edit-lot-input"
                  name="hourly_rate"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.hourly_rate}
                  onChange={handleChange}
                  placeholder="e.g. 50"
                  required
                />
              </div>
            </div>

            <div className="edit-lot-divider" />

            {/* Operating Hours */}
            <p className="edit-lot-section-label">Operating Hours</p>

            <div className="edit-lot-checkbox-group">
              <input
                id="edit-24-7"
                className="edit-lot-checkbox"
                type="checkbox"
                name="is_24_7"
                checked={formData.is_24_7}
                onChange={handleChange}
              />
              <label htmlFor="edit-24-7" className="edit-lot-checkbox-label">
                <Clock size={14} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                Open 24 / 7
              </label>
            </div>

            {!formData.is_24_7 && (
              <div className="edit-lot-hours-row">
                <div className="edit-lot-field">
                  <label className="edit-lot-label" htmlFor="edit-open">Opening Time</label>
                  <input
                    id="edit-open"
                    className="edit-lot-input"
                    type="time"
                    name="open_time"
                    value={formData.open_time}
                    onChange={handleChange}
                  />
                </div>
                <div className="edit-lot-field">
                  <label className="edit-lot-label" htmlFor="edit-close">Closing Time</label>
                  <input
                    id="edit-close"
                    className="edit-lot-input"
                    type="time"
                    name="close_time"
                    value={formData.close_time}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}

            <div className="edit-lot-divider" />

            {/* Status */}
            <p className="edit-lot-section-label">Status</p>

            <div className="edit-lot-checkbox-group">
              <input
                id="edit-active"
                className="edit-lot-checkbox"
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
              />
              <label htmlFor="edit-active" className="edit-lot-checkbox-label">
                Lot is Active (visible to drivers)
              </label>
            </div>

          </div>

          {/* Footer */}
          <div className="edit-lot-modal-footer">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              icon={loading ? <Loader2 size={16} className="spin" /> : null}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLotModal;