import { ensurePluginRuntime, provides } from "@vex/plugin/runtime"
import { Plugin, PluginContextProvider, usePlugin } from "@vex/plugin/tui"
import { ensureRuntimePluginSupport } from "@opentui/solid/runtime-plugin-support/configure"

ensurePluginRuntime()
ensureRuntimePluginSupport({
  additional: {
    "@vex/plugin/tui": { Plugin, PluginContextProvider, usePlugin },
  },
  preserve: provides,
})
