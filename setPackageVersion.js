const fs = require('fs');
const pkgJson = require('./package.json');

const args = process.argv.slice(2);
const branchName = args[0].split('=')[1].split('/')[1];
const buildNumber = args[1].split('=')[1];

console.log('branch name: ' + branchName);
console.log('build number: ' + buildNumber);
let version = pkgJson.version;

switch (branchName) {
    case 'develop':
        version = version.split('.').slice(0, 2).join('.');
        branchChannel = `.${buildNumber}-alpha`;
        pkgJson.build.nsis.artifactName = 'optimo.${version}.${ext}';
        break;
    case 'staging':
        version = version.split('.').slice(0, 2).join('.');
        branchChannel = `.${buildNumber}-beta`;
        pkgJson.build.nsis.artifactName = 'optimo.${version}.${ext}';
        break;
    default:
        branchChannel = '';
        pkgJson.build.nsis.artifactName = 'optimo.${version}.${ext}';
        break;
}
pkgJson.version = `${version}${branchChannel}`;
fs.writeFileSync('package.json', JSON.stringify(pkgJson, null, 2));