@echo off
title Despliegue Automatizado - PlanificaCL
color 0b
cd /d C:\Users\Oscar\.gemini\antigravity\scratch\PlanificadorDocente
echo ========================================================
echo   INICIANDO CONFIGURACION Y DESPLIEGUE DE PLANIFICACL
echo ========================================================
echo.
echo Este script realizara las siguientes operaciones:
echo 1. Subir el codigo actual al repositorio GitHub (paes777/PlanificaCL).
echo 2. Autenticar y desplegar la aplicacion en Firebase Hosting.
echo.
echo.
echo ========================================================
echo PASO 1: Subiendo codigo a GitHub...
echo ========================================================
"C:\Program Files\Git\cmd\git.exe" push -u origin main
echo.
echo ========================================================
echo PASO 2: Iniciando sesion en Firebase (Metodo Seguro)...
echo ========================================================
echo Se generara un enlace de Google en la pantalla.
echo Abre ese enlace en tu navegador, inicia sesion con tu cuenta de Google,
echo copia el codigo de autorizacion que te dara y pegalo aqui abajo.
echo.
"C:\Users\Oscar\AppData\Roaming\npm\firebase.cmd" login --no-localhost
echo.
echo ========================================================
echo PASO 3: Configurando proyecto Firebase...
echo ========================================================
"C:\Users\Oscar\AppData\Roaming\npm\firebase.cmd" use planificacl
echo.
echo ========================================================
echo PASO 4: Desplegando en Firebase Hosting...
echo ========================================================
"C:\Users\Oscar\AppData\Roaming\npm\firebase.cmd" deploy
echo.
echo ========================================================
echo PROCESO COMPLETADO
echo ========================================================
echo Si todo fue exitoso, ya puedes ver tu web en:
echo https://planificacl.web.app
echo.
pause
