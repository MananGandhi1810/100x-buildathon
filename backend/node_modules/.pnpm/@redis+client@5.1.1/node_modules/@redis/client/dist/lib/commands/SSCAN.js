"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SCAN_1 = require("./SCAN");
exports.default = {
    IS_READ_ONLY: true,
    parseCommand(parser, key, cursor, options) {
        parser.push('SSCAN');
        parser.pushKey(key);
        (0, SCAN_1.parseScanArguments)(parser, cursor, options);
    },
    transformReply([cursor, members]) {
        return {
            cursor,
            members
        };
    }
};
//# sourceMappingURL=SSCAN.js.map