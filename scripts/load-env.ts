import { loadEnvConfig } from "@next/env";

export const loadEnv = () => {
  // FIXME: Solución temporal.
  process.env.NODE_ENV = "test";
  const { combinedEnv } = loadEnvConfig(process.cwd());
  process.env = { ...process.env, ...combinedEnv };
};
