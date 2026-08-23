"""
Thin wrapper around the OpenAI API for the agents that use real GPT calls
(Agent 1 identity generation, Agent 2 social engineering transcripts,
Agent 4 KYC bundles, Agent 7 evasion variant suggestions).

Loads OPENAI_API_KEY from a local .env file (never committed, see
.gitignore) so the key never has to be pasted into chat, code, or any
committed file. Every call's real token usage is printed with an
approximate cost so nothing runs up a surprise bill.
"""

import json
import os
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def _load_dotenv():
    env_path = ROOT / ".env"
    if not env_path.exists():
        return
    for line in env_path.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        key = key.strip()
        value = value.strip()
        if key and key not in os.environ:
            os.environ[key] = value


_load_dotenv()

DEFAULT_MODEL = "gpt-4o-mini"

# Approximate USD price per token. Verify current pricing at
# openai.com/pricing before relying on this for real budgeting; OpenAI
# changes prices and this table is not fetched live.
PRICING_PER_TOKEN = {
    "gpt-4o-mini": {"input": 0.15 / 1_000_000, "output": 0.60 / 1_000_000},
}

_client = None
_session_cost = 0.0
_session_calls = 0


def _get_client():
    global _client
    if _client is None:
        api_key = os.environ.get("OPENAI_API_KEY")
        if not api_key:
            raise RuntimeError(
                "OPENAI_API_KEY is not set. Create a .env file in the project root "
                "(copy .env.example) with OPENAI_API_KEY=sk-..., then try again."
            )
        from openai import OpenAI

        _client = OpenAI(api_key=api_key)
    return _client


def session_totals():
    return {"calls": _session_calls, "estimated_cost_usd": round(_session_cost, 5)}


def call_json(system_prompt: str, user_prompt: str, model: str = DEFAULT_MODEL, temperature: float = 0.9) -> dict:
    """Call the model asking for a single JSON object response. Prints
    real token usage and an approximate cost, and updates the running
    session total. Raises if the model doesn't return valid JSON, we'd
    rather fail loudly than silently fabricate empty output."""
    global _session_cost, _session_calls

    client = _get_client()
    response = client.chat.completions.create(
        model=model,
        temperature=temperature,
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
    )

    usage = response.usage
    price = PRICING_PER_TOKEN.get(model, PRICING_PER_TOKEN[DEFAULT_MODEL])
    cost = usage.prompt_tokens * price["input"] + usage.completion_tokens * price["output"]
    _session_cost += cost
    _session_calls += 1
    print(
        f"      [openai] {model}: {usage.prompt_tokens} in + {usage.completion_tokens} out "
        f"(~${cost:.4f}, session total ~${_session_cost:.4f} over {_session_calls} calls)"
    )

    content = response.choices[0].message.content
    try:
        return json.loads(content)
    except json.JSONDecodeError as e:
        raise RuntimeError(f"Model did not return valid JSON: {e}\nRaw content: {content[:500]}")
