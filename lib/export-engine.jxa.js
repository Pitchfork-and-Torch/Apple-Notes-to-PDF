/**
 * Apple Notes to PDF — export engine loader (JXA) v7.0.1
 * Decodes lib/export-engine.payload.zlib.b64 (raw zlib + base64) and runs it.
 * Invoked by export-apple-notes.sh via: osascript -l JavaScript lib/export-engine.jxa.js
 */
ObjC.import("Foundation");
ObjC.import("stdlib");

function env(name, fallback) {
  try {
    var v = $.getenv(name);
    if (v === null || v === undefined) return fallback || "";
    return ObjC.unwrap(v);
  } catch (e) {
    return fallback || "";
  }
}

function shellQuote(s) {
  return "'" + String(s).replace(/'/g, "'\\''") + "'";
}

function run() {
  var app = Application.currentApplication();
  app.includeStandardAdditions = true;
  var scriptDir = env("ANTP_SCRIPT_DIR", "");
  if (!scriptDir) {
    console.log("ERROR: ANTP_SCRIPT_DIR not set");
    $.exit(1);
  }
  var b64path = scriptDir + "/lib/export-engine.payload.zlib.b64";
  var tmp = "/tmp/antp-export-engine-" + Date.now() + ".js";
  // payload is raw zlib (not gzip) + base64
  var py =
    "import base64,zlib,sys\n" +
    "open(sys.argv[2],'wb').write(zlib.decompress(base64.b64decode(open(sys.argv[1]).read())))\n";
  var pyfile = "/tmp/antp-decode-engine.py";
  try {
    app.doShellScript("printf %s " + shellQuote(py) + " > " + shellQuote(pyfile));
    app.doShellScript("python3 " + shellQuote(pyfile) + " " + shellQuote(b64path) + " " + shellQuote(tmp));
  } catch (e) {
    console.log("ERROR: failed to decode engine payload: " + e);
    $.exit(1);
  }
  try {
    app.doShellScript("osascript -l JavaScript " + shellQuote(tmp));
  } catch (e) {
    try { app.doShellScript("rm -f " + shellQuote(tmp) + " " + shellQuote(pyfile)); } catch (e2) {}
    throw e;
  }
  try { app.doShellScript("rm -f " + shellQuote(tmp) + " " + shellQuote(pyfile)); } catch (e) {}
}
