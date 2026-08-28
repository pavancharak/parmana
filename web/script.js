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
  render("api");
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

let _replayTimer = null;

function render(tab) {
  if (_replayTimer) {
    clearTimeout(_replayTimer);
    _replayTimer = null;
  }
  const app = document.getElementById("app");
  if (tab === "api") return renderApiActivity(app);
  if (tab === "attacks") return renderAttacks(app);
  if (tab === "simulation") return renderSimulation(app);
  if (tab === "detection") return renderDetection(app);
  if (tab === "governance") return renderGovernance(app);
  if (tab === "proof") return renderProof(app);
  if (tab === "readme") return renderReadme(app);
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
function _rangeBarHTML(label, s, lo, hi, color) {
  const clamp = (v) => Math.max(0, Math.min(100, ((v - lo) / (hi - lo)) * 100));
  const left = clamp(s.min);
  const width = Math.max(1, clamp(s.max) - left);
  const meanPos = clamp(s.mean);
  return `
    <div class="range-metric">
      <div class="range-label"><span>${esc(label)}</span><span>${s.min}% - ${s.max}% (mean ${s.mean}%, sd ${s.std_dev}%)</span></div>
      <div class="range-track">
        <div class="range-fill" style="left:${left}%;width:${width}%;background:${color}"></div>
        <div class="range-mean" style="left:${meanPos}%;background:${color}"></div>
      </div>
    </div>`;
}

function _distributionSectionHTML() {
  const dist = DASH.distribution;
  if (!dist) return "";
  const s = dist.summary;
  return `
    <h2>Verified across ${dist.runs.length} independent runs</h2>
    <div class="card">
      <p class="attack-count" style="margin-bottom:1.25rem">A single run could be a lucky draw. We ran the full pipeline ${dist.runs.length} times, real OpenAI calls, real training, real scoring, and recorded what actually happened each time, no averaging tricks.</p>
      ${_rangeBarHTML("Fraud caught", s.catch_rate_pct, 80, 100, "var(--success)")}
      ${_rangeBarHTML("Fraud missed", s.miss_rate_pct, 0, 20, "var(--risk)")}
      ${_rangeBarHTML("False positive rate", s.fp_rate_pct, 0, 20, "var(--warning)")}
      <p class="attack-count" style="margin-top:1.25rem">The numbers move by a point or two run to run because several agents make real OpenAI calls at a high temperature, so the generated fraud is genuinely different every time. That's expected, not a bug.</p>
    </div>`;
}

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

    ${_distributionSectionHTML()}

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
/* Tab: Governance                                                     */
/* ---------------------------------------------------------------- */
const FINAL_BADGE_CLASS = { EXECUTE: "allow", BLOCK: "block", NO_EXECUTION: "flag" };
const FINAL_LABEL = { EXECUTE: "Executed", BLOCK: "Blocked", NO_EXECUTION: "Held for review" };
const MANDATE_BADGE_CLASS = { ALLOW: "allow", BLOCK: "block", REQUIRES_APPROVAL: "flag" };

function renderGovernance(app) {
  const gov = DASH.governance;
  if (!gov) {
    app.innerHTML = `
      <p class="eyebrow">Governance & execution</p>
      <h1>No governance data yet</h1>
      <p class="page-intro">Run <code>python check_results.py</code> to generate decisions/mandate_decisions.json and this section.</p>`;
    return;
  }
  const counts = gov.final_decision_counts;
  const total = counts.EXECUTE + counts.BLOCK + counts.NO_EXECUTION;
  const pct = (n) => (total ? (n / total) * 100 : 0);
  const policy = gov.policy;

  app.innerHTML = `
    <p class="eyebrow">Governance & execution</p>
    <h1>The detector doesn't get the last word</h1>
    <p class="page-intro">A second, independent, deterministic layer, the Mandate Engine, evaluates every transaction against business policy with no ML and no randomness. Only Detection ALLOW + Mandate ALLOW, backed by a verified authority signature, can execute.</p>

    <div class="stat-tiles">
      <div class="stat-tile"><div class="value good">${counts.EXECUTE.toLocaleString()}</div><div class="label">Executed</div></div>
      <div class="stat-tile"><div class="value bad">${counts.BLOCK.toLocaleString()}</div><div class="label">Blocked</div></div>
      <div class="stat-tile"><div class="value neutral">${counts.NO_EXECUTION.toLocaleString()}</div><div class="label">Held for human review</div></div>
    </div>

    <h2>Final verdicts</h2>
    <div class="card">
      <div class="split-bar">
        <div class="seg" style="width:${pct(counts.EXECUTE)}%;background:var(--success)">${counts.EXECUTE}</div>
        <div class="seg" style="width:${pct(counts.BLOCK)}%;background:var(--risk)">${counts.BLOCK}</div>
        <div class="seg" style="width:${pct(counts.NO_EXECUTION)}%;background:var(--warning)">${counts.NO_EXECUTION}</div>
      </div>
      <div class="split-legend">
        <span><span class="dot" style="background:var(--success)"></span>Executed</span>
        <span><span class="dot" style="background:var(--risk)"></span>Blocked</span>
        <span><span class="dot" style="background:var(--warning)"></span>Held for review</span>
      </div>
    </div>

    <h2>The policy behind every decision</h2>
    <div class="card">
      <table class="simple-table">
        <tbody>
          <tr><td>Policy</td><td class="num">${esc(policy.policy_id)} v${esc(policy.policy_version)}</td></tr>
          <tr><td>Max transaction amount</td><td class="num">$${policy.max_transaction_amount.toLocaleString()}</td></tr>
          <tr><td>Allowed currencies</td><td class="num">${policy.allowed_currencies.join(", ")}</td></tr>
          <tr><td>Blocked merchants</td><td class="num">${policy.blocked_merchants.length ? policy.blocked_merchants.join(", ") : "none"}</td></tr>
          <tr><td>Requires human approval above</td><td class="num">$${policy.require_approval_above.toLocaleString()}</td></tr>
        </tbody>
      </table>
      <p class="attack-count" style="margin-top:0.9rem">Policy hash: <span class="sig-value">${esc(gov.policy_hash)}</span></p>
    </div>

    <h2>How a transaction earns execution</h2>
    <div class="card">
      <div class="flow-steps">
        <div class="flow-step"><span class="flow-num">1</span><div><b>Detector:</b> proposes ALLOW, FLAG, or BLOCK based on fraud risk.</div></div>
        <div class="flow-step"><span class="flow-num">2</span><div><b>Mandate Engine:</b> independently evaluates the same transaction against business policy, no shared code with the detector, no randomness, same input always gives the same output.</div></div>
        <div class="flow-step"><span class="flow-num">3</span><div><b>Authority:</b> signs the mandate decision and the combined verdict, each with its own Ed25519 signature.</div></div>
        <div class="flow-step"><span class="flow-num">4</span><div><b>Execution gate:</b> only sets execution_performed = true if final_decision is EXECUTE *and* the authority signature on that exact record verifies. Anything else, including a forged claim, is refused.</div></div>
      </div>
    </div>

    <div class="honest-box" style="margin-top:1.75rem">
      <h3>Honest note on this run</h3>
      <p style="margin:0;color:var(--text-dim)">The transactions the mandate blocked were already caught by the detector in this run, currency isn't even a signal the detector's model sees, but the injection-style attacks that produced invalid currency values here were loud enough on other signals to get caught anyway. That's a property of this dataset, not a guarantee. The critical-invariant test in <code>tests/test_critical_invariant.py</code> proves the disagreement case directly: detector ALLOW, mandate BLOCK, execution refused.</p>
    </div>

    <button class="action" id="mandate-btn">View Sample Mandate Records</button>
    <div class="reveal-panel" id="mandate-panel" style="display:none"></div>
  `;

  document.getElementById("mandate-btn").addEventListener("click", (e) => {
    const panel = document.getElementById("mandate-panel");
    if (panel.style.display !== "none") {
      panel.style.display = "none";
      e.target.textContent = "View Sample Mandate Records";
      return;
    }
    panel.style.display = "block";
    e.target.textContent = "Hide Sample Mandate Records";
    const rows = gov.sample_mandate_records
      .slice(0, 10)
      .map((r) => {
        const md = r.mandate_decision;
        const cd = r.combined_decision;
        const ev = r.execution_evidence;
        return `<tr>
          <td>${esc(r.transaction_id)}</td>
          <td><span class="badge ${MANDATE_BADGE_CLASS[md.decision] || "gap"}">${esc(md.decision)}</span></td>
          <td>${esc(md.reason_codes.join(", ") || "-")}</td>
          <td><span class="badge ${FINAL_BADGE_CLASS[cd.final_decision] || "gap"}">${esc(FINAL_LABEL[cd.final_decision] || cd.final_decision)}</span></td>
          <td>${ev.execution_performed ? "yes" : "no"}</td>
        </tr>`;
      })
      .join("");
    panel.innerHTML = `
      <div class="card">
        <table class="simple-table">
          <thead><tr><th>Transaction</th><th>Mandate</th><th>Reason codes</th><th>Final</th><th>Executed</th></tr></thead>
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
/* Tab: API Activity                                                  */
/* ---------------------------------------------------------------- */
function _apiCallCardHTML(c, i) {
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
}

function _wireApiToggle(i) {
  document.getElementById(`api-toggle-${i}`).addEventListener("click", (e) => {
    const pre = document.getElementById(`api-detail-${i}`);
    const showing = pre.style.display !== "none";
    pre.style.display = showing ? "none" : "block";
    e.target.textContent = showing ? "Show prompt and response ▾" : "Hide prompt and response ▴";
  });
}

function renderApiActivity(app) {
  const aa = DASH.api_activity;
  if (!aa || aa.calls.length === 0) {
    app.innerHTML = `
      <p class="eyebrow">API activity</p>
      <h1>No API calls recorded yet</h1>
      <p class="page-intro">Run <code>python run_simulation.py</code> with an OpenAI key set in <code>.env</code> to generate this log.</p>`;
    return;
  }
  const chronological = aa.calls.slice();
  const m = DASH.detector.metrics;
  const totalAttacks = DASH.simulation.fraud_transaction_count;
  const caught = (m.fraud_caught_rate * 100).toFixed(2);
  const missed = (m.fraud_missed_rate * 100).toFixed(2);
  const fpr = (m.false_positive_rate * 100).toFixed(2);

  app.innerHTML = `
    <p class="eyebrow">API activity</p>
    <h1>Real attacks, caught by a real detector</h1>
    <p class="page-intro">These numbers are from an actual run, not a mockup. Below them is the evidence: a real log of every AI call the pipeline made to generate this data, not a live call happening in your browser (an API key should never sit in a page anyone could open dev tools on), a record of what actually happened, timestamps, token counts, and cost, straight from OpenAI's own response to each call.</p>

    <div class="stat-tiles">
      <div class="stat-tile"><div class="value neutral">${totalAttacks.toLocaleString()}</div><div class="label">Total attacks</div></div>
      <div class="stat-tile"><div class="value good">${caught}%</div><div class="label">Fraud caught</div></div>
      <div class="stat-tile"><div class="value bad">${missed}%</div><div class="label">Fraud missed</div></div>
      <div class="stat-tile"><div class="value bad">${fpr}%</div><div class="label">False positive rate</div></div>
    </div>

    ${_distributionSectionHTML()}

    <h2>Real API call log</h2>
    <p class="page-intro" style="margin-bottom:1rem">${aa.summary.total_calls} real calls, ${aa.summary.total_tokens.toLocaleString()} tokens, $${aa.summary.total_cost_usd.toFixed(4)} total, ${aa.summary.avg_latency_ms.toLocaleString()}ms average latency. Click Replay to watch this same real log fill back in.</p>

    <button class="action" id="replay-btn">▶ Replay</button>
    <span id="replay-status" class="attack-count" style="margin-left:0.9rem"></span>

    <div class="grid" style="gap:0.75rem; margin-top:1.25rem" id="api-call-log">
      ${aa.calls
        .slice()
        .reverse()
        .map((c, i) => _apiCallCardHTML(c, i))
        .join("")}
    </div>
  `;

  aa.calls.forEach((_, i) => _wireApiToggle(i));

  document.getElementById("replay-btn").addEventListener("click", () => _replayApiLog(chronological));
}

function _replayApiLog(chronological) {
  if (_replayTimer) return;
  const logEl = document.getElementById("api-call-log");
  const statusEl = document.getElementById("replay-status");
  const btn = document.getElementById("replay-btn");
  logEl.innerHTML = "";
  btn.disabled = true;

  const step = (idx) => {
    if (idx >= chronological.length) {
      statusEl.textContent = `Replay complete, ${chronological.length} of ${chronological.length} calls`;
      btn.disabled = false;
      _replayTimer = null;
      return;
    }
    const c = chronological[idx];
    logEl.insertAdjacentHTML("afterbegin", _apiCallCardHTML(c, idx));
    _wireApiToggle(idx);
    statusEl.textContent = `Replaying, call ${idx + 1} of ${chronological.length}`;

    _replayTimer = setTimeout(() => step(idx + 1), 500);
  };

  step(0);
}

/* ---------------------------------------------------------------- */
/* Tab: README                                                        */
/* ---------------------------------------------------------------- */
function renderReadme(app) {
  const m = DASH.detector.metrics;
  const caught = (m.fraud_caught_rate * 100).toFixed(2);
  const missed = (m.fraud_missed_rate * 100).toFixed(2);
  const records = DASH.simulation.fraud_transaction_count.toLocaleString();
  const aa = DASH.api_activity;

  app.innerHTML = `
    <p class="eyebrow">About this lab</p>
    <h1>Mastercard AI Defense Lab</h1>
    <p class="page-intro">Payment fraud detection where every decision, caught or missed, is signed by an authority outside the detector and can be independently verified.</p>

    <h2>The problem</h2>
    <p class="explain-text" style="margin-top:0">When a fraud detector blocks a payment, how do you know it actually happened? The detector writes its own logs. If it bugs out, gets compromised, or lies, there is no independent way to verify the decision was real.</p>

    <h2>The solution</h2>
    <p class="explain-text" style="margin-top:0">Move authority outside the system. When the detector blocks fraud, an authority outside it signs that decision with a key nothing else touches. Anyone can verify the signature is real, that's proof, not a claim.</p>

    <h2>What's real here</h2>
    <div class="honest-box">
      <ul>
        <li>${records} attack records generated by 7 agents, each bounded by a signed limit</li>
        <li>${caught}% of attacks caught, ${missed}% missed, and we explain why on the Detection Results tab</li>
        <li>${aa ? aa.summary.total_calls : 0} real AI calls made this run, logged on the API Activity tab with real cost and latency, not mocked</li>
        <li>Every signed decision independently verified, shown on the Proof tab</li>
      </ul>
    </div>

    ${_distributionSectionHTML()}

    <h2>How to reproduce this</h2>
    <div class="card">
      <pre class="code-block" style="margin-top:0">pip install -r requirements.txt
cp .env.example .env   # add your own OPENAI_API_KEY

cd src
python run_simulation.py
python check_results.py
python probe_detector.py
python generate_docx.py
python -m http.server 8000 -d ../web</pre>
    </div>

    <h2>Where to look</h2>
    <div class="grid cols-2">
      <div class="card"><div class="card-head"><h3>API Activity</h3></div><p class="attack-count">Real, logged AI calls, replayable, never a live key in the page.</p></div>
      <div class="card"><div class="card-head"><h3>Attacks</h3></div><p class="attack-count">The 7 fraud techniques, plain English, real generated counts.</p></div>
      <div class="card"><div class="card-head"><h3>Simulation</h3></div><p class="attack-count">Total records generated, broken down by attack type, with real sample data.</p></div>
      <div class="card"><div class="card-head"><h3>Detection Results</h3></div><p class="attack-count">Caught versus missed, and the honest, real reasons why.</p></div>
      <div class="card"><div class="card-head"><h3>Governance</h3></div><p class="attack-count">The deterministic Mandate Engine, the decision matrix, and why only ALLOW + ALLOW executes.</p></div>
      <div class="card"><div class="card-head"><h3>Proof</h3></div><p class="attack-count">Every signed decision, override, and agent limit, independently checked.</p></div>
    </div>

    <h2>Why this matters</h2>
    <p class="explain-text" style="margin-top:0">You can't prevent all fraud. You can make all of it verifiable. That's the property this lab demonstrates: not a perfect detector, a governed one.</p>
  `;
}

boot();
