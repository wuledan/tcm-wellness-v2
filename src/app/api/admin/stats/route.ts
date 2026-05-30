import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    // Verify admin role
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (!prisma) {
      return NextResponse.json({
        dbAvailable: false,
        error: "Database not configured. Set DATABASE_URL environment variable.",
        totalUsers: 0,
        dailyNewUsers: [],
        weeklyNewUsers: [],
        activeUsers: 0,
        totalQuizAttempts: 0,
        totalFoodScans: 0,
        constitutionDistribution: [],
        languageDistribution: [],
        recentSignups: [],
      });
    }

    // Total users
    const totalUsers = await prisma.user.count();

    // Daily new users (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentUsers = await prisma.user.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true },
      orderBy: { createdAt: "asc" },
    });

    // Aggregate daily new users
    const dailyMap = new Map<string, number>();
    for (const u of recentUsers) {
      const dateKey = u.createdAt.toISOString().split("T")[0];
      dailyMap.set(dateKey, (dailyMap.get(dateKey) || 0) + 1);
    }

    const dailyNewUsers: { date: string; count: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateKey = d.toISOString().split("T")[0];
      dailyNewUsers.push({
        date: dateKey,
        count: dailyMap.get(dateKey) || 0,
      });
    }

    // Last 7 days
    const weeklyNewUsers = dailyNewUsers.slice(-7);

    // Active users (users with activity in last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentQuizUsers = await prisma.quizAttempt.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      select: { userId: true },
      distinct: ["userId"],
    });

    const recentScanUsers = await prisma.foodScan.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      select: { userId: true },
      distinct: ["userId"],
    });

    const activeUserIds = new Set([
      ...recentQuizUsers.map((u) => u.userId),
      ...recentScanUsers.map((u) => u.userId),
    ]);
    const activeUsers = activeUserIds.size;

    // Total quiz attempts
    const totalQuizAttempts = await prisma.quizAttempt.count();

    // Total food scans
    const totalFoodScans = await prisma.foodScan.count();

    // Constitution distribution
    const constitutionAgg = await prisma.quizAttempt.groupBy({
      by: ["constitution"],
      _count: { constitution: true },
      orderBy: { _count: { constitution: "desc" } },
    });

    const constitutionDistribution = constitutionAgg.map((c) => ({
      type: c.constitution,
      count: c._count.constitution,
    }));

    // Language distribution
    const languageAgg = await prisma.user.groupBy({
      by: ["language"],
      _count: { language: true },
      orderBy: { _count: { language: "desc" } },
    });

    const languageDistribution = languageAgg.map((l) => ({
      language: l.language,
      count: l._count.language,
    }));

    // Recent signups
    const recentSignups = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        email: true,
        name: true,
        language: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      dbAvailable: true,
      totalUsers,
      dailyNewUsers,
      weeklyNewUsers,
      activeUsers,
      totalQuizAttempts,
      totalFoodScans,
      constitutionDistribution,
      languageDistribution,
      recentSignups,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
