'use client';

import Navbar from "@/components/layout/navbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalRooms: 0,
    totalBookings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [roomsRes, bookingsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/rooms`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/booking`)
        ]);

        const rooms = await roomsRes.json();
        const bookings = await bookingsRes.json();

        setStats({
          totalRooms: rooms.length,
          totalBookings: bookings.length,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="mb-8 border-b-2 border-yellow-600 pb-4">
          <h1 className="text-3xl font-bold text-red-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your hotel bookings and rooms</p>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Rooms</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {loading ? '...' : stats.totalRooms}
                </p>
              </div>
              <div className="bg-yellow-600 rounded-full p-4">
                <svg className="w-8 h-8 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {loading ? '...' : stats.totalBookings}
                </p>
              </div>
              <div className="bg-green-100 rounded-full p-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Management Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Rooms Management</h2>
                <p className="text-gray-600 text-sm mt-1">Add, edit, or remove room types</p>
              </div>
              <div className="bg-yellow-600 rounded-lg p-3">
                <svg className="w-6 h-6 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
            </div>
            <button
              onClick={() => router.push('/admin/rooms')}
              className="w-full bg-red-700 hover:bg-red-800 text-yellow-400 font-semibold py-2 px-4 rounded-lg transition"
            >
              Manage Rooms
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Bookings Management</h2>
                <p className="text-gray-600 text-sm mt-1">View and manage all bookings</p>
              </div>
              <div className="bg-green-100 rounded-lg p-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <button
              onClick={() => router.push('/admin/bookings')}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              Manage Bookings
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => router.push('/admin/rooms?action=add')}
              className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Room
            </button>
            <button
              onClick={() => router.push('/')}
              className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              View Website
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh Stats
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
