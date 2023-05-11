import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
async function main() {
  const user = await prisma.user.create({
    select: { id: true },
    data: {
      name: "juanma131313",
      email: "juanma131313@gmail.com",
    },
  });

  const account = await prisma.account.create({
    data: {
      type: "oauth",
      userId: user.id,
      provider: "discord",
      providerAccountId: "1234567890", // ID de Discord falso
      refresh_token: "refresh_token_falso",
      access_token: "access_token_falso",
      expires_at: null,
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
