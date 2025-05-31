"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    IS_READ_ONLY: false,
    parseCommand(parser, key, strategy, threshold, options) {
        parser.push('XTRIM');
        parser.pushKey(key);
        parser.push(strategy);
        if (options?.strategyModifier) {
            parser.push(options.strategyModifier);
        }
        parser.push(threshold.toString());
        if (options?.LIMIT) {
            parser.push('LIMIT', options.LIMIT.toString());
        }
    },
    transformReply: undefined
};
//# sourceMappingURL=XTRIM.js.map