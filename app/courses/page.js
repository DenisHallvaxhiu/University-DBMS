"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import CourseCard from "../../components/courses/CourseCard";
import CourseCreateDrawer from "../../components/courses/CourseCreateDrawer";
import CourseDetailsDrawer from "../../components/courses/CourseDetailsDrawer";

export default function CoursesPage() {
  const router = useRouter();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [role, setRole] = useState("");
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [professorProfile, setProfessorProfile] = useState(null);
  const [studentProfile, setStudentProfile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 9;

  useEffect(() => {
    async function checkAccess() {
      const isLoggedIn = sessionStorage.getItem("isLoggedIn");
      const storedRole = sessionStorage.getItem("role");

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session || isLoggedIn !== "true") {
        router.replace("/login");
        return;
      }

      setRole(storedRole || "");
      setCheckingAuth(false);
    }

    checkAccess();
  }, [router]);

  useEffect(() => {
    if (checkingAuth) return;

    let isMounted = true;

    async function loadPageData() {
      setLoading(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      const userId = session?.user?.id;

      const [
        { data: courseData, error: courseError },
        { data: deptData, error: deptError },
      ] = await Promise.all([
        supabase.from("course").select(`
          course_id,
          course_code,
          course_name,
          credits,
          department_id,
          description,
          course_level,
          department:department_id (
            department_id,
            department_name
          )
        `),
        supabase.from("department").select("department_id, department_name"),
      ]);

      if (!isMounted) return;

      if (courseError) {
        console.error("Error fetching courses:", courseError.message);
        setCourses([]);
      } else {
        setCourses(courseData || []);
      }

      if (deptError) {
        console.error("Error fetching departments:", deptError.message);
        setDepartments([]);
      } else {
        setDepartments(deptData || []);
      }

      if (role === "professor" && userId) {
        const { data: professorData, error: professorError } = await supabase
          .from("professor")
          .select(
            `
            professor_id,
            first_name,
            last_name,
            department_id,
            department:department_id (
              department_id,
              department_name
            )
          `,
          )
          .eq("auth_id", userId)
          .maybeSingle();

        if (!isMounted) return;

        if (professorError) {
          console.error(
            "Error fetching professor profile:",
            professorError.message,
          );
          setProfessorProfile(null);
        } else {
          setProfessorProfile(professorData || null);
        }

        setStudentProfile(null);
      }

      if (role === "student" && userId) {
        const { data: studentData, error: studentError } = await supabase
          .from("student")
          .select(
            `
            student_id,
            first_name,
            last_name,
            major_department_id
          `,
          )
          .eq("auth_id", userId)
          .maybeSingle();

        if (!isMounted) return;

        if (studentError) {
          console.error(
            "Error fetching student profile:",
            studentError.message,
          );
          setStudentProfile(null);
        } else {
          setStudentProfile(studentData || null);
        }

        setProfessorProfile(null);
      }

      setLoading(false);
    }

    loadPageData();

    return () => {
      isMounted = false;
    };
  }, [checkingAuth, role]);

  const filteredCourses = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return courses.filter((course) => {
      const matchesSearch =
        !term ||
        course.course_code?.toLowerCase().includes(term) ||
        course.course_name?.toLowerCase().includes(term) ||
        course.description?.toLowerCase().includes(term);

      const matchesDepartment =
        selectedDepartment === "all" ||
        String(course.department_id) === String(selectedDepartment);

      return matchesSearch && matchesDepartment;
    });
  }, [courses, searchTerm, selectedDepartment]);

  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const safeCurrentPage =
    totalPages === 0 ? 1 : Math.min(currentPage, totalPages);

  const paginatedCourses = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * coursesPerPage;
    return filteredCourses.slice(startIndex, startIndex + coursesPerPage);
  }, [filteredCourses, safeCurrentPage]);

  const canCreateCourse =
    role === "professor" && professorProfile?.department_id;

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleDepartmentChange = (e) => {
    setSelectedDepartment(e.target.value);
    setCurrentPage(1);
  };

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const refreshCourses = async () => {
    const { data, error } = await supabase.from("course").select(`
      course_id,
      course_code,
      course_name,
      credits,
      department_id,
      description,
      course_level,
      department:department_id (
        department_id,
        department_name
      )
    `);

    if (error) {
      console.error("Error refreshing courses:", error.message);
      return;
    }

    setCourses(data || []);
  };

  const handleCourseCreated = async () => {
    await refreshCourses();
  };

  const handleCardClick = (course) => {
    setSelectedCourse(course);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setSelectedCourse(null);
    setIsDetailsOpen(false);
  };

  if (checkingAuth) {
    return <div className="p-6 text-gray-300">Checking access...</div>;
  }

  if (loading) {
    return <div className="p-6 text-gray-300">Loading courses...</div>;
  }

  return (
    <>
      <div className="mx-auto mt-5 mb-5 max-w-7xl px-4">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Courses</h1>
            <p className="mt-1 text-sm text-gray-400">
              Browse course information
              {role === "professor"
                ? " and create courses for your department"
                : ""}
            </p>
          </div>

          <div className="flex flex-col gap-3 md:flex-row">
            <input
              type="text"
              placeholder="Search by code, name, or description..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-gray-400 outline-none backdrop-blur-sm transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30 md:w-80"
            />

            <select
              value={selectedDepartment}
              onChange={handleDepartmentChange}
              className="rounded-xl border border-white/10 bg-[#0f172a] px-4 py-3 text-sm text-white outline-none focus:border-blue-400"
            >
              <option value="all">All departments</option>
              {departments.map((dept) => (
                <option key={dept.department_id} value={dept.department_id}>
                  {dept.department_name}
                </option>
              ))}
            </select>

            {canCreateCourse && (
              <button
                onClick={() => setIsCreateOpen(true)}
                className="rounded-xl bg-blue-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-600"
              >
                Create Course
              </button>
            )}
          </div>
        </div>

        {canCreateCourse && professorProfile?.department?.department_name && (
          <div className="mb-4 rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4 text-sm text-blue-100">
            You can create courses for the{" "}
            <span className="font-semibold">
              {professorProfile.department.department_name}
            </span>{" "}
            department only.
          </div>
        )}

        <div className="mb-4 text-sm text-gray-400">
          Showing {paginatedCourses.length} of {filteredCourses.length} matching
          courses
        </div>

        {filteredCourses.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-gray-300 backdrop-blur-sm">
            No courses found.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {paginatedCourses.map((course) => (
                <CourseCard
                  key={course.course_id}
                  course={course}
                  onClick={handleCardClick}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={() => goToPage(safeCurrentPage - 1)}
                  disabled={safeCurrentPage === 1}
                  className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300 disabled:opacity-50"
                >
                  Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`rounded-lg px-4 py-2 text-sm ${
                        page === safeCurrentPage
                          ? "bg-blue-500 text-white"
                          : "border border-white/10 bg-white/5 text-gray-300"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}

                <button
                  onClick={() => goToPage(safeCurrentPage + 1)}
                  disabled={safeCurrentPage === totalPages}
                  className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <CourseCreateDrawer
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSaved={handleCourseCreated}
        professorProfile={professorProfile}
      />

      <CourseDetailsDrawer
        isOpen={isDetailsOpen}
        course={selectedCourse}
        role={role}
        professorProfile={professorProfile}
        studentProfile={studentProfile}
        onClose={handleCloseDetails}
        onRefresh={refreshCourses}
      />
    </>
  );
}
