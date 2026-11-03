import { describe, expect } from "bun:test"
import { Bus } from "@vex/core/bus"
import { Config } from "@vex/core/config"
import { ConfigToolOutputPlugin } from "@vex/core/config/plugin/tool-output"
import { AppNodeBuilder } from "@vex/core/effect/app-node-builder"
import { Plugin } from "@vex/core/plugin"
import { PluginHost } from "@vex/core/plugin/host"
import { ToolOutput } from "@vex/core/tool-output"
import { Document, Event, Info } from "@vex/schema/config"
import { ConfigToolOutput } from "@vex/schema/config/tool-output"
import { Global } from "@vex/util/global"
import { Effect } from "effect"
import { tmpdir } from "../fixture/tmpdir"
import { it } from "../lib/effect"
import { PluginTestLayer } from "../plugin/fixture"

describe("ConfigToolOutputPlugin.Plugin", () => {
  it.live("applies limits and reloads changed config", () =>
    Effect.acquireUseRelease(
      Effect.promise(() => tmpdir()),
      (tmp) =>
        Effect.gen(function* () {
          const output = yield* ToolOutput.Service
          const bus = yield* Bus.Service
          const config = yield* Config.Test
          const plugins = yield* Plugin.Service
          yield* config.setEntries([
            new Document({
              type: "document",
              info: new Info({ tool_output: new ConfigToolOutput.Info({ max_lines: 1 }) }),
            }),
          ])
          yield* ConfigToolOutputPlugin.Plugin.effect(yield* PluginHost.make(plugins))

          expect((yield* output.truncate({ content: [{ type: "text", text: "one\ntwo" }] })).metadata?.truncated).toBe(
            true,
          )

          yield* config.setEntries([
            new Document({
              type: "document",
              info: new Info({
                tool_output: new ConfigToolOutput.Info({ max_lines: 2, max_bytes: 1_000 }),
              }),
            }),
          ])
          yield* bus.publish(Event.Updated, {})
          for (let attempt = 0; attempt < 200; attempt++) {
            const result = yield* output.truncate({ content: [{ type: "text", text: "one\ntwo" }] })
            if (result.metadata?.truncated === false) return
            yield* Effect.sleep("10 millis")
          }
          yield* Effect.die(new Error("Timed out waiting for tool output config reload"))
        }).pipe(
          Effect.provide(
            AppNodeBuilder.build(ToolOutput.node, [Global.node.replace(Global.layerWith({ data: tmp.path }))]),
          ),
        ),
      (tmp) => Effect.promise(() => tmp[Symbol.asyncDispose]()),
    ).pipe(Effect.provide(PluginTestLayer)),
  )
})
