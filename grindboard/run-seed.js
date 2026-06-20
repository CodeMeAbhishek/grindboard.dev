const { config } = require("dotenv");
config({ path: ".env.local" });
const { spawn } = require("child_process");

const child = spawn("npx", ["tsx", "prisma/seed.ts"], {
  stdio: "inherit",
  env: process.env,
  shell: true
});

child.on("close", (code) => {
  process.exit(code);
});
