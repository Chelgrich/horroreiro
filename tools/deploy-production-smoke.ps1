$ErrorActionPreference = 'Stop'
$script:fakeSecret = 'fake-deploy-secret-must-not-leak'
$script:fakeRevision = 'bbbbbbbbbbbbbbbbbbbb'
$script:mode = 'success'
$deployArgs = @('--environment', "SUPABASE_SERVICE_ROLE_KEY=$script:fakeSecret")

$tokens = $null
$parseErrors = $null
$deployPath = Join-Path $PSScriptRoot 'deploy-production.ps1'
$ast = [System.Management.Automation.Language.Parser]::ParseFile($deployPath, [ref]$tokens, [ref]$parseErrors)
if ($parseErrors.Count -gt 0) { throw 'Deploy script does not parse' }
foreach ($function in $ast.FindAll({ param($node) $node -is [System.Management.Automation.Language.FunctionDefinitionAst] }, $true)) {
  Invoke-Expression $function.Extent.Text
}
$step = $ast.Find({
  param($node)
  $node -is [System.Management.Automation.Language.CommandAst] -and
    $node.GetCommandName() -eq 'Run-Step' -and
    $node.CommandElements[1].Value -eq 'Deploy production revision'
}, $true)
if (-not $step) { throw 'Deploy revision step is missing' }
$deployStep = $step.CommandElements[2].ScriptBlock.GetScriptBlock()

# Replace only the external CLI; execute the real production deployment step.
function yc {
  $global:LASTEXITCODE = 0
  if ($script:mode -like 'native-*') {
    $nativeCommand = '[Console]::Out.WriteLine("fake-deploy-secret-must-not-leak"); [Console]::Error.WriteLine("fake-deploy-secret-must-not-leak"); exit '
    if ($script:mode -eq 'native-failure') { $nativeCommand += '42' } else { $nativeCommand += '0' }
    $encoded = [Convert]::ToBase64String([Text.Encoding]::Unicode.GetBytes($nativeCommand))
    & (Join-Path $PSHOME 'powershell.exe') -NoProfile -EncodedCommand $encoded
    $global:LASTEXITCODE = $LASTEXITCODE
    return
  } elseif ($script:mode -eq 'failure') {
    $global:LASTEXITCODE = 42
    Write-Error "CLI failure containing $script:fakeSecret"
  } elseif ($script:mode -eq 'throw') {
    throw "Invocation failure containing $script:fakeSecret"
  } elseif ($script:mode -eq 'warning') {
    Write-Warning "CLI warning containing $script:fakeSecret"
  }
  Write-Output ('{{"id":"{0}","environment":{{"SUPABASE_SERVICE_ROLE_KEY":"{1}"}}}}' -f $script:fakeRevision, $script:fakeSecret)
}

foreach ($script:mode in @('success', 'failure', 'throw', 'warning', 'native-success', 'native-failure')) {
  $script:failed = $false
  $captured = @(& {
    try { & $deployStep } catch { $script:failed = $true; Write-Output $_.Exception.Message }
  } *>&1) | Out-String
  if ($captured.Contains($script:fakeSecret)) { throw "Deploy leaked a secret in $script:mode mode" }
  $expectFailure = $script:mode -in @('failure', 'throw', 'native-failure')
  if ($script:failed -ne $expectFailure) { throw "Wrong deploy exit handling in $script:mode mode`: $captured" }
}
Write-Host 'Production deploy output smoke passed (fake secrets only).'
