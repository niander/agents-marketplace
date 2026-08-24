$script = Join-Path $PSScriptRoot "inject_claude_memory.py"

$py = Get-Command py -CommandType Application -ErrorAction SilentlyContinue
if ($null -ne $py) {
    $null | & $py.Source -3 -c "import sys; raise SystemExit(sys.version_info.major != 3)"
    if ($LASTEXITCODE -eq 0) {
        & $py.Source -3 $script
        if ($LASTEXITCODE -eq 0) {
            exit 0
        }
        if ($LASTEXITCODE -eq 2) {
            exit 2
        }
        [Console]::Error.WriteLine(
            "claude-memory-loader: Python injector exited with status $LASTEXITCODE"
        )
        exit 2
    }
}

$python = Get-Command python -CommandType Application -ErrorAction SilentlyContinue
if ($null -ne $python -and $python.Source -notlike "*\WindowsApps\*") {
    $null | & $python.Source -c "import sys; raise SystemExit(sys.version_info.major != 3)"
    if ($LASTEXITCODE -eq 0) {
        & $python.Source $script
        if ($LASTEXITCODE -eq 0) {
            exit 0
        }
        if ($LASTEXITCODE -eq 2) {
            exit 2
        }
        [Console]::Error.WriteLine(
            "claude-memory-loader: Python injector exited with status $LASTEXITCODE"
        )
        exit 2
    }
}

[Console]::Error.WriteLine(
    "claude-memory-loader: Python 3 was not found; install Python 3 with the py launcher or python on PATH"
)
exit 2
