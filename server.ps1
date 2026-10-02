param(
    [int]$Port = 5173,
    [string]$Root = "c:\Users\DELL\cat1"
)

$listener = New-Object System.Net.HttpListener
$prefix = "http://localhost:$Port/"
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
    Write-Host "Server listening at $prefix"
} catch {
    Write-Host "Failed to start listener: $_"
    exit 1
}

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".htm"  = "text/html; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".mjs"  = "application/javascript; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".svg"  = "image/svg+xml"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".webp" = "image/webp"
    ".mp4"  = "video/mp4"
    ".ico"  = "image/x-icon"
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $rawUrl = $request.Url.LocalPath
        if ($rawUrl -eq "/" -or $rawUrl -eq "") {
            $rawUrl = "/index.html"
        }

        # Clean path
        $cleanPath = $rawUrl.TrimStart("/").Replace("/", "\")
        $filePath = Join-Path $Root $cleanPath

        # Check if file exists in root or public
        if (!(Test-Path $filePath -PathType Leaf)) {
            $publicPath = Join-Path $Root "public\$cleanPath"
            if (Test-Path $publicPath -PathType Leaf) {
                $filePath = $publicPath
            }
        }

        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $mime = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
            $response.ContentType = $mime
            $response.AddHeader("Access-Control-Allow-Origin", "*")

            $fileInfo = New-Object System.IO.FileInfo($filePath)
            $totalBytes = $fileInfo.Length

            # Video partial content / Range support
            $rangeHeader = $request.Headers["Range"]
            if ($rangeHeader -and $ext -eq ".mp4") {
                $rangeMatch = [regex]::Match($rangeHeader, "bytes=(\d+)-(\d+)?")
                if ($rangeMatch.Success) {
                    $start = [int64]$rangeMatch.Groups[1].Value
                    $end = if ($rangeMatch.Groups[2].Success -and $rangeMatch.Groups[2].Value -ne "") {
                        [int64]$rangeMatch.Groups[2].Value
                    } else {
                        $totalBytes - 1
                    }
                    if ($end -ge $totalBytes) { $end = $totalBytes - 1 }
                    $length = $end - $start + 1

                    $response.StatusCode = 206
                    $response.AddHeader("Content-Range", "bytes $start-$end/$totalBytes")
                    $response.AddHeader("Accept-Ranges", "bytes")
                    $response.ContentLength64 = $length

                    if ($request.HttpMethod -ne "HEAD") {
                        $fs = [System.IO.File]::OpenRead($filePath)
                        $fs.Seek($start, [System.IO.SeekOrigin]::Begin) | Out-Null
                        $buffer = New-Object byte[] 65536
                        $remaining = $length
                        while ($remaining -gt 0) {
                            $toRead = [Math]::Min($buffer.Length, $remaining)
                            $read = $fs.Read($buffer, 0, $toRead)
                            if ($read -le 0) { break }
                            $response.OutputStream.Write($buffer, 0, $read)
                            $remaining -= $read
                        }
                        $fs.Close()
                    }
                    $response.OutputStream.Close()
                    continue
                }
            }

            $response.StatusCode = 200
            $response.ContentLength64 = $totalBytes
            $response.AddHeader("Accept-Ranges", "bytes")

            if ($request.HttpMethod -ne "HEAD") {
                $fs = [System.IO.File]::OpenRead($filePath)
                $buffer = New-Object byte[] 65536
                while (($read = $fs.Read($buffer, 0, $buffer.Length)) -gt 0) {
                    $response.OutputStream.Write($buffer, 0, $read)
                }
                $fs.Close()
            }
            $response.OutputStream.Close()
        } else {
            $response.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $response.ContentLength64 = $msg.Length
            if ($request.HttpMethod -ne "HEAD") {
                $response.OutputStream.Write($msg, 0, $msg.Length)
            }
            $response.OutputStream.Close()
        }
    } catch {
        # continue loop
    }
}
