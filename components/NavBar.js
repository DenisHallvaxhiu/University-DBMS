"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { usePathname, useRouter } from "next/navigation";

export default function NavBar() {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState(null);
  const [initials, setInitials] = useState("");
  const [role, setRole] = useState("");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadNavbarState() {
      const isLoggedIn = sessionStorage.getItem("isLoggedIn");
      const storedRole = sessionStorage.getItem("role");

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!isMounted) return;

      if (!session?.user || isLoggedIn !== "true" || !storedRole) {
        setUser(null);
        setInitials("");
        setRole("");
        setIsReady(true);
        return;
      }

      const authUser = session.user;
      const userId = authUser.id;

      setUser(authUser);
      setRole(storedRole);

      if (storedRole === "student") {
        const { data: student } = await supabase
          .from("student")
          .select("first_name, last_name")
          .eq("auth_id", userId)
          .maybeSingle();

        if (!isMounted) return;

        if (student) {
          const first = student.first_name?.[0] || "";
          const last = student.last_name?.[0] || "";
          setInitials((first + last).toUpperCase() || "U");
        } else {
          setInitials("U");
        }
      } else if (storedRole === "professor") {
        const { data: professor } = await supabase
          .from("professor")
          .select("first_name, last_name")
          .eq("auth_id", userId)
          .maybeSingle();

        if (!isMounted) return;

        if (professor) {
          const first = professor.first_name?.[0] || "";
          const last = professor.last_name?.[0] || "";
          setInitials((first + last).toUpperCase() || "U");
        } else {
          setInitials("U");
        }
      } else {
        setInitials("U");
      }

      setIsReady(true);
    }

    loadNavbarState();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      loadNavbarState();
    });

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, [pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();

    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("canAccessProfile");
    sessionStorage.removeItem("occupation");

    setUser(null);
    setInitials("");
    setRole("");

    router.push("/login");
  };

  const isLoggedIn = !!user;

  return (
    <nav className="flex justify-between bg-transparent border-b border-b-gray-900 border-opacity-10 py-3 px-15">
      <div className="flex justify-center align-middle gap-5">
        <Link className="nav-link" href="/">
          Home
        </Link>

        {isLoggedIn && (
          <Link className="nav-link" href="/courses">
            Courses
          </Link>
        )}

        {isLoggedIn && (role === "student" || role === "professor") && (
          <Link className="nav-link" href="/students">
            Students
          </Link>
        )}

        {isLoggedIn && role === "professor" && (
          <Link className="nav-link" href="/professors">
            Professors
          </Link>
        )}
      </div>

      <div className="flex items-center gap-4">
        {!isReady ? null : !isLoggedIn ? (
          <>
            <Link className="nav-link" href="/login">
              Log in
            </Link>
            <Link
              className="nav-link bg-blue-500 hover:bg-blue-600 border-0"
              href="/signup"
            >
              Sign up
            </Link>
          </>
        ) : (
          <>
            <Link href={role === "student" ? "/students" : "/professors"}>
              <div
                title={role}
                className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold cursor-pointer"
              >
                {initials}
              </div>
            </Link>

            <button
              onClick={handleLogout}
              className="nav-link text-red-500 hover:text-red-600"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
