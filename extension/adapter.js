/* Firefox storage and metadata adapter. */
globalThis.sunoAlbumGridTransport = {
  async getMode(kind = 'album') { const key = kind === 'playlist' ? 'playlistView' : 'albumView'; const value = await browser.storage.local.get(key); return value[key] === 'grid' ? 'grid' : 'list'; },
  async setMode(value, kind = 'album') { const key = kind === 'playlist' ? 'playlistView' : 'albumView'; await browser.storage.local.set({[key]: value}); },
  async getSettings() { return sunoAlbumGridSettings.normalize(await browser.storage.local.get(sunoAlbumGridSettings.defaults)); },
  onSettingsChanged(callback) { browser.storage.onChanged.addListener((changes, area) => { if (area === 'local') callback(); }); },
  async getAlbumPage(id, page) {
    const response = await browser.runtime.sendMessage({type:'album-grid-metadata',id,page});
    if (!response?.ok) throw new Error(response?.error || 'Artwork metadata unavailable');
    return response.data;
  }
};
