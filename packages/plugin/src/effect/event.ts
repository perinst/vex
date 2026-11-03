import type { EventApi } from "@vex/client/effect/api"

export interface EventDomain extends Pick<EventApi<unknown>, "subscribe"> {}
