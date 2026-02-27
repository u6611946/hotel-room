'use client';

import Navbar from "@/components/layout/navbar";
import React, { useState, useEffect } from "react";
import roomFeatures from "@/components/features/featuresRoom";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Homepage() {
    const router = useRouter();
    const [searchData, setSearchData] = useState({
        checkIn: '',
        checkOut: '',
        guests: '1',
    });
    const [featuredRooms, setFeaturedRooms] = useState([]);
    const [allRooms, setAllRooms] = useState([]);
    const [showAllRooms, setShowAllRooms] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [showRoomModal, setShowRoomModal] = useState(false);

    // Fetch featured rooms on mount
    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rooms`);
                if (response.ok) {
                    const data = await response.json();
                    setAllRooms(data);
                    // Get first 3 rooms for featured section
                    setFeaturedRooms(data.slice(0, 3));
                }
            } catch (error) {
                console.error('Error fetching rooms:', error);
            }
        };
        fetchRooms();
    }, []);

    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        
        // Validate dates
        if (!searchData.checkIn || !searchData.checkOut) {
            alert('Please select check-in and check-out dates');
            return;
        }

        if (new Date(searchData.checkOut) <= new Date(searchData.checkIn)) {
            alert('Check-out date must be after check-in date');
            return;
        }

        // Navigate to booking page with search parameters
        const params = new URLSearchParams({
            checkIn: searchData.checkIn,
            checkOut: searchData.checkOut,
            guests: searchData.guests,
        });
        
        router.push(`/booking?${params.toString()}`);
    };

    const handleViewRoom = (room) => {
        setSelectedRoom(room);
        setShowRoomModal(true);
    };

    const closeModal = () => {
        setShowRoomModal(false);
        setSelectedRoom(null);
    };

    const displayedRooms = showAllRooms ? allRooms : featuredRooms;
    const roomsTitle = showAllRooms ? 'All Available Rooms' : 'Popular Rooms';

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-red-800 to-black text-white py-16 px-4">
                <div className="max-w-4xl mx-auto text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-yellow-500">
                        Welcome to Luxury Hotel
                    </h1>
                    <p className="text-lg text-yellow-100">
                        Experience comfort and elegance at our world-class hotel
                    </p>
                </div>
            </section>

            {/* Quick Booking Form */}
            <section className="max-w-4xl mx-auto px-4 -mt-8 relative z-10 mb-12">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-bold mb-6 text-gray-900">Book Your Stay</h2>
                    <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Check-in
                            </label>
                            <input
                                type="date"
                                name="checkIn"
                                value={searchData.checkIn}
                                onChange={handleSearchChange}
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-600"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Check-out
                            </label>
                            <input
                                type="date"
                                name="checkOut"
                                value={searchData.checkOut}
                                onChange={handleSearchChange}
                                min={searchData.checkIn || new Date().toISOString().split('T')[0]}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-600"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Guests
                            </label>
                            <select 
                                name="guests"
                                value={searchData.guests}
                                onChange={handleSearchChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-600"
                            >
                                <option value="1">1 Guest</option>
                                <option value="2">2 Guests</option>
                                <option value="3">3 Guests</option>
                                <option value="4">4+ Guests</option>
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button
                                type="submit"
                                className="w-full bg-red-700 hover:bg-red-800 text-yellow-400 font-semibold py-2 px-4 rounded-lg transition"
                            >
                                Search Rooms
                            </button>
                        </div>
                    </form>
                </div>
            </section>

            {/* Features Section */}
            {roomFeatures()}
            
            {/* Featured Rooms */}
            <section className="bg-white py-12 mt-12">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-2 text-gray-900">{roomsTitle}</h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-red-700 to-yellow-500 mx-auto mb-6"></div>
                    <div className="text-center mb-10">
                        <button
                            onClick={() => setShowAllRooms(!showAllRooms)}
                            className="bg-black hover:bg-red-900 text-yellow-400 font-semibold py-2 px-6 rounded-lg transition border-2 border-red-700"
                        >
                            {showAllRooms ? 'Show Featured Rooms' : 'View All Rooms'}
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {displayedRooms.length > 0 ? displayedRooms.map((room) => (
                            <div key={room.id} className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
                                <div className="relative h-48 bg-gray-300">
                                    {room.imageUrl ? (
                                        <img 
                                            src={room.imageUrl} 
                                            alt={room.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                    ) : null}
                                    <div 
                                        className="absolute inset-0 bg-gradient-to-br from-red-900 to-black flex items-center justify-center text-yellow-400"
                                        style={{ display: room.imageUrl ? 'none' : 'flex' }}
                                    >
                                        <svg className="w-16 h-16 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-gray-900">{room.name}</h3>
                                    <p className="text-sm text-gray-600 mb-3">{room.description}</p>
                                    <p className="text-red-700 font-bold text-lg mb-3">${room.price}/night</p>
                                    <button 
                                        onClick={() => handleViewRoom(room)}
                                        className="w-full bg-red-700 hover:bg-red-800 text-yellow-400 py-2 rounded-lg font-semibold transition"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        )) : (
                            <div className="col-span-3 text-center py-8 text-gray-500">
                                Loading rooms...
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-r from-black to-red-900 text-white py-12 mt-12">
                <div className="max-w-2xl mx-auto px-4 text-center space-y-4">
                    <h2 className="text-3xl font-bold text-yellow-500">Ready to Book?</h2>
                    <p className="text-lg text-yellow-100">
                        Start your unforgettable journey with us today.
                    </p>
                    <a
                        href="/booking"
                        className="inline-block bg-red-700 text-yellow-400 font-semibold py-3 px-8 rounded-lg hover:bg-red-800 transition"
                    >
                        Book Now
                    </a>
                </div>
            </section>

            {/* Room Details Modal */}
            {showRoomModal && selectedRoom && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4" onClick={closeModal}>
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="relative">
                            <button
                                onClick={closeModal}
                                className="absolute top-4 right-4 bg-red-700 text-yellow-400 rounded-full w-10 h-10 flex items-center justify-center hover:bg-red-800 transition z-10"
                            >
                                ✕
                            </button>
                            <div className="relative h-64 bg-gray-300">
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
                                    <svg className="w-24 h-24 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <h2 className="text-3xl font-bold mb-4 text-gray-900">{selectedRoom.name}</h2>
                            <div className="border-t-2 border-red-700 pt-4 mb-4">
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Price per Night</p>
                                        <p className="text-2xl font-bold text-red-700">${selectedRoom.price}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Max Capacity</p>
                                        <p className="text-2xl font-bold text-gray-900">{selectedRoom.capacity} Guests</p>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <p className="text-sm font-semibold text-gray-700 mb-2">Description</p>
                                    <p className="text-gray-600">{selectedRoom.description}</p>
                                </div>
                                {selectedRoom.amenities && selectedRoom.amenities.length > 0 && (
                                    <div className="mb-6">
                                        <p className="text-sm font-semibold text-gray-700 mb-2">Amenities</p>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedRoom.amenities.map((amenity, index) => (
                                                <span
                                                    key={index}
                                                    className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm border border-red-300"
                                                >
                                                    {amenity}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => {
                                    closeModal();
                                    router.push('/booking');
                                }}
                                className="w-full bg-red-700 hover:bg-red-800 text-yellow-400 font-bold py-3 px-6 rounded-lg transition"
                            >
                                Book This Room
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer */}
            <footer className="bg-black text-gray-400 text-center py-6 border-t-2 border-red-700">
                <p>&copy; 2026 Luxury Hotel. All rights reserved.</p>
            </footer>
        </div>
    );
}