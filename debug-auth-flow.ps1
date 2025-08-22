# debug-auth-flow.ps1
# This script gathers the three key files for debugging the Shopify Headless customer authentication flow.
# Run this script and provide the full output to Shopify support.

function Print-FileContent {
    param (
        [string]$FilePath
    )
    $fullPath = Join-Path $PSScriptRoot $FilePath
    Write-Host "=============================================================================="
    Write-Host "FILE: $FilePath"
    Write-Host "=============================================================================="
    if (Test-Path $fullPath) {
        Get-Content $fullPath | Write-Host
    } else {
        Write-Host "File not found: $fullPath"
    }
    Write-Host "`n"
}

Write-Host "******************************************************************************"
Write-Host "*         SHOPIFY HEADLESS AUTHENTICATION FLOW DEBUG INFORMATION             *"
Write-Host "******************************************************************************`n"

Write-Host "--- ENVIRONMENT VARIABLES (.env.local) ---"
Write-Host "(IMPORTANT: Please redact any sensitive values like secrets or tokens before sharing this output)"
Print-FileContent -FilePath ".env.local"

Write-Host "--- AUTHENTICATION API ROUTE ---"
Print-FileContent -FilePath "src/app/api/auth/[...shopify]/route.ts"

Write-Host "--- ORDER FETCHING API ROUTE ---"
Print-FileContent -FilePath "src/app/api/customer/orders/route.ts"

Write-Host "******************************************************************************"
Write-Host "*                          END OF DEBUG INFORMATION                          *"
Write-Host "******************************************************************************`n"
