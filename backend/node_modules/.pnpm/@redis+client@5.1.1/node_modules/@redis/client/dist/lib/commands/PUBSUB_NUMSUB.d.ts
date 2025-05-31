import { CommandParser } from '../client/parser';
import { ArrayReply, BlobStringReply, NumberReply, UnwrapReply } from '../RESP/types';
import { RedisVariadicArgument } from './generic-transformers';
declare const _default: {
    readonly NOT_KEYED_COMMAND: true;
    readonly IS_READ_ONLY: true;
    readonly parseCommand: (this: void, parser: CommandParser, channels?: RedisVariadicArgument) => void;
    readonly transformReply: (this: void, rawReply: UnwrapReply<ArrayReply<BlobStringReply | NumberReply>>) => Record<string, NumberReply<number>>;
};
export default _default;
//# sourceMappingURL=PUBSUB_NUMSUB.d.ts.map