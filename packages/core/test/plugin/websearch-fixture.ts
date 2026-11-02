import { Effect, Layer } from "effect"
import { HttpClient, HttpClientResponse } from "effect/http"
import { AppNodeBuilder } from "@vex/core/effect/app-node-builder"
import { LayerNode } from "@vex/util/effect/layer-node"
import { Credential } from "@vex/core/credential"
import { Config } from "@vex/core/config"
import { Bus } from "@vex/core/bus"
import { Form } from "@vex/core/form"
import { Integration } from "@vex/core/integration"
import { WebSearch } from "@vex/core/websearch"
import { testEffect } from "../lib/effect"

interface WebSearchRequest {
  readonly url: string
  readonly headers: Record<string, string>
  readonly body: unknown
}

export const requests: WebSearchRequest[] = []
export const signals: AbortSignal[] = []
let responseBody = ""
let responseStatus = 200

export function resetWebSearchFixture(body: string, status = 200) {
  requests.length = 0
  signals.length = 0
  responseBody = body
  responseStatus = status
}

const http = Layer.succeed(
  HttpClient.HttpClient,
  HttpClient.make((request, _url, signal) =>
    Effect.sync(() => {
      signals.push(signal)
      if (request.body._tag !== "Uint8Array") throw new Error(`Unexpected request body: ${request.body._tag}`)
      requests.push({
        url: request.url,
        headers: request.headers,
        body: JSON.parse(new TextDecoder().decode(request.body.body)),
      })
      return HttpClientResponse.fromWeb(request, new Response(responseBody, { status: responseStatus }))
    }),
  ),
)

export const webSearchIntegrationTest = testEffect(
  Layer.merge(
    AppNodeBuilder.build(LayerNode.group([Integration.node, Credential.node, Bus.node, Form.node, WebSearch.node]), [
      Config.node.replace(Config.testLayer()),
    ]),
    http,
  ),
)
