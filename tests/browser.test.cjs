const fs=require('fs');
const path=require('path');
const assert=require('assert/strict');
const {chromium,firefox}=require('playwright');
const dir=path.resolve(__dirname,'../extension');
fs.mkdirSync(path.resolve(__dirname,'../artifacts'),{recursive:true});
const css=fs.readFileSync(path.join(dir,'album-grid.css'),'utf8');
const js=fs.readFileSync(path.join(dir,'album-grid.js'),'utf8');
const iconCss=css;
const album={playlist_clips:Array.from({length:7},(_,index)=>({clip:{id:'00000000-0000-4000-8000-'+String(index+1).padStart(12,'0'),title:'Demo track '+(index+1),image_url:'https://cdn2.suno.ai/demo-'+index+'.svg',video_cover_url:'https://cdn1.suno.ai/demo-'+index+'.mp4',display_tags:'Example genre',metadata:{duration:236}}})),num_total_results:7};
const clips=album.playlist_clips.map(e=>e.clip);
const url='https://suno.com/album/f13881c5-7e76-4835-82c5-74d5209972c7';
const nativeCss=`.title-line{display:flex;align-items:center;gap:8px}.title-owner{flex:1;min-width:0}.model-badge,.cover-badge{flex-shrink:0;font-size:11px;white-space:nowrap}.album-controls{display:flex;width:100%;align-items:center;gap:8px}.native-controls{display:flex;gap:12px;align-items:center}.native-controls button{height:56px;min-width:56px}*{box-sizing:border-box}body{margin:0;background:#101011;color:#eee;font:14px system-ui}main{padding:24px;max-width:1100px;margin:auto}h1{font-size:40px}ul{display:flex;flex-direction:column;gap:4px;padding:0;list-style:none}.clip-row-collection{display:flex;align-items:center;justify-content:space-between;gap:16px;height:88px;padding:12px;border-radius:20px;container-type:size}.eg1nvup1{display:flex;align-items:center;flex-shrink:0}.eg1nvup2{display:flex;flex-direction:column;gap:8px;flex:1;min-width:0}.clip-title-wrapper{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-weight:650}.right{max-width:60%;display:flex;gap:12px}.actions{display:flex;gap:8px}a{color:inherit;text-decoration:none}button{background:#28282b;color:inherit;border:0;border-radius:100px;padding:10px;font:inherit;cursor:pointer}.track{width:40px;height:60px}.hover-only{opacity:0}.clip-row-collection:hover .hover-only{opacity:1}`;
function row(clip,index){
 const li=document.createElement('li');
 const row=document.createElement('div');row.className='clip-row group clip-row-collection';row.setAttribute('role','group');row.setAttribute('aria-label',clip.title);
 const left=document.createElement('div');left.className='eg1nvup1';
 const play=document.createElement('button');play.className='track tabular-nums';play.setAttribute('aria-label','Play '+clip.title);play.setAttribute('aria-disabled','false');play.textContent=String(index+1);
 play.addEventListener('click',()=>{window.nativeClicks=(window.nativeClicks||0)+1; const active=play.getAttribute('aria-label').startsWith('Pause');play.setAttribute('aria-label',(active?'Play ':'Pause ')+clip.title);});left.append(play);
 const center=document.createElement('div');center.className='eg1nvup2';
 const title=document.createElement('div');title.className='clip-title-wrapper';const link=document.createElement('a');link.href='/song/'+clip.id;link.textContent=clip.title;title.append(link);
 const primary=document.createElement('div');primary.className='eg1nvup0';
 const titleLine=document.createElement('div');titleLine.className='title-line flex items-center gap-2';
 const titleOwner=document.createElement('div');titleOwner.className='title-owner renamed-title-owner';titleOwner.append(title);
 const model=document.createElement('span');model.className='model-badge';model.textContent='V5.5';
 const cover=document.createElement('span');cover.className='cover-badge';cover.textContent='COVER';
 titleLine.append(titleOwner,model,cover);primary.append(titleLine);
 const metadata=document.createElement('div');metadata.textContent=(clip.display_tags||clip.metadata.tags||'').slice(0,100);metadata.style.cssText='color:#aaa;font-size:12px;overflow:hidden;max-height:34px';center.append(primary,metadata);
 const right=document.createElement('div');right.className='right';right.innerHTML='<span>3:56</span><div class="actions"><button class="hover-only" aria-label="Remix">Remix</button><button aria-label="Like">♡</button><button aria-label="More options">•••</button></div>';
 row.append(left,center,right);li.append(row);return li;
}
(async()=>{
 const useFirefox=process.env.PLAYWRIGHT_BROWSER==='firefox';
 const browser=await (useFirefox?firefox:chromium).launch({...(!useFirefox&&process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH?{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH}:{}),headless:true});
 try{
  const context=await browser.newContext({viewport:{width:1100,height:1000},reducedMotion:'reduce'});
  await context.addInitScript(()=>{
    // Deterministic offline checks for preview lifecycle; no third-party media is downloaded.
    const playing=new WeakSet();
    Object.defineProperty(HTMLMediaElement.prototype,'paused',{get(){return !playing.has(this);}});
    Object.defineProperty(HTMLMediaElement.prototype,'readyState',{get(){return this.src?4:0;}});
    HTMLMediaElement.prototype.play=function(){playing.add(this);queueMicrotask(()=>this.dispatchEvent(new Event('playing')));return Promise.resolve();};
    HTMLMediaElement.prototype.pause=function(){playing.delete(this);};
  });
  await context.route('https://cdn2.suno.ai/**',route=>route.fulfill({contentType:'image/svg+xml',body:'<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><rect width="300" height="300" fill="#19343a"/><circle cx="150" cy="150" r="95" fill="#ff9248"/><path d="m130 100 70 50-70 50z" fill="#17171e"/></svg>'}));
  await context.route('https://cdn1.suno.ai/**',route=>route.fulfill({body:''}));
  await context.route('https://suno.com/**',route=>route.fulfill({contentType:'text/html',body:`<!doctype html><meta charset="utf-8"><style>${nativeCss}</style><main><h1>Demo album</h1><p style="color:#aaa">Album Grid for Suno · automated layout fixture</p><div class="album-controls flex w-full flex-row"><div class="native-controls flex flex-row"><button aria-label="Play album">▶ Play</button><button aria-label="Shuffle album">⇄</button><button aria-label="Share album">↗</button><button aria-label="More actions">•••</button></div></div><ul aria-label="6 songs"></ul></main>`}));
  const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url);
  await page.evaluate(({clips,rowSource})=>{window.createRow=eval('('+rowSource+')');for(const [index,clip] of clips.slice(0,6).entries())document.querySelector('ul').append(window.createRow(clip,index));},{clips,rowSource:row.toString()});
  await page.evaluate(data=>{window.sunoAlbumGridTransport={getMode:async()=>localStorage.getItem('testMode')||'list',setMode:async value=>localStorage.setItem('testMode',value),getAlbumPage:async()=>data};},album);
  await page.addStyleTag({content:css});await page.addScriptTag({content:js});
  await page.locator('.sag-toolbar').waitFor();
  assert.equal(await page.locator('.album-controls > .sag-toolbar').count(),1);
  const alignment=await page.evaluate(()=>{const play=document.querySelector('[aria-label="Play album"]').getBoundingClientRect();const toggle=document.querySelector('.sag-toggle').getBoundingClientRect();return Math.abs((play.top+play.bottom)/2-(toggle.top+toggle.bottom)/2);});
  assert(alignment<2,'List/Grid should share the playback row');
  await page.evaluate(()=>document.querySelector('[aria-label="Play album"]').setAttribute('aria-label','Pause album'));
  await page.waitForTimeout(50);
  assert.equal(await page.locator('.album-controls > .sag-toolbar').count(),1);
  // Header re-renders should reattach the same selector to the new control row.
  await page.evaluate(()=>{const old=document.querySelector('.album-controls');const replacement=old.cloneNode(true);replacement.querySelector('.sag-toolbar').remove();old.replaceWith(replacement);});
  await page.waitForFunction(()=>document.querySelector('.album-controls > .sag-toolbar'));
  assert.equal(await page.locator('.sag-toolbar').count(),1);
  assert.equal(await page.locator('ul').getAttribute('data-sag-view'),'list');
  await page.getByRole('button',{name:'Grid',exact:true}).click();
  await page.waitForFunction(()=>document.querySelectorAll('.sag-media img').length===6);
  assert.equal(await page.locator('.sag-media').count(),6);
  assert.equal(await page.locator('.eg1nvup1').first().isVisible(),false,'Album number rail stays hidden despite renamed generated classes');
  assert.equal(await page.locator('.eg1nvup1').first().getAttribute('data-sag-native-rail'),'','Native rail is explicitly marked for Firefox');
  assert.equal(await page.locator('.sag-media').first().getAttribute('aria-label'),'Play Demo track 1','Numbered album control remains the playback source');
  const titleLayout=await page.locator('.title-line').first().evaluate(line=>{
    const title=line.querySelector('.title-owner').getBoundingClientRect(),model=line.querySelector('.model-badge').getBoundingClientRect(),cover=line.querySelector('.cover-badge').getBoundingClientRect();
    return {fullWidth:Math.abs(title.width-line.getBoundingClientRect().width)<1,below:model.top>=title.bottom,sameRow:Math.abs(model.top-cover.top)<1};
  });
  assert.deepEqual(titleLayout,{fullWidth:true,below:true,sameRow:true},'Grid title fills width with badges on the next row');
  const rects=await page.locator('ul>li').evaluateAll(nodes=>nodes.map(n=>{const r=n.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width};}));
  assert(rects[0].x<rects[1].x && rects[0].y===rects[1].y,'Desktop cards should form a grid');
  await page.locator('.sag-media').first().click();
  await page.waitForFunction(()=>document.querySelector('.sag-media').getAttribute('aria-label').startsWith('Pause'));
  assert.equal(await page.evaluate(()=>window.nativeClicks),1,'Artwork must delegate to native player');
  await page.getByRole('button',{name:'List',exact:true}).click();
  await page.waitForFunction(()=>document.querySelector('ul').dataset.sagView==='list');
  assert.equal(await page.locator('.sag-media').first().isVisible(),false);
  assert.equal(await page.locator('ul').evaluate(n=>getComputedStyle(n).display),'flex');
  assert.equal(await page.locator('.eg1nvup1').first().isVisible(),true,'Album track numbers return in List');
  assert.equal(await page.locator('.title-line').first().evaluate(line=>getComputedStyle(line).flexWrap),'nowrap','List retains its horizontal title row');
  await page.getByRole('button',{name:'Grid',exact:true}).click();
  await page.evaluate(({clip,rowSource})=>document.querySelector('ul').append(window.createRow(clip,6)),{clip:clips[6]});
  await page.waitForFunction(()=>document.querySelectorAll('.sag-media img').length===7);
  assert.equal(await page.locator('.sag-toolbar').count(),1,'No duplicate selector after row mutation');
  await page.evaluate(()=>{history.pushState({},'', '/create');window.dispatchEvent(new PopStateEvent('popstate'));});
  await page.waitForFunction(()=>!document.querySelector('.sag-toolbar'));
  assert.equal(await page.locator('.sag-media').count(),0,'Injected artwork removed outside album pages');
  assert.equal(await page.locator('.sag-controls-row').count(),0,'Header layout marker removed outside albums');
  await page.evaluate(url=>{history.pushState({},'',url);window.dispatchEvent(new PopStateEvent('popstate'));},url);
  await page.waitForFunction(()=>document.querySelectorAll('.sag-media').length===7);
  assert.equal(await page.locator('ul').getAttribute('data-sag-view'),'grid');
  await page.addScriptTag({content:js});assert.equal(await page.locator('.sag-toolbar').count(),1);
  await page.waitForFunction(()=>[...document.querySelectorAll('.sag-media img')].every(img=>img.complete && img.naturalWidth>0));
  assert.equal(await page.locator('.sag-placeholder:not([hidden])').count(),0);
  await page.screenshot({path:path.resolve(__dirname,'../artifacts/grid-desktop.png'),fullPage:true});
  await page.setViewportSize({width:400,height:900});await page.waitForTimeout(100);
  const sizes=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,card:document.querySelector('.sag-media').getBoundingClientRect().width,icon:document.querySelector('.sag-play').getBoundingClientRect().width}));
  assert(sizes.scroll<=sizes.width,'Grid must not overflow on mobile');assert.equal(sizes.icon,34);
  await page.screenshot({path:path.resolve(__dirname,'../artifacts/grid-mobile.png'),fullPage:true});
  // Exact native indicator structure supplied by the user.
  await page.addStyleTag({content:iconCss});
  await page.evaluate(()=>{const host=document.createElement('div');host.id='native-indicator-test';host.style='position:relative;width:300px;height:300px';host.innerHTML='<div class="absolute inset-0 z-20" style="position:absolute;inset:0"><button aria-label="Now playing" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:68px;height:68px"><svg style="width:24px;height:24px"></svg></button></div>';document.body.append(host);});
  const icon=await page.locator('#native-indicator-test button').evaluate(n=>{const r=n.getBoundingClientRect(),p=n.parentElement.getBoundingClientRect();return {w:r.width,h:r.height,right:p.right-r.right,bottom:p.bottom-r.bottom,svg:n.firstElementChild.getBoundingClientRect().width};});
  assert.deepEqual(icon,{w:34,h:34,right:8,bottom:8,svg:12});
  assert.deepEqual(errors,[]);
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.locator('.sag-media').nth(1).hover();
  await page.waitForTimeout(100);
  assert.equal(await page.locator('.sag-media').nth(1).locator('video').count(),0,'Hover previews default off');
  await page.locator('.sag-media').nth(1).click();
  await page.waitForFunction(()=>{const video=document.querySelectorAll('.sag-media')[1]?.querySelector('video');return video && video.readyState>=2 && !video.paused;},{},{timeout:20000});
  assert.equal(await page.locator('.sag-media').nth(1).locator('video').evaluate(v=>v.muted),true);
  await page.getByRole('button',{name:'List',exact:true}).click();
  await page.waitForFunction(()=>[...document.querySelectorAll('.sag-media video')].every(v=>v.paused));
  await page.getByRole('button',{name:'Grid',exact:true}).click();
  // Custom still covers must never become generated lyrics videos on hover or playback.
  const coverPage=await context.newPage();await coverPage.goto(url);
  await coverPage.emulateMedia({reducedMotion:'no-preference'});
  const coverClips=clips.slice(0,3).map((clip,index)=>({...clip,
    video_url:'https://cdn1.suno.ai/lyrics-'+index+'.mp4',
    video_cover_url:index===0?'':clip.video_cover_url,
    metadata:index===2?{video_to_song_video_upload_url:'https://cdn1.suno.ai/uploaded-cover.mp4'}:{}
  }));
  await coverPage.evaluate(({clips,rowSource})=>{
    const createRow=eval('('+rowSource+')');
    for(const [index,clip] of clips.entries())document.querySelector('ul').append(createRow(clip,index));
    window.sunoAlbumGridTransport={getSettings:async()=>({videoPreviews:true,hoverPreviews:true}),getMode:async()=>'grid',setMode:async()=>{},getAlbumPage:async()=>({playlist_clips:clips.map(clip=>({clip})),num_total_results:clips.length})};
  },{clips:coverClips,rowSource:row.toString()});
  await coverPage.addStyleTag({content:css});await coverPage.addScriptTag({content:js});
  await coverPage.waitForFunction(()=>document.querySelectorAll('.sag-media img').length===3);
  const still=coverPage.locator('.sag-media').first();
  await still.hover();await still.click();
  await coverPage.waitForFunction(()=>document.querySelector('.sag-media').getAttribute('aria-label').startsWith('Pause'));
  await coverPage.waitForTimeout(100);
  assert.equal(await still.locator('video').count(),0,'Still cover stays still on hover and during playback, despite video_url');
  assert.equal(await still.locator('img').getAttribute('src'),coverClips[0].image_url);
  for(const [index,expected] of [[1,coverClips[1].video_cover_url],[2,coverClips[2].metadata.video_to_song_video_upload_url]]) {
    const media=coverPage.locator('.sag-media').nth(index);await media.hover();
    await coverPage.waitForFunction(index=>document.querySelectorAll('.sag-media')[index]?.querySelector('video')?.paused===false,index);
    assert.equal(await media.locator('video').getAttribute('src'),expected,'Use custom cover video with native field precedence');
  }
  await coverPage.close();

  // Separate page proves saved preference is read and failures leave List available.
  const errorPage=await context.newPage();await errorPage.goto(url);
  await errorPage.evaluate(({clip,rowSource})=>{document.querySelector('ul').append(eval('('+rowSource+')')(clip,0));window.sunoAlbumGridTransport={getMode:async()=>localStorage.getItem('testMode'),setMode:async()=>{},getAlbumPage:async()=>{throw new Error('Simulated API outage')}};},{clip:clips[0],rowSource:row.toString()});
  await errorPage.evaluate(()=>document.querySelector('.album-controls').remove());
  await errorPage.addStyleTag({content:css});await errorPage.addScriptTag({content:js});
  await errorPage.getByText('Artwork unavailable — List view still works').waitFor();
  assert.equal(await errorPage.locator('.sag-toolbar').evaluate(n=>n.nextElementSibling.tagName),'UL','Fall back above songs if playback controls are absent');
  await errorPage.getByRole('button',{name:'List',exact:true}).click();
  await errorPage.waitForFunction(()=>document.querySelector('ul').dataset.sagView==='list');
  assert.equal(await errorPage.locator('ul').getAttribute('data-sag-view'),'list');

  // Playlist support is off until enabled; real playlists put a select checkbox before their play thumbnail.
  const playlistPage=await context.newPage();await playlistPage.goto('https://suno.com/playlist/2ec001f0-5da3-47bf-bdca-c39dbddd2891');
  await playlistPage.evaluate(({clip,rowSource,data})=>{
    document.querySelector('[aria-label="Shuffle album"]').setAttribute('aria-label','Shuffle playlist');
    const li=eval('('+rowSource+')')(clip,0);const native=li.querySelector('.track');native.classList.add('clip-image-container');native.setAttribute('role','button');
    const checkbox=document.createElement('button');checkbox.setAttribute('aria-label','Select clip');checkbox.addEventListener('click',()=>window.selectionClicks=(window.selectionClicks||0)+1);native.before(checkbox);
    const right=li.querySelector('.right');right.classList.add('renamed-right-rail');
    const actions=right.querySelector('.actions');
    const wrap=document.createElement('div');wrap.className='w-full items-center gap-1 md:grid';wrap.style.cssText='display:grid;grid-template-columns:1fr 1fr 12.5rem';
    const metadata=document.createElement('div');metadata.className='hidden md:contents';metadata.style.display='contents';
    metadata.innerHTML='<div class="duration">3:56</div><div class="relative-date">1w ago</div>';
    wrap.append(metadata,actions);right.replaceChildren(wrap);document.querySelector('ul').append(li);
    window.liveSettings={enablePlaylists:false,videoPreviews:true,compactIndicator:true};window.views={album:'list',playlist:'list'};window.artworkRequests=0;
    window.sunoAlbumGridTransport={getSettings:async()=>window.liveSettings,getMode:async kind=>window.views[kind],setMode:async(value,kind)=>window.views[kind]=value,onSettingsChanged:fn=>window.settingsChanged=fn,getAlbumPage:async()=>{window.artworkRequests++;return data;}};
  },{clip:clips[0],rowSource:row.toString(),data:album});
  await playlistPage.addStyleTag({content:css});await playlistPage.addScriptTag({content:js});
  await playlistPage.waitForFunction(()=>Boolean(window.settingsChanged));await playlistPage.waitForTimeout(50);
  assert.equal(await playlistPage.locator('.sag-toolbar').count(),0);assert.equal(await playlistPage.evaluate(()=>window.artworkRequests),0);
  await playlistPage.evaluate(()=>{window.liveSettings={...window.liveSettings,enablePlaylists:true};window.settingsChanged();});
  await playlistPage.getByRole('group',{name:'Playlist view',exact:true}).waitFor();
  assert.equal(await playlistPage.locator('.album-controls > .sag-toolbar').count(),1);
  await playlistPage.getByRole('button',{name:'Grid',exact:true}).click();await playlistPage.locator('.sag-media img').waitFor();
  assert.equal(await playlistPage.locator('.relative-date').isVisible(),false,'Date is hidden in Grid');
  assert.equal(await playlistPage.locator('.eg1nvup1').isVisible(),false,'Playlist thumbnail/select rail is hidden in Grid');
  assert.equal(await playlistPage.getByRole('button',{name:'Remix',exact:true}).count(),0,'Remix card button is hidden in Grid');
  assert.equal(await playlistPage.locator('.duration').isVisible(),true,'Duration remains visible');
  for(const width of [1100,400]) {
    await playlistPage.setViewportSize({width,height:900});
    const contained=await playlistPage.locator('.clip-row-collection').evaluate(row=>{
      const card=row.getBoundingClientRect(),menu=row.querySelector('[aria-label="More options"]').getBoundingClientRect();
      return menu.right <= card.right && menu.left >= card.left;
    });
    assert(contained,'More options stays inside the card at width '+width);
  }
  await playlistPage.getByRole('button',{name:'List',exact:true}).click();
  await playlistPage.waitForFunction(()=>document.querySelector('ul').dataset.sagView==='list');
  assert.equal(await playlistPage.locator('.relative-date').isVisible(),true,'Date returns in List');
  assert.equal(await playlistPage.getByRole('button',{name:'Remix',exact:true}).isVisible(),true,'Remix returns in List');
  await playlistPage.getByRole('button',{name:'Grid',exact:true}).click();
  await playlistPage.waitForFunction(()=>document.querySelector('ul').dataset.sagView==='grid');
  await playlistPage.locator('.sag-media').click();await playlistPage.waitForFunction(()=>window.nativeClicks===1);
  assert.equal(await playlistPage.evaluate(()=>window.selectionClicks||0),0,'Playlist cover click must not select the row');
  await playlistPage.mouse.move(0,0);
  await playlistPage.emulateMedia({reducedMotion:'no-preference'});await playlistPage.locator('.sag-media').hover();
  await playlistPage.waitForFunction(()=>document.querySelector('.sag-media video')?.paused===false);
  await playlistPage.locator('.sag-media').click();
  await playlistPage.waitForFunction(()=>document.querySelector('.sag-media video').paused);
  await playlistPage.evaluate(()=>{window.liveSettings={...window.liveSettings,videoPreviews:false,hoverPreviews:true};window.settingsChanged();});
  await playlistPage.waitForFunction(()=>document.querySelector('.sag-media video').paused===false);
  await playlistPage.evaluate(()=>{window.liveSettings={...window.liveSettings,hoverPreviews:false,compactIndicator:false};window.settingsChanged();});
  await playlistPage.waitForFunction(()=>document.querySelector('.sag-media video').paused && !document.documentElement.hasAttribute('data-sag-compact-icons'));
  await playlistPage.evaluate(()=>{window.liveSettings={...window.liveSettings,enablePlaylists:false};window.settingsChanged();});
  await playlistPage.waitForFunction(()=>!document.querySelector('.sag-toolbar'));
  assert.equal(await playlistPage.locator('.sag-media').count(),0);assert.equal(await playlistPage.locator('ul').getAttribute('data-sag-view'),null);
  // Options page uses real markup and scripts with mocked Firefox storage.
  const optionsPage=await context.newPage();await optionsPage.goto('https://suno.com/create');
  await optionsPage.setContent(fs.readFileSync(path.join(dir,'options/options.html'),'utf8').replace(/<script[^>]*><\/script>/g,''));
  await optionsPage.evaluate(()=>{window.optionStore={albumView:'grid'};window.browser={storage:{local:{get:async defaults=>({...defaults,...window.optionStore}),set:async values=>Object.assign(window.optionStore,values)}}};});
  await optionsPage.addStyleTag({content:fs.readFileSync(path.join(dir,'options/options.css'),'utf8')});
  await optionsPage.addScriptTag({path:path.join(dir,'settings.js')});await optionsPage.addScriptTag({path:path.join(dir,'options/options.js')});
  await optionsPage.waitForFunction(()=>!document.querySelector('fieldset').disabled);
  assert.equal(await optionsPage.locator('#enablePlaylists').isChecked(),false);
  assert.equal(await optionsPage.locator('#fitSidebarArtwork').isChecked(),false);
  assert.equal(await optionsPage.locator('#hoverPreviews').isChecked(),false);
  await optionsPage.locator('#hoverPreviews').check();
  await optionsPage.locator('#fitSidebarArtwork').check();
  await optionsPage.locator('#enablePlaylists').check();await optionsPage.locator('#videoPreviews').uncheck();await optionsPage.locator('#compactIndicator').uncheck();
  await optionsPage.getByRole('button',{name:'Save options'}).click();await optionsPage.getByText('Options saved.',{exact:true}).waitFor();
  const saved=await optionsPage.evaluate(()=>window.optionStore);assert.deepEqual(saved,{albumView:'grid',enablePlaylists:true,videoPreviews:false,hoverPreviews:true,compactIndicator:false,fitSidebarArtwork:true});


  // Sidebar option works independently of collection Grid support and restores native dimensions.
  await playlistPage.evaluate(()=>{
    const sidebar=document.createElement('aside');sidebar.id='sidebar-fixture';sidebar.className='scrollbar-hide absolute';sidebar.style.width='300px';
    sidebar.innerHTML='<div class="renamed-detail-body" style="padding:16px;display:flex;flex-direction:column"><div class="extra-wrapper"><div class="test-sidebar-cover css-1871jqf e11it12s0" style="width:126px;height:126px;position:relative;margin:0 auto;flex-shrink:0"><img alt="Image for Test song" data-src="https://cdn2.suno.ai/demo-cover.svg" style="width:100%;height:100%;object-fit:cover"><div class="absolute inset-0 h-full w-full object-cover" style="position:absolute;inset:0;width:100%;height:100%"></div></div></div><h2 contenteditable="true">Test song</h2><a href="/@example"><img class="avatar" src="https://cdn2.suno.ai/demo-avatar.svg" alt="Test song" style="width:24px;height:24px"></a></div>';
    document.body.append(sidebar);
  });
  await playlistPage.waitForFunction(()=>document.querySelector('#sidebar-fixture .avatar').complete && document.querySelector('#sidebar-fixture .avatar').naturalWidth>0);
  assert.equal(await playlistPage.locator('#sidebar-fixture .test-sidebar-cover').evaluate(n=>n.getBoundingClientRect().width),126);
  await playlistPage.evaluate(()=>{window.liveSettings={...window.liveSettings,fitSidebarArtwork:true};window.settingsChanged();});
  await playlistPage.waitForFunction(()=>document.querySelector('#sidebar-fixture [data-sag-sidebar-artwork]'));
  assert.equal(await playlistPage.locator('#sidebar-fixture video').count(),0,'Still artwork is identified without a video or title link');
  assert.equal(await playlistPage.locator('#sidebar-fixture .test-sidebar-cover').evaluate(n=>n.getBoundingClientRect().width),268);
  await playlistPage.evaluate(()=>{const video=document.createElement('video');video.muted=true;video.style='object-fit:cover;width:100%;height:100%;border-radius:5%';document.querySelector('#sidebar-fixture .absolute.inset-0').append(video);});
  await playlistPage.waitForFunction(()=>getComputedStyle(document.querySelector('#sidebar-fixture video')).objectFit==='contain');
  for(const [width,expected] of [[300,268],[200,168]]) {
    await playlistPage.locator('#sidebar-fixture').evaluate((n,w)=>n.style.width=w+'px',width);
    const result=await playlistPage.locator('#sidebar-fixture .test-sidebar-cover').evaluate(n=>{const r=n.getBoundingClientRect();return{width:r.width,height:r.height,img:n.querySelector('img').getBoundingClientRect().width,video:n.querySelector('video').getBoundingClientRect().width,fit:getComputedStyle(n.querySelector('video')).objectFit};});
    assert.deepEqual(result,{width:expected,height:expected,img:expected,video:expected,fit:'contain'});
  }
  await playlistPage.locator('#sidebar-fixture video').evaluate(n=>n.remove());
  assert.equal(await playlistPage.locator('#sidebar-fixture .test-sidebar-cover').evaluate(n=>n.getBoundingClientRect().width),168,'Removing playback video preserves still-cover sizing');
  assert.equal(await playlistPage.locator('#sidebar-fixture .avatar').evaluate(n=>n.getBoundingClientRect().width),24,'Avatar remains native');
  // Replacing the panel and changing generated classes re-identifies the cover.
  await playlistPage.evaluate(()=>{const old=document.querySelector('#sidebar-fixture');const replacement=old.cloneNode(true);replacement.querySelector('[data-sag-sidebar-artwork]').removeAttribute('data-sag-sidebar-artwork');replacement.querySelector('.test-sidebar-cover').className='test-sidebar-cover entirely-new-generated-class';old.replaceWith(replacement);});
  await playlistPage.waitForFunction(()=>document.querySelector('#sidebar-fixture .test-sidebar-cover').hasAttribute('data-sag-sidebar-artwork'));
  // Multiple matching covers are ambiguous: undo sizing instead of guessing.
  await playlistPage.evaluate(()=>{const cover=document.querySelector('#sidebar-fixture .test-sidebar-cover');const duplicate=cover.cloneNode(true);duplicate.className='duplicate-cover';duplicate.removeAttribute('data-sag-sidebar-artwork');cover.after(duplicate);});
  await playlistPage.waitForFunction(()=>!document.querySelector('#sidebar-fixture [data-sag-sidebar-artwork]'));
  assert.equal(await playlistPage.locator('#sidebar-fixture .test-sidebar-cover').evaluate(n=>n.getBoundingClientRect().width),126);
  await playlistPage.locator('#sidebar-fixture .duplicate-cover').evaluate(n=>n.remove());
  await playlistPage.waitForFunction(()=>document.querySelector('#sidebar-fixture [data-sag-sidebar-artwork]'));
  await playlistPage.locator('#sidebar-fixture .test-sidebar-cover > img').evaluate(n=>n.alt='Unrelated image');
  await playlistPage.waitForFunction(()=>!document.querySelector('#sidebar-fixture [data-sag-sidebar-artwork]'));
  await playlistPage.locator('#sidebar-fixture .test-sidebar-cover > img').evaluate(n=>n.alt='Image for Test song');
  await playlistPage.waitForFunction(()=>document.querySelector('#sidebar-fixture [data-sag-sidebar-artwork]'));
  await playlistPage.evaluate(()=>{window.liveSettings={...window.liveSettings,fitSidebarArtwork:false};window.settingsChanged();});
  await playlistPage.waitForFunction(()=>!document.documentElement.hasAttribute('data-sag-fit-sidebar'));
  assert.equal(await playlistPage.locator('#sidebar-fixture .test-sidebar-cover').evaluate(n=>n.getBoundingClientRect().width),126);

  console.log('PASS: desktop/mobile grid, native playback delegation, List restoration, dynamic rows, SPA navigation, duplicate injection, persisted mode, metadata failure, compact native indicator, no script errors.');
 } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});