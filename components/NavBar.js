import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="flex justify-between bg-transparent border-b border-b-gray-900 border-opacity-10 py-3 px-15">
      <div className="flex justify-center align-middle gap-5">
        <Link className="nav-link" href="/">
          Home
        </Link>
        <Link href="/students" className="nav-link">
          Students
        </Link>
        <Link className="nav-link" href="/courses">
          Courses
        </Link>
        <Link className="nav-link" href="/professors">
          Professors
        </Link>
      </div>
      <div className="flex justify-center align-middle gap-5">
        <Link className="nav-link" href="/login">
          Log in
        </Link>
        <Link className="nav-link bg-blue-500 hover:bg-blue-600 border-0" href="/signup">
          Sign up
        </Link>
      </div>
    </nav>
  );
}
