import { CommandParser } from '../client/parser';
import { RedisArgument, CommandArguments, BlobStringReply, ArrayReply } from '../RESP/types';
export interface ScanCommonOptions {
    MATCH?: string;
    COUNT?: number;
}
export declare function parseScanArguments(parser: CommandParser, cursor: RedisArgument, options?: ScanOptions): void;
export declare function pushScanArguments(args: CommandArguments, cursor: RedisArgument, options?: ScanOptions): CommandArguments;
export interface ScanOptions extends ScanCommonOptions {
    TYPE?: RedisArgument;
}
declare const _default: {
    readonly NOT_KEYED_COMMAND: true;
    readonly IS_READ_ONLY: true;
    readonly parseCommand: (this: void, parser: CommandParser, cursor: RedisArgument, options?: ScanOptions) => void;
    readonly transformReply: (this: void, [cursor, keys]: [BlobStringReply, ArrayReply<BlobStringReply>]) => {
        cursor: BlobStringReply<string>;
        keys: ArrayReply<BlobStringReply<string>>;
    };
};
export default _default;
//# sourceMappingURL=SCAN.d.ts.map