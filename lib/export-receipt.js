/**
 * Export receipt: a local JSON summary of one Apple Notes export.
 * Node tests import this file. JXA can eval it the same way as path-utils.
 */
(function (root) {
  function asInt(n) {
    var x = Number(n);
    if (!isFinite(x) || x < 0) return 0;
    return Math.floor(x);
  }

  function buildExportReceipt(input) {
    var src = input && typeof input === "object" ? input : {};
    var notes = asInt(src.notes);
    var skipped = asInt(src.skipped);
    var writeFailures = asInt(src.writeFailures);
    var attachments = asInt(src.attachments);
    var formats = Array.isArray(src.formats)
      ? src.formats.map(function (f) {
          return String(f);
        })
      : [];
    return {
      kind: "apple-notes-export-receipt",
      version: String(src.version || ""),
      generated_at: String(src.generatedAt || ""),
      notes: notes,
      skipped: skipped,
      write_failures: writeFailures,
      attachments: attachments,
      formats: formats,
      include_deleted: !!src.includeDeleted,
      dry_run: !!src.dryRun,
      ok: writeFailures === 0
    };
  }

  var api = { buildExportReceipt: buildExportReceipt };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else {
    root.AppleNotesExportReceipt = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
