# HTTP フック（JSON POST/受信型フック）試行メモ

## バージョン
- Claude Code: 2.1.63
- Node.js: v24.13.1
- Express: 5.2.1

## 試行日
2026-03-03

## セットアップ

### 簡易サーバー
- `hook-server/server.js`: 全イベントを受信・ログ出力する基本版
- `hook-server/server-with-deny.js`: `rm -rf` コマンドを deny する検証版
- ポート: 8080
- エンドポイント: `POST /hooks/:eventType`
- 履歴確認: `GET /history`

### フック設定 (.claude/settings.local.json)
```json
{
  "hooks": {
    "PreToolUse": [{ "matcher": "Bash", "hooks": [{ "type": "http", "url": "http://localhost:8080/hooks/pre-tool-use" }] }],
    "PostToolUse": [{ "matcher": ".*", "hooks": [{ "type": "http", "url": "http://localhost:8080/hooks/post-tool-use" }] }],
    "Stop": [{ "hooks": [{ "type": "http", "url": "http://localhost:8080/hooks/stop" }] }]
  }
}
```

## 動作確認結果

### 1. サーバーの起動と受信: OK
- Express サーバーが正常に起動
- curl でシミュレートした JSON ペイロードを正しく受信

### 2. 実際の Claude Code セッションでの動作: OK
- Zellij で左右分割（左: サーバー、右: Claude Code）で検証
- `echo hello を実行して` プロンプトで **3つのフックイベントが正常に受信された**

#### PreToolUse ペイロード（実データ）
```json
{
  "session_id": "6c4164fd-85b6-4f4b-b5d3-892409ae7d25",
  "transcript_path": "/Users/camone/.claude/projects/...jsonl",
  "cwd": "/Users/camone/dev/.../issue-77-http-hooks",
  "permission_mode": "default",
  "hook_event_name": "PreToolUse",
  "tool_name": "Bash",
  "tool_input": {
    "command": "echo hello",
    "description": "echo hello を実行"
  },
  "tool_use_id": "toolu_01KfQ73AanJFE7BFhk2AP69W"
}
```

#### PostToolUse ペイロード（実データ）
```json
{
  "hook_event_name": "PostToolUse",
  "tool_name": "Bash",
  "tool_input": { "command": "echo hello", "description": "echo hello を実行" },
  "tool_response": {
    "stdout": "hello",
    "stderr": "",
    "interrupted": false,
    "isImage": false,
    "noOutputExpected": false
  },
  "tool_use_id": "toolu_01KfQ73AanJFE7BFhk2AP69W"
}
```

#### Stop ペイロード（実データ）
```json
{
  "hook_event_name": "Stop",
  "stop_hook_active": false,
  "last_assistant_message": "hello が無事に出力されたよ！..."
}
```

#### 発見事項
- **User-Agent は `axios/1.8.4`**: Claude Code は内部的に axios で HTTP POST している
- **`description` フィールド**: Bash ツールの説明文もフックに渡される
- **`tool_response`**: PostToolUse には stdout/stderr 等の実行結果が丸ごと含まれる
- **`last_assistant_message`**: Stop には Claude の応答テキスト全体が含まれる

### 3. サーバー未起動時の動作: ノンブロッキング確認済
- サーバーが起動していない状態で Claude Code を起動→ツール実行
- `PreToolUse:Bash hook error`、`Stop hook error: ECONNREFUSED` と表示
- **ツール実行自体は正常に続行された**（ノンブロッキング設計を確認）

### 4. deny レスポンスの形式
```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "HTTP Hook: rm -rf command blocked by remote policy server"
  }
}
```

### 5. フックの反映タイミング
- 設定ファイルの変更は**次回セッション起動時**に反映される
- 実行中のセッションには即座に反映されない（セキュリティ上の設計）

## 所感

### 良い点
1. **設定がシンプル**: `type: "http"` + `url` だけで最小構成が組める
2. **言語非依存**: シェルスクリプトを書かなくても、どんな言語の HTTP サーバーでも受けられる
3. **外部連携が自然**: Slack/Discord/ログ収集サービスへの通知が直接的にできる
4. **エラー耐性**: non-2xx はノンブロッキングなので、外部サービスが落ちても Claude の作業を止めない
5. **セキュアな認証**: `headers` + `allowedEnvVars` で環境変数ベースの認証トークンを安全に渡せる

### 注意点
1. `/hooks` メニュー（UI）からは HTTP フックを追加できない（JSON 直接編集が必要）
2. フック設定は起動時スナップショットのため、設定変更後はセッション再起動が必要
3. ブロックしたい場合は明示的に 2xx + deny JSON を返す必要がある（command フックの exit 2 とは異なる）
4. ローカルサーバーの起動管理が別途必要（常時起動の仕組みが必要）

### ユースケースの整理
| カテゴリ | 例 |
|:---|:---|
| 通知 | Slack/Discord への自動通知 |
| 監査 | ツール実行ログの外部記録 |
| セキュリティ | リモートポリシーサーバーでのコマンド検証 |
| チーム運用 | 共通の検証サーバーで全員のフックを一元管理 |
| CI/CD | フック処理をクラウド関数に委譲 |

## 未検証項目
- [x] 実際の Claude Code セッションでの HTTP フック動作 → 正常動作確認済
- [x] non-2xx レスポンス時のノンブロッキング動作確認 → ECONNREFUSED でもツール実行は続行
- [ ] `headers` + `allowedEnvVars` による認証トークン付きリクエスト
- [ ] deny レスポンスによるツール実行ブロック（server-with-deny.js での検証）
- [ ] タイムアウト動作の確認

## 既存プロジェクトへの適用検討

### HTTPフック vs 従来方式（ファイル読み取り）の違い
| | ファイル読み取り（プル型） | HTTPフック（プッシュ型） |
|:---|:---|:---|
| データの流れ | ツールが読みに行く | Claude Codeが送ってくる |
| タイミング | 事後（ファイルに書かれた後） | リアルタイム（実行前/後に即座） |
| 実行前データ | 取れない | PreToolUseで取れる |
| ブロック | できない | denyレスポンスで可能 |
| リモート対応 | ローカルのみ | ネットワーク越しOK |

### kuchiyose（口寄せ）への適用 → 現時点では不要
- 事後分析型の可視化ツールなので、ファイル読み取り（プル型）で十分
- MVPの完成が優先
- 将来「リアルタイムでフローチャートが伸びていく」機能を追加する場合に検討

### ninmu（忍務）への適用 → 不要
- 独立したタスク管理ツールであり、Claude Codeの可視化ツールではない
- Claude Code連携を行う場合も、REST API（POST /api/ninmu）を直接叩く方がシンプル
- ただし、Claude Codeの内部タスクとninmuのタスクを自動同期したい要件が出た場合は再検討
