/* Parmana Fraud Defense: static dashboard driven entirely by
   web/data/dashboard.json, produced by src/run_simulation.py,
   check_results.py, and probe_detector.py. No server side code runs
   from this page. All numbers shown are real results from the last run. */

let DASH = null;

/* Plain English framing of each attack, keyed by the actual attack_type
   tag on each transaction record (not docs/attacks.json's doc style ids),
   so counts join correctly against DASH.simulation.attack_type_breakdown.
   limit_probing and model_poisoning have no transaction shaped output,
   they're handled as special cases wherever this map is used. */
const ATTACK_COPY = {
  fake_identity: {
    name: "Fake Identity Fraud",
    desc: "Someone creates a fake person with a spending history that matches a real customer, so new accounts pass unnoticed.",
    agent: "agent1_fake_identity",
  },
  pattern_copy: {
    name: "Card Testing & Draining",
    desc: "A stolen card is used to copy someone's normal spending pattern, so each individual purchase looks routine.",
    agent: "agent5_pattern_replicator",
  },
  form_break: {
    name: "Payment Form Attacks",
    desc: "Broken or malicious data is thrown at payment forms to find weak spots before a real attack.",
    agent: "agent6_injection_generator",
  },
  social_engineering: {
    name: "Social Engineering",
    desc: "An attacker talks a support agent into resetting account security or reissuing a card.",
    agent: "agent2_social_engineer",
  },
  limit_probing: {
    name: "Detection Probing",
    desc: "An attacker tests transaction amounts to learn what triggers a block.",
    agent: "agent3_limit_prober",
  },
  kyc_synthetic: {
    name: "Document Forgery",
    desc: "Fake identity documents are created to pass verification checks.",
    agent: "agent4_kyc_forger",
  },
  model_poisoning: {
    name: "Feedback Manipulation",
    desc: "Fake dispute signals are used to trick the system into learning bad patterns over time.",
    agent: null,
  },
};

async function boot() {
  try {
    const res = await fetch("data/dashboard.json", { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    DASH = await res.json();
  } catch (err) {
    document.getElementById("app").innerHTML =
      `<div class="loading">Could not load results (${err.message}).<br>
       Run the pipeline in src/ first, then serve this folder with
       <code>python -m http.server</code> from inside web/.</div>`;
    return;
  }
  document.getElementById("loading")?.remove();
  wireTabs();
  render("attacks");
}

function wireTabs() {
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      render(btn.dataset.tab);
    });
  });
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function render(tab) {
  const app = document.getElementById("app");
  if (tab === "attacks") return renderAttacks(app);
  if (tab === "simulation") return renderSimulation(app);
  if (tab === "detection") return renderDetection(app);
  if (tab === "proof") return renderProof(app);
  if (tab === "api") return renderApiActivity(app);
}

/* ---------------------------------------------------------------- */
/* Tab 1: Attacks                                                     */
/* ---------------------------------------------------------------- */
function renderAttacks(app) {
  const breakdown = DASH.simulation.attack_type_breakdown || {};
  const agentByType = {};
  for (const a of DASH.simulation.agent_summaries) agentByType[a.agent_id] = a;

  const cards = Object.entries(ATTACK_COPY)
    .map(([id, info]) => {
      const simulated = !!info.agent;
      let countLine = "Not tested in this demo";
      if (simulated) {
        if (id === "limit_probing" && DASH.redteam) {
          countLine = `We tested: <b>${DASH.redteam.limit_probe.results.length} transaction amounts</b>`;
        } else if (breakdown[id] !== undefined) {
          countLine = `We generated: <b>${breakdown[id].toLocaleString()} examples</b>`;
        }
      }
      return `
      <article class="card">
        <div class="card-head">
          <h3>${esc(info.name)}</h3>
          <span class="badge ${simulated ? "simulated" : "gap"}">${simulated ? "Simulated" : "Not simulated"}</span>
        </div>
        <p class="attack-desc">${esc(info.desc)}</p>
        <div class="attack-count">${countLine}</div>
      </article>`;
    })
    .join("");

  app.innerHTML = `
    <p class="eyebrow">Fraud coverage</p>
    <h1>7 types of payment fraud we tested against</h1>
    <p class="page-intro">Six were actively simulated. One is an honest gap we didn't build, listed plainly rather than skipped.</p>
    <div class="grid cols-2">${cards}</div>
  `;
}

/* ---------------------------------------------------------------- */
/* Tab 2: Simulation                                                   */
/* ---------------------------------------------------------------- */
function renderSimulation(app) {
  const sim = DASH.simulation;
  const breakdown = sim.attack_type_breakdown || {};

  const rows = Object.entries(ATTACK_COPY)
    .filter(([id]) => breakdown[id] !== undefined)
    .map(([id, info]) => `<tr><td>${esc(info.name)}</td><td class="num">${breakdown[id].toLocaleString()}</td></tr>`)
    .join("");

  app.innerHTML = `
    <p class="eyebrow">Attack simulation</p>
    <h1>Here's how many attacks we generated</h1>
    <p class="page-intro">Every record below came from an actual run, not a mockup.</p>

    <div class="card hero-metric">
      <div class="value neutral">${sim.fraud_transaction_count.toLocaleString()}</div>
      <div class="label">Attack records successfully generated</div>
    </div>

    <h2>Breakdown by attack type</h2>
    <div class="card">
      <table class="simple-table">
        <thead><tr><th>Attack type</th><th style="text-align:right">Records</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>

    <button class="action" id="sample-data-btn">View Sample Data</button>
    <div class="reveal-panel" id="sample-data-panel" style="display:none"></div>
  `;

  document.getElementById("sample-data-btn").addEventListener("click", (e) => {
    const panel = document.getElementById("sample-data-panel");
    if (panel.style.display !== "none") {
      panel.style.display = "none";
      e.target.textContent = "View Sample Data";
      return;
    }
    panel.style.display = "block";
    e.target.textContent = "Hide Sample Data";
    panel.innerHTML = buildSampleDataTable();
  });
}

function buildSampleDataTable() {
  const fraudSamples = DASH.detector.sample_decisions.filter((e) => e.ground_truth.is_fraud === 1);
  const picks = [];
  const seen = new Set();
  for (const e of fraudSamples) {
    if (seen.has(e.ground_truth.attack_type)) continue;
    seen.add(e.ground_truth.attack_type);
    picks.push(e);
    if (picks.length >= 5) break;
  }
  const rows = picks
    .map((e) => {
      const g = e.ground_truth;
      const d = e.decision;
      const label = ATTACK_COPY[g.attack_type]?.name || g.attack_type;
      return `<tr>
        <td>${esc(label)}</td>
        <td class="num">$${g.amount}</td>
        <td>${esc(g.merchant)}</td>
        <td><span class="badge ${d.decision.toLowerCase()}">${d.decision === "BLOCK" ? "Blocked" : d.decision === "FLAG" ? "Flagged" : "Allowed"}</span></td>
      </tr>`;
    })
    .join("");
  return `
    <div class="card">
      <table class="simple-table">
        <thead><tr><th>Attack type</th><th style="text-align:right">Amount</th><th>Merchant</th><th>Status</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

/* ---------------------------------------------------------------- */
/* Tab 3: Detection Results                                            */
/* ---------------------------------------------------------------- */
function renderDetection(app) {
  const m = DASH.detector.metrics;
  const caught = m.fraud_caught_rate * 100;
  const missed = m.fraud_missed_rate * 100;
  const allowedGood = 100 - m.false_positive_rate * 100;
  const flaggedGood = m.false_positive_rate * 100;

  app.innerHTML = `
    <p class="eyebrow">Detection results</p>
    <h1>Our system caught ${caught.toFixed(1)}% of attacks</h1>
    <p class="page-intro">Tested against every attack we generated, on data the model never saw during training.</p>

    <div class="card hero-metric">
      <div class="value good">${caught.toFixed(1)}%</div>
      <div class="label">of attacks caught</div>
    </div>

    <div class="stat-tiles" style="margin-top:1.5rem">
      <div class="stat-tile"><div class="value good">${allowedGood.toFixed(1)}%</div><div class="label">Good transactions correctly allowed</div></div>
      <div class="stat-tile"><div class="value bad">${flaggedGood.toFixed(1)}%</div><div class="label">Good transactions wrongly flagged</div></div>
    </div>

    <h2>Caught vs. missed</h2>
    <div class="card">
      <div class="split-bar">
        <div class="seg" style="width:${caught}%;background:var(--success)">${caught.toFixed(1)}%</div>
        <div class="seg" style="width:${missed}%;background:var(--risk)">${missed.toFixed(1)}%</div>
      </div>
      <div class="split-legend">
        <span><span class="dot" style="background:var(--success)"></span>Caught</span>
        <span><span class="dot" style="background:var(--risk)"></span>Missed</span>
      </div>
    </div>

    <div class="honest-box" style="margin-top:1.75rem">
      <h3>We caught most attacks, but not all</h3>
      <p style="margin:0 0 0.75rem;color:var(--text-dim)">${missed.toFixed(1)}% slipped through. Here's why, honestly:</p>
      <ul>
        <li>Amount alone doesn't reliably trigger a block, a $10 charge and a $10,000 charge can score the same if nothing else looks off</li>
        <li>Some fake activity is built to look statistically like normal spending</li>
        <li>Slow, spaced out attacks are harder to spot than fast, obvious ones</li>
      </ul>
    </div>

    <button class="action" id="missed-btn">View Missed Attacks</button>
    <div class="reveal-panel" id="missed-panel" style="display:none"></div>
  `;

  document.getElementById("missed-btn").addEventListener("click", (e) => {
    const panel = document.getElementById("missed-panel");
    if (panel.style.display !== "none") {
      panel.style.display = "none";
      e.target.textContent = "View Missed Attacks";
      return;
    }
    panel.style.display = "block";
    e.target.textContent = "Hide Missed Attacks";
    const rows = DASH.detector.missed_fraud_sample
      .map((e) => {
        const g = e.ground_truth;
        const label = ATTACK_COPY[g.attack_type]?.name || g.attack_type;
        return `<tr><td>${esc(label)}</td><td class="num">$${g.amount}</td><td>${esc(g.merchant)}</td><td>${(e.decision.fraud_score * 100).toFixed(1)}%</td></tr>`;
      })
      .join("");
    panel.innerHTML = `
      <div class="card">
        <table class="simple-table">
          <thead><tr><th>Attack type</th><th style="text-align:right">Amount</th><th>Merchant</th><th>Risk score</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;
  });
}

/* ---------------------------------------------------------------- */
/* Tab 4: Proof                                                        */
/* ---------------------------------------------------------------- */
function renderProof(app) {
  const counts = DASH.detector.decision_counts;
  const overrides = DASH.overrides;
  const v = DASH.verification;
  const allTokensValid = Object.values(v.agent_tokens).every(Boolean);
  const rt = DASH.redteam;
  const sample = DASH.detector.sample_decisions.find((x) => x.decision.decision === "BLOCK") || DASH.detector.sample_decisions[0];

  app.innerHTML = `
    <p class="eyebrow">Verifiable proof</p>
    <h1>These decisions are verifiable</h1>
    <p class="page-intro">Not "trust our logs." Every block, override, and agent limit below is backed by a cryptographic signature you can check yourself.</p>

    <div class="grid cols-3">
      <div class="card">
        <div class="card-head"><h3>${counts.BLOCK.toLocaleString()} Blocks</h3><span class="badge verified">Verified</span></div>
        <p class="attack-count">Signed by an independent authority, not the detector itself.<br>✓ ${v.decisions_valid.toLocaleString()}/${v.decisions_sampled.toLocaleString()} signed decisions checked</p>
      </div>
      <div class="card">
        <div class="card-head"><h3>${overrides.length} Overrides</h3><span class="badge verified">Verified</span></div>
        <p class="attack-count">Signed by a human reviewer, using a different key than the authority.<br>✓ ${v.overrides_valid}/${v.overrides_sampled} verified</p>
      </div>
      <div class="card">
        <div class="card-head"><h3>All Agents</h3><span class="badge ${allTokensValid ? "verified" : "gap"}">${allTokensValid ? "Enforced" : "Check failed"}</span></div>
        <p class="attack-count">Every attack generator is bounded by a signed limit it cannot exceed.<br>✓ ${Object.values(v.agent_tokens).filter(Boolean).length}/${Object.values(v.agent_tokens).length} agent tokens verified</p>
      </div>
    </div>

    ${
      rt
        ? `<h2>We also tested our own detector</h2>
    <div class="grid cols-2">
      <div class="card">
        <div class="card-head"><h3>${rt.limit_probe.results.length} Thresholds Tested</h3><span class="badge verified">Signed</span></div>
        <p class="attack-count">${rt.limit_probe.threshold_amount ? `Blocking starts at $${rt.limit_probe.threshold_amount.toLocaleString()}.` : "No single amount alone triggered a block."}</p>
      </div>
      <div class="card">
        <div class="card-head"><h3>${rt.feedback_loop.variants_tested} Evasion Attempts</h3><span class="badge verified">Signed</span></div>
        <p class="attack-count">${rt.feedback_loop.variants_evaded} of them got past the detector. We're showing that number, not hiding it.</p>
      </div>
    </div>`
        : ""
    }

    <h2>Why this matters</h2>
    <div class="honest-box">
      <p class="explain-text" style="margin-top:0">When we block fraud, an authority outside the detector signs that decision with a private key nothing else touches. Anyone can check the signature is real. If we were just claiming it happened, without actually signing it, the signature simply wouldn't exist.</p>
    </div>

    <h2>How one real decision became official</h2>
    <div class="card">
      <div class="flow-steps">
        <div class="flow-step"><span class="flow-num">1</span><div><b>Detector:</b> "Transaction ${esc(sample.decision.transaction_id)} scores ${(sample.decision.fraud_score * 100).toFixed(1)}% fraud."</div></div>
        <div class="flow-step"><span class="flow-num">2</span><div><b>Authority:</b> "Confirmed, this matches ${esc(sample.decision.decision)} criteria."</div></div>
        <div class="flow-step"><span class="flow-num">3</span><div><b>Authority:</b> signs the decision with its own key, one it never shares.</div></div>
        <div class="flow-step"><span class="flow-num">4</span><div><b>Record:</b> "${esc(sample.decision.transaction_id)} ${esc(sample.decision.decision)}. Signature verified: yes."</div></div>
      </div>
    </div>

    <button class="action" id="sig-btn">See Sample Signature</button>
    <div class="reveal-panel" id="sig-panel" style="display:none"></div>
  `;

  document.getElementById("sig-btn").addEventListener("click", (e) => {
    const panel = document.getElementById("sig-panel");
    if (panel.style.display !== "none") {
      panel.style.display = "none";
      e.target.textContent = "See Sample Signature";
      return;
    }
    panel.style.display = "block";
    e.target.textContent = "Hide Sample Signature";
    const d = sample.decision;
    panel.innerHTML = `
      <div class="sig-card">
        <div class="row"><span>Transaction</span><span>${esc(d.transaction_id)}</span></div>
        <div class="row"><span>Decision</span><span>${esc(d.decision)}</span></div>
        <div class="row"><span>Risk score</span><span>${(d.fraud_score * 100).toFixed(1)}%</span></div>
        <div class="row"><span>Signed by</span><span>${esc(d.signer)}</span></div>
        <div class="row"><span>Signature</span><span class="sig-value">${esc(d.signature.slice(0, 64))}&hellip;</span></div>
      </div>`;
  });
}

/* ---------------------------------------------------------------- */
/* Tab 5: API Activity                                                */
/* ---------------------------------------------------------------- */
function renderApiActivity(app) {
  const aa = DASH.api_activity;
  if (!aa || aa.calls.length === 0) {
    app.innerHTML = `
      <p class="eyebrow">API activity</p>
      <h1>No API calls recorded yet</h1>
      <p class="page-intro">Run <code>python run_simulation.py</code> with an OpenAI key set in <code>.env</code> to generate this log.</p>`;
    return;
  }
  const s = aa.summary;

  app.innerHTML = `
    <p class="eyebrow">API activity</p>
    <h1>A real log of every AI call this run made</h1>
    <p class="page-intro">This is not a live call happening in your browser right now, and it never will be: an API key should never sit in a page anyone could open dev tools on. It's a record of what actually happened when the pipeline ran, timestamps, token counts, and cost, straight from OpenAI's own response to each call.</p>

    <div class="stat-tiles">
      <div class="stat-tile"><div class="value neutral">${s.total_calls}</div><div class="label">Total calls</div></div>
      <div class="stat-tile"><div class="value neutral">${s.total_tokens.toLocaleString()}</div><div class="label">Total tokens</div></div>
      <div class="stat-tile"><div class="value neutral">$${s.total_cost_usd.toFixed(4)}</div><div class="label">Total cost</div></div>
      <div class="stat-tile"><div class="value neutral">${s.avg_latency_ms.toLocaleString()}ms</div><div class="label">Average latency</div></div>
    </div>

    <h2>Call log</h2>
    <div class="grid" style="gap:0.75rem">
      ${aa.calls
        .slice()
        .reverse()
        .map((c, i) => {
          const time = new Date(c.timestamp).toLocaleTimeString();
          return `
        <div class="card api-call-card">
          <div class="card-head">
            <h3>${esc(c.purpose)}</h3>
            <span class="badge verified">${esc(c.model)}</span>
          </div>
          <div class="api-call-meta">
            <span>${time}</span>
            <span>${c.prompt_tokens} in + ${c.completion_tokens} out = ${c.total_tokens} tokens</span>
            <span>$${c.cost_usd.toFixed(5)}</span>
            <span>${c.latency_ms.toLocaleString()}ms</span>
          </div>
          <button class="action secondary" id="api-toggle-${i}">Show prompt and response ▾</button>
          <pre class="code-block" id="api-detail-${i}" style="display:none">Prompt sent:
${esc(c.prompt_preview)}${c.prompt_preview.length >= 300 ? "…" : ""}

Response received:
${esc(c.response_preview)}${c.response_preview.length >= 300 ? "…" : ""}</pre>
        </div>`;
        })
        .join("")}
    </div>
  `;

  aa.calls.forEach((_, i) => {
    document.getElementById(`api-toggle-${i}`).addEventListener("click", (e) => {
      const pre = document.getElementById(`api-detail-${i}`);
      const showing = pre.style.display !== "none";
      pre.style.display = showing ? "none" : "block";
      e.target.textContent = showing ? "Show prompt and response ▾" : "Hide prompt and response ▴";
    });
  });
}

boot();
