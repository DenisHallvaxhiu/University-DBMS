import Link from "next/link";

export default function CoursePage() {
    return (
        <div>
            <h1>Course Page</h1>
            <p>This is the course page.</p>
            <Link href="/" className="text-blue-500 hover:underline">Go back to Home</Link>
        </div>
    )
}