# Homebrew formula (tap-ready).
# Install (once published to a tap):
#   brew install pitchfork-and-torch/tap/apple-notes-to-pdf
#
# Or install from a local clone:
#   brew install --formula ./homebrew/apple-notes-to-pdf.rb
#
# Note: export still requires macOS Notes.app + Automation permission.

class AppleNotesToPdf < Formula
  desc "Export Apple Notes to PDF, Markdown, HTML locally (no cloud)"
  homepage "https://github.com/Pitchfork-and-Torch/Apple-Notes-to-PDF"
  url "https://github.com/Pitchfork-and-Torch/Apple-Notes-to-PDF/archive/refs/tags/v7.0.0.tar.gz"
  # Update sha256 when publishing the tag:
  sha256 "REPLACE_WITH_TARBALL_SHA256"
  license "MIT"
  version "7.0.0"

  depends_on :macos

  def install
    libexec.install "export-apple-notes.sh"
    libexec.install "render-note-to-pdf.applescript"
    libexec.install "lib"
    libexec.install "VERSION"
    libexec.install "LICENSE"
    libexec.install "README.md"
    libexec.install "SECURITY.md"
    (bin/"apple-notes-to-pdf").write <<~EOS
      #!/bin/zsh
      exec "#{libexec}/export-apple-notes.sh" "$@"
    EOS
    chmod 0755, bin/"apple-notes-to-pdf"
    chmod 0755, libexec/"export-apple-notes.sh"
  end

  test do
    assert_match "7.0.0", shell_output("#{bin}/apple-notes-to-pdf --version")
    assert_match "Usage", shell_output("#{bin}/apple-notes-to-pdf --help")
  end
end
