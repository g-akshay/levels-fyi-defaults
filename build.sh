#!/usr/bin/env bash
# Build the Chrome Web Store upload zip with only the files the extension ships.
set -euo pipefail
cd "$(dirname "$0")"

OUT="levels-fyi-defaults.zip"
rm -f "$OUT"
zip -r "$OUT" \
  manifest.json background.js shared.js options.html options.js \
  icons/icon-16.png icons/icon-48.png icons/icon-128.png

echo "Built $OUT"
