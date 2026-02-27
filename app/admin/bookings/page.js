'use client';

export const dynamic = "force-dynamic";

import Navbar from "@/components/layout/navbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function BookingsManagement() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/booking`);
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    if (!confirm(`Are you sure you want to ${newStatus.toLowerCase()} this booking?`)) return;

    try {
      const response = await fetch(`${API_URL}/booking/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        alert("Booking status updated successfully!");
        fetchBookings();
      } else {
        alert("Failed to update booking status");
      }
    } catch (error) {
      console.error("Error updating booking:", error);
      alert("An error occurred");
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;

    try {
      const response = await fetch(`${API_URL}/booking/${bookingId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Booking deleted successfully!");
        fetchBookings();
      } else {
        alert("Failed to delete booking");
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert("An error occurred");
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    if (filter === "all") return true;
    return booking.status?.toLowerCase() === filter;
  });

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8 border-b-2 border-yellow-600 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-red-900">
              Bookings Management
            </h1>
            <p className="text-gray-600 mt-2">
              View and manage all hotel bookings
            </p>
          </div>

          <button
            onClick={() => router.push("/admin")}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition"
          >
            ← Back to Dashboard
          </button>
        </div>

        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500">Loading bookings...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500">No bookings found.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            {filteredBookings.map((booking) => (
              <div
                key={booking._id || booking.id}
                className="border-b py-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">
                    {booking.firstName} {booking.lastName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDate(booking.checkIn)} →{" "}
                    {formatDate(booking.checkOut)}
                  </p>
                  <p className="text-sm text-gray-500">
                    ${booking.totalPrice}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      handleStatusUpdate(booking._id || booking.id, "Confirmed")
                    }
                    className="text-green-600"
                  >
                    Confirm
                  </button>

                  <button
                    onClick={() =>
                      handleStatusUpdate(booking._id || booking.id, "Cancelled")
                    }
                    className="text-red-600"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={() =>
                      handleDeleteBooking(booking._id || booking.id)
                    }
                    className="text-gray-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}