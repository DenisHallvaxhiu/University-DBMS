"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function SignUpProfile() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastName, setLastName] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [birthDate, setBirthDate] = useState("2026-06-01");
  const [birthDateError, setBirthDateError] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [address, setAddress] = useState("");
  const [addressError, setAddressError] = useState("");
  const [gender, setGender] = useState("");
  const [major, setMajor] = useState("");

  useEffect(() => {
    const canAccess = sessionStorage.getItem("canAccessProfile");
    if (!canAccess) {
      router.push("/signup");
    }
  }, []);

  return (
    <main className="flex-1 flex items-center justify-center">
      <form
        action=""
        className="w-full flex items-center justify-center"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(e);
        }}
      >
        <div className="w-full max-w-sm bg-background p-6 border border-gray-500 rounded-2xl">
          <h5 className="text-xl font-semibold mb-6 text-center">
            Complete your profile
          </h5>
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
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <p className="text-red-500 text-sm mt-1">{firstNameError}</p>
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
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <p className="text-red-500 text-sm mt-1">{lastNameError}</p>
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
              placeholder="MM/DD/YYYY"
              required
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />
            <p className="text-red-500 text-sm mt-1">{birthDateError}</p>
          </div>
          <div className="mb-4">
            <label
              htmlFor="phoneNumber"
              className="block mb-2.5 text-sm font-bold"
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="phoneNumber"
              className="input-field"
              placeholder="(123) 456-7890"
              required
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <p className="text-red-500 text-sm mt-1">{phoneNumberError}</p>
          </div>
          <div className="mb-4">
            <label htmlFor="address" className="block mb-2.5 text-sm font-bold">
              Address
            </label>
            <input
              type="text"
              id="address"
              className="input-field"
              placeholder="123 Main St, City, State, ZIP"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <p className="text-red-500 text-sm mt-1">{addressError}</p>
          </div>
          <div className="mb-4">
            <label htmlFor="gender" className="block mb-2.5 text-sm font-bold">
              Gender
            </label>
            <select
              name="gender"
              id="gender"
              className="input-field mb-4 bg-background text-white rounded  mt-4"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
            >
              <option value="">Select your gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="major" className="block mb-2.5 text-sm font-bold">
              Major
            </label>
            <select
              name="major"
              id="major"
              className="input-field mb-4 bg-background text-white rounded  mt-4"
              required
            >
              <option value="">Select your major</option>
              <option value="computer-science">Computer Science</option>
              <option value="mathematics">Mathematics</option>
              <option value="physics">Physics</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-2xl"
          >
            Finish Profile
          </button>
        </div>
      </form>
    </main>
  );
}
