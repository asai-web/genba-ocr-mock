/*
 * 現場そろばん ビルド
 *  ../index.html（React+Babel+Tailwind をCDN参照する編集用ソース）から、
 *  React/ReactDOM・コンパイル済みアプリ・Tailwind静的CSS をすべてインライン化して
 *  外部依存ゼロの配布用HTMLを生成する。
 *
 *  生成物：
 *   - ../genba-ocr-mock-standalone.html  … 配布・デモ用（ダブルクリックで開く）
 *   - ../docs/index.html                 … GitHub Pages 公開用（standaloneと同一）
 *   - ../artifact.html                   … claude.ai Artifact 公開用（doctype/head/body なしの断片）
 *
 *  使い方： cd build && npm install && npm run build
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const babel = require('@babel/core');

const BUILD = __dirname;
const ROOT = path.resolve(BUILD, '..');
const TITLE = '現場そろばん（建築現場OCR・Phase1モック）';

function read(p){ return fs.readFileSync(p, 'utf8'); }

// 1) ソースから <style> とアプリ(JSX)を抽出
const srcHtml = read(path.join(ROOT, 'index.html'));
const customStyle = srcHtml.match(/<style>([\s\S]*?)<\/style>/)[1];
const babelScript = srcHtml.match(/<script type="text\/babel"[^>]*>([\s\S]*?)<\/script>/)[1];

// 2) JSX → 素のJS（classic runtime）
const appJs = babel.transformSync(babelScript, { presets: [['@babel/preset-react', { runtime: 'classic' }]] }).code;

// 3) Tailwind を静的CSSにコンパイル（使用クラスだけ）
execSync('npx tailwindcss -c tailwind.config.js -i tailwind.css -o tw.out.css --minify', { cwd: BUILD, stdio: 'inherit' });
const tw = read(path.join(BUILD, 'tw.out.css'));

// 4) React / ReactDOM の UMD 本体
const react = read(path.join(BUILD, 'node_modules/react/umd/react.production.min.js'));
const reactDom = read(path.join(BUILD, 'node_modules/react-dom/umd/react-dom.production.min.js'));

const styleTag = '<style>\n' + tw + '\n' + customStyle + '\n</style>';
const bodyInner = '<div id="root"></div>\n'
  + '<script>\n' + react + '\n</script>\n'
  + '<script>\n' + reactDom + '\n</script>\n'
  + '<script>\n' + appJs + '\n</script>';

// standalone（完全なHTML）
const standalone = '<!DOCTYPE html>\n<html lang="ja">\n<head>\n'
  + '<meta charset="UTF-8" />\n'
  + '<meta name="viewport" content="width=device-width, initial-scale=1.0" />\n'
  + '<title>' + TITLE + '</title>\n'
  + styleTag + '\n'
  + '</head>\n<body class="bg-ink-200 text-ink-800">\n'
  + bodyInner + '\n'
  + '</body>\n</html>\n';

// artifact（claude.ai が head/body で包むため断片で出力）
const artifact = '<title>' + TITLE + '</title>\n' + styleTag + '\n' + bodyInner + '\n';

fs.writeFileSync(path.join(ROOT, 'genba-ocr-mock-standalone.html'), standalone, 'utf8');
fs.mkdirSync(path.join(ROOT, 'docs'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'docs', 'index.html'), standalone, 'utf8');
fs.writeFileSync(path.join(ROOT, 'artifact.html'), artifact, 'utf8');

const check = s => ({ unpkg: s.includes('unpkg'), babelRuntime: s.includes('text/babel') });
console.log('built:');
console.log('  ../genba-ocr-mock-standalone.html', standalone.length, 'bytes', check(standalone));
console.log('  ../docs/index.html');
console.log('  ../artifact.html', artifact.length, 'bytes', check(artifact));
