# Privacy policy — Album Grid for Suno

Effective date: 16 October 2026. Version: 1.2.2.

The extension does not collect or report browsing history, usage analytics, account information or other personal data. The developer receives no user data and operates no backend for this extension. The extension includes no analytics, advertising, telemetry, tracking identifiers or remote executable code.

## Local storage

The album and playlist List/Grid preferences and five options (playlist support, playback video previews, hover video previews, compact indicator and sidebar artwork width) are saved in Firefox's local extension storage. They are not synchronized by this extension or sent to the developer. Album/playlist metadata is held temporarily in memory while a Suno tab is open. The extension does not run in private browsing.

## Requests to Suno

When Grid view needs artwork, the extension sends the current Suno album or opted-in playlist identifier and page number to https://studio-api.prod.suno.com/api/playlist/ to retrieve public track metadata. These API requests explicitly omit cookies and do not include account tokens. The identifier specifies the album or playlist whose artwork is requested. Images and muted video previews are then requested from Suno's CDN domains. As with normal web requests, Suno/CDN providers receive requested URLs and network metadata such as the IP address and browser request headers; media requests follow the browser's normal networking behavior. Suno's own privacy policy applies to its services.

These requests are used only to display the album artwork and video covers. The extension does not send lyrics, account details, passwords, other browsing history, or the saved view preference to the developer or any third-party service operated by the developer. Clicking a thumbnail invokes Suno's existing player, which continues to operate under Suno's own policies.

## Permissions and control

Storage remembers view preferences and the five options. Access to suno.com modifies the album presentation and playback indicator. Access to studio-api.prod.suno.com retrieves public album artwork metadata. The manifest declares no data collection. Ordinary requests for the chosen album's artwork and media remain necessary to display them; this declaration does not mean that the extension works offline or that Suno never receives web requests.

Select List to stop cover previews; disable or remove the extension to stop its enhancements and API requests. Previously requested media may remain in the browser cache. Removing the extension removes its local extension storage.
