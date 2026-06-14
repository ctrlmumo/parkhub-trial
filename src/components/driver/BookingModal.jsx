import { useState } from 'react';
import { X, Car, Clock, CreditCard, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import Button from '../common/Button';
import Input from '../common/Input';
import { DURATION_OPTIONS } from '../../utils/constants';
import { formatPrice } from '../../utils/helpers';
import { PaystackButton } from 'react-paystack'; 
import './BookingModal.css';

const BookingModal = ({ slot, isOpen, onClose, onComplete, hourlyRate }) => {
  const { user } = useAuth(); // gets the logged-in user
  
  // Multi-step state
  const [step, setStep] = useState(1); // 1: Details, 2: Duration, 3: Payment, 4: Success
  
  // Form data
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    phoneNumber: '',
    duration: 2,
    startTime: new Date()
  });
  
  // Payment state
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [bookingReference, setBookingReference] = useState('');

  // Validation errors
  const [errors, setErrors] = useState({});

  /* Calculate total cost */
  const calculateCost = () => {
    const rateToUse = hourlyRate || 50;
    return formData.duration * rateToUse;
  };

  /* Calculate end time */
  const calculateEndTime = () => {
    const endTime = new Date(formData.startTime);
    endTime.setHours(endTime.getHours() + formData.duration);
    return endTime;
  };

  /* Handle input change */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  /* Validate vehicle details */
  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.vehicleNumber) {
      newErrors.vehicleNumber = 'Vehicle number is required';
    }
    
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^254[17]\d{8}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Enter valid phone (254XXXXXXXXX)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* Handle next/back steps */
  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1 && step < 4) {
      setStep(step - 1);
    }
  };

  /* --- PAYSTACK INTEGRATION --- */
  
  // 1. Handle successful payment
  const onPaystackSuccess = async (reference) => {
    console.log("PAYSTACK SUCCESS FIRED! Here is the data:", reference);
    setPaymentLoading(true);
    try {
      // Create the booking in the database using the real Paystack reference
      const payload = {
        user: user.id,
        parking_slot: slot.id,
        start_time: formData.startTime.toISOString(),
        end_time: calculateEndTime().toISOString(),
        duration_hours: formData.duration,
        vehicle_number: formData.vehicleNumber,
        hourly_rate: hourlyRate,
        total_amount: calculateCost(),
        booking_reference: reference.reference, // making sure both reference fields are sent
        paystack_reference: reference.reference, 
        status: 'active'
      };
      
      await api.post('/bookings/', payload);
      
      // Update the slot status to occupied
      await api.patch(`/parking-slots/${slot.id}/`, {
        status: 'occupied'
      });

      setBookingReference(reference.reference);
      setStep(4); // Move to Success Screen
    } catch (error) {
      console.error("Booking failed:", error);
      alert("Payment was successful, but the booking failed.");
    } finally {
      setPaymentLoading(false);
    }
  };

  // 2. Handle popup close
  const onPaystackClose = () => { 
    setPaymentLoading(false);
    console.log("User closed the payment popup");
  };

  // 3. Component Props for the Button
  const componentProps = {
    email: user?.email || 'driver@parkhub.com',
    amount: calculateCost() * 100, // IMPORTANT: Paystack uses cents!
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
    currency: 'KES',
    text: "Pay with Paystack",
    onSuccess: (reference) => onPaystackSuccess(reference),
    onClose: onPaystackClose,
  };

  /* Handle booking completion (Close Modal) */
  const handleComplete = () => {
    const booking = {
      id: bookingReference,
      slotNumber: slot.number,
      vehicleNumber: formData.vehicleNumber,
      duration: `${formData.duration}h`,
      expiryTime: calculateEndTime(),
      location: {
        lat: -1.2921,
        lng: 36.8219,
        name: 'Main Campus Lot'
      }
    };
    onComplete(booking);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        
        {/* Close Button */}
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        {/* Progress Steps */}
        <div className="modal-steps">
          <div className={`step ${step >= 1 ? 'step-active' : ''}`}>
            <div className="step-circle">1</div>
            <span className="step-label">Details</span>
          </div>
          <div className={`step-line ${step >= 2 ? 'step-line-active' : ''}`}></div>
          <div className={`step ${step >= 2 ? 'step-active' : ''}`}>
            <div className="step-circle">2</div>
            <span className="step-label">Duration</span>
          </div>
          <div className={`step-line ${step >= 3 ? 'step-line-active' : ''}`}></div>
          <div className={`step ${step >= 3 ? 'step-active' : ''}`}>
            <div className="step-circle">3</div>
            <span className="step-label">Payment</span>
          </div>
          <div className={`step-line ${step >= 4 ? 'step-line-active' : ''}`}></div>
          <div className={`step ${step >= 4 ? 'step-active' : ''}`}>
            <div className="step-circle">4</div>
            <span className="step-label">Success</span>
          </div>
        </div>

        {/* Modal Content */}
        <div className="modal-content">
          
          {/* Step 1: Vehicle Details */}
          {step === 1 && (
            <div className="step-content">
              <div className="step-header">
                <Car className="step-icon" />
                <h2 className="step-title">Vehicle Details</h2>
                <p className="step-subtitle">
                  Enter your vehicle information for slot {slot.number}
                </p>
              </div>

              <div className="form-group">
                <Input
                  label="Vehicle Number"
                  type="text"
                  name="vehicleNumber"
                  placeholder="KCA 456B"
                  value={formData.vehicleNumber}
                  onChange={handleChange}
                  error={errors.vehicleNumber}
                  icon={<Car size={18} />}
                  required
                />

                <Input
                  label="Phone Number"
                  type="tel"
                  name="phoneNumber"
                  placeholder="254712345678"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  error={errors.phoneNumber}
                  hint="For booking updates and receipts"
                  required
                />
              </div>

              <div className="modal-actions">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleNext} icon={<ArrowRight size={18} />}>
                  Next
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Duration Selection */}
          {step === 2 && (
            <div className="step-content">
              <div className="step-header">
                <Clock className="step-icon" />
                <h2 className="step-title">Select Duration</h2>
                <p className="step-subtitle">
                  How long will you need the parking?
                </p>
              </div>

              <div className="duration-grid">
                {DURATION_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFormData(prev => ({ ...prev, duration: option.value }))}
                    className={`duration-card ${
                      formData.duration === option.value ? 'duration-card-active' : ''
                    }`}
                  >
                    <span className="duration-hours">{option.label}</span>
                    <span className="duration-price">
                      {formatPrice(option.value * (hourlyRate || 50))}
                    </span>
                  </button>
                ))}
              </div>

              <div className="booking-summary">
                <div className="summary-row">
                  <span>Slot:</span>
                  <strong>{slot.number}</strong>
                </div>
                <div className="summary-row">
                  <span>Duration:</span>
                  <strong>{formData.duration} hour{formData.duration > 1 ? 's' : ''}</strong>
                </div>
                <div className="summary-row">
                  <span>Start Time:</span>
                  <strong>{format(formData.startTime, 'h:mm a')}</strong>
                </div>
                <div className="summary-row">
                  <span>End Time:</span>
                  <strong>{format(calculateEndTime(), 'h:mm a')}</strong>
                </div>
                <div className="summary-row summary-total">
                  <span>Total:</span>
                  <strong>{formatPrice(calculateCost())}</strong>
                </div>
              </div>

              <div className="modal-actions">
                <Button variant="outline" onClick={handleBack} icon={<ArrowLeft size={18} />}>
                  Back
                </Button>
                <Button variant="primary" onClick={handleNext} icon={<ArrowRight size={18} />}>
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <div className="step-content">
              <div className="step-header">
                <CreditCard className="step-icon" />
                <h2 className="step-title">Secure Checkout</h2>
                <p className="step-subtitle">
                  Confirm payment of {formatPrice(calculateCost())}
                </p>
              </div>

              <div className="payment-card">
                <div className="payment-details">
                  <div className="payment-row">
                    <span>Phone Number:</span>
                    <strong>{formData.phoneNumber}</strong>
                  </div>
                  <div className="payment-row">
                    <span>Amount:</span>
                    <strong>{formatPrice(calculateCost())}</strong>
                  </div>
                </div>
                <p className="payment-note">
                  Click below to open the secure payment gateway. You can use a test card.
                </p>
              </div>

              <div className="modal-actions">
                <Button variant="outline" onClick={handleBack} disabled={paymentLoading}>
                  Back
                </Button>
                
                {paymentLoading ? (
                  <Button variant="success" disabled loading={true}>Processing...</Button>
                ) : (
                  <PaystackButton 
                    {...componentProps} 
                    style={{
                      padding: '0.75rem 1.5rem',
                      borderRadius: 'var(--radius)',
                      border: 'none',
                      backgroundColor: 'hsl(142, 70%, 50%)',
                      color: 'white',
                      fontWeight: '600',
                      cursor: 'pointer',
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      fontSize: 'var(--text-sm)',
                      transition: 'all 0.2s'
                    }}
                  />
                )}
              </div>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <div className="step-content">
              <div className="success-animation">
                <CheckCircle className="success-icon" />
              </div>

              <div className="step-header">
                <h2 className="step-title">Booking Confirmed!</h2>
                <p className="step-subtitle">
                  Your parking slot has been reserved successfully
                </p>
              </div>

              <div className="success-details">
                <div className="success-badge">
                  <span className="badge-label">Slot Number</span>
                  <span className="badge-value">{slot.number}</span>
                </div>
                
                <div className="success-info">
                  <div className="info-row">
                    <span>Reference:</span>
                    <strong>{bookingReference}</strong>
                  </div>
                  <div className="info-row">
                    <span>Vehicle:</span>
                    <strong>{formData.vehicleNumber}</strong>
                  </div>
                  <div className="info-row">
                    <span>Duration:</span>
                    <strong>{formData.duration} hour{formData.duration > 1 ? 's' : ''}</strong>
                  </div>
                  <div className="info-row">
                    <span>Valid Until:</span>
                    <strong>{format(calculateEndTime(), 'MMM d, h:mm a')}</strong>
                  </div>
                </div>

                <p className="success-note">
                  A confirmation receipt has been sent to {formData.phoneNumber}
                </p>
              </div>

              <div className="modal-actions">
                <Button variant="primary" onClick={handleComplete} fullWidth>
                  Done
                </Button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default BookingModal;