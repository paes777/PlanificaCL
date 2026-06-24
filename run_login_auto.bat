@echo off
title Firebase Auto Login
cd /d C:\Users\Oscar\.gemini\antigravity\scratch\PlanificadorDocente
set PATH=C:\Program Files\nodejs;%PATH%

echo Preparando envio automatico del codigo de autorizacion con foco en consola...
start /b powershell.exe -Command "$parentPid = (Get-CimInstance Win32_Process -Filter 'ProcessId = $PID').ParentProcessId; $ws = New-Object -ComObject Wscript.Shell; Start-Sleep -Seconds 5; [void]$ws.AppActivate($parentPid); Start-Sleep -Milliseconds 500; $ws.SendKeys('4/0AdkVLPy52mXUbCt-FBdeVJkdI95ScwbUGXndUyp1_JmSE5mumHPpgDENCMHTwr9_1tgRqA~')"

echo.
echo Iniciando Firebase CLI...
"C:\Users\Oscar\AppData\Roaming\npm\firebase.cmd" login --no-localhost
