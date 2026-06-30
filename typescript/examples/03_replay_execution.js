"use strict";
/**
 * Parmana TypeScript SDK
 *
 * Example 03
 *
 * Replay Execution
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
        var client, trustRecord, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    client = new index_js_1.ParmanaClient({
                        endpoint: "http://localhost:8080",
                    });
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
                    console.log();
                    console.log("======================================");
                    console.log(" Parmana TypeScript SDK");
                    console.log(" Example 03 - Replay Execution");
                    console.log("======================================");
                    console.log();
                    console.log("Execution Trust Record");
                    console.log("----------------------");
                    console.log("Trust Record ID :", trustRecord.trustRecordId);
                    console.log("Transaction ID  :", trustRecord.businessTransactionId);
                    console.log("Trust Hash      :", trustRecord.trustRecordHash);
                    console.log();
                    console.log("Starting deterministic replay...");
                    console.log();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client.replay(trustRecord)];
                case 2:
                    _a.sent();
                    console.log("Replay completed successfully.");
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.log();
                    console.error("Replay service not available (expected during SDK development).");
                    if (error_1 instanceof Error) {
                        console.error(error_1.message);
                    }
                    return [3 /*break*/, 4];
                case 4:
                    console.log();
                    console.log("Replay demonstrates that:");
                    console.log("• The original Business Transaction can be reconstructed.");
                    console.log("• The same PolicyReference is used.");
                    console.log("• The same runtime signals are evaluated.");
                    console.log("• The same Decision is reproduced.");
                    console.log("• The execution remains independently verifiable.");
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
