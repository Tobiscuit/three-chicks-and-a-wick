# print-auth-tree.ps1
# This script generates an ASCII tree of the project structure, 
# focusing only on the files relevant to the customer authentication flow.

# Define the relevant file paths relative to the project root
$relevantFiles = @(
    ".env.local",
    "src/app/api/auth/[...shopify]/route.ts",
    "src/app/api/customer/orders/route.ts",
    "src/app/account/page.tsx",
    "src/lib/constants.ts"
)

# --- Script Body ---

Write-Host "Project Root: $(Get-Location | Split-Path -Leaf)"

# Create a sorted, structured list of paths
$sortedPaths = $relevantFiles | ForEach-Object { $_.Replace('/', '\') } | Sort-Object

# Initialize variables for tree generation
$lastParts = @()
$output = @()

foreach ($path in $sortedPaths) {
    $parts = $path.Split('\')
    $currentPath = ""
    
    for ($i = 0; $i -lt $parts.Length; $i++) {
        $part = $parts[$i]
        $isLast = ($i -eq $parts.Length - 1)
        
        $indent = ""
        for ($j = 0; $j -lt $i; $j++) {
            if ($j -lt $lastParts.Count -and $lastParts[$j]) {
                $indent += "    "
            } else {
                $indent += "│   "
            }
        }

        if ($i -gt 0) {
            $parentPath = $parts[0..($i-1)] -join '\'
            $siblings = $sortedPaths | Where-Object { $_.StartsWith("$parentPath\") -and ($_.Split('\').Length -eq $i + 1) }
            $isLastSibling = ($siblings[-1] -eq ($parts[0..$i] -join '\'))
        } else {
            $siblings = $sortedPaths | Where-Object { $_.Split('\').Length -eq 1 }
            $isLastSibling = ($siblings[-1] -eq $part)
        }
        
        if ($isLastSibling) {
            $prefix = "└── "
            if ($i -lt $lastParts.Count) { $lastParts[$i] = $true } else { $lastParts.Add($true) }
        } else {
            $prefix = "├── "
            if ($i -lt $lastParts.Count) { $lastParts[$i] = $false } else { $lastParts.Add($false) }
        }

        # Check if this part of the path has been added already
        $fullPartPath = ($parts[0..$i] -join '\')
        if (-not ($output -join "`n").Contains($fullPartPath)) {
             $line = "$indent$prefix$part"
             # Only add unique lines to the output
             if ($output -notcontains $line.Trim()) {
                 $output += $line
             }
        }
    }
}

# Manually build the tree structure from the relevant files to avoid duplicates
$tree = @{}
$relevantFiles | ForEach-Object {
    $path = $_
    $currentLevel = $tree
    $parts = $path.Split('/')
    foreach ($part in $parts) {
        if (-not $currentLevel.ContainsKey($part)) {
            $currentLevel[$part] = @{}
        }
        $currentLevel = $currentLevel[$part]
    }
}

function Print-Tree {
    param(
        $level,
        $indent = "",
        $isLast = $true
    )
    
    $keys = $level.Keys | Sort-Object
    $count = $keys.Count
    $i = 0

    foreach ($key in $keys) {
        $i++
        $isCurrentLast = ($i -eq $count)
        $prefix = if ($isLast) { "    " } else { "│   " }
        $connector = if ($isCurrentLast) { "└── " } else { "├── " }
        
        Write-Host "$indent$connector$key"
        
        $childIndent = "$indent$prefix"
        Print-Tree -level $level[$key] -indent $childIndent -isLast $isCurrentLast
    }
}

Write-Host "."
Print-Tree -level $tree
