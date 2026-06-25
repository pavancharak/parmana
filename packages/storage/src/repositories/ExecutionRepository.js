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
exports.ExecutionRepository = void 0;
/**
 * Stores execution records in the Storage layer.
 */
var ExecutionRepository = /** @class */ (function () {
    function ExecutionRepository() {
        this.entries = [];
    }
    ExecutionRepository.prototype.save = function (entry) {
        this.entries.push(Object.freeze(__assign({}, entry)));
    };
    ExecutionRepository.prototype.findAll = function () {
        return this.entries;
    };
    ExecutionRepository.prototype.last = function () {
        return this.entries.length === 0
            ? null
            : this.entries[this.entries.length - 1];
    };
    return ExecutionRepository;
}());
exports.ExecutionRepository = ExecutionRepository;
