import { supabase } from "../../lib/supabaseClient";

export default async function TestSupabasePage() {
  const { data, error, status, statusText } = await supabase
    .from("student")
    .select("*")
    .limit(10);

  console.log({ data, error, status, statusText });
  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Supabase Test</h1>

      {error && <p className="text-red-400">Error: {error.message}</p>}

      {!error && (
        <pre className="bg-slate-900 p-4 rounded-lg border border-slate-800 overflow-x-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </main>
  );
}
