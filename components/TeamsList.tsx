import {SortedTeam} from "../types/team";
import TeamCard from "./TeamCard";
import React from "react";
import classNames from 'classnames';

import styles from '../styles/TeamsList.module.css';

type Props = {
    teams: SortedTeam[]
}

const TeamsList: React.FunctionComponent<Props> = ({teams}) => (
    <div className={classNames("space-y-8", styles.teams_list)}>
        {
            teams.map((team, index) => <TeamCard team={team} key={`team-${team.name}-${index}`}/>)
        }
    </div>
);

export default TeamsList;
