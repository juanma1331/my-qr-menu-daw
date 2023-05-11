import { join } from "path";
import { loadEnvConfig } from "@next/env";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig(() => {
  loadEnvConfig(process.cwd());

  return {
    test: {
      exclude: [...configDefaults.exclude, "**/e2e/**"],
    },
    resolve: {
      alias: [
        {
          find: "~",
          replacement: join(process.cwd(), "src"),
        },
      ],
    },
  };
});
