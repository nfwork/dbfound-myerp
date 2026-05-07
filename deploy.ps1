[CmdletBinding()]
param(
    [string]$Mode = "all",
    [string]$BackendDeployPath = "D:\dbfound\webapps\dbfound",
    [string]$WeaccDeployPath = "D:\dbfound\webapps\dbfound\weacc",
    [switch]$OnlyWeacc,
    [switch]$OnlyBackend,
    [switch]$SkipNpmInstall,
    [switch]$InstallDeps,
    [switch]$SkipMavenClean
)

$ErrorActionPreference = "Stop"

$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$WeaccRoot = Join-Path $ProjectRoot "weacc"
$TargetDir = Join-Path $ProjectRoot "target"

switch ($Mode.ToLower()) {
    "all" {}
    "api" { $OnlyBackend = $true }
    "backend" { $OnlyBackend = $true }
    "weacc" { $OnlyWeacc = $true }
    default {
        throw "Unsupported deploy mode '$Mode'. Use one of: all, api, weacc."
    }
}

function Write-Step {
    param($Message)
    Write-Host ""
    Write-Host "==> $Message" -ForegroundColor Cyan
}

function Assert-Command {
    param($Name)
    if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
        throw "Command '$Name' was not found. Please install it or add it to PATH."
    }
}

function Invoke-NativeCommand {
    param(
        $Command,
        $Arguments
    )

    & $Command @Arguments
    if ($LASTEXITCODE -ne 0) {
        $ArgumentText = [string]::Join(" ", $Arguments)
        $CommandLine = "$Command $ArgumentText"
        throw "Command '$CommandLine' failed with exit code $LASTEXITCODE."
    }
}

function Clear-Directory {
    param($Path)
    if (Test-Path -LiteralPath $Path) {
        Get-ChildItem -LiteralPath $Path -Force | Remove-Item -Recurse -Force
        return
    }

    New-Item -ItemType Directory -Path $Path -Force | Out-Null
}

function Clear-DirectoryExcept {
    param(
        $Path,
        $ExcludeNames
    )

    if (-not (Test-Path -LiteralPath $Path)) {
        New-Item -ItemType Directory -Path $Path -Force | Out-Null
        return
    }

    Get-ChildItem -LiteralPath $Path -Force |
        Where-Object { $ExcludeNames -notcontains $_.Name } |
        Remove-Item -Recurse -Force
}

function Copy-DirectoryContents {
    param(
        $Source,
        $Destination
    )

    if (-not (Test-Path -LiteralPath $Destination)) {
        New-Item -ItemType Directory -Path $Destination -Force | Out-Null
    }

    Get-ChildItem -LiteralPath $Source -Force | Copy-Item -Destination $Destination -Recurse -Force
}

Write-Step "Checking required commands"
if (-not $OnlyWeacc) {
    Assert-Command "mvn"
}
if (-not $OnlyBackend) {
    Assert-Command "npm"
}

if (-not $OnlyWeacc) {
    Write-Step "Building backend WAR"
    Push-Location $ProjectRoot
    try {
        if (-not $SkipMavenClean) {
            Write-Step "Running mvn clean"
            Invoke-NativeCommand "mvn" @("clean")
        }

        Write-Step "Running mvn package"
        Invoke-NativeCommand "mvn" @("package")
    }
    finally {
        Pop-Location
    }

    $WarFile = Get-ChildItem -LiteralPath $TargetDir -Filter "*.war" |
        Sort-Object LastWriteTime -Descending |
        Select-Object -First 1

    if (-not $WarFile) {
        throw "No WAR file was found in '$TargetDir'."
    }

    Write-Step "Deploying backend to $BackendDeployPath"
    if ($OnlyBackend) {
        Clear-DirectoryExcept $BackendDeployPath @("weacc")
    }
    else {
        Clear-Directory $BackendDeployPath
    }
    $TempPath = [System.IO.Path]::GetTempPath()
    $TempFileName = "dbfound-myerp-" + [System.Guid]::NewGuid().ToString() + ".zip"
    $TempWarZip = Join-Path $TempPath $TempFileName
    try {
        Copy-Item -LiteralPath $WarFile.FullName -Destination $TempWarZip -Force
        Expand-Archive -LiteralPath $TempWarZip -DestinationPath $BackendDeployPath -Force
    }
    finally {
        if (Test-Path -LiteralPath $TempWarZip) {
            Remove-Item -LiteralPath $TempWarZip -Force
        }
    }
}

if (-not $OnlyBackend) {
    Write-Step "Building weacc"
    Push-Location $WeaccRoot
    try {
        $NodeModulesPath = Join-Path $WeaccRoot "node_modules"
        $NeedInstallDeps = (-not $SkipNpmInstall) -and (-not (Test-Path -LiteralPath $NodeModulesPath))
        if ($InstallDeps) {
            Write-Step "Installing weacc dependencies"
            Invoke-NativeCommand "npm" @("install")
        }
        elseif ($NeedInstallDeps) {
            Write-Step "Installing weacc dependencies because node_modules is missing"
            Invoke-NativeCommand "npm" @("install")
        }

        Invoke-NativeCommand "npm" @("run", "build")
    }
    finally {
        Pop-Location
    }

    $WeaccDist = Join-Path $WeaccRoot "dist"
    if (-not (Test-Path -LiteralPath $WeaccDist)) {
        throw "weacc build output was not found in '$WeaccDist'."
    }

    Write-Step "Deploying weacc to $WeaccDeployPath"
    Clear-Directory $WeaccDeployPath
    Copy-DirectoryContents $WeaccDist $WeaccDeployPath
}

Write-Step "Deploy completed"
if (-not $OnlyWeacc) {
    Write-Host "Backend: $BackendDeployPath"
}
if (-not $OnlyBackend) {
    Write-Host "weacc:   $WeaccDeployPath"
}
