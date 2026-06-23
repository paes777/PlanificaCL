# Script de compilación para PlanificaCL

$pythonPath = "C:\Users\Oscar\AppData\Local\Programs\Python\Python312\python.exe"
$pyinstallerPath = "C:\Users\Oscar\AppData\Local\Programs\Python\Python312\Scripts\pyinstaller.exe"

Write-Host "Iniciando compilación de PlanificaCL..." -ForegroundColor Cyan

# 1. Asegurar que estamos en el directorio correcto
$currentDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $currentDir
Write-Host "Directorio de trabajo: $currentDir" -ForegroundColor Yellow

# 2. Instalar requerimientos locales si faltan
Write-Host "Verificando dependencias de Python..." -ForegroundColor Yellow
& $pythonPath -m pip install -r requirements.txt

# 3. Compilar usando PyInstaller
Write-Host "Ejecutando PyInstaller para crear el ejecutable local..." -ForegroundColor Yellow
& $pyinstallerPath --onefile --console --add-data "curriculum.json;." --add-data "templates;templates" --add-data "static;static" --name "PlanificaCL" app.py

if ($LASTEXITCODE -eq 0) {
    Write-Host "¡Compilación exitosa! Tu aplicación local se encuentra en: $currentDir\dist\PlanificaCL.exe" -ForegroundColor Green
    Write-Host "Copiando archivo curriculum.json para desarrollo local si es necesario..." -ForegroundColor Gray
} else {
    Write-Error "Ocurrió un error al compilar con PyInstaller."
}
