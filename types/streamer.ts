export type SimpleStreamer = string;

export type CustomStreamer = {
    twitch: string;
    game: string;
    displayed: string;
};

export type Streamer = CustomStreamer;
export type ApiStreamer = CustomStreamer | SimpleStreamer

export function isCustomStreamer(streamer: ApiStreamer): streamer is CustomStreamer {
    return typeof streamer === 'object';
}

export function isSimpleStreamer(streamer: ApiStreamer): streamer is SimpleStreamer {
    return typeof streamer !== 'object';
}

