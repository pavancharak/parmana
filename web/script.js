/* Parmana Fraud Defense Lab: static dashboard driven entirely by
   web/data/dashboard.json, produced by src/run_simulation.py and
   src/check_results.py. No server-side code runs from this page. */

let DASH = null;

async function boot() {
  try {
    const res = await fetch("data/dashboard.json", { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    DASH = await res.json();
  } catch (err) {
    document.getElementById("app").innerHTML =
      `<div class="loading">Could not load data/dashboard.json (${err.message}).<br>
       Run <code>python run_simulation.py &amp;&amp; python check_results.py</code> from src/, then serve this
       folder with <code>python -m http.server</code> from inside web/.</div>`;
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

function fmtTime(ts) {
  return new Date(ts * 1000).toLocaleString();
}

function render(tab) {
  const app = document.getElementById("app");
  if (tab === "attacks") return renderAttacks(app);
  if (tab === "simulator") return renderSimulator(app);
  if (tab === "detector") return renderDetector(app);
  if (tab === "redteam") return renderRedTeam(app);
  if (tab === "honest") return renderHonest(app);
}

/* ---------------------------------------------------------------- */
/* Page 1: Attacks                                                    */
/* ---------------------------------------------------------------- */
function renderAttacks(app) {
  const cards = DASH.attacks
    .map((a) => {
      const simulated = a.simulated_by && !a.simulated_by.startsWith("not simulated") && !a.simulated_by.startsWith("not directly");
      const badgeClass = simulated ? "simulated" : "gap";
      const badgeText = simulated ? "Simulated in this lab" : "Known gap, not simulated";
      return `
      <article class="card attack-card">
        <div class="card-head">
          <h3>${esc(a.name)}</h3>
          <span class="badge ${badgeClass}">${badgeText}</span>
        </div>
        <div class="attack-stage">${esc(a.stage)}</div>
        <dl>
          <dt>What the attacker needs</dt><dd>${esc(a.what_attacker_needs)}</dd>
          <dt>Why it's hard to catch</dt><dd>${esc(a.why_hard_to_catch)}</dd>
          <dt>Damage</dt><dd>${esc(a.damage)}</dd>
        </dl>
      </article>`;
    })
    .join("");

  app.innerHTML = `
    <h1>Seven ways AI commits payment fraud</h1>
    <p class="page-intro">Three of these are actively simulated by bounded agents in this lab (Page 2). The rest
    are documented honestly as known gaps: real attack paths this lab does not generate traffic for.</p>
    <div class="grid cols-2">${cards}</div>
  `;
}

/* ---------------------------------------------------------------- */
/* Page 2: Simulator                                                  */
/* ---------------------------------------------------------------- */
function renderSimulator(app) {
  const sim = DASH.simulation;
  app.innerHTML = `
    <h1>Run the fraud simulator</h1>
    <p class="page-intro">This replays the already generated, signed simulation output with a live animation.
    The underlying computation happened by running <code>python run_simulation.py</code>. A static page can't
    spawn that process itself, so nothing here is faked, it's a truthful replay of real signed data.</p>

    <div class="sim-controls">
      <button class="primary" id="run-btn">▶ Replay agent simulation</button>
      <label style="font-size:0.85rem;color:var(--text-dim)">
        Reveal up to <span id="slider-val">${sim.fraud_transaction_count}</span> fraudulent transactions
        <br><input type="range" id="tx-slider" min="10" max="${sim.fraud_transaction_count}" value="${sim.fraud_transaction_count}">
      </label>
      <a class="primary" style="text-decoration:none;display:inline-block" href="../data/fraud_transactions.json" download>⬇ Download fraud_transactions.json</a>
    </div>
    <div class="progress-wrap"><div class="progress-bar" id="progress-bar"></div></div>
    <div class="sim-note" id="progress-note">Idle. Press Replay to animate token issuance and transaction generation.</div>

    <h2>Agents &amp; their signed authorization tokens</h2>
    <div class="grid cols-3" id="agent-cards"></div>
  `;

  renderAgentCards(sim.agent_summaries);

  const slider = document.getElementById("tx-slider");
  const sliderVal = document.getElementById("slider-val");
  slider.addEventListener("input", () => (sliderVal.textContent = slider.value));

  document.getElementById("run-btn").addEventListener("click", () => runSimulationAnimation(sim));
}

function renderAgentCards(agentSummaries) {
  const container = document.getElementById("agent-cards");
  container.innerHTML = agentSummaries
    .map((a, idx) => {
      const util = ((a.actually_executed / a.authorized_max) * 100).toFixed(0);
      const txRows = a.sample_transactions
        .map(
          (t) => `<tr>
            <td class="mono">${esc(t.transaction_id)}</td>
            <td>${esc(t.customer_name || t.customer_id)}</td>
            <td>${esc(t.currency)} ${t.amount}</td>
            <td>${esc(t.attack_type)}</td>
          </tr>`
        )
        .join("");
      return `
      <div class="card agent-card">
        <div class="card-head">
          <h3>${esc(a.agent_id)}</h3>
          <span class="badge ${a.signature_verifies ? "verified" : "failed"}">${a.signature_verifies ? "token verified" : "verify failed"}</span>
        </div>
        <div class="stat-row"><span>Authorized max</span><b>${a.authorized_max}</b></div>
        <div class="stat-row"><span>Actually executed</span><b>${a.actually_executed}</b></div>
        <div class="stat-row"><span>Within bounds</span><b>${a.within_bounds ? "yes" : "NO, violation"}</b></div>
        <div class="progress-wrap"><div class="progress-bar" style="width:${util}%"></div></div>
        <div class="sim-note">${util}% of authorized ceiling used</div>
        <table class="tx-table">
          <thead><tr><th>tx id</th><th>identity</th><th>amount</th><th>type</th></tr></thead>
          <tbody>${txRows}</tbody>
        </table>
        <button class="token-toggle" data-idx="${idx}">Show signed authorization token ▾</button>
        <pre class="json-block" id="token-json-${idx}" style="display:none">${esc(JSON.stringify(a.token, null, 2))}</pre>
      </div>`;
    })
    .join("");

  container.querySelectorAll(".token-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const pre = document.getElementById("token-json-" + btn.dataset.idx);
      const showing = pre.style.display !== "none";
      pre.style.display = showing ? "none" : "block";
      btn.textContent = showing ? "Show signed authorization token ▾" : "Hide signed authorization token ▴";
    });
  });
}

function runSimulationAnimation(sim) {
  const btn = document.getElementById("run-btn");
  const bar = document.getElementById("progress-bar");
  const note = document.getElementById("progress-note");
  const target = parseInt(document.getElementById("tx-slider").value, 10);
  btn.disabled = true;
  bar.style.width = "0%";

  const steps = sim.agent_summaries.map((a) => `${a.agent_id} requesting signed token (max ${a.authorized_max})...`);
  let i = 0;
  const stepTimer = setInterval(() => {
    if (i < steps.length) {
      note.textContent = steps[i];
      i++;
    }
  }, 450);

  let pct = 0;
  const total = Math.min(target, sim.fraud_transaction_count);
  const progressTimer = setInterval(() => {
    pct += Math.max(1, Math.round(total / 40));
    if (pct >= total) {
      pct = total;
      clearInterval(progressTimer);
      clearInterval(stepTimer);
      note.textContent = `Done. ${total} bounded, signed fraud transactions generated across 3 agents. All within authorized limits.`;
      btn.disabled = false;
    }
    bar.style.width = Math.round((pct / total) * 100) + "%";
  }, 60);
}

/* ---------------------------------------------------------------- */
/* Page 3: Detector                                                   */
/* ---------------------------------------------------------------- */
function renderDetector(app) {
  const m = DASH.detector.metrics;
  const counts = DASH.detector.decision_counts;
  const v = DASH.verification;

  app.innerHTML = `
    <h1>Fraud detector + signed decisions</h1>
    <p class="page-intro">The detector proposes a score. Every block/flag/allow decision is then signed by the
    external authority (a module the detector does not control) before it becomes official.</p>

    <div class="stat-tiles">
      <div class="stat-tile good"><div class="value">${(m.fraud_caught_rate * 100).toFixed(1)}%</div><div class="label">Fraud caught</div></div>
      <div class="stat-tile bad"><div class="value">${(m.fraud_missed_rate * 100).toFixed(1)}%</div><div class="label">Fraud missed</div></div>
      <div class="stat-tile bad"><div class="value">${(m.false_positive_rate * 100).toFixed(1)}%</div><div class="label">False positive rate</div></div>
      <div class="stat-tile good"><div class="value">${(m.precision * 100).toFixed(1)}%</div><div class="label">Precision</div></div>
    </div>

    <h2>Confusion matrix</h2>
    <div class="grid cols-2">
      <div class="card">
        <table class="tx-table">
          <tr><th></th><th>Predicted fraud</th><th>Predicted legit</th></tr>
          <tr><th>Actually fraud</th><td>${m.confusion_matrix.true_positive} (caught)</td><td>${m.confusion_matrix.false_negative} (missed)</td></tr>
          <tr><th>Actually legit</th><td>${m.confusion_matrix.false_positive} (false alarm)</td><td>${m.confusion_matrix.true_negative} (correct)</td></tr>
        </table>
      </div>
      <div class="card">
        <div class="bar-chart">
          ${m.top_signals
            .map(
              (s) => `<div class="bar-row"><span>${esc(s.feature)}</span>
              <div class="bar-track"><div class="bar-fill" style="width:${(s.importance * 100).toFixed(0)}%;background:var(--accent)"></div></div>
              <span>${(s.importance * 100).toFixed(0)}%</span></div>`
            )
            .join("")}
        </div>
        <div class="sim-note">Top signals the model actually relies on (feature importance)</div>
      </div>
    </div>

    <h2>Decision mix</h2>
    <div class="card">
      <div class="bar-chart">
        ${["BLOCK", "FLAG", "ALLOW"]
          .map((k) => {
            const total = counts.BLOCK + counts.FLAG + counts.ALLOW;
            const pct = ((counts[k] / total) * 100).toFixed(0);
            const color = k === "BLOCK" ? "var(--block)" : k === "FLAG" ? "var(--flag)" : "var(--allow)";
            return `<div class="bar-row"><span>${k} (${counts[k]})</span>
              <div class="bar-track"><div class="bar-fill" style="width:${pct}%;background:${color}"></div></div>
              <span>${pct}%</span></div>`;
          })
          .join("")}
      </div>
    </div>

    <h2>Signature verification (public-key check only)</h2>
    <div class="verify-strip">
      <div class="verify-pill">Agent tokens verified: <b>${Object.values(v.agent_tokens).filter(Boolean).length}/${Object.values(v.agent_tokens).length}</b></div>
      <div class="verify-pill">Sampled decisions verified: <b>${v.decisions_valid}/${v.decisions_sampled}</b></div>
      <div class="verify-pill">Overrides verified: <b>${v.overrides_valid}/${v.overrides_sampled}</b></div>
      <div class="verify-pill">Key separation holds: <b>${v.override_does_not_verify_as_authority && v.decision_does_not_verify_as_reviewer ? "yes" : "NO"}</b></div>
    </div>

    <h2>Sample signed block decisions <span style="font-weight:400;color:var(--text-dim);font-size:0.8rem">(click a row to inspect the signature)</span></h2>
    <div class="card">
      <table class="tx-table" id="decision-table">
        <thead><tr><th>tx id</th><th>score</th><th>decision</th><th>actually fraud?</th><th>reasons</th></tr></thead>
        <tbody id="decision-tbody"></tbody>
      </table>
    </div>

    <h2>Human override log <span style="font-weight:400;color:var(--text-dim);font-size:0.8rem">(signed by REVIEWER, a different key than AUTHORITY)</span></h2>
    <div class="list-flat" id="override-list"></div>
  `;

  renderDecisionTable(DASH.detector.sample_decisions);
  renderOverrides(DASH.overrides);
}

function renderDecisionTable(samples) {
  const tbody = document.getElementById("decision-tbody");
  tbody.innerHTML = samples
    .map((e, idx) => {
      const d = e.decision;
      const badgeClass = d.decision.toLowerCase();
      const correct = e.ground_truth.is_fraud === 1 ? "fraud" : "legit";
      return `
      <tr class="decision-row" data-idx="${idx}">
        <td class="mono">${esc(d.transaction_id)}</td>
        <td>${(d.fraud_score * 100).toFixed(1)}%</td>
        <td><span class="badge ${badgeClass}">${d.decision}</span></td>
        <td>${correct}</td>
        <td>${esc(d.reasons.join(", "))}</td>
      </tr>
      <tr class="detail-row" id="detail-${idx}" style="display:none"><td colspan="5"><pre>${esc(JSON.stringify(d, null, 2))}</pre></td></tr>`;
    })
    .join("");

  tbody.querySelectorAll(".decision-row").forEach((row) => {
    row.addEventListener("click", () => {
      const detail = document.getElementById("detail-" + row.dataset.idx);
      detail.style.display = detail.style.display === "none" ? "table-row" : "none";
    });
  });
}

function renderOverrides(overrides) {
  const list = document.getElementById("override-list");
  if (!overrides.length) {
    list.innerHTML = `<div class="card">No overrides in this run.</div>`;
    return;
  }
  list.innerHTML = overrides
    .map(
      (o, idx) => `
    <div class="card">
      <div class="card-head">
        <h3 class="mono" style="font-size:0.85rem">${esc(o.transaction_id)}</h3>
        <span class="badge ${o.original_decision.toLowerCase()}">${o.original_decision}</span> →
        <span class="badge ${o.new_decision.toLowerCase()}">${o.new_decision}</span>
      </div>
      <dl>
        <dt>Reviewer</dt><dd>${esc(o.reviewer_name)}</dd>
        <dt>Justification</dt><dd>${esc(o.justification)}</dd>
        <dt>Signed at</dt><dd>${fmtTime(o.signed_at)}, signer: <b>${esc(o.signer)}</b></dd>
      </dl>
      <button class="token-toggle" data-oidx="${idx}">Show signed override record ▾</button>
      <pre class="json-block" id="override-json-${idx}" style="display:none">${esc(JSON.stringify(o, null, 2))}</pre>
    </div>`
    )
    .join("");

  list.querySelectorAll(".token-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const pre = document.getElementById("override-json-" + btn.dataset.oidx);
      const showing = pre.style.display !== "none";
      pre.style.display = showing ? "none" : "block";
      btn.textContent = showing ? "Show signed override record ▾" : "Hide signed override record ▴";
    });
  });
}

/* ---------------------------------------------------------------- */
/* Page 4: Red Team                                                    */
/* ---------------------------------------------------------------- */
function renderRedTeam(app) {
  const rt = DASH.redteam;
  if (!rt) {
    app.innerHTML = `
      <h1>Red team: attacking our own detector</h1>
      <p class="page-intro">No red team report found yet. Run <code>python probe_detector.py</code>
      after <code>check_results.py</code> to generate Agent 3 and Agent 7's results.</p>`;
    return;
  }

  const probe = rt.limit_probe;
  const evasion = rt.feedback_loop;
  const results = probe.results;
  const maxAmount = Math.max(...results.map((r) => r.amount));

  app.innerHTML = `
    <h1>Red team: attacking our own detector</h1>
    <p class="page-intro">Agents 3 and 7 don't touch any external system. They run after the detector is
    trained and attack the exact model judges can retrain themselves, honest self-testing, not a demo
    against a system we don't control.</p>

    <h2>Agent 3: Limit Prober <span style="font-weight:400;color:var(--text-dim);font-size:0.8rem">(varies amount only, holds every other feature at the legitimate population's median)</span></h2>
    <div class="card">
      <div class="bar-chart">
        ${results
          .map((r) => {
            const color = r.decision === "BLOCK" ? "var(--block)" : r.decision === "FLAG" ? "var(--flag)" : "var(--allow)";
            const pct = Math.max(2, (r.amount / maxAmount) * 100);
            return `<div class="bar-row"><span>$${r.amount.toLocaleString()}</span>
              <div class="bar-track"><div class="bar-fill" style="width:${pct}%;background:${color}"></div></div>
              <span>${(r.score * 100).toFixed(1)}% (${r.decision})</span></div>`;
          })
          .join("")}
      </div>
      <div class="sim-note">${
        probe.threshold_amount
          ? `Detector starts blocking at $${probe.threshold_amount.toLocaleString()} on amount alone.`
          : "No amount alone triggered BLOCK across $10 to $10,000. Amount isn't the detector's dominant signal, see Tab 3's top signals, so an attacker who only varies amount learns nothing useful here. That's a property worth knowing either way."
      }</div>
      <button class="token-toggle" id="probe-toggle">Show signed probe report ▾</button>
      <pre class="json-block" id="probe-json" style="display:none">${esc(JSON.stringify(probe, null, 2))}</pre>
    </div>

    <h2>Agent 7: Feedback Loop Exploit <span style="font-weight:400;color:var(--text-dim);font-size:0.8rem">(GPT-suggested variants of transactions closest to the 0.80 BLOCK threshold, the genuinely testable cases)</span></h2>
    <div class="card">
      <div class="stat-tiles" style="margin-bottom:1rem">
        <div class="stat-tile"><div class="value">${evasion.variants_tested}</div><div class="label">Variants tested</div></div>
        <div class="stat-tile ${evasion.variants_evaded > 0 ? "bad" : "good"}"><div class="value">${evasion.variants_evaded}</div><div class="label">Evaded detection</div></div>
      </div>
      <table class="tx-table">
        <thead><tr><th>tx id</th><th>original score</th><th>new score</th><th>new decision</th><th>evaded?</th></tr></thead>
        <tbody>
          ${evasion.results
            .map(
              (r) => `<tr>
              <td class="mono">${esc(r.transaction_id)}</td>
              <td>${(r.original_score * 100).toFixed(1)}%</td>
              <td>${(r.new_score * 100).toFixed(1)}%</td>
              <td><span class="badge ${r.new_decision.toLowerCase()}">${r.new_decision}</span></td>
              <td>${r.evaded ? "yes" : "no"}</td>
            </tr>`
            )
            .join("")}
        </tbody>
      </table>
      <div class="sim-note">${evasion.variants_evaded} of ${evasion.variants_tested} small, realistic GPT-suggested
      tweaks pushed a genuinely blocked transaction below the BLOCK threshold. This is what an adversary with
      query access to a detector's scores could find; it's real, not a hidden weakness we're pretending doesn't
      exist.</div>
      <button class="token-toggle" id="evasion-toggle">Show signed evasion report ▾</button>
      <pre class="json-block" id="evasion-json" style="display:none">${esc(JSON.stringify(evasion, null, 2))}</pre>
    </div>

    <h2>Signature verification</h2>
    <div class="verify-strip">
      <div class="verify-pill">Limit probe report signed and valid: <b>${rt.verification.limit_probe_valid ? "yes" : "NO"}</b></div>
      <div class="verify-pill">Feedback loop report signed and valid: <b>${rt.verification.feedback_loop_valid ? "yes" : "NO"}</b></div>
    </div>
  `;

  document.getElementById("probe-toggle").addEventListener("click", (e) => {
    const pre = document.getElementById("probe-json");
    const showing = pre.style.display !== "none";
    pre.style.display = showing ? "none" : "block";
    e.target.textContent = showing ? "Show signed probe report ▾" : "Hide signed probe report ▴";
  });
  document.getElementById("evasion-toggle").addEventListener("click", (e) => {
    const pre = document.getElementById("evasion-json");
    const showing = pre.style.display !== "none";
    pre.style.display = showing ? "none" : "block";
    e.target.textContent = showing ? "Show signed evasion report ▾" : "Hide signed evasion report ▴";
  });
}

/* ---------------------------------------------------------------- */
/* Page 5: Honest Answer                                               */
/* ---------------------------------------------------------------- */
function renderHonest(app) {
  const sample = DASH.detector.sample_decisions.find((e) => e.decision.decision === "BLOCK") || DASH.detector.sample_decisions[0];
  const d = sample.decision;

  app.innerHTML = `
    <h1>What can this system actually prove?</h1>
    <p class="page-intro">The honest answer, not the marketing one.</p>

    <div class="honest-cols">
      <div class="card can-prove">
        <h3>✅ What we CAN prove</h3>
        <ul>
          <li>That the detector proposed this decision (logged)</li>
          <li>That the external authority signed off on it (Ed25519 signature)</li>
          <li>That no one changed it afterward without the signature breaking</li>
          <li>That each agent stayed within its authorized token limit</li>
          <li>Who overrode a decision, and that the override used a different key than the authority</li>
          <li>That Agents 1, 2, 4, and 7 made real OpenAI API calls, not canned text (Tab 2 and Tab 4 show real token usage and cost)</li>
        </ul>
      </div>
      <div class="card cannot-prove">
        <h3>❌ What we CAN'T prove</h3>
        <ul>
          <li>That this fraud never happens: ${(DASH.detector.metrics.fraud_missed_rate * 100).toFixed(1)}% of fraud in this run got through</li>
          <li>That the detector is always right: ${(DASH.detector.metrics.false_positive_rate * 100).toFixed(1)}% of legitimate transactions were false alarms</li>
          <li>Why an attacker did this, only that they did</li>
          <li>Coverage of every attack type: see Tab 1 for exactly which are simulated versus documented gaps</li>
          <li>Robustness at scale: Agent 7 tested 15 GPT-suggested variants against 5 boundary-case blocks, not an exhaustive adversarial search. A determined attacker with more queries would likely find more evasions than the ${DASH.redteam ? DASH.redteam.feedback_loop.variants_evaded : "?"} we found</li>
        </ul>
      </div>
    </div>

    <h2>Why this matters</h2>
    <p style="max-width:70ch">Normal fraud detection says: <em>"our logs show we caught this."</em> But the logs are
    written by the detector. In this system the answer is instead: <em>"here's the signature from an external
    authority. It's cryptographically signed. If the detector wasn't really blocked, this signature wouldn't
    verify."</em> That's the difference between assertion and evidence.</p>

    <h2>Verify it yourself</h2>
    <div class="example-block">
      <div class="row"><span>Transaction ID</span><b class="mono">${esc(d.transaction_id)}</b></div>
      <div class="row"><span>Detector score</span><b>${(d.fraud_score * 100).toFixed(1)}% fraud</b></div>
      <div class="row"><span>Authority decision</span><b>${esc(d.decision)}</b></div>
      <div class="row"><span>Signer</span><b>${esc(d.signer)}</b></div>
      <div class="row"><span>Signature (Ed25519, hex)</span><b class="mono" style="word-break:break-all;max-width:60%">${esc(d.signature.slice(0, 48))}&hellip;</b></div>
      <div class="row"><span>Ground truth</span><b>${sample.ground_truth.is_fraud ? "was fraud" : "was legitimate"} (${esc(sample.ground_truth.attack_type)})</b></div>
    </div>
    <p class="sim-note">Verify independently: load <code>tokens/authority_public_key.pem</code> and check this
    signature against the exact JSON body in <code>decisions/block_decisions.json</code>, see
    <code>src/authority_signer.py::verify_record</code> for the 15-line reference implementation.</p>
  `;
}

boot();
