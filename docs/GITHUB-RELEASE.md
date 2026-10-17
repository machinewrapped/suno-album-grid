Version 1.2.3 restores the optional full-width sidebar artwork setting after Suno changed its generated classes.

- Identify song artwork from its descriptive image text and mark the container ourselves, rather than depending on generated class names.
- Support still artwork without a song-title link or video, and video covers inserted during playback.
- Reapply sizing when Suno replaces the details panel; restore native sizing when the option is disabled.
- Leave ambiguous artwork unchanged.

Enable **Fit sidebar artwork to the panel width** in the extension's Preferences/Options. This option remains off by default.

This release contains the Firefox extension ZIP and its SHA-256 checksum. GitHub also provides source archives.

For temporary testing, select the ZIP directly through Firefox's **Load Temporary Add-on** control on `about:debugging`.

The ZIP is an **unsigned Mozilla Add-ons submission package**. This GitHub release does not submit to or publish on Mozilla Add-ons. Mozilla signing is required for permanent installation in standard Firefox.
