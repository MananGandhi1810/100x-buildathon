"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    IS_READ_ONLY: false,
    parseCommand(parser, key, group, consumer) {
        parser.push('XGROUP', 'DELCONSUMER');
        parser.pushKey(key);
        parser.push(group, consumer);
    },
    transformReply: undefined
};
//# sourceMappingURL=XGROUP_DELCONSUMER.js.map