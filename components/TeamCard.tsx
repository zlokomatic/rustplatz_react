import {SortedTeam} from "../types/team";
import classNames from 'classnames';
import TeamMemberList from "./TeamMemberList";

import styles from '../styles/TeamCard.module.css';

type Props = {
    team: SortedTeam
}

const TeamCard: React.FunctionComponent<Props> = ({team}) => {
    const onlineTwitchNames = team.online.map(member => member.twitch);
    const showMultitwitch = onlineTwitchNames.length > 1;

    return (
        <div className={classNames("default_border p-4 transition duration-500 ease-in-out transform-gpu hover:scale-103 hover:shadow-2xl text-2xl space-y-8 md:space-y-2", styles.teams_list__card)}>
            <span>{team.name}</span>
            <TeamMemberList online={team.online} offline={team.offline}/>
            {
                showMultitwitch &&
                <div className={"mt-2 text-center"}>
                  <a className={classNames("opacity-0 transition-opacity duration-200", {'opacity-100': showMultitwitch})} href={`https://multitwitch.tv/${onlineTwitchNames.join('/')}`}>
                    Multitwitch
                  </a>
                </div>
            }

        </div>
    )
};

export default TeamCard;
