"use client";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [selectedOccupation, setSelectedOccupation] = useState("");

  const handleOccupationChange = (event) => {
    setSelectedOccupation(event.target.value);
  };
  return (
    <main className="flex-1 flex items-center justify-center pb-80">
      <div className="w-full max-w-sm bg-background p-6 border border-gray-500 rounded-2xl">
        <h5 className="text-xl font-semibold mb-6 text-center">
          Sign up to our platform
        </h5>
        <select
          name="occupation"
          id="occupation"
          className="input-field mb-4 bg-background text-white rounded"
          onChange={handleOccupationChange}
        >
          <option className="" value="">
            Select your occupation
          </option>
          <option value="student">Student</option>
          <option value="faculty">Faculty</option>
        </select>
        {selectedOccupation === "student" && (
          <form action="#">
            <div className="mb-4">
              <label
                htmlFor="firstName"
                className="block mb-2.5 text-sm font-bold"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                className="input-field"
                placeholder="John"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="lastName"
                className="block mb-2.5 text-sm font-bold"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                className="input-field"
                placeholder="Doe"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="birthDate"
                className="block mb-2.5 text-sm font-bold"
              >
                Birth Date
              </label>
              <input
                type="date"
                id="birthDate"
                className="input-field"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="phoneNr"
                className="block mb-2.5 text-sm font-bold"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNr"
                className="input-field"
                pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                placeholder="Format: 123-456-7890"
                required
              />
            </div>
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
              />
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
                  for="checkbox-remember"
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
              Sign in to your account
            </button>
            <div className="text-sm font-bold mt-1.5">
              Not registered?{" "}
              <Link
                href="/signup"
                className="text-blue-500 hover:text-blue-600 hover:underline"
              >
                Create account
              </Link>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
