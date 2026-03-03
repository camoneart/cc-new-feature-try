# WorktreeCreate/WorktreeRemove フック 試行レポート

## 概要

| 項目 | 内容 |
|------|------|
| 対象機能 | `WorktreeCreate` / `WorktreeRemove` フックイベント |
| バージョン | v2.1.50 |
| Issue | #21 |
| 試行方法 | 公式ドキュメント・コミュニティリソースによる調査分析 |

## 機能の概要

Claude Code v2.1.50 で追加された2つのフックイベント。worktree の作成・削除時にカスタムシェルコマンドを実行できる。

**重要な設計特性**: WorktreeCreate フックを設定すると、**デフォルトの git worktree 動作が完全に置き換わる**。追加の処理を差し込むのではなく、git の代替として動作する。

## フックの仕様

### WorktreeCreate

| 項目 | 内容 |
|------|------|
| 発火タイミング | `--worktree` または `isolation: "worktree"` 使用時 |
| 入力（stdin JSON） | `session_id`, `cwd`, `name` |
| 出力 | stdout に作成した worktree の**絶対パス**を出力（必須） |
| 失敗時 | non-zero exit で worktree 作成が失敗 |
| matcher | 非対応（常に発火） |
| フックタイプ | `type: "command"` のみ |

### WorktreeRemove

| 項目 | 内容 |
|------|------|
| 発火タイミング | セッション終了時またはサブエージェント完了時 |
| 入力（stdin JSON） | `session_id`, `cwd`, `worktree_path` |
| 出力 | なし（サイドエフェクト専用） |
| 失敗時 | デバッグモードでログのみ（ブロック不可） |
| matcher | 非対応（常に発火） |
| フックタイプ | `type: "command"` のみ |

## ベストプラクティス

### 1. Git 以外の VCS を使っているプロジェクト（本命ユースケース）

SVN、Perforce、Mercurial 等で worktree 隔離を実現する。

```json
{
  "hooks": {
    "WorktreeCreate": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'NAME=$(jq -r .name); DIR=\"$HOME/.claude/worktrees/$NAME\"; svn checkout https://svn.example.com/repo/trunk \"$DIR\" >&2 && echo \"$DIR\"'"
          }
        ]
      }
    ],
    "WorktreeRemove": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'jq -r .worktree_path | xargs rm -rf'"
          }
        ]
      }
    ]
  }
}
```

### 2. 並列 worktree の環境自動セットアップ

`.env` コピー、依存インストール、ポート衝突回避を自動化する（[claude-worktree-hooks](https://github.com/tfriedel/claude-worktree-hooks) が実践）。

### 3. カスタムディレクトリへの配置

Laravel Valet/Herd 等、`.claude/worktrees/` 以外にworktreeを配置する必要がある場合。

## 実装上の注意点

### stdout の契約

WorktreeCreate は stdout に**絶対パスだけ**を出力する必要がある。余計な出力が混ざると Claude Code がサイレントにハングする。

```bash
# NG: git の出力も stdout に流れる
git worktree add "$DIR" -b "$NAME"

# OK: git の出力は stderr にリダイレクト
git worktree add "$DIR" -b "$NAME" >&2
echo "$DIR"
```

### 必ずペアで設定

WorktreeCreate を設定したら WorktreeRemove も必ず設定する。片方だけだと worktree ディレクトリがディスク上に残り続ける。

### stdin は一度しか読めない

JSON 入力は stdin 経由で渡されるため、変数に保存してから使う。

```bash
INPUT=$(cat)
NAME=$(echo "$INPUT" | jq -r '.name')
```

## 結論

### Git/GitHub をメインで使う場合の評価

| 観点 | 評価 |
|------|------|
| 重要度 | **低い** |
| 理由 | Claude Code がデフォルトで git worktree を適切に処理するため、フックで置き換える必要がない |
| 例外 | 並列 worktree を大量に回す場合の環境セットアップ自動化には有用 |

### この機能が刺さる対象者

1. **Git 以外の VCS** を使っているチーム — 最も恩恵が大きい
2. **並列 worktree のヘビーユーザー** — 環境セットアップの自動化
3. **特殊なディレクトリ構造が必要**なフレームワーク利用者

### 代替アプローチ（Git ユーザー向け）

Git ユーザーが worktree の環境セットアップを自動化したい場合は、`SessionStart` フックや `CLAUDE.md` に指示を書く方が素直なケースが多い。

## 参考リソース

- [Hooks reference - Claude Code Docs](https://code.claude.com/docs/en/hooks)
- [claude-worktree-hooks (tfriedel)](https://github.com/tfriedel/claude-worktree-hooks)
- [Claude Code Worktrees: Run Parallel Sessions Without Conflicts](https://claudefa.st/blog/guide/development/worktree-guide)
- [Creating worktrees with Claude Code in a custom directory](https://www.sabatino.dev/creating-worktrees-with-claude-code-in-a-custom-directory/)
