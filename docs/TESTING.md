# Release validation — 1.2.2

Validated on 16 October 2026.

- Mozilla web-ext 10.7.0 lint: 0 errors, 0 warnings, 0 notices.
- Request/storage/release unit tests: 10 passed. Covers restricted origin and endpoint inputs, anonymous API reads, metadata minimization, failure handling, local preference storage and manifest/version consistency.
- Offline Chromium browser tests passed: header alignment and wrapping; recovery after header re-render; desktop/mobile cards; delegated native playback; List restoration; dynamically added tracks; SPA navigation; duplicate-injection protection; preference persistence; metadata-failure fallback; preview lifecycle; and the native 34px bottom-right indicator with 12px SVG.
- Additional regression coverage: generated lyrics videos are never used as cover previews; custom cover precedence; hover previews default off and work independently of playback; live options persistence; sidebar sizing and restoration at multiple widths.
- Earlier prototype testing included a real muted Suno video cover in an isolated browser.
- The owner confirmed that the temporary extension works in their Firefox, including the playback-row placement and narrow viewport.

Automated fixtures use invented track metadata and stub video playback for deterministic offline testing. They do not claim to reproduce every future Suno UI change or to replace manual testing against the live site.

The owner approved the tested 1.2.2 changes for release. The gecko_android minimum is declared as 142 to keep Mozilla validation accurate for its data-consent API; Android remains unvalidated and should not be selected for the AMO release.

The ZIP is unsigned. Public AMO publication and Mozilla signing have not happened yet.
Grid regression checks cover renamed Suno classes, full-width titles, hidden dates/native rails, native playback delegation and List restoration. The rendered public album and playlist were also checked in isolated Chrome, including hover and List restoration; this is separate from the owner's Firefox live-test approval.
