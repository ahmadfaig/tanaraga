$projectRoot = Split-Path -Parent $PSScriptRoot
$cssHash = (Get-FileHash -Algorithm SHA256 (Join-Path $projectRoot "styles.css")).Hash.Substring(0, 12).ToLower()
$jsHash = (Get-FileHash -Algorithm SHA256 (Join-Path $projectRoot "app.js")).Hash.Substring(0, 12).ToLower()

Get-ChildItem -Path $projectRoot -Filter "*.html" | ForEach-Object {
  $content = Get-Content -Raw $_.FullName
  $content = $content -replace 'styles\.css\?v=[^"'']+', "styles.css?v=$cssHash"
  $content = $content -replace 'app\.js\?v=[^"'']+', "app.js?v=$jsHash"
  Set-Content -NoNewline -Path $_.FullName -Value $content
}

Write-Output "Updated CSS hash: $cssHash"
Write-Output "Updated JS hash: $jsHash"
