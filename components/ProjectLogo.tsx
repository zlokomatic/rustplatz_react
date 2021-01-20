import styles from '../styles/ProjectLogo.module.css'
import classNames from 'classnames';
import Image from "next/image";

const ProjectLogo: React.FunctionComponent = () => (
    <div className={classNames("flex justify-center items-center flex-col md:flex-row md:space-x-7 mx-auto", styles.project_logo)} aria-label="Rust-Platz">
        <div className="flex-grow">
            <div className={"flex justify-end"}>
                <Image width={400} height={96} className={classNames("ml-auto", styles.project_logo__rustLogo)} src="/images/rust.svg" alt="Logo von Rust" />
            </div>
        </div>
        <div className={classNames("h-3 mt-3 -mb-5 md:m-0 md:h-40", styles.project_logo__separator)}/>
        <div className="flex-grow font-bold uppercase">
            Platz
        </div>
    </div>
);

export default ProjectLogo;
