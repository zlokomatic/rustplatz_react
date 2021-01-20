import {ApiClient, HelixClip} from "twitch";
import {ClientCredentialsAuthProvider} from "twitch-auth";
import {ApiTeam, Team} from "../types/team";
import {CustomStreamer, isSimpleStreamer} from "../types/streamer";
import {FetchDataResponse} from "../types/response";
import cacheData from "memory-cache";
import dayjs from 'dayjs'
import {Clip} from "../types/clip";

const RUST_GAME_ID = 263490

const {TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET, BATTLE_METRICS_TOKEN} = process.env

const BATTLE_METRICS_ENDPOINT = "https://api.battlemetrics.com/servers/9697587" +
    "?include=player&fields%5Bserver%5D=status&relations%5Bserver%5D=&fields%5Bplayer%5D=name&relations%5Bplayer%5D="

const twitchClient = new ApiClient({
    authProvider: new ClientCredentialsAuthProvider(TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET)
})

let twitchUserIds = {};

async function getRustData() {
    const resp = await fetch(
        BATTLE_METRICS_ENDPOINT,
        {headers: {Authorization: `Bearer ${BATTLE_METRICS_TOKEN}`}}
    );

    const data = await resp.json();

    const serverStatus = data.data.attributes.status;
    const onlinePlayers = new Set(data.included.map(player => player.attributes.name));

    return {
        serverStatus,
        onlinePlayers
    }
}

export async function getClips(userName: string) {
    if(!twitchUserIds[userName]) {
        const user = await twitchClient.helix.users.getUserByName(userName)
        if (!user) {
            return [];
        }

        twitchUserIds[userName] = user.id;
    }

    const RFC_FORMAT = 'YYYY-MM-DDTHH:mm:ssZ';

    const request = twitchClient.helix.clips.getClipsForBroadcasterPaginated(twitchUserIds[userName], {
        startDate: dayjs('2021-01-15').format(RFC_FORMAT),
        endDate: dayjs().format(RFC_FORMAT),
        limit: 100
    })

    let page: HelixClip[];
    const result: Clip[] = [];

    while ((page = await request.getNext()).length) {
        let rustClips = page.filter((clip) => parseInt(clip.gameId) == RUST_GAME_ID).map((clip): Clip => {
            return {
                id: clip.id,
                url: clip.url,
                creationDate: dayjs(clip.creationDate).format(),
                creatorDisplayName: clip.creatorDisplayName,
                thumbnailUrl: clip.thumbnailUrl,
                title: clip.title,
                views: clip.views
            };
        });

        result.push(...rustClips);
    }

    return result.filter((elem, index, self) => self.findIndex(
        (t) => {
            return (t.id === elem.id)
        }) === index);
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
    const {onlinePlayers, serverStatus} = await getRustData();
    const rawTeams = await getTeams();

    const onlineStreams = rawTeams
        .flatMap(team => team.members)
        .filter(member => onlinePlayers.has(member.game))
        .map(member => member.twitch)

    if (onlineStreams.length === 0) return {
        teams: rawTeams.map(team => ({name: team.name, online: [], offline: team.members})),
        totalViewers: 0,
        serverStatus: serverStatus
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
        totalViewers,
        serverStatus
    }
}

async function fetchLiveClipData(streamer) {
    const clips = await getClips(streamer);

    return clips;
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

export async function fetchClipData(streamer) {
    const key = `FetchClipDataResponse${streamer}`;
    const value = cacheData.get(key);
    if (value) {
        return value;
    }

    const data = await fetchLiveClipData(streamer);
    cacheData.put(key, data, 600 * 1000);
    return data;
}

