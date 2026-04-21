export default function StudentCard({ student, onEdit, onDelete }) {
  const fullName = `${student.first_name} ${student.last_name}`;
  const birthDate = student.birth_date
    ? new Date(student.birth_date).toLocaleDateString()
    : "N/A";

  const hasSpecialNeeds = student.special_needs;

  return (
    <div
      className={`flex h-full flex-col rounded-2xl border p-6 text-gray-200 shadow-lg backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:bg-white/10 ${
        hasSpecialNeeds
          ? "border-amber-400/40 bg-amber-400/5 ring-1 ring-amber-300/30"
          : "border-white/10 bg-white/5 hover:border-white/20"
      }`}
    >
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">{fullName}</h2>
          <p className="mt-1 text-sm text-gray-400">Student Record</p>
        </div>

        <div className="flex items-center gap-2">
          {hasSpecialNeeds && (
            <span
              title="Additional support indicator"
              className="h-3 w-3 rounded-full bg-amber-300 shadow-[0_0_12px_rgba(252,211,77,0.8)]"
            />
          )}

          <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-300">
            {student.gender || "N/A"}
          </span>

          <button
            onClick={onEdit}
            title="Update student"
            className="rounded-lg border border-white/10 bg-white/5 p-2 text-gray-300 transition hover:bg-white/10 hover:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4"
            >
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25Zm17.71-10.04a1.003 1.003 0 0 0 0-1.42l-2.5-2.5a1.003 1.003 0 0 0-1.42 0l-1.96 1.96 3.75 3.75 2.13-1.79Z" />
            </svg>
          </button>

          <button
            onClick={onDelete}
            title="Delete student"
            className="rounded-lg border border-red-400/20 bg-red-500/10 p-2 text-red-300 transition hover:bg-red-500/20 hover:text-red-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4"
            >
              <path d="M9 3a1 1 0 0 0-.894.553L7.382 5H4a1 1 0 1 0 0 2h1l.77 11.565A2 2 0 0 0 7.765 20h8.47a2 2 0 0 0 1.995-1.435L19 7h1a1 1 0 1 0 0-2h-3.382l-.724-1.447A1 1 0 0 0 15 3H9Zm1 5a1 1 0 0 1 1 1v7a1 1 0 1 1-2 0V9a1 1 0 0 1 1-1Zm5 1a1 1 0 1 0-2 0v7a1 1 0 1 0 2 0V9Z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-black/20 p-3 sm:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Email
          </p>
          <p className="mt-1 break-words text-white">
            {student.email || "N/A"}
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/20 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Phone
          </p>
          <p className="mt-1 text-white">{student.phone || "N/A"}</p>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/20 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Birth Date
          </p>
          <p className="mt-1 text-white">{birthDate}</p>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/20 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Enrollment Year
          </p>
          <p className="mt-1 text-white">{student.enrollment_year || "N/A"}</p>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/20 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Department
          </p>
          <p className="mt-1 text-white">
            {student.department?.department_name || "N/A"}
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/20 p-3 sm:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Address
          </p>
          <p className="mt-1 text-white">{student.address || "N/A"}</p>
        </div>
      </div>
    </div>
  );
}
