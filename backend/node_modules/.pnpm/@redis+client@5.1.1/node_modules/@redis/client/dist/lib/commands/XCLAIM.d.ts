import { CommandParser } from '../client/parser';
import { RedisArgument, ArrayReply, NullReply, UnwrapReply, TypeMapping } from '../RESP/types';
import { RedisVariadicArgument, StreamMessageRawReply } from './generic-transformers';
export interface XClaimOptions {
    IDLE?: number;
    TIME?: number | Date;
    RETRYCOUNT?: number;
    FORCE?: boolean;
    LASTID?: RedisArgument;
}
declare const _default: {
    readonly IS_READ_ONLY: false;
    readonly parseCommand: (this: void, parser: CommandParser, key: RedisArgument, group: RedisArgument, consumer: RedisArgument, minIdleTime: number, id: RedisVariadicArgument, options?: XClaimOptions) => void;
    readonly transformReply: (this: void, reply: UnwrapReply<ArrayReply<StreamMessageRawReply | NullReply>>, preserve?: any, typeMapping?: TypeMapping) => (NullReply | import("./generic-transformers").StreamMessageReply)[];
};
export default _default;
//# sourceMappingURL=XCLAIM.d.ts.map