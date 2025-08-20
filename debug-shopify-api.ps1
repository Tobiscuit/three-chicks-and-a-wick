# PowerShell script to debug the Shopify Customer Account API call

# --- Step 1: Paste the latest access token here ---
# Get this from your Next.js terminal logs after a fresh login attempt.
# It must start with "shcat_".
$accessToken = "shcat_eyJraWQiOiIwIiwiYWxnIjoiRUQyNTUxOSJ9.eyJzaG9wSWQiOjcxMjI1MjEzMTE3LCJjaWQiOiI3ZTA2OTNkMC1iNThkLTQwNzItOTU1MC0wODU0YmM1OTIxZWMiLCJpYXQiOjE3NTU2NDI0OTAsImV4cCI6MTc1NTY0NjA5MCwiaXNzIjoiaHR0cHM6XC9cL3Nob3BpZnkuY29tXC9hdXRoZW50aWNhdGlvblwvNzEyMjUyMTMxMTciLCJzdWIiOjgyNTcxNzYyMDc1NDksInNjb3BlIjoib3BlbmlkIGVtYWlsIGN1c3RvbWVyLWFjY291bnQtYXBpOmZ1bGwiLCJydGlkIjoiMDE5OGM0NzItNmZiOS0zMTIxLTU1NDItODYzNmIzOTEzZWMxIiwic2lkIjoiMDFLMzI3NFZINjA0TjBIUUpSN0dLN0cxSkYifQ.C7EcLzIlAZZR-Ag1vvDomcQxfoK2oWwWC4D8GGRTpQYueIR1-eTN4GD9Fg9a0P7EhSbg0UdkRLVYmjdLUIr0Dw"

# --- Script configuration (should not need to change) ---
$shopId = "71225213117" # Your Shopify Customer Account API App ID
$apiVersion = "2025-07"
$endpoint = "https://shopify.com/$shopId/account/customer/api/$apiVersion/graphql"
$originUrl = "https://8e46495bd9ad.ngrok-free.app" # Your ngrok URL

# The GraphQL query to fetch customer data
$query = @"
query getCustomer {
  customer {
    id
    firstName
    lastName
    emailAddress {
      emailAddress
    }
    phoneNumber {
      phoneNumber
    }
  }
}
"@

# Construct the request headers
$headers = @{
    "Content-Type"  = "application/json"
    "Authorization" = "Bearer $accessToken"
    "Origin"        = $originUrl
}

# Construct the request body
$body = @{
    "query" = $query
} | ConvertTo-Json

# --- Step 2: Run the script from your terminal ---
# Open PowerShell, navigate to your project directory, and run: ./debug-shopify-api.ps1

Write-Host "Sending GraphQL request to Shopify..."
Write-Host "Endpoint: $endpoint"
Write-Host "-------------------------------------"

try {
    # Make the API call using Invoke-WebRequest for better error stream control
    $response = Invoke-WebRequest -Uri $endpoint -Method Post -Headers $headers -Body $body -UseBasicParsing
    
    Write-Host "✅ API Call Successful!"
    Write-Host "Response:"
    # Manually convert the JSON content from the response
    Write-Output $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 5
}
catch {
    Write-Host "❌ API Call Failed!"
    $errorResponse = $_.Exception.Response
    
    if ($null -ne $errorResponse) {
        $requestId = ""
        if ($errorResponse.Headers.Contains("x-request-id")) {
            $requestId = $errorResponse.Headers.GetValues("x-request-id") | Select-Object -First 1
        }
        
        Write-Host "Status Code: $([int]$errorResponse.StatusCode)"
        Write-Host "Request ID (x-request-id): $requestId"

        # Correct method to read the body from HttpResponseMessage
        $errorBody = $errorResponse.Content.ReadAsStringAsync().GetAwaiter().GetResult()
        Write-Host "Response Body:"
        Write-Host $errorBody

        Write-Host "-------------------------------------"
        Write-Host "Full Response Headers:"
        foreach ($header in $errorResponse.Headers) {
            Write-Host "$($header.Key): $($header.Value -join ', ')"
        }

    } else {
        Write-Host "An error occurred that did not involve an HTTP response."
        Write-Host $_.Exception.Message
    }
}
