import { Agent } from "@vex/core/agent"
import { AISDK } from "@vex/core/aisdk"
import { Command } from "@vex/core/command"
import { Config } from "@vex/core/config"
import { Credential } from "@vex/core/credential"
import { Database } from "@vex/core/database/database"
import { FileAccess } from "@vex/core/file-access"
import { LayerNodePlatform } from "@vex/util/effect/app-node-platform"
import { AppProcess } from "@vex/util/process"
import { LayerNode } from "@vex/util/effect/layer-node"
import { Bus } from "@vex/core/bus"
import { FileSystem } from "@vex/core/filesystem"
import { FSUtil } from "@vex/util/fs-util"
import { Form } from "@vex/core/form"
import { Generate } from "@vex/core/generate"
import { Integration } from "@vex/core/integration"
import { KV } from "@vex/core/kv"
import { Location } from "@vex/core/location"
import { ManagedPolicy } from "@vex/core/managed-policy"
import { Mcp } from "@vex/core/mcp/index"
import { Model } from "@vex/core/model"
import { Npm } from "@vex/util/npm"
import { Plugin } from "@vex/core/plugin"
import { PluginHooks } from "@vex/core/plugin/hooks"
import { Provider } from "@vex/core/provider"
import { Session } from "@vex/core/session"
import { PersistentPty } from "@vex/core/persistent-pty"
import { LocationServiceMap } from "@vex/core/location-service-map"
import { AppNodeBuilder } from "@vex/core/effect/app-node-builder"
import { Permission } from "@vex/core/permission"
import { Reference } from "@vex/core/reference"
import { Rpc } from "@vex/core/rpc"
import { Skill } from "@vex/core/skill"
import { SkillDiscovery } from "@vex/core/skill/discovery"
import { Watcher } from "@vex/core/filesystem/watcher"
import { Tool } from "@vex/core/tool"
import { Vcs } from "@vex/core/vcs"
import { WebSearch } from "@vex/core/websearch"
import { Worktree } from "@vex/core/worktree"
import { WorktreeStrategies } from "@vex/core/worktree/strategies"
import { Effect, Layer } from "effect"
import { tempLocationLayer } from "../fixture/location"
import { emptyMcpLayer } from "../fixture/mcp"

const npmLayer = Layer.succeed(
  Npm.Service,
  Npm.Service.of({
    add: (name) => Effect.succeed({ directory: "", name }),
    resolve: (name) => Effect.succeed({ directory: "", name }),
    check: () => Effect.succeed(false),
    update: (name) => Effect.succeed({ directory: "", name }),
    which: () => Effect.undefined,
  }),
)

const generateLayer = Layer.succeed(Generate.Service, Generate.Service.of({ text: () => Effect.succeed("") }))

const configLayer = Config.testLayer()

const permissionLayer = Layer.succeed(
  Permission.Service,
  Permission.Service.of({
    close: Effect.void,
    ask: (input) => Effect.succeed({ id: input.id ?? Permission.ID.create(), effect: "ask" }),
    assert: () => Effect.void,
    reply: () => Effect.void,
    get: () => Effect.succeed(undefined),
    forSession: () => Effect.succeed([]),
    list: () => Effect.succeed([]),
  }),
)

export const makePluginTestLayer = (permission = permissionLayer) =>
  AppNodeBuilder.build(
    LayerNode.group([
      AppProcess.node,
      FileSystem.node,
      FSUtil.node,
      Location.node,
      Npm.node,
      Credential.node,
      Config.node,
      Database.node,
      FileAccess.node,
      Bus.node,
      Form.node,
      Generate.node,
      LayerNodePlatform.httpClient,
      Plugin.node,
      Agent.node,
      AISDK.node,
      Provider.node,
      Model.node,
      Command.node,
      Integration.node,
      KV.node,
      ManagedPolicy.node,
      Mcp.node,
      Session.node,
      PersistentPty.node,
      LocationServiceMap.node,
      Permission.node,
      PluginHooks.node,
      Reference.node,
      Rpc.node,
      Skill.node,
      SkillDiscovery.node,
      Tool.node,
      Vcs.node,
      Watcher.node,
      WebSearch.node,
      Worktree.node,
      WorktreeStrategies.node,
    ]),
    [
      Location.node.replace(tempLocationLayer),
      Npm.node.replace(npmLayer),
      Config.node.replace(configLayer),
      Mcp.node.replace(emptyMcpLayer),
      Generate.node.replace(generateLayer),
      Permission.node.replace(permission),
    ],
  ).pipe(Layer.provideMerge(configLayer))

export const PluginTestLayer = makePluginTestLayer()
