'use client';

import Navbar from "@/components/layout/navbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function BookingsManagement() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, confirmed, cancelled

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/booking`);
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

  const handleStatusUpdate = async (bookingId, newStatus) => {
    if (!confirm(`Are you sure you want to ${newStatus.toLowerCase()} this booking?`)) {
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/booking/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        alert('Booking status updated successfully!');
        fetchBookings();
      } else {
        alert('Failed to update booking status');
      }
    } catch (error) {
      console.error('Error updating booking:', error);
      alert('An error occurred');
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to delete this booking?')) {
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/${bookingId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Booking deleted successfully!');
        fetchBookings();
      } else {
        alert('Failed to delete booking');
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      alert('An error occurred');
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status.toLowerCase() === filter;
  });

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8 border-b-2 border-yellow-600 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-red-900">Bookings Management</h1>
            <p className="text-gray-600 mt-2">View and manage all hotel bookings</p>
          </div>
          <button
            onClick={() => router.push('/admin')}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'all'
                  ? 'bg-red-700 text-yellow-400'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Bookings ({bookings.length})
            </button>
            <button
              onClick={() => setFilter('confirmed')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'confirmed'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Confirmed ({bookings.filter(b => b.status.toLowerCase() === 'confirmed').length})
            </button>
            <button
              onClick={() => setFilter('cancelled')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'cancelled'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Cancelled ({bookings.filter(b => b.status.toLowerCase() === 'cancelled').length})
            </button>
          </div>
        </div>

        {/* Bookings Table */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500">Loading bookings...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500">No bookings found.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Booking ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Guest Info
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Room
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dates
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id || booking._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{booking.id}</div>
                        <div className="text-xs text-gray-500">
                          {formatDate(booking.bookingDate || booking.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {booking.firstName} {booking.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{booking.email}</div>
                        <div className="text-xs text-gray-500">{booking.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{booking.roomName}</div>
                        <div className="text-xs text-gray-500">{booking.guests} guest(s)</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(booking.checkIn)}
                        </div>
                        <div className="text-sm text-gray-500">
                          to {formatDate(booking.checkOut)}
                        </div>
                        <div className="text-xs text-gray-500">{booking.nights} night(s)</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          ${booking.totalPrice}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          {booking.status.toLowerCase() !== 'cancelled' && (
                            <button
                              onClick={() => handleStatusUpdate(booking.id, 'Cancelled')}
                              className="text-red-600 hover:text-red-900"
                            >
                              Cancel
                            </button>
                          )}
                          {booking.status.toLowerCase() === 'cancelled' && (
                            <button
                              onClick={() => handleStatusUpdate(booking.id, 'Confirmed')}
                              className="text-green-600 hover:text-green-900"
                            >
                              Restore
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteBooking(booking.id)}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Summary */}
        {!loading && filteredBookings.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-red-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{filteredBookings.length}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${filteredBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0).toFixed(2)}
                </p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Total Nights</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredBookings.reduce((sum, b) => sum + (b.nights || 0), 0)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
