import {SortedTeam} from "../types/team";
import classNames from 'classnames';
import TeamMemberList from "./TeamMemberList";

import styles from '../styles/TeamsList.module.css';


type Props = {
    team: SortedTeam
}

const TeamCard: React.FunctionComponent<Props> = ({team}) => {
    const onlineTwitchNames = team.online.map(member => member.twitch);
    const showMultitwitch = onlineTwitchNames.length > 1;

    return (
        <div className={classNames("default_border p-4 md:p-8 transition duration-500 ease-in-out transform-gpu relative hover:scale-103 hover:shadow-2xl", styles.teams_list__card)}>
            <span className="text-2xl">{team.name}</span>
            <a className={classNames("absolute bottom-2 right-2 opacity-0 transition-opacity duration-200", {'opacity-100': showMultitwitch})} href={`https://multitwitch.tv/${onlineTwitchNames.join('/')}`}>
                Multitwitch
            </a>
            <TeamMemberList online={team.online} offline={team.offline} />
        </div>
    )
};

export default TeamCard;
