import { CommandParser } from '../client/parser';
import { NumberReply, RedisArgument } from '../RESP/types';
export interface XTrimOptions {
    strategyModifier?: '=' | '~';
    /** added in 6.2 */
    LIMIT?: number;
}
declare const _default: {
    readonly IS_READ_ONLY: false;
    readonly parseCommand: (this: void, parser: CommandParser, key: RedisArgument, strategy: 'MAXLEN' | 'MINID', threshold: number, options?: XTrimOptions) => void;
    readonly transformReply: () => NumberReply;
};
export default _default;
//# sourceMappingURL=XTRIM.d.ts.map