const fs = require('node:fs');
const path = require('node:path');

function checkReleaseVersion(tag, packageVersion, manifestVersion) {
  if (!/^v\d+\.\d+\.\d+$/.test(tag || '')) {
    throw new Error('Release tags must use vMAJOR.MINOR.PATCH, for example v1.0.1.');
  }
  const version = tag.slice(1);
  if (version !== packageVersion || version !== manifestVersion) {
    throw new Error(`Tag ${tag} must match package.json (${packageVersion}) and extension/manifest.json (${manifestVersion}).`);
  }
  return version;
}

if (require.main === module) {
  try {
    const root = path.resolve(__dirname, '..');
    const packageVersion = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')).version;
    const manifestVersion = JSON.parse(fs.readFileSync(path.join(root, 'extension/manifest.json'), 'utf8')).version;
    const version = checkReleaseVersion(process.argv[2], packageVersion, manifestVersion);
    console.log(`Validated release v${version}.`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

module.exports = { checkReleaseVersion };