$t = [System.IO.File]::ReadAllText("c:\Users\DELL\cat1\live_reference\assets\index.js")
$dStart = $t.IndexOf("d={width:1920,height:1080")
if ($dStart -ge 0) {
    $needle = "mochi:cue"
    $dEnd = $t.IndexOf($needle, $dStart)
    # search backwards from $dEnd to find the closing brace of d
    $lastBrace = $t.LastIndexOf("}", $dEnd)
    $dStr = $t.Substring($dStart + 2, $lastBrace - ($dStart + 2) + 1)
    [System.IO.File]::WriteAllText("c:\Users\DELL\cat1\cat_manifest_raw.txt", $dStr)
    Write-Host "Success, length: $($dStr.Length)"
}
