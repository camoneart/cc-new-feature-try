#!/bin/bash
# TeammateIdle Hook
# チームメイトがアイドル状態になった時に発火するフック
#
# 環境変数:
#   CLAUDE_TEAMMATE_NAME - アイドルになったチームメイトの名前
#   CLAUDE_SESSION_ID    - セッションID
#
# 終了コード:
#   0 - アイドルを許可
#   2 - アイドルをブロック（チームメイトに作業を続行させる）

LOGFILE="$(dirname "$0")/../../trial-report-hooks.log"
TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")

echo "[$TIMESTAMP] TeammateIdle: teammate=${CLAUDE_TEAMMATE_NAME:-unknown}, session=${CLAUDE_SESSION_ID:-unknown}" >> "$LOGFILE"

# アイドルを許可
exit 0
