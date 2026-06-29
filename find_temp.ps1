$txt = [IO.File]::ReadAllText("dist/assets/index-DYXXu0wA.js")
Write-Output "Checking occurrences of .cat"
$offset = 0
while ($true) {
    $idx = $txt.IndexOf(".cat", $offset)
    if ($idx -lt 0) { break }
    $start = [Math]::Max(0, $idx - 50)
    $length = [Math]::Min($txt.Length - $start, 100)
    $context = $txt.Substring($start, $length)
    Write-Output "Found at $idx : $context"
    $offset = $idx + 4
}
