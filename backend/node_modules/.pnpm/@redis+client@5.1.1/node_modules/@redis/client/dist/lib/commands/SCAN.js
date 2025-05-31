"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pushScanArguments = exports.parseScanArguments = void 0;
function parseScanArguments(parser, cursor, options) {
    parser.push(cursor);
    if (options?.MATCH) {
        parser.push('MATCH', options.MATCH);
    }
    if (options?.COUNT) {
        parser.push('COUNT', options.COUNT.toString());
    }
}
exports.parseScanArguments = parseScanArguments;
function pushScanArguments(args, cursor, options) {
    args.push(cursor.toString());
    if (options?.MATCH) {
        args.push('MATCH', options.MATCH);
    }
    if (options?.COUNT) {
        args.push('COUNT', options.COUNT.toString());
    }
    return args;
}
exports.pushScanArguments = pushScanArguments;
exports.default = {
    NOT_KEYED_COMMAND: true,
    IS_READ_ONLY: true,
    parseCommand(parser, cursor, options) {
        parser.push('SCAN');
        parseScanArguments(parser, cursor, options);
        if (options?.TYPE) {
            parser.push('TYPE', options.TYPE);
        }
    },
    transformReply([cursor, keys]) {
        return {
            cursor,
            keys
        };
    }
};
//# sourceMappingURL=SCAN.js.map