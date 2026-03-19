"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function SignUpProfile() {
  const router = useRouter();

  // Calculate max and min birth dates for age validation (15 to 100 years old)
  const today = new Date();
  const maxDate = new Date(
    today.getFullYear() - 15,
    today.getMonth(),
    today.getDate(),
  )
    .toISOString()
    .split("T")[0];

  const minDate = new Date(
    today.getFullYear() - 100,
    today.getMonth(),
    today.getDate(),
  )
    .toISOString()
    .split("T")[0];

  // Fetch majors from the database and set them in state
  const getMajors = async () => {
    const { data: majorsData, error } = await supabase
      .from("department")
      .select("department_id,department_name");

    if (error) {
      console.error("Error fetching majors:", error);
      return [];
    }
    setMajor(
      majorsData.map((m) => ({ id: m.department_id, name: m.department_name })),
    );
  };

  // Function to format phone number input as (123) 456-7890
  const formatPhone = (value) => {
    const numbers = value.replace(/\D/g, "");

    if (numbers.length <= 3) {
      return `(${numbers}`;
    } else if (numbers.length <= 6) {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    } else {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
    }
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhone(e.target.value);
    setPhoneNumber(formatted); // was setPhone, now matches your state
  };

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState(maxDate);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [major, setMajor] = useState([]);
  const [selectedMajor, setSelectedMajor] = useState("");
  const [majorError, setMajorError] = useState("");

  useEffect(() => {
    const canAccess = sessionStorage.getItem("canAccessProfile");
    // if (!canAccess) {
    //   router.push("/signup");
    // }
    getMajors();
  }, []);

  const handleSubmit = async (e) => {
    const occupation = sessionStorage.getItem("occupation");
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (phoneNumber.replace(/\D/g, "").length < 10) {
      setPhoneError("Please enter a valid phone number.");
      return;
    }
    if (selectedMajor === "") {
      setMajorError("Please select your major.");
      return;
    }
    if (occupation === "student") {
      const { error } = await supabase.from("student").insert({
        first_name: firstName,
        last_name: lastName,
        birth_date: birthDate,
        phone: phoneNumber,
        address: address,
        gender: gender,
        major_department_id: selectedMajor,
        email: user.email,
        enrollment_year: new Date().getFullYear(),
        auth_id: user.id,
      });
      if (error) {
        console.error("Error inserting student:", error.message);
        alert("Something went wrong. Please try again.");
        return;
      }
    } else if (occupation === "professor") {
      const { error } = await supabase.from("professor").insert({
        first_name: firstName,
        last_name: lastName,
        birth_date: birthDate,
        phone: phoneNumber,
        office_location: address,
        gender: gender,
        department_id: selectedMajor,
        email: user.email,
        start_date: new Date().toISOString().split("T")[0],
        auth_id: user.id,
      });
      if (error) {
        console.error("Error inserting professor:", error.message);
        alert("Something went wrong. Please try again.");
        return;
      }
    }

    sessionStorage.removeItem("canAccessProfile");
    sessionStorage.removeItem("occupation");
    router.push("/");
  };

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
              max={maxDate}
              min={minDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />
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
              value={phoneNumber}
              min={14}
              maxLength={14} // (123) 456-7890 is exactly 14 characters
              onChange={(e) => {
                handlePhoneChange(e);
              }}
            />
            <p className="text-red-500 text-sm mt-1">{phoneError}</p>
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
              className="input-field mb-4 bg-background text-white rounded mt-4"
              value={selectedMajor}
              onChange={(e) => setSelectedMajor(e.target.value)}
              required
            >
              <option key="default" value="">
                Select your major
              </option>
              {major.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
            <p className="text-red-500 text-sm mt-1">{majorError}</p>
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
