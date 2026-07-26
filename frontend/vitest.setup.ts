import "@testing-library/jest-dom/vitest"
import { afterEach } from "vitest"
import { cleanup } from "@testing-library/react"

// RTL's automatic per-test cleanup relies on detecting a global afterEach
// (e.g. Jest's), which doesn't exist here since vitest.config.ts doesn't
// enable `globals: true`. Register it explicitly instead.
afterEach(cleanup)
