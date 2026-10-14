Version 1.2.1 adds artwork options and fixes video-cover selection:

- Optional sidebar artwork sizing: fit images and video covers to the panel width. Off by default.
- Separate controls for muted previews during playback and on hover. Hover previews default off.
- Still artwork stays visible when a track has no custom video cover, instead of switching to Suno's generated lyrics video.

Changes apply to open Suno tabs. Existing album/playlist Grid controls and compact playback indicators are preserved.

This release contains the Firefox extension ZIP and its SHA-256 checksum. GitHub also provides source archives.

For temporary testing, select the ZIP directly through Firefox's **Load Temporary Add-on** control on `about:debugging`. Open the extension's **Preferences/Options** to configure artwork behavior or enable playlist support.

The ZIP is an **unsigned Mozilla Add-ons submission package**. This GitHub release does not submit to or publish on Mozilla Add-ons. Mozilla signing is required for permanent installation in standard Firefox.
