$ErrorActionPreference = 'Stop'
$htmlPath = 'ai-tools.html'
$cssPath = 'css/style.css'
$html = [System.IO.File]::ReadAllText($htmlPath)
$sectionStart = $html.IndexOf('id="aiCardsContainer"')
$sectionEnd = $html.IndexOf('GEMINI PROMPT SHOWCASE', $sectionStart)
if ($sectionStart -lt 0 -or $sectionEnd -lt 0) { throw 'Could not locate AI card catalog boundaries.' }
$prefix = $html.Substring(0, $sectionStart)
$catalog = $html.Substring($sectionStart, $sectionEnd - $sectionStart)
$suffix = $html.Substring($sectionEnd)
$logos = @('chatgpt', 'gemini', 'claude', 'perplexity', 'runway', 'heygen', 'midjourney', 'dalle', 'elevenlabs', 'suno', 'descript', 'recraft', 'luma', 'jasper', 'surferseo', 'grammarly', 'notion', 'opusclip')
$counter = [PSCustomObject]@{ Value = 0 }
$catalog = [regex]::Replace($catalog, '<svg\b[\s\S]*?</svg>', {
  param($match)
  if ($counter.Value -ge $logos.Count) { throw 'Unexpected extra SVG in AI catalog.' }
  $name = $logos[$counter.Value]
  $counter.Value++
  return '<img src="assets/logos/' + $name + '.png" alt="' + $name + ' logo">'
})
if ($counter.Value -ne 18) { throw ('Expected 18 card SVGs; replaced ' + $counter.Value) }
if ([regex]::Matches($catalog, 'ai-card-icon-52').Count -ne 18) { throw 'Expected 18 logo containers.' }
$catalog = $catalog.Replace('ai-card-icon-52', 'ai-card-logo')
[System.IO.File]::WriteAllText($htmlPath, $prefix + $catalog + $suffix, [System.Text.UTF8Encoding]::new($false))
$css = [System.IO.File]::ReadAllText($cssPath)
$css = [regex]::Replace($css, '\.ai-card-icon-52 \{[\s\S]*?\}', @'
.ai-card-logo {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.9rem;
  flex-shrink: 0;
  box-shadow: var(--shadow-xs);
  overflow: hidden;
}
'@, 1)
$css = [regex]::Replace($css, '(?s)/\* Brand logo SVG / img inside icon container \*/\s*\.ai-card-icon-52 svg,\s*\.ai-card-icon-52 img \{.*?\}', @'
/* Brand logo image inside icon container */
.ai-card-logo img {
  max-width: 24px;
  max-height: 24px;
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  flex-shrink: 0;
}
'@, 1)
if ($css -match 'ai-card-icon-52') { throw 'Old logo CSS selectors remain.' }
[System.IO.File]::WriteAllText($cssPath, $css, [System.Text.UTF8Encoding]::new($false))
