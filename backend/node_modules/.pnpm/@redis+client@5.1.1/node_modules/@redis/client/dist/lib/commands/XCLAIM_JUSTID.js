"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const XCLAIM_1 = __importDefault(require("./XCLAIM"));
exports.default = {
    IS_READ_ONLY: XCLAIM_1.default.IS_READ_ONLY,
    parseCommand(...args) {
        const parser = args[0];
        XCLAIM_1.default.parseCommand(...args);
        parser.push('JUSTID');
    },
    transformReply: undefined
};
//# sourceMappingURL=XCLAIM_JUSTID.js.map