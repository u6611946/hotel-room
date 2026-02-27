'use client';

export const dynamic = "force-dynamic";

import Navbar from "@/components/layout/navbar";
import { useEffect, useState } from "react";

export default function RoomsManagement() {

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRoom, setEditingRoom] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    capacity: "",
    amenities: "",
    description: "",
    imageUrl: "",
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

  useEffect(() => {
    fetchRooms();

    // Handle ?action=add without useSearchParams
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("action") === "add") {
        setShowModal(true);
      }
    }
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/rooms`);
      if (response.ok) {
        const data = await response.json();
        setRooms(data);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const method = editingRoom ? "PUT" : "POST";
      const url = editingRoom
        ? `${API_URL}/rooms/${editingRoom._id}`
        : `${API_URL}/rooms`;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          capacity: Number(formData.capacity),
          amenities: formData.amenities.split(",").map(a => a.trim())
        }),
      });

      if (response.ok) {
        fetchRooms();
        resetForm();
      }
    } catch (error) {
      console.error("Error saving room:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this room?")) return;

    try {
      const response = await fetch(`${API_URL}/rooms/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchRooms();
      }
    } catch (error) {
      console.error("Error deleting room:", error);
    }
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setFormData({
      name: room.name,
      price: room.price,
      capacity: room.capacity,
      amenities: room.amenities?.join(", "),
      description: room.description,
      imageUrl: room.imageUrl,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingRoom(null);
    setFormData({
      name: "",
      price: "",
      capacity: "",
      amenities: "",
      description: "",
      imageUrl: "",
    });
    setShowModal(false);
  };

  return (
    <>
      <Navbar />

      <div className="container mx-auto p-6">
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold">Rooms Management</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add Room
          </button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid gap-4">
            {rooms.map((room) => (
              <div
                key={room._id}
                className="border p-4 rounded shadow flex justify-between items-center"
              >
                <div>
                  <h2 className="font-semibold">{room.name}</h2>
                  <p>Price: ${room.price}</p>
                  <p>Capacity: {room.capacity}</p>
                </div>

                <div className="space-x-2">
                  <button
                    onClick={() => handleEdit(room)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(room._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">
                {editingRoom ? "Edit Room" : "Add Room"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  placeholder="Room Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full border p-2 rounded"
                  required
                />

                <input
                  type="number"
                  placeholder="Price"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className="w-full border p-2 rounded"
                  required
                />

                <input
                  type="number"
                  placeholder="Capacity"
                  value={formData.capacity}
                  onChange={(e) =>
                    setFormData({ ...formData, capacity: e.target.value })
                  }
                  className="w-full border p-2 rounded"
                  required
                />

                <input
                  type="text"
                  placeholder="Amenities (comma separated)"
                  value={formData.amenities}
                  onChange={(e) =>
                    setFormData({ ...formData, amenities: e.target.value })
                  }
                  className="w-full border p-2 rounded"
                />

                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full border p-2 rounded"
                />

                <input
                  type="text"
                  placeholder="Image URL"
                  value={formData.imageUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, imageUrl: e.target.value })
                  }
                  className="w-full border p-2 rounded"
                />

                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border rounded"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    {editingRoom ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}