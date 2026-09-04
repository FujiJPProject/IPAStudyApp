# IPA Study App

応用情報技術者試験で扱われる知識・理論を、ステップ実行と状態変化の
可視化を通じて学ぶVue 3アプリです。MVPではソートアルゴリズム可視化
教材と学習履歴を提供します。

## ローカル開発

Node.js LTSとnpmを使用します。

```bash
npm ci
npm run dev
```

## 検証

```bash
npm run test
npm run build
npm run preview
```

`npm run preview`はproduction buildのローカル確認に使用し、確認後に
停止します。

## Cloudflare Pages

| 項目 | 設定 |
| --- | --- |
| Production branch | `main` |
| Build command | `npm run build` |
| Build output directory | `dist` |

Vue RouterはHTML5 History Modeを使用します。トップレベルの`404.html`や
SPA fallback専用の`_redirects`は配置せず、Cloudflare PagesのSPA既定動作を
利用します。バックエンド、Pages Functions、DBは使用しません。

## 仕様・開発手順

- 機能要件：`doc/requirements.md`
- アーキテクチャ：`doc/architecture.md`
- UI参照：`doc/ui-reference.html`
- AI作業ルール：`AGENTS.md`
- AI開発手順：`AI/応用情報技術者試験Webアプリ作成 プロンプト手順.md`
