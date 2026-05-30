import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/admin");
  }

  if ((session.user as any).role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin header */}
      <header className="bg-emerald-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="text-white/80 hover:text-white text-sm">← Site</a>
            <span className="text-white/40">|</span>
            <h1 className="font-semibold text-lg">TCM Admin</h1>
          </div>
          <div className="text-sm text-white/70">
            {session.user.email}
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
