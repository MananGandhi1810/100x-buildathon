"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    IS_READ_ONLY: false,
    parseCommand(parser, key, group, consumer) {
        parser.push('XGROUP', 'CREATECONSUMER');
        parser.pushKey(key);
        parser.push(group, consumer);
    },
    transformReply: undefined
};
//# sourceMappingURL=XGROUP_CREATECONSUMER.js.map