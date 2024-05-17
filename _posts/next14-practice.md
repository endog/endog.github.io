---
title: "実践 Next.js メモ"
excerpt: "Next.js 14に関する書籍を読んでのメモ"
coverImage: "/assets/blog/next14-blog/next-logo.jpg"
date: "2024-05-18T18:00:00.000Z"
ogImage:
  url: "/assets/blog/next14-blog/next-logo.jpg"
---

## はじめに

実践 Next.js という書籍で学習した内容を自分用に箇条書きでまとめました。  
自分用のまとめで目次的なものですが、本書籍は Next.js のコンポーネント、キャッシュ周りをよく理解できるように構成されていたので、Next.js 入門書として体系的に学びたい人にはぜひおすすめです。

## Server Component とレンダリング

- RSC から非同期関数にできるようになった
- 使い分け
  - Server Component を使うべきケース
    - データを取得する
    - バックエンドリソースを取得する
    - 機密情報を扱う
  - Client Component を使うべきケース
    - インタラクティブ(入力を伴う)な機能を持つ
    - 状態を扱う(hooks を使う)
    - ブラウザ専用の API を使う
- 親コンポーネントで use client を書いてれば子コンポーネントでは書く必要がないので汎用性の高い子コンポーネントには use client を付けずにサーバーコンポーネント、クラインコンポーネントどちらとしても使えるようにしておける(知らなかったけどクライアントコンポーネントの子コンポーネントがインタラクティブな処理を持たないパターンってどんなパターンなのか例が思いつかない笑)
- fetch 関数はデフォルトで静的データ取得として扱われ結果はキャッシュされる
- fetch 関数で動的データ取得として扱いたい場合は no-store にする
- キャッシュの挙動を確認する場合は npm run build してから npm start する
- 各 Route が静的レンダリングか動的レンダリングかはビルド時のメッセージから確認できる
- 以下を利用する場合は動的レンダリングになる
  - 動的データ取得(no-store の fetch 関数)
  - 動的関数使用(cookie,header,クエリパラメータ)
  - ダイナミックルーティング

# App Router の規約

- reset()でコンポーネントのデータ取得を再試行できる
- layout.tsx のエラーは親の error.tsx で処理される
- global-error.tsx という error.tsx で処理されなかったエラーをハンドリングする仕組みがあるらしい。server actions を client component から呼び出したときは error.tsx へ Error Boundary が出来なかった気がするがこれで対応できる？(⭐︎ 要検証)
- Dynamic Route のパターン
  - hoge/[…slug]:/hoge/a
  - hoge/[[…slug]]:/hoge ← これが許される(…slug が optional になる)
- ルーティング内の()付きのディレクトリは無視される。但し、layout.tsx はサブツリーにのみ適用される
- フォルダの先頭に\_を付けるとルーティングの対象外にできる(Private Folder)
- parallel Routes と Intercepting Routes を使うといい感じにモーダルが作れるらしい(⭐︎ 要検証)
- metadata はサブツリーへ継承される(が、SEO 的にはちゃんと個別で設定した方がいい)

# Route Handler

- page.tsx と route.tsx が同じセグメントに存在するとコンフリクトを起こす(ビルド時にエラーとなる)
- Route handler も動的 Route handler と静的 Route Handler がある。(これも Next 側で勝手に判断してくれる)
- 以下を利用する場合、動的 Route Handler になる
  - dynamic segment の参照
  - Request オブジェクトの参照
  - 動的関数の使用(cookie,header,クエリパラメータ)
  - get と head 以外の request は全部
  - force-dynamic をつけた時(そのルートとサブツリー)

# データ取得とキャッシュ

- 同一 route の同一レンダリング時の同一 fetch 関数は一回のリクエストにまとめられる(Request のメモ化)
- fetch 関数はデフォルトで 1 年間キャッシュされる
- キャッシュの有効期限を任意に設定したい場合は fetch 関数の第 2 引数に revalidate で時間を指定する。(そもそもキャッシュさせたくない場合は前段記載の通り、動的 fetch にするために no-store を指定する)
- fetch 以外で Request のメモ化をしたい場合は、React の cache 関数を使う(これはあくまで Request のメモ化であり、データキャッシュがされるわけではない)
- cache 関数の注意点
  - React コンポーネント内で使わない
  - データ取得関数の引数はプリミティブ値であること
- Next の unstable_cache 関数を使うとデータキャッシュができる
- unstable_cache はコンポーネント内で利用できる

# 認証機能

- next では標準で読み込む env ファイルがある
- クライアント側で利用したい public な環境変数は env 内で NEXT*PUBLIC*の接頭語を付ける
- public な環境変数は変更時に再ビルドが必要
- NextAuth の getServerSession 関数を使うとセッションの情報を取得できる

# データ更新と UI

- form の action 属性に Server Action の関数を渡すのが基本
- 任意のタイミングでキャッシュを無効化したい場合、以下方法で On-demand Revalidation する(⭐︎ 要検証)
  - revalidatePath
  - ravalidateTag
- Route handler 内では On-demand Revalidation と Route.refresh を併用する必要がある(Route キャッシュ側にキャッシュが残るため)(Server Action では不要)
- useFormStatus は form タグを持つコンポーネントの子コンポーネント(別のコンポーネント)として定義しなければならない
- prisma.$transaction でトランザクションをはれる
- API リクエストが成功することを前提として UI を更新する手法を楽観的更新という。useOptimistic で実装できる。
- Zod の定義のところは役にたちそうなので実装してみる(⭐︎ 要検証)
- 抽象的なタグをつけた方がキャッシュの管理は楽だが、データアクセス効率は具体的なタグをつけるより悪くなる

# パフォーマンスとキャッシュ

- 親コンポーネントで Promise.all で並列に非同期処理を呼ぶと全ての非同期処理完了後に画面描画がされるが、それぞれ子サーバーコンポーネントに分けてあげると、親の画面描画後に、各子供のコンポーネント作成が並列に行われるので親子にして並列でデータ取得をするコンポーネント構造にすると良い
- 子サーバーコンポーネント毎にデータ取得する仕組みをコロケーションと呼ぶ
- レンダリングの途中で動的関数の使用があると後続の fetch を動的データ取得として扱うので動的データ取得として扱いたくない場合は、fetch の引数に force-cache を入れる
- Layout.tsx に動的関数があると全て動的 Route になる？(ソフトナビゲーションでも多分そうなる)(⭐︎ 要検証)
- SSG でもビルド時に生成する場合とリクエストを受け取った際に生成される場合がある
- dynamic route を SSG にする際は generateStaticParams 関数を使いここで指定したものはビルド時にページが生成され、指定されなかったものはリクエスト受領時にページが生成される
- SSG 内の fetch に time base revalidate をかけるとその time で SSG をする(Full Route キャッシュ)
- time base revalidation はキャッシュ期限が切れていた場合、そのリクエストでは古いキャッシュを返しつつ次のリクエストに備えて新しいキャッシュを作成する
- キャッシュの種類
  - Request のメモ化
    - 単一リクエストの同一 fetch(又は同一 cache)をまとめる
  - Data キャッシュ
    - 異なるブラウザリクエストを跨いで共有
    - 異なるユーザーを跨いで共有
    - 再ビルドしても破棄されない(要 revalidate)
    - ローカルで Data cache を削除したい場合は.next/cache/fetch-cache フォルダを消す
    - fetch 関数以外で Data キャッシュを使いたい場合は unstable_chahe 関数を使う
  - FullRoute キャッシュ
    - SSG、静的レンダリング Route のこと
    - 再ビルド時に破棄される
    - revalidate もできる
  - Route キャッシュ
    - ソフトナビゲーションで一度訪れた segment をブラウザでキャッシュする
    - キャッシュは動的レンダリング Route で 30 秒で静的レンダリング Route で 5 分有効(設定可能)
    - キャッシュは以下の方法で無効化される
    - ブラウザで route.refresh
    - ServerActuon 内で cookie.set 又は cookie.delete
    - ServerAction 内で on demand Revalidation(revalidateTag,revalidatePath)
    - Link タグの遷移先 Route もプリフェッチする(オプトアウト不可)
