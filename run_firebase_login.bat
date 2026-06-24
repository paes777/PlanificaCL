@echo off
title Firebase Login Tool
cd /d C:\Users\Oscar\.gemini\antigravity\scratch\PlanificadorDocente
echo ========================================================
echo   INICIANDO INICIO DE SESION EN FIREBASE
echo ========================================================
set PATH=C:\Program Files\nodejs;%PATH%
"C:\Users\Oscar\AppData\Roaming\npm\firebase.cmd" login --no-localhost
