import {ApiStreamer, Streamer} from "./streamer";

export type Team = {
    name: string;
    members: Streamer[];
};

export type ApiTeam = {
    name: string;
    members: ApiStreamer[];
};

export type SortedTeam = {
    name: string,
    online: Streamer[],
    offline: Streamer[]
}
