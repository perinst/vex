import { expect, test } from "bun:test"
import { createForeignPackageFilter } from "../src/runtime"

test("foreign plugin package copies are blocked while host packages remain available", () => {
  const filter = createForeignPackageFilter(["C:/app/node_modules/@vex/plugin"])

  expect(filter.test("C:/app/node_modules/@vex/plugin/src/index.ts")).toBe(false)
  expect(filter.test("C:/plugins/example/node_modules/@vex/plugin/src/index.ts")).toBe(true)
  expect(filter.test("C:/plugins/example/node_modules/@opencode/plugin/src/index.ts")).toBe(true)
  expect(filter.test("C:/plugins/example/node_modules/effect/src/index.ts")).toBe(true)
})
