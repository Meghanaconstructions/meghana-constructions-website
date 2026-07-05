$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$timestamp = Get-Date -Format 'yyyyMMddHHmmss'
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$htmlFiles = Get-ChildItem -Path $projectRoot -Filter '*.html' -File

foreach ($file in $htmlFiles) {
    $content = [System.IO.File]::ReadAllText($file.FullName)
    $updatedContent = [regex]::Replace(
        $content,
        '(?<=(?:href|src)=["''])style\.css(?:\?v=[^"'']*)?(?=["''])',
        "style.css?v=$timestamp"
    )
    $updatedContent = [regex]::Replace(
        $updatedContent,
        '(?<=(?:href|src)=["''])script\.js(?:\?v=[^"'']*)?(?=["''])',
        "script.js?v=$timestamp"
    )

    if ($updatedContent -ne $content) {
        [System.IO.File]::WriteAllText($file.FullName, $updatedContent, $utf8NoBom)
        Write-Host "Updated $($file.Name)"
    }
}

Push-Location $projectRoot
try {
    & git add .
    & git commit -m "Update website files"
    & git push origin main
}
finally {
    Pop-Location
}
