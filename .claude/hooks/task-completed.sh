#!/bin/bash
# TaskCompleted Hook
# チームメイトがタスクを完了した時に発火するフック
#
# 環境変数:
#   CLAUDE_TEAMMATE_NAME - タスクを完了したチームメイトの名前
#   CLAUDE_SESSION_ID    - セッションID
#
# 終了コード:
#   0 - 完了を許可
#   2 - 完了をブロック（チームメイトに追加作業をさせる）

LOGFILE="$(dirname "$0")/../../trial-report-hooks.log"
TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")

echo "[$TIMESTAMP] TaskCompleted: teammate=${CLAUDE_TEAMMATE_NAME:-unknown}, session=${CLAUDE_SESSION_ID:-unknown}" >> "$LOGFILE"

# 完了を許可
exit 0
