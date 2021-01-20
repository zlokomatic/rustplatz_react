import {Streamer} from "../types/streamer";
import Link from "next/link";

type Props = {
    streamer: Streamer
};

const TeamMember: React.FunctionComponent<Props> = ({streamer}) => {
    return (
        <span className={'flex space-x-1 group justify-between'}>
        <a className="text-gray-200 flex space-x-1 group" href={`https://twitch.tv/${streamer.twitch}`} target="_blank" rel="noopener noreferrer">
            <span>{streamer.displayed}</span>
            <svg strokeWidth="4" className="w-3.5 h-3.5 fill-current opacity-0 transition-opacity duration-200 group-hover:opacity-100" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                {/* Font Awesome Free 5.15.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) */}
                <path d="M432,320H400a16,16,0,0,0-16,16V448H64V128H208a16,16,0,0,0,16-16V80a16,16,0,0,0-16-16H48A48,48,0,0,0,0,112V464a48,48,0,0,0,48,48H400a48,48,0,0,0,48-48V336A16,16,0,0,0,432,320ZM488,0h-128c-21.37,0-32.05,25.91-17,41l35.73,35.73L135,320.37a24,24,0,0,0,0,34L157.67,377a24,24,0,0,0,34,0L435.28,133.32,471,169c15,15,41,4.5,41-17V24A24,24,0,0,0,488,0Z"/>
            </svg>
        </a>
        <Link href={`/clips/${streamer.displayed}`}>
            <a className={'text-gray-200'}>(Clips)</a>
        </Link>
        </span>
    )
}

export default TeamMember;
