"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    parseCommand(parser, dbname, host, port, quorum) {
        parser.push('SENTINEL', 'MONITOR', dbname, host, port, quorum);
    },
    transformReply: undefined
};
//# sourceMappingURL=SENTINEL_MONITOR.js.map