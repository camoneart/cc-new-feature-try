# CLAUDE_CODE_DISABLE_1M_CONTEXT 試行レポート

## 基本情報

| 項目 | 内容 |
|------|------|
| Issue | #22 |
| 対象機能 | 1Mコンテキストウィンドウの無効化環境変数 |
| 対象バージョン | v2.1.50 |
| 試行バージョン | v2.1.50 |

## 機能概要

`CLAUDE_CODE_DISABLE_1M_CONTEXT=1` を設定すると、モデルピッカー（`/model`）から 1M コンテキストウィンドウのモデルバリアント（`Opus (1M context)`、`Sonnet (1M context)`）が非表示になる。

## 前提知識

### デフォルトの動作

- デフォルトのコンテキストウィンドウは **200K トークン**
- 1M コンテキストは別の選択肢として `/model` に表示される
- 1M モデルを選択しても、200K を超えるまでは通常料金
- 200K 超過分からロングコンテキスト料金が適用される

### 1M コンテキストの利用条件

| プラン | 利用可否 |
|--------|----------|
| API / 従量課金 | フルアクセス |
| Pro / Max / Teams / Enterprise | Extra Usage 有効時に利用可能 |

## 設定方法

### プロジェクトスコープ（`.claude/settings.local.json`）

```json
{
  "env": {
    "CLAUDE_CODE_DISABLE_1M_CONTEXT": "1"
  }
}
```

### シェルから直接起動

```bash
CLAUDE_CODE_DISABLE_1M_CONTEXT=1 claude
```

### 設定スコープの選択肢

| スコープ | ファイル | Git管理 | 用途 |
|----------|----------|---------|------|
| プロジェクト | `.claude/settings.json` | される | チーム全体に適用 |
| プロジェクト（ローカル） | `.claude/settings.local.json` | されない | 個人の試行・検証用 |
| ユーザー | `~/.claude/settings.json` | されない | 全プロジェクトに適用 |
| Enterprise managed/policy | 管理者設定 | - | 組織レベルで強制 |

## 動作確認結果

### 環境変数なし（デフォルト）

`/model` で表示されるモデル一覧:

```
1. Default (recommended) ✓  Opus 4.6 · Most capable for complex work
2. Opus (1M context)        Opus 4.6 with 1M context · Billed as extra usage · $10/$37.50 per Mtok
3. Sonnet                   Sonnet 4.6 · Best for everyday tasks
4. Sonnet (1M context)      Sonnet 4.6 with 1M context · Billed as extra usage · $6/$22.50 per Mtok
5. Haiku                    Haiku 4.5 · Fastest for quick answers
```

### `CLAUDE_CODE_DISABLE_1M_CONTEXT=1` 設定後

`/model` から 1M context バリアントが非表示になることを確認。

## ユースケース

### 個人利用

- 実用性は低い。1M コンテキストはデフォルトで無効（明示的に選択しない限り有効にならない）ため、わざわざ選択肢を消す必要がない

### チーム・Enterprise利用

- **コスト管理**: メンバーが誤って 1M コンテキストを選択し、意図しない Extra Usage 課金が発生するのを防止
- **コンプライアンス**: 公式ドキュメントに "Useful for enterprise environments with compliance requirements" と記載
- **ガバナンス**: managed/policy スコープで設定すれば、組織全体で 1M 選択肢を強制的に非表示にできる

## 設計思想

「最小権限の原則」に基づくガードレール機能。人間の注意力に依存せず、不要な選択肢をシステムレベルで除去することでミスを未然に防ぐ。AWS IAM ポリシーや `availableModels` によるモデル制限と同じアプローチ。

## 所感

- 個人開発者にとっては実用性が低い（自分で選ばなければいいだけ）
- チーム・Enterprise 環境でのコスト管理ツールとしては有用
- `availableModels` 設定と組み合わせることで、より細かいモデルアクセス制御が可能
- 1M コンテキストの料金体系（200K超過分のみ課金）を理解していれば、過度に恐れる必要はない
