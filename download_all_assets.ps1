# Create required directories
$baseDir = "c:\Users\DELL\cat1\public"
$dirs = @("$baseDir\cat", "$baseDir\images", "$baseDir\videos")
foreach ($d in $dirs) {
    if (!(Test-Path $d)) { New-Item -ItemType Directory -Path $d -Force | Out-Null }
}

# 1. Download bg.jpg
Write-Host "Downloading bg.jpg..."
curl.exe -s -o "$baseDir\cat\bg.jpg" "https://mochi-cat-food.vercel.app/cat/bg.jpg"

# 2. Download favicon.svg
Write-Host "Downloading favicon.svg..."
curl.exe -s -o "$baseDir\favicon.svg" "https://mochi-cat-food.vercel.app/favicon.svg"

# 3. Download images
$images = @("cat-bowl.webp", "kitten-hug.webp", "pouch-float.webp", "pouch.webp", "kibble.webp", "kibble-one.webp", "kibble-two.webp", "kibble-three.webp")
foreach ($img in $images) {
    Write-Host "Downloading images/$img..."
    curl.exe -s -o "$baseDir\images\$img" "https://mochi-cat-food.vercel.app/images/$img"
}

# 4. Download videos
$videos = @("kitten-hug.mp4", "pouch-float.mp4")
foreach ($vid in $videos) {
    Write-Host "Downloading videos/$vid..."
    curl.exe -s -o "$baseDir\videos\$vid" "https://mochi-cat-food.vercel.app/videos/$vid"
}

# 5. Extract frame indices from cat_manifest_raw.txt and download each frame
$manifestText = [System.IO.File]::ReadAllText("c:\Users\DELL\cat1\cat_manifest_raw.txt")
$matches = [regex]::Matches($manifestText, '\{i:(\d+),')
Write-Host "Found $($matches.Count) frames in manifest."

foreach ($m in $matches) {
    $idx = [int]$m.Groups[1].Value
    $frameName = "f" + ($idx.ToString().PadLeft(3, '0')) + ".webp"
    $targetFile = "$baseDir\cat\$frameName"
    if (!(Test-Path $targetFile)) {
        curl.exe -s -o $targetFile "https://mochi-cat-food.vercel.app/cat/$frameName"
    }
}

Write-Host "All downloads complete!"
$totalFiles = (Get-ChildItem -Path $baseDir -Recurse -File).Count
Write-Host "Total files downloaded in public: $totalFiles"
