import {SortedTeam} from "../types/team";
import TeamCard from "./TeamCard";
import React from "react";
import classNames from 'classnames';

type Props = {
    teams: SortedTeam[]
}

const TeamsList: React.FunctionComponent<Props> = ({teams}) => (
    <div className={classNames("grid grid-cols-1 md:grid-cols-4 gap-4")}>
        {
            teams.map((team, index) => <TeamCard team={team} key={`team-${team.name}-${index}`}/>)
        }
    </div>
);

export default TeamsList;
