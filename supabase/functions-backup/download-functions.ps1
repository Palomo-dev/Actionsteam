$functions = @(
    "create-checkout",
    "stripe-webhook",
    "generate-certificate",
    "auto-notifications",
    "send-welcome-notifications",
    "create-stripe-product",
    "update-public-file",
    "generate-with-ai",
    "chat",
    "facebook-events"
)

foreach ($func in $functions) {
    Write-Host "Downloading function: $func"
    New-Item -ItemType Directory -Path ".\$func" -Force
    supabase functions download $func --project-ref upcfokdeubxwjiibapnc --target-dir ".\$func"
}
