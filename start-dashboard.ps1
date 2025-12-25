# 🚀 CRYPTO DASHBOARD - INSTALLATION & STARTUP

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  CRYPTO DASHBOARD - Quick Start" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "1. Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "   ✓ Node.js installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Node.js not found. Please install Node.js 16+ from https://nodejs.org" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Check if in correct directory
Write-Host "2. Checking project directory..." -ForegroundColor Yellow
if (Test-Path "package.json") {
    Write-Host "   ✓ Found package.json" -ForegroundColor Green
} else {
    Write-Host "   ✗ package.json not found. Please run this script from the project root." -ForegroundColor Red
    exit 1
}

Write-Host ""

# Check if node_modules exists
Write-Host "3. Checking dependencies..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "   ✓ Dependencies already installed" -ForegroundColor Green
    $install = Read-Host "   Reinstall dependencies? (y/N)"
    if ($install -eq "y" -or $install -eq "Y") {
        Write-Host "   Installing dependencies..." -ForegroundColor Yellow
        npm install
    }
} else {
    Write-Host "   Installing dependencies (this may take 2-3 minutes)..." -ForegroundColor Yellow
    npm install
    Write-Host "   ✓ Dependencies installed successfully" -ForegroundColor Green
}

Write-Host ""

# Check environment file
Write-Host "4. Checking environment configuration..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "   ✓ .env file exists" -ForegroundColor Green
} else {
    Write-Host "   Creating .env file from template..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "   ✓ .env file created" -ForegroundColor Green
}

Write-Host ""

# Check key files
Write-Host "5. Verifying dashboard files..." -ForegroundColor Yellow
$files = @(
    "dashboard.html",
    "src/CryptoDashboardApp.tsx",
    "src/dashboard-main.tsx"
)

$allFilesExist = $true
foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "   ✓ $file" -ForegroundColor Green
    } else {
        Write-Host "   ✗ $file missing" -ForegroundColor Red
        $allFilesExist = $false
    }
}

if (-not $allFilesExist) {
    Write-Host ""
    Write-Host "   Some files are missing. Please ensure all dashboard files are present." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ✓ ALL CHECKS PASSED!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Ask to start
Write-Host "Ready to start the dashboard!" -ForegroundColor Cyan
Write-Host ""
Write-Host "The dashboard will:" -ForegroundColor White
Write-Host "  • Start on http://localhost:3000" -ForegroundColor Gray
Write-Host "  • Open automatically in your browser" -ForegroundColor Gray
Write-Host "  • Show live crypto market data" -ForegroundColor Gray
Write-Host "  • Support MetaMask wallet connection" -ForegroundColor Gray
Write-Host ""

$start = Read-Host "Start the dashboard now? (Y/n)"
if ($start -ne "n" -and $start -ne "N") {
    Write-Host ""
    Write-Host "Starting dashboard..." -ForegroundColor Cyan
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Yellow
    Write-Host "  Press Ctrl+C to stop the server" -ForegroundColor Yellow
    Write-Host "========================================" -ForegroundColor Yellow
    Write-Host ""
    
    npm run dev
} else {
    Write-Host ""
    Write-Host "To start the dashboard later, run:" -ForegroundColor Cyan
    Write-Host "  npm run dev" -ForegroundColor White
    Write-Host ""
}
