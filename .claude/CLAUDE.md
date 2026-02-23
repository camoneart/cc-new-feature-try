# Current Task: Issue #2

## 試行: Worktree統合（--worktreeフラグ）

## 概要
Claude を隔離された git worktree で起動する機能。

## バージョン
v2.1.49

## 試行手順
1. `claude --worktree` または `claude -w` で起動
2. 隔離されたworktreeでの作業を確認
3. サブエージェントの `isolation: "worktree"` の動作を確認
4. メインのworking treeに影響がないことを確認

## 関連情報
- `--worktree`（`-w`）フラグを追加
- サブエージェントが一時的な git worktree で作業するための `isolation: "worktree"` をサポート

## メモ
- git worktreeの基本的な仕組みを理解した上で試行すること

### Labels
- `feature-trial`: 新機能の試行・検証

## Instructions

- This worktree was created to work on the above issue
- Focus on implementing the requirements described in the issue
- Create a feature branch and commit changes with references to issue #2
- When implementation is complete, create a PR that closes this issue
