import {GetStaticProps, NextPage} from "next";
import classNames from 'classnames';
import ProjectLogo from "../components/ProjectLogo";
import TeamsList from "../components/TeamsList";
import {fetchData} from "../service/dataFetcher";
import {FetchDataResponse} from "../types/response";
import useSWR from "swr";
import {CSSTransition} from 'react-transition-group';

import styles from '../styles/index.module.css'
import {useEffect, useState} from "react";


const IndexPage: NextPage<FetchDataResponse> = (props) => {
    const {data, error} = useSWR<FetchDataResponse>('/api/teams', fetcher, {
        initialData: props
    })

    const [inProp, setInProp] = useState(false);

    const {teams, totalViewers, serverStatus} = data;
    const showViewers = totalViewers > 1000;

    useEffect(() => {
        setInProp(showViewers);
    });

    return (
        <>
            <header className="pt-10 px-8">
                <ProjectLogo/>
                <div className="text-2xl text-center mt-5 md:mt-10">
                    Rust-Streamerserver von Bonjwa, RocketBeans und Dhalucard
                </div>
                <div className="text-center mt-4 text-base">
                    Diese Seite basiert auf dem original von <a href="https://twitter.com/moritz_ruth">@moritz_ruth</a>
                </div>
            </header>
            <main className="p-5 text-lg space-y-8">
                {
                    showViewers &&
                    <CSSTransition in={inProp} timeout={200} classNames={"slide-y"}>
                      <div className={classNames("mt-5 max-w-full overflow-hidden slide-y", styles.app__viewers_container)}>
                        <div className={classNames("max-w-sm h-full mx-auto default_border p-5 text-center")}>
                          <span className="font-bold text-3xl block mt-1">total viewers</span>
                          <span className="block text-5xl text-green-400 mt-6">{totalViewers}</span>
                        </div>
                      </div>
                    </CSSTransition>
                }
                <section className="max-w-7xl w-full mx-auto">
                    <h1 className="heading">Informationen</h1>
                    <ul className="pl-4">
                        <li>Der Server ist täglich von 15 Uhr bis 3 Uhr (morgens) online.</li>
                        <li>Andere Spieler zu töten ist nur mit Role-Play erlaubt, <b>außer</b> in den sog. KOS-Zonen.</li>
                        <li>Um mitspielen zu können, muss ein Streamer von einem der Teilnehmer eingeladen werden.</li>
                        <li>Es gibt keinen Global Text-Chat, dafür Team Text-Chat und In-Game Voice-Chat.</li>
                        <li>Teams umfassen maximal 6 Personen.</li>
                        <li>Der Server wird monatlich zurückgesetzt (bedingt durch Updates).</li>
                    </ul>
                </section>
                {
                    serverStatus === 'offline' &&
                    <section className="max-w-7xl w-full mx-auto text-center">
                        <p className="text-5xl text-red-400">Server ist offline!</p>
                    </section>
                }
                <section>
                    <div className="max-w-7xl w-full mx-auto">
                        <h1 className="heading">Teams</h1>
                    </div>
                    {
                        teams === null &&
                        <div className="text-2xl max-w-7xl w-full mx-auto">
                          Lädt...
                        </div>
                    }
                    {
                        teams !== null &&
                        <div className="md:p-2">
                          <TeamsList teams={teams}/>
                        </div>
                    }
                    <p className="mt-5 max-w-7xl w-full mx-auto">
                        Aktualisiert sich alle 60 Sekunden automatisch.
                    </p>
                </section>
            </main>
            <footer className="flex flex-col text-center px-4 py-2">
                <span>Inoffizielle Seite.</span>
                <a href="https://github.com/zlokomatic/rustplatz_react">Source Code</a>
            </footer>
        </>);
};

const fetcher = url => fetch(url).then(r => r.json())

export const getStaticProps: GetStaticProps = async (context) => {
    const data = await fetchData();

    return {
        props: data,
        revalidate: 10
    }
}

export default IndexPage;


