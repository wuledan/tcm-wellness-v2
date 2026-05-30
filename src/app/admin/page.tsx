"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

interface Stats {
  dbAvailable?: boolean;
  totalUsers: number;
  dailyNewUsers: { date: string; count: number }[];
  weeklyNewUsers: { date: string; count: number }[];
  activeUsers: number;
  totalQuizAttempts: number;
  totalFoodScans: number;
  constitutionDistribution: { type: string; count: number }[];
  languageDistribution: { language: string; count: number }[];
  recentSignups: { id: string; email: string; name: string | null; language: string; createdAt: string }[];
}

const CONSTITUTION_LABELS: Record<string, string> = {
  balanced: "Balanced (平和质)",
  qi_deficiency: "Qi Deficiency (气虚质)",
  yang_deficiency: "Yang Deficiency (阳虚质)",
  yin_deficiency: "Yin Deficiency (阴虚质)",
  phlegm_dampness: "Phlegm-Dampness (痰湿质)",
  damp_heat: "Damp-Heat (湿热质)",
  blood_stasis: "Blood Stasis (血瘀质)",
  qi_stagnation: "Qi Stagnation (气郁质)",
  intrinsic: "Intrinsic (特禀质)",
};

const PIE_COLORS = [
  "#059669", "#10b981", "#34d399", "#6ee7b7",
  "#f59e0b", "#f97316", "#ef4444", "#8b5cf6", "#ec4899",
];

const LANG_LABELS: Record<string, string> = {
  en: "English",
  zh: "中文",
  ko: "한국어",
  vi: "Tiếng Việt",
};

function StatCard({ label, value, icon }: { label: string; value: number | string; icon: string }) {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{icon}</span>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
      <p className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</p>
    </div>
  );
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login?callbackUrl=/admin");
    }
    if (status === "authenticated" && (session?.user as any)?.role !== "admin") {
      redirect("/dashboard");
    }
  }, [status, session]);

  useEffect(() => {
    if (status !== "authenticated") return;
    if ((session?.user as any)?.role !== "admin") return;

    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        if (!res.ok) {
          if (res.status === 403) {
            setError("Unauthorized");
            return;
          }
          throw new Error("Failed to fetch");
        }
        const data = await res.json();
        setStats(data);
      } catch (e) {
        setError("Failed to load stats");
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [status, session]);

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-2">⚠️ {error}</p>
          <p className="text-gray-400 text-sm">Database may not be connected yet.</p>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  // Show DB setup message when database is not configured
  if (stats.dbAvailable === false) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-lg">
          <p className="text-4xl mb-4">🗄️</p>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Database Not Configured</h2>
          <p className="text-gray-500 mb-4">
            The admin dashboard requires a PostgreSQL database. Please set up Neon Postgres and add
            the <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm text-emerald-700">DATABASE_URL</code> and{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm text-emerald-700">DIRECT_URL</code> environment variables on Vercel.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 text-left text-sm">
            <p className="font-medium text-gray-700 mb-2">Quick Setup:</p>
            <ol className="list-decimal list-inside space-y-1 text-gray-500">
              <li>Go to Vercel Dashboard &rarr; Storage &rarr; Create Database</li>
              <li>Choose Neon Postgres (free tier)</li>
              <li>Copy the DATABASE_URL and DIRECT_URL to env vars</li>
              <li>Redeploy the project</li>
              <li>Run db:push to create tables</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-gray-500 text-sm mt-1">Key metrics for TCM Wellness platform</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard label="Total Users" value={stats.totalUsers} icon="👥" />
        <StatCard label="Active Users (7d)" value={stats.activeUsers} icon="⚡" />
        <StatCard
          label="New Today"
          value={stats.dailyNewUsers[stats.dailyNewUsers.length - 1]?.count || 0}
          icon="🆕"
        />
        <StatCard label="Quiz Completions" value={stats.totalQuizAttempts} icon="📝" />
        <StatCard label="Food Scans" value={stats.totalFoodScans} icon="📷" />
        <StatCard
          label="Weekly New Users"
          value={stats.weeklyNewUsers.reduce((s, d) => s + d.count, 0)}
          icon="📈"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily New Users (30 days) */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Daily New Users (30 days)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={stats.dailyNewUsers}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10 }}
                tickFormatter={(v: string) => v.slice(5)}
              />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#059669"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly New Users (7 days) */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Daily New Users (7 days)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.weeklyNewUsers}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10 }}
                tickFormatter={(v: string) => v.slice(5)}
              />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Constitution + Language Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Constitution Distribution */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Constitution Distribution</h3>
          {stats.constitutionDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.constitutionDistribution.map((c) => ({
                    ...c,
                    name: CONSTITUTION_LABELS[c.type] || c.type,
                  }))}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry: any) =>
                    `${((entry.percent ?? 0) * 100).toFixed(0)}%`
                  }
                >
                  {stats.constitutionDistribution.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  formatter={(value: any) => (
                    <span className="text-xs text-gray-600">{String(value)}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 text-sm text-center py-12">No quiz data yet</p>
          )}
        </div>

        {/* Language Distribution */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Language Distribution</h3>
          {stats.languageDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={stats.languageDistribution.map((l) => ({
                  ...l,
                  label: LANG_LABELS[l.language] || l.language,
                }))}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="label" tick={{ fontSize: 12 }} width={80} />
                <Tooltip />
                <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 text-sm text-center py-12">No user data yet</p>
          )}
        </div>
      </div>

      {/* Recent Signups */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Recent Signups</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-6 py-3 font-medium text-gray-500">Email</th>
                <th className="px-6 py-3 font-medium text-gray-500">Name</th>
                <th className="px-6 py-3 font-medium text-gray-500">Language</th>
                <th className="px-6 py-3 font-medium text-gray-500">Signed Up</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentSignups.map((user) => (
                <tr key={user.id} className="border-t border-gray-50 hover:bg-gray-50">
                  <td className="px-6 py-3 text-gray-900">{user.email}</td>
                  <td className="px-6 py-3 text-gray-600">{user.name || "—"}</td>
                  <td className="px-6 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                      {LANG_LABELS[user.language] || user.language}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {stats.recentSignups.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                    No users yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
