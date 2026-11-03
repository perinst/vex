import { describe, expect, test } from "bun:test"
import { Effect } from "effect"
import { Provider } from "@vex/core/provider"

describe("Provider", () => {
  test("migrates persisted native package names to the Vex scope", () => {
    expect(Provider.packageName("@opencode-ai/ai/providers/openai")).toBe("@vex/ai/providers/openai")
  })

  test("loads bundled native provider entrypoints", async () => {
    const packages = [
      "@vex/ai/providers/baseten",
      "@vex/ai/providers/cerebras",
      "@vex/ai/providers/cloudflare-ai-gateway",
      "@vex/ai/providers/cloudflare-workers-ai",
      "@vex/ai/providers/cohere",
      "@vex/ai/providers/cohere/chat",
      "@vex/ai/providers/deepinfra",
      "@vex/ai/providers/deepseek",
      "@vex/ai/providers/fireworks",
      "@vex/ai/providers/google-vertex",
      "@vex/ai/providers/google-vertex/gemini",
      "@vex/ai/providers/google-vertex/interactions",
      "@vex/ai/providers/google-vertex/chat",
      "@vex/ai/providers/google-vertex/responses",
      "@vex/ai/providers/google-vertex/messages",
      "@vex/ai/providers/groq",
      "@vex/ai/providers/mistral",
      "@vex/ai/providers/togetherai",
      "@vex/ai/providers/vercel-ai-gateway",
    ]

    for (const specifier of packages) {
      const loaded = await Effect.runPromise(Provider.loadPackage(specifier))
      expect(loaded.model).toBeFunction()
    }
  })

  test("passes flat settings to native packages without Core settings", () => {
    expect(
      Provider.nativeSettings({
        apiKey: "secret",
        reasoningEffort: "high",
        chunkTimeout: 1000,
        compaction: { type: "native" },
        transport: "websocket",
      }),
    ).toEqual({
      apiKey: "secret",
      reasoningEffort: "high",
    })
  })

  test("inherits shared and loose settings without provider-only policies", () => {
    expect(
      Provider.modelSettings({
        timeout: 60_000,
        chunkTimeout: 30_000,
        transport: "websocket",
        compaction: { type: "native" },
        reasoningEffort: "high",
      }),
    ).toEqual({
      compaction: { type: "native" },
      reasoningEffort: "high",
    })
  })
})
