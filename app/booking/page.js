'use client';

import Navbar from "@/components/layout/navbar";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function BookingPage() {
    const searchParams = useSearchParams();
    const [availableRooms, setAvailableRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        checkIn: searchParams.get('checkIn') || '',
        checkOut: searchParams.get('checkOut') || '',
        guests: parseInt(searchParams.get('guests')) || 1,
        roomId: '',
    });

    const [selectedRoom, setSelectedRoom] = useState(null);
    const [bookingConfirmed, setBookingConfirmed] = useState(false);
    const [errors, setErrors] = useState({});

    // Auto-fill guest info if user is logged in
    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                setFormData(prev => ({
                    ...prev,
                    firstName: user.firstName || '',
                    lastName: user.lastName || '',
                    email: user.email || '',
                    phone: user.phone || '',
                }));
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }
    }, []);

    // Fetch available rooms on component mount
    useEffect(() => {
        const fetchRooms = async () => {
            try {
                setLoading(true);
                const params = new URLSearchParams();
                
                if (formData.checkIn) params.append('checkIn', formData.checkIn);
                if (formData.checkOut) params.append('checkOut', formData.checkOut);
                if (formData.guests) params.append('guests', formData.guests);

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rooms?${params.toString()}`);
                if (response.ok) {
                    const data = await response.json();
                    setAvailableRooms(data);
                } else {
                    console.error('Failed to fetch rooms');
                }
            } catch (error) {
                console.error('Error fetching rooms:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRooms();
    }, [formData.checkIn, formData.checkOut, formData.guests]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        if (!formData.checkIn) newErrors.checkIn = 'Check-in date is required';
        if (!formData.checkOut) newErrors.checkOut = 'Check-out date is required';
        if (formData.checkOut <= formData.checkIn) newErrors.checkOut = 'Check-out must be after check-in';
        if (!formData.roomId) newErrors.roomId = 'Please select a room';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const calculateNights = () => {
        if (!formData.checkIn || !formData.checkOut) return 0;
        const checkIn = new Date(formData.checkIn);
        const checkOut = new Date(formData.checkOut);
        return Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    };

    const calculateTotal = () => {
        if (!selectedRoom) return 0;
        return selectedRoom.price * calculateNights();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            const bookingData = {
                ...formData,
                roomId: parseInt(formData.roomId),
                nights: calculateNights(),
                totalPrice: calculateTotal(),
                roomName: selectedRoom.name,
                bookingDate: new Date().toISOString(),
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookingData),
            });

            if (response.ok) {
                setBookingConfirmed(true);
                setTimeout(() => {
                    window.location.href = '/';
                }, 3000);
            } else {
                alert('Booking failed. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    };

    if (bookingConfirmed) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-2xl mx-auto px-4 py-20 text-center">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-8">
                        <div className="text-5xl mb-4">✅</div>
                        <h1 className="text-3xl font-bold text-green-700 mb-2">Booking Confirmed!</h1>
                        <p className="text-gray-600 mb-4">
                            Your booking has been successfully completed. A confirmation email has been sent to {formData.email}.
                        </p>
                        <p className="text-sm text-gray-500">Redirecting to home page...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <section className="max-w-6xl mx-auto px-4 py-12">
                <h1 className="text-4xl font-bold mb-2 text-center text-red-900">Book Your Room</h1>
                <div className="w-24 h-1 bg-gradient-to-r from-red-700 to-yellow-500 mx-auto mb-8"></div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Booking Form */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 space-y-6">
                            {/* Guest Information */}
                            <div>
                                <h2 className="text-2xl font-semibold mb-4 text-gray-900">Guest Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            First Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-2 text-gray-900 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 ${
                                                errors.firstName ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                        {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Last Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-2 text-gray-900 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 ${
                                                errors.lastName ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                        {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-2 text-gray-900 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 ${
                                                errors.email ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Phone Number *
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-2 text-gray-900 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 ${
                                                errors.phone ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Booking Details */}
                            <div>
                                <h2 className="text-2xl font-semibold mb-4 text-gray-900">Booking Details</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Check-in Date *
                                        </label>
                                        <input
                                            type="date"
                                            name="checkIn"
                                            value={formData.checkIn}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-2 text-gray-900 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 ${
                                                errors.checkIn ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                        {errors.checkIn && <p className="text-red-500 text-sm mt-1">{errors.checkIn}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Check-out Date *
                                        </label>
                                        <input
                                            type="date"
                                            name="checkOut"
                                            value={formData.checkOut}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-2 text-gray-900 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 ${
                                                errors.checkOut ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                        {errors.checkOut && <p className="text-red-500 text-sm mt-1">{errors.checkOut}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Number of Guests *
                                        </label>
                                        <select
                                            name="guests"
                                            value={formData.guests}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                                        >
                                            <option value="1">1 Guest</option>
                                            <option value="2">2 Guests</option>
                                            <option value="3">3 Guests</option>
                                            <option value="4">4+ Guests</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Room Selection */}
                            <div>
                                <h2 className="text-2xl font-semibold mb-4 text-gray-900">Select Room *</h2>
                                {errors.roomId && <p className="text-red-500 text-sm mb-3">{errors.roomId}</p>}
                                
                                {loading ? (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500">Loading available rooms...</p>
                                    </div>
                                ) : availableRooms.length === 0 ? (
                                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                                        <p className="text-gray-600">No rooms available for the selected dates and guest count.</p>
                                        <p className="text-sm text-gray-500 mt-2">Try adjusting your search criteria.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {availableRooms.map(room => (
                                            <label key={room.id} className="flex items-start p-4 border rounded-lg cursor-pointer hover:bg-red-50 transition"
                                                style={{
                                                    borderColor: formData.roomId === String(room.id) ? '#b91c1c' : '#d1d5db',
                                                    backgroundColor: formData.roomId === String(room.id) ? '#fef2f2' : 'white',
                                                }}>
                                                <input
                                                    type="radio"
                                                    name="roomId"
                                                    value={room.id}
                                                    checked={formData.roomId === String(room.id)}
                                                    onChange={(e) => {
                                                        handleInputChange(e);
                                                        setSelectedRoom(room);
                                                    }}
                                                    className="mt-1 mr-3"
                                                />
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-lg text-gray-900">{room.name}</h3>
                                                    <p className="text-gray-600 text-sm">Capacity: {room.capacity} guests</p>
                                                    <p className="text-sm text-gray-500">Amenities: {room.amenities.join(', ')}</p>
                                                    {room.description && <p className="text-sm text-gray-600 mt-1">{room.description}</p>}
                                                </div>
                                                <div className="text-right ml-4">
                                                    <p className="text-2xl font-bold text-red-700">${room.price}</p>
                                                    <p className="text-sm text-gray-500">per night</p>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full bg-red-700 hover:bg-red-800 text-yellow-400 font-bold py-3 px-4 rounded-lg transition"
                            >
                                Confirm Booking
                            </button>
                        </form>
                    </div>

                    {/* Booking Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
                            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Booking Summary</h2>

                            {selectedRoom ? (
                                <div className="space-y-4">
                                    {/* Room Image */}
                                    <div className="relative h-40 bg-gray-200 rounded-lg overflow-hidden mb-4">
                                        {selectedRoom.imageUrl ? (
                                            <img 
                                                src={selectedRoom.imageUrl} 
                                                alt={selectedRoom.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'flex';
                                                }}
                                            />
                                        ) : null}
                                        <div 
                                            className="absolute inset-0 bg-gradient-to-br from-red-900 to-black flex items-center justify-center text-yellow-400"
                                            style={{ display: selectedRoom.imageUrl ? 'none' : 'flex' }}
                                        >
                                            <svg className="w-16 h-16 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="border-b pb-3">
                                        <p className="text-gray-600">Room Type</p>
                                        <p className="font-semibold text-lg text-gray-900">{selectedRoom.name}</p>
                                    </div>
                                    <div className="border-b pb-3">
                                        <p className="text-gray-600">Check-in</p>
                                        <p className="font-semibold text-gray-900">{formData.checkIn || 'Not selected'}</p>
                                    </div>
                                    <div className="border-b pb-3">
                                        <p className="text-gray-600">Check-out</p>
                                        <p className="font-semibold text-gray-900">{formData.checkOut || 'Not selected'}</p>
                                    </div>
                                    <div className="border-b pb-3">
                                        <p className="text-gray-600">Number of Nights</p>
                                        <p className="font-semibold text-gray-900">{calculateNights()}</p>
                                    </div>
                                    <div className="border-b pb-3">
                                        <p className="text-gray-600">Price per Night</p>
                                        <p className="font-semibold text-gray-900">${selectedRoom.price}</p>
                                    </div>
                                    <div className="bg-red-50 p-3 rounded-lg">
                                        <p className="text-gray-600">Total Price</p>
                                        <p className="text-3xl font-bold text-red-700">${calculateTotal()}</p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-8">Select a room to see pricing</p>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}