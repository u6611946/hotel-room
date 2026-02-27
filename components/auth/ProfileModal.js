'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfileModal({ isOpen, onClose }) {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
    });

    useEffect(() => {
        if (isOpen) {
            const userData = localStorage.getItem('user');
            if (userData) {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
                setFormData({
                    firstName: parsedUser.firstName || '',
                    lastName: parsedUser.lastName || '',
                    email: parsedUser.email || '',
                    phone: parsedUser.phone || '',
                });
                fetchUserBookings(parsedUser.email);
            }
        }
    }, [isOpen]);

    const fetchUserBookings = async (email) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/booking?email=${email}`);
            if (response.ok) {
                const data = await response.json();
                setBookings(data);
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    oldEmail: user.email,
                }),
            });

            if (response.ok) {
                const updatedUser = await response.json();
                localStorage.setItem('user', JSON.stringify(updatedUser.user));
                setUser(updatedUser.user);
                setIsEditing(false);
                alert('Profile updated successfully!');
            } else {
                alert('Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('An error occurred');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('isLoggedIn');
        onClose();
        router.refresh();
        window.location.reload();
    };

    const handleCancelBooking = async (bookingId) => {
        if (!confirm('Are you sure you want to cancel this booking?')) {
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/booking/${bookingId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: 'cancelled' }),
            });

            if (response.ok) {
                alert('Booking cancelled successfully');
                fetchUserBookings(user.email);
            } else {
                alert('Failed to cancel booking');
            }
        } catch (error) {
            console.error('Error cancelling booking:', error);
            alert('An error occurred');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-red-900">My Profile</h2>
                        <p className="text-gray-600 text-sm mt-1">Manage your account and bookings</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleLogout}
                            className="bg-red-700 hover:bg-red-800 text-yellow-400 font-semibold py-2 px-4 rounded-lg transition text-sm"
                        >
                            Logout
                        </button>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Profile Information */}
                        <div className="lg:col-span-1">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-bold text-gray-900">Profile Information</h3>
                                    {!isEditing && (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="text-red-700 hover:text-red-800 text-sm font-semibold"
                                        >
                                            Edit
                                        </button>
                                    )}
                                </div>

                                {isEditing ? (
                                    <form onSubmit={handleUpdateProfile} className="space-y-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                First Name
                                            </label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                Last Name
                                            </label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                Phone
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                                                required
                                            />
                                        </div>
                                        <div className="flex gap-2 pt-2">
                                            <button
                                                type="submit"
                                                className="flex-1 bg-red-700 hover:bg-red-800 text-yellow-400 font-semibold py-2 rounded-lg transition text-sm"
                                            >
                                                Save
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsEditing(false);
                                                    setFormData({
                                                        firstName: user.firstName,
                                                        lastName: user.lastName,
                                                        email: user.email,
                                                        phone: user.phone,
                                                    });
                                                }}
                                                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 rounded-lg transition text-sm"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-xs text-gray-600">Name</p>
                                            <p className="font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600">Email</p>
                                            <p className="font-semibold text-sm text-gray-900">{user?.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600">Phone</p>
                                            <p className="font-semibold text-gray-900">{user?.phone}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Bookings */}
                        <div className="lg:col-span-2">
                            <h3 className="text-lg font-bold mb-4 text-gray-900">My Bookings</h3>
                            
                            {loading ? (
                                <div className="text-center py-8 text-gray-500">
                                    <p>Loading bookings...</p>
                                </div>
                            ) : bookings.length === 0 ? (
                                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                                    <p>No bookings yet</p>
                                    <button
                                        onClick={() => {
                                            onClose();
                                            router.push('/booking');
                                        }}
                                        className="text-red-700 hover:text-red-800 font-semibold mt-2 inline-block"
                                    >
                                        Book a room
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3 max-h-96 overflow-y-auto">
                                    {bookings.map((booking) => (
                                        <div key={booking.id} className="border rounded-lg p-4 hover:shadow-md transition bg-white">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <h4 className="text-base font-semibold text-gray-900">{booking.roomName}</h4>
                                                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                                                        <p>Check-in: {booking.checkIn}</p>
                                                        <p>Check-out: {booking.checkOut}</p>
                                                        <p>Guests: {booking.guests} | Nights: {booking.nights}</p>
                                                        <p className="font-semibold text-red-700">Total: ${booking.totalPrice}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right ml-4">
                                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                                        booking.status === 'confirmed' 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {booking.status}
                                                    </span>
                                                    {booking.status === 'confirmed' && (
                                                        <button
                                                            onClick={() => handleCancelBooking(booking.id)}
                                                            className="mt-2 text-red-600 hover:text-red-800 text-xs font-semibold block"
                                                        >
                                                            Cancel
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
