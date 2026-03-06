# プラグインgit SHA固定 試行レポート

## 基本情報

| 項目 | 内容 |
|------|------|
| Issue | #15 |
| 対象機能 | プラグインを特定の git コミット SHA に固定 |
| 導入バージョン | v2.1.14 |
| 試行バージョン | v2.1.59 |

## 機能概要

プラグインのソース定義に `sha` フィールドを指定することで、特定の git コミットにバージョンを固定（ピンニング）できる機能。マーケットプレイスからインストールされるプラグインが常に同じコードを使うことを保証する。

## 設定フォーマット

### GitHubソースの場合

```json
{
  "name": "my-plugin",
  "source": {
    "source": "github",
    "repo": "owner/plugin-repo",
    "ref": "v2.0.0",
    "sha": "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0"
  }
}
```

### Git URLソースの場合

```json
{
  "name": "my-plugin",
  "source": {
    "source": "url",
    "url": "https://gitlab.com/team/plugin.git",
    "ref": "main",
    "sha": "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0"
  }
}
```

### フィールド説明

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `repo` / `url` | string | Yes | リポジトリの指定 |
| `ref` | string | No | ブランチまたはタグ名（動的、変化しうる） |
| `sha` | string | No | 40文字のフル git コミット SHA（不変、常に同じコミットを指す） |

## 動作確認結果

### 1. 現在のプラグイン状態

`~/.claude/plugins/installed_plugins.json` を確認。インストール済みの全プラグインに `gitCommitSha` が自動記録されている。

| プラグイン | バージョン | gitCommitSha |
|-----------|-----------|-------------|
| `ralph-loop@claude-plugins-official` | 55b58ec6e564 | `2cd88e7947b7382e045666abee790c7f55f669f3` |
| `claude-mem@thedotmack` | 10.1.0 | `e975555896b5d5c5066197d64d130d724e7ca4db` |
| `typescript-lsp@claude-plugins-official` | 1.0.0 | `8deab8460a9d4df5a01315ef722a5ca6b061c074` |

### 2. `ref` と `sha` の違い

| | `ref` | `sha` |
|--|-------|-------|
| 用途 | ブランチやタグの最新を追従 | 特定のコミットに固定 |
| 変化する？ | する（ブランチが進む） | しない（不変） |
| 再現性 | 低い | 高い |
| 例 | `"ref": "stable"` | `"sha": "abc123..."` |

### 3. マーケットプレイスソース vs プラグインソースの違い

| | マーケットプレイスソース | プラグインソース |
|--|----------------------|---------------|
| `ref` | 対応 | 対応 |
| `sha` | 非対応 | 対応 |

マーケットプレイスのカタログ自体は `sha` 固定できないが、カタログ内の個別プラグインは `sha` 固定できる。

## 活用シーン

| シーン | 活用方法 |
|--------|----------|
| チーム統一 | 全メンバーが同じSHAのプラグインを使用 |
| セキュリティ監査 | 「このSHAのコードをレビュー済み」の保証 |
| 安定性確保 | プラグイン作者の更新による予期しない破壊を防止 |
| リリースチャンネル | `ref` でstable/latestを切り替え、`sha` で特定バージョンに固定 |
| 再現性のある環境構築 | CI/CDやオンボーディングで同一環境を再現 |

## 所感

- 個人利用では必須度は低いが、チーム・企業利用では非常に重要な機能
- `installed_plugins.json` に `gitCommitSha` が自動記録される設計は、トレーサビリティの観点で優秀
- npm の `package-lock.json` や Docker のイメージダイジェスト固定と同じ思想で、エコシステム成熟の必要条件
- マーケットプレイスソースが `sha` 非対応なのは合理的（カタログは最新を追従すべき、個別プラグインは固定すべき）
- `ref` と `sha` の両方をサポートすることで、柔軟なバージョン管理戦略が構築できる

## 参考ドキュメント

- [Plugin Marketplaces](https://code.claude.com/docs/en/plugin-marketplaces) - プラグインソース設定の公式ドキュメント
- [Feature Request #10571](https://github.com/anthropics/claude-code/issues/10571) - SHA固定のFeature Request
