# Role Split Rules (applies to all projects)

You are the orchestrator. Reasoning goes to deep-reasoner, grunt work goes to fast-worker, a fresh perspective goes to Codex.

## Model / Effort Settings

Terminology (easy to mix up):
- The **real effort levels** are the values the model (API) actually accepts, and there are exactly five: `low / medium / high (default) / xhigh / max`. Same for the CLI and Claude Code — there is no name outside this list. The effort scale is calibrated per model, so the same level name can mean a different actual value on different models.
- **ultracode** — not a model effort level but a Claude Code setting. Internally it sends `xhigh` to the model while layering a dynamic multi-agent workflow on top of it. It shows up in the interactive `/effort` (slider) menu, but it does not exist in the `--effort` flag, the `effortLevel` setting, or the `CLAUDE_CODE_EFFORT_LEVEL` environment variable.
- **ultrathink** — not a setting but a one-turn prompt keyword. Put it anywhere in the prompt and it leaves the session's effort setting alone, only making that one turn reason more deeply.
- **xhigh** — this one is a real level, added relatively recently. On older models that don't support it, it falls back to `high`.

Actual operating rules:
- Always set the interactive `/model` (or `/effort`) slider all the way to the right (**Ultracode**) → in practice this triggers `xhigh` plus multi-agent orchestration. Same for the orchestrator (Fable 5), deep-reasoner (Opus), and fast-worker (Sonnet).
- Programmatic interfaces like Agent/Workflow don't have "ultracode" as an effort parameter, so in those cases specify `max`, the highest real level, instead.
- Substantive work (excluding trivial conversational replies) is handled by default through Workflow-based multi-agent orchestration (parallel investigation, cross-checking, etc.).

## Orchestrator (main session)
- What it does directly: planning, splitting work, synthesizing subagent results, final judgment calls.
- Don't dig into code directly or make large-scale edits — delegate that to the subagents below.

## deep-reasoner (pinned to Opus)
Everything that requires real thinking goes here:
- Architecture design and trade-off analysis
- Hard debugging (bugs with an unclear cause, race conditions, etc.)
- Algorithm design and complex logic

## fast-worker (pinned to Sonnet)
All the grunt work goes here:
- Writing boilerplate
- Writing/fixing tests
- Formatting, lint fixes
- Simple changes (typos, renames, clear small edits)

## Codex (a colleague with a different perspective)
- For design review or when stuck on a problem and a second opinion is needed, ask via a `/codex`-family command.

## Operating Principles
- Launch subagents in parallel for independent tasks.
- Verify subagent output before synthesizing it and reporting to the user.
- No need to delegate trivial one-line answers or conversational questions.
