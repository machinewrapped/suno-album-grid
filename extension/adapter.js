/* Firefox content-script adapter. */
globalThis.sunoAlbumGridTransport = {
  async getMode() { const value=await browser.storage.local.get('albumView'); return value.albumView || 'list'; },
  async setMode(value) { await browser.storage.local.set({albumView:value}); },
  async getAlbumPage(id,page) {
    const response=await browser.runtime.sendMessage({type:'album-grid-metadata',id,page});
    if(!response?.ok) throw new Error(response?.error || 'Album metadata unavailable');
    return response.data;
  }
};