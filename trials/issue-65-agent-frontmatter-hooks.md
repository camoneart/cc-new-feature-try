# Issue #65: エージェントフロントマターにフック（ライフサイクルフック）

## 概要

Claude Code v2.1.0 の新機能。カスタムエージェント（`.claude/agents/*.md`）のフロントマターに PreToolUse / PostToolUse / Stop フックを定義し、エージェントのライフサイクルにスコープされた自動処理を設定できる。

## 機能の仕組み

### 対象

| 種類 | 定義場所 | フロントマターフック |
|---|---|---|
| ビルトインエージェント（Explore, Plan 等） | Claude Code 内部 | 書けない |
| カスタムエージェント | `.claude/agents/*.md` | 書ける |

### サポートされるフックイベント

すべてのフックイベントがサポートされるが、サブエージェントで最も一般的なのは以下の3つ:

| イベント | マッチャー入力 | 発火タイミング |
|---|---|---|
| PreToolUse | ツール名 | サブエージェントがツールを使用する前 |
| PostToolUse | ツール名 | サブエージェントがツールを使用した後 |
| Stop | (なし) | サブエージェントが終了したとき（SubagentStop に変換） |

### フロントマターの書式例

```yaml
---
name: my-agent
hooks:
  PostToolUse:
    - matcher: "Write"
      hooks:
        - type: command
          command: "echo 'File written' >> /tmp/agent-hooks.log"
  Stop:
    - hooks:
        - type: command
          command: "echo 'Agent completed' >> /tmp/agent-hooks.log"
---
```

## 調査結果

### カスタムエージェント一覧とフック活用度

| エージェント | フック活用度 | 理由 |
|---|---|---|
| frontend-developer | 高 | Write/Edit を頻繁に使う。自動フォーマットに最適 |
| test-ai-tdd-expert | 高 | テストファイルを書いた後のテスト自動実行に有効 |
| security-devsecops-expert | 中 | セキュリティスキャンの自動実行に活用可能 |
| context-engineering-agent | 低 | アドバイザリー的な役割。コードを書く頻度が低い |
| article-summarizer | 不要 | Read-only（WebFetch のみ）。ファイル書き込みしない |

### 設定内容

`frontend-developer` に PostToolUse フックを追加:

```yaml
hooks:
  PostToolUse:
    - matcher: "Write"
      hooks:
        - type: command
          command: "echo '[frontend-dev] Written: ${input.file_path} at $(date)' >> /tmp/agent-hooks.log"
    - matcher: "Edit"
      hooks:
        - type: command
          command: "echo '[frontend-dev] Edited: ${input.file_path} at $(date)' >> /tmp/agent-hooks.log"
```

## 学んだこと

- エージェントフロントマターで定義した `Stop` フックは、実行時に `SubagentStop` に変換される
- ビルトインエージェント（Explore, Plan 等）にはフロントマターを書けない
- `${input.file_path}` でツールの入力パラメータを参照可能
- Read-only エージェント（article-summarizer 等）にはフックの恩恵が少ない
- スキル（`.claude/commands/*.md`）のフロントマターにも同様にフック定義可能
- `once: true` 設定でフックを1回だけ実行も可能（v2.1.0）

## 今後の展開

- [ ] frontend-developer を実際に呼び出してフック発火を確認する
- [ ] ログ出力から `npx biome check --fix` 等の実用コマンドに昇格
- [ ] Stop フック（SubagentStop）の動作確認
- [ ] `once: true` 設定の動作確認
