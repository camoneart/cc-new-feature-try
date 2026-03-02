# Issue #74: worktree間プロジェクト設定・自動メモリ共有 検証レポート

## 概要

Claude Code v2.1.63 で導入された、同一リポジトリの git worktree 間でプロジェクト設定と自動メモリが共有される機能の動作検証。

## 環境

- Claude Code: v2.1.63
- リポジトリ: cc-new-feature-try（worktree 50+）

## 検証結果

| 検証項目 | 結果 | 詳細 |
|----------|------|------|
| 自動メモリの共有 | OK | git-common-dir 経由でメインリポジトリのキーに解決され、全 worktree で共有 |
| プロジェクト設定の共有 | OK | git-common-dir 経由でメインリポジトリの .claude/settings.json を参照可能 |
| CLAUDE.local.md の分離 | OK | git 未追跡ファイルのため各 worktree 固有のまま |

## 共有メカニズム

### 自動メモリ（auto memory）

- 保存先: `~/.claude/projects/<キー>/memory/`
- キーの算出: `git rev-parse --git-common-dir` でメインリポジトリのパスを取得し、`/` と `_` を `-` に変換
- v2.1.63 以前: worktree のファイルパスをそのまま使用 → worktree ごとに別々のメモリ
- v2.1.63 以降: git-common-dir 経由でメインリポジトリのパスに統一 → 全 worktree で共有

### プロジェクト設定（.claude/settings.json）

- Claude Code が worktree 内で起動された際、git-common-dir 経由でメインリポジトリの working directory を特定
- メインリポジトリの `.claude/settings.json` を参照するため、worktree のブランチにファイルがなくても設定が適用される

### CLAUDE.local.md（分離対象）

- git 未追跡ファイルのため、worktree の working directory に物理的に存在するもののみ有効
- gtr が worktree 作成時に生成するため、worktree ごとに固有のタスクコンテキストを保持
- 共有されない（意図的な設計）

## 補足事項

- v2.1.63 以前に作成された worktree 固有のメモリディレクトリ（`~/.claude/projects/` 配下）はそのまま残留。マイグレーションの有無は未確認
- ユーザーが意識して操作する部分はなく、バージョンアップするだけで恩恵を受けられる内部改善
