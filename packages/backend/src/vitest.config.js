import { defineConfig, defaultExclude, defaultInclude } from "vitest/config";

export default defineConfig({
  test: {
    exclude: defaultExclude,
    include: defaultInclude,
    globalSetup: "src/globalSetup.ts",
  },
});
