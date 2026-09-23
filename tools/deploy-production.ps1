param(
  [string]$RegistryId = "crp1jhhmf05nkpknvks2",
  [string]$ProductionContainerId = "bbasbracev0l37jj4qdr",
  [string]$ProductionGatewayUrl = "https://d5d0nq3qlmgiogqk1kjo.0ly8ed4d.apigw.yandexcloud.net",
  [string]$ProductionUrl = "https://horroreiro.ru",
  [string]$ProductionWwwUrl = "https://www.horroreiro.ru",
  [string]$EnvFile = "",
  [int]$SmokeRetries = 3,
  [int]$SmokeRetryDelaySeconds = 8
)

$ErrorActionPreference = "Stop"

$ProjectRoot = Split-Path -Parent $PSScriptRoot

if ([string]::IsNullOrWhiteSpace($EnvFile)) {
  $EnvFile = Join-Path $ProjectRoot "deploy\yandex\production.env.local"
}

Set-Location $ProjectRoot

function Run-Step($Label, [scriptblock]$Command) {
  Write-Host "`n==> $Label" -ForegroundColor Cyan
  $global:LASTEXITCODE = 0
  & $Command
  $exitCode = $global:LASTEXITCODE

  if ($exitCode -ne 0) {
    throw "$Label failed with exit code $exitCode"
  }
}

function Assert-CleanWorktree {
  $global:LASTEXITCODE = 0
  $status = @(git status --porcelain)

  if ($global:LASTEXITCODE -ne 0) {
    throw "git status failed with exit code $global:LASTEXITCODE"
  }

  if ($status.Count -gt 0) {
    throw "Working tree is not clean. Commit or stash changes before production deploy."
  }
}

function Read-LocalEnvFile($Path) {
  $values = @{}

  if (-not (Test-Path -LiteralPath $Path)) {
    return $values
  }

  foreach ($rawLine in Get-Content -LiteralPath $Path) {
    $line = [string]$rawLine

    if ([string]::IsNullOrWhiteSpace($line) -or $line.TrimStart().StartsWith("#")) {
      continue
    }

    $match = [regex]::Match($line, '^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$')

    if (-not $match.Success) {
      continue
    }

    $name = $match.Groups[1].Value.Trim()
    $value = $match.Groups[2].Value.Trim()

    if (
      ($value.StartsWith('"') -and $value.EndsWith('"')) -or
      ($value.StartsWith("'") -and $value.EndsWith("'"))
    ) {
      $value = $value.Substring(1, $value.Length - 2)
    }

    $values[$name] = $value
  }

  return $values
}

function Read-SecretFromPrompt($Name) {
  $secure = Read-Host $Name -AsSecureString
  $pointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)

  try {
    return [Runtime.InteropServices.Marshal]::PtrToStringBSTR($pointer)
  } finally {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($pointer)
  }
}

function Get-RequiredDeployValue($Name, $LocalEnvValues, [switch]$Secret) {
  $value = [Environment]::GetEnvironmentVariable($Name, "Process")

  if ([string]::IsNullOrWhiteSpace($value)) {
    $value = [Environment]::GetEnvironmentVariable($Name, "User")
  }

  if ([string]::IsNullOrWhiteSpace($value)) {
    $value = [Environment]::GetEnvironmentVariable($Name, "Machine")
  }

  if ([string]::IsNullOrWhiteSpace($value) -and $LocalEnvValues.ContainsKey($Name)) {
    $value = [string]$LocalEnvValues[$Name]
  }

  if (-not [string]::IsNullOrWhiteSpace($value) -and $value -notmatch '<.*>') {
    return $value
  }

  if ($Secret) {
    return Read-SecretFromPrompt $Name
  }

  return Read-Host $Name
}

function Run-DeployedSmoke($Label, $BaseUrl, $ExpectedVersion) {
  for ($attempt = 1; $attempt -le $SmokeRetries; $attempt += 1) {
    Write-Host "`n==> $Label (attempt $attempt/$SmokeRetries)" -ForegroundColor Cyan
    $global:LASTEXITCODE = 0
    npm run smoke:deployed -- --base-url $BaseUrl --expected-version $ExpectedVersion

    if ($global:LASTEXITCODE -eq 0) {
      return
    }

    if ($attempt -lt $SmokeRetries) {
      Start-Sleep -Seconds $SmokeRetryDelaySeconds
    }
  }

  throw "$Label failed after $SmokeRetries attempts"
}

Assert-CleanWorktree

$localEnvValues = Read-LocalEnvFile $EnvFile
$supabaseUrl = Get-RequiredDeployValue "SUPABASE_URL" $localEnvValues
$supabaseAnonKey = Get-RequiredDeployValue "SUPABASE_ANON_KEY" $localEnvValues
$supabaseServiceRoleKey = Get-RequiredDeployValue "SUPABASE_SERVICE_ROLE_KEY" $localEnvValues -Secret

$image = "cr.yandex/$RegistryId/horroreiro"

Run-Step "Fetch origin" { git fetch origin }
Run-Step "Checkout dev" { git checkout dev }
Run-Step "Pull dev" { git pull origin dev }
Run-Step "Checkout main" { git checkout main }
Run-Step "Pull main" { git pull origin main }
Run-Step "Merge dev into main" { git merge dev }
Run-Step "Push main" { git push origin main }

$version = (git rev-parse HEAD).Trim()

Run-Step "Release preflight" { npm run release:container:preflight -- --expected-version $version }
Run-Step "Portable smoke" { npm run smoke:portable }
Run-Step "Smoke check" { node tools/smoke-check.mjs }
Run-Step "Check Docker engine" { docker version }
Run-Step "Docker auth for Yandex Registry" { yc container registry configure-docker }

Run-Step "Build linux/amd64 image" {
  docker buildx build `
    --platform linux/amd64 `
    --provenance=false `
    --sbom=false `
    --load `
    -t "${image}:${version}" .
}

$imageArchitecture = docker image inspect "${image}:${version}" --format "{{.Os}}/{{.Architecture}}"

if ($imageArchitecture -ne "linux/amd64") {
  throw "Wrong Docker image architecture: $imageArchitecture"
}

Run-Step "Push image" { docker push "${image}:${version}" }

$latestRevision = yc serverless container revision list --container-id $ProductionContainerId --format json |
  ConvertFrom-Json |
  Sort-Object { [datetime]$_.created_at } -Descending |
  Select-Object -First 1

if (-not $latestRevision) {
  throw "Could not find an existing production container revision."
}

$currentRevision = yc serverless container revision get $latestRevision.id --format json | ConvertFrom-Json
$runtimeServiceAccountId = [string]$currentRevision.service_account_id

$revisionEnv = "NODE_ENV=production,HOST=0.0.0.0,APP_BUILD_VERSION=$version,SUPABASE_URL=$supabaseUrl,SUPABASE_ANON_KEY=$supabaseAnonKey,SUPABASE_SERVICE_ROLE_KEY=$supabaseServiceRoleKey"

$deployArgs = @(
  "serverless", "container", "revision", "deploy",
  "--container-id", $ProductionContainerId,
  "--image", "${image}:${version}",
  "--cores", "1",
  "--core-fraction", "100",
  "--memory", "128MB",
  "--concurrency", "1",
  "--execution-timeout", "300s",
  "--runtime", "http",
  "--environment", $revisionEnv,
  "--description", "production $version"
)

if (-not [string]::IsNullOrWhiteSpace($runtimeServiceAccountId)) {
  $deployArgs += @("--service-account-id", $runtimeServiceAccountId)
}

Run-Step "Deploy production revision" { yc @deployArgs }
Run-Step "Keep production container private" { yc serverless container deny-unauthenticated-invoke --id $ProductionContainerId }

Run-DeployedSmoke "Smoke production gateway" $ProductionGatewayUrl $version
Run-DeployedSmoke "Smoke horroreiro.ru" $ProductionUrl $version
Run-DeployedSmoke "Smoke www.horroreiro.ru" $ProductionWwwUrl $version

Run-Step "Checkout dev again" { git checkout dev }
Run-Step "Pull dev again" { git pull origin dev }
Run-Step "Merge main back into dev" { git merge main }
Run-Step "Push dev" { git push origin dev }

Write-Host "`nProduction deploy complete: $version" -ForegroundColor Green
