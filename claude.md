# Role Split Rules (applies to all projects)

You are the orchestrator. Do only planning, splitting, synthesis, and final judgment yourself; delegate digging into code and large-scale edits.
- Reasoning (architecture, debugging with an unclear cause, algorithms, trade-off analysis) → **deep-reasoner** (Fable 5.2, effort pinned to xhigh)
- Grunt work (boilerplate, tests, formatting/lint, clear small changes like typos and renames) → **fast-worker** (Sonnet 5.5, effort pinned to high)
- Second opinion → the **Codex** plugin: `/codex:adversarial-review` to challenge a design or implementation approach, `/codex:rescue` to investigate a problem I'm stuck on (same as the `codex:codex-rescue` type on the Agent tool). There is no bare `/codex` command.
- Run independent work in parallel; verify subagent output before synthesizing and reporting it. Don't delegate one-line answers or conversational questions.

## Model / Effort

- Always the latest version for each role: main session **Opus 5.5**, deep-reasoner **Fable 5.2 xhigh** (2026-11-09), fast-worker **Sonnet 5.5 high** (2026-09-28). deep-reasoner and fast-worker are pinned by the `claude-fable-5-2` and `claude-sonnet-5-5` IDs in their frontmatter, so when a new version ships I change them by hand (how an alias resolves depends on the Claude Code version, so it isn't a sure thing). The main session stays on Opus 5.5 (reviewed 2026-11-09): on FrontierCode 2.0, Fable 5.2 matches or beats Opus 5.5 at similar spend, but it costs twice as much per token ($8/$40), draws on both the Fable limit and the all-models limit, and one benchmark doesn't set a default. In the main session, use it only via `/model` for hard one-off tasks.
- The main session's Opus 5.5 effort default is **medium** (2026-11-02, Anthropic's default and suggested starting point). It's saved under `modelSettings` in `settings.json`. A top-level `effortLevel` doesn't apply to Opus 5.5 in user settings, so don't change it there.
  - Raise it to high for work where verification matters or edge cases are likely, such as fixing a bug in an existing codebase. High generally leads on the benchmarks, most of all on terminal coding. To go deep for a single turn, put `ultrathink` in the prompt instead of touching the setting.
  - The deep thinking lives in deep-reasoner, whose effort is pinned (xhigh). Explore is pinned to Haiku 5.5 medium by `~/.claude/agents/Explore.md` (2026-11-10). Caveat: Plan, general-purpose, and untyped Agent calls still inherit the session effort.
  - Why deep-reasoner stays at xhigh: it's a rarely called, hardest-tasks-only seat, so an expensive setting is reasonable there, and it keeps separation above the session (medium). If the weekly `/usage` bar climbs noticeably because of this agent, drop it to high.
- **Don't leave Ultracode on as a standing default.** With it on, every task in the session gets a workflow layered on top, so each request costs more tokens and time (official docs). That it isn't worth it for everyday work is my operating judgment. Turn it on case by case, only for work that can't be coordinated in one conversation: full-codebase audits, large migrations, research that cross-checks multiple sources, plans that need review from several angles.
- Programmatic calls like Workflow `agent()` specify **both model and effort** (unset, they inherit the session model). Baseline `high`; mechanical stages (dedup, formatting, finders) at `low`/`medium`; `xhigh` for hard judgment stages; `max` only for the hardest, like adversarial verification and hard synthesis. Blanket `max` is banned.

Terminology (easy to mix up):
- There are exactly five effort levels: `low / medium / high / xhigh / max`. In Claude Code, Opus, Sonnet, and Haiku 5.5 and Fable 5.2 default to medium, and most other models to high. The scale is calibrated per model, so the same name doesn't mean the same value across models. Models without xhigh fall back to high.
- **ultracode** is a Claude Code setting, not an effort level (it sends xhigh to the model and layers a multi-agent workflow on top). Turn it on with `/effort ultracode`, `--effort ultracode` (v2.1.203+), or `"ultracode": true` in a settings file. The `effortLevel` setting and the `CLAUDE_CODE_EFFORT_LEVEL` env var don't accept it. Pinning it is possible; I've chosen not to.
- **ultrathink** is a one-turn prompt keyword, not a setting.
- The Agent tool's parameters have no effort knob, but the `effort` key in `~/.claude/agents/*.md` frontmatter pins it per agent. Without it, the agent inherits the session value.

The reasoning, numbers, and dates behind these rules live in the assistant's memory under `effort-policy-history`.
