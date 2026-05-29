# Privacy Policy

**Extension:** levels.fyi location & sort defaults
**Last updated:** 2026-05-29

## Summary

This extension does **not** collect, store, transmit, or sell any personal data.

## What it does

The extension redirects [levels.fyi](https://www.levels.fyi) salary pages to a
location, sort order, and page size that you configure. All processing happens
locally in your browser.

## Data we store

Only your preferences (chosen location, sort field, sort order, page size, and the
on/off toggle). These are saved with the browser's `chrome.storage.sync` API so
they persist and sync across your own signed-in Chrome profile. They never leave
your browser or your Google account.

## Data we collect

None. The extension:

- makes **no** external network requests,
- contains **no** analytics, tracking, or telemetry,
- reads or sends **no** personal information,
- runs **only** on `*.levels.fyi` pages.

## Permissions

- `declarativeNetRequest` / `webNavigation` / host access to `levels.fyi` — used
  solely to detect and redirect levels.fyi salary URLs.
- `storage` — used solely to save your preferences locally.

## Contact

Questions: open an issue at
https://github.com/g-akshay/levels-fyi-defaults/issues
