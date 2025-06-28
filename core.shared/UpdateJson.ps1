param (
    [string]$FilePath,
    [string]$Key,
    [string]$Value
)

# Write-Host "FilePath: $FilePath"
# Write-Host "Key: $Key"
# Write-Host "Value: $Value"

# Extraire les trois premiers segments de la version
$shortVersion = ($Value -split '\.')[0..2] -join '.'

# Write-Host "Short Version: $shortVersion"

if (Test-Path $FilePath) {
    # Write-Host "File exists. Reading content..."
    $json = Get-Content $FilePath -Raw | ConvertFrom-Json
} else {
    # Write-Host "File does not exist. Creating new JSON object..."
    $json = [PSCustomObject]@{}
}

$json | Add-Member -MemberType NoteProperty -Name $Key -Value $shortVersion -Force

# Write-Host "Updated JSON content:"
$json | ConvertTo-Json -Depth 10

$json | ConvertTo-Json -Depth 10 | Set-Content $FilePath