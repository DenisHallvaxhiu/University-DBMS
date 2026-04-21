"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function CourseCreateDrawer({
  isOpen,
  onClose,
  onSaved,
  professorProfile,
}) {
  const nextYear = new Date().getFullYear() + 1;

  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    course_code: "",
    course_name: "",
    credits: "",
    description: "",
    course_level: "",
    semester: "Fall",
    year: String(nextYear),
    room: "",
    days: "Monday/Wednesday",
    start_time: "",
    end_time: "",
    capacity: "",
  });

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        course_code: "",
        course_name: "",
        credits: "",
        description: "",
        course_level: "",
        semester: "Fall",
        year: String(nextYear),
        room: "",
        days: "Monday/Wednesday",
        start_time: "",
        end_time: "",
        capacity: "",
      });
      setSaving(false);
    }
  }, [isOpen, nextYear]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const buildSchedule = () => {
    if (!formData.days || !formData.start_time || !formData.end_time) return "";

    return `${formData.days} ${formData.start_time}-${formData.end_time}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!professorProfile?.department_id || !professorProfile?.professor_id) {
      alert("Professor information was not found.");
      return;
    }

    if (!formData.start_time || !formData.end_time) {
      alert("Please choose both a start and end time.");
      return;
    }

    if (formData.end_time <= formData.start_time) {
      alert("End time must be later than start time.");
      return;
    }

    setSaving(true);

    // 1. create the course
    const { data: courseRow, error: courseError } = await supabase
      .from("course")
      .insert({
        course_code: formData.course_code.trim(),
        course_name: formData.course_name.trim(),
        credits: formData.credits ? Number(formData.credits) : null,
        department_id: professorProfile.department_id,
        description: formData.description.trim(),
        course_level: formData.course_level ? Number(formData.course_level) : null,
      })
      .select("course_id")
      .single();

    if (courseError) {
      setSaving(false);
      console.error("Create course failed:", courseError.message);
      alert(`Failed to create course: ${courseError.message}`);
      return;
    }

    // 2. create the first section
    const scheduleText = buildSchedule();

    const { error: sectionError } = await supabase.from("section").insert({
      course_id: courseRow.course_id,
      professor_id: professorProfile.professor_id,
      semester: formData.semester,
      year: Number(formData.year),
      room: formData.room.trim(),
      schedule: scheduleText,
      capacity: formData.capacity ? Number(formData.capacity) : null,
    });

    if (sectionError) {
      setSaving(false);
      console.error("Create section failed:", sectionError.message);
      alert(
        `Course was created, but creating the section failed: ${sectionError.message}`,
      );
      return;
    }

    setSaving(false);
    onClose();
    onSaved?.();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative ml-auto h-full w-full max-w-xl overflow-y-auto border-l border-white/10 bg-[#0f172a] p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Create Course</h2>
            <p className="mt-1 text-sm text-gray-400">
              New course and first section for{" "}
              <span className="font-medium text-gray-200">
                {professorProfile?.department?.department_name || "your department"}
              </span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-300 transition hover:bg-white/10 hover:text-white"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">
              Course Information
            </h3>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Course Code
                </label>
                <input
                  type="text"
                  name="course_code"
                  value={formData.course_code}
                  onChange={handleChange}
                  placeholder="CS101"
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Course Name
                </label>
                <input
                  type="text"
                  name="course_name"
                  value={formData.course_name}
                  onChange={handleChange}
                  placeholder="Introduction to Programming"
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-blue-400"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    Credits
                  </label>
                  <input
                    type="number"
                    name="credits"
                    value={formData.credits}
                    onChange={handleChange}
                    min="1"
                    max="6"
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-blue-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    Course Level
                  </label>
                  <input
                    type="number"
                    name="course_level"
                    value={formData.course_level}
                    onChange={handleChange}
                    placeholder="100"
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Department
                </label>
                <input
                  type="text"
                  value={professorProfile?.department?.department_name || ""}
                  disabled
                  className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-gray-300 outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Write a short description of the course..."
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-blue-400"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6">
            <h3 className="mb-4 text-lg font-semibold text-white">
              First Section Information
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    Semester
                  </label>
                  <select
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-white/10 bg-[#0f172a] px-4 py-3 text-white outline-none focus:border-blue-400"
                  >
                    <option value="Fall">Fall</option>
                    <option value="Spring">Spring</option>
                    <option value="Summer">Summer</option>
                    <option value="Winter">Winter</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    Year
                  </label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    min={nextYear}
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    Room
                  </label>
                  <input
                    type="text"
                    name="room"
                    value={formData.room}
                    onChange={handleChange}
                    placeholder="Science 204"
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-blue-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    Capacity
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    min="1"
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Days
                </label>
                <select
                  name="days"
                  value={formData.days}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-white/10 bg-[#0f172a] px-4 py-3 text-white outline-none focus:border-blue-400"
                >
                  <option value="Monday/Wednesday">Monday/Wednesday</option>
                  <option value="Tuesday/Thursday">Tuesday/Thursday</option>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                </select>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    Start Time
                  </label>
                  <input
                    type="time"
                    name="start_time"
                    value={formData.start_time}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-blue-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    End Time
                  </label>
                  <input
                    type="time"
                    name="end_time"
                    value={formData.end_time}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-gray-300">
                <span className="font-medium text-white">Preview Schedule:</span>{" "}
                {formData.days && formData.start_time && formData.end_time
                  ? `${formData.days} ${formData.start_time}-${formData.end_time}`
                  : "Choose days and times"}
              </div>
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
              {saving ? "Creating..." : "Create Course + Section"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}