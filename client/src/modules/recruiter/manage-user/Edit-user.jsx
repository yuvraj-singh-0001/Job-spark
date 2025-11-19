import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../components/apiconfig/apiconfig";

export default function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    api
      .get(`/auth/users/${id}`)
      .then((res) => {
        const user = res.data.user || {};
        setFormData({
          id: user.id || "",
          name: user.username || "",
          email: user.email || "",
        });
      })
      .catch((err) => {
        console.error("Failed to fetch user", err);
        setError(err?.response?.data?.message || "Failed to load user");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = { username: formData.name, email: formData.email };
      await api.put(`/auth/users/${id}`, payload);
      navigate(-1);
    } catch (err) {
      console.error("Update failed", err);
      setError(err?.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/auth/users/${id}`);
      navigate(-1);
    } catch (err) {
      console.error("Delete failed", err);
      setError(err?.response?.data?.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-2xl p-6 mt-10 border">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Edit User</h2>

      {loading && <p className="text-sm text-gray-600 mb-2">Loading...</p>}
      {error && <p className="text-sm text-red-600 mb-2">{error}</p>}

      <form onSubmit={handleSubmit}>
        {/* User ID (read-only) */}
        <label className="block text-sm font-medium text-gray-700">
          User ID
        </label>
        <input
          type="text"
          name="id"
          value={formData.id}
          readOnly
          className="mt-1 mb-4 w-full p-2 border rounded-lg bg-gray-100"
          placeholder="User ID"
        />

        {/* Name */}
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 mb-4 w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="Enter New Name"
          required
        />

        {/* Email */}
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="mt-1 mb-6 w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="Enter New Email"
          required
        />

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-orange-600 text-white py-2 rounded-xl hover:bg-orange-700 transition disabled:opacity-60"
          >
            Update User
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition disabled:opacity-60"
          >
            Delete
          </button>
        </div>
      </form>
    </div>
  );
}
