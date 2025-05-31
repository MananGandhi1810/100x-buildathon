import { CommandParser } from '../client/parser';
import { RedisArgument, ReplyUnion } from '../RESP/types';
import { XReadStreams } from './XREAD';
import { transformStreamsMessagesReplyResp2 } from './generic-transformers';
export interface XReadGroupOptions {
    COUNT?: number;
    BLOCK?: number;
    NOACK?: boolean;
}
declare const _default: {
    readonly IS_READ_ONLY: true;
    readonly parseCommand: (this: void, parser: CommandParser, group: RedisArgument, consumer: RedisArgument, streams: XReadStreams, options?: XReadGroupOptions) => void;
    readonly transformReply: {
        readonly 2: typeof transformStreamsMessagesReplyResp2;
        readonly 3: () => ReplyUnion;
    };
    readonly unstableResp3: true;
};
export default _default;
//# sourceMappingURL=XREADGROUP.d.ts.map