declare const OPENCODE_CLI_NAME: string | undefined

export const CLI_NAME =
  process.env.VEX_CLI_ENTRY === "1"
    ? "vex"
    : typeof OPENCODE_CLI_NAME === "string"
      ? OPENCODE_CLI_NAME
      : "opencode"
