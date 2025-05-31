import { CommandParser } from '../client/parser';
import { RedisArgument, NumberReply } from '../RESP/types';
import { ZKeys } from './generic-transformers';
export interface ZUnionOptions {
    AGGREGATE?: 'SUM' | 'MIN' | 'MAX';
}
declare const _default: {
    readonly IS_READ_ONLY: false;
    readonly parseCommand: (this: void, parser: CommandParser, destination: RedisArgument, keys: ZKeys, options?: ZUnionOptions) => any;
    readonly transformReply: () => NumberReply;
};
export default _default;
//# sourceMappingURL=ZUNIONSTORE.d.ts.map