Add-Type -AssemblyName System.Drawing

$src = "C:\Users\FARAZ\.gemini\antigravity-ide\brain\c10ecdfe-929f-44fc-a115-db38d341e25c\.user_uploaded\media_1790137443346.jpg"
$bmp = [System.Drawing.Bitmap]::FromFile($src)
$outDir = "c:\Users\FARAZ\OneDrive\Desktop\takees anti\assets\images\team"
if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir -Force }

Write-Host "Image size: $($bmp.Width) x $($bmp.Height)"

# Find the bounding boxes of the purple avatar squares
# In the 1024 x 850 image:
# Let's inspect the layout:
# There are 6 columns:
# Col widths and spacings:
# Left margin is around 70-80px, right margin around 70-80px.
# Total usable width ~ 880px.
# 6 cards each ~ 100-110px wide with ~ 45-55px gap.

# Let's sample colors across X at y=260 (middle of row 1)
$purpleX = @()
for ($x = 0; $x -lt $bmp.Width; $x += 2) {
    $c = $bmp.GetPixel($x, 260)
    # Check if purple
    if ($c.B -gt 180 -and $c.R -gt 70 -and $c.G -lt 140) {
        $purpleX += $x
    }
}

Write-Host "Sampled purple X count at Y=260: $($purpleX.Count)"

# Let's sample colors across Y at x=120
$purpleY = @()
for ($y = 0; $y -lt $bmp.Height; $y += 2) {
    $c = $bmp.GetPixel(120, $y)
    if ($c.B -gt 180 -and $c.R -gt 70 -and $c.G -lt 140) {
        $purpleY += $y
    }
}

Write-Host "Sampled purple Y count at X=120: $($purpleY.Count)"
if ($purpleY.Count -gt 0) {
    Write-Host "Y min: $($purpleY[0]), Y max: $($purpleY[-1])"
}

$bmp.Dispose()
