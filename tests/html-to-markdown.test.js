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

test("ordered list keeps numbers", () => {
  const md = api.htmlToMarkdown("<ol><li>First</li><li>Second</li><li>Third</li></ol>", {});
  assert.ok(md.includes("1. First"));
  assert.ok(md.includes("2. Second"));
  assert.ok(md.includes("3. Third"));
  assert.ok(!md.includes("- First"));
});

test("bullet list stays bullets", () => {
  const md = api.htmlToMarkdown("<ul><li>Alpha</li><li>Beta</li></ul>", {});
  assert.ok(md.includes("- Alpha"));
  assert.ok(md.includes("- Beta"));
  assert.ok(!md.includes("1. Alpha"));
});

test("ordered list start offset", () => {
  const md = api.htmlToMarkdown('<ol start="3"><li>C</li><li>D</li></ol>', {});
  assert.ok(md.includes("3. C"));
  assert.ok(md.includes("4. D"));
});

test("nested ordered list numbers from the inside", () => {
  const md = api.htmlToMarkdown(
    "<ol><li>Parent<ol><li>Child</li></ol></li><li>Next</li></ol>",
    {}
  );
  assert.ok(md.includes("1. Parent"));
  assert.ok(md.includes("1. Child"));
  assert.ok(md.includes("2. Next"));
});

test("bold inside a numbered item", () => {
  const md = api.htmlToMarkdown("<ol><li><b>Hi</b></li></ol>", {});
  assert.ok(md.includes("1. **Hi**"));
});

if (!process.exitCode) console.log("All html-to-markdown tests passed.");
