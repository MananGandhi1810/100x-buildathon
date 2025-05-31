import { CommandParser } from '../client/parser';
import { RedisArgument, ArrayReply, BlobStringReply } from '../RESP/types';
export interface SortOptions {
    BY?: RedisArgument;
    LIMIT?: {
        offset: number;
        count: number;
    };
    GET?: RedisArgument | Array<RedisArgument>;
    DIRECTION?: 'ASC' | 'DESC';
    ALPHA?: boolean;
}
export declare function parseSortArguments(parser: CommandParser, key: RedisArgument, options?: SortOptions): void;
declare const _default: {
    readonly IS_READ_ONLY: true;
    readonly parseCommand: (this: void, parser: CommandParser, key: RedisArgument, options?: SortOptions) => void;
    readonly transformReply: () => ArrayReply<BlobStringReply>;
};
export default _default;
//# sourceMappingURL=SORT.d.ts.map