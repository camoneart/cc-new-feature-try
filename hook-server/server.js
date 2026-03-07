const express = require("express");

const app = express();
const PORT = 8080;

// JSON ボディのパース
app.use(express.json());

// 受信したフックイベントを保存する配列
const receivedHooks = [];

// Hook エンドポイント: 全イベント共通
app.post("/hooks/:eventType", (req, res) => {
  const { eventType } = req.params;
  const timestamp = new Date().toISOString();
  const payload = req.body;

  // ログ出力
  console.log("\n" + "=".repeat(60));
  console.log(`[${timestamp}] Hook received: ${eventType}`);
  console.log("=".repeat(60));
  console.log("Headers:", JSON.stringify(req.headers, null, 2));
  console.log("Payload:", JSON.stringify(payload, null, 2));
  console.log("=".repeat(60) + "\n");

  // 受信履歴に追加
  receivedHooks.push({ timestamp, eventType, payload });

  // 正常レスポンスを返す（フック処理を許可）
  res.json({});
});

// 受信履歴の確認用エンドポイント
app.get("/history", (_req, res) => {
  res.json({
    total: receivedHooks.length,
    hooks: receivedHooks,
  });
});

// 受信履歴のクリア
app.delete("/history", (_req, res) => {
  receivedHooks.length = 0;
  res.json({ message: "History cleared" });
});

app.listen(PORT, () => {
  console.log(`\nHook server listening on http://localhost:${PORT}`);
  console.log(`  POST /hooks/:eventType  - Receive hook events`);
  console.log(`  GET  /history           - View received hooks`);
  console.log(`  DELETE /history         - Clear history\n`);
});
