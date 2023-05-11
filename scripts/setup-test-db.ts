import { execSync } from "child_process";

import { loadEnv } from "./load-env";

function setup() {
  console.log("🚀 Loading test env variables");
  loadEnv();

  console.log("🚀 Run test database docker container");
  execSync("docker-compose up -d");

  console.log("🚀 Creating and migrating database");
  execSync("npx prisma db push");
}

setup();
