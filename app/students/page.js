"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";


export default function StudentsPage() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStudents() {
            const { data, error } = await supabase
                .from("student")
                .select(`
          first_name,
          last_name,
          birth_date,
          phone,
          address,
          gender,
          department:major_department_id (
            department_name
          ),
          special_needs,
          email,
          enrollment_year
        `)
                .limit(25);

            if (error) {
                console.error("Error fetching students:", error.message);
            } else {
                console.log(data);
                setStudents(data || []);
            }

            setLoading(false);
        }
        fetchStudents();
    }, []);

    if (loading) {
        return <div className="p-6">Loading students...</div>;
    }

    return (
        <main className="p-6">
            <h1 className="text-2xl font-bold mb-6">Students</h1>

            <div className="grid gap-4">
                {students.map((student, index) => {
                    const fullName = `${student.first_name} ${student.last_name}`;
                    const birthDate = new Date(student.birth_date).toLocaleDateString();

                    return (
                        <div
                            key={index}
                            className="border rounded-xl p-5 shadow-sm hover:shadow-md transition"
                        >
                            {/* Top row */}
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="text-lg font-semibold">{fullName}</h2>
                                <span className="text-sm text-gray-500">
                                    {student.gender}
                                </span>
                            </div>

                            {/* Info grid */}
                            <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-700">
                                <p>
                                    <span className="font-medium">Email:</span> {student.email}
                                </p>
                                <p>
                                    <span className="font-medium">Phone:</span> {student.phone}
                                </p>

                                <p>
                                    <span className="font-medium">Birth Date:</span> {birthDate}
                                </p>
                                <p>
                                    <span className="font-medium">Enrollment Year:</span>{" "}
                                    {student.enrollment_year}
                                </p>

                                <p className="col-span-2">
                                    <span className="font-medium">Address:</span>{" "}
                                    {student.address}
                                </p>

                                <p>
                                    <span className="font-medium">Major Dept ID:</span>{" "}
                                    {student.department?.department_name}
                                </p>

                                <p>
                                    <span className="font-medium">Special Needs:</span>{" "}
                                    {student.special_needs ? "Yes" : "No"}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </main>
    );
}