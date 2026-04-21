export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center pt-20 px-4">
      <h1 className="text-4xl font-bold mb-4 text-white">
        University Course Registration System
      </h1>

      <p className="text-lg text-gray-400 mb-12 text-center max-w-xl">
        Manage students, courses, and academic relationships in one place.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {/* STUDENTS */}
        <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/5 hover:bg-white/10 transition group">
          <div className="h-40 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b"
              alt="Students"
              className="w-full h-full object-cover group-hover:scale-105 transition"
            />
          </div>

          <div className="p-6">
            <h2 className="text-xl font-semibold text-white mb-2">
              🎓 Students
            </h2>
            <p className="text-gray-400 text-sm">
              Browse, search, and manage student records including enrollment,
              contact details, and academic progress.
            </p>
          </div>
        </div>

        {/* COURSES */}
        <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/5 hover:bg-white/10 transition group">
          <div className="h-40 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1513258496099-48168024aec0"
              alt="Courses"
              className="w-full h-full object-cover group-hover:scale-105 transition"
            />
          </div>

          <div className="p-6">
            <h2 className="text-xl font-semibold text-white mb-2">
              📚 Courses
            </h2>
            <p className="text-gray-400 text-sm">
              Organize courses, manage sections, and track schedules and
              classroom capacity efficiently.
            </p>
          </div>
        </div>

        {/* PROFESSORS */}
        <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/5 hover:bg-white/10 transition group">
          <div className="h-40 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1584697964358-3e14ca57658b"
              alt="Professors"
              className="w-full h-full object-cover group-hover:scale-105 transition"
            />
          </div>

          <div className="p-6">
            <h2 className="text-xl font-semibold text-white mb-2">
              👩‍🏫 Professors
            </h2>
            <p className="text-gray-400 text-sm">
              Manage faculty, assign teaching responsibilities, and oversee
              academic structure across departments.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
