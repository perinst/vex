# Starts the Understand Anything dashboard for this repository's knowledge graph.
# Usage: pwsh -File .ua\run-dashboard.ps1 [-Port 5173]
# Override the plugin location with $env:UA_PLUGIN_ROOT if it is installed elsewhere.

param(
    [int]$Port = 55817
)

$ErrorActionPreference = "Stop"

$projectDir = Split-Path -Parent $PSScriptRoot
$graph = Join-Path $projectDir ".ua\knowledge-graph.json"
if (-not (Test-Path $graph)) {
    Write-Error "No knowledge graph found at $graph. Run /understand first."
    exit 1
}

$pluginRoot = $env:UA_PLUGIN_ROOT
if (-not $pluginRoot) {
    $pluginRoot = "c:\Users\ADIMN\.vscode\agent-plugins\github.com\Egonex-AI\Understand-Anything\understand-anything-plugin"
}
$dashboardDir = Join-Path $pluginRoot "packages\dashboard"
if (-not (Test-Path $dashboardDir)) {
    Write-Error "Dashboard not found at $dashboardDir. Set UA_PLUGIN_ROOT to the plugin root."
    exit 1
}

if (-not (Test-Path (Join-Path $dashboardDir "node_modules"))) {
    Push-Location $dashboardDir
    pnpm install
    Pop-Location
}

$env:GRAPH_DIR = $projectDir
Push-Location $dashboardDir
try {
    npx vite --host 127.0.0.1 --port $Port
} finally {
    Pop-Location
}
