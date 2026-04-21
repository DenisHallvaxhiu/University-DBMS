"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import StudentCard from "../../components/students/StudentCard";
import StudentEditDrawer from "../../components/students/StudentEditDrawer";
import StudentPagination from "../../components/students/StudentPagination";
import DeleteConfirmModal from "../../components/students/DeleteConfirmModal";

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [studentToDelete, setStudentToDelete] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  const studentsPerPage = 15;

  useEffect(() => {
    async function checkAccess() {
      const isLoggedIn = sessionStorage.getItem("isLoggedIn");
      const role = sessionStorage.getItem("role");

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session || isLoggedIn !== "true") {
        router.replace("/login");
        return;
      }

      setCheckingAuth(false);
    }

    checkAccess();
  }, [router]);

  useEffect(() => {
    let isMounted = true;

    async function loadStudents() {
      const { data, error } = await supabase.from("student").select(`
        student_id,
        first_name,
        last_name,
        birth_date,
        phone,
        address,
        gender,
        major_department_id,
        department:major_department_id (
          department_id,
          department_name
        ),
        special_needs,
        email,
        enrollment_year
      `);

      if (!isMounted) return;

      if (error) {
        console.error("Error fetching students:", error.message);
        setStudents([]);
      } else {
        setStudents(data || []);
      }

      setLoading(false);
    }

    loadStudents();

    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredStudents = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) return students;

    return students.filter((student) => {
      const first = student.first_name?.toLowerCase() || "";
      const last = student.last_name?.toLowerCase() || "";
      const full = `${first} ${last}`;
      const email = student.email?.toLowerCase() || "";

      return (
        first.includes(term) ||
        last.includes(term) ||
        full.includes(term) ||
        email.includes(term)
      );
    });
  }, [students, searchTerm]);

  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const safeCurrentPage =
    totalPages === 0 ? 1 : Math.min(currentPage, totalPages);

  const paginatedStudents = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * studentsPerPage;
    const endIndex = startIndex + studentsPerPage;
    return filteredStudents.slice(startIndex, endIndex);
  }, [filteredStudents, safeCurrentPage]);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const openEditPanel = (student) => {
    setSelectedStudent(student);
    setIsEditOpen(true);
  };

  const closeEditPanel = () => {
    setSelectedStudent(null);
    setIsEditOpen(false);
  };

  const openDeleteModal = (student) => {
    setStudentToDelete(student);
    setIsDeleteOpen(true);
  };

  const closeDeleteModal = () => {
    if (isDeleting) return;
    setStudentToDelete(null);
    setIsDeleteOpen(false);
  };

  const confirmDeleteStudent = async () => {
    if (!studentToDelete) return;

    setIsDeleting(true);

    const { error: advisorError } = await supabase
      .from("advisor")
      .delete()
      .eq("student_id", studentToDelete.student_id);

    if (advisorError) {
      console.error("Failed to delete advisor records:", advisorError.message);
      alert(`Failed to delete advisor records: ${advisorError.message}`);
      setIsDeleting(false);
      return;
    }

    const { error: enrollmentError } = await supabase
      .from("enrollment")
      .delete()
      .eq("student_id", studentToDelete.student_id);

    if (enrollmentError) {
      console.error("Failed to delete enrollments:", enrollmentError.message);
      alert(`Failed to delete enrollments: ${enrollmentError.message}`);
      setIsDeleting(false);
      return;
    }

    const { error: studentError } = await supabase
      .from("student")
      .delete()
      .eq("student_id", studentToDelete.student_id);

    if (studentError) {
      console.error("Failed to delete student:", studentError.message);
      alert(`Failed to delete student: ${studentError.message}`);
      setIsDeleting(false);
      return;
    }

    setStudents((prev) =>
      prev.filter((item) => item.student_id !== studentToDelete.student_id),
    );

    setIsDeleting(false);
    closeDeleteModal();
  };
  if (checkingAuth) {
    return <div className="p-6 text-gray-300">Checking access...</div>;
  }
  if (loading) {
    return <div className="p-6 text-sm text-gray-300">Loading students...</div>;
  }

  return (
    <>
      <div className="mx-auto mt-5 max-w-7xl px-4">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Students</h1>
            <p className="mt-1 text-sm text-gray-400">
              Browse and search student records
            </p>
          </div>

          <div className="w-full md:w-80">
            <input
              type="text"
              placeholder="Search by first or last name..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-gray-400 outline-none backdrop-blur-sm transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30"
            />
          </div>
        </div>

        <div className="mb-4 text-sm text-gray-400">
          Showing {paginatedStudents.length} of {filteredStudents.length}{" "}
          matching students
        </div>

        {filteredStudents.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-gray-300 backdrop-blur-sm">
            No students found.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {paginatedStudents.map((student) => (
                <StudentCard
                  key={student.student_id}
                  student={student}
                  onEdit={() => openEditPanel(student)}
                  onDelete={() => openDeleteModal(student)}
                />
              ))}
            </div>

            <StudentPagination
              currentPage={safeCurrentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
            />
          </>
        )}
      </div>

      <StudentEditDrawer
        key={selectedStudent?.student_id || "empty"}
        isOpen={isEditOpen}
        student={selectedStudent}
        onClose={closeEditPanel}
        onSaved={() => setRefreshKey((k) => k + 1)}
      />

      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        itemName={
          studentToDelete
            ? `${studentToDelete.first_name} ${studentToDelete.last_name}`
            : ""
        }
        entityName="student"
        relatedRecordsText="This will also delete related enrollment records."
        isDeleting={isDeleting}
        onClose={closeDeleteModal}
        onConfirm={confirmDeleteStudent}
      />
    </>
  );
}
