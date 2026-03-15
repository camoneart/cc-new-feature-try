---
name: creating-feature-trial-issues
description: Extract tryable feature updates from changelog or update summary files and create structured GitHub issues for feature trial tracking. Use when the user mentions "changelog issue化", "feature trial issues", "アプデをissue化", "機能試行issue", "新機能をissueに", "changelog to issues", "試せる機能をissue化", or wants to create GitHub issues from update/changelog content for testing new features.
---

# Creating Feature Trial Issues

Extract tryable feature updates from changelog/update summary files and create GitHub issues with structured trial instructions.

## Workflow

1. Read the specified changelog or update summary file
2. Identify unprocessed versions using registry + GitHub API
3. Extract tryable features from unprocessed versions only
4. Verify GitHub repository connectivity (`gh repo view`)
5. Create or verify the `feature-trial` label exists
6. Create issues in parallel batches (4 at a time)
7. Update [references/created-issues-registry.md](references/created-issues-registry.md) with newly created issues
8. Present summary table of all created issues

## References

- [Issue Template](references/issue-template.md) - issue のタイトル形式・本文テンプレート・難易度分類
- [Created Issues Registry](references/created-issues-registry.md) - 処理済みバージョン・作成済み issue の記録
- [Claude Code Changelog (原文)](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md) - 公式 changelog（英語原文）

## Default Source File

When no file is specified, use the project's changelog:
`/Users/camone/dev/claude-code/claude-code-learn/cc-changelog-ja/cc-changelog-ja.md`

The user may override this by passing a different file path as an argument.

## Step 1: Read and Analyze Source File

Read the file specified by the user (or the default source file above). Identify sections containing feature additions, new capabilities, and user-facing changes.

## Step 2: Identify Unprocessed Versions (Duplicate Prevention)

2段階チェックで重複を防止する。

### 2a. レジストリチェック（高速キャッシュ）

Read [references/created-issues-registry.md](references/created-issues-registry.md).

- 「処理済みバージョン」リストに含まれるバージョンは抽出対象から除外
- changelog 内の未処理バージョンだけを特定する

### 2b. GitHub API チェック（Source of Truth）

```bash
gh issue list --repo <REPO> --label "feature-trial" --state all --limit 200 --json number,title,state
```

- **全 issue（open + closed）** を取得し、タイトルで個別照合
- レジストリが古い場合でも、GitHub API が最新の正を返す
- 別セッションで issue をクローズした場合もここで検知できる

**重複判定**: レジストリの処理済みバージョン OR GitHub の既存 issue タイトルに該当する機能はスキップ。

## Step 3: Extract Tryable Features

Apply filtering criteria to **unprocessed versions only**. Skip features already registered in the registry or found in GitHub issues.

**Include** (user can actively try):
- New CLI flags/options, slash commands, configuration options
- New hook events, workflow capabilities, tool features
- New authentication/session management features, UI/UX enhancements

**Exclude** (not directly tryable):
- Security fixes, performance improvements, memory leak fixes
- Breaking changes/deprecations, bug fixes, internal refactoring

For each feature, extract: feature name, version number, description, setup steps, and related details.

## Step 4: Verify GitHub Connectivity

```bash
gh repo view --json nameWithOwner
gh label list --repo <REPO>
```

If `feature-trial` label does not exist, create it:
```bash
gh label create "feature-trial" --repo <REPO> --description "新機能の試行・検証" --color "1d76db"
```

## Step 5: Create Issues

For issue body template and title format, read [references/issue-template.md](references/issue-template.md).

Create issues in parallel batches of 4 using `gh issue create`:

```bash
gh issue create --repo <REPO> \
  --title "試行(v[Version]): [Feature Name]（[Supplement]）" \
  --label "feature-trial" \
  --body "$(cat <<'EOF'
[Issue body from template]
EOF
)"
```

Assign difficulty per feature: Low (instant try), Medium (some setup), High (complex setup).

## Step 6: Update Registry

After issues are created, update [references/created-issues-registry.md](references/created-issues-registry.md):

1. 「処理済みバージョン」リストに新しく処理したバージョンを追加
2. 「Issue レジストリ」に新しいバージョンセクションを追加（最新バージョンが先頭）
3. 各 issue の番号、タイトル、難易度を記録

## Step 7: Present Summary

After all issues are created, present a summary table with issue numbers, titles, and difficulty levels. Include the repository issues URL filtered by the `feature-trial` label.
