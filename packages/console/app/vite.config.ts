import { createRequire } from "node:module"
import { dirname, resolve } from "node:path"
import { defineConfig, PluginOption } from "vite"
import { solidStart } from "@solidjs/start/config"
import { nitro } from "nitro/vite"
import { solidStartRuntimePath } from "../../../script/vite/solid-start-runtime-path"

const require = createRequire(import.meta.url)
const solidStartRuntime = resolve(dirname(require.resolve("@solidjs/start/config")), "../server")

export default defineConfig({
  plugins: [
    solidStart({
      middleware: "./src/middleware.ts",
    }) as PluginOption,
    solidStartRuntimePath(solidStartRuntime, resolve(process.cwd(), "src/app.tsx")),
    nitro({
      compatibilityDate: "2024-09-19",
      preset: "cloudflare-module",
      cloudflare: {
        nodeCompat: true,
      },
    }),
  ],
  server: {
    allowedHosts: true,
    port: 3001,
  },
  build: {
    rollupOptions: {
      external: ["cloudflare:workers"],
    },
    minify: false,
  },
})
