/* Suno Album Grid. Public metadata only; audio stays in Suno's player. */
(() => {
  'use strict';
  const ROOT = 'suno-album-grid-v1';
  if (globalThis[ROOT]) return;
  globalThis[ROOT] = true;
  const transport = globalThis.sunoAlbumGridTransport;
  const rowSelector = '.clip-row-collection';
  const albums = new Map();
  const mounted = new Map();
  const mediaStates = new Set();
  let mode = 'list';
  let settings = { enablePlaylists:false, videoPreviews:true, hoverPreviews:false, compactIndicator:true, fitSidebarArtwork:false };
  let preferencesReady = false;
  let preferenceRequest = 0;
  let frame = 0;
  let path = location.pathname;
  const collectionKind = () => location.pathname.match(/^\/(album|playlist)\/[a-z0-9-]+\/?$/i)?.[1];
  const isSupportedCollection = () => preferencesReady && (collectionKind() === 'album' || (collectionKind() === 'playlist' && settings.enablePlaylists));
  const collectionId = () => location.pathname.split('/')[2];
  const setAttr = (node, name, value) => { if (node.getAttribute(name) !== value) node.setAttribute(name, value); };
  const safeMedia = value => {
    try { const url = new URL(value); return url.protocol === 'https:' && /(^|\.)suno\.(ai|com)$/.test(url.hostname) ? url.href : ''; }
    catch { return ''; }
  };
  const getId = row => row.querySelector('a[href*="/song/"]')?.getAttribute('href')?.match(/\/song\/([a-z0-9-]+)/i)?.[1];
  function getNativeRail(row) {
    let center = row.querySelector('.clip-title-wrapper');
    while (center && center.parentElement !== row) center = center.parentElement;
    const rail = center?.previousElementSibling;
    return rail && !rail.classList.contains('sag-media') ? rail : null;
  }
  const getPlay = row => row.querySelector('.clip-image-container[role="button"]') || getNativeRail(row)?.querySelector('button[aria-label][aria-disabled]');
  const pause = state => { if (state.video) state.video.pause(); state.button.classList.remove('sag-video-ready'); };
  const playPreview = state => {
    if (!(settings.videoPreviews && state.playing || settings.hoverPreviews && state.hovered) || mode !== 'grid' || !isSupportedCollection() || !state.visible || !state.videoUrl || document.hidden) { pause(state); return; }
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { pause(state); return; }
    if (!state.video) {
      const video = document.createElement('video');
      video.muted = true; video.loop = true; video.playsInline = true; video.preload = 'none';
      video.setAttribute('aria-hidden', 'true'); video.src = state.videoUrl;
      video.addEventListener('playing', () => state.button.classList.add('sag-video-ready'));
      video.addEventListener('error', () => pause(state));
      state.button.insertBefore(video, state.icon); state.video = video;
    }
    state.video.play().catch(() => pause(state));
  };
  const visibility = new IntersectionObserver(entries => {
    for (const entry of entries) {
      const state = entry.target.sagState;
      if (!state) continue;
      state.visible = entry.isIntersecting;
      playPreview(state);
    }
  }, { threshold: 0.05 });
  function removeMedia(row, state) {
    pause(state); visibility.unobserve(state.button); state.button.remove(); mediaStates.delete(state);
    for (const child of row.children) child.removeAttribute('data-sag-native-rail');
  }
  function attachMedia(row, clip) {
    const rail = getNativeRail(row);
    for (const child of row.children) child.toggleAttribute('data-sag-native-rail', child === rail);
    let button = [...row.children].find(node => node.classList.contains('sag-media'));
    const id = getId(row);
    if (button && button.sagState.id !== id) { removeMedia(row, button.sagState); button = null; }
    if (!button) {
      button = document.createElement('button'); button.type = 'button'; button.className = 'sag-media';
      button.dataset.sagOwned = 'true'; button.title = 'Play / pause in Suno';
      const icon = document.createElement('span'); icon.className = 'sag-play'; icon.setAttribute('aria-hidden', 'true');
      const state = { id, row, button, icon, video:null, videoUrl:'', hovered:false, playing:false, visible:false, imageUrl:'' };
      button.sagState = state;
      button.addEventListener('pointerdown', event => event.stopPropagation());
      button.addEventListener('click', event => {
        event.preventDefault(); event.stopPropagation();
        const nativePlay = getPlay(row);
        if (nativePlay && nativePlay.getAttribute('aria-disabled') !== 'true') nativePlay.click();
      });
      button.addEventListener('pointerenter', () => { state.hovered = true; playPreview(state); });
      button.addEventListener('pointerleave', () => { state.hovered = false; playPreview(state); });
      const placeholder = document.createElement('span'); placeholder.className='sag-placeholder'; placeholder.textContent='Loading artwork…';
      button.append(placeholder, icon); row.prepend(button); mediaStates.add(state); visibility.observe(button);
    }
    const state = button.sagState;
    if (clip) {
      const imageUrl = safeMedia(clip.image_large_url || clip.image_url);
      if (imageUrl && state.imageUrl !== imageUrl) {
        state.imageUrl = imageUrl;
        const image = document.createElement('img'); image.src = imageUrl; image.alt = ''; image.loading = 'lazy'; image.decoding = 'async';
        image.addEventListener('load', () => { const p=button.querySelector('.sag-placeholder'); if(p) p.hidden=true; });
        image.addEventListener('error', () => { image.remove(); const p=button.querySelector('.sag-placeholder'); if(p) { p.hidden=false; p.textContent='Artwork unavailable'; } });
        button.querySelector('img')?.remove(); button.insertBefore(image, button.firstChild);
      }
      // Match Suno's cover selector. video_url can be a generated lyrics video.
      const videoUrl = safeMedia(clip.metadata?.video_to_song_video_upload_url || clip.video_cover_url);
      if (state.videoUrl !== videoUrl) { pause(state); state.video?.remove(); state.video=null; state.videoUrl=videoUrl; }
      const placeholder=button.querySelector('.sag-placeholder');
      if(placeholder && !imageUrl) placeholder.textContent='Artwork unavailable';
    }
    const nativePlay = getPlay(row);
    setAttr(button, 'aria-label', nativePlay?.getAttribute('aria-label') || 'Play song');
    setAttr(button, 'aria-disabled', nativePlay?.getAttribute('aria-disabled') || 'false');
    // Suno changes its native play button to pause while this track is active.
    state.playing = /pause/i.test(nativePlay?.getAttribute('aria-label') || '');
    state.icon.textContent = state.playing ? 'Ⅱ' : '▶';
    playPreview(state);
  }
  function dataFor(id) {
    if (!albums.has(id)) albums.set(id, { clips:new Map(), page:0, total:Infinity, fetched:0, done:false, busy:false, error:false });
    return albums.get(id);
  }
  async function loadMetadata(id, ids) {
    const data = dataFor(id);
    if (data.busy || data.done || data.error || ids.every(key => data.clips.has(key))) return;
    data.busy = true; schedule();
    try {
      // Only fetch further metadata when rendered rows need it, preserving lazy loading.
      while (!data.done && !ids.every(key => data.clips.has(key))) {
        const result = await transport.getAlbumPage(id, data.page + 1);
        if (!result || !Array.isArray(result.playlist_clips)) throw new Error('Unexpected album response');
        data.page++; data.fetched += result.playlist_clips.length;
        for (const entry of result.playlist_clips) if (entry.clip?.id) data.clips.set(entry.clip.id, entry.clip);
        const total = Number(result.num_total_results);
        if (Number.isFinite(total) && total >= 0) data.total = total;
        data.done = result.playlist_clips.length === 0 || data.fetched >= data.total;
        if (!isSupportedCollection() || collectionId() !== id || mode !== 'grid') break;
      }
    } catch (error) { data.error = true; console.warn('Suno Album Grid: artwork could not be loaded.', error.message); }
    finally { data.busy = false; schedule(); }
  }
  function toolbarFor(list) {
    if (mounted.has(list)) return mounted.get(list);
    const toolbar=document.createElement('div'); toolbar.className='sag-toolbar'; toolbar.dataset.sagOwned='true';
    const status=document.createElement('span'); status.className='sag-status'; status.setAttribute('role','status'); status.setAttribute('aria-live','polite');
    const toggle=document.createElement('div'); toggle.className='sag-toggle'; toggle.setAttribute('role','group'); toggle.setAttribute('aria-label','Album view');
    for(const [value,label,shape] of [['list','List','M4 5h16M4 12h16M4 19h16'],['grid','Grid','M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z']]) {
      const button=document.createElement('button'); button.type='button'; button.dataset.view=value;
      const svg=document.createElementNS('http://www.w3.org/2000/svg','svg'); svg.setAttribute('viewBox','0 0 24 24'); svg.setAttribute('fill','none'); svg.setAttribute('stroke','currentColor'); svg.setAttribute('stroke-width','2'); svg.setAttribute('aria-hidden','true');
      const p=document.createElementNS('http://www.w3.org/2000/svg','path'); p.setAttribute('d',shape); svg.append(p); button.append(svg,document.createTextNode(label));
      button.addEventListener('click',()=>{ mode=value; transport.setMode(value, collectionKind()).catch(()=>{}); schedule(); }); toggle.append(button);
    }
    toolbar.append(status,toggle); list.before(toolbar);
    const state={ toolbar,status,toggle }; mounted.set(list,state); return state;
  }
  function placeToolbar(list, state) {
    const main = list.closest('main');
    // Suno's album header places the playback buttons in an inner group,
    // inside a full-width flex row. Keep the existing controls untouched.
    const controls = [...(main?.querySelectorAll('button[aria-label="Shuffle album"], button[aria-label="Shuffle playlist"]') || [])]
      .map(button => button.parentElement?.parentElement)
      .filter(host => host?.classList.contains('flex') && host.classList.contains('w-full') &&
        host.classList.contains('flex-row') && !host.closest('.clip-row') &&
        (host.compareDocumentPosition(list) & Node.DOCUMENT_POSITION_FOLLOWING))
      .at(-1);
    if (state.host && state.host !== controls) state.host.classList.remove('sag-controls-row');
    state.host = controls;
    state.toolbar.classList.toggle('sag-toolbar-inline', Boolean(controls));
    if (controls) {
      controls.classList.add('sag-controls-row');
      if (state.toolbar.parentElement !== controls) controls.append(state.toolbar);
    } else if (state.toolbar.nextElementSibling !== list) list.before(state.toolbar);
  }
  function sync() {
    frame=0; observer.disconnect();
    document.documentElement.toggleAttribute('data-sag-compact-icons', preferencesReady && settings.compactIndicator);
    document.documentElement.toggleAttribute('data-sag-fit-sidebar', preferencesReady && settings.fitSidebarArtwork);
    try {
      const candidates=isSupportedCollection() ? [...document.querySelectorAll('main ul')].filter(list=>!list.closest('.scrollbar-hide.absolute') && [...list.children].some(li=>li.querySelector(rowSelector+' a[href*="/song/"]'))) : [];
      const current=new Set(candidates);
      for(const [list,state] of mounted) if(!current.has(list)) { list.removeAttribute('data-sag-view'); state.toolbar.remove(); state.host?.classList.remove('sag-controls-row'); mounted.delete(list); }
      for(const state of mediaStates) if(!state.row.isConnected || !isSupportedCollection() || !current.has(state.row.closest('ul'))) removeMedia(state.row,state);
      for(const list of candidates) {
        const state=toolbarFor(list);
        const {toolbar,status,toggle}=state;
        placeToolbar(list,state);
        setAttr(toggle,'aria-label',collectionKind() === 'playlist' ? 'Playlist view' : 'Album view');
        setAttr(list,'data-sag-view',mode);
        for(const button of toggle.children) setAttr(button,'aria-pressed',String(button.dataset.view===mode));
        const data=dataFor(collectionId());
        const rows=[...list.children].map(li=>li.querySelector(rowSelector)).filter(Boolean);
        status.textContent=mode==='grid' ? (data.error ? 'Artwork unavailable — List view still works' : data.busy ? 'Loading artwork…' : '') : '';
        if(mode==='grid') {
          for(const row of rows) attachMedia(row,data.clips.get(getId(row)));
          loadMetadata(collectionId(),rows.map(getId).filter(Boolean));
        }
      }
      if(mode!=='grid' || !isSupportedCollection()) for(const state of mediaStates) pause(state);
    } finally { observer.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['aria-label','aria-disabled']}); }
  }
  function schedule() { if(!frame) frame=requestAnimationFrame(sync); }
  const observer=new MutationObserver(schedule);
  observer.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['aria-label','aria-disabled']});
  addEventListener('popstate',()=>{path=location.pathname;mode='list';refreshPreferences();schedule();});
  document.addEventListener('visibilitychange',()=>{for(const state of mediaStates) playPreview(state);});
  // A content script's isolated world cannot reliably patch the page's history API.
  setInterval(()=>{if(location.pathname!==path){path=location.pathname;mode='list';refreshPreferences();schedule();}},700);
  async function refreshPreferences() {
    const request = ++preferenceRequest;
    const currentPath = location.pathname;
    try {
      const [storedSettings, value] = await Promise.all([
        transport.getSettings ? transport.getSettings() : settings,
        transport.getMode(collectionKind())
      ]);
      if (request !== preferenceRequest || currentPath !== location.pathname) return;
      settings = storedSettings;
      mode = value === 'grid' ? 'grid' : 'list';
      preferencesReady = true;
      schedule();
    } catch (error) { preferencesReady = true; schedule(); }
  }
  transport.onSettingsChanged?.(refreshPreferences);
  refreshPreferences();
  schedule();
})();