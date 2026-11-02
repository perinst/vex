// TODO: Keep additional network capabilities inside Schema and Protocol as the client grows; /effect must never import
// Core or Server. Preserve these datatype exports so internal model reorganizations do not require caller migrations.
import type { Effect } from "effect"
import type { OpenCode } from "./client.js"

export * from "./generated/index"
export { OpenCode } from "./client.js"
export { Vex } from "./client.js"
export type {
  AgentApi,
  AppApi,
  CommandApi,
  ConfigApi,
  EventApi,
  IntegrationApi,
  ModelApi,
  PluginApi,
  ProviderApi,
  ReferenceApi,
  RpcApi,
  RpcClient,
  WebSearchApi,
  SessionApi,
  SkillApi,
} from "./api.js"
export { Agent } from "@vex/schema/agent"
export { Command } from "@vex/schema/command"
export { Config } from "@vex/schema/config"
export { Credential } from "@vex/schema/credential"
export { Event } from "@vex/schema/event"
export { EventLog } from "@vex/schema/event-log"
export { FileSystem } from "@vex/schema/filesystem"
export { Form } from "@vex/schema/form"
export { Integration } from "@vex/schema/integration"
export { Location } from "@vex/schema/location"
export { Model } from "@vex/schema/model"
export { Permission } from "@vex/schema/permission"
export { PermissionSaved } from "@vex/schema/permission-saved"
export { Project } from "@vex/schema/project"
export { Worktree } from "@vex/schema/worktree"
export { Vcs } from "@vex/schema/vcs"
export { Provider } from "@vex/schema/provider"
export { Pty } from "@vex/schema/pty"
export { Question } from "@vex/schema/question"
export { Reference } from "@vex/schema/reference"
export { WebSearch } from "@vex/schema/websearch"
export { AbsolutePath, RelativePath } from "@vex/schema/schema"
export { Session } from "@vex/schema/session"
export { SessionInbox } from "@vex/schema/session-inbox"
export { SessionMessage } from "@vex/schema/session-message"
export { Skill } from "@vex/schema/skill"
export { Prompt } from "@vex/schema/prompt"
export { PromptInput } from "@vex/schema/prompt-input"
export type { OpenCodeEvent, OpenCodeEvent as VexEvent } from "@vex/protocol/groups/event"
export type VexClient = Effect.Success<ReturnType<typeof OpenCode.make>>
export type OpenCodeClient = VexClient
