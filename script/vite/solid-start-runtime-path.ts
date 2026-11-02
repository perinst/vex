export const solidStartRuntimePath = (runtime: string, appEntry: string) => {
  const normalizedRuntime = runtime.replaceAll("\\", "/")
  return {
    name: "solid-start-runtime-path",
    enforce: "post" as const,
    config() {
      return {
        define: {
          "import.meta.env.START_APP_ENTRY": JSON.stringify(appEntry),
        },
      }
    },
    transform(code: string) {
      return code.replace(
        /from\s+(["'])[A-Za-z]:[^"']*?server-(runtime|fns-runtime)\1/g,
        (_match: string, quote: string, entry: string) => `from ${quote}${normalizedRuntime}/server-${entry}${quote}`,
      )
    },
  }
}
