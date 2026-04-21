"use client";

import Link from "next/link";
import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const router = useRouter();

  const [occupation, setOccupation] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");

  const passwordRegex =
    /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;

  const passwordCheck = (value) => {
    if (!passwordRegex.test(value)) {
      setPasswordError("Password must be at least 8 characters...");
    } else {
      setPasswordError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setPasswordError("");
    setConfirmPasswordError("");
    setEmailError("");

    const { data: studentData } = await supabase
      .from("student")
      .select("email")
      .eq("email", email);

    const { data: professorData } = await supabase
      .from("professor")
      .select("email")
      .eq("email", email);

    if (!passwordRegex.test(password)) {
      setPasswordError(
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.",
      );
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      setConfirmPassword("");
      return;
    }

    if (studentData?.length > 0 || professorData?.length > 0) {
      setEmailError("Email already exists. Please use a different email.");
      setEmail("");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.log("Error:", error.message);
      setEmailError(error.message);
      return;
    }

    if (!data.user) {
      setEmailError("Could not create account. Please try again.");
      return;
    }

    sessionStorage.setItem("canAccessProfile", "true");
    sessionStorage.setItem("occupation", occupation);

    router.push("/signup/profile");
  };

  return (
    <main className="flex-1 flex items-center justify-center pb-80 mt-5">
      <form
        className="w-full flex items-center justify-center"
        onSubmit={handleSubmit}
      >
        <div className="w-full max-w-sm bg-background p-6 border border-gray-500 rounded-2xl">
          <h5 className="text-xl font-semibold mb-6 text-center">
            Sign up to our platform
          </h5>

          <div className="mb-4">
            <label htmlFor="email" className="block mb-2.5 text-sm font-bold">
              Email
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
            <p className="text-red-500 text-sm mt-1">{emailError}</p>
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block mb-2.5 text-sm font-bold"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="input-field"
              placeholder="•••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => passwordCheck(password)}
            />
            <p className="text-red-500 text-sm mt-1">{passwordError}</p>
          </div>

          <div className="mb-4">
            <label
              htmlFor="confirmPassword"
              className="block mb-2.5 text-sm font-bold mt-3"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="input-field"
              placeholder="•••••••••"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <p className="text-red-500 text-sm mt-1">{confirmPasswordError}</p>
          </div>

          <div className="mb-4">
            <label
              htmlFor="occupation"
              className="block mb-2.5 text-sm font-bold"
            >
              Occupation
            </label>
            <select
              name="occupation"
              id="occupation"
              className="input-field mb-4 bg-background text-white rounded mt-4"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              required
            >
              <option value="">Select your occupation</option>
              <option value="student">Student</option>
              <option value="professor">Professor</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-2xl"
          >
            Sign Up
          </button>

          <div className="text-sm font-bold mt-3 text-center">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-500 hover:text-blue-600 hover:underline"
            >
              Log in
            </Link>
          </div>
        </div>
      </form>
    </main>
  );
}
