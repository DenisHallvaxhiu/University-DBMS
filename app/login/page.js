import Link from "next/link";

export default function Home() {
  return (
    <main className="flex-1 flex items-center justify-center pb-80">
      <div className="w-full max-w-sm bg-background p-6 border border-gray-500 rounded-2xl">
        <form action="#">
          <h5 className="text-xl font-semibold mb-6">
            Sign in to our platform
          </h5>
          <div className="mb-4">
            <label
              for="email"
              className="block mb-2.5 text-sm font-bold"
            >
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
            <Link href="/signup" className="text-blue-500 hover:text-blue-600 hover:underline">
              Create account
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
