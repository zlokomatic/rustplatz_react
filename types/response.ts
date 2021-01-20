import {SortedTeam} from "./team";

export type FetchDataResponse = {
    teams: SortedTeam[],
    totalViewers: number,
    serverStatus: 'online' | 'offline'
}
