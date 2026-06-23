@echo off
title Despliegue de PlanificaCL
echo Iniciando proceso de despliegue en Firebase y GitHub...
powershell -ExecutionPolicy Bypass -File "%~dp0deploy.ps1"
pause
