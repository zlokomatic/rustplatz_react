import type { NextApiRequest, NextApiResponse } from 'next'
import {fetchData} from "../../service/dataFetcher";
import {FetchDataResponse} from "../../types/response";


export const config = { api: { bodyParser: false } }

export default async (req: NextApiRequest, res: NextApiResponse<FetchDataResponse>) => {

    const data = await fetchData();

    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(data))
}
