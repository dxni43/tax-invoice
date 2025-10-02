import { getDBVersion } from "@/src/app/db";
export const runtime = 'nodejs';

export default async function Home() {
  const { version } = await getDBVersion();
  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold">DB OK</h1>
      <p className="text-sm text-gray-600">Postgres: {version}</p>
    </main>
  );
}
