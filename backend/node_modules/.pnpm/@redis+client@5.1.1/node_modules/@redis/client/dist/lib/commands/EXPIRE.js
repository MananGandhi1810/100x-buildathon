"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    IS_READ_ONLY: true,
    parseCommand(parser, key, seconds, mode) {
        parser.push('EXPIRE');
        parser.pushKey(key);
        parser.push(seconds.toString());
        if (mode) {
            parser.push(mode);
        }
    },
    transformReply: undefined
};
//# sourceMappingURL=EXPIRE.js.map