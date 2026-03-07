#!/bin/bash
# Issue #101: agent_id / agent_type フィールド調査用フック
# stdin の JSON をダンプして、agent_id / agent_type の存在を確認する

LOGFILE="/tmp/agent-hook-log.txt"

# stdin から JSON を読み取り
INPUT=$(cat)

# タイムスタンプ付きでログに記録
echo "=== $(date '+%Y-%m-%d %H:%M:%S') ===" >> "$LOGFILE"
echo "$INPUT" | python3 -m json.tool >> "$LOGFILE" 2>/dev/null || echo "$INPUT" >> "$LOGFILE"
echo "" >> "$LOGFILE"

# agent_id / agent_type をハイライト抽出
AGENT_ID=$(echo "$INPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('agent_id','NOT_FOUND'))" 2>/dev/null)
AGENT_TYPE=$(echo "$INPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('agent_type','NOT_FOUND'))" 2>/dev/null)

echo "--- agent fields ---" >> "$LOGFILE"
echo "agent_id: $AGENT_ID" >> "$LOGFILE"
echo "agent_type: $AGENT_TYPE" >> "$LOGFILE"
echo "===================" >> "$LOGFILE"
echo "" >> "$LOGFILE"
