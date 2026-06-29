"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecutionMode = exports.ExecutionStatus = void 0;
/**
 * Canonical execution lifecycle.
 */
var ExecutionStatus;
(function (ExecutionStatus) {
    ExecutionStatus["PROCESSING"] = "PROCESSING";
    ExecutionStatus["COMPLETED"] = "COMPLETED";
    ExecutionStatus["FAILED"] = "FAILED";
})(ExecutionStatus || (exports.ExecutionStatus = ExecutionStatus = {}));
/**
 * Execution mode.
 */
var ExecutionMode;
(function (ExecutionMode) {
    ExecutionMode["SYNC"] = "SYNC";
    ExecutionMode["ASYNC"] = "ASYNC";
})(ExecutionMode || (exports.ExecutionMode = ExecutionMode = {}));
