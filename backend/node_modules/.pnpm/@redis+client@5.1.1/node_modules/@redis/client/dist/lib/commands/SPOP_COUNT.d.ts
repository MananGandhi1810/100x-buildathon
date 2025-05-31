import { CommandParser } from '../client/parser';
import { RedisArgument, BlobStringReply, NullReply } from '../RESP/types';
declare const _default: {
    readonly IS_READ_ONLY: false;
    readonly parseCommand: (this: void, parser: CommandParser, key: RedisArgument, count: number) => void;
    readonly transformReply: () => BlobStringReply | NullReply;
};
export default _default;
//# sourceMappingURL=SPOP_COUNT.d.ts.map