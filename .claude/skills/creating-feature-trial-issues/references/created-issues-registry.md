# Created Issues Registry

issue作成済みの changelog 項目を記録し、重複作成を防止する。

## 使い方

- スキル実行時、Step 2（機能抽出）の前にこのファイルを読む
- changelog から抽出した機能が既にレジストリに登録されている場合、スキップする
- 新規 issue 作成後、このファイルを更新する

## 処理済みバージョン

issue化対象の全バージョンを処理済みとして記録。ここにリストされたバージョンは再処理不要。

- 2.1.76, 2.1.75, 2.1.74, 2.1.73, 2.1.72
- 2.1.71, 2.1.70, 2.1.69, 2.1.68, 2.1.66, 2.1.63, 2.1.59, 2.1.51, 2.1.50, 2.1.49, 2.1.47
- 2.1.45, 2.1.41, 2.1.36, 2.1.33, 2.1.32, 2.1.30
- 2.1.27, 2.1.23, 2.1.20, 2.1.19, 2.1.18, 2.1.16
- 2.1.14, 2.1.10, 2.1.6, 2.1.0, 2.0.64

## オープン Issue（未着手）

現在オープンで試行待ちの issue。

### v2.1.76

| # | タイトル | 難易度 |
|---|---------|--------|
| #138 | MCP elicitation サポート（インタラクティブ入力リクエスト） | High |
| #139 | Elicitation / ElicitationResult フック（elicitationインターセプト） | Medium |
| #140 | -n/--name CLI フラグ（起動時セッション名設定） | Low |
| #141 | worktree.sparsePaths 設定（モノレポ向けsparse-checkout） | Medium |
| #142 | PostCompact フック（コンパクション完了通知） | Medium |

### v2.1.75

| # | タイトル | 難易度 |
|---|---------|--------|
| #135 | /rename セッション名プロンプトバー表示 | Low |
| #136 | メモリファイル最終更新タイムスタンプ（新旧判断の改善） | Low |
| #137 | フック権限プロンプトのソース表示（settings/plugin/skill識別） | Low |

### v2.1.74

| # | タイトル | 難易度 |
|---|---------|--------|
| #132 | /context アクション可能な提案（コンテキスト最適化ヒント） | Low |
| #133 | autoMemoryDirectory 設定（自動メモリカスタムディレクトリ） | Medium |
| #134 | CLAUDE_CODE_SESSIONEND_HOOKS_TIMEOUT_MS（SessionEndフックタイムアウト設定） | Medium |

### v2.1.73

| # | タイトル | 難易度 |
|---|---------|--------|
| #131 | modelOverrides 設定（カスタムプロバイダーモデルIDマッピング） | Medium |

### v2.1.72

| # | タイトル | 難易度 |
|---|---------|--------|
| #123 | /copy wキー（クリップボードバイパスのファイル直接書き込み） | Low |
| #124 | /plan 説明引数（プランモード即座開始） | Low |
| #125 | ExitWorktree ツール（worktreeセッション離脱） | Medium |
| #126 | CLAUDE_CODE_DISABLE_CRON 環境変数（cronジョブ無効化） | Low |
| #127 | Agent model パラメーター復元（呼び出しごとのモデルオーバーライド） | Medium |
| #128 | /effort 簡素化（low/medium/high＋auto リセット） | Low |
| #129 | CLAUDE.md HTMLコメント自動非表示（トークン節約） | Low |
| #130 | VSCode URI ハンドラー（プログラム的にClaude Codeタブを開く） | Medium |

## 完了済み Issue

着手済み・完了済みの issue。重複チェック時はこのセクションも参照する。

### v2.1.71 バッチ（#114-#117、完了・クローズ済み）

| # | タイトル | 状態 |
|---|---------|------|
| #114 | /loop コマンド（定期実行スケジューラー） | completed |
| #115 | cron スケジューリングツール（セッション内定期実行） | completed |
| #116 | voice:pushToTalk キーバインディング（音声キーリバインド） | completed |
| #117 | /debug トグル更新（セッション中デバッグログ切替） | completed |

### v2.1.70 バッチ（#106-#110、完了・クローズ済み）

| # | タイトル | 状態 |
|---|---------|------|
| #106 | /color default（デフォルトカラー復元） | completed |
| #107 | /rename 処理中対応（Claude動作中でも即時実行） | completed |
| #108 | VSCode スパークアイコン（セッション一覧表示） | completed |
| #109 | VSCode プランマークダウンビュー（コメント付き閲覧） | completed |
| #110 | VSCode /mcp ネイティブ管理（MCP サーバーGUI操作） | completed |

### v2.1.63（#73、完了・クローズ済み）

| # | タイトル | 状態 |
|---|---------|------|
| #73 | /simplify & /batch バンドルスラッシュコマンド | completed |

### v2.1.69 バッチ（#94-#101、完了・クローズ済み）

| # | タイトル | 状態 |
|---|---------|------|
| #94 | /claude-api スキル（Claude API/SDK アプリ構築支援） | completed |
| #95 | /remote-control name 引数（カスタムセッションタイトル） | completed |
| #96 | 推論努力度の表示（ロゴ/スピナー表示） | completed |
| #97 | includeGitInstructions 設定（Git指示の制御） | completed |
| #98 | /reload-plugins コマンド（プラグイン即時反映） | completed |
| #99 | ${CLAUDE_SKILL_DIR} 変数（スキル自己参照） | completed |
| #100 | InstructionsLoaded フックイベント（CLAUDE.md読込検知） | completed |
| #101 | フックの agent_id / agent_type（サブエージェント識別） | completed |

### v2.1.68（#91、完了・クローズ済み）

| # | タイトル | 状態 |
|---|---------|------|
| #91 | ultrathink キーワード（高推論努力度トリガー） | completed |

### v2.1.63 バッチ（#74-#80、完了・クローズ済み）

| # | タイトル | 状態 |
|---|---------|------|
| #74 | worktree間プロジェクト設定・自動メモリ共有 | completed |
| #75 | ENABLE_CLAUDEAI_MCP_SERVERS=false（claude.ai MCP無効化） | completed |
| #76 | /model アクティブモデル表示（メニュー内現在モデル表示） | completed |
| #77 | HTTPフック（JSON POST/受信型フック） | completed |
| #78 | /copy「常にレスポンス全体をコピー」オプション | completed |
| #79 | VSCode セッション一覧リネーム・削除（IDE統合） | completed |
| #80 | /clear スキルキャッシュリセット修正（スキル更新反映） | completed |

### v2.1.30 - v2.1.59 バッチ（完了・クローズ済み）

| # | タイトル | 状態 |
|---|---------|------|
| #44 | /copy コマンド（コードブロックピッカー） | completed |
| #51 | PRレビューステータス（フッターインジケーター） | completed |
| #53 | エージェントmemoryフロントマター（永続メモリ） | completed |
| #60 | /rename 自動セッション名生成（引数なし） | completed |

### v2.1.0 - v2.1.27 バッチ（完了・クローズ済み）

| # | タイトル | 状態 |
|---|---------|------|
| #61 | language設定（応答言語指定） | completed |
| #64 | Setupフックイベント（リポジトリ初期化・メンテナンス） | completed |
| #65 | エージェントフロントマターにフック（ライフサイクルフック） | completed |
| #66 | --toolsフラグ（インタラクティブモード ツール制限） | completed |
| #67 | スキル自動ホットリロード（即時反映） | completed |
| #68 | /stats コマンド（日付範囲フィルタリング） | completed |
| #69 | CLAUDE_CODE_HIDE_ACCOUNT_INFO（アカウント情報非表示） | completed |
| #70 | respectGitignore設定（@メンション制御） | completed |
| #72 | カスタムコマンド引数構文（$ARGUMENTS[0]） | completed |

### その他（完了・クローズ済み）

| # | タイトル | 状態 |
|---|---------|------|
| #86 | GitHub Actions claude-code-action 自動コードレビュー | completed |

### 旧バッチ（#1-#23、完了・クローズ済み）

| # | タイトル | 状態 |
|---|---------|------|
| #1 | Agent Teams（マルチエージェントコラボレーション） | completed |
| #2 | Worktree統合（--worktreeフラグ） | completed |
| #3 | メモリ自動記録 | completed |
| #4 | 新タスク管理システム（依存関係追跡） | completed |
| #5 | キーバインドカスタマイズ（/keybindings） | completed |
| #6 | バックグラウンドエージェント強化 | completed |
| #7 | ConfigChangeフック | completed |
| #8 | PR連携強化（--from-prフラグ） | completed |
| #9 | 「ここから要約」機能 | completed |
| #10 | /debug コマンド | completed |
| #11 | PDFページ指定読み込み | completed |
| #12 | スピナーカスタマイズ（spinnerVerbs / spinnerTipsOverride） | completed |
| #13 | auth CLIサブコマンド | completed |
| #14 | bash履歴補完（!モード） | completed |
| #15 | プラグインgit SHA固定 | completed |
| #16 | コンテキストウィンドウ使用量表示 | completed |
| #17 | Fast Mode（Opus 4.6） | completed |
| #18 | MCP ツール検索自動モード | completed |
| #19 | スキル統合（スラッシュコマンド + スキル） | completed |
| #20 | claude agents コマンド（エージェント一覧表示） | completed |
| #21 | WorktreeCreate/WorktreeRemoveフック（worktreeライフサイクル管理） | completed |
| #22 | CLAUDE_CODE_DISABLE_1M_CONTEXT（1Mコンテキスト無効化） | completed |
| #23 | エージェント定義 isolation: worktree（宣言的worktree隔離） | completed |

### 重複クローズ（旧バッチと重複したため not planned でクローズ）

| # | タイトル | 重複元 |
|---|---------|--------|
| #43 | 自動メモリ保存（/memory管理） | #3 |
| #45 | Worktree統合（--worktreeフラグ） | #2 |
| #46 | Agent Teams（マルチエージェントコラボレーション） | #1 |
| #47 | ファストモード（Opus 4.6 /fast） | #17 |
| #48 | claude agents CLIコマンド（エージェント一覧） | #20 |
| #49 | /debug コマンド（セッションデバッグ） | #10 |
| #50 | キーボードショートカット（/keybindings） | #5 |
| #52 | --from-prフラグ（PRリンクセッション再開） | #8 |
| #54 | PDF pagesパラメータ（ページ範囲指定読み取り） | #11 |
| #55 | ConfigChangeフック（設定変更検知） | #7 |
| #56 | bashモード履歴補完（!モード Tabキー） | #14 |
| #57 | タスク管理システム（依存関係追跡） | #4 |
| #58 | スピナーカスタマイズ（spinnerVerbs / spinnerTipsOverride） | #12 |
| #59 | claude auth CLIサブコマンド（認証管理） | #13 |
| #62 | Ctrl+Bバックグラウンド機能（統一インターフェース） | #6 |
| #63 | Ctrl+Fバックグラウンドエージェント終了 | #6 |
| #71 | エージェント background:true（常時バックグラウンド実行） | #6 |
