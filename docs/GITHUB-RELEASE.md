Version 1.2.2 restores Grid layout after Suno changed its generated class names:

- Titles fill the card width, with model/COVER badges below.
- Relative dates and duplicate native thumbnails stay hidden in Grid.
- Native album track-number/play controls stay hidden in Grid, including on hover. Artwork clicks still delegate to Suno's player.
- Card actions stay within the card, and List view retains its native layout and controls.
- Structural selectors and extension-owned rail markers replace the affected generated-class selectors.

This release contains the Firefox extension ZIP and its SHA-256 checksum. GitHub also provides source archives.

For temporary testing, select the ZIP directly through Firefox's **Load Temporary Add-on** control on `about:debugging`.

The ZIP is an **unsigned Mozilla Add-ons submission package**. This GitHub release does not submit to or publish on Mozilla Add-ons. Mozilla signing is required for permanent installation in standard Firefox.
