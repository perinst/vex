import type { FileSystem } from "@vex/core/filesystem"
import { Bus } from "@vex/core/bus"
import { Image } from "@vex/core/image"
import { LocationServiceMap } from "@vex/core/location-service-map"
import type { LocationServices } from "@vex/core/location-services"
import { Plugin } from "@vex/core/plugin"
import { PluginHooks } from "@vex/core/plugin/hooks"
import { Skill } from "@vex/core/skill"
import type { Location } from "@vex/schema/location"
import { makeGlobalNode } from "@vex/util/effect/app-node"
import { LayerNode } from "@vex/util/effect/layer-node"
import { Effect, Layer, LayerMap } from "effect"

// Plain-prompt unit fixtures use virtual directories.
export const promptLocationNode = makeGlobalNode({
  service: LocationServiceMap.Service,
  layer: Layer.effect(
    LocationServiceMap.Service,
    Effect.gen(function* () {
      const bus = yield* Bus.Service
      return yield* LayerMap.make(
        (_ref: Location.Ref) =>
          LayerNode.compile(LayerNode.group([PluginHooks.node, Image.node, Skill.node, Plugin.node]), {
            replacements: [
              Bus.node.replace(Layer.succeed(Bus.Service, bus)),
              Plugin.node.replace(Layer.mock(Plugin.Service, { awaitActivation: Effect.void })),
            ],
          }) as unknown as Layer.Layer<LocationServices, FileSystem.DirectoryNotFoundError>,
      )
    }),
  ),
  deps: [Bus.node],
})
