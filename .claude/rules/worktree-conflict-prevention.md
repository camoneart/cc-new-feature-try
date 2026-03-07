# Worktree コンフリクト防止ルール

## 共有ファイル変更前の必須手順

`.gitignore`、`package.json`、`tsconfig.json` 等の共有設定ファイルを変更する前に、必ず以下を実行すること:

1. `git fetch origin main` で最新の main を取得
2. `git show origin/main:<ファイル名>` で main 側の現在の内容を確認
3. 追加しようとしているエントリが既に main に存在する場合は、変更しない
4. 変更が必要な場合は、先に `git merge origin/main` を実行してから変更する

## PR作成前の必須手順

PR を作成する前に、必ず以下を実行すること:

1. `git fetch origin main`
2. `git merge origin/main` でコンフリクトがないことを確認
3. コンフリクトがある場合は解消してからPRを作成する
