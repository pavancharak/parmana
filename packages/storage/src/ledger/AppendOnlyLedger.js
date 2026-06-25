"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppendOnlyLedger = void 0;
var StorageError_js_1 = require("../errors/StorageError.js");
var LedgerSerializer_js_1 = require("./LedgerSerializer.js");
/**
 * Immutable append-only ledger.
 *
 * This is the core of Parmana Storage.
 * No updates. Only append.
 */
var AppendOnlyLedger = /** @class */ (function () {
    function AppendOnlyLedger() {
        this.entries = [];
        this.serializer = new LedgerSerializer_js_1.LedgerSerializer();
    }
    AppendOnlyLedger.prototype.append = function (entry) {
        if (!entry) {
            throw new StorageError_js_1.StorageError("Ledger entry cannot be null.");
        }
        this.entries.push(Object.freeze(__assign({}, entry)));
    };
    AppendOnlyLedger.prototype.all = function () {
        return this.entries;
    };
    AppendOnlyLedger.prototype.size = function () {
        return this.entries.length;
    };
    AppendOnlyLedger.prototype.last = function () {
        return this.entries.length === 0
            ? null
            : this.entries[this.entries.length - 1];
    };
    AppendOnlyLedger.prototype.verifyIntegrity = function () {
        try {
            for (var _i = 0, _a = this.entries; _i < _a.length; _i++) {
                var entry = _a[_i];
                this.serializer.hash(entry);
            }
            return true;
        }
        catch (_b) {
            return false;
        }
    };
    return AppendOnlyLedger;
}());
exports.AppendOnlyLedger = AppendOnlyLedger;
