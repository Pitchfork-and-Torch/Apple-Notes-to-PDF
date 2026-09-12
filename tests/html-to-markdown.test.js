/**
 * Node CI tests for lib/html-to-markdown.js (no macOS / Notes required).
 */
const assert = require("assert");
const path = require("path");
const api = require(path.join(__dirname, "..", "lib", "html-to-markdown.js"));

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

test("bold and italic", () => {
  const md = api.htmlToMarkdown("<p><b>Hi</b> <i>there</i></p>", { title: "T" });
  assert.ok(md.includes("**Hi**"));
  assert.ok(md.includes("*there*"));
  assert.ok(md.includes('title: "T"'));
});

test("headings", () => {
  const md = api.htmlToMarkdown("<h1>Title</h1><h2>Sub</h2>", {});
  assert.ok(md.includes("# Title"));
  assert.ok(md.includes("## Sub"));
});

test("links", () => {
  const md = api.htmlToMarkdown('<a href="https://example.com">Ex</a>', {});
  assert.ok(md.includes("[Ex](https://example.com)"));
});

test("checkboxes from unicode", () => {
  const md = api.htmlToMarkdown("<p>☐ todo<br>☑ done</p>", {});
  assert.ok(md.includes("- [ ]"));
  assert.ok(md.includes("- [x]"));
});

test("table", () => {
  const md = api.htmlToMarkdown(
    "<table><tr><th>A</th><th>B</th></tr><tr><td>1</td><td>2</td></tr></table>",
    {}
  );
  assert.ok(md.includes("| A | B |"));
  assert.ok(md.includes("| 1 | 2 |"));
});

test("strips script", () => {
  const md = api.htmlToMarkdown("<p>x</p><script>alert(1)</script>", {});
  assert.ok(!md.includes("alert"));
  assert.ok(md.includes("x"));
});

if (!process.exitCode) console.log("All html-to-markdown tests passed.");
