# Project architecture

This repository is an OpenCode-derived AI coding-agent monorepo. Its source packages retain the `@opencode/*` names. These documents describe the checked-out implementation, not a proposed redesign.

Start with the overview, then follow the chapter for the area you need. Each chapter keeps its own small diagrams, responsibilities, constraints, and source links; there is deliberately no single all-components diagram.

## Reading map

| Chapter | What you will understand | Main diagrams |
| --- | --- | --- |
| [01 — System overview](architecture/01-system-overview.md) | Product boundaries and execution modes | System context; deployment modes |
| [02 — Package boundaries](architecture/02-package-boundaries.md) | Which package owns what and dependency direction | Runtime dependency backbone |
| [03 — Runtime composition](architecture/03-runtime-composition.md) | Host, Location, instance, and resource lifetimes | Service selection and scopes |
| [04 — Session execution](architecture/04-session-execution.md) | Admission, delivery, model steps, and recovery | Prompt sequence; execution lifecycle |
| [05 — Persistence](architecture/05-persistence.md) | SQLite projections, event retention, and instructions | Transaction boundary; storage relationships |
| [06 — Event streams](architecture/06-event-streams.md) | Live events versus durable replay | SSE fan-out; replay handoff |
| [07 — API, Client, and SDK](architecture/07-api-client-sdk.md) | Contracts, middleware, generation, and embedding | HTTP request; generation; embedded transport |
| [08 — AI model layer](architecture/08-ai-model-layer.md) | Model selection and provider protocol adaptation | Model request pipeline |
| [09 — Tools and Code Mode](architecture/09-tools-and-code-mode.md) | Tool execution, permissions, output, and interpretation | Tool lifecycle; Code Mode boundary |
| [10 — Configuration and plugins](architecture/10-configuration-and-plugins.md) | Discovery, transforms, activation, and reload | Configuration/plugin flow |
| [11 — User interfaces](architecture/11-user-interfaces.md) | CLI/TUI, web, desktop, and client-local state | Client state flow; Electron boundary |
| [12 — Security boundaries](architecture/12-security-boundaries.md) | Authentication, approvals, policy, and trust limits | Separate security gates |
| [13 — Delivery and development](architecture/13-delivery-and-development.md) | Build/test workflow, hosted services, and runtime portability | Verification/release flow; hosting profiles |
| [Sources and knowledge graph](architecture/sources.md) | Evidence, graph usage, limitations, and maintenance | Research provenance |

## Suggested reading paths

- **New contributor:** 01 → 02 → 03 → 04, then your package's chapter.
- **Backend/runtime:** 03 → 04 → 05 → 06 → 08 → 09.
- **Integration author:** 07 → 10 → 12.
- **Frontend/desktop:** 07 → 06 → 11.
- **Deployment/operations:** 03 → 05 → 12 → 13.

## Vocabulary

| Term | Meaning here |
| --- | --- |
| Host | One constructed application runtime and its owned resources; not necessarily a network server. |
| Location | A directory-based placement reference, optionally carrying workspace identity. |
| Instance | A constructed Location capability graph. Default instances share by Location; SDK-selected instances can differ within one Location. |
| Session | A durable conversation/work aggregate addressed by Session ID. |
| Inbox | Durable, unconsumed input and control work, separate from visible messages. |
| Drain | Locally coordinated execution that consumes eligible work and continues model steps until it settles or hands off. |
| Step | One logical LLM call, potentially with recovery/retry attempts; not an assistant turn. |
| Projection | Stored read state updated by applying domain events transactionally. |
| Live stream | Volatile notifications; not a guarantee that missed events can be replayed. |

## Diagram conventions and authority

Diagrams use Mermaid fenced blocks, renderable in GitHub and Mermaid-capable Markdown viewers. Each diagram states whether arrows mean dependencies, requests, or lifecycle transitions. Source links lead to the actual implementation.

Snapshot: root version **2.0.28**, source commit **`9a4ef65e519c5b3e7c68420c1c9d8047205f3ca1`**. The supplied `.ua` graph was analyzed on **2026-10-17**, at a different commit. [Sources](architecture/sources.md) explains how it was checked against current code.

For exact behavior, authority belongs to Schema contracts, Protocol endpoint definitions, Core implementations, and the [current cross-module specifications](../specs/v2/README.md). This guide explains their relationships rather than replacing those contracts.
