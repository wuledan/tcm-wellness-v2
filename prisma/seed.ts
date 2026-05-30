import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: "admin@tcmbody.com" },
    update: {},
    create: {
      email: "admin@tcmbody.com",
      name: "Admin",
      role: "admin",
      language: "en",
    },
  });

  console.log(`Admin user created: ${admin.email} (${admin.id})`);
  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
