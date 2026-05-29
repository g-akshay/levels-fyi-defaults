// Shared between the service worker (importScripts) and the options page (<script>).
// Single source of truth for defaults + URL building so the two never drift.

// Default preferences. Mirrors the values that used to be hardcoded in the URL.
const DEFAULTS = {
  enabled: true,
  locationSlug: "india",   // path segment after /locations/
  locationParam: "country", // "country" (country-level) or "dma" (metro-level)
  locationId: "113",       // India = 113
  sortBy: "total_compensation",
  sortOrder: "DESC",
  limit: 25
};

// Verified location presets the form offers as one-click fills.
const PRESETS = {
  india: { label: "India", locationSlug: "india", locationParam: "country", locationId: "113" },
  bengaluru: { label: "Greater Bengaluru", locationSlug: "greater-bengaluru", locationParam: "dma", locationId: "10062" }
};

// A bare salaries page: /companies/<company>/salaries/<role> with NO further segment.
// (A page already under /locations/ won't match, so there is no redirect loop.)
const BARE_SALARIES_RE = /^\/companies\/([^/]+)\/salaries\/([^/?#]+)\/?$/;

// Same shape as a string, for declarativeNetRequest's RE2 engine. The (\?.*)? lets
// the rule fire on a bare URL that already carries a query (e.g. ?country=254).
const DNR_REGEX_FILTER =
  "^https://www\\.levels\\.fyi/companies/([^/]+)/salaries/([^/?#]+)(\\?.*)?$";

// Build the query string (location + sort + pagination) from prefs.
function buildQuery(p) {
  const params = new URLSearchParams();
  params.set(p.locationParam, p.locationId);
  params.set("sortBy", p.sortBy);
  params.set("sortOrder", p.sortOrder);
  params.set("limit", String(p.limit));
  return params.toString();
}

// Full path for a concrete company/role (used for SPA redirects via tabs.update).
function buildPath(p, company, role) {
  return `/companies/${company}/salaries/${role}/locations/${p.locationSlug}?${buildQuery(p)}`;
}

// declarativeNetRequest substitution string. \\1 / \\2 are the company/role
// backreferences from DNR_REGEX_FILTER (single backslash in the final string value).
function buildDnrSubstitution(p) {
  return `https://www.levels.fyi/companies/\\1/salaries/\\2/locations/${p.locationSlug}?${buildQuery(p)}`;
}
