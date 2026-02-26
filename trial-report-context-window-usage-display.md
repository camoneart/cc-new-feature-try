# コンテキストウィンドウ使用量表示 試行レポート

## 基本情報

| 項目 | 内容 |
|------|------|
| Issue | #16 |
| 対象機能 | ステータスラインでのコンテキストウィンドウ使用率表示 |
| 対象バージョン | v2.1.6 以降 |
| 試行バージョン | v2.1.39 |

## 機能概要

`statusLine` 設定の `command` タイプを使い、標準入力から受け取るJSONデータの `context_window.used_percentage` / `context_window.remaining_percentage` をパースしてコンテキストウィンドウの使用率をリアルタイム表示する。

## 設定内容

### 最終的な設定

```json
{
  "statusLine": {
    "type": "command",
    "command": "input=$(cat); used=$(echo \"$input\" | jq -r '.context_window.used_percentage // empty'); remaining=$(echo \"$input\" | jq -r '.context_window.remaining_percentage // empty'); model=$(echo \"$input\" | jq -r '.model.display_name // empty'); if [ -n \"$used\" ]; then printf \"🔋Context: %s%% used (%s%% remaining) | %s\" \"$used\" \"$remaining\" \"$model\"; else printf \"🔋Context: (no messages yet) | %s\" \"$model\"; fi",
    "padding": 0
  }
}
```

### 表示例

```
🔋Context: 21% used (79% remaining) | Opus 4.6
```

## 動作確認結果

### context_window.used_percentage

- 会話のやり取りに応じてリアルタイムで増加する
- メッセージ送信ごとにステータスラインが更新される

### context_window.remaining_percentage

- `used_percentage` と合わせて100%になる
- 両方を同時に表示することで直感的に残量を把握できる

### model.display_name

- 使用中のモデル名（例: `Opus 4.6`）を表示
- `/model` でモデル切り替え時にも追従する

### メッセージ未送信時の挙動

- `used_percentage` が空になるため、条件分岐で「(no messages yet)」を表示するようにした

## 設定項目の調査

### padding

| 項目 | 内容 |
|------|------|
| 型 | number |
| デフォルト | 0 |
| 効果 | ステータスライン内容に水平方向（文字数単位）のスペースを追加 |
| 備考 | インターフェースの組み込みスペースに加えた相対的なインデント制御。縦方向の余白には影響しない |

### 絵文字の表示に関する注意点

- 絵文字によっては上下に余白が生じる（例: 👑 は上部に余白が出る）
- これはターミナルフォント（Apple Color Emoji）のグリフデザインに依存する問題
- CSS的な微調整は不可能（ステータスラインはプレーンテキスト出力）
- 対策: 上下余白が少ない絵文字を選ぶ（🔋、⚡ など）またはUnicode記号文字（♛、◆）を使う

## 所感

- コンテキストウィンドウの使用率可視化は日常ワークフローで非常に実用的
- 使用率を見ながら適切なタイミングで `/clear` や `/compact` を判断できる
- `command` タイプの statusLine は jq でJSONをパースする仕組みのため、表示内容の自由度が高い
- 絵文字を先頭に配置する際はグリフの上下余白を考慮して選択する必要がある
- `padding` は水平方向のみの制御で、縦方向のレイアウト調整手段は提供されていない
