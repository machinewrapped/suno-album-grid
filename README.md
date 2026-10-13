# Album Grid for Suno

An unofficial Firefox extension that makes Suno albums easier to browse.

- List/Grid selector beside the album playback controls, with responsive wrapping.
- Large per-track artwork and muted video-cover previews on hover or playback.
- Thumbnail clicks use Suno's existing player; title links, likes, Remix and menus remain native.
- Remembers the selected view across albums.
- Smaller native now-playing indicator, half the original size and anchored bottom-right. This applies across Suno, including the artist Songs grid.
- Videos pause when offscreen or in List view, and respect reduced-motion preferences.

Not affiliated with, endorsed by, or sponsored by Suno.

## Install

Public Mozilla Add-ons release is pending submission and signing. Until then, open Firefox's about:debugging#/runtime/this-firefox, choose Load Temporary Add-on, and select extension/manifest.json. Temporary installation lasts until Firefox exits. The unsigned build ZIP is for AMO submission and does not install permanently in standard Firefox.

Firefox desktop 140 or newer is required. Private browsing is disabled for this extension.

## Development

Use Node.js 22 or newer and npm:

    npm ci
    npm run lint
    npm test
    npx playwright install chromium
    npm run test:ui
    npm run build

For UI tests, set PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH to an existing Chromium-based browser if you do not use Playwright's bundled Chromium. npm start opens Firefox with the temporary extension. No source compilation is needed; extension/ contains the readable runtime source. The generated archive is written to dist/.

## Privacy and permissions

The developer operates no server and receives no extension data. No analytics, advertising or telemetry is included. The selected view is stored only in Firefox's local extension storage.

Grid view requests the current album identifier from Suno's public API to obtain artwork, then loads images/videos from Suno's CDN. Requests expose the requested album/media and normal network metadata to Suno. API requests omit cookies and account tokens. The installation disclosure declares browsing activity because these requests identify the Suno album being viewed. See docs/PRIVACY.md.

The only API permission is storage. Host access is limited to suno.com and studio-api.prod.suno.com. The script runs on Suno routes so client-side navigation into an album works; only album lists are rearranged.

## Known limits

Public album metadata is required for artwork; private or unpublished albums may not provide it. Native List view remains available if artwork cannot be loaded. Use List view to reorder tracks because Suno's drag behavior is designed for vertical lists. English album-control accessibility labels are used to place the selector; if those controls cannot be recognized, it appears above the songs. Suno DOM/API changes may require an extension update.

## Release

See docs/RELEASE.md and docs/AMO-LISTING.md. For public AMO distribution, keep the existing add-on ID across releases, increment manifest and package versions, validate/test, then upload the build to the existing AMO listing. Mozilla signs the extension and provides automatic updates for listed releases.
