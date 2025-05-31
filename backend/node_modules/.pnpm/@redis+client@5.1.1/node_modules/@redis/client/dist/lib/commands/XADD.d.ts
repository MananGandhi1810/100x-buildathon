import { CommandParser } from '../client/parser';
import { RedisArgument, BlobStringReply } from '../RESP/types';
export interface XAddOptions {
    TRIM?: {
        strategy?: 'MAXLEN' | 'MINID';
        strategyModifier?: '=' | '~';
        threshold: number;
        limit?: number;
    };
}
export declare function parseXAddArguments(optional: RedisArgument | undefined, parser: CommandParser, key: RedisArgument, id: RedisArgument, message: Record<string, RedisArgument>, options?: XAddOptions): void;
declare const _default: {
    readonly IS_READ_ONLY: false;
    readonly parseCommand: (this: void, parser: CommandParser, key: RedisArgument, id: RedisArgument, message: Record<string, RedisArgument>, options?: XAddOptions | undefined) => void;
    readonly transformReply: () => BlobStringReply;
};
export default _default;
//# sourceMappingURL=XADD.d.ts.map