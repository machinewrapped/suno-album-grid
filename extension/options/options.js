'use strict';
const form = document.getElementById('settings');
const status = document.getElementById('status');
const fields = Object.keys(sunoAlbumGridSettings.defaults);
(async () => {
  try {
    const settings = sunoAlbumGridSettings.normalize(await browser.storage.local.get(sunoAlbumGridSettings.defaults));
    for (const key of fields) document.getElementById(key).checked = settings[key];
    form.querySelector('fieldset').disabled = false;
  } catch { status.textContent = 'Could not load options. Reopen this page to try again.'; }
})();
form.addEventListener('submit', async event => {
  event.preventDefault();
  const button = form.querySelector('button'); button.disabled = true;
  try {
    const settings = Object.fromEntries(fields.map(key => [key, document.getElementById(key).checked]));
    await browser.storage.local.set(settings);
    status.textContent = 'Options saved.';
  } catch { status.textContent = 'Could not save options. Please try again.'; }
  finally { button.disabled = false; }
});
