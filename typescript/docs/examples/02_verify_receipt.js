var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __addDisposableResource = (this && this.__addDisposableResource) || function (env, value, async) {
    if (value !== null && value !== void 0) {
        if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
        var dispose, inner;
        if (async) {
            if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
            dispose = value[Symbol.asyncDispose];
        }
        if (dispose === void 0) {
            if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
            dispose = value[Symbol.dispose];
            if (async) inner = dispose;
        }
        if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
        if (inner) dispose = function() { try { inner.call(this); } catch (e) { return Promise.reject(e); } };
        env.stack.push({ value: value, dispose: dispose, async: async });
    }
    else if (async) {
        env.stack.push({ async: true });
    }
    return value;
};
var __disposeResources = (this && this.__disposeResources) || (function (SuppressedError) {
    return function (env) {
        function fail(e) {
            env.error = env.hasError ? new SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
            env.hasError = true;
        }
        var r, s = 0;
        function next() {
            while (r = env.stack.pop()) {
                try {
                    if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
                    if (r.dispose) {
                        var result = r.dispose.call(r.value);
                        if (r.async) return s |= 2, Promise.resolve(result).then(next, function(e) { fail(e); return next(); });
                    }
                    else s |= 1;
                }
                catch (e) {
                    fail(e);
                }
            }
            if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
            if (env.hasError) throw env.error;
        }
        return next();
    };
})(typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
});
#;
Example;
2;
Verify;
Receipt;
#;
#;
Overview;
After;
a;
Business;
Transaction;
has;
been;
executed, Parmana;
produces;
cryptographic;
artifacts;
that;
allow;
the;
execution;
to;
be;
independently;
verified.
;
This;
example;
demonstrates;
how;
to;
verify;
an;
Execution;
Trust;
Record;
var the, TypeScript, SDK, Verification, is, a, core, capability, the, immutable, Execution, Trust, Record;
var env_1 = { stack: [], error: void 0, hasError: false };
try {
    the = __addDisposableResource(env_1, void 0, false), TypeScript = __addDisposableResource(env_1, void 0, false), SDK = __addDisposableResource(env_1, void 0, false), Verification = __addDisposableResource(env_1, void 0, false), is = __addDisposableResource(env_1, void 0, false), a = __addDisposableResource(env_1, void 0, false), core = __addDisposableResource(env_1, void 0, false), capability = __addDisposableResource(env_1, void 0, false);
    of;
    Parmana;
    because;
    it;
    allows;
    a;
    third;
    party;
    to;
    determine;
    whether;
    an;
    execution;
    occurred;
    exactly, without;
    relying;
    on;
    trust in the;
    executing;
    application.
    ;
    -- - ;
    Learning;
    Objectives;
    After;
    completing;
    this;
    guide;
    you;
    will;
    understand: 
        * Why;
    verification;
    exists
        * The;
    purpose;
    of;
    a;
    Receipt
        * The;
    purpose;
    of;
    a;
    Verification;
    artifact
        * How;
    to;
    verify;
    an;
    Execution;
    Trust;
    Record
        * How;
    verification;
    differs;
    from;
    execution
        * How;
    verification;
    supports;
    independent;
    audit;
    -- - ;
    Prerequisites;
    Before;
    completing;
    this;
    example;
    you;
    should;
    understand: 
        * Authority
        * Authorization
        * Intent
        * PolicyReference
        * BusinessTransaction;
    If;
    not, complete;
    ""(__makeTemplateObject(["text\ndocs/01_basic_execution.md\n"], ["text\ndocs/01_basic_execution.md\n"]))(__makeTemplateObject([""], [""]));
    first.
    ;
    -- - ;
    Why;
    Verification ?
        Execution : ;
    answers: 
        > Did;
    the;
    system;
    perform;
    the;
    requested;
    operation ?
        Verification : ;
    answers: 
        > Can;
    someone;
    independently;
    prove;
    that;
    the;
    recorded;
    execution;
    is;
    authentic;
    and;
    internally;
    consistent ?
        Execution : ;
    and;
    verification;
    are;
    intentionally;
    separate;
    activities.
    ;
    -- - ;
    Execution;
    Trust;
    Chain;
    Verification;
    operates;
    on;
    an;
    existing;
    Execution;
    Trust;
    Record.
    (__makeTemplateObject([""], [""]))(__makeTemplateObject(["text\nAuthority\n      \u2502\nAuthorization\n      \u2502\nIntent\n      \u2502\nPolicyReference\n      \u2502\nBusinessTransaction\n      \u2502\nDecision\n      \u2502\nExecution\n      \u2502\nExecution Evidence\n      \u2502\nReceipt\n      \u2502\nExecution Trust Record\n      \u2502\nVerification\n"], ["text\nAuthority\n      \u2502\nAuthorization\n      \u2502\nIntent\n      \u2502\nPolicyReference\n      \u2502\nBusinessTransaction\n      \u2502\nDecision\n      \u2502\nExecution\n      \u2502\nExecution Evidence\n      \u2502\nReceipt\n      \u2502\nExecution Trust Record\n      \u2502\nVerification\n"]))(__makeTemplateObject([""], [""]));
    Verification;
    never;
    modifies;
    the;
    trust;
    chain.
    ;
    It;
    produces;
    another;
    immutable;
    trust;
    artifact.
    ;
    -- - ;
    What;
    Is;
    Verified ?
        The : ;
    verification;
    process;
    examines;
    the;
    complete;
    trust;
    chain, including;
        * Business;
    Transaction;
    identifiers
        * Authority
        * Authorization
        * Intent
        * Policy;
    Reference
        * Decision
        * Execution
        * Execution;
    Evidence
        * Trust;
    Record;
    Hash
        * Receipt;
    integrity;
    Every;
    component;
    contributes;
    to;
    the;
    verification;
    result.
    ;
    -- - ;
    Creating;
    the;
    Client(__makeTemplateObject([""], [""]))(__makeTemplateObject(["typescript\nimport { ParmanaClient } from \"@parmana/typescript-sdk\";\n\nconst client = new ParmanaClient({\n    endpoint: \"http://localhost:8080\",\n});\n"], ["typescript\nimport { ParmanaClient } from \"@parmana/typescript-sdk\";\n\nconst client = new ParmanaClient({\n    endpoint: \"http://localhost:8080\",\n});\n"]))(__makeTemplateObject([""], [""]));
    -- - ;
    Loading;
    the;
    Trust;
    Record;
    Normally;
    the;
    Runtime;
    or;
    storage;
    layer;
    returns;
    an(__makeTemplateObject(["ExecutionTrustRecord"], ["ExecutionTrustRecord"])).(__makeTemplateObject([""], [""]))(__makeTemplateObject(["typescript\nconst trustRecord = getExecutionTrustRecord();\n"], ["typescript\nconst trustRecord = getExecutionTrustRecord();\n"]))(__makeTemplateObject([""], [""]));
    For;
    the;
    SDK;
    example, a;
    placeholder;
    trust;
    record;
    is;
    used.
    ;
    -- - ;
    Verify;
    the;
    Trust;
    Record;
    Verification;
    requires;
    only;
    one;
    call.
    (__makeTemplateObject([""], [""]))(__makeTemplateObject(["typescript\nconst verification =\n    await client.verify(trustRecord);\n"], ["typescript\nconst verification =\n    await client.verify(trustRecord);\n"]))(__makeTemplateObject([""], [""]));
    The;
    SDK;
    sends;
    the;
    trust;
    record;
    to;
    the;
    Parmana;
    Runtime, which;
    performs;
    deterministic;
    verification.
    ;
    -- - ;
    Verification;
    Result;
    A;
    successful;
    verification;
    returns;
    a(__makeTemplateObject(["Verification"], ["Verification"]));
    object.
    (__makeTemplateObject([""], [""]))(__makeTemplateObject(["typescript\nconsole.log(\n    verification.verificationId\n);\n\nconsole.log(\n    verification.status\n);\n\nconsole.log(\n    verification.verifiedAt\n);\n"], ["typescript\nconsole.log(\n    verification.verificationId\n);\n\nconsole.log(\n    verification.status\n);\n\nconsole.log(\n    verification.verifiedAt\n);\n"]))(__makeTemplateObject([""], [""]));
    Typical;
    output: ""(__makeTemplateObject(["text\nVerification ID\n\nverification-001\n\nStatus\n\nVERIFIED\n\nVerified\n\n2026-06-29T12:54:17Z\n"], ["text\nVerification ID\n\nverification-001\n\nStatus\n\nVERIFIED\n\nVerified\n\n2026-06-29T12:54:17Z\n"]))(__makeTemplateObject([""], [""]));
    -- - ;
    Internal;
    Verification;
    Process;
    Although;
    the;
    SDK;
    exposes;
    a;
    single;
    method, the;
    Runtime;
    performs;
    multiple;
    validation;
    steps.
    (__makeTemplateObject([""], [""]))(__makeTemplateObject(["text\nExecution Trust Record\n        \u2502\nValidate Structure\n        \u2502\nValidate References\n        \u2502\nValidate Policy\n        \u2502\nValidate Decision\n        \u2502\nValidate Execution\n        \u2502\nValidate Receipt\n        \u2502\nCompute Trust Hash\n        \u2502\nReturn Verification\n"], ["text\nExecution Trust Record\n        \u2502\nValidate Structure\n        \u2502\nValidate References\n        \u2502\nValidate Policy\n        \u2502\nValidate Decision\n        \u2502\nValidate Execution\n        \u2502\nValidate Receipt\n        \u2502\nCompute Trust Hash\n        \u2502\nReturn Verification\n"]))(__makeTemplateObject([""], [""]));
    Each;
    step;
    is;
    deterministic.
    ;
    -- - ;
    Trust;
    Record;
    Hash;
    Every;
    Execution;
    Trust;
    Record;
    has;
    a;
    canonical;
    hash.
    (__makeTemplateObject([""], [""]))(__makeTemplateObject(["text\ntrustRecordHash\n"], ["text\ntrustRecordHash\n"]))(__makeTemplateObject([""], [""]));
    The;
    verifier;
    recomputes;
    this;
    value.
    ;
    If;
    the;
    computed;
    hash;
    differs;
    from;
    the;
    recorded;
    hash, verification;
    fails.
    ;
    -- - ;
    Why;
    Hashes;
    Matter;
    Hashes;
    provide;
    tamper;
    evidence.
    ;
    Changing;
    even;
    one;
    field;
    produces;
    a;
    completely;
    different;
    digest.
    ;
    For;
    example: ""(__makeTemplateObject(["text\nOriginal\n\nAuthority = Acme\n\nHash\n\n91df6c...\n\nModified\n\nAuthority = Other\n\nHash\n\n4af20e...\n"], ["text\nOriginal\n\nAuthority = Acme\n\nHash\n\n91df6c...\n\nModified\n\nAuthority = Other\n\nHash\n\n4af20e...\n"]))(__makeTemplateObject([""], [""]));
    Verification;
    immediately;
    detects;
    the;
    modification.
    ;
    -- - ;
    Verification;
    Status;
    Current;
    statuses;
    include: ""(__makeTemplateObject(["text\nVERIFIED\n\nFAILED\n"], ["text\nVERIFIED\n\nFAILED\n"]))(__makeTemplateObject([""], [""]));
    Future;
    versions;
    may;
    introduce;
    additional;
    diagnostic;
    states, ;
    while (preserving)
        the;
    deterministic;
    verification;
    model.
    ;
    -- - ;
    Error;
    Handling;
    Always;
    handle;
    verification;
    failures.
    (__makeTemplateObject([""], [""]))(__makeTemplateObject(["typescript\ntry {\n\n    const verification =\n        await client.verify(record);\n\n}\ncatch(error){\n\n    console.error(error);\n\n}\n"], ["typescript\ntry {\n\n    const verification =\n        await client.verify(record);\n\n}\ncatch(error){\n\n    console.error(error);\n\n}\n"]))(__makeTemplateObject([""], [""]));
    Verification;
    may;
    fail;
    because: 
        * Runtime;
    unavailable
        * Invalid;
    trust;
    record
        * Corrupted;
    receipt
        * Hash;
    mismatch
        * Authorization;
    inconsistency
        * Missing;
    execution;
    artifacts;
    -- - ;
    Verification;
    vs;
    Replay;
    Verification;
    confirms;
    integrity.
    ;
    Replay;
    reproduces;
    execution.
    ;
    Verification;
    asks: 
        > Is;
    this;
    execution;
    authentic ?
        Replay : ;
    asks: 
        > Would;
    the;
    same;
    inputs;
    produce;
    the;
    same;
    outcome ?
        Both : ;
    capabilities;
    complement;
    each;
    other;
    but;
    serve;
    different;
    purposes.
    ;
    -- - ;
    Independent;
    Verification;
    One;
    of;
    Parmana;
    's design goals is independent verification.;
    The;
    verifier;
    does;
    not;
    need;
    access;
    to: 
        * Original;
    application
        * Original;
    source;
    code
        * Original;
    database;
    Only;
    the;
    Execution;
    Trust;
    Record;
    and;
    verification;
    logic;
    are;
    required.
    ;
    This;
    separation;
    improves;
    transparency;
    and;
    auditability.
    ;
    -- - ;
    Security;
    Benefits;
    Verification;
    provides: 
        * Tamper;
    detection
        * Evidence;
    validation
        * Cryptographic;
    integrity
        * Audit;
    support
        * Regulatory;
    compliance
        * Independent;
    assurance;
    -- - ;
    Architectural;
    Principles;
    Verification;
    is: 
        * Deterministic
        * Repeatable
        * Immutable
        * Independent
        * Non - destructive;
    It;
    never;
    changes;
    the;
    original;
    execution;
    artifacts.
    ;
    -- - ;
    Complete;
    Example;
    See: ""(__makeTemplateObject(["text\nexamples/02_verify_receipt.ts\n"], ["text\nexamples/02_verify_receipt.ts\n"]))(__makeTemplateObject([""], [""]));
    for (the; complete; implementation.
    )
        -- - ;
    Relationship;
    to;
    Later;
    Examples;
    The;
    remaining;
    examples;
    build;
    on;
    verification.
        | Example | Additional;
    Capability |
        | --;
    --;
    -- -  | --;
    --;
    --;
    --;
    --;
    --;
    --;
    --;
    --;
    -- -  |
        | 3 | Deterministic;
    Replay |
        | 4 | Trust;
    Chain;
    Audit |
        | 5 | Human;
    Override |
        | 6 | Autonomous;
    Vehicle |
        | 7 | Medical;
    AI |
        | 8 | Financial;
    Governance |
        | 9 | Multi - Agent;
    Systems |
        | 10 | Custom;
    Policy |
        -- - ;
    Summary;
    In;
    this;
    example;
    you;
    learned: 
        * Why;
    verification;
    exists
        * How;
    to;
    verify;
    an;
    Execution;
    Trust;
    Record
        * The;
    role;
    of;
    the;
    Verification;
    artifact
        * The;
    importance;
    of;
    trust;
    hashes
        * How;
    Parmana;
    detects;
    tampering
        * Why;
    verification;
    is;
    independent;
    of;
    execution;
    Verification;
    transforms;
    execution;
    evidence;
    into;
    independently;
    provable;
    evidence;
    that;
    can;
    be;
    audited, replayed, and;
    trusted;
    across;
    organizational;
    boundaries.
    ;
    -- - ;
    Next;
    Continue;
    with ()
        : ""(__makeTemplateObject(["text\ndocs/03_replay_execution.md\n"], ["text\ndocs/03_replay_execution.md\n"]))(__makeTemplateObject([""], [""]));
    to;
    learn;
    how;
    Parmana;
    deterministically;
    reproduces;
    an;
    execution;
    the = __addDisposableResource(env_1, void 0, false), immutable = __addDisposableResource(env_1, void 0, false), Execution = __addDisposableResource(env_1, void 0, false), Trust = __addDisposableResource(env_1, void 0, false), Record = __addDisposableResource(env_1, void 0, false);
}
catch (e_1) {
    env_1.error = e_1;
    env_1.hasError = true;
}
finally {
    __disposeResources(env_1);
}
