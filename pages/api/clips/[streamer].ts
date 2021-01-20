import type { NextApiRequest, NextApiResponse } from 'next'
import {fetchClipData, getClips} from "../../../service/dataFetcher";
import {Clip} from "../../../types/clip";

export const config = { api: { bodyParser: false } }

export default async (req: NextApiRequest, res: NextApiResponse<Clip[]>) => {

    const {
        query: { streamer },
    } = req

    const data = await fetchClipData(streamer as string);

    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(data))
}
