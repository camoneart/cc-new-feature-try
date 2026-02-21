# Trial Report: Worktree統合機能 (Issue #2)

## 試行バージョン

- Claude Code: v2.1.50
- 試行日: 2026-02-21

## 試行した機能

### 1. `--worktree` / `-w` CLIフラグ

**概要**: Claude Code 起動時に隔離された git worktree を自動作成する機能。

**確認結果**:
- `claude --help` にて `-w, --worktree [name]` フラグを確認
- `--tmux` フラグとの併用が可能（iTerm2ではnative pane、それ以外はtmux）
- ネストしたClaude Codeセッションの起動は安全上の理由で制限されている

### 2. `EnterWorktree` ツール

**概要**: セッション中にプログラム的に新しい worktree へ切り替える機能。

**確認結果**:
- worktree 内からでも新しい worktree を作成可能（ネスト制約なし）
- 新しい worktree はメインリポジトリの `.claude/worktrees/<name>` に作成される
- ブランチ名は `worktree-<name>` 形式で自動生成
- CWD が自動的に新しい worktree に切り替わる
- セッション終了時、変更がなければ自動クリーンアップ

### 3. サブエージェント `isolation: "worktree"`

**概要**: Task ツールで `isolation: "worktree"` を指定し、サブエージェントを隔離環境で実行する機能。

**確認結果**:
- サブエージェントごとに `agent-<hash>` 形式の一意な worktree が自動生成
- 専用ブランチ `worktree-agent-<hash>` で完全に隔離
- サブエージェントが作成したファイルは他の worktree に一切影響しない
- 変更があった場合は worktree が保持され、パスとブランチ名が返却される
- 変更がなければ自動クリーンアップ
- 2段ネスト（worktree > サブエージェント worktree）も動作確認済み

### 4. メイン working tree への影響確認

**確認結果**:
- サブエージェントが `isolation-test.txt` を作成
- メインリポジトリ、issue-2 worktree、EnterWorktree で作成した worktree のいずれにもファイルは存在しない
- サブエージェントの worktree 内にのみファイルが存在することを確認
- 各 worktree の `git status` にも影響なし

## 総合評価

**すべての試行項目が正常に動作。**

Worktree統合機能は、以下のユースケースで特に有用:

1. **並行開発**: 複数の issue を別々の worktree で同時作業
2. **安全なサブエージェント実行**: `isolation: "worktree"` により、サブエージェントの変更が本番コードに影響しない
3. **実験的変更**: EnterWorktree でいつでも隔離環境を作成し、気に入らなければ破棄

## 注意点

- ネストした Claude Code セッション（`claude` コマンドの入れ子）は安全上の理由で制限される
- worktree は同じ `.git` データベースを共有するため、ブランチの重複チェックアウトはできない
- `--tmux` は `--worktree` との併用が前提
