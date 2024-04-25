[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# Asegura que qualsevol error aturi l'script
$ErrorActionPreference = "Stop"

# Neteja el projecte
Write-Host "Netejant el projecte..."
npm run clean

# Instal·la les dependències
Write-Host "Instal·lant dependències..."
npm install

# Construeix el projecte
Write-Host "Construint el projecte..."
npm run build

# Executa els tests
Write-Host "Executant tests..."
npm run test

Write-Host "Script completat amb èxit!"
