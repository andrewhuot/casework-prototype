import { copyFileSync, mkdirSync, statSync } from 'node:fs';
mkdirSync('release', { recursive: true });
copyFileSync('dist-single/index.html', 'release/casework-demo.html');
const kb = Math.round(statSync('release/casework-demo.html').size / 1024);
console.log(`release/casework-demo.html written (${kb} KB)`);
