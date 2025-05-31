import { CommandParser } from '../../client/parser';
import { RedisArgument, SimpleStringReply } from '../../RESP/types';
export type SentinelSetOptions = Array<{
    option: RedisArgument;
    value: RedisArgument;
}>;
declare const _default: {
    readonly parseCommand: (this: void, parser: CommandParser, dbname: RedisArgument, options: SentinelSetOptions) => void;
    readonly transformReply: () => SimpleStringReply<'OK'>;
};
export default _default;
//# sourceMappingURL=SENTINEL_SET.d.ts.map