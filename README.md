# 現場そろばん（建築現場OCR・Phase1モック）

建築現場向けの受発注・原価管理アプリの**デモ用モック**です。
**「現場の紙（請求書・日報）を放り込むだけ」**で、AIが明細を読み取り、現場ごとに自動で振り分け、**現場ごとの利益・入出金・日報**が自動でまとまります。

- 事務所＝PC（取り込み・集計）／現場＝スマホ（自分の現場の利益＋スキャン）
- いまのExcel業務を変えず、確定した明細はそのままExcelへ貼る／CSVで渡せる（UTF-8 BOM付で文字化けなし）

> ⚠️ これは営業デモ／外注ハンドオフ用のモックです。OCRはサンプルデータで動作を再現しています（実際のOpenAI Vision API連携は実装ガイド参照）。

## ファイル

| ファイル | 用途 |
|---|---|
| `genba-ocr-mock-standalone.html` | **配布・デモ用**。ダブルクリックで開く自己完結版（React/Tailwindを全てインライン、ネット接続不要） |
| `index.html` | **編集用ソース**。React + Babel + Tailwind を CDN 参照（`file://` だと不安定なため配布はstandaloneを使用） |
| `artifact.html` | claude.ai 上でホストする公開版（ヘッダなし断片） |

## 使い方（デモ）

1. `genba-ocr-mock-standalone.html` をブラウザで開く
2. 上部トグルで **事務所（PC）／現場（スマホ）** を切替
3. 事務所：ドロップゾーンに請求書/日報を「アップロード」→ 確認画面で明細をチェック → 登録
4. 「取り込んだ請求書」一覧の行をクリックで読み込み画面を再オープン、「Excelへ ↓」で貼付/CSV
5. 画面下部「デモ用」：空にする／サンプル読込／**実装ガイド**（外注ハンドオフ用の仕様書）

## 主な機能

- 請求書・日報のアップロード → AIが明細/項目を読み取り（種別自動判定）
- 明細の現場名を**既存案件へ名寄せ／無ければ自動登録／判別不能はその場命名**
- 複数現場が1枚に混在する請求書に対応（明細ごとに現場割り当て・実額積み上げ）
- 読み取れない箇所は「要編集」で強調、原本と突合してから登録
- 現場ごとの利益（売上/原価/粗利/粗利率）、日次入出金、日報一覧
- CSV／Excel（クリップボード貼付・BOM付CSVダウンロード）

## 実装（本番）メモ

本番は Bubble もしくは Web アプリで実装予定。詳細はアプリ内「実装ガイド」（PC画面下部）に同梱：
データ設計（Document は現場を持たず明細行 Item に現場・実額積み上げ）／OCR仕様（請求書・日報の2種JSON＋bbox）／名寄せ・自動登録ロジック／集計・出力／権限（APIキーはBackendに隠蔽）。

## ビルド（配布用HTMLの再生成）

`index.html`（CDN参照の編集用ソース）を直したら、以下で配布用の自己完結HTMLを再生成します。
React/ReactDOM・コンパイル済みアプリ・使用ぶんのTailwind静的CSSをすべてインライン化します。

```bash
cd build
npm install      # 初回のみ（react / react-dom / @babel / tailwindcss）
npm run build
```

生成物（すべて外部依存ゼロ）：
- `genba-ocr-mock-standalone.html` … 配布・デモ用
- `docs/index.html` … GitHub Pages 公開用（standaloneと同一）
- `artifact.html` … claude.ai Artifact 公開用（doctype/head/body なしの断片）

ビルド構成は `build/`（`build.js` / `tailwind.config.js` / `tailwind.css` / `package.json`）。
`build/node_modules` と `build/tw.out.css` は生成物のため gitignore 済み。

### 公開URL
- GitHub Pages: https://asai-web.github.io/genba-ocr-mock/ （`docs/` を更新→push で自動反映）
