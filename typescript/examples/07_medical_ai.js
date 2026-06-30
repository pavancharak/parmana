"use strict";
/**
 * Parmana TypeScript SDK
 *
 * Example 07
 *
 * Medical AI
 *
 * Demonstrates how Parmana governs AI-assisted
 * clinical decision execution while preserving
 * an immutable execution trust chain.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var index_js_1 = require("../src/index.js");
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var client, authority, authorization, intent, policy, transaction, execution, trustRecord, receipt, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    client = new index_js_1.ParmanaClient({
                        endpoint: "http://localhost:8080",
                    });
                    authority = {
                        authorityId: "hospital-001",
                        authorityName: "City General Hospital",
                        createdAt: new Date(),
                    };
                    authorization = {
                        authorizationId: "authorization-001",
                        authorityId: authority.authorityId,
                        subject: "clinical-ai-assistant",
                        permissions: [
                            "CLINICAL_DECISION_SUPPORT",
                        ],
                        issuedAt: new Date(),
                        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
                    };
                    intent = {
                        intentId: "intent-001",
                        authorizationId: authorization.authorizationId,
                        operation: "ASSESS_PATIENT",
                        target: "patient-100234",
                        createdAt: new Date(),
                    };
                    policy = {
                        policyName: "clinical-decision-policy",
                        policyVersion: "1.0.0",
                    };
                    transaction = {
                        businessTransactionId: "medical-txn-001",
                        authority: authority,
                        authorization: authorization,
                        intent: intent,
                        policy: policy,
                        createdAt: new Date(),
                    };
                    execution = {
                        executionId: "execution-001",
                        businessTransactionId: transaction.businessTransactionId,
                        decision: {
                            decisionId: "decision-001",
                            intentId: intent.intentId,
                            policy: policy,
                            signals: {
                                patientAge: 64,
                                bloodPressure: "145/90",
                                heartRate: 96,
                                oxygenSaturation: 98,
                                allergyCheck: "CLEAR",
                                physicianAvailable: true,
                            },
                            outcome: index_js_1.DecisionOutcome.APPROVED,
                            reason: "Clinical policy satisfied. AI recommendation may be presented to physician.",
                            evaluatedAt: new Date(),
                        },
                        status: index_js_1.ExecutionStatus.COMPLETED,
                        mode: index_js_1.ExecutionMode.SYNC,
                        startedAt: new Date(),
                        completedAt: new Date(),
                        evidence: {
                            diagnosisSuggestion: "Community Acquired Pneumonia",
                            confidence: 0.94,
                            physicianReviewRequired: true,
                            physicianApproved: true,
                        },
                    };
                    trustRecord = {
                        trustRecordId: "trust-record-medical-001",
                        businessTransactionId: transaction.businessTransactionId,
                        transaction: transaction,
                        overrides: [],
                        executions: [
                            execution,
                        ],
                        verifications: [],
                        receipts: [],
                        trustRecordHash: "d71f2dcb4d3044bb94752c13abfe8129",
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    };
                    console.log();
                    console.log("======================================");
                    console.log(" Parmana TypeScript SDK");
                    console.log(" Example 07 - Medical AI");
                    console.log("======================================");
                    console.log();
                    console.log("Clinical Case");
                    console.log("------------------------------");
                    console.log("Hospital     :", authority.authorityName);
                    console.log("Patient      :", intent.target);
                    console.log("Operation    :", intent.operation);
                    console.log();
                    console.log("Policy");
                    console.log("------------------------------");
                    console.log("Policy       :", policy.policyName);
                    console.log("Version      :", policy.policyVersion);
                    console.log();
                    console.log("Decision");
                    console.log("------------------------------");
                    console.log("Outcome      :", execution.decision.outcome);
                    console.log("Reason       :", execution.decision.reason);
                    console.log();
                    console.log("Clinical Signals");
                    console.log("------------------------------");
                    console.log(execution.decision.signals);
                    console.log();
                    console.log("Execution Evidence");
                    console.log("------------------------------");
                    console.log(execution.evidence);
                    console.log();
                    console.log("Execution Trust Record");
                    console.log("------------------------------");
                    console.log("Trust Record :", trustRecord.trustRecordId);
                    console.log("Hash         :", trustRecord.trustRecordHash);
                    console.log();
                    console.log("Submitting transaction to Parmana Runtime...");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client.execute(transaction)];
                case 2:
                    receipt = _a.sent();
                    console.log();
                    console.log("Receipt");
                    console.log("------------------------------");
                    console.log("Receipt ID   :", receipt.receiptId);
                    console.log("Algorithm    :", receipt.algorithm);
                    console.log("Issued At    :", receipt.issuedAt);
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.log();
                    console.log("Runtime not available (expected during SDK development).");
                    if (error_1 instanceof Error) {
                        console.log(error_1.message);
                    }
                    return [3 /*break*/, 4];
                case 4:
                    console.log();
                    console.log("Execution Trust Chain");
                    console.log("------------------------------");
                    console.log("✓ Hospital Authority");
                    console.log("✓ Clinical Authorization");
                    console.log("✓ Medical Intent");
                    console.log("✓ Policy Reference");
                    console.log("✓ Clinical Signals");
                    console.log("✓ Policy Decision");
                    console.log("✓ AI Recommendation");
                    console.log("✓ Execution Evidence");
                    console.log("✓ Execution Trust Record");
                    console.log();
                    console.log("Parmana does not diagnose patients.");
                    console.log("It governs the execution of AI-assisted");
                    console.log("clinical workflows so every authorization,");
                    console.log("policy evaluation, execution, and outcome");
                    console.log("remain independently verifiable.");
                    console.log();
                    console.log("Example completed.");
                    return [2 /*return*/];
            }
        });
    });
}
main().catch(function (error) {
    console.error(error);
    process.exit(1);
});
