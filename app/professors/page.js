import Link from "next/link";

export default function ProfessorsPage() {
    return (
        <div>
            <h1>Professors Page</h1>
            <p>This is the professors page.</p>
            <Link href="/" className="text-blue-500 hover:underline">Go back to Home</Link>
        </div>
    )
}