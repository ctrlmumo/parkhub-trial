//route - /driver/dashboard

import { useState, useEffect } from 'react';
import { MapPin, Clock, Car, Navigation, CircleCheck, Wrench } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/common/Navbar';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import ParkingGrid from '../../components/driver/ParkingGrid';
import BookingModal from '../../components/driver/BookingModal';
import './Dashboard.css';

const DriverDashboard = () => {
  const { user } = useAuth();
  
  // State
  const [activeBookings, setActiveBookings] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  /**
   * Load active bookings on mount
   * TODO: Replace with actual API call
   */
  useEffect(() => {
    // Mock data for demonstration
    const mockBookings = [
      {
        id: 1,
        slotNumber: 'A12',
        vehicleNumber: 'KCA 456B',
        duration: '2h 30m',
        expiryTime: new Date(Date.now() + 2.5 * 60 * 60 * 1000),
        location: {
          lat: -1.2921,
          lng: 36.8219,
          name: 'Main Campus Lot'
        }
      },
      // Add more mock bookings as needed
    ];
    
    setActiveBookings(mockBookings);
  }, []);

  /**
   * Handle slot selection
   */
  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setIsBookingModalOpen(true);
  };

  /**
   * Handle booking completion
   */
  const handleBookingComplete = (booking) => {
    setActiveBookings(prev => [...prev, booking]);
    setIsBookingModalOpen(false);
    setSelectedSlot(null);
  };

  /**
   * Open Google Maps navigation
   */
  const handleNavigate = (location) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`;
    window.open(url, '_blank');
  };

  return (
    <>
      <Navbar />
      
      <div className="dashboard-page">
        <div className="dashboard-container">
          
          {/* Welcome Section */}
          <div className="welcome-section">
            <div className="welcome-content">
              <h1 className="welcome-title">
                Welcome back, {user?.username || 'Driver'}!
              </h1>
              <p className="welcome-subtitle">
                Find and book your parking spot in seconds
              </p>
            </div>
            
            <div className="location-badge">
              <MapPin className="location-icon" />
              <span>ParkHub Central - Nairobi</span>
            </div>
          </div>

          {/* Active Bookings Card */}
          {activeBookings.length > 0 && (
            <Card className="active-bookings-card">
              <Card.Header>
                <Card.Title className="active-bookings-title">
                  <Car className="active-bookings-icon" />
                  Your Active Bookings
                </Card.Title>
              </Card.Header>
              
              <Card.Content>
                <div className="bookings-grid">
                  {activeBookings.map((booking) => (
                    <div key={booking.id} className="booking-item">
                      {/* Slot Badge */}
                      <div className="booking-slot-badge">
                        {booking.slotNumber}
                      </div>
                      
                      {/* Booking Details */}
                      <div className="booking-details">
                        <p className="booking-vehicle">{booking.vehicleNumber}</p>
                        <div className="booking-time">
                          <Clock className="booking-time-icon" />
                          <span>
                            {booking.duration} • Expires {format(booking.expiryTime, 'h:mm a')}
                          </span>
                        </div>
                      </div>
                      
                      {/* Navigate Button */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleNavigate(booking.location)}
                        icon={<Navigation size={14} />}
                      >
                        Navigate
                      </Button>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>
          )}

          {/* Parking Grid Section */}
          <div className="parking-section">
            <ParkingGrid onSlotSelect={handleSlotSelect} />
          </div>

        </div>
      </div>

      {/* Booking Modal */}
      {isBookingModalOpen && (
        <BookingModal
          slot={selectedSlot}
          isOpen={isBookingModalOpen}
          onClose={() => {
            setIsBookingModalOpen(false);
            setSelectedSlot(null);
          }}
          onComplete={handleBookingComplete}
        />
      )}
    </>
  );
};

export default DriverDashboard;