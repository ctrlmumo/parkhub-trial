import api from '../../services/api'
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Star, 
  Clock, 
  Shield, 
  DollarSign,
  Camera,
  Wifi,
  Zap,
  Users,
  Phone
} from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Card from '../../components/common/Card';
import ParkingGrid from '../../components/driver/ParkingGrid';
import BookingModal from '../../components/driver/BookingModal';
import './LotDetail.css';

const LotDetail = () => {
  const { lotId } = useParams();
  const navigate = useNavigate();
  
  // State
  const [lot, setLot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  /* Load lot details */
  useEffect(() => {
    const fetchLotDetail = async () => {
      try {
        const response = await api.get(`/parking-lots/${lotId}/`);
        const data = response.data;
        
        // Parse the JSON string amenities safely
        let parsedAmenities = [];
        try {
          if (data.amenities) {
            parsedAmenities = JSON.parse(data.amenities).map(a => ({ label: a, icon: Shield }));
          }
        } catch(e) {}

        setLot({
          id: data.id,
          name: data.name,
          location: data.location,
          rating: 4.5,
          reviews: 120,
          hours: data.is_24_7 ? "24/7" : `${data.open_time} - ${data.close_time}`,
          phone: "+254 700 123 456",
          amenities: parsedAmenities.length ? parsedAmenities : [{ icon: Shield, label: "Security" }],
          pricing: {
            hourly: data.hourly_rate,
            daily: data.hourly_rate * 8, // calculated mock
            monthly: data.hourly_rate * 160
          },
          totalSlots: data.total_capacity,
          description: "Secure and convenient parking."
        });
      } catch (error) {
        console.error('Failed to fetch lot details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLotDetail();
  }, [lotId]);

  /* Handle slot selection from ParkingGrid */
  const handleSlotSelect = (slot) => {
    console.log('Slot selected:', slot);
    setSelectedSlot(slot);
    setShowBookingModal(true);
  };

  /* Handle booking completion */
  const handleBookingComplete = (bookingData) => {
    console.log('Booking completed:', bookingData);
    setShowBookingModal(false);
    setSelectedSlot(null);
    // TODO: Navigate to booking confirmation or dashboard
    // navigate('/driver/bookings');
  };

  /* Handle booking modal close */
  const handleCloseModal = () => {
    setShowBookingModal(false);
    setSelectedSlot(null);
  };

  if (loading) {
    return (
      <div className="lot-detail-page">
        <Navbar />
        <div className="lot-detail-loading">
          <div className="loading-spinner"></div>
          <p>Loading parking lot details...</p>
        </div>
      </div>
    );
  }

  if (!lot) {
    return (
      <div className="lot-detail-page">
        <Navbar />
        <div className="lot-detail-error">
          <h2>Parking Lot Not Found</h2>
          <p>The parking lot you're looking for doesn't exist.</p>
          <button onClick={() => navigate(-1)} className="btn-back">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="lot-detail-page">
      <Navbar />
      
      <div className="lot-detail-container">
        
        {/* LOT HEADER */}
        <div className="lot-header">
          <div className="lot-header-left">
            <button 
              onClick={() => navigate(-1)} 
              className="btn-back"
              aria-label="Go back"
            >
              <ArrowLeft size={20} />
              <span>Back</span>
            </button>
            
            <div className="lot-header-info">
              <h1 className="lot-name">{lot.name}</h1>
              <div className="lot-location-row">
                <MapPin size={18} className="location-icon" />
                <span className="lot-location">{lot.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* LOT INFO CARD */}
        <Card className="lot-info-card">
          <Card.Header>
            <Card.Title>Parking Lot Information</Card.Title>
          </Card.Header>
          
          <Card.Content>
            <div className="lot-info-grid">
              
              {/* Operating Hours */}
              <div className="info-item">
                <div className="info-icon-container">
                  <Clock size={20} />
                </div>
                <div className="info-content">
                  <span className="info-label">Operating Hours</span>
                  <span className="info-value">{lot.hours}</span>
                </div>
              </div>

              {/* Contact */}
              <div className="info-item">
                <div className="info-icon-container">
                  <Phone size={20} />
                </div>
                <div className="info-content">
                  <span className="info-label">Contact</span>
                  <span className="info-value">{lot.phone}</span>
                </div>
              </div>

              {/* Pricing */}
              <div className="info-item">
                <div className="info-icon-container">
                  <DollarSign size={20} />
                </div>
                <div className="info-content">
                  <span className="info-label">Pricing</span>
                  <div className="pricing-options">
                    <span className="pricing-option">
                      KES {lot.pricing.hourly}/hr
                    </span>
                    <span className="pricing-divider">•</span>
                    <span className="pricing-option">
                      KES {lot.pricing.daily}/day
                    </span>
                  </div>
                </div>
              </div>

              {/* Total Capacity */}
              <div className="info-item">
                <div className="info-icon-container">
                  <Shield size={20} />
                </div>
                <div className="info-content">
                  <span className="info-label">Total Capacity</span>
                  <span className="info-value">{lot.totalSlots} slots</span>
                </div>
              </div>

            </div>
          </Card.Content>
        </Card>

        {/* PARKING GRID */}
        <ParkingGrid 
          onSlotSelect={handleSlotSelect}
          lotData={lot}
        />

      </div>

      {/* BOOKING MODAL */}
      <BookingModal
        slot={selectedSlot}
        isOpen={showBookingModal}
        onClose={handleCloseModal}
        onComplete={handleBookingComplete}
      />
    </div>
  );
};

export default LotDetail;