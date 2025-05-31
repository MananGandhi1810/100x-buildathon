import { CommandParser } from '../client/parser';
import { ArrayReply, BlobStringReply, NumberReply, UnwrapReply } from '../RESP/types';
import { RedisVariadicArgument } from './generic-transformers';
declare const _default: {
    readonly IS_READ_ONLY: true;
    readonly parseCommand: (this: void, parser: CommandParser, channels?: RedisVariadicArgument) => void;
    readonly transformReply: (this: void, reply: UnwrapReply<ArrayReply<BlobStringReply | NumberReply>>) => Record<string, NumberReply<number>>;
};
export default _default;
//# sourceMappingURL=PUBSUB_SHARDNUMSUB.d.ts.map