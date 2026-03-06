# Trial: ultrathink keyword (v2.1.68)

## Overview

v2.1.68 で再導入された「ultrathink」キーワードの試行結果。
プロンプトに含めると、次のターンで高い推論努力度（extended thinking）が有効になる。

## Background

- Max/Team subscriber 向けに Opus 4.6 のデフォルト推論努力度が `medium` に変更された
- `medium` は速度と徹底さのバランスが良好
- 必要に応じて高い推論を発動させるスポット的トリガーとして `ultrathink` が機能する

## Key Findings

### Usage

- プロンプトのどこかに「ultrathink」と含めるだけで有効
  - 例: `ultrathink この関数のエッジケースを徹底的に分析して`
  - 先頭・末尾・途中、どこに配置しても認識される

### Behavior

- 効果は **次のターンのみ** に限定される（恒久的な設定変更ではない）
- Claude Code クライアントがプロンプトをパースし、API リクエスト時の推論努力度パラメータを一時的に引き上げる仕組み
- モデル自体の機能ではなく、Claude Code クライアント側の機能

### Comparison with `/model` command

| 方法 | 持続性 | 用途 |
|------|--------|------|
| `ultrathink` keyword | 次のターンのみ | スポット的に深い思考が必要な時 |
| `/model` (high設定) | セッション中恒久的 | 常に高い推論が必要な時 |

### History

- 以前のバージョンで存在していた機能
- 一度削除された後、v2.1.68 で再導入

## Limitations

- Claude Code 以外の環境（API 直接呼び出し、claude.ai）では効果なし
- 効果の持続は1ターンのみ

## Verdict

普段は medium の速度で作業しつつ、複雑な分析やエッジケースの洗い出しなど「ここぞ」という場面でのみ高推論を発動できる、実用的な機能。`/model` で恒久的に high に変更する必要がないため、速度と品質のバランスを柔軟に制御できる。
