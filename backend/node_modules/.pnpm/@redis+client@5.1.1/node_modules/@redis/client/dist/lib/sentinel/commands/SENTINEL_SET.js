"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    parseCommand(parser, dbname, options) {
        parser.push('SENTINEL', 'SET', dbname);
        for (const option of options) {
            parser.push(option.option, option.value);
        }
    },
    transformReply: undefined
};
//# sourceMappingURL=SENTINEL_SET.js.map