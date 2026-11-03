import { NodeFileSystem } from "@effect/platform-node"
import { compile, emitEffectImported, emitEffectShape, emitPromise, write } from "@vex/httpapi-codegen"
import { ClientApi, effectOmitEndpoints, groupNames, promiseOmitEndpoints } from "@vex/protocol/client"
import { Agent } from "@vex/schema/agent"
import { Command } from "@vex/schema/command"
import { Config } from "@vex/schema/config"
import { Credential } from "@vex/schema/credential"
import { Event } from "@vex/schema/event"
import { EventLog } from "@vex/schema/event-log"
import { FileDiff } from "@vex/schema/file-diff"
import { FileSystem } from "@vex/schema/filesystem"
import { Form } from "@vex/schema/form"
import { Instruction } from "@vex/schema/instruction"
import { InstructionEntry } from "@vex/schema/instruction-entry"
import { Integration } from "@vex/schema/integration"
import { Location } from "@vex/schema/location"
import { Mcp } from "@vex/schema/mcp"
import { Model } from "@vex/schema/model"
import { Money } from "@vex/schema/money"
import { Permission } from "@vex/schema/permission"
import { PermissionSaved } from "@vex/schema/permission-saved"
import { Plugin } from "@vex/schema/plugin"
import { Project } from "@vex/schema/project"
import { Worktree } from "@vex/schema/worktree"
import { AgentAttachment, FileAttachment, Prompt, PromptMention } from "@vex/schema/prompt"
import { PromptInput } from "@vex/schema/prompt-input"
import { Provider } from "@vex/schema/provider"
import { Pty } from "@vex/schema/pty"
import { PtyTicket } from "@vex/schema/pty-ticket"
import { Question } from "@vex/schema/question"
import { Reference } from "@vex/schema/reference"
import { AbsolutePath, RelativePath } from "@vex/schema/schema"
import { Session } from "@vex/schema/session"
import { SessionMessage } from "@vex/schema/session-message"
import { SessionInbox } from "@vex/schema/session-inbox"
import { Shell } from "@vex/schema/shell"
import { Skill } from "@vex/schema/skill"
import { Snapshot } from "@vex/schema/snapshot"
import { Vcs } from "@vex/schema/vcs"
import { WebSearch } from "@vex/schema/websearch"
import { Workspace } from "@vex/schema/workspace"
import { SessionsCursor } from "@vex/protocol/groups/session"
import { Effect, Schema } from "effect"
import { fileURLToPath } from "url"

const promiseContract = compile(ClientApi, { groupNames, omitEndpoints: promiseOmitEndpoints })
const effectContract = compile(ClientApi, { groupNames, omitEndpoints: effectOmitEndpoints })
const effectTypeReferences = [
  ...namespaceTypes("Agent", "@vex/schema/agent", Agent),
  ...namespaceTypes("Command", "@vex/schema/command", Command),
  ...namespaceTypes("Config", "@vex/schema/config", Config),
  ...namespaceTypes("Credential", "@vex/schema/credential", Credential),
  ...namespaceTypes("Event", "@vex/schema/event", Event),
  ...namespaceTypes("EventLog", "@vex/schema/event-log", EventLog),
  ...namespaceTypes("FileDiff", "@vex/schema/file-diff", FileDiff),
  ...namespaceTypes("FileSystem", "@vex/schema/filesystem", FileSystem),
  ...namespaceTypes("Form", "@vex/schema/form", Form),
  ...namespaceTypes("Instruction", "@vex/schema/instruction", Instruction),
  ...namespaceTypes("InstructionEntry", "@vex/schema/instruction-entry", InstructionEntry),
  ...namespaceTypes("Integration", "@vex/schema/integration", Integration),
  typeReference("Location.PublicRef", "@vex/schema/location", Location.PublicRef),
  typeReference("Location.PublicInfo", "@vex/schema/location", Location.PublicInfo),
  ...namespaceTypes("Mcp", "@vex/schema/mcp", Mcp),
  ...namespaceTypes("Model", "@vex/schema/model", Model),
  ...namespaceTypes("Money", "@vex/schema/money", Money),
  ...namespaceTypes("Permission", "@vex/schema/permission", Permission),
  ...namespaceTypes("PermissionSaved", "@vex/schema/permission-saved", PermissionSaved),
  ...namespaceTypes("Plugin", "@vex/schema/plugin", Plugin),
  ...namespaceTypes("Project", "@vex/schema/project", Project),
  ...namespaceTypes("Worktree", "@vex/schema/worktree", Worktree),
  ...namespaceTypes("PromptInput", "@vex/schema/prompt-input", PromptInput),
  ...namespaceTypes("Provider", "@vex/schema/provider", Provider),
  ...namespaceTypes("Pty", "@vex/schema/pty", Pty),
  ...namespaceTypes("PtyTicket", "@vex/schema/pty-ticket", PtyTicket),
  ...namespaceTypes("Question", "@vex/schema/question", Question),
  ...namespaceTypes("Reference", "@vex/schema/reference", Reference),
  ...namespaceTypes("Session", "@vex/schema/session", Session),
  ...namespaceTypes("SessionMessage", "@vex/schema/session-message", SessionMessage),
  ...namespaceTypes("SessionInbox", "@vex/schema/session-inbox", SessionInbox),
  ...namespaceTypes("Shell", "@vex/schema/shell", Shell),
  ...namespaceTypes("Skill", "@vex/schema/skill", Skill),
  ...namespaceTypes("Snapshot", "@vex/schema/snapshot", Snapshot),
  ...namespaceTypes("Vcs", "@vex/schema/vcs", Vcs),
  ...namespaceTypes("WebSearch", "@vex/schema/websearch", WebSearch),
  ...namespaceTypes("Workspace", "@vex/schema/workspace", Workspace),
  typeReference("Prompt", "@vex/schema/prompt", Prompt),
  typeReference("PromptMention", "@vex/schema/prompt", PromptMention),
  typeReference("FileAttachment", "@vex/schema/prompt", FileAttachment),
  typeReference("AgentAttachment", "@vex/schema/prompt", AgentAttachment),
  typeReference("AbsolutePath", "@vex/schema/schema", AbsolutePath),
  typeReference("RelativePath", "@vex/schema/schema", RelativePath),
  typeReference("SessionsCursor", "@vex/protocol/groups/session", SessionsCursor),
]

await Effect.runPromise(
  Effect.all(
    [
      write(
        emitPromise(promiseContract, {
          mutableOutputs: true,
        }),
        fileURLToPath(new URL("../src/promise/generated", import.meta.url)),
      ),
      write(
        emitEffectImported(effectContract, {
          module: "../../contract",
          api: "ClientApi",
          shapeModule: "../api/api.js",
        }),
        fileURLToPath(new URL("../src/effect/generated", import.meta.url)),
      ),
      write(
        emitEffectShape(effectContract, {
          typeReferences: effectTypeReferences,
          outputTypes: {
            "event.subscribe": {
              name: "OpenCodeEvent",
              import: 'import type { OpenCodeEvent } from "@vex/protocol/groups/event"',
            },
          },
        }),
        fileURLToPath(new URL("../src/effect/api", import.meta.url)),
      ),
    ],
    { concurrency: 3, discard: true },
  ).pipe(Effect.provide(NodeFileSystem.layer)),
)

function namespaceTypes(namespace: string, module: string, values: object) {
  return Object.entries(values).flatMap(([name, schema]) =>
    Schema.isSchema(schema) ? [typeReference(`${namespace}.${name}`, module, schema)] : [],
  )
}

function typeReference(name: string, module: string, schema: Schema.Top) {
  return {
    schema,
    name,
    import: `import type { ${name.split(".")[0]} } from ${JSON.stringify(module)}`,
  }
}
