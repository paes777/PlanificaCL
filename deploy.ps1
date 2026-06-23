# Script de Despliegue Automatizado para PlanificaCL

$pythonPath = "C:\Users\Oscar\AppData\Local\Programs\Python\Python312\python.exe"
$gitPath = "C:\Program Files\Git\cmd\git.exe"
$firebasePath = "C:\Users\Oscar\AppData\Roaming\npm\firebase.cmd"

# Añadir Node al Path temporalmente por seguridad
$env:PATH += ";C:\Program Files\nodejs"

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "    DESPLIEGUE AUTOMATIZADO DE PLANIFICACL   " -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# 1. Autenticación en Firebase
Write-Host "[1/4] Iniciando sesión en Firebase..." -ForegroundColor Yellow
Write-Host "Sigue las instrucciones en la consola: copia la URL si no se abre sola, inicia sesión y luego ingresa el código de Google aquí." -ForegroundColor Cyan
& $firebasePath login --no-localhost

if ($LASTEXITCODE -ne 0) {
    Write-Error "Error al iniciar sesión en Firebase. Despliegue cancelado."
    Exit
}

# 2. Configurar Proyecto Firebase
Write-Host ""
Write-Host "[2/4] Vinculando con tu proyecto Firebase..." -ForegroundColor Yellow
& $firebasePath use planificacl

# Si falla por no estar agregado, agregarlo
if ($LASTEXITCODE -ne 0) {
    Write-Host "Vinculando proyecto por primera vez..." -ForegroundColor Gray
    & $firebasePath use --add planificacl
}

# 3. Desplegar en Firebase Hosting
Write-Host ""
Write-Host "[3/4] Desplegando en Firebase Hosting (¡Tu Web en Internet!)..." -ForegroundColor Yellow
& $firebasePath deploy

if ($LASTEXITCODE -ne 0) {
    Write-Error "Error al desplegar en Firebase Hosting."
    Exit
}

Write-Host ""
Write-Host "¡WEB DESPLEGADA CON ÉXITO!" -ForegroundColor Green
Write-Host "Tu aplicación web ya está disponible en: https://planificacl.web.app" -ForegroundColor Green
Write-Host ""

# 4. Vincular y Subir a GitHub
Write-Host "[4/4] Configurando repositorio en GitHub..." -ForegroundColor Yellow
$githubUser = "paes777"

if ($githubUser) {
    # Eliminar origin anterior si existe
    & $gitPath remote remove origin 2>$null
    
    # Agregar origin
    $repoUrl = "https://github.com/$githubUser/PlanificaCL.git"
    Write-Host "Vinculando a: $repoUrl" -ForegroundColor Gray
    & $gitPath remote add origin $repoUrl
    
    # Subir código
    Write-Host "Subiendo código a GitHub (puede pedir tu autenticación)..." -ForegroundColor Gray
    & $gitPath push -u origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "¡Código subido a GitHub correctamente!" -ForegroundColor Green
    } else {
        Write-Warning "No se pudo completar el push a GitHub de forma automática. Es posible que debas autenticarte en tu terminal con 'git push'."
    }
}

Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "¡Proceso finalizado! Ingresa a tu web: https://planificacl.web.app" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Read-Host "Presiona Enter para cerrar..."
