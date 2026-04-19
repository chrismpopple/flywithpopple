$file = 'C:\Users\Melissa Popple\ethan-website\index.html'
$content = [System.IO.File]::ReadAllText($file, [System.Text.UTF8Encoding]::new($false))

# Helper to build icon-wrap replacement
function Wrap($svg) { return "          <div class=`"cert-icon-wrap`">$svg</div>" }

$ppl  = Wrap('<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#c8a96e" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 11 C5 9.5 9 9.5 13 10.5 L18 9.5"/><path d="M9 10 L7.5 6.5 L5.5 8.5"/><path d="M6 11 L5 14 L7.5 13"/><path d="M15 9.8 L14.5 8.2"/><path d="M15 10.2 L13.5 10.2"/></svg>')
$ifr  = Wrap('<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#c8a96e" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="10" r="8"/><line x1="10" y1="2" x2="10" y2="5.5"/><line x1="10" y1="14.5" x2="10" y2="18"/><line x1="2" y1="10" x2="5.5" y2="10"/><line x1="14.5" y1="10" x2="18" y2="10"/><circle cx="10" cy="10" r="1.5" fill="#c8a96e" stroke="none"/></svg>')
$cpl  = Wrap('<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#c8a96e" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="8" r="5.5"/><path d="M6.5 12.5 L4.5 18 L10 15.5 L15.5 18 L13.5 12.5"/><path d="M10 5 L10.7 7.2 L13 7.2 L11.2 8.6 L11.9 10.8 L10 9.4 L8.1 10.8 L8.8 8.6 L7 7.2 L9.3 7.2 Z"/></svg>')
$cfi  = Wrap('<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#c8a96e" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="7" cy="5.5" r="2.5"/><path d="M2.5 15 C2.5 11 11.5 11 11.5 15"/><circle cx="14" cy="5.5" r="2.5"/><path d="M9.5 15 C9.5 11 18.5 11 18.5 15"/></svg>')
$cfii = Wrap('<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#c8a96e" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="6.5" cy="5" r="2.5"/><path d="M2 14 C2 10 11 10 11 14"/><circle cx="15" cy="12" r="4"/><polyline points="15,9.5 15,12 17,12"/></svg>')
$me   = Wrap('<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#c8a96e" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2 L10 18"/><path d="M2.5 10 L17.5 10"/><rect x="3" y="8.5" width="3" height="3" rx="1.5"/><rect x="14" y="8.5" width="3" height="3" rx="1.5"/><path d="M7.5 16 Q10 17 12.5 16"/><path d="M9.5 2 Q10 1.5 10.5 2"/></svg>')

# Replace each icon-wrap by matching on the unique cert-code that follows
$content = $content -replace '(?s)<div class="cert-icon-wrap">.*?</div>(\s*<!--[^>]*-->\s*)?(\s*<p class="cert-code">PPL)', "$ppl`n          `$2"
$content = $content -replace '(?s)<div class="cert-icon-wrap">.*?</div>(\s*<p class="cert-code">IFR)', "$ifr`n          `$1"
$content = $content -replace '(?s)<div class="cert-icon-wrap">.*?</div>(\s*<p class="cert-code">CPL)', "$cpl`n          `$1"
$content = $content -replace '(?s)<div class="cert-icon-wrap">.*?</div>(\s*<p class="cert-code">CFI</p>)', "$cfi`n          `$1"
$content = $content -replace '(?s)<div class="cert-icon-wrap">.*?</div>(\s*<p class="cert-code">CFII)', "$cfii`n          `$1"
$content = $content -replace '(?s)<div class="cert-icon-wrap">.*?</div>(\s*<p class="cert-code">ME)', "$me`n          `$1"

[System.IO.File]::WriteAllText($file, $content, [System.Text.UTF8Encoding]::new($false))
Write-Host "All cert icons replaced."
