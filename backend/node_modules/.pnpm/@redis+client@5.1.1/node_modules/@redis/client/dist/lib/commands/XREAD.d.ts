import { CommandParser } from '../client/parser';
import { RedisArgument, ReplyUnion } from '../RESP/types';
import { transformStreamsMessagesReplyResp2 } from './generic-transformers';
export interface XReadStream {
    key: RedisArgument;
    id: RedisArgument;
}
export type XReadStreams = Array<XReadStream> | XReadStream;
export declare function pushXReadStreams(parser: CommandParser, streams: XReadStreams): void;
export interface XReadOptions {
    COUNT?: number;
    BLOCK?: number;
}
declare const _default: {
    readonly IS_READ_ONLY: true;
    readonly parseCommand: (this: void, parser: CommandParser, streams: XReadStreams, options?: XReadOptions) => void;
    readonly transformReply: {
        readonly 2: typeof transformStreamsMessagesReplyResp2;
        readonly 3: () => ReplyUnion;
    };
    readonly unstableResp3: true;
};
export default _default;
//# sourceMappingURL=XREAD.d.ts.map