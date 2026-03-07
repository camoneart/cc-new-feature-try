# MCP ツール検索自動モード（ToolSearch）試行レポート

## 基本情報

| 項目 | 内容 |
|------|------|
| Issue | #18 |
| 対象機能 | MCP ツール検索自動モード（ToolSearch） |
| 導入バージョン | v2.1.7 |
| 試行バージョン | v2.1.62 |
| ステータス | GA（全ユーザーにデフォルト有効） |

## 機能概要

MCP ツールを多数設定している環境で、ツールの description（説明文・パラメータ定義）をコンテキストウィンドウに事前ロードせず、**ツール名のみを保持して必要時に ToolSearch で読み込む**遅延読み込み（Lazy Loading）機能。

## 仕組み

### 従来の挙動（遅延なし）

```
セッション開始
  → 全MCPツールの名前 + description + パラメータをコンテキストに載せる
  → コンテキスト消費量が大きい
```

### ToolSearch 有効時の挙動

```
セッション開始
  → MCPツールの「名前のみ」をコンテキストに載せる
  → description・パラメータは載せない
  → Claude がプロンプト内容とツール名から必要なツールを推測
  → ToolSearch で検索・読み込み → 使用可能に
```

### コンテキストに載る情報の比較

| 情報 | 遅延なし | ToolSearch 有効 |
|------|---------|----------------|
| ツール名（例: `mcp__brave-search__brave_web_search`） | 載る | 載る |
| description（説明文・用途の詳細） | 載る | **載らない** |
| パラメータ（引数の名前・型・必須/任意） | 載る | **載らない** |

### ToolSearch の検索方法

ToolSearch は2つの検索モードを持つ:

| モード | 構文 | 用途 |
|--------|------|------|
| キーワード検索 | `ToolSearch("slack message")` | どのツールが必要か分からない時 |
| 直接選択 | `ToolSearch("select:mcp__slack__read_channel")` | ツール名が分かっている時 |

## 設定

### `ENABLE_TOOL_SEARCH` 環境変数

`settings.json` の `env` セクションで設定する。

```json
{
  "env": {
    "ENABLE_TOOL_SEARCH": "<値>"
  }
}
```

| 値 | 動作 |
|---|------|
| `auto` | **デフォルト**。MCPツール description がコンテキストの10%を超えた時に遅延発動 |
| `auto:N` | カスタム閾値。N% を超えた時に遅延発動（N: 0-100） |
| `true` | 常に ToolSearch 有効（閾値に関係なく） |
| `false` | 無効化（全MCPツールを事前ロード） |

### `auto:N` の閾値カスタマイズ（v2.1.9 で追加）

```json
"ENABLE_TOOL_SEARCH": "auto:5"
```

上記は「MCPツール description がコンテキストの5%を超えたら遅延」を意味する。

### 無効化する方法

`disallowedTools` に `MCPSearch` を追加する。

### モデル制約

ToolSearch は `tool_reference` ブロックをサポートするモデルでのみ動作する:

- **Sonnet 4 以降**: 対応
- **Opus 4 以降**: 対応
- **Haiku**: **非対応**

## 試行結果

### 環境

| 項目 | 内容 |
|------|------|
| MCPサーバー数 | 6（chrome-devtools, brave-search, context7, claude-in-chrome, firecrawl, next-devtools） |
| 遅延ツール総数 | 70個以上 |
| グローバル設定 | `ENABLE_TOOL_SEARCH: "true"` |

### 1. 自動遅延検出の確認

**結果: 動作確認済み**

`/context` コマンドで確認したところ、MCPツールセクションに `loaded on-demand` と表示され、全MCPツールが遅延状態（Available）として一覧表示された。

### 2. ToolSearch でのキーワード検索

**結果: 正常にヒット**

- `ToolSearch("select:mcp__context7__resolve-library-id")` → 直接選択モードで即座に読み込み成功
- `ToolSearch("select:mcp__context7__query-docs")` → 読み込み後、正常にツール実行可能

読み込んだツールはセッション中は使える状態が維持された。

### 3. コンテキスト使用量の確認

**結果: 節約効果を確認**

`/context` コマンドの結果:

```
System tools: 16.7k tokens (8.4%)
```

70個以上のMCPツールの description が全て載っていた場合、この値は大幅に増加すると推測される。ツール名リストのみの保持により 8.4% に抑えられている。

## `ENABLE_TOOL_SEARCH: "true"` vs `auto`（デフォルト）の考察

### 常時有効（`true`）のメリット

| MCPツール description 合計 | `auto`（デフォルト） | `true` |
|---|---|---|
| 3% | 全部載る（3%消費） | 遅延（節約） |
| 7% | 全部載る（7%消費） | 遅延（節約） |
| 12% | 遅延発動（節約） | 遅延（節約） |

`true` は10%閾値以下の環境でもコンテキストを節約できる。CLAUDE.md のルール群・Skills・カスタムエージェントなど他にもコンテキストを消費する要素が多い環境では、たとえ数%でも節約する価値がある。

### 常時有効のコスト

MCPツールを使うたびに ToolSearch で1ターン（API呼び出し1回分）が追加される。ただし同一セッション内で一度読み込んだツールは再度の ToolSearch 不要。

### 推奨設定

| 環境 | 推奨 |
|------|------|
| MCPツールが多い（10個以上）+ コンテキスト節約重視 | `"true"` |
| MCPツールが中程度で細かく制御したい | `"auto:5"` など |
| MCPツールが少ない（数個） | `"auto"`（デフォルト）で十分 |

## 所感

- Lazy Loading パターンをLLMのコンテキストウィンドウ管理に応用した良い設計。Web開発の画像遅延読み込みと本質的に同じ
- ツール名の命名規則（`サーバー名__機能名`）が、description なしでも推測を可能にしている。命名規則の重要性を実感する
- 閾値ベースの自動判定（10%）により、ユーザーに設定を強いずに環境に応じた最適化を実現している
- `ENABLE_TOOL_SEARCH: "true"` はコンテキスト節約を最大化する積極的な設定として有用。デフォルトの `auto` だけでなく明示的に `true` を設定する価値がある

## バージョン履歴

| バージョン | 変更内容 |
|-----------|---------|
| v2.1.7 | 自動モードをデフォルトで全ユーザーに有効化（閾値10%） |
| v2.1.9 | `auto:N` 構文で閾値カスタマイズに対応 |

## 参考ドキュメント

- [Claude Code MCP ドキュメント](https://code.claude.com/docs/en/mcp)
- [Claude Code Changelog](https://code.claude.com/docs/en/changelog)
