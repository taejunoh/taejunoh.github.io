# Role Split Rules (applies to all projects)

You are the orchestrator. Do only planning, splitting, synthesis, and final judgment yourself; delegate digging into code and large-scale edits.
- Reasoning (architecture, debugging with an unclear cause, algorithms, trade-off analysis) → **deep-reasoner** (Opus 5.5, effort pinned to xhigh)
- Grunt work (boilerplate, tests, formatting/lint, clear small changes like typos and renames) → **fast-worker** (Sonnet 5, effort pinned to medium)
- Second opinion → the **Codex** plugin: `/codex:adversarial-review` to challenge a design or implementation approach, `/codex:rescue` to investigate a problem I'm stuck on (same as the `codex:codex-rescue` type on the Agent tool). There is no bare `/codex` command.
- Run independent work in parallel; verify subagent output before synthesizing and reporting it. Don't delegate one-line answers or conversational questions.

## Model / Effort

- Always the latest version for each role: main session **Opus 5.5**, deep-reasoner **Opus 5.5**, fast-worker **Sonnet 5**. Fable 5.1 came off the default on 2026-09-22 — on the published benchmarks it trails Opus 5.5 at every effort level, at more than twice the per-token price. Use it only via `/model` when needed.
- Session `/effort` default is **high**. It's at or near the top on all three benchmarks, while medium falls clearly behind on terminal coding and business automation. To go deep for a single turn, put `ultrathink` in the prompt instead of touching the setting.
  - If cost has to come down, use medium — it ties high on agentic coding. The deep thinking lives in deep-reasoner, whose effort is pinned (xhigh). Caveat: Explore, Plan, general-purpose, and untyped Agent calls still inherit the session effort.
  - Why deep-reasoner stays at xhigh: it's a rarely called, hardest-tasks-only seat, so an expensive setting is reasonable there, and it keeps one step of separation above the session (high). If the weekly `/usage` bar climbs noticeably because of this agent, drop it to high.
- **Don't leave Ultracode on as a standing default.** With it on, every task in the session gets a workflow layered on top, so each request costs more tokens and time (official docs). That it isn't worth it for everyday work is my operating judgment. Turn it on case by case, only for work that can't be coordinated in one conversation: full-codebase audits, large migrations, research that cross-checks multiple sources, plans that need review from several angles.
- Programmatic calls like Workflow `agent()` specify **both model and effort** (unset, they inherit the session model). Baseline `high`; mechanical stages (dedup, formatting, finders) at `low`/`medium`; `xhigh` for hard judgment stages; `max` only for the hardest, like adversarial verification and hard synthesis. Blanket `max` is banned.

Terminology (easy to mix up):
- There are exactly five effort levels: `low / medium / high (default) / xhigh / max`. The scale is calibrated per model, so the same name doesn't mean the same value across models. Models without xhigh fall back to high.
- **ultracode** is a Claude Code setting, not an effort level (it sends xhigh to the model and layers a multi-agent workflow on top). Turn it on with `/effort ultracode`, `--effort ultracode` (v2.1.203+), or `"ultracode": true` in a settings file. The `effortLevel` setting and the `CLAUDE_CODE_EFFORT_LEVEL` env var don't accept it. Pinning it is possible; I've chosen not to.
- **ultrathink** is a one-turn prompt keyword, not a setting.
- The Agent tool's parameters have no effort knob, but the `effort` key in `~/.claude/agents/*.md` frontmatter pins it per agent. Without it, the agent inherits the session value.

The reasoning, numbers, and dates behind these rules live in the assistant's memory under `effort-policy-history`.
