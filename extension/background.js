/* Public, read-only metadata endpoint; no account tokens or cookies. */
browser.runtime.onMessage.addListener((message,sender)=>{
  if(message?.type!=='album-grid-metadata') return;
  if(!sender.url?.startsWith('https://suno.com/') || !/^[a-f0-9-]{36}$/i.test(message.id) || !Number.isInteger(message.page) || message.page<1 || message.page>1000) return Promise.resolve({ok:false,error:'Invalid album request'});
  return (async()=>{
    try {
      const response=await fetch(`https://studio-api.prod.suno.com/api/playlist/${message.id}/?page=${message.page}`,{credentials:'omit',signal:AbortSignal.timeout(20000)});
      if(!response.ok) throw new Error(`Metadata request failed (${response.status})`);
      const data=await response.json();
      return {ok:true,data:{playlist_clips:(data.playlist_clips||[]).map(({clip})=>({clip:clip?{id:clip.id,image_url:clip.image_url,image_large_url:clip.image_large_url,video_cover_url:clip.video_cover_url,metadata:{video_to_song_video_upload_url:clip.metadata?.video_to_song_video_upload_url}}:null})),num_total_results:data.num_total_results}};
    } catch(error) { return {ok:false,error:error.message}; }
  })();
});