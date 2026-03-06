# Issue #96: 推論努力度の表示（ロゴ/スピナー表示）試行レポート

## 概要

Claude Code v2.1.69 で追加された「推論努力度のロゴ/スピナー表示」機能を試行し、動作状況を調査した。

## 対象バージョン

- Claude Code v2.1.69

## リリースノート記載内容

> Added effort level display (e.g., "with low effort") to the logo and spinner, making it easier to see which effort setting is active

## 試行結果

### 確認した操作

| 操作 | 期待される表示 | 実際の表示 | 結果 |
|------|--------------|-----------|------|
| `/model` で high effort に設定 | スピナーに `with high effort` | `* Thinking…` のみ | NG |
| `/model` で low effort に設定 | スピナーに `with low effort` | `* Whisking…` のみ | NG |
| `spinnerVerbs` カスタム設定を削除して再試行 | 努力度表示が出る | デフォルトスピナー動詞のみ | NG |

### `/model` コマンドの出力

`/model` コマンド実行時には努力度が表示されることを確認：

```
Set model to Default (Opus 4.6 · Most capable for complex work) with high effort
Set model to Default (Opus 4.6 · Most capable for complex work) with low effort
```

ただし、これはスピナーではなく `/model` コマンドの結果メッセージ。

## 原因調査

### spinnerVerbs の影響

`~/.claude/settings.json` に以下のカスタム設定があったため、最初はこれが原因と仮定した：

```json
"spinnerVerbs": {
  "mode": "replace",
  "verbs": ["Thinking"]
}
```

しかし、この設定を削除しデフォルトのスピナーに戻しても努力度は表示されなかった。**spinnerVerbs は努力度表示に影響しない**（別のUI層で処理されるため）。

### 既知のバグ（GitHub Issues）

調査の結果、この問題は既知のバグとして複数報告されていることが判明した：

| Issue | タイトル | ステータス |
|-------|---------|-----------|
| [#28467](https://github.com/anthropics/claude-code/issues/28467) | Reasoning effort level not displayed on session start and not persisted across sessions | OPEN |
| [#26950](https://github.com/anthropics/claude-code/issues/26950) | Cannot inspect or reliably control reasoning effort level | OPEN |
| [#30726](https://github.com/anthropics/claude-code/issues/30726) | `effortLevel: "max"` automatically downgraded | OPEN |

**Issue #28467 が本件と最も関連が深い。** セッション起動時に努力度表示がリセットされ、スピナーに反映されない問題が報告されている。

## 結論

- v2.1.69 で努力度表示は**実装されたが、不完全な状態**でリリースされている
- スピナーへの努力度表示は**既知のバグにより正常に動作しない**（Issue #28467）
- `/model` コマンドの結果メッセージには努力度が表示される（これは正常動作）
- `spinnerVerbs` のカスタム設定は本件に無関係

## 今後のアクション

- Issue #28467 の修正を待つ
- 修正リリース後に再試行する
