$env:PATH += ";C:\Program Files\nodejs"
cd C:\Users\Oscar\.gemini\antigravity\scratch\PlanificadorDocente
Clear-Host

Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "    DESPLIEGUE A FIREBASE HOSTING - PLANIFICACL      " -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Por favor, pega el codigo de Firebase que copiaste del navegador." -ForegroundColor Yellow
Write-Host "(Puedes pegarlo usando Ctrl+V o haciendo clic derecho aqui abajo)" -ForegroundColor Gray
Write-Host ""

$codigo = Read-Host "Codigo de Firebase"

if ($codigo) {
    # Guardar temporalmente en un script de Node para hacer el login con bypass de TTY
    $jsCode = @"
const path = require('path');
const Module = require('module');
const code = "$codigo".trim();

const originalRequire = Module.prototype.require;
Module.prototype.require = function(id) {
    const exports = originalRequire.apply(this, arguments);
    if (id === '@inquirer/prompts' || id.includes('node_modules/@inquirer/prompts') || id.includes('node_modules\\@inquirer\\prompts')) {
        return {
            Separator: exports.Separator,
            input: async () => code,
            confirm: async () => true,
            select: async (opts) => opts.default || '',
            checkbox: async (opts) => opts.default || [],
            number: async (opts) => opts.default || 0,
            password: async () => '',
            search: async () => ''
        };
    }
    return exports;
};

const firebaseToolsPath = path.join(process.env.APPDATA, 'npm', 'node_modules', 'firebase-tools');
const firebase = require(firebaseToolsPath);

firebase.login({ localhost: false, reauth: true, interactive: true, nonInteractive: false })
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
"@
    Set-Content -Path "temp_login.js" -Value $jsCode
    
    Write-Host ""
    Write-Host "Iniciando sesion en Firebase..." -ForegroundColor Gray
    node temp_login.js
    $loginResult = $LASTEXITCODE
    Remove-Item "temp_login.js" -ErrorAction SilentlyContinue
    
    if ($loginResult -eq 0) {
        Write-Host "¡Sesion iniciada correctamente!" -ForegroundColor Green
        
        Write-Host ""
        Write-Host "Configurando proyecto Firebase..." -ForegroundColor Yellow
        & "C:\Users\Oscar\AppData\Roaming\npm\firebase.cmd" use planificacl
        
        Write-Host ""
        Write-Host "Desplegando en Firebase Hosting..." -ForegroundColor Yellow
        & "C:\Users\Oscar\AppData\Roaming\npm\firebase.cmd" deploy
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "=====================================================" -ForegroundColor Green
            Write-Host " ¡APLICACION WEB DESPLEGADA EXITOSAMENTE! " -ForegroundColor Green
            Write-Host " Ya puedes ver tu app en: https://planificacl.web.app " -ForegroundColor Green
            Write-Host "=====================================================" -ForegroundColor Green
        } else {
            Write-Host "Hubo un error al desplegar los archivos." -ForegroundColor Red
        }
    } else {
        Write-Host "Error al iniciar sesion. Asegurate de que el codigo sea el correcto y no haya expirado." -ForegroundColor Red
    }
} else {
    Write-Host "No ingresaste ningun codigo de autorizacion." -ForegroundColor Red
}

Write-Host ""
Write-Host "Presiona cualquier tecla para cerrar esta ventana..."
Read-Host
