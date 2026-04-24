const fs = require('fs');
const path = require('path');

const target = path.join(__dirname, '..', 'node_modules', 'app-builder-lib', 'out', 'electron', 'electronWin.js');

if (!fs.existsSync(target)) {
  console.log('patch-ebusy: electronWin.js not found, skipping');
  process.exit(0);
}

const original = '    await (0, promises_1.writeFile)(executablePath, Buffer.from(executable.generate()));';
const patched = [
  '    const outputBuffer = Buffer.from(executable.generate());',
  '    for (let attempt = 0; attempt < 6; attempt++) {',
  '        try {',
  '            await (0, promises_1.writeFile)(executablePath, outputBuffer);',
  '            break;',
  '        } catch (err) {',
  '            if (err.code === "EBUSY" && attempt < 5) {',
  '                await new Promise(resolve => setTimeout(resolve, 300 * (attempt + 1)));',
  '            } else {',
  '                throw err;',
  '            }',
  '        }',
  '    }',
].join('\n');

const content = fs.readFileSync(target, 'utf8');

if (content.includes(patched)) {
  console.log('patch-ebusy: already applied, skipping');
} else if (content.includes(original)) {
  fs.writeFileSync(target, content.replace(original, patched));
  console.log('patch-ebusy: applied EBUSY retry patch to app-builder-lib');
} else {
  console.warn('patch-ebusy: target line not found — patch may need updating for this version');
}
