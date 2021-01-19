import {ApiClient} from "twitch";
import {ClientCredentialsAuthProvider} from "twitch-auth";
import {ApiTeam, Team} from "../types/team";
import {CustomStreamer, isSimpleStreamer} from "../types/streamer";
import {FetchDataResponse} from "../types/response";
import cacheData from "memory-cache";

const RUST_GAME_ID = 263490

const {TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET, BATTLE_METRICS_TOKEN} = process.env

const BATTLE_METRICS_ENDPOINT = "https://api.battlemetrics.com/servers/9697587" +
    "?include=player&fields%5Bserver%5D=&relations%5Bserver%5D=&fields%5Bplayer%5D=name&relations%5Bplayer%5D="

const twitchClient = new ApiClient({
    authProvider: new ClientCredentialsAuthProvider(TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET)
})

async function getOnlinePlayers() {
    const data = await fetch(
        BATTLE_METRICS_ENDPOINT,
        {headers: {Authorization: `Bearer ${BATTLE_METRICS_TOKEN}`}}
    ).then(response => response.json())

    return new Set(data.included.map(player => player.attributes.name))
}

async function getActiveStreamsAndTotalViewers(channelNames) {
    const rustStreamsIterator = await twitchClient.helix.streams.getStreamsPaginated({
        userName: channelNames,
        game: RUST_GAME_ID.toString()
    })

    const rustStreams = []
    for await (const stream of rustStreamsIterator) {
        rustStreams.push(stream)
    }

    return {
        streams: new Set(channelNames.filter(name => rustStreams.some(stream => stream.userDisplayName === name))),
        totalViewers: rustStreams.reduce((total, stream) => total + stream.viewers, 0)
    }
}

async function getTeams(): Promise<Team[]> {
    const res = await fetch('https://cdn.jsdelivr.net/gh/moritzruth/rustplatz/teams.json')
    const teams: ApiTeam[] = await res.json();

    return teams.map((team) => {
        team.members = team.members.map((member): CustomStreamer => {
            if (isSimpleStreamer(member)) {
                return {
                    twitch: member,
                    game: member,
                    displayed: member
                };
            }
            return member;
        });

        return team as Team;
    });
}

export async function fetchLiveData(): Promise<FetchDataResponse> {
    const onlinePlayers = await getOnlinePlayers();
    const rawTeams = await getTeams();

    const onlineStreams = rawTeams
        .flatMap(team => team.members)
        .filter(member => onlinePlayers.has(member.game))
        .map(member => member.twitch)

    if (onlineStreams.length === 0) return {
        teams: rawTeams.map(team => ({name: team.name, online: [], offline: team.members})),
        totalViewers: 0
    }

    const {streams, totalViewers} = await getActiveStreamsAndTotalViewers(onlineStreams)

    const teams = []
    for (const team of rawTeams) {
        const onlineMembers = team.members.filter(member => streams.has(member.twitch))

        teams.push({
            name: team.name,
            online: onlineMembers,
            offline: team.members.filter(member => !onlineMembers.includes(member))
        })
    }

    return {
        teams,
        totalViewers
    }
}

export async function fetchData() {
    const key = 'FetchDataResponse';
    const value = cacheData.get(key);
    if (value) {
        return value;
    }

    const data = await fetchLiveData();
    cacheData.put(key, data, 60 * 1000);
    return data;
}

