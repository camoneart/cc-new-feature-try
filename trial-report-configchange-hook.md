# Issue #7: ConfigChangeフック - 試行レポート

## 対象バージョン

- v2.1.49

## 概要

セッション中に設定ファイルが変更された際に発火するフックイベント。エンタープライズ向けのセキュリティ監査や、不正な設定変更のブロックを目的として導入された。

## 公式ドキュメント調査結果

### ConfigChangeフックの仕様

- **発火タイミング**: セッション中に設定ファイル（settings.json、スキルファイル等）が外部プロセスやエディタによって変更されたとき
- **設定場所**: `.claude/settings.json` の `hooks` セクション

### フックに渡される入力フィールド

| フィールド | 型 | 説明 |
|------------|------|------|
| `session_id` | string | 現在のセッションID |
| `transcript_path` | string | 会話JSONへのパス |
| `cwd` | string | フック発火時のワーキングディレクトリ |
| `permission_mode` | string | 現在の権限モード（`default`, `plan`, `acceptEdits`, `dontAsk`, `bypassPermissions`） |
| `hook_event_name` | string | `"ConfigChange"` |
| `source` | string | どの設定タイプが変わったかを示す |
| `file_path` | string | 変更されたファイルの具体的なパス |

### `source` フィールドの値（matcherで絞り込み可能）

- `user_settings` -- ユーザー設定（`~/.claude/settings.json`）
- `project_settings` -- プロジェクト設定（`.claude/settings.json`）
- `local_settings` -- ローカル設定（`.claude/settings.local.json`）
- `policy_settings` -- マネージドポリシー設定
- `skills` -- スキルファイル

### 設定変更のブロック方法

2つの方法で変更を阻止できる:

1. **exit code 2** でフックスクリプトを終了する
2. **`{"decision": "block"}`** をJSON出力する

ブロックされた場合、新しい設定は実行中のセッションには適用されない。

### 設定例（監査ログ）

```json
{
  "hooks": {
    "ConfigChange": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "jq -c '{timestamp: now | todate, source: .source, file: .file_path}' >> ~/claude-config-audit.log"
          }
        ]
      }
    ]
  }
}
```

## ユースケース分析

| シーン | 使う機能 | 効果 |
|--------|----------|------|
| 監査証跡が必要 | ログ記録 | コンプライアンス対応（SOC2, ISO27001等） |
| 設定を勝手に変えさせたくない | ブロック（exit code 2） | セキュリティポリシーの強制 |
| チームで設定変更を共有 | 通知連携（Slack等） | 透明性の確保 |
| Claude自身の設定改変防止 | ブロック | ガードレール |
| スキル/プラグインの安全性 | skills matcherで検知 | サプライチェーン防御 |

## 学んだこと

### ConfigChangeの位置づけ

- 明確に**エンタープライズ向け**の機能
- 個人開発では出番が限られるが、セキュリティポリシーが求められる環境で真価を発揮する
- Claude Codeのフック設定はセッション起動時にスナップショットされるため、ConfigChangeフックは「設定ファイル自体の変更」という別レイヤーを守る仕組み

### 他のフックとの違い

- `PreToolUse` / `PostToolUse`: ツール実行前後に発火
- `UserPromptSubmit`: ユーザーがプロンプトを送信したときに発火
- `ConfigChange`: **設定ファイルの変更**という独自のトリガーを持つ唯一のフック

### ブロック機能の重要性

- 他のフックイベント（PreToolUse等）にもブロック機能はあるが、ConfigChangeでの「設定変更そのもののブロック」は、セキュリティポリシーの強制力を一段階引き上げるものである

## 試行ステータス

- [x] 公式ドキュメント調査・仕様の把握
- [ ] `.claude/settings.json` にConfigChangeフックを実際に設定
- [ ] セッション中に設定ファイルを変更してフック発火を確認
- [ ] 設定変更のブロック機能（exit codeでブロック）を試す
- [ ] フックで受け取れるイベント情報を確認・記録

> Note: 本レポートはドキュメント調査フェーズの成果物。実機試行は後続セッションで実施予定。
