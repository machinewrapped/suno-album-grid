# Public AMO release

## Package

1. Run npm ci, npm run lint, npm test, npm run test:ui, and npm run build.
2. Upload the ZIP in dist/ through https://addons.mozilla.org/developers/addon/submit/distribution.
3. Sign in with the publishing Mozilla Account and accept any developer agreement personally.
4. Choose On this site for public listing and automatic updates.
5. Select Firefox desktop platforms. Android has not been validated.
6. The runtime is readable and unprocessed; no separate source-code archive is required for a minified build. If a reviewer requests full source, provide the repository source archive.
7. Paste the prepared listing, privacy policy and reviewer notes from docs/AMO-LISTING.md and docs/PRIVACY.md. Choose the desired public publisher identity and support contact.
8. Review the final listing, then submit. Download/install the Mozilla-signed release or install it from its AMO listing when available. The local unsigned ZIP is not a permanently installable signed add-on.

The stable extension ID is suno-album-grid@local.invalid. It is an identifier, not an email address or contact channel. Do not change it on future updates.

AMO manages updates for publicly listed versions, so no custom update_url is included. Signing/review is controlled by Mozilla; a ZIP on disk does not mean the extension is published.

## Future releases

Increment extension/manifest.json and package.json versions together. Document changes in CHANGELOG.md. Repeat validation and upload the new version to the existing AMO listing, rather than creating a second listing. Update the API/DOM selectors if Suno changes its implementation.
