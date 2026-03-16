import Link from "next/link";

export default function StudentsPage() {
    return (
        <div>
            <h1>Students Page</h1>
            <p>This is the students page.</p>
            <Link href="/" className="text-blue-500 hover:underline">Go back to Home</Link>
        </div>
    )
}