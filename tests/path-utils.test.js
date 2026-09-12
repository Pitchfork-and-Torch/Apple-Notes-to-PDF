/**
 * Node CI tests for lib/path-utils.js (no macOS / Notes required).
 */
const assert = require("assert");
const path = require("path");
const api = require(path.join(__dirname, "..", "lib", "path-utils.js"));

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

test("sanitizeFilename strips illegal chars", () => {
  const s = api.sanitizeFilename('a/b:c*d?"e|f');
  assert.ok(!/[\/\\:\*\?"<>|]/.test(s));
  assert.ok(s.length > 0);
});

test("sanitizeFilename empty becomes Untitled", () => {
  assert.strictEqual(api.sanitizeFilename("   "), "Untitled");
  assert.strictEqual(api.sanitizeFilename(""), "Untitled");
});

test("sanitizeFilename max length", () => {
  const s = api.sanitizeFilename("x".repeat(200), 40);
  assert.ok(s.length <= 40);
});

test("case-insensitive uniqueSlug does not collide", () => {
  const counts = {};
  const a = api.uniqueSlug("iCloud/Notes", "TO DO", counts, 60);
  const b = api.uniqueSlug("iCloud/Notes", "To Do", counts, 60);
  const c = api.uniqueSlug("iCloud/Notes", "to do", counts, 60);
  assert.strictEqual(a.slug.toLowerCase() !== b.slug.toLowerCase(), true);
  assert.strictEqual(b.slug.toLowerCase() !== c.slug.toLowerCase(), true);
  assert.strictEqual(a.slug, "TO DO");
  assert.ok(b.slug.startsWith("To Do"));
  assert.ok(c.slug.startsWith("to do"));
});

test("Orphaned by indifference case pair", () => {
  const counts = {};
  const a = api.uniqueSlug("iCloud/Notes", "Orphaned by Indifference", counts, 60);
  const b = api.uniqueSlug("iCloud/Notes", "Orphaned by indifference", counts, 60);
  assert.notStrictEqual(a.slug.toLowerCase(), b.slug.toLowerCase());
});

test("identical titles get numeric suffixes", () => {
  const counts = {};
  const a = api.uniqueSlug("F", "New Note", counts, 60);
  const b = api.uniqueSlug("F", "New Note", counts, 60);
  const c = api.uniqueSlug("F", "New Note", counts, 60);
  assert.strictEqual(a.slug, "New Note");
  assert.strictEqual(b.slug, "New Note-1");
  assert.strictEqual(c.slug, "New Note-2");
});

test("different folders may reuse slug", () => {
  const counts = {};
  const a = api.uniqueSlug("A/Notes", "Hello", counts, 60);
  const b = api.uniqueSlug("B/Notes", "Hello", counts, 60);
  assert.strictEqual(a.slug, "Hello");
  assert.strictEqual(b.slug, "Hello");
});

test("shortIdSuffix from core data path", () => {
  assert.strictEqual(
    api.shortIdSuffix("x-coredata://91B6/ICNote/p735"),
    "735"
  );
});

if (!process.exitCode) console.log("All path-utils tests passed.");
