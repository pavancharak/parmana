"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageBuilder = void 0;
var StorageEngine_js_1 = require("./StorageEngine.js");
/**
 * Builder for StorageEngine.
 *
 * Provides a clean construction API for storage subsystem.
 */
var StorageBuilder = /** @class */ (function () {
    function StorageBuilder() {
    }
    /**
     * Builds a fully configured StorageEngine.
     */
    StorageBuilder.prototype.build = function () {
        return new StorageEngine_js_1.StorageEngine();
    };
    return StorageBuilder;
}());
exports.StorageBuilder = StorageBuilder;
