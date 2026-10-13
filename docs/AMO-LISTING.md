# Mozilla Add-ons listing material

Name: Album Grid for Suno
Suggested slug: album-grid-for-suno
Version: 1.0.0
Summary: Browse Suno albums with a remembered List/Grid selector, playable video covers and smaller bottom-right now-playing icons. Unofficial.
Category: Appearance (and Music & Video if offered)
License: MIT
Platform: Firefox desktop; Windows, macOS and Linux. Android has not been validated.
Data disclosure: Required browsingActivity, solely for Suno album/media requests. No developer analytics or telemetry.
Privacy policy: Paste docs/PRIVACY.md into the listing privacy-policy field.
Support contact: Use the publishing account's preferred public support contact or a repository URL after a remote repository exists. No contact information has been invented.

## Description

Give Suno albums a useful grid view.

Switch between List and Grid beside the album's playback controls. Grid view displays each track's own artwork, previews video covers silently on hover, and plays tracks through Suno's existing player when you click a thumbnail. Your choice is remembered across albums, and the controls wrap comfortably on narrow screens.

The native now-playing indicator is also half its original size and placed at the bottom-right, keeping artwork and videos visible. This improvement applies across Suno, including artist Songs grids.

Existing song links, likes, Remix and menus remain native. Covers stop animating offscreen or in List view, and reduced-motion preferences are respected.

The extension stores only the selected view locally. It requests the current album's public artwork metadata and media from Suno; these requests reveal that album/media to Suno. No analytics, ads or developer-operated servers are included.

Public album artwork is required. Use List view when reordering tracks. Firefox desktop 140+ is required. Suno changes may occasionally require an extension update.

Unofficial extension. Not affiliated with, endorsed by, or sponsored by Suno.

## Reviewer notes

Readable JavaScript and CSS are included directly in the extension archive. There is no minification, bundling, remote code or runtime dependency; no build step is required to review the runtime source.

Test using a public Suno album, for example https://suno.com/album/f13881c5-7e76-4835-82c5-74d5209972c7. No reviewer account credentials are provided or needed to view a public album; Suno may independently restrict audio playback behind its own sign-in flow.

1. Open the album and switch List/Grid in the header playback row.
2. Grid should show each rendered track's public artwork. Hover a cover with a video for a muted preview.
3. Click a thumbnail: the extension delegates to the existing native Suno play control. It does not independently download or play audio.
4. Resize the viewport; controls wrap and cards adapt.
5. Switch to List; the native list presentation returns and previews pause.
6. Navigate to another album without a full reload; the selector remains functional and the choice persists.
7. In Suno's artist Songs grid, start a track with video artwork. Its native Now playing indicator should be 34px square at bottom-right, with a 12px icon, rather than the original 68px/24px centered indicator.

API reads are anonymous GET requests restricted to the public album endpoint. The background listener validates sender origin, album identifier and page number, and returns only artwork metadata. browsingActivity is declared because the album identifier sent to Suno reveals the currently viewed album. Private browsing is disabled to avoid persisting session-derived preferences there.

Manual validation: the owner confirmed that the temporary extension works in their Firefox, including a narrow viewport. Automated coverage includes layout, native playback delegation, SPA navigation, failure fallback, video lifecycle and the compact native indicator.
