"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function ProfessorEditDrawer({
  isOpen,
  professor,
  onClose,
  onSaved,
}) {
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    birth_date: "",
    phone: "",
    office_location: "",
    gender: "",
    email: "",
    start_date: "",
    department_id: "",
  });

  useEffect(() => {
    if (professor) {
      setFormData({
        first_name: professor.first_name || "",
        last_name: professor.last_name || "",
        birth_date: professor.birth_date || "",
        phone: professor.phone || "",
        office_location: professor.office_location || "",
        gender: professor.gender || "",
        email: professor.email || "",
        start_date: professor.start_date || "",
        department_id: professor.department_id || "",
      });
    }
  }, [professor]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!professor) return;

    setSaving(true);

    const { error } = await supabase
      .from("professor")
      .update({
        first_name: formData.first_name,
        last_name: formData.last_name,
        birth_date: formData.birth_date || null,
        phone: formData.phone,
        office_location: formData.office_location,
        gender: formData.gender,
        email: formData.email,
        start_date: formData.start_date || null,
        department_id: formData.department_id
          ? Number(formData.department_id)
          : null,
      })
      .eq("professor_id", professor.professor_id);

    setSaving(false);

    if (error) {
      console.error("Update failed:", error.message);
      alert("Failed to update professor.");
      return;
    }

    onClose();
    onSaved?.();
  };

  if (!isOpen || !professor) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative ml-auto h-full w-full max-w-xl overflow-y-auto border-l border-white/10 bg-[#0f172a] p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Update Professor</h2>
            <p className="mt-1 text-sm text-gray-400">
              Edit the current professor information
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-300 transition hover:bg-white/10 hover:text-white"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-gray-300">
                First Name
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Last Name
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Birth Date
              </label>
              <input
                type="date"
                name="birth_date"
                value={formData.birth_date}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">Gender</label>
              <input
                type="text"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Start Date
              </label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-blue-400"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm text-gray-300">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-blue-400"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm text-gray-300">
                Office Location
              </label>
              <textarea
                name="office_location"
                value={formData.office_location}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Department ID
              </label>
              <input
                type="number"
                name="department_id"
                value={formData.department_id}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-blue-400"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-gray-300 transition hover:bg-white/10"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-blue-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-600 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
