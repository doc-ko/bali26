import { defineConfig } from "vite";

// base is "/" because this deploys to a custom domain (see public/CNAME).
// If you deploy to https://<user>.github.io/<repo>/ instead, set base to "/<repo>/".
export default defineConfig({
  base: "/",
  build: {
    outDir: "dist",
    assetsInlineLimit: 0,
  },
});
