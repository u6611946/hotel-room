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
        alert(`Booking ${newStatus.toLowerCase()} successfully!`);
        fetchBookings();
      } else {
        const data = await response.json();
        alert(`Failed: ${data.error || "Unknown error"}`);
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
        const data = await response.json();
        alert(`Failed: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert("An error occurred");
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    if (filter === "all") return true;
    return booking.status?.toLowerCase() === filter.toLowerCase();
  });

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed": return "text-green-600 bg-green-50 px-2 py-1 rounded";
      case "cancelled": return "text-red-600 bg-red-50 px-2 py-1 rounded";
      default: return "text-yellow-600 bg-yellow-50 px-2 py-1 rounded";
    }
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
            onClick={() => router.push("/admin")}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {["all", "pending", "confirmed", "cancelled"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-semibold capitalize transition ${
                filter === f
                  ? "bg-red-700 text-white"
                  : "bg-white text-gray-600 border hover:bg-gray-50"
              }`}
            >
              {f}
            </button>
          ))}
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
            {filteredBookings.map((booking) => {
              // ✅ Use _id (ObjectId string) for API calls
              const bookingId = booking._id;
              return (
                <div
                  key={bookingId}
                  className="border-b py-4 flex justify-between items-center last:border-0"
                >
                  <div>
                    <p className="font-semibold text-gray-900">
                      {booking.firstName} {booking.lastName}
                    </p>
                    <p className="text-sm text-gray-500">{booking.email}</p>
                    <p className="text-sm text-gray-500">
                      {booking.roomName} · {formatDate(booking.checkIn)} → {formatDate(booking.checkOut)}
                    </p>
                    <p className="text-sm font-semibold text-red-700">${booking.totalPrice}</p>
                    <span className={`text-xs font-semibold mt-1 inline-block ${getStatusColor(booking.status)}`}>
                      {booking.status || "pending"}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <button
                      onClick={() => handleStatusUpdate(bookingId, "Confirmed")}
                      className="bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1 rounded transition"
                    >
                      ✓ Confirm
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(bookingId, "Cancelled")}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-3 py-1 rounded transition"
                    >
                      ✕ Cancel
                    </button>
                    <button
                      onClick={() => handleDeleteBooking(bookingId)}
                      className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded transition"
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}