const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const mod = await prisma.module.findUnique({ where: { name: 'DSA' } });
  if (mod) {
    const newDesc = mod.description.replace(' (Striver A2Z)', '');
    await prisma.module.update({
      where: { name: 'DSA' },
      data: { description: newDesc }
    });
    console.log("Updated description to:", newDesc);
  } else {
    console.log("Module DSA not found.");
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
