# auth CLIサブコマンド 試行レポート

## 基本情報

| 項目 | 内容 |
|------|------|
| Issue | #13 |
| 対象機能 | `claude auth` サブコマンド |
| 導入バージョン | v2.1.41 |
| 試行バージョン | v2.1.59 |

## 機能概要

`claude auth` はClaude Codeの認証管理をCLIから直接行うためのサブコマンド群。
従来はセッション内の `/login` でしか認証操作ができなかったが、シェルから直接実行可能になった。

### サブコマンド一覧

| コマンド | 説明 |
|---------|------|
| `claude auth status` | 現在の認証状態をJSON形式で表示 |
| `claude auth login` | Anthropicアカウントにサインイン |
| `claude auth logout` | ログアウト |

## 動作確認結果

### 1. `claude auth` （引数なし）

サブコマンドを指定せずに実行すると、Usage（ヘルプ）が表示される。
stdout/stderrの両方に出力される（CLIツールの一般的なパターン）。

```
Usage: claude auth [options] [command]

Manage authentication

Options:
  -h, --help        Display help for command

Commands:
  help [command]    display help for command
  login [options]   Sign in to your Anthropic account
  logout            Log out from your Anthropic account
  status [options]  Show authentication status
```

### 2. `claude auth status`

認証状態をJSON形式で出力。プログラムからのパースに適した構造化データを返す。

```json
{
  "loggedIn": true,
  "authMethod": "claude.ai",
  "apiProvider": "firstParty",
  "email": "peterartworkdev@gmail.com",
  "orgId": "359458b8-26ff-4eb7-9caf-443e9103d615",
  "orgName": null,
  "subscriptionType": "max"
}
```

**出力フィールド**:

| フィールド | 説明 |
|-----------|------|
| `loggedIn` | ログイン状態（boolean） |
| `authMethod` | 認証方法（`claude.ai` / APIキーなど） |
| `apiProvider` | APIプロバイダー（`firstParty` = Anthropic直接） |
| `email` | ログイン中のメールアドレス |
| `orgId` | 組織ID |
| `orgName` | 組織名（個人利用の場合は `null`） |
| `subscriptionType` | サブスクリプション種別（`max` / `pro` など） |

### 3. `claude auth login`

ログインフローを開始する。既にログイン済みの場合でも実行可能。
セッション内の `/login` コマンドと機能的には同等。

### `/login` との比較

| 観点 | `/login` | `claude auth login` |
|------|---------|-------------------|
| 実行場所 | 対話セッション内 | シェルから直接 |
| 前提条件 | Claude Code起動中 | Claude Code未起動でもOK |
| 機能 | 認証フロー開始 | 認証フロー開始 |
| 結果 | 同一 | 同一 |

## 活用シーン

| シーン | 活用方法 |
|--------|----------|
| CI/CDセットアップ | `claude auth login` でパイプライン上の認証を非インタラクティブに実行 |
| リモートサーバー初期設定 | SSH越しにClaude Codeの認証だけ先に済ませる |
| 認証状態のスクリプト判定 | `claude auth status \| jq '.loggedIn'` でbooleanを取得 |
| 複数アカウント切替 | logout → login で別アカウントに切り替え |
| トラブルシューティング | `claude auth status` で認証方法・プロバイダー・プランを即座に確認 |

## 所感

- JSON出力の `claude auth status` がスクリプタブルで特に価値が高い
- セッション外から認証操作ができるため、自動化やセットアップスクリプトに組み込みやすい
- `subscriptionType` でプランが確認できるのは、機能の利用可否判断に便利
- `orgId` / `orgName` フィールドの存在から、Teams/Enterprise向けの組織管理機能への布石が見える
- CLI認証管理としてシンプルで過不足のない設計
