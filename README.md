# levels.fyi location & sort defaults

A Chrome extension that auto-redirects [levels.fyi](https://www.levels.fyi) salary
pages to your preferred **location**, **sort order**, and **page size** — so you
stop landing on US-default data every time.

> Not affiliated with levels.fyi.

## The problem

levels.fyi shows salaries in **US dollars for US locations by default**. If you
care about a specific country or metro, you have to re-pick the location on every
company page — and the choice doesn't stick across navigation. This extension makes
your preference the default, everywhere, automatically.

## Features

### 📍 Default location, everywhere
Every salary page opens in the location you chose — no more US default.
- **One-click presets**: India (country) and Greater Bengaluru (metro).
- **Custom location**: set any country or metro by its URL slug, type
  (`country` / `dma`), and ID — so you're not limited to the presets.

### ↕️ Default sort order
Land on the data already sorted the way you want:
- Sort by **total compensation** or **years of experience**.
- **Highest-first (DESC)** or **lowest-first (ASC)**.

### 📄 Default page size
Set how many salary rows load per page (the `limit`) instead of the site default.

### ⚡ Works on every kind of navigation
- **Full page loads** (typing a URL, opening a link) are redirected before the
  page even renders — no flash of the wrong-country data.
- **In-app clicks** (levels.fyi is a single-page app) are caught too, so jumping
  between companies keeps your preferences without a manual refresh.

### 🔌 One-tap on/off
A single **Enabled** toggle in the popup turns all redirects off without
uninstalling — useful when you want the raw US view for a moment.

### 🔒 Private by design
No accounts, no analytics, no external requests. Preferences are stored locally
in your browser (`chrome.storage.sync`) and the extension only ever touches
`levels.fyi` pages.

### 👀 Live URL preview
The popup shows exactly what URL your settings will produce, so there's no guessing.

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
