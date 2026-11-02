import type { EventApi } from "@vex/client/promise/api"

export interface EventDomain extends Pick<EventApi, "subscribe"> {}
