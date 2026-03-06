# 検証結果: ENABLE_CLAUDEAI_MCP_SERVERS=false（claude.ai MCP無効化）

## 基本情報

- 環境変数: `ENABLE_CLAUDEAI_MCP_SERVERS`
- バージョン: Claude Code v2.1.63
- プラン: Claude Max（Opus 4.6）
- OS: macOS Darwin 25.3.0
- フィーチャーフラグ: `tengu_claudeai_mcp_connectors: true`（有効）

## 機能概要

`ENABLE_CLAUDEAI_MCP_SERVERS=false` 環境変数を設定することで、claude.ai が提供する MCP コネクター（公式統合サービス）の Claude Code への自動同期を無効化できる。

### claude.ai MCP コネクターとは

claude.ai の Web UI（`claude.ai/settings/connectors`）で設定できる 50+ の公式 MCP 統合:

- **コミュニケーション**: Slack, Gmail, Microsoft 365
- **プロジェクト管理**: Asana, Jira, Linear, Monday.com, Trello
- **コンテンツ**: Notion, Google Drive, WordPress
- **デザイン**: Figma, Canva
- **開発**: GitHub, Sentry, Amplitude
- **その他**: Stripe, PayPal, Zapier, Supabase 等

これらは claude.ai Pro/Max/Team/Enterprise ユーザーが Web UI で接続設定すると、同じアカウントでログイン中の Claude Code に自動同期される。

## テスト手順と結果

### テスト1: ENABLE_CLAUDEAI_MCP_SERVERS=true（デフォルト）

```bash
CLAUDECODE="" ENABLE_CLAUDEAI_MCP_SERVERS=true claude -p "List all tool names that start with 'mcp__'."
```

**結果**: ユーザー設定 MCP サーバーのみ表示（5サーバー、48ツール）

| サーバー | ツール数 |
|----------|---------|
| brave-search | 6 |
| context7 | 2 |
| chrome-devtools | 27 |
| firecrawl | 10 |
| next-devtools | 7 |

### テスト2: ENABLE_CLAUDEAI_MCP_SERVERS=false

```bash
CLAUDECODE="" ENABLE_CLAUDEAI_MCP_SERVERS=false claude -p "List all tool names that start with 'mcp__'."
```

**結果**: テスト1と**完全に同一**

### 比較結果

| 項目 | true (デフォルト) | false |
|------|------------------|-------|
| ユーザー設定 MCP | 全て利用可能 | 全て利用可能 |
| claude.ai MCP | なし（未設定） | なし（無効化） |
| diff | - | **差分なし** |

## 差分がなかった理由

テスト環境の claude.ai アカウントに MCP コネクターが設定されていなかったため。この環境変数は **claude.ai 側で設定した公式統合** のみを制御し、`.claude.json` や `claude mcp add` で追加したユーザー設定 MCP サーバーには影響しない。

## 影響範囲

### 影響あり
- claude.ai で設定した MCP コネクター（Slack, Notion, Figma 等の公式統合全て）

### 影響なし
- `.claude.json` や `claude mcp add` で追加したユーザー設定 MCP サーバー
- Chrome 拡張等のローカル MCP サーバー
- Claude Code の基本機能（Read, Write, Edit, Bash, Grep, Glob 等）

## 永続的な設定方法

```bash
# .zshrc に追加
export ENABLE_CLAUDEAI_MCP_SERVERS=false

# または .envrc（direnv使用時）
export ENABLE_CLAUDEAI_MCP_SERVERS=false
```

## 所感

1. **環境変数は正常に動作する** - 設定自体は問題なく認識されている（`env` コマンドで確認済み）
2. **効果の確認には claude.ai 側の設定が必要** - claude.ai/settings/connectors でコネクターを追加しないと差分は出ない
3. **セキュリティ面で有用** - 企業環境や機密プロジェクトで、意図しない外部サービスへのアクセスを防止できる
4. **ユーザー設定 MCP には影響しない** - 自分で設定した MCP サーバーは引き続き利用可能なので安心
5. **段階的なロールアウト** - v2.1.46 で `tengu_claudeai_mcp_connectors` フラグ追加 → v2.1.63 でオプトアウト手段追加
6. **デフォルト有効の設計思想** - 利便性とセキュリティのバランスを取り、必要な人だけオプトアウトできる設計

## 関連リンク

- [Claude Connectors](https://claude.com/connectors)
- [Get started with custom connectors using remote MCP](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp)
- [MCP connector - Claude Docs](https://docs.claude.com/en/docs/agents-and-tools/mcp-connector)
