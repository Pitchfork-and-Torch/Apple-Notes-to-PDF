/**
 * Pure HTML → Markdown converter for Apple Notes bodies.
 * Works in JXA (macOS) and Node (CI). No dependencies.
 * Obsidian/Logseq-friendly: GFM checklists, relative images, tables.
 */
(function (root) {
  "use strict";

  function decodeEntities(s) {
    if (!s) return "";
    return String(s)
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")
      .replace(/&apos;/gi, "'")
      .replace(/&#(\d+);/g, function (_, n) {
        return String.fromCharCode(parseInt(n, 10));
      })
      .replace(/&#x([0-9a-f]+);/gi, function (_, h) {
        return String.fromCharCode(parseInt(h, 16));
      });
  }

  function stripTags(html) {
    return decodeEntities(String(html || "").replace(/<[^>]+>/g, ""));
  }

  function attr(tag, name) {
    var re = new RegExp("\\b" + name + "\\s*=\\s*([\"'])([\\s\\S]*?)\\1", "i");
    var m = String(tag).match(re);
    if (m) return m[2];
    re = new RegExp("\\b" + name + "\\s*=\\s*([^\\s>]+)", "i");
    m = String(tag).match(re);
    return m ? m[1] : "";
  }

  function normalizeCheckboxes(text) {
    return String(text)
      .replace(/^[ \t]*[☐□▢❍]\s*/gm, "- [ ] ")
      .replace(/^[ \t]*[☑✓✔☒✅]\s*/gm, "- [x] ")
      .replace(/\u2610/g, "- [ ] ")
      .replace(/\u2611/g, "- [x] ");
  }

  /**
   * @param {string} html
   * @param {{title?: string, path?: string, created?: string, modified?: string, id?: string, account?: string, attachments?: Array}} meta
   */
  function htmlToMarkdown(html, meta) {
    meta = meta || {};
    var s = String(html || "");

    // Remove scripts/styles first
    s = s.replace(/<script[\s\S]*?<\/script>/gi, "");
    s = s.replace(/<style[\s\S]*?<\/style>/gi, "");

    // Structured blocks BEFORE stripping loose close tags
    // Headings
    s = s.replace(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi, function (_, level, inner) {
      var hashes = "";
      for (var i = 0; i < parseInt(level, 10); i++) hashes += "#";
      return "\n" + hashes + " " + stripTags(inner).trim() + "\n\n";
    });

    // Tables → GFM
    s = s.replace(/<table[^>]*>([\s\S]*?)<\/table>/gi, function (_, table) {
      var rows = [];
      table.replace(/<tr[^>]*>([\s\S]*?)<\/tr>/gi, function (__, row) {
        var cells = [];
        row.replace(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/gi, function (___, cell) {
          cells.push(stripTags(cell).trim().replace(/\|/g, "\\|"));
          return "";
        });
        if (cells.length) rows.push(cells);
        return "";
      });
      if (!rows.length) return "";
      var out = "\n| " + rows[0].join(" | ") + " |\n";
      out += "| " + rows[0].map(function () { return "---"; }).join(" | ") + " |\n";
      for (var r = 1; r < rows.length; r++) {
        out += "| " + rows[r].join(" | ") + " |\n";
      }
      return out + "\n";
    });

    // Bold / italic / underline / strike
    s = s.replace(/<(strong|b)[^>]*>([\s\S]*?)<\/\1>/gi, "**$2**");
    s = s.replace(/<(em|i)[^>]*>([\s\S]*?)<\/\1>/gi, "*$2*");
    s = s.replace(/<u[^>]*>([\s\S]*?)<\/u>/gi, "$1");
    s = s.replace(/<(s|strike|del)[^>]*>([\s\S]*?)<\/\1>/gi, "~~$2~~");
    s = s.replace(/<font[^>]*>([\s\S]*?)<\/font>/gi, "$1");
    s = s.replace(/<span[^>]*>([\s\S]*?)<\/span>/gi, "$1");

    // Links
    s = s.replace(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi, function (_, a, inner) {
      var href = attr(a, "href") || "";
      var text = stripTags(inner).trim() || href;
      if (!href) return text;
      return "[" + text + "](" + href + ")";
    });

    // Images
    s = s.replace(/<img\b([^>]*)\/?>/gi, function (_, a) {
      var src = attr(a, "src") || "";
      var alt = attr(a, "alt") || "image";
      if (!src) return "";
      return "![" + alt + "](" + src + ")";
    });

    // Apple attachment objects → placeholder images if data/cid present
    s = s.replace(/<object\b([^>]*)>[\s\S]*?<\/object>/gi, function (_, a) {
      var data = attr(a, "data") || "";
      if (data.indexOf("cid:") === 0) {
        return "![attachment](" + data + ")";
      }
      return "";
    });

    // Lists
    s = s.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, function (full, inner) {
      var t = stripTags(inner).trim();
      if (/^\[([ xX])\]/.test(t)) return "- " + t + "\n";
      if (/checklist|todo/i.test(full)) {
        return "- [ ] " + t + "\n";
      }
      return "- " + t + "\n";
    });
    s = s.replace(/<\/?ul[^>]*>/gi, "\n");
    s = s.replace(/<\/?ol[^>]*>/gi, "\n");

    // Line breaks / block closers (after structured transforms)
    s = s.replace(/<br\s*\/?>/gi, "\n");
    s = s.replace(/<\/div>/gi, "\n");
    s = s.replace(/<\/p>/gi, "\n\n");
    s = s.replace(/<p[^>]*>/gi, "");
    s = s.replace(/<div[^>]*>/gi, "");

    // Drop remaining tags
    s = s.replace(/<[^>]+>/g, "");
    s = decodeEntities(s);
    s = normalizeCheckboxes(s);

    // Collapse whitespace
    s = s.replace(/\r\n/g, "\n");
    s = s.replace(/[ \t]+\n/g, "\n");
    s = s.replace(/\n{3,}/g, "\n\n");
    s = s.trim();

    var fm = ["---"];
    if (meta.title) fm.push('title: "' + String(meta.title).replace(/"/g, '\\"') + '"');
    if (meta.path) fm.push('folder: "' + String(meta.path).replace(/"/g, '\\"') + '"');
    if (meta.account) fm.push('account: "' + String(meta.account).replace(/"/g, '\\"') + '"');
    if (meta.created) fm.push("created: " + meta.created);
    if (meta.modified) fm.push("modified: " + meta.modified);
    if (meta.id) fm.push('id: "' + String(meta.id).replace(/"/g, '\\"') + '"');
    fm.push("source: Apple Notes");
    fm.push("---\n");

    return fm.join("\n") + "\n" + s + "\n";
  }

  var api = { htmlToMarkdown: htmlToMarkdown, stripTags: stripTags, decodeEntities: decodeEntities };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  root.AppleNotesHtmlToMarkdown = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
