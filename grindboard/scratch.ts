import { config } from "dotenv";
config({ path: ".env.local" });
import { prisma } from "./src/lib/prisma";

async function main() {
  const modules = await prisma.module.findMany();
  console.log("Modules in DB:", modules);
  const topics = await prisma.topic.findMany();
  console.log("Topics in DB:", topics.length);
  const materials = await prisma.material.findMany();
  console.log("Materials in DB:", materials.length);
}
main();
