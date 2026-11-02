import { $ } from "bun"
import { describe, expect } from "bun:test"
import fs from "fs/promises"
import path from "path"
import { Bus } from "@vex/core/bus"
import { Config } from "@vex/core/config"
import { ConfigSnapshotPlugin } from "@vex/core/config/plugin/snapshot"
import { AppNodeBuilder } from "@vex/core/effect/app-node-builder"
import { Location } from "@vex/core/location"
import { Plugin } from "@vex/core/plugin"
import { PluginHost } from "@vex/core/plugin/host"
import { AbsolutePath } from "@vex/core/schema"
import { Snapshot } from "@vex/core/snapshot"
import { Document, Event, Info } from "@vex/schema/config"
import { Global } from "@vex/util/global"
import { Effect } from "effect"
import { tmpdir } from "../fixture/tmpdir"
import { it } from "../lib/effect"
import { PluginTestLayer } from "../plugin/fixture"

describe("ConfigSnapshotPlugin.Plugin", () => {
  it.live("applies availability and reloads changed config", () =>
    Effect.acquireUseRelease(
      Effect.promise(() => tmpdir()),
      (tmp) =>
        Effect.gen(function* () {
          const project = path.join(tmp.path, "project")
          yield* Effect.promise(async () => {
            await fs.mkdir(project)
            await fs.writeFile(path.join(project, "tracked.txt"), "one\n")
            await $`git init`.cwd(project).quiet()
            await $`git -c core.fsmonitor=false add .`.cwd(project).quiet()
          })

          yield* Effect.gen(function* () {
            const snapshot = yield* Snapshot.Service
            const bus = yield* Bus.Service
            const config = yield* Config.Test
            const plugins = yield* Plugin.Service
            yield* config.setEntries([new Document({ type: "document", info: new Info({ snapshots: false }) })])
            yield* ConfigSnapshotPlugin.Plugin.effect(yield* PluginHost.make(plugins))

            expect(yield* snapshot.capture()).toBeUndefined()

            yield* config.setEntries([new Document({ type: "document", info: new Info({ snapshots: true }) })])
            yield* bus.publish(Event.Updated, {})
            for (let attempt = 0; attempt < 200; attempt++) {
              if ((yield* snapshot.capture()) !== undefined) return
              yield* Effect.sleep("10 millis")
            }
            yield* Effect.die(new Error("Timed out waiting for snapshot config reload"))
          }).pipe(
            Effect.provide(
              AppNodeBuilder.build(Snapshot.node, [
                Location.node.replace(Location.boundNode(Location.Ref.make({ directory: AbsolutePath.make(project) }))),
                Global.node.replace(Global.layerWith({ data: tmp.path, config: path.join(tmp.path, "config") })),
              ]),
            ),
          )
        }),
      (tmp) => Effect.promise(() => tmp[Symbol.asyncDispose]()),
    ).pipe(Effect.provide(PluginTestLayer)),
  )
})
