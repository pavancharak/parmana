"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessTransactionStatus = void 0;
/**
 * Business Transaction lifecycle.
 */
var BusinessTransactionStatus;
(function (BusinessTransactionStatus) {
    BusinessTransactionStatus["RECEIVED"] = "RECEIVED";
    BusinessTransactionStatus["POLICY_EVALUATED"] = "POLICY_EVALUATED";
    BusinessTransactionStatus["APPROVED"] = "APPROVED";
    BusinessTransactionStatus["REJECTED"] = "REJECTED";
    BusinessTransactionStatus["OVERRIDDEN"] = "OVERRIDDEN";
    BusinessTransactionStatus["EXECUTING"] = "EXECUTING";
    BusinessTransactionStatus["EXECUTED"] = "EXECUTED";
    BusinessTransactionStatus["FAILED"] = "FAILED";
    BusinessTransactionStatus["VERIFIED"] = "VERIFIED";
})(BusinessTransactionStatus || (exports.BusinessTransactionStatus = BusinessTransactionStatus = {}));
