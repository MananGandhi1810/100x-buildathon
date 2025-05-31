"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generic_transformers_1 = require("../../commands/generic-transformers");
exports.default = {
    parseCommand(parser, dbname) {
        parser.push('SENTINEL', 'MASTER', dbname);
    },
    transformReply: {
        2: (generic_transformers_1.transformTuplesReply),
        3: undefined
    }
};
//# sourceMappingURL=SENTINEL_MASTER.js.map