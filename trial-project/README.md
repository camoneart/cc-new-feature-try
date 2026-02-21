# NARUTO 豆知識プロジェクト

Agent Teams 試行用プロジェクト。2人のチームメイトが協力して NARUTO の豆知識をまとめる。

## チーム構成

| チームメイト | 担当 | 成果物 |
|-------------|------|--------|
| naruto-researcher-a | キャラクター・ストーリー系の豆知識 | `naruto-trivia/character-story.md` |
| naruto-researcher-b | 制作裏話・データ系の豆知識 | `naruto-trivia/production-data.md` |

## ディレクトリ構成

```
trial-project/
├── README.md                          # このファイル
└── naruto-trivia/
    ├── character-story.md             # Researcher A の成果物
    └── production-data.md             # Researcher B の成果物
```

## 試行目的

- Agent Teams のマルチエージェントコラボレーション機能の動作確認
- チームメイト間のメッセージ送受信の検証
- TeammateIdle / TaskCompleted フックの発火確認
