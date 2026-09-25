# microCMS：ケニア向けニュース API の作成手順

ケニアサイト（本リポジトリ）は、日本側サイトと同じ microCMS サービス（`g2nm6x9p1n`）の中に
**ケニア専用のニュース API** を持ちます。日本側の `news` はケニアサイトには表示されません。記事が 0 件の間はトップのニュース欄が非表示になります。

## 1. API を作成する

microCMS 管理画面 → 「API」→「追加」

| 項目 | 値 |
| --- | --- |
| API 名 | Kenya News（任意） |
| エンドポイント | `news-ke` （`js/cms-config.js` の `kenyaEndpoint` と一致させる） |
| API の型 | リスト形式 |

## 2. フィールドを追加する

英語を基本言語とし、日本語・フランス語は任意項目です。フィールド ID は下記の通りに設定してください。

| フィールド ID | 表示名 | 種類 | 必須 | 備考 |
| --- | --- | --- | --- | --- |
| `title` | Title (EN) | テキストフィールド | ○ | 英語タイトル |
| `category` | Category | セレクトフィールド | | 選択肢は下記 |
| `thumbnail` | Thumbnail | 画像 | | 16:9 推奨（カードでは 600×338 に切り抜き） |
| `summary` | Summary (EN) | テキストエリア | | トップページのカードに表示（90 文字程度） |
| `content` | Content (EN) | リッチエディタ | | 記事本文 |
| `link` | External link | テキストフィールド | | 入力すると記事ページの代わりに外部 URL へ飛びます |
| `title_ja` | Title (JA) | テキストフィールド | | 任意 |
| `summary_ja` | Summary (JA) | テキストエリア | | 任意 |
| `content_ja` | Content (JA) | リッチエディタ | | 任意 |
| `title_fr` | Title (FR) | テキストフィールド | | 任意 |
| `summary_fr` | Summary (FR) | テキストエリア | | 任意 |
| `content_fr` | Content (FR) | リッチエディタ | | 任意 |

`category` の選択肢（値はそのまま英小文字で登録）:

| 値 | 表示（EN / JA / FR） |
| --- | --- |
| `training` | Training / 研修 / Formation |
| `finance` | Finance / ファイナンス / Financement |
| `partnership` | Partnership / パートナーシップ / Partenariat |
| `event` | Event / イベント / Événement |
| `press` | Press Release / プレスリリース / Communiqué |
| `media` | Media / メディア / Médias |
| `other` | News / ニュース / Actualité |

日本語・フランス語の項目が空のときは英語が表示され、カードに `EN` のタグが付きます。

## 3. API キー

既存の GET 専用キー（日本側サイトで使用中のもの）が新しい API にも自動で適用されます。
キーの権限設定で `news-ke` の GET が許可されていることを確認してください。管理画面 →「API キー」→ 対象キー → 「個別権限」。

## 4. 表示先

| 場所 | 内容 |
| --- | --- |
| トップページ「News & Collaborative Stories」 | 最新 3 件 |
| `/news.html` | 一覧（9 件ずつ、ページ送りあり） |
| `/news.html?id=<コンテンツ ID>` | 記事ページ |

## 5. 動作確認

1. `news-ke` に記事を 1 件公開する。
2. サイトを再読み込みし、トップの News に表示されることを確認する。
3. カードをクリックして `/news.html?id=...` が開くことを確認する。

日本側のニュースを両サイトに載せたい場合は、その記事を `news-ke` にも登録してください（`link` に日本側の記事 URL を入れると、その URL へ直接飛ばせます）。
