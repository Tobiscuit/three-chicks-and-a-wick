# generate-tree.ps1
function Show-Tree {
    param(
        [string]$Path = '.',
        [string[]]$Exclude = @("node_modules", ".next", ".amplify", ".vscode", "public", "scripts", "stitch", "dist", "build"),
        [string]$Indent = ''
    )
    # Get items, ignoring errors for paths we can't access
    $items = Get-ChildItem -Path $Path -ErrorAction SilentlyContinue | Where-Object { $_.Name -notin $Exclude }
    if ($null -eq $items) { return }

    $lastItem = $items[-1]

    foreach ($item in $items) {
        $isLast = $item.FullName -eq $lastItem.FullName
        # Use safe ASCII characters for tree markers
        $marker = if ($isLast) { '`-- ' } else { '+-- ' }
        
        Write-Output "$Indent$marker$($item.Name)"
        
        if ($item.PSIsContainer) {
            # Use safe ASCII characters for indentation
            $newIndent = if ($isLast) { '    ' } else { '|   ' }
            Show-Tree -Path $item.FullName -Exclude $Exclude -Indent "$Indent$newIndent"
        }
    }
}

Show-Tree 