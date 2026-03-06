const express = require("express");

const app = express();
const PORT = 8080;

app.use(express.json());

const receivedHooks = [];

// PreToolUse: rm コマンドをブロックする例
app.post("/hooks/pre-tool-use", (req, res) => {
  const timestamp = new Date().toISOString();
  const payload = req.body;

  console.log("\n" + "=".repeat(60));
  console.log(`[${timestamp}] PreToolUse received`);
  console.log("Payload:", JSON.stringify(payload, null, 2));

  receivedHooks.push({ timestamp, eventType: "pre-tool-use", payload });

  const command = payload.tool_input?.command || "";

  if (command.includes("rm -rf")) {
    console.log(">>> DENIED: dangerous command detected");
    console.log("=".repeat(60) + "\n");
    res.json({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "deny",
        permissionDecisionReason:
          "HTTP Hook: rm -rf command blocked by remote policy server",
      },
    });
    return;
  }

  console.log(">>> ALLOWED");
  console.log("=".repeat(60) + "\n");
  res.json({});
});

// その他のイベントは全て許可
app.post("/hooks/:eventType", (req, res) => {
  const { eventType } = req.params;
  const timestamp = new Date().toISOString();
  receivedHooks.push({ timestamp, eventType, payload: req.body });

  console.log(`[${timestamp}] ${eventType}: allowed`);
  res.json({});
});

app.get("/history", (_req, res) => {
  res.json({ total: receivedHooks.length, hooks: receivedHooks });
});

app.delete("/history", (_req, res) => {
  receivedHooks.length = 0;
  res.json({ message: "History cleared" });
});

app.listen(PORT, () => {
  console.log(`\nHook server (with deny) listening on http://localhost:${PORT}`);
  console.log(`  rm -rf commands will be DENIED\n`);
});
