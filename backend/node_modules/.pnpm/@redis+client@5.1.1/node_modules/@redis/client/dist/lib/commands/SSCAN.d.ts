import { CommandParser } from '../client/parser';
import { RedisArgument, BlobStringReply } from '../RESP/types';
import { ScanCommonOptions } from './SCAN';
declare const _default: {
    readonly IS_READ_ONLY: true;
    readonly parseCommand: (this: void, parser: CommandParser, key: RedisArgument, cursor: RedisArgument, options?: ScanCommonOptions) => void;
    readonly transformReply: (this: void, [cursor, members]: [BlobStringReply, Array<BlobStringReply>]) => {
        cursor: BlobStringReply<string>;
        members: BlobStringReply<string>[];
    };
};
export default _default;
//# sourceMappingURL=SSCAN.d.ts.map