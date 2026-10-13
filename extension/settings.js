globalThis.sunoAlbumGridSettings = {
  defaults: { enablePlaylists: false, videoPreviews: true, compactIndicator: true },
  normalize(value = {}) {
    return { enablePlaylists: value.enablePlaylists === true, videoPreviews: value.videoPreviews !== false, compactIndicator: value.compactIndicator !== false };
  }
};
