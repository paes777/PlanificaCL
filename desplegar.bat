@echo off
title Desplegar PlanificaCL
color 0b
cd /d C:\Users\Oscar\.gemini\antigravity\scratch\PlanificadorDocente
set PATH=C:\Program Files\nodejs;%PATH%
set NODE_TLS_REJECT_UNAUTHORIZED=0

echo ========================================================
echo   INICIANDO DESPLIEGUE DE PLANIFICACL
echo ========================================================
echo.

node local_login.js
if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERROR] No se pudo iniciar sesion en Firebase.
    goto end
)

echo.
echo ========================================================
echo PASO 2: Configurando proyecto Firebase...
echo ========================================================
call "C:\Users\Oscar\AppData\Roaming\npm\firebase.cmd" use planificacl

echo.
echo ========================================================
echo PASO 3: Desplegando en Firebase Hosting...
echo ========================================================
call "C:\Users\Oscar\AppData\Roaming\npm\firebase.cmd" deploy

if %ERRORLEVEL% eq 0 (
    echo.
    echo ========================================================
    echo   DESPLIEGUE COMPLETADO CON EXITO
    echo ========================================================
    echo Tu web ya esta disponible en: https://planificacl.web.app
) else (
    echo.
    echo [ERROR] Hubo un problema al desplegar.
)

:end
echo.
pause
