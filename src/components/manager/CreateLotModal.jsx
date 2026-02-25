import { useState } from 'react';
import { X, Loader2, MapPin, DollarSign, Car, Type } from 'lucide-react';
import api from '../../services/api';
import Button from '../common/Button';
import Input from '../common/Input';
import './CreateLotModal.css';

const CreateLotModal = ({ onClose, onLotCreated }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    total_capacity: '',
    hourly_rate: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/parking-lots/', {
        ...formData,
        total_capacity: parseInt(formData.total_capacity),
        hourly_rate: parseFloat(formData.hourly_rate),
        is_active: true,
        is_24_7: true // Default for now
      });

      onLotCreated(response.data);
    } catch (err) {
      console.error('Failed to create lot:', err);
      setError(err.response?.data?.message || 'Failed to create parking lot. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Parking Lot</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-content">
          {error && (
            <div className="error-banner">
              {error}
            </div>
          )}

          <Input
            label="Parking Lot Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Central Business Park"
            icon={<Type size={18} />}
            required
          />

          <Input
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g. Kenyatta Avenue, Nairobi"
            icon={<MapPin size={18} />}
            required
          />

          <div className="form-row">
            <Input
              label="Capacity (Slots)"
              name="total_capacity"
              type="number"
              value={formData.total_capacity}
              onChange={handleChange}
              placeholder="e.g. 50"
              icon={<Car size={18} />}
              min="1"
              required
            />

            <Input
              label="Hourly Rate (KES)"
              name="hourly_rate"
              type="number"
              value={formData.hourly_rate}
              onChange={handleChange}
              placeholder="e.g. 100"
              icon={<DollarSign size={18} />}
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="modal-actions">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary" 
              loading={loading}
              icon={loading ? <Loader2 className="spin" /> : null}
            >
              {loading ? 'Creating...' : 'Create Parking Lot'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateLotModal;