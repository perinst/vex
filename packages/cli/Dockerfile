FROM alpine AS base

ARG BUN_RUNTIME_TRANSPILER_CACHE_PATH=0
ENV BUN_RUNTIME_TRANSPILER_CACHE_PATH=${BUN_RUNTIME_TRANSPILER_CACHE_PATH}
RUN apk add --no-cache libgcc libstdc++ ripgrep

FROM base AS build-amd64
COPY dist/cli-linux-x64-baseline-musl/bin/opencode /usr/local/bin/opencode

FROM base AS build-arm64
COPY dist/cli-linux-arm64-musl/bin/opencode /usr/local/bin/opencode

ARG TARGETARCH
FROM build-${TARGETARCH}
RUN ln -s opencode /usr/local/bin/opencode2 \
  && printf '#!/bin/sh\nVEX_CLI_ENTRY=1 exec /usr/local/bin/opencode "$@"\n' > /usr/local/bin/vex \
  && chmod +x /usr/local/bin/vex \
  && opencode --version \
  && opencode2 --version \
  && vex --version
ENTRYPOINT ["vex"]
