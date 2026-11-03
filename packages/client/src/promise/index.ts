import type { OpenCode } from "./client.js"

export * from "./generated/index.js"
export { OpenCode } from "./client.js"
export { Vex } from "./client.js"
export type {
  AgentApi,
  CommandApi,
  ConfigApi,
  EventApi,
  IntegrationApi,
  ModelApi,
  PluginApi,
  ProviderApi,
  ReferenceApi,
  RpcApi,
  RpcCallOptions,
  RpcClient,
  RpcEventPayload,
  WebSearchApi,
  SessionApi,
  SkillApi,
} from "./api.js"
export type { EventSubscribeOutput as OpenCodeEvent } from "./generated/types.js"
export type { EventSubscribeOutput as VexEvent } from "./generated/types.js"
export type VexClient = ReturnType<typeof OpenCode.make>
export type OpenCodeClient = VexClient
