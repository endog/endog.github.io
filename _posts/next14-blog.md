---
title: "Next.js 14とgitGitHub Pagesでブログを公開しGoogle AdSenseを設定する"
excerpt: "Next.js 14とgitGitHub Pagesでブログを公開しGoogle AdSenseを設定する"
coverImage: "/assets/blog/next14-blog/next-logo.jpg"
date: "2024-03-28T18:00:00.000Z"
ogImage:
  url: "/assets/blog/next14-blog/next-logo.jpg"
---

## 目次

- はじめに
- 技術スタック
- 作業手順(GitHub リポジトリ作成,ブログテンプレートの作成,デプロイ,Google Adsense の申請)

## はじめに

Next14 を使って手軽に無料で個人ブログの公開をしてアドセンスも設定したいなと思った際に、いい感じにまとまった記事がなさそうだったので実際にこのサイトを構築した際の手順を簡単に紹介します。  
最終的に GitHub Pages の無料ドメインに Markdown で書いた記事をホストするので GitHub のアカウントを持っていることを前提としています。
当初、Vercel の hobby プランでホスティングしようと思ったのですが、[Commercial usage](https://vercel.com/docs/limits/fair-use-guidelines#commercial-usage)にてアドセンスの設定は禁止事項として記載があり断念しました。なので GitHub pages の[禁止される用途](https://docs.github.com/ja/pages/getting-started-with-github-pages/about-github-pages#prohibited-uses)には該当しない事を確認して今回は利用していきます。

## 技術スタック

- 🚀 Next.js 14(App Router)
- ⚛️ React 18
- 📘 Typescript
- 🎨 Tailwind CSS
- 🌎 GitHub pages
- 🤖 GitHub actions

## 作業手順

### GitHub リポジトリ作成

まずは、リポジトリを作成します。  
gitHub Pages では`<username>.github.io`という名前のリポジトリから`http(s)://<username>.github.io`でサイトを利用していきます。  
任意のリポジトリから`http(s)://<username>.github.io/<repository>`としてサイトを公開することもできますが、
アドセンスの設定の際にドメイン名で登録が必要なため、今回は`<username>.github.io`のリポジトリを作成します。  
また、リポジトリは public リポジトリとして作成します。

### ブログテンプレートの 作成

1. プロジェクトの作成  
   公式の examples にある[blog-starter](https://github.com/vercel/next.js/tree/canary/examples/blog-starter)を利用してプロジェクトを作成します。

```
yarn create next-app --example blog-starter <username>.github.io
```

2. ブログレイアウトの修正  
   ブログレイアウトを修正したい場合は、テンプレートを元にローカルで任意のレイアウトに修正します。
   例えばテンプレートでは各記事に著者の名称と画像が設定されていますが、本サイトでは個人でのブログとなるため著者の情報を削除したレイアウトに変更しています。  
   また、Tailwind CSS を利用している場合は、markdown を html に変換した際に自分でスタイルを当てる必要があります。(GitHub Flavored)Markdown を html へ変換後に Tailwind CSS でスタイルするリポジトリがあったので真似させてもらいました。  
   [github-markdown-tailwindcss/markdown.css](https://github.com/iandinwoodie/github-markdown-tailwindcss/blob/master/markdown.css)

3. 静的エクスポートの有効化  
   GitHub Pages にデプロイするので、静的サイトとして利用するため、next.config.js ファイルを作成し、以下を記載します。

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
};

module.exports = nextConfig;
```

4. リポジトリを push  
   作成したプロジェクトをリモートリポジトリに push します。

### デプロイ

ブログを GitHub Pages にデプロイしていきます。
`<username>.github.io`のリポジトリページで Settings->Pages の順で GitHub Pages の設定画面へ進みます。  
![GitHub Pages ページ画像](/assets/blog/next14-blog/github-Pages.jpg)
Source を GitHubActions として Configure から nextjs.yml を修正しデプロイします。
(AppRouter を利用している場合、以下をコメントアウトする必要があるようです。)

```
    78  # - name: Static HTML export with Next.js
    79  #   run: ${{ steps.detect-package-manager.outputs.runner }} next export
```

### Google Adsense の審査

ここはまだ本記事の執筆時点で審査中となっているため、審査が問題なくクリアされたら編集しようと思います、、、  
一旦審査の申し込みまでは本手順で作成したブログで問題なく実施できました！
