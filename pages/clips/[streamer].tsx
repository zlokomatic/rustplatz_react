import {GetStaticPaths, GetStaticProps, NextPage} from "next";
import {Clip} from "../../types/clip";
import {fetchClipData, fetchData} from "../../service/dataFetcher";
import classNames from 'classnames';
import StreamerClip from "../../components/StreamerClip";
import {useRouter} from "next/router";
import Loader from "../../components/Loader";

type Props = {
    streamer: string,
    clips: Clip[]
};

const ClipsPage: NextPage<Props> = (props) => {
    const router = useRouter()

    if (router.isFallback) {
        return (<Loader/>);
    }


    const {clips, streamer} = props;

    const clipElements = clips.map((clip) => {
        return (
            <StreamerClip clip={clip} key={clip.id}/>
        )
    });

    return (
        <>
            <section className="max-w-7xl w-full mx-auto text-center">
                <h1 className="heading">Clips von {streamer}</h1>
            </section>
            <section className={classNames('grid grid-cols-1 md:grid-cols-4 gap-4')}>
                {
                    clipElements
                }
            </section>
        </>
    )
};


export const getStaticProps: GetStaticProps = async (context) => {
    let streamer = context.params?.streamer as string;

    const data = await fetchClipData(streamer);

    return {
        props: {
            streamer,
            clips: data,
        },
        revalidate: 600
    }
}

export const getStaticPaths: GetStaticPaths = async () => {
    const data = await fetchData();

    const streamers = data.teams
        .flatMap(team => [...team.online, ...team.offline].map((streamer) => streamer.twitch));

    return {
        paths: streamers.map((streamer) => {
            return {
                params: {
                    streamer
                }
            }
        }),
        fallback: true
    };
};

export default ClipsPage;
