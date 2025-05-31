import { CommandParser } from '../client/parser';
import { BlobStringReply, NumberReply, ArrayReply, TuplesReply, UnwrapReply } from '../RESP/types';
type MasterRole = [
    role: BlobStringReply<'master'>,
    replicationOffest: NumberReply,
    replicas: ArrayReply<TuplesReply<[host: BlobStringReply, port: BlobStringReply, replicationOffest: BlobStringReply]>>
];
type SlaveRole = [
    role: BlobStringReply<'slave'>,
    masterHost: BlobStringReply,
    masterPort: NumberReply,
    state: BlobStringReply<'connect' | 'connecting' | 'sync' | 'connected'>,
    dataReceived: NumberReply
];
type SentinelRole = [
    role: BlobStringReply<'sentinel'>,
    masterNames: ArrayReply<BlobStringReply>
];
type Role = TuplesReply<MasterRole | SlaveRole | SentinelRole>;
declare const _default: {
    readonly NOT_KEYED_COMMAND: true;
    readonly IS_READ_ONLY: true;
    readonly parseCommand: (this: void, parser: CommandParser) => void;
    readonly transformReply: (this: void, reply: UnwrapReply<Role>) => {
        role: BlobStringReply<"master">;
        replicationOffest: NumberReply<number>;
        replicas: {
            host: BlobStringReply<string>;
            port: number;
            replicationOffest: number;
        }[];
        master?: undefined;
        state?: undefined;
        dataReceived?: undefined;
        masterNames?: undefined;
    } | {
        role: BlobStringReply<"slave">;
        master: {
            host: BlobStringReply<string>;
            port: NumberReply<number>;
        };
        state: BlobStringReply<"connect" | "connecting" | "sync" | "connected">;
        dataReceived: NumberReply<number>;
        replicationOffest?: undefined;
        replicas?: undefined;
        masterNames?: undefined;
    } | {
        role: BlobStringReply<"sentinel">;
        masterNames: ArrayReply<BlobStringReply<string>>;
        replicationOffest?: undefined;
        replicas?: undefined;
        master?: undefined;
        state?: undefined;
        dataReceived?: undefined;
    } | undefined;
};
export default _default;
//# sourceMappingURL=ROLE.d.ts.map