"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function StudentEditDrawer({
  isOpen,
  student,
  onClose,
  onSaved,
}) {
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(() => ({
    first_name: student?.first_name || "",
    last_name: student?.last_name || "",
    birth_date: student?.birth_date || "",
    phone: student?.phone || "",
    address: student?.address || "",
    gender: student?.gender || "",
    email: student?.email || "",
    enrollment_year: student?.enrollment_year || "",
    major_department_id: student?.major_department_id || "",
    special_needs: !!student?.special_needs,
  }));

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!student) return;

    setSaving(true);

    const { error } = await supabase
      .from("student")
      .update({
        first_name: formData.first_name,
        last_name: formData.last_name,
        birth_date: formData.birth_date || null,
        phone: formData.phone,
        address: formData.address,
        gender: formData.gender,
        email: formData.email,
        enrollment_year: formData.enrollment_year
          ? Number(formData.enrollment_year)
          : null,
        major_department_id: formData.major_department_id
          ? Number(formData.major_department_id)
          : null,
        special_needs: formData.special_needs,
      })
      .eq("student_id", student.student_id);

    setSaving(false);

    if (error) {
      console.error("Update failed:", error.message);
      alert("Failed to update student.");
      return;
    }

    onClose();
    onSaved?.();
  };

  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative ml-auto h-full w-full max-w-xl overflow-y-auto border-l border-white/10 bg-[#0f172a] p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Update Student</h2>
            <p className="mt-1 text-sm text-gray-400">
              Edit the current student information
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
                Enrollment Year
              </label>
              <input
                type="number"
                name="enrollment_year"
                value={formData.enrollment_year}
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
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
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
                name="major_department_id"
                value={formData.major_department_id}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-blue-400"
              />
            </div>

            <div className="flex items-center gap-3 pt-8">
              <input
                type="checkbox"
                name="special_needs"
                checked={formData.special_needs}
                onChange={handleChange}
                className="h-4 w-4"
              />
              <label className="text-sm text-gray-300">
                Additional support indicator
              </label>
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
