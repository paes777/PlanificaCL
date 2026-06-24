$env:PATH += ";C:\Program Files\nodejs"
# Iniciar firebase login en un cmd con título único
$process = Start-Process -FilePath "cmd.exe" -ArgumentList "/k title UNIQUEFIREBASELOGINWINDOW && `"C:\Users\Oscar\AppData\Roaming\npm\firebase.cmd`" login --no-localhost" -PassThru -WindowStyle Normal

# Esperar a que se cargue
Start-Sleep -Seconds 5

$wshell = New-Object -ComObject Wscript.Shell
$code = "4/0AdkVLPy52mXUbCt-FBdeVJkdI95ScwbUGXndUyp1_JmSE5mumHPpgDENCMHTwr9_1tgRqA"

# Activar la ventana con el título único
if ($wshell.AppActivate("UNIQUEFIREBASELOGINWINDOW")) {
    Start-Sleep -Milliseconds 500
    # Enviar el código y presionar Enter (~)
    $wshell.SendKeys($code + "~")
    Set-Content -Path "C:\Users\Oscar\PlanificaCL_auth_status.txt" -Value "Codigo enviado a la ventana UNIQUEFIREBASELOGINWINDOW"
} else {
    # Intentar también por PID
    if ($wshell.AppActivate($process.Id)) {
        Start-Sleep -Milliseconds 500
        $wshell.SendKeys($code + "~")
        Set-Content -Path "C:\Users\Oscar\PlanificaCL_auth_status.txt" -Value "Codigo enviado por PID del proceso cmd"
    } else {
        Set-Content -Path "C:\Users\Oscar\PlanificaCL_auth_status.txt" -Value "No se pudo activar la ventana UNIQUEFIREBASELOGINWINDOW"
    }
}
