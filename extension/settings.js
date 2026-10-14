globalThis.sunoAlbumGridSettings = {
  defaults: { enablePlaylists: false, videoPreviews: true, hoverPreviews: false, compactIndicator: true, fitSidebarArtwork: false },
  normalize(value = {}) {
    return { enablePlaylists: value.enablePlaylists === true, videoPreviews: value.videoPreviews !== false, hoverPreviews: value.hoverPreviews === true, compactIndicator: value.compactIndicator !== false, fitSidebarArtwork: value.fitSidebarArtwork === true };
  }
};
