import Image from "next/image";

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">
        University Course Registration System
      </h1>
      <p className="text-lg text-gray-700 mb-6">
        This is my first Next.js frontend demo.
      </p>

      <Link
        href="/students"
        className="px-4 py-2 bg-black text-white rounded-lg"
      >
        Go to Student Page
      </Link>

      <Link
        href="/courses"
        className="px-4 py-2 bg-black text-white rounded-lg"
      >
        Go to Course Page
      </Link>
    </main>
  );
}
