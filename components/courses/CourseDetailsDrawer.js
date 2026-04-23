"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function CourseDetailsDrawer({
  isOpen,
  course,
  role,
  professorProfile,
  studentProfile,
  onClose,
  onRefresh,
}) {
  const nextYear = new Date().getFullYear() + 1;

  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState([]);
  const [enrolledStudentsBySection, setEnrolledStudentsBySection] = useState(
    {},
  );
  const [studentEnrollments, setStudentEnrollments] = useState([]);
  const [submittingSection, setSubmittingSection] = useState(false);
  const [enrollingSectionId, setEnrollingSectionId] = useState(null);

  const [newSection, setNewSection] = useState({
    semester: "Fall",
    year: String(nextYear),
    room: "",
    days: "Monday/Wednesday",
    start_time: "",
    end_time: "",
    capacity: "",
  });

  const canProfessorCreateSection =
    role === "professor" &&
    professorProfile &&
    String(professorProfile.department_id) === String(course?.department_id);

  const studentEnrollmentSet = useMemo(() => {
    return new Set(studentEnrollments.map((row) => row.section_id));
  }, [studentEnrollments]);

  const loadDrawerData = async () => {
    if (!course?.course_id) return;

    setLoading(true);

    const { data: sectionData, error: sectionError } = await supabase
      .from("section")
      .select(
        `
        section_id,
        course_id,
        professor_id,
        semester,
        year,
        room,
        schedule,
        capacity,
        professor:professor_id (
          professor_id,
          first_name,
          last_name
        )
      `,
      )
      .eq("course_id", course.course_id)
      .order("year", { ascending: true });

    if (sectionError) {
      console.error("Failed to load sections:", sectionError.message);
      setSections([]);
      setLoading(false);
      return;
    }

    const sectionRows = sectionData || [];
    setSections(sectionRows);

    // load enrolled students per section for professors
    if (role === "professor" && sectionRows.length > 0) {
      const sectionIds = sectionRows.map((s) => s.section_id);

      const { data: enrollmentRows, error: enrollmentError } = await supabase
        .from("enrollment")
        .select(
          `
          enrollment_id,
          section_id,
          enrollment_date,
          grade,
          student:student_id (
            student_id,
            first_name,
            last_name,
            email
          )
        `,
        )
        .in("section_id", sectionIds);

      if (enrollmentError) {
        console.error(
          "Failed to load enrolled students:",
          enrollmentError.message,
        );
        setEnrolledStudentsBySection({});
      } else {
        const grouped = {};
        for (const row of enrollmentRows || []) {
          if (!grouped[row.section_id]) grouped[row.section_id] = [];
          grouped[row.section_id].push(row);
        }
        setEnrolledStudentsBySection(grouped);
      }
    } else {
      setEnrolledStudentsBySection({});
    }

    // load this student's enrollments for this course's sections
    if (
      role === "student" &&
      studentProfile?.student_id &&
      sectionRows.length > 0
    ) {
      const sectionIds = sectionRows.map((s) => s.section_id);

      const { data: studentEnrollmentRows, error: studentEnrollmentError } =
        await supabase
          .from("enrollment")
          .select("enrollment_id, section_id")
          .eq("student_id", studentProfile.student_id)
          .in("section_id", sectionIds);

      if (studentEnrollmentError) {
        console.error(
          "Failed to load student enrollments:",
          studentEnrollmentError.message,
        );
        setStudentEnrollments([]);
      } else {
        setStudentEnrollments(studentEnrollmentRows || []);
      }
    } else {
      setStudentEnrollments([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (!isOpen || !course) return;
    loadDrawerData();
  }, [isOpen, course, role, professorProfile, studentProfile]);

  useEffect(() => {
    if (!isOpen) {
      setSections([]);
      setEnrolledStudentsBySection({});
      setStudentEnrollments([]);
      setLoading(true);
      setSubmittingSection(false);
      setEnrollingSectionId(null);
      setNewSection({
        semester: "Fall",
        year: String(nextYear),
        room: "",
        days: "Monday/Wednesday",
        start_time: "",
        end_time: "",
        capacity: "",
      });
    }
  }, [isOpen, nextYear]);

  const handleSectionChange = (e) => {
    const { name, value } = e.target;
    setNewSection((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const buildSchedule = () => {
    if (!newSection.days || !newSection.start_time || !newSection.end_time)
      return "";
    return `${newSection.days} ${newSection.start_time}-${newSection.end_time}`;
  };

  const handleCreateSection = async (e) => {
    e.preventDefault();

    if (!canProfessorCreateSection || !professorProfile?.professor_id) return;

    if (!newSection.start_time || !newSection.end_time) {
      alert("Please choose both start and end time.");
      return;
    }

    if (newSection.end_time <= newSection.start_time) {
      alert("End time must be later than start time.");
      return;
    }

    setSubmittingSection(true);

    const { error } = await supabase.from("section").insert({
      course_id: course.course_id,
      professor_id: professorProfile.professor_id,
      semester: newSection.semester,
      year: Number(newSection.year),
      room: newSection.room.trim(),
      schedule: buildSchedule(),
      capacity: newSection.capacity ? Number(newSection.capacity) : null,
    });

    setSubmittingSection(false);

    if (error) {
      console.error("Failed to create section:", error.message);
      alert(`Failed to create section: ${error.message}`);
      return;
    }

    setNewSection({
      semester: "Fall",
      year: String(nextYear),
      room: "",
      days: "Monday/Wednesday",
      start_time: "",
      end_time: "",
      capacity: "",
    });

    await loadDrawerData();
    onRefresh?.();
  };

  const handleEnroll = async (section) => {
    if (!studentProfile?.student_id) {
      alert("Student information not found.");
      return;
    }

    if (studentEnrollmentSet.has(section.section_id)) {
      alert("You are already enrolled in this section.");
      return;
    }

    const currentEnrolled = (
      enrolledStudentsBySection[section.section_id] || []
    ).length;
    if (section.capacity && currentEnrolled >= section.capacity) {
      alert("This section is full.");
      return;
    }

    setEnrollingSectionId(section.section_id);

    const { error } = await supabase.from("enrollment").insert({
      student_id: studentProfile.student_id,
      section_id: section.section_id,
      enrollment_date: new Date().toISOString().split("T")[0],
      grade: null,
    });

    setEnrollingSectionId(null);

    if (error) {
      console.error("Failed to enroll:", error.message);
      alert(`Failed to enroll: ${error.message}`);
      return;
    }

    await loadDrawerData();
  };

  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative ml-auto h-full w-full max-w-2xl overflow-y-auto border-l border-white/10 bg-[#0f172a] p-6 shadow-2xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-blue-300">
              {course.course_code}
            </p>
            <h2 className="mt-1 text-2xl font-bold text-white">
              {course.course_name}
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              {course.department?.department_name || "Unknown Department"} ·{" "}
              {course.credits} credits · Level {course.course_level}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-300 transition hover:bg-white/10 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4">
          <h3 className="mb-2 text-lg font-semibold text-white">Description</h3>
          <p className="text-sm text-gray-300">
            {course.description || "No description available."}
          </p>
        </div>

        {canProfessorCreateSection && (
          <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4">
            <h3 className="mb-4 text-lg font-semibold text-white">
              Create New Section
            </h3>

            <form onSubmit={handleCreateSection} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    Semester
                  </label>
                  <select
                    name="semester"
                    value={newSection.semester}
                    onChange={handleSectionChange}
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
                    value={newSection.year}
                    onChange={handleSectionChange}
                    min={nextYear}
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
                    value={newSection.room}
                    onChange={handleSectionChange}
                    placeholder="Science 204"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-blue-400"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    Capacity
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    value={newSection.capacity}
                    onChange={handleSectionChange}
                    min="1"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-blue-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-300">Days</label>
                <select
                  name="days"
                  value={newSection.days}
                  onChange={handleSectionChange}
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
                    value={newSection.start_time}
                    onChange={handleSectionChange}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-blue-400"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    End Time
                  </label>
                  <input
                    type="time"
                    name="end_time"
                    value={newSection.end_time}
                    onChange={handleSectionChange}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-blue-400"
                    required
                  />
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-gray-300">
                <span className="font-medium text-white">
                  Preview Schedule:
                </span>{" "}
                {newSection.days && newSection.start_time && newSection.end_time
                  ? `${newSection.days} ${newSection.start_time}-${newSection.end_time}`
                  : "Choose days and times"}
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submittingSection}
                  className="rounded-xl bg-blue-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-600 disabled:opacity-50"
                >
                  {submittingSection ? "Creating..." : "Create Section"}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <h3 className="mb-4 text-lg font-semibold text-white">Sections</h3>

          {loading ? (
            <div className="text-sm text-gray-400">Loading sections...</div>
          ) : sections.length === 0 ? (
            <div className="text-sm text-gray-400">
              No sections available yet.
            </div>
          ) : (
            <div className="space-y-4">
              {sections.map((section) => {
                const enrolledStudents =
                  enrolledStudentsBySection[section.section_id] || [];
                const currentCount =
                  role === "professor" ? enrolledStudents.length : undefined;

                return (
                  <div
                    key={section.section_id}
                    className="rounded-2xl border border-white/10 bg-[#111827] p-4"
                  >
                    <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h4 className="text-lg font-semibold text-white">
                          {section.semester} {section.year}
                        </h4>
                        <p className="mt-1 text-sm text-gray-400">
                          {section.room || "No room"} ·{" "}
                          {section.schedule || "No schedule"}
                        </p>
                        <p className="mt-1 text-sm text-gray-400">
                          Professor:{" "}
                          {section.professor
                            ? `${section.professor.first_name} ${section.professor.last_name}`
                            : "Unknown"}
                        </p>
                        <p className="mt-1 text-sm text-gray-400">
                          Capacity: {section.capacity ?? "N/A"}
                          {role === "professor"
                            ? ` · Enrolled: ${currentCount}`
                            : ""}
                        </p>
                      </div>

                      {role === "student" && (
                        <button
                          type="button"
                          onClick={() => handleEnroll(section)}
                          disabled={
                            enrollingSectionId === section.section_id ||
                            studentEnrollmentSet.has(section.section_id)
                          }
                          className="rounded-xl bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600 disabled:opacity-50"
                        >
                          {studentEnrollmentSet.has(section.section_id)
                            ? "Enrolled"
                            : enrollingSectionId === section.section_id
                              ? "Enrolling..."
                              : "Enroll"}
                        </button>
                      )}
                    </div>

                    {role === "professor" && (
                      <div className="mt-4 border-t border-white/10 pt-4">
                        <h5 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-300">
                          Registered Students
                        </h5>

                        {enrolledStudents.length === 0 ? (
                          <p className="text-sm text-gray-400">
                            No students registered yet.
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {enrolledStudents.map((row) => (
                              <div
                                key={row.enrollment_id}
                                className="rounded-xl border border-white/10 bg-white/5 p-3"
                              >
                                <p className="font-medium text-white">
                                  {row.student?.first_name}{" "}
                                  {row.student?.last_name}
                                </p>
                                <p className="text-sm text-gray-400">
                                  {row.student?.email}
                                </p>
                                <p className="mt-1 text-xs text-gray-500">
                                  Enrolled: {row.enrollment_date || "N/A"}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
