// Form logic. DEFAULTS / PRESETS / buildPath come from shared.js.

const $ = (id) => document.getElementById(id);
const FIELDS = ["enabled", "locationSlug", "locationParam", "locationId", "sortBy", "sortOrder", "limit"];

// Populate the preset dropdown from PRESETS + a Custom entry.
function fillPresets() {
  const sel = $("preset");
  for (const [key, p] of Object.entries(PRESETS)) {
    sel.add(new Option(p.label, key));
  }
  sel.add(new Option("Custom…", "custom"));
}

// Which preset (if any) matches the current location fields.
function matchPreset() {
  for (const [key, p] of Object.entries(PRESETS)) {
    if (p.locationSlug === $("locationSlug").value &&
        p.locationParam === $("locationParam").value &&
        p.locationId === $("locationId").value) {
      return key;
    }
  }
  return "custom";
}

// Read the form into a prefs object.
function readForm() {
  return {
    enabled: $("enabled").checked,
    locationSlug: $("locationSlug").value.trim(),
    locationParam: $("locationParam").value,
    locationId: $("locationId").value.trim(),
    sortBy: $("sortBy").value,
    sortOrder: $("sortOrder").value,
    limit: Math.max(1, parseInt($("limit").value, 10) || DEFAULTS.limit)
  };
}

// Write a prefs object into the form.
function writeForm(p) {
  $("enabled").checked = p.enabled;
  $("locationSlug").value = p.locationSlug;
  $("locationParam").value = p.locationParam;
  $("locationId").value = p.locationId;
  $("sortBy").value = p.sortBy;
  $("sortOrder").value = p.sortOrder;
  $("limit").value = p.limit;
  $("preset").value = matchPreset();
  renderPreview();
}

// Live example of the URL the prefs produce.
function renderPreview() {
  const p = readForm();
  $("preview").textContent = "levels.fyi" + buildPath(p, "<company>", "<role>");
}

function onPresetChange() {
  const key = $("preset").value;
  const p = PRESETS[key];
  if (!p) return; // "custom" -> leave fields as-is
  $("locationSlug").value = p.locationSlug;
  $("locationParam").value = p.locationParam;
  $("locationId").value = p.locationId;
  renderPreview();
}

async function save() {
  await chrome.storage.sync.set(readForm());
  const s = $("status");
  s.classList.add("show");
  setTimeout(() => s.classList.remove("show"), 1500);
}

async function init() {
  fillPresets();
  const stored = await chrome.storage.sync.get(DEFAULTS);
  writeForm(stored);

  $("preset").addEventListener("change", onPresetChange);
  $("save").addEventListener("click", save);
  // Keep preview + preset selector in sync as the user edits location fields.
  FIELDS.forEach((id) => $(id).addEventListener("input", () => {
    if (["locationSlug", "locationParam", "locationId"].includes(id)) $("preset").value = matchPreset();
    renderPreview();
  }));
}

init();
