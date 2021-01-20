import Image from "next/image";
import dayjs from "dayjs";
import {Clip} from "../types/clip";

type Props = {
    clip: Clip
};

const StreamerClip: React.FunctionComponent<Props> = ({clip}) => (
    <div className={'default_border p-2 text-center flex flex-wrap justify-center'}>
        <a href={clip.url} target="_blank" rel="noopener noreferrer">
            <Image width={480} height={272} className={'mb-4'} src={clip.thumbnailUrl}/>
            <p className={'mb-4'}>{clip.title}</p>
        </a>
        <span className={'text-sm font-thin'}>am { dayjs(clip.creationDate).format('DD.MM.YY') } von {clip.creatorDisplayName}</span>
    </div>
)

export default StreamerClip;
