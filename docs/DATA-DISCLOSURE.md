# Data disclosure rationale

The manifest declares required: ["none"]. The extension has no analytics, history API access, browsing-history records, developer-operated endpoint, custom tracking identifiers, or telemetry payloads.

The studio-api.prod.suno.com permission is needed by the current implementation to fetch the selected public album's image/video URLs. These anonymous GET requests omit credentials. The album ID and pagination identify the requested resource; they are not attached to a separate browsing-history or analytics report. Media is then loaded directly from Suno's CDN. The privacy policy documents this ordinary network activity.

Mozilla distinguishes incidental networking from explicit transmission of collected data. See the staff explanation in https://blog.mozilla.org/addons/2025/10/23/data-collection-consent-changes-for-new-firefox-extensions/ and https://discourse.mozilla.org/t/data-collection/148638. This is the classification used for this extension; Mozilla retains final review authority.

The initial 1.0.0 package conservatively but incorrectly declared browsingActivity for ordinary resource fetching. 1.0.1 corrects the declaration and documentation; it does not remove tracking code, since none existed.
