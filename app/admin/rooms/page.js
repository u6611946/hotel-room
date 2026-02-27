'use client';

import Navbar from "@/components/layout/navbar";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function RoomsManagement() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRoom, setEditingRoom] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    capacity: '',
    amenities: '',
    description: '',
    imageUrl: '',
  });

  useEffect(() => {
    fetchRooms();
    
    // Check if we should show add modal
    if (searchParams.get('action') === 'add') {
      setShowModal(true);
    }
  }, [searchParams]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rooms`);
      if (response.ok) {
        const data = await response.json();
        setRooms(data);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddRoom = () => {
    setEditingRoom(null);
    setFormData({
      name: '',
      price: '',
      capacity: '',
      amenities: '',
      description: '',
      imageUrl: '',
    });
    setShowModal(true);
  };

  const handleEditRoom = (room) => {
    setEditingRoom(room);
    setFormData({
      name: room.name,
      price: room.price.toString(),
      capacity: room.capacity.toString(),
      amenities: room.amenities.join(', '),
      description: room.description || '',
      imageUrl: room.imageUrl || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const roomData = {
      name: formData.name,
      price: parseFloat(formData.price),
      capacity: parseInt(formData.capacity),
      amenities: formData.amenities.split(',').map(a => a.trim()).filter(a => a),
      description: formData.description,
      imageUrl: formData.imageUrl,
    };

    try {
      if (editingRoom) {
        // Update existing room
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rooms/${editingRoom.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(roomData),
        });

        if (response.ok) {
          alert('Room updated successfully!');
          setShowModal(false);
          fetchRooms();
        } else {
          alert('Failed to update room');
        }
      } else {
        // Add new room
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rooms`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(roomData),
        });

        if (response.ok) {
          alert('Room added successfully!');
          setShowModal(false);
          fetchRooms();
        } else {
          alert('Failed to add room');
        }
      }
    } catch (error) {
      console.error('Error saving room:', error);
      alert('An error occurred');
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (!confirm('Are you sure you want to delete this room?')) {
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rooms/${roomId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Room deleted successfully!');
        fetchRooms();
      } else {
        alert('Failed to delete room');
      }
    } catch (error) {
      console.error('Error deleting room:', error);
      alert('An error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8 border-b-2 border-yellow-600 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-red-900">Rooms Management</h1>
            <p className="text-gray-600 mt-2">Manage your hotel room types</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/admin')}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition"
            >
              ← Back to Dashboard
            </button>
            <button
              onClick={handleAddRoom}
              className="bg-red-700 hover:bg-red-800 text-yellow-400 font-semibold py-2 px-4 rounded-lg transition flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Room
            </button>
          </div>
        </div>

        {/* Rooms Table */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500">Loading rooms...</p>
          </div>
        ) : rooms.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500">No rooms found. Add your first room!</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Room Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Capacity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amenities
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rooms.map((room) => (
                  <tr key={room.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="relative h-16 w-24 bg-gray-200 rounded overflow-hidden">
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
                          className="absolute inset-0 bg-gradient-to-br from-red-900 to-black flex items-center justify-center"
                          style={{ display: room.imageUrl ? 'none' : 'flex' }}
                        >
                          <svg className="w-8 h-8 text-yellow-400 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{room.name}</div>
                      {room.description && (
                        <div className="text-sm text-gray-500">{room.description.substring(0, 50)}...</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${room.price}/night</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{room.capacity} guests</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {room.amenities.slice(0, 3).map((amenity, idx) => (
                          <span key={idx} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-600 text-yellow-100">
                            {amenity}
                          </span>
                        ))}
                        {room.amenities.length > 3 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            +{room.amenities.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditRoom(room)}
                        className="text-red-700 hover:text-red-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteRoom(room.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingRoom ? 'Edit Room' : 'Add New Room'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Room Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price per Night ($) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Capacity (guests) *
                    </label>
                    <input
                      type="number"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amenities (comma-separated) *
                  </label>
                  <input
                    type="text"
                    name="amenities"
                    value={formData.amenities}
                    onChange={handleInputChange}
                    placeholder="e.g., WiFi, TV, AC, Mini Bar"
                    className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate amenities with commas</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                    placeholder="Brief description of the room..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="text"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg or https://images.unsplash.com/..."
                    className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter a full URL to an image (e.g., from Unsplash, Imgur, or your server)
                  </p>
                  
                  {/* Image Preview */}
                  {formData.imageUrl && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                      <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                        <img 
                          src={formData.imageUrl} 
                          alt="Room preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div 
                          className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-400 text-sm"
                          style={{ display: 'none' }}
                        >
                          Invalid image URL
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-red-700 hover:bg-red-800 text-yellow-400 font-semibold py-2 px-4 rounded-lg transition"
                  >
                    {editingRoom ? 'Update Room' : 'Add Room'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
