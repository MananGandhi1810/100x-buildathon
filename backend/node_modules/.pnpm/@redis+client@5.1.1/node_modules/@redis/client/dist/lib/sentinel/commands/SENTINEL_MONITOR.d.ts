import { CommandParser } from '../../client/parser';
import { RedisArgument, SimpleStringReply } from '../../RESP/types';
declare const _default: {
    readonly parseCommand: (this: void, parser: CommandParser, dbname: RedisArgument, host: RedisArgument, port: RedisArgument, quorum: RedisArgument) => void;
    readonly transformReply: () => SimpleStringReply<'OK'>;
};
export default _default;
//# sourceMappingURL=SENTINEL_MONITOR.d.ts.map