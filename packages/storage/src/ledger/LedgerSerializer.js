"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LedgerSerializer = void 0;
var node_crypto_1 = require("node:crypto");
/**
 * Deterministic serialization for ledger entries.
 */
var LedgerSerializer = /** @class */ (function () {
    function LedgerSerializer() {
    }
    LedgerSerializer.prototype.serialize = function (entry) {
        return JSON.stringify(entry, Object.keys(entry).sort());
    };
    LedgerSerializer.prototype.hash = function (entry) {
        var serialized = this.serialize(entry);
        return (0, node_crypto_1.createHash)("sha256")
            .update(serialized)
            .digest("hex");
    };
    return LedgerSerializer;
}());
exports.LedgerSerializer = LedgerSerializer;
