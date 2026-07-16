# Role Split Rules (applies to all projects)

You are the orchestrator. Reasoning goes to deep-reasoner, grunt work goes to fast-worker, a fresh perspective goes to Codex.

## Model / Effort Settings

Terminology (easy to mix up):
- The **real effort levels** are the values the model (API) actually accepts, and there are exactly five: `low / medium / high (default) / xhigh / max`. Same for the CLI and Claude Code — there is no name outside this list. The effort scale is calibrated per model, so the same level name can mean a different actual value on different models.
- **ultracode** — not a model effort level but a Claude Code setting. Internally it sends `xhigh` to the model while layering a dynamic multi-agent workflow on top of it. It shows up in the interactive `/effort` (slider) menu, but it does not exist in the `--effort` flag, the `effortLevel` setting, or the `CLAUDE_CODE_EFFORT_LEVEL` environment variable.
- **ultrathink** — not a setting but a one-turn prompt keyword. Put it anywhere in the prompt and it leaves the session's effort setting alone, only making that one turn reason more deeply.
- **xhigh** — this one is a real level, added relatively recently. On older models that don't support it, it falls back to `high`.

Actual operating rules:
- Keep the interactive `/effort` slider at **medium** by default (lowered 2026-07-16; it was high before that, itself lowered from xhigh on 2026-07-09). Reviewing an App Store submission and building one policy site burned 69% of the Fable weekly cap within ten hours of the weekly window opening — All models sat at 37% at the same moment. That is much faster than the same kind of work last week, and the cause is still unknown, so this is not a diagnosis. It is a **holding action** to slow the burn while I narrow the cause down. What makes medium a safe line to fall back to is the same reasoning as the previous step down: Fable 5 performs at or above previous-generation xhigh even at lower effort levels, and the main session is an orchestrator (planning, splitting, synthesis), so the deep thinking is already delegated out to subagents. Raise to `high`/`xhigh` only for the hardest coding/agentic sessions, and to go deep for a single turn, put the `ultrathink` keyword in the prompt instead of touching the setting. The bigger lever is dropping the default model to Opus 4.8 — a Fable turn draws down both the Fable cap and the All models cap, while Opus only draws down the latter — but that one isn't pulled yet; it's the next candidate. **Do not leave Ultracode on as a standing default** — the official guidance explicitly says that for everyday work (single-file edits, simple questions, interactive tasks) Ultracode only adds latency and cost without adding quality, and it is designed to reset every session, so it was never meant to be pinned. In practice, per `/usage`, 94% of recent usage came from subagent-heavy sessions and 87% from 150k+ context sessions, and the Fable 5 weekly cap ran out while the overall Weekly allowance still had room — exactly the pattern always-on Ultracode produces (verified 2026-07-08).
- Turn Ultracode on case-by-case, only for work that can't be coordinated in a single conversation: full-codebase audits, large migrations, research that cross-checks multiple sources, hard plans that need review from several angles.
- In programmatic interfaces (mainly Workflow's `agent()`; the Agent tool has only a model knob, no effort), set the effort parameter **per stage difficulty**. The baseline is `xhigh` (Ultracode's real effort is xhigh, so that's the reference line, and Workflow itself already provides the orchestration). Mechanical stages (dedup, formatting, cheap finders) go down to `low`/`medium`, and `max` is reserved for the genuinely hardest stages (adversarial verification, hard judgment and synthesis). Blanket `max` is banned — especially when the session's default model is Fable 5, an `agent()` call with no model set inherits Fable, so "Fable @ max" running mechanical stages is the worst way to burn the weekly cap and cost. So programmatic calls specify **both model and effort** explicitly and never rely on inheritance.

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
