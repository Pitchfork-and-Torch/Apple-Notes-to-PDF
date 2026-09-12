/**
 * Node CI tests for lib/export-receipt.js (no macOS / Notes required).
 */
const assert = require("assert");
const path = require("path");
const api = require(path.join(__dirname, "..", "lib", "export-receipt.js"));

function test(name, fn) {
  try {
    fn();
    console.log("ok - " + name);
  } catch (e) {
    console.error("FAIL - " + name);
    console.error(e);
    process.exitCode = 1;
  }
}

test("receipt counts and ok flag", () => {
  const r = api.buildExportReceipt({
    version: "7.1.0",
    generatedAt: "2026-09-12T00:00:00Z",
    notes: 12,
    skipped: 1,
    writeFailures: 0,
    attachments: 4,
    formats: ["pdf", "md"],
    includeDeleted: false,
    dryRun: false
  });
  assert.strictEqual(r.kind, "apple-notes-export-receipt");
  assert.strictEqual(r.version, "7.1.0");
  assert.strictEqual(r.notes, 12);
  assert.strictEqual(r.skipped, 1);
  assert.strictEqual(r.write_failures, 0);
  assert.strictEqual(r.attachments, 4);
  assert.deepStrictEqual(r.formats, ["pdf", "md"]);
  assert.strictEqual(r.ok, true);
  assert.strictEqual(r.dry_run, false);
});

test("negative and missing counts become zero", () => {
  const r = api.buildExportReceipt({ notes: -3, skipped: "nope" });
  assert.strictEqual(r.notes, 0);
  assert.strictEqual(r.skipped, 0);
  assert.strictEqual(r.write_failures, 0);
  assert.strictEqual(r.ok, true);
});

test("write failures mark not ok", () => {
  const r = api.buildExportReceipt({ writeFailures: 2 });
  assert.strictEqual(r.write_failures, 2);
  assert.strictEqual(r.ok, false);
});

if (!process.exitCode) console.log("All export-receipt tests passed.");
