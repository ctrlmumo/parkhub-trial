//route - /driver/dashboard

import { useState, useEffect } from 'react';
import { MapPin, Clock, Car, Navigation, CircleCheck, Wrench } from 'lucide-react';
import { format } from 'date-fns';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import DashboardSearchBar from '../../components/driver/Dashboardsearchbar';
import BookAgainCarousel from '../../components/driver/BookAgainCarousel';
import NearYouCarousel from '../../components/driver/NearYouCarousel';
import ParkingGrid from '../../components/driver/ParkingGrid';
import BookingModal from '../../components/driver/BookingModal';
import './Dashboard.css';

const DriverDashboard = () => {
  const { user } = useAuth();
  
  // State
  const [activeBookings, setActiveBookings] = useState([]);
  const [pastBookings, setPastBookings] = useState([]);
  const navigate = useNavigate();
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  /**
   * Load active bookings on mount
   * TODO: Replace with actual API call
   */
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get('/bookings/');
        const allBookings = response.data;
        // Filter for active bookings and map to view model
        const active = allBookings
          .filter(booking => booking.status === 'active')
          .map(booking => ({
            id: booking.id,
            slotNumber: booking.slot_details?.slot_number || 'N/A',
            vehicleNumber: booking.vehicle_number,
            duration: `${booking.duration_hours}h`,
            expiryTime: new Date(booking.end_time),
            location: {
              lat: parseFloat(booking.slot_details?.lot_details?.latitude || 0),
              lng: parseFloat(booking.slot_details?.lot_details?.longitude || 0),
              name: booking.slot_details?.lot_details?.name || 'Unknown Lot'
            }
          }));
        
        setActiveBookings(active);

        // Filter for past bookings (completed) for "Book Again"
        const past = allBookings
          .filter(booking => booking.status === 'completed')
          .map(booking => ({
            id: booking.id,
            lotId: booking.slot_details?.lot_details?.id,
            name: booking.slot_details?.lot_details?.name || 'Unknown Lot',
            location: booking.slot_details?.lot_details?.location || '',
            slotId: booking.slot_details?.id,
            slotNumber: booking.slot_details?.slot_number,
            lastVisited: new Date(booking.end_time)
          }))
          .sort((a, b) => b.lastVisited - a.lastVisited);

        // Deduplicate lots
        const uniquePast = [];
        const seenLots = new Set();
        past.forEach(item => {
          if (item.lotId && !seenLots.has(item.lotId)) {
            seenLots.add(item.lotId);
            uniquePast.push(item);
          }
        });
        setPastBookings(uniquePast);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      }
    };

    if (user) {
      fetchBookings();
    }
  }, [user]);
{

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setIsBookingModalOpen(true);
  };


  const handleBookingComplete = (booking) => {
    setActiveBookings(prev => [...prev, booking]);
    setIsBookingModalOpen(false);
    setSelectedSlot(null);
  };
}

 // Navigate to lot detail page
  const handleLotClick = (lotId) => {
    console.log('Opening lot detail for:', lotId);
    navigate(`/driver/lot/${lotId}`);
  };

  // Navigate to lot detail page with quick book
  const handleQuickBook = (slotId, lotId, isAvailable) => {
    if (isAvailable) {
      console.log('Quick booking slot:', slotId, 'at lot:', lotId);
      navigate(`/driver/lot/${lotId}?slot=${slotId}&quickbook=true`);
    } else {
      console.log('Slot occupied, viewing other slots at lot:', lotId);
      navigate(`/driver/lot/${lotId}`);
    }
  };

  // Handle "See All" clicks
  const handleViewAllLots = () => {
    console.log('Viewing all parking lots');
    navigate('/driver/find-parking');
  };

  const handleViewAllBookings = () => {
    console.log('Viewing all bookings');
    // TODO: Navigate to My Bookings page
    // navigate('/driver/bookings');
    alert('My Bookings page coming soon!');
  };

  /* Open Google Maps navigation */
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
                Where are you heading today?
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <DashboardSearchBar />

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

          {/* BOOK AGAIN CAROUSEL */}
        <BookAgainCarousel 
          bookings={pastBookings}
          onSlotClick={handleQuickBook}
          onViewAllClick={handleViewAllBookings}
        />

        {/* NEAR YOU CAROUSEL */}
        <NearYouCarousel 
          onLotClick={handleLotClick}
          onViewAllClick={handleViewAllLots}
        />
        </div>
      </div>
    </>
  );
};

export default DriverDashboard;