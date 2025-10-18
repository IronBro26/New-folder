const fs = require('fs');
const path = require('path');

// ============= SETTINGS =============
const themeManagerPath = 'js/theme-manager.js'; // path to your theme script
const htmlFiles = [
  'index.html','brosquad-new.html','videos.html','fan-mail.html','join.html',
  'signup.html','members-only.html','admin.html','404.html','donate.html',
  'cube-wars.html','space-blaster.html','settings.html'
];
const scriptTag = `<script src="${themeManagerPath}"></script>`;
// ====================================

// ---------- Helper: Create file backup ----------
function backupFile(filePath) {
  const ts = new Date().toISOString().replace(/[:.]/g,'-');
  const bakPath = `${filePath}.bak-${ts}`;
  fs.writeFileSync(bakPath, fs.readFileSync(filePath));
  return bakPath;
}

// ---------- Helper: Inject theme script & data-theme ----------
function injectTheme(content) {
  if (content.includes(themeManagerPath)) return { changed:false, reason:'already' };

  let updated = content;

  // Try inserting before </head>
  if (updated.includes('</head>')) {
    updated = updated.replace(/<\/head>/i, `${scriptTag}\n</head>`);
  } else if (updated.includes('<head')) {
    updated = updated.replace(/<head[^>]*>/i, match => `${match}\n${scriptTag}`);
  } else {
    return { changed:false, reason:'no-head' };
  }

  // Add data-theme if missing
  if (!updated.match(/<html[^>]*data-theme/i)) {
    updated = updated.replace(/<html/i, '<html data-theme="red"');
  }

  return { changed:true, content: updated };
}

// ---------- Step 1: Update all HTML files ----------
const summary = { updated:[], skipped:[], missingHead:[], notFound:[], errors:[] };

htmlFiles.forEach(file => {
  const filePath = path.resolve(__dirname, file);
  if (!fs.existsSync(filePath)) {
    summary.notFound.push(file);
    console.warn(`⚠ File not found: ${file}`);
    return;
  }

  try {
    const original = fs.readFileSync(filePath, 'utf8');
    const result = injectTheme(original);

    if (!result.changed) {
      if (result.reason === 'already') {
        summary.skipped.push(file);
        console.log(`⏩ Skipped ${file} (already updated)`);
      } else {
        summary.missingHead.push(file);
        console.warn(`⚠ Could not find <head> in ${file}`);
      }
      return;
    }

    const bak = backupFile(filePath);
    fs.writeFileSync(filePath, result.content, 'utf8');
    console.log(`✅ Updated ${file} (backup saved: ${path.basename(bak)})`);
    summary.updated.push(file);

  } catch (err) {
    summary.errors.push({ file, error: err.message });
    console.error(`❌ Error processing ${file}:`, err.message);
  }
});

// ---------- Step 2: Check theme-manager.js for brace errors ----------
console.log('\n🔍 Checking theme-manager.js for syntax issues...\n');

function checkBraces(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  const pairs = { '{': '}', '[': ']', '(': ')' };
  const openers = Object.keys(pairs);
  const closers = Object.values(pairs);
  const stack = [];

  let inStr = false, strChar = '', escape = false, inLineComment = false, inBlockComment = false;
  const lines = text.split('\n');

  for (let lineNum = 0; lineNum < lines.length; lineNum++) {
    const line = lines[lineNum];
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      const next = line[i + 1];

      // String/comment handling
      if (inLineComment) continue;
      if (inBlockComment) {
        if (ch === '*' && next === '/') { inBlockComment = false; i++; }
        continue;
      }

      if (inStr) {
        if (escape) { escape = false; continue; }
        if (ch === '\\') { escape = true; continue; }
        if (ch === strChar) { inStr = false; }
        continue;
      }

      if (ch === '/' && next === '/') { inLineComment = true; break; }
      if (ch === '/' && next === '*') { inBlockComment = true; i++; continue; }
      if (["'", '"', '`'].includes(ch)) { inStr = true; strChar = ch; continue; }

      // Bracket tracking
      if (openers.includes(ch)) stack.push({ ch, line: lineNum + 1 });
      if (closers.includes(ch)) {
        const last = stack.pop();
        if (!last) return `❌ Extra closing '${ch}' at line ${lineNum + 1}`;
        if (pairs[last.ch] !== ch)
          return `❌ Mismatched '${last.ch}' at line ${last.line}, found '${ch}' at line ${lineNum + 1}`;
      }
    }
    inLineComment = false;
  }

  if (stack.length) {
    const unclosed = stack.map(s => `'${s.ch}' at line ${s.line}`).join(', ');
    return `❌ Unclosed: ${unclosed}`;
  }

  return '✅ No unmatched braces, brackets, or parentheses detected.';
}

if (fs.existsSync(themeManagerPath)) {
  const result = checkBraces(themeManagerPath);
  console.log(result);
} else {
  console.warn(`⚠ Could not find ${themeManagerPath} — skipping syntax check.`);
}

// ---------- Step 3: Print summary ----------
console.log('\n🎨 === SUMMARY ===');
console.log(`✅ Updated: ${summary.updated.join(', ') || 'none'}`);
console.log(`⏩ Skipped (already): ${summary.skipped.join(', ') || 'none'}`);
console.log(`⚠ Missing <head>: ${summary.missingHead.join(', ') || 'none'}`);
console.log(`🚫 Not found: ${summary.notFound.join(', ') || 'none'}`);
if (summary.errors.length) console.log(`❌ Errors: ${JSON.stringify(summary.errors, null, 2)}`);
console.log('\n✨ Theme update complete!\n');
