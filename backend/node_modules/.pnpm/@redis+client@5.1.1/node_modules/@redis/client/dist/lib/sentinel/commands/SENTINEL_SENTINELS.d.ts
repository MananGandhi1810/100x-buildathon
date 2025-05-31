import { CommandParser } from '../../client/parser';
import { RedisArgument, ArrayReply, MapReply, BlobStringReply, TypeMapping } from '../../RESP/types';
declare const _default: {
    readonly parseCommand: (this: void, parser: CommandParser, dbname: RedisArgument) => void;
    readonly transformReply: {
        readonly 2: (reply: ArrayReply<ArrayReply<BlobStringReply>>, preserve?: any, typeMapping?: TypeMapping) => MapReply<BlobStringReply<string>, BlobStringReply<string>>[];
        readonly 3: () => ArrayReply<MapReply<BlobStringReply, BlobStringReply>>;
    };
};
export default _default;
//# sourceMappingURL=SENTINEL_SENTINELS.d.ts.map