param(
    [string]$Initials = "TT",
    [string]$BackgroundColor = "#020617",
    [string]$AccentColor = "#0EA5E9",
    [string]$GradientStart = "#38BDF8",
    [string]$GradientEnd = "#0284C7",
    [string]$OutputDir
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing

if (-not $OutputDir) {
    $scriptDir = Split-Path -Parent $PSCommandPath
    $OutputDir = Join-Path $scriptDir "..\public\icons"
}

if (-not (Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir | Out-Null
}

$icons = @(
    [pscustomobject]@{ Name = "icon-192.png"; Size = 192; FontSize = 72; Padding = 0.1 },
    [pscustomobject]@{ Name = "icon-512.png"; Size = 512; FontSize = 200; Padding = 0.12 },
    [pscustomobject]@{ Name = "maskable-icon-512.png"; Size = 512; FontSize = 200; Padding = 0.02; Maskable = $true }
)

foreach ($icon in $icons) {
    $size = [int]$icon.Size
    $bitmap = New-Object System.Drawing.Bitmap($size, $size)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.Clear([System.Drawing.ColorTranslator]::FromHtml($BackgroundColor))

    $padding = if ($icon.PSObject.Properties.Name -contains "Padding") { [double]$icon.Padding } else { 0.0 }
    Write-Verbose ("Processing {0} (size={1} type={2}) padding={3} type={4}" -f $icon.Name, $size, $size.GetType().FullName, $padding, $padding.GetType().FullName)

    if ($padding -gt 0) {
        $pad = [int]([math]::Round($size * $padding))
        Write-Verbose ("Pad pixels={0} type={1}" -f $pad, $pad.GetType().FullName)
        $width = [int]($size - (2 * $pad))
        $height = [int]($size - (2 * $pad))
        Write-Verbose ("Rect width={0} height={1}" -f $width, $height)
        $rect = New-Object System.Drawing.Rectangle($pad, $pad, $width, $height)
        $roundPath = New-Object System.Drawing.Drawing2D.GraphicsPath
        $roundPath.AddEllipse($rect)
        $gradientBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, [System.Drawing.ColorTranslator]::FromHtml($GradientStart), [System.Drawing.ColorTranslator]::FromHtml($GradientEnd), 45)
        $graphics.FillPath($gradientBrush, $roundPath)
        $gradientBrush.Dispose()
        $roundPath.Dispose()
    }

    $format = New-Object System.Drawing.StringFormat
    $format.Alignment = [System.Drawing.StringAlignment]::Center
    $format.LineAlignment = [System.Drawing.StringAlignment]::Center

    $font = New-Object System.Drawing.Font('Segoe UI', [double]$icon.FontSize, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml($AccentColor))
    $graphics.DrawString($Initials, $font, $textBrush, ($size / 2), ($size / 2), $format)

    $textBrush.Dispose()
    $font.Dispose()
    $format.Dispose()
    $graphics.Dispose()

    $outputPath = Join-Path $OutputDir $icon.Name
    $bitmap.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bitmap.Dispose()

    Write-Host "Generated $outputPath"
}
