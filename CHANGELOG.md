# Changelog

## 1.2.3 — 2026-10-17

- Restore optional sidebar artwork sizing after Suno class changes. Identify the cover from its descriptive image text without requiring a song-title link or a playing video; mark it ourselves, handle video insertion/removal and panel replacement, and leave ambiguous artwork unchanged.

## 1.2.2 — 2026-10-16

- Restore full-width Grid titles, hide relative dates and native thumbnail rails, and keep actions inside cards after Suno renamed its generated classes. Use structural selectors for these rules.
- Hide the native album track-number rail in Grid and preserve native playback delegation after rail class changes. List retains track numbers.

## 1.2.1 — 2026-10-14

- Separate hover video previews from playback previews; hover defaults off.

- Keep still artwork on hover/playback when no custom video cover exists; never fall back to generated lyrics videos.

- Add an opt-in setting to fit details-sidebar image/video artwork to the panel width. Applies live and restores native sizing when disabled.

## 1.1.0 — 2026-10-13

- Stack model/cover badges below the full-width title in Grid.

- Hide relative dates and redundant Remix buttons in Grid, retaining them in List and retaining remix actions in the native menu.

- Added Firefox Options with opt-in playlist List/Grid support.
- Added toggles for muted video previews and the compact native now-playing indicator.
- Apply settings to open tabs and remember album/playlist views separately.
- Playlist thumbnails invoke native playback rather than the selection checkbox.

## 1.0.1 — 2026-10-13

- Corrected the data-collection declaration to none. Normal Suno artwork/media retrieval had been overclassified as browsing-activity collection; no tracking code was present or removed.
- Clarified the privacy policy and reviewer notes while retaining anonymous public artwork requests.

## 1.0.0 — 2026-10-13

- First public-release package.
- Remembered album List/Grid selector in the playback-controls row.
- Responsive artwork cards and muted video cover previews.
- Native audio playback and existing song actions preserved.
- Smaller bottom-right now-playing indicator across Suno.
- Public metadata requests, local-only preference storage, privacy disclosure and disabled private-browsing access.

## 0.1.1

- Moved List/Grid into the album playback-controls row, with responsive wrapping.

## 0.1.0

- Initial working temporary extension and userscript prototype.
