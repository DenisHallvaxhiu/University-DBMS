"use client";
import Link from "next/link";
import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function Home() {
  const handleSubmit = async (e) => {
    console.log("email:", email);
    console.log("password:", password);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoginError("Invalid email or password. Please try again.");
      setEmail("");
      setPassword("");
      return;
    }
    console.log("error:", error);
    console.log("data:", data);
    const userId = data.user.id;

    const { data: studentData } = await supabase
      .from("student")
      .select("student_id")
      .eq("auth_id", userId);

    const { data: professorData } = await supabase
      .from("professor")
      .select("professor_id")
      .eq("auth_id", userId);

    if (studentData?.length > 0) {
      // router.push(`/student/${studentData.student_id}`);
      console.log("Student ID:", studentData[0].student_id);
    } else if (professorData?.length > 0) {
      // router.push(`/professor/${professorData.professor_id}`);
      console.log("Professor ID:", professorData[0].professor_id);
    } else {
      setLoginError("User role not found. Please contact support.");
      setEmail("");
      setPassword("");
      return;
    }
    setLoginError("");
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  return (
    <main className="flex-1 flex items-center justify-center pb-80">
      <div className="w-full max-w-sm bg-background p-6 border border-gray-500 rounded-2xl">
        <form
          action=""
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(e);
          }}
        >
          <h5 className="text-xl font-semibold mb-6">Log in to your account</h5>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2.5 text-sm font-bold">
              Your email
            </label>
            <input
              type="email"
              id="email"
              className="input-field"
              placeholder="example@company.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block mb-2.5 text-sm font-bold"
            >
              Your password
            </label>
            <input
              type="password"
              id="password"
              className="input-field"
              placeholder="•••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="text-red-500 text-sm mt-1">{loginError}</p>
          </div>
          <div className="flex items-start my-6">
            <div className="flex items-center">
              <input
                id="checkbox-remember"
                type="checkbox"
                value=""
                className="w-4 h-4"
              />
              <label
                htmlFor="checkbox-remember"
                className="ms-2 text-sm font-medium"
              >
                Remember me
              </label>
            </div>
            <Link
              href="/"
              className="ms-auto text-sm font-medium hover:underline"
            >
              Lost Password?
            </Link>
          </div>
          <button
            type="submit"
            className="w-full mb-1.5 nav-link bg-blue-500 hover:bg-blue-600 border-0"
          >
            Log in to your account
          </button>
          <div className="text-sm font-bold mt-1.5">
            Not registered?{" "}
            <button
              href="/signup"
              className="text-blue-500 hover:text-blue-600 hover:underline"
            >
              Create account
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
