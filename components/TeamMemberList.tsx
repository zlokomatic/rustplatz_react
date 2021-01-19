import {Streamer} from "../types/streamer";
import TeamMember from "./TeamMember";
import classNames from 'classnames';

import styles from '../styles/TeamMemberList.module.css';
import {useEffect, useState} from "react";

type Props = {
    online: Streamer[],
    offline: Streamer[]
};

const TeamMemberList: React.FunctionComponent<Props> = ({online, offline}) => {
    const createTeamMember = (streamer) => <TeamMember streamer={streamer} key={`teammember-${streamer.displayed}`}/>;
    const [showOnline, setShowOnline] = useState(true);
    const [showOffline, setShowOffline] = useState(true);
    const [last, setLast] = useState({
        showOnline,
        showOffline
    });

    useEffect(() => {
        setShowOffline(offline.length !== 0);
        setShowOnline(online.length !== 0);

        if(showOnline != last.showOnline || showOffline !== last.showOffline) {
            setLast({
                showOnline,
                showOffline
            });
        }
    })

    return (
        <>
            {
                online.length > 0 &&
                <>
                    <span className={classNames("text-green-400", styles.separator)} data-was-shown={last.showOnline} data-show={showOnline}>
                      Live
                    </span>
                    {
                        online.map((streamer) => createTeamMember(streamer))
                    }
                </>
            }
            {
                offline.length > 0 &&
                <>
                    <span className={classNames("text-red-400", styles.separator)} data-was-shown={last.showOffline} data-show={showOffline}>
                      Offline
                    </span>
                    {
                        offline.map((streamer) => createTeamMember(streamer))
                    }
                </>
            }
        </>
    )
}

export default TeamMemberList;
