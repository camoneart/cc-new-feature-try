---
name: test-skill-dir
description: Test skill for verifying ${CLAUDE_SKILL_DIR} variable expansion. Use when user mentions "test skill dir", "CLAUDE_SKILL_DIR test", or wants to verify skill directory variable expansion.
---

# Test Skill Dir

Verify that `${CLAUDE_SKILL_DIR}` resolves to this skill's directory path.

## Instructions

1. Read `${CLAUDE_SKILL_DIR}/references/style-guide.md` and summarize its contents.
2. Run `${CLAUDE_SKILL_DIR}/scripts/hello.sh` and show the output.
3. Report whether both file references resolved correctly.
