/**
 * Path / filename helpers shared by the JXA engine (via eval) and Node tests.
 * Exports for Node; JXA loads via eval and uses global AppleNotesPathUtils.
 */
(function (root) {
  function sanitizeFilename(name, maxLen) {
    maxLen = maxLen || 80;
    var raw = String(name == null ? "Untitled" : name);
    if (typeof raw.normalize === "function") {
      try {
        raw = raw.normalize("NFC");
      } catch (e) {}
    }
    var s = raw
      .replace(/[\/\\:\*\?"<>\|\x00-\x1f]/g, "_")
      .replace(/\s+/g, " ")
      .trim();
    if (!s) s = "Untitled";
    s = s.replace(/^\.+/, "").replace(/[\. ]+$/g, "");
    if (!s) s = "Untitled";
    if (s.length > maxLen) s = s.slice(0, maxLen).trim();
    return s || "Untitled";
  }

  function sanitizePathSeg(name) {
    return sanitizeFilename(name, 60) || "Folder";
  }

  function uniqueSlug(folderRel, title, slugCounts, maxLen) {
    var baseSlug = sanitizeFilename(title, maxLen || 60);
    var key = String(folderRel || "") + "\0" + baseSlug.toLowerCase();
    if (slugCounts[key] == null) {
      slugCounts[key] = 0;
    } else {
      slugCounts[key]++;
    }
    var n = slugCounts[key];
    var slug = n ? baseSlug + "-" + n : baseSlug;
    var usedKey = String(folderRel || "") + "\0" + slug.toLowerCase();
    while (slugCounts["__used__" + usedKey]) {
      n++;
      slug = baseSlug + "-" + n;
      usedKey = String(folderRel || "") + "\0" + slug.toLowerCase();
    }
    slugCounts["__used__" + usedKey] = true;
    return { slug: slug, baseSlug: baseSlug };
  }

  function shortIdSuffix(id) {
    var s = String(id || "");
    var m = s.match(/\/p(\d+)$/);
    if (m) return m[1];
    var h = 0;
    for (var i = 0; i < s.length; i++) {
      h = (h * 31 + s.charCodeAt(i)) >>> 0;
    }
    return h.toString(36).slice(0, 6);
  }

  var api = {
    sanitizeFilename: sanitizeFilename,
    sanitizePathSeg: sanitizePathSeg,
    uniqueSlug: uniqueSlug,
    shortIdSuffix: shortIdSuffix
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else {
    root.AppleNotesPathUtils = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
