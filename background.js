// Service worker: the whole redirect engine. Full chrome.* access here, so it can
// read user prefs (impossible from a MAIN-world content script).
//
//   - Full page loads  -> a dynamic declarativeNetRequest redirect rule, rebuilt
//                         from prefs whenever they change. Redirects at the network
//                         layer, so there is no flash of the wrong-country page.
//   - SPA navigations  -> webNavigation.onHistoryStateUpdated, since the DNR rule
//                         only fires on main_frame document requests.

importScripts("shared.js");

const RULE_ID = 1;

async function getPrefs() {
  // get(DEFAULTS) backfills any missing keys with their default.
  return chrome.storage.sync.get(DEFAULTS);
}

// Rebuild the dynamic redirect rule from current prefs (or remove it if disabled).
async function syncRules() {
  const p = await getPrefs();
  const addRules = p.enabled
    ? [{
        id: RULE_ID,
        priority: 1,
        action: { type: "redirect", redirect: { regexSubstitution: buildDnrSubstitution(p) } },
        condition: { regexFilter: DNR_REGEX_FILTER, resourceTypes: ["main_frame"] }
      }]
    : [];
  await chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: [RULE_ID], addRules });
}

chrome.runtime.onInstalled.addListener(syncRules);
chrome.runtime.onStartup.addListener(syncRules);
chrome.storage.onChanged.addListener((_changes, area) => {
  if (area === "sync") syncRules();
});

// SPA route changes (history.pushState/replaceState) on levels.fyi.
chrome.webNavigation.onHistoryStateUpdated.addListener(
  async (details) => {
    if (details.frameId !== 0) return; // main frame only
    const url = new URL(details.url);
    const m = url.pathname.match(BARE_SALARIES_RE);
    if (!m) return;
    const p = await getPrefs();
    if (!p.enabled) return;
    const target = url.origin + buildPath(p, m[1], m[2]);
    if (target === details.url) return; // already there; avoid a loop
    chrome.tabs.update(details.tabId, { url: target });
  },
  { url: [{ hostSuffix: "levels.fyi" }] }
);
