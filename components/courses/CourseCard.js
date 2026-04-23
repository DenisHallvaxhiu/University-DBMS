export default function CourseCard({ course, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(course)}
      className="w-full rounded-2xl border border-white/10 bg-white/5 p-6 text-left backdrop-blur-sm transition hover:bg-white/10"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-blue-300">
            {course.course_code}
          </p>
          <h3 className="mt-1 text-xl font-semibold text-white">
            {course.course_name}
          </h3>
        </div>

        <span className="rounded-full bg-blue-500/15 px-3 py-1 text-xs font-medium text-blue-200">
          {course.credits} Credits
        </span>
      </div>

      <div className="space-y-2 text-sm text-gray-300">
        <p>
          <span className="font-medium text-gray-200">Department:</span>{" "}
          {course.department?.department_name || "Unknown"}
        </p>

        <p>
          <span className="font-medium text-gray-200">Level:</span>{" "}
          {course.course_level}
        </p>

        <p className="line-clamp-4 text-gray-400">
          {course.description || "No description available."}
        </p>
      </div>
    </button>
  );
}
