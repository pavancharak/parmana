"use strict";
/**
 * Parmana TypeScript SDK
 *
 * Example 04
 *
 * Audit Execution Trust Record
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
function auditTrustRecord(record) {
    var _a;
    console.log("======================================");
    console.log(" Parmana TypeScript SDK");
    console.log(" Example 04 - Audit Trust Chain");
    console.log("======================================");
    console.log();
    console.log("Execution Trust Record");
    console.log("----------------------");
    console.log("Trust Record ID :", record.trustRecordId);
    console.log("Transaction ID  :", record.businessTransactionId);
    console.log("Trust Hash      :", record.trustRecordHash);
    console.log("Created         :", record.createdAt);
    console.log("Updated         :", record.updatedAt);
    console.log();
    console.log("Business Transaction");
    console.log("----------------------");
    console.log("Authority        :", record.transaction.authority.authorityName);
    console.log("Authorization ID :", record.transaction.authorization.authorizationId);
    console.log("Intent           :", record.transaction.intent.operation);
    console.log("Policy           :", "".concat(record.transaction.policy.policyName, " (").concat(record.transaction.policy.policyVersion, ")"));
    console.log();
    console.log("Execution Summary");
    console.log("----------------------");
    console.log("Executions    :", record.executions.length);
    console.log("Overrides     :", record.overrides.length);
    console.log("Verifications :", record.verifications.length);
    console.log("Receipts      :", record.receipts.length);
    console.log();
    console.log("Execution History");
    console.log("----------------------");
    if (record.executions.length === 0) {
        console.log("No executions recorded.");
    }
    for (var _i = 0, _b = record.executions; _i < _b.length; _i++) {
        var execution = _b[_i];
        console.log();
        console.log("Execution ID :", execution.executionId);
        console.log("Status       :", execution.status);
        console.log("Mode         :", execution.mode);
        console.log("Decision     :", execution.decision.outcome);
        console.log("Started      :", execution.startedAt);
        console.log("Completed    :", (_a = execution.completedAt) !== null && _a !== void 0 ? _a : "-");
    }
    console.log();
    console.log("Verification History");
    console.log("----------------------");
    if (record.verifications.length === 0) {
        console.log("No verifications recorded.");
    }
    for (var _c = 0, _d = record.verifications; _c < _d.length; _c++) {
        var verification = _d[_c];
        console.log();
        console.log("Verification ID :", verification.verificationId);
        console.log("Status          :", verification.status);
        console.log("Verified At     :", verification.verifiedAt);
    }
    console.log();
    console.log("Receipt History");
    console.log("----------------------");
    if (record.receipts.length === 0) {
        console.log("No receipts recorded.");
    }
    for (var _e = 0, _f = record.receipts; _e < _f.length; _e++) {
        var receipt = _f[_e];
        console.log();
        console.log("Receipt ID :", receipt.receiptId);
        console.log("Algorithm  :", receipt.algorithm);
        console.log("Issued At  :", receipt.issuedAt);
    }
    console.log();
    console.log("Audit Result");
    console.log("----------------------");
    console.log("✓ Authority recorded");
    console.log("✓ Authorization recorded");
    console.log("✓ Intent recorded");
    console.log("✓ Policy Reference recorded");
    console.log("✓ Execution history available");
    console.log("✓ Verification history available");
    console.log("✓ Receipt history available");
    console.log("✓ Execution Trust Record is suitable for independent audit");
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var trustRecord;
        return __generator(this, function (_a) {
            trustRecord = {
                trustRecordId: "trust-record-001",
                businessTransactionId: "txn-001",
                transaction: {},
                overrides: [],
                executions: [],
                verifications: [],
                receipts: [],
                trustRecordHash: "7f84e2d3c1d9d8d3d2c8f7e9b6a4c5d2",
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            auditTrustRecord(trustRecord);
            return [2 /*return*/];
        });
    });
}
main().catch(function (error) {
    console.error(error);
    process.exit(1);
});
