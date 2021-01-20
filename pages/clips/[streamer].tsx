import {GetStaticPaths, GetStaticProps, NextPage} from "next";
import {Clip} from "../../types/clip";
import {fetchClipData} from "../../service/dataFetcher";
import classNames from 'classnames';
import dayjs from "dayjs";
import Image from 'next/image';
import StreamerClip from "../../components/StreamerClip";

type Props = {
    streamer: string,
    clips: Clip[]
};

const ClipsPage: NextPage<Props> = (props) => {
    const {clips, streamer} = props;

    const clipElements = clips.map((clip) => {
        return (
            <StreamerClip clip={clip} key={clip.id}/>
        )
    });

    return (
        <>
            <main className="p-5 text-lg">
                <section className="max-w-7xl w-full mx-auto text-center">
                    <h1 className="heading">Clips von {streamer}</h1>
                </section>
                <section className={classNames('grid grid-cols-1 md:grid-cols-4 gap-4')}>
                    {
                        clipElements
                    }
                </section>
            </main>
        </>
    )
};


export const getStaticProps: GetStaticProps = async (context) => {
    let streamer = context.params?.streamer as string || null;

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
    return {
        paths: [],
        fallback: 'blocking'
    };
};

export default ClipsPage;
