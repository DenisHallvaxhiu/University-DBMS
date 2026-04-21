"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import StudentCard from "../../components/students/StudentCard";
import ProfessorEditDrawer from "../../components/professors/ProfessorEditDrawer";
import StudentPagination from "../../components/students/StudentPagination";
import DeleteConfirmModal from "../../components/students/DeleteConfirmModal";

export default function ProfessorsPage() {
  const router = useRouter();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [professors, setProfessors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);

  const [selectedProfessor, setSelectedProfessor] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [professorToDelete, setProfessorToDelete] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const professorsPerPage = 15;

  useEffect(() => {
    async function checkAccess() {
      const isLoggedIn = sessionStorage.getItem("isLoggedIn");
      const role = sessionStorage.getItem("role");

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session || isLoggedIn !== "true" || role !== "professor") {
        router.replace("/login");
        return;
      }

      setCheckingAuth(false);
    }

    checkAccess();
  }, [router]);

  useEffect(() => {
    if (checkingAuth) return;

    let isMounted = true;

    async function loadProfessors() {
      setLoading(true);

      const { data, error } = await supabase.from("professor").select(`
        professor_id,
        first_name,
        last_name,
        birth_date,
        phone,
        office_location,
        gender,
        department_id,
        department:department_id (
          department_id,
          department_name
        ),
        email,
        start_date
      `);

      if (!isMounted) return;

      if (error) {
        console.error("Error fetching professors:", error.message);
        setProfessors([]);
      } else {
        setProfessors(data || []);
      }

      setLoading(false);
    }

    loadProfessors();

    return () => {
      isMounted = false;
    };
  }, [checkingAuth, refreshKey]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredProfessors = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) return professors;

    return professors.filter((professor) => {
      const first = professor.first_name?.toLowerCase() || "";
      const last = professor.last_name?.toLowerCase() || "";
      const full = `${first} ${last}`;
      const email = professor.email?.toLowerCase() || "";

      return (
        first.includes(term) ||
        last.includes(term) ||
        full.includes(term) ||
        email.includes(term)
      );
    });
  }, [professors, searchTerm]);

  const totalPages = Math.ceil(filteredProfessors.length / professorsPerPage);

  const safeCurrentPage =
    totalPages === 0 ? 1 : Math.min(currentPage, totalPages);

  const paginatedProfessors = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * professorsPerPage;
    const endIndex = startIndex + professorsPerPage;
    return filteredProfessors.slice(startIndex, endIndex);
  }, [filteredProfessors, safeCurrentPage]);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const openEditPanel = (professor) => {
    setSelectedProfessor(professor);
    setIsEditOpen(true);
  };

  const closeEditPanel = () => {
    setSelectedProfessor(null);
    setIsEditOpen(false);
  };

  const openDeleteModal = (professor) => {
    setProfessorToDelete(professor);
    setIsDeleteOpen(true);
  };

  const closeDeleteModal = () => {
    if (isDeleting) return;
    setProfessorToDelete(null);
    setIsDeleteOpen(false);
  };

  const confirmDeleteProfessor = async () => {
    if (!professorToDelete) return;

    setIsDeleting(true);

    // 1. get all section ids for this professor
    const { data: sectionRows, error: sectionFetchError } = await supabase
      .from("section")
      .select("section_id")
      .eq("professor_id", professorToDelete.professor_id);

    if (sectionFetchError) {
      console.error("Failed to fetch sections:", sectionFetchError.message);
      alert(`Failed to fetch sections: ${sectionFetchError.message}`);
      setIsDeleting(false);
      return;
    }

    const sectionIds = (sectionRows || []).map((row) => row.section_id);

    // 2. delete enrollments tied to those sections
    if (sectionIds.length > 0) {
      const { error: enrollmentError } = await supabase
        .from("enrollment")
        .delete()
        .in("section_id", sectionIds);

      if (enrollmentError) {
        console.error("Failed to delete enrollments:", enrollmentError.message);
        alert(`Failed to delete enrollments: ${enrollmentError.message}`);
        setIsDeleting(false);
        return;
      }
    }

    // 3. delete advisor rows for this professor
    const { error: advisorError } = await supabase
      .from("advisor")
      .delete()
      .eq("professor_id", professorToDelete.professor_id);

    if (advisorError) {
      console.error("Failed to delete advisor records:", advisorError.message);
      alert(`Failed to delete advisor records: ${advisorError.message}`);
      setIsDeleting(false);
      return;
    }

    // 4. delete sections for this professor
    const { error: sectionError } = await supabase
      .from("section")
      .delete()
      .eq("professor_id", professorToDelete.professor_id);

    if (sectionError) {
      console.error("Failed to delete section records:", sectionError.message);
      alert(`Failed to delete section records: ${sectionError.message}`);
      setIsDeleting(false);
      return;
    }

    // 5. delete professor
    const { error: professorError } = await supabase
      .from("professor")
      .delete()
      .eq("professor_id", professorToDelete.professor_id);

    if (professorError) {
      console.error("Failed to delete professor:", professorError.message);
      alert(`Failed to delete professor: ${professorError.message}`);
      setIsDeleting(false);
      return;
    }

    setProfessors((prev) =>
      prev.filter(
        (item) => item.professor_id !== professorToDelete.professor_id,
      ),
    );

    setIsDeleting(false);
    closeDeleteModal();
  };

  if (checkingAuth) {
    return <div className="p-6 text-sm text-gray-300">Checking access...</div>;
  }

  if (loading) {
    return (
      <div className="p-6 text-sm text-gray-300">Loading professors...</div>
    );
  }

  return (
    <>
      <div className="mx-auto mt-5 max-w-7xl px-4">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Professors</h1>
            <p className="mt-1 text-sm text-gray-400">
              Browse and search professor records
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
          Showing {paginatedProfessors.length} of {filteredProfessors.length}{" "}
          matching professors
        </div>

        {filteredProfessors.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-gray-300 backdrop-blur-sm">
            No professors found.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {paginatedProfessors.map((professor) => {
                const mappedProfessor = {
                  student_id: professor.professor_id,
                  first_name: professor.first_name,
                  last_name: professor.last_name,
                  birth_date: professor.birth_date,
                  phone: professor.phone,
                  address: professor.office_location,
                  gender: professor.gender,
                  major_department_id: professor.department_id,
                  department: professor.department,
                  special_needs: false,
                  email: professor.email,
                  enrollment_year: professor.start_date,
                };

                return (
                  <StudentCard
                    key={professor.professor_id}
                    student={mappedProfessor}
                    onEdit={() => openEditPanel(professor)}
                    onDelete={() => openDeleteModal(professor)}
                  />
                );
              })}
            </div>

            <StudentPagination
              currentPage={safeCurrentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
            />
          </>
        )}
      </div>

      <ProfessorEditDrawer
        key={selectedProfessor?.professor_id || "empty"}
        isOpen={isEditOpen}
        professor={selectedProfessor}
        onClose={closeEditPanel}
        onSaved={() => setRefreshKey((k) => k + 1)}
      />

      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        itemName={
          professorToDelete
            ? `${professorToDelete.first_name} ${professorToDelete.last_name}`
            : ""
        }
        entityName="professor"
        relatedRecordsText="This will also delete related advisor and section records."
        isDeleting={isDeleting}
        onClose={closeDeleteModal}
        onConfirm={confirmDeleteProfessor}
      />
    </>
  );
}
