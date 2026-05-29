# levels.fyi location & sort defaults

A Chrome extension that auto-redirects [levels.fyi](https://www.levels.fyi) salary
pages to your preferred **location**, **sort order**, and **page size** — so you
stop landing on US-default data every time.

> Not affiliated with levels.fyi.

## Features

- Default location via presets (India, Greater Bengaluru) or any custom country/metro
- Sort by total compensation or years of experience, ascending or descending
- Set results-per-page
- Works on full page loads **and** in-app (SPA) navigation
- One toggle to enable/disable
- No accounts, no tracking — preferences are stored locally

## Install (unpacked)

1. Clone this repo.
2. Open `chrome://extensions`, enable **Developer mode**.
3. **Load unpacked** → select the repo folder.
4. Click the toolbar icon to set your preferences.

## How it works

| Navigation type | Mechanism |
| --- | --- |
| Full page load | A dynamic `declarativeNetRequest` redirect rule, rebuilt from prefs |
| In-app (SPA) click | `webNavigation.onHistoryStateUpdated` in the service worker → `tabs.update` |

A bare salaries URL like `/companies/<co>/salaries/<role>` is rewritten to
`/companies/<co>/salaries/<role>/locations/<slug>?<param>=<id>&sortBy=…&sortOrder=…&limit=…`.

All settings and URL building live in `shared.js`, used by both the service worker
(`background.js`) and the options form (`options.html` / `options.js`), so they never drift.

## Build the upload zip

```sh
zip -r levels-fyi-defaults.zip \
  manifest.json background.js shared.js options.html options.js \
  icons/icon-16.png icons/icon-48.png icons/icon-128.png
```

## Privacy

The extension only runs on `*.levels.fyi`, stores preferences locally
(`chrome.storage.sync`), and makes no external network calls. It does not collect
or transmit any user data.

## License

[MIT](LICENSE)
